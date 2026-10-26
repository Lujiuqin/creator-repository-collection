import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { fetchWechatArticle, cleanWechatHtml, isWechatArticleUrl } from '@/lib/wechat-article';
import { AI_MODELS, type AIModelKey } from '@/lib/openrouter';

// 流式响应的改写任务处理 V2 - 修复SSE问题
export async function POST(request: NextRequest) {
  // 先解析请求体（必须在创建流之前）
  const body = await request.json();
  const { taskId, contentId, aiModel, promptTemplate } = body;
  
  console.log('[流式改写V2] 接收请求:', { taskId, contentId, aiModel });
  
  const encoder = new TextEncoder();
  
  // 创建响应流
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: any) => {
        const message = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(message));
        console.log('[SSE发送]', event.type, event.message || '');
      };
      
      try {
        sendEvent({ type: 'start', message: '开始处理任务...' });
        
        // 创建Supabase客户端
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey || anonKey,
          {
            cookies: {
              getAll() { return []; },
              setAll() {},
            },
          }
        );
        
        // 更新任务状态
        await supabase
          .from('rewrite_tasks')
          .update({
            status: 'processing',
            started_at: new Date().toISOString()
          })
          .eq('id', taskId);
        
        sendEvent({ type: 'status', status: 'processing', message: '正在处理...' });
        
        // 获取内容
        const { data: content, error: contentError } = await supabase
          .from('contents')
          .select('id, title, original_url')
          .eq('id', contentId)
          .single();
        
        if (contentError || !content) {
          throw new Error('内容不存在');
        }
        
        sendEvent({ type: 'progress', message: '正在获取原文内容...' });
        
        // 获取原文
        let originalTitle = '';
        let originalHtml = '';
        
        // 检查缓存
        const { data: cached } = await supabase
          .from('content_originals')
          .select('original_title, original_html')
          .eq('content_id', contentId)
          .single();
        
        if (cached) {
          originalTitle = cached.original_title;
          originalHtml = cached.original_html;
          sendEvent({ type: 'progress', message: '使用缓存的原文' });
        } else if (content.original_url && isWechatArticleUrl(content.original_url)) {
          sendEvent({ type: 'progress', message: '正在获取微信文章...' });
          const article = await fetchWechatArticle(content.original_url);
          originalTitle = article.title;
          originalHtml = cleanWechatHtml(article.html);
          
          // 缓存原文
          await supabase
            .from('content_originals')
            .insert({
              content_id: contentId,
              original_title: originalTitle,
              original_html: originalHtml,
              original_author: article.author,
              source_url: content.original_url
            });
        } else {
          throw new Error('缺少有效的原文链接');
        }
        
        sendEvent({ type: 'progress', message: '正在调用AI进行改写...' });
        
        // 调用OpenRouter API
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error('OpenRouter API key not configured');
        
        const modelId = AI_MODELS[aiModel as AIModelKey] || aiModel;
        const prompt = promptTemplate
          .replace('{{title}}', originalTitle)
          .replace('{{content}}', originalHtml);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Artive Help'
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              {
                role: 'system',
                content: '你是专业的内容创作者。返回JSON格式：{"title":"标题","content":"HTML内容"}'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            stream: true // 启用OpenRouter的流式响应
          })
        });
        
        if (!response.ok) {
          throw new Error(`OpenRouter API失败: ${response.status}`);
        }
        
        // 处理流式响应
        const reader = response.body?.getReader();
        if (!reader) throw new Error('无法获取响应流');
        
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        let result = { title: '', content: '' };
        let isCollectingContent = false;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  fullContent += content;
                  
                  // 尝试解析当前内容
                  if (fullContent.includes('{') && fullContent.includes('}')) {
                    try {
                      const match = fullContent.match(/\{[\s\S]*\}/);
                      if (match) {
                        const parsed = JSON.parse(match[0]);
                        if (parsed.title) result.title = parsed.title;
                        if (parsed.content) {
                          result.content = parsed.content;
                          // 发送内容事件
                          sendEvent({ 
                            type: 'content',
                            content: result.content.substring(0, 100) + '...'
                          });
                        }
                      }
                    } catch (e) {
                      // JSON未完成，继续累积
                    }
                  }
                }
              } catch (e) {
                console.error('解析流式数据失败:', e);
              }
            }
          }
        }
        
        // 最终解析
        if (!result.title || !result.content) {
          try {
            const match = fullContent.match(/\{[\s\S]*\}/);
            if (match) {
              result = JSON.parse(match[0]);
            }
          } catch (e) {
            console.error('最终解析失败:', e);
            throw new Error('AI响应格式错误');
          }
        }
        
        if (!result || !result.title || !result.content) {
          throw new Error('AI响应格式错误');
        }
        
        sendEvent({ type: 'progress', message: '正在保存结果...' });
        
        // 查询版本号
        const { data: existingResults } = await supabase
          .from('rewrite_results')
          .select('version')
          .eq('task_id', taskId)
          .order('version', { ascending: false })
          .limit(1);
        
        const nextVersion = existingResults && existingResults.length > 0 
          ? existingResults[0].version + 1 
          : 1;
        
        // 保存结果
        const { data: savedResult, error: saveError } = await supabase
          .from('rewrite_results')
          .insert({
            task_id: taskId,
            version: nextVersion,
            title: result.title,
            content_html: result.content,
            content_text: result.content.replace(/<[^>]*>/g, ' ').trim()
          })
          .select()
          .single();
        
        if (saveError) throw saveError;
        
        // 更新任务状态
        await supabase
          .from('rewrite_tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', taskId);
        
        sendEvent({ 
          type: 'complete',
          status: 'completed',
          result: savedResult
        });
        
        console.log('[流式改写V2] 任务完成');
        
      } catch (error) {
        console.error('[流式改写V2] 错误:', error);
        
        // 更新失败状态
        try {
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
          
          const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceKey || anonKey,
            {
              cookies: {
                getAll() { return []; },
                setAll() {},
              },
            }
          );
          
          await supabase
            .from('rewrite_tasks')
            .update({
              status: 'failed',
              error_message: error instanceof Error ? error.message : '未知错误',
              completed_at: new Date().toISOString()
            })
            .eq('id', taskId);
        } catch (e) {
          console.error('更新失败状态失败:', e);
        }
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'error',
          status: 'failed',
          error: error instanceof Error ? error.message : '未知错误'
        })}\n\n`));
      } finally {
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}