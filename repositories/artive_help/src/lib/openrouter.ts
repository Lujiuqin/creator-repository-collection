// OpenRouter API 调用服务
// 文档：https://openrouter.ai/docs/quickstart

// 支持的AI模型映射
export const AI_MODELS = {
  'claude-4': 'anthropic/claude-3.5-sonnet-20241022', // Claude 3.5 Sonnet最新版
  'gpt-5': 'openai/gpt-4o', // GPT-4o (最新版)
  'gemini-pro': 'google/gemini-pro-1.5-latest' // Gemini Pro 1.5最新版
} as const;

// 模型显示名称
export const MODEL_DISPLAY_NAMES = {
  'claude-4': 'Claude 3.5 Sonnet',
  'gpt-5': 'GPT-4o', 
  'gemini-pro': 'Gemini Pro 1.5'
} as const;

export type AIModelKey = keyof typeof AI_MODELS;

// OpenRouter API 配置
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 改写请求参数
export interface RewriteRequest {
  content: string; // 原文内容
  title: string; // 原文标题
  model: AIModelKey; // 使用的模型
  prompt?: string; // 自定义提示词（可选）
}

// 改写响应
export interface RewriteResponse {
  title: string; // 改写后的标题
  content: string; // 改写后的内容
  model: string; // 使用的模型
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 默认提示词模板
const DEFAULT_PROMPT = `你是一个专业的内容创作者。请改写以下文章。

改写要求：
- 保持原文的核心信息和观点
- 使用更生动、更有吸引力的表达方式
- 确保文章节奏紧凑，每段不超过3-4句话
- 标题要有强烈的点击欲望
- 内容使用HTML格式（<p>段落、<h2>小标题、<strong>强调等）

重要：你必须严格按照以下JSON格式返回，不要有任何其他内容或字段：
{
  "title": "改写后的标题",
  "content": "改写后的HTML格式内容"
}

原文标题：{{title}}
原文内容：{{content}}`;

/**
 * 调用OpenRouter API进行文章改写
 */
export async function rewriteWithAI(request: RewriteRequest): Promise<RewriteResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const modelId = AI_MODELS[request.model];
  if (!modelId) {
    throw new Error(`Invalid model: ${request.model}`);
  }

  // 构建提示词
  const prompt = (request.prompt || DEFAULT_PROMPT)
    .replace('{{title}}', request.title)
    .replace('{{content}}', request.content);

  try {
    // 调用OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', // 你的网站URL
        'X-Title': 'Artive Help' // 你的应用名称
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的内容创作者。无论原文内容如何，都必须返回JSON格式的结果。如果原文内容不足，也要尽力创作并返回有效的JSON。不要返回任何说明性文字，只返回JSON。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // 控制创造性，0.7比较平衡
        max_tokens: 4000, // 最大输出token数
        response_format: { type: "json_object" } // 强制JSON格式输出
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // 解析AI返回的内容
    const aiResponse = data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI model');
    }

    // 调试：打印AI原始响应
    console.log('[OpenRouter] AI原始响应:', aiResponse);
    
    // 尝试解析JSON响应
    let result;
    try {
      result = JSON.parse(aiResponse);
      console.log('[OpenRouter] 成功解析JSON:', result);
    } catch (e) {
      console.error('[OpenRouter] 解析JSON失败，尝试提取JSON:', e);
      
      // 尝试从响应中提取JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);  
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
          console.log('[OpenRouter] 从响应中提取并解析JSON成功:', result);
        } catch (e2) {
          console.error('[OpenRouter] 提取JSON失败，使用默认值:', e2);
          // 实在解析不了，使用默认值
          result = {
            title: request.title + ' (改写版)',
            content: `<p>${request.title}</p><p>由于原文内容不足，无法进行有效改写。请提供完整的文章内容。</p>`
          };
        }
      } else {
        console.error('[OpenRouter] 响应中没有找到JSON，使用默认值');
        // 没有找到JSON，使用默认值
        result = {
          title: request.title + ' (改写版)',
          content: `<p>${request.title}</p><p>由于原文内容不足，无法进行有效改写。请提供完整的文章内容。</p>`
        };
      }
    }

    const finalResult = {
      title: result.title || request.title,
      content: result.content || aiResponse,
      model: request.model,
      usage: data.usage
    };
    
    console.log('[OpenRouter] 最终返回结果:', {
      title: finalResult.title,
      contentLength: finalResult.content.length,
      model: finalResult.model
    });
    
    return finalResult;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

/**
 * 批量改写文章
 * @param articles 文章列表
 * @param model AI模型
 * @param onProgress 进度回调
 */
export async function batchRewrite(
  articles: Array<{ id: string; title: string; content: string }>,
  model: AIModelKey,
  onProgress?: (current: number, total: number, articleId: string) => void
): Promise<Map<string, RewriteResponse | Error>> {
  const results = new Map<string, RewriteResponse | Error>();
  
  // 按顺序处理每篇文章（避免并发过多导致限流）
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    
    try {
      // 通知进度
      if (onProgress) {
        onProgress(i + 1, articles.length, article.id);
      }
      
      // 调用改写API
      const result = await rewriteWithAI({
        content: article.content,
        title: article.title,
        model
      });
      
      results.set(article.id, result);
      
      // 添加延迟避免触发限流（1秒间隔）
      if (i < articles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to rewrite article ${article.id}:`, error);
      results.set(article.id, error as Error);
    }
  }
  
  return results;
}

/**
 * 验证OpenRouter API Key是否有效
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}