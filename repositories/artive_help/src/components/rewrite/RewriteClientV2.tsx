"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppLocale } from "@/i18n/locales";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import { MODEL_DISPLAY_NAMES } from "@/lib/openrouter";

// 从API获取的素材类型
type Material = {
  id: string;
  title: string;
  source: string;
  collectedAt: string;
  cover?: string;
  url?: string;
};

// 改写任务类型
type RewriteTask = {
  id: string;
  user_id: string;
  content_id: string;
  ai_model: string;
  prompt_template: string;
  status: "pending" | "processing" | "completed" | "failed";
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  rewrite_results?: RewriteResult[];
};

// 改写结果类型
type RewriteResult = {
  id: string;
  task_id: string;
  version: number;
  title: string;
  content_html: string;
  content_text?: string;
  is_edited: boolean;
  edited_content_html?: string;
  created_at: string;
  updated_at: string;
};

// 原文内容类型
type OriginalContent = {
  title: string;
  html: string;
  loading: boolean;
  error?: string;
};

const ALLOWED_TAGS = new Set(["p","br","strong","em","u","s","a","ul","ol","li","blockquote","hr","h1","h2","h3","img"]);
const FORBIDDEN_TAGS = new Set(["style","script","iframe","table","span"]);

function sanitizeHtmlForWeChat(html: string): string {
  if (typeof window === "undefined") return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const walker = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (FORBIDDEN_TAGS.has(tag) || !ALLOWED_TAGS.has(tag)) {
          const parent = el.parentNode;
          while (el.firstChild) parent?.insertBefore(el.firstChild, el);
          parent?.removeChild(el);
          return;
        }
        el.removeAttribute("style");
        Array.from(el.attributes).forEach(attr => {
          const name = attr.name.toLowerCase();
          if (name.startsWith("on") || name === "class") el.removeAttribute(name);
          if (el.tagName.toLowerCase() === "a" && name !== "href") {
            if (name !== "href") el.removeAttribute(name);
          }
          if (el.tagName.toLowerCase() === "img" && !(name === "src" || name === "alt" || name === "title")) {
            el.removeAttribute(name);
          }
        });
        if (el.tagName.toLowerCase() === "a") {
          (el as HTMLAnchorElement).target = "_blank";
          (el as HTMLAnchorElement).rel = "noopener";
        }
        if (/^h[4-6]$/i.test(el.tagName)) {
          const p = doc.createElement("p");
          p.innerHTML = el.innerHTML;
          el.replaceWith(p);
        }
      }
      Array.from(node.childNodes).forEach(walker);
    };
    Array.from(doc.body.childNodes).forEach(walker);
    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

function validateWeChatHtml(html: string): { pass: boolean; issues: string[] } {
  if (typeof window === "undefined") return { pass: true, issues: [] };
  const issues: string[] = [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const all = doc.body.querySelectorAll("*");
  all.forEach(el => {
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) issues.push(`不允许的标签: <${tag}>`);
    if ((el as HTMLElement).getAttribute("style")) issues.push("存在内联样式");
  });
  return { pass: issues.length === 0, issues };
}

function useLocalStorage<T>(key: string, initial: T) {
  // 初始化时始终使用默认值，避免 SSR 不匹配
  const [value, setValue] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // 在客户端 hydration 后从 localStorage 读取
  useEffect(() => {
    setIsHydrated(true);
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setValue(JSON.parse(raw) as T);
      } catch (e) {
        console.error(`Failed to parse localStorage key "${key}":`, e);
      }
    }
  }, [key]);
  
  // 只在 hydration 后且值改变时写入 localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, isHydrated]);
  
  return [value, setValue] as const;
}

export default function RewriteClient({ locale, messages, initialIds }: { locale: AppLocale; messages: any; initialIds: string[] }) {
  const { push } = useToast();
  
  // 左栏宽度与中/右分栏比例
  const [leftWidth, setLeftWidth] = useLocalStorage<number>("rw:leftWidth", 280);
  const [splitRatio, setSplitRatio] = useLocalStorage<number>("rw:splitRatio", 0.5);
  const draggingLeftRef = useRef(false);
  const draggingSplitRef = useRef(false);
  
  // 数据状态
  const [materials, setMaterials] = useState<Material[]>([]);
  const [tasks, setTasks] = useState<Map<string, RewriteTask>>(new Map()); // contentId -> task
  const [originalContents, setOriginalContents] = useState<Map<string, OriginalContent>>(new Map()); // contentId -> original
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [streamingContent, setStreamingContent] = useState<Map<string, string>>(new Map()); // contentId -> 流式内容
  
  // 当前选中的素材和改写
  const [currentMaterialId, setCurrentMaterialId] = useState<string>("");
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);
  
  // 跟踪正在处理的任务，防止重复执行
  const processingTasksRef = useRef<Set<string>>(new Set());
  
  // 测试SSE连接
  const testSSE = async () => {
    console.log('[测试SSE] 开始测试...');
    try {
      const response = await fetch('/api/rewrite/test-stream');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        console.error('[测试SSE] 无法获取reader');
        return;
      }
      
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const event = JSON.parse(data);
              console.log('[测试SSE] 收到事件:', event);
            } catch (e) {
              console.error('[测试SSE] 解析失败:', e);
            }
          }
        }
      }
      console.log('[测试SSE] 测试完成');
    } catch (error) {
      console.error('[测试SSE] 测试失败:', error);
    }
  };
  
  // 处理流式响应（定义在useEffect之前，以便在初始化时使用）
  const handleStreamResponse = useCallback(async (taskId: string, contentId: string, aiModel: string, promptTemplate: string) => {
    // 防止重复执行
    if (processingTasksRef.current.has(taskId)) {
      console.log('[handleStreamResponse] 任务已在处理中，跳过:', taskId);
      return;
    }
    
    processingTasksRef.current.add(taskId);
    console.log('[handleStreamResponse] 开始处理流式响应', { taskId, contentId, aiModel });
    
    try {
      // 使用新的V2 API，解决SSE问题
      const response = await fetch('/api/rewrite/stream/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          contentId,
          aiModel,
          promptTemplate
        })
      });

      console.log('[handleStreamResponse] 响应状态:', response.status, response.headers.get('content-type'));
      
      if (!response.ok) throw new Error(`流式请求失败: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法获取响应流');

      const decoder = new TextDecoder();
      let buffer = '';
      let eventCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('[handleStreamResponse] 流结束，共处理事件:', eventCount);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        console.log('[handleStreamResponse] 收到数据块，长度:', chunk.length);
        
        const lines = buffer.split('\n');
        
        // 保留最后一个不完整的行
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (!data || data === '[DONE]') continue;
            
            try {
              const event = JSON.parse(data);
              eventCount++;
              console.log('[流式事件]', eventCount, event);
              
              switch (event.type) {
                case 'start':
                case 'progress':
                  push(event.message, "info");
                  break;
                  
                case 'status':
                  // 更新任务状态
                  setTasks(prev => {
                    const newMap = new Map(prev);
                    const task = newMap.get(contentId);
                    if (task) {
                      task.status = event.status;
                      newMap.set(contentId, { ...task });
                    }
                    return newMap;
                  });
                  break;
                  
                case 'content':
                  // 实时显示AI生成的内容
                  console.log('[AI生成]', event.content);
                  // 更新流式内容
                  setStreamingContent(prev => {
                    const newMap = new Map(prev);
                    newMap.set(contentId, event.content);
                    return newMap;
                  });
                  break;
                  
                case 'complete':
                  // 任务完成，更新结果
                  console.log('[流式完成事件]', {
                    contentId,
                    hasResult: !!event.result,
                    result: event.result
                  });
                  
                  push("改写完成！", "success");
                  
                  // 清除流式内容
                  setStreamingContent(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(contentId);
                    return newMap;
                  });
                  
                  setTasks(prev => {
                    const newMap = new Map(prev);
                    const task = newMap.get(contentId);
                    if (task) {
                      console.log('[更新任务前]', {
                        oldStatus: task.status,
                        oldResultsCount: task.rewrite_results?.length || 0
                      });
                      
                      task.status = 'completed';
                      task.completed_at = new Date().toISOString();
                      
                      if (event.result) {
                        // 确保rewrite_results是数组
                        if (!task.rewrite_results) {
                          task.rewrite_results = [];
                        }
                        task.rewrite_results = [...task.rewrite_results, event.result];
                        console.log('[添加结果后]', {
                          newResultsCount: task.rewrite_results.length,
                          newResult: event.result
                        });
                      }
                      
                      newMap.set(contentId, { ...task });
                      console.log('[更新任务后]', {
                        newStatus: task.status,
                        newResultsCount: task.rewrite_results?.length || 0
                      });
                    } else {
                      console.error('[流式完成] 未找到对应的任务:', contentId);
                    }
                    return newMap;
                  });
                  break;
                  
                case 'error':
                  push(`改写失败: ${event.error}`, "error");
                  setTasks(prev => {
                    const newMap = new Map(prev);
                    const task = newMap.get(contentId);
                    if (task) {
                      task.status = 'failed';
                      task.error_message = event.error;
                      newMap.set(contentId, { ...task });
                    }
                    return newMap;
                  });
                  break;
              }
            } catch (e) {
              console.error('解析事件失败:', e, 'Raw data:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('流式响应处理失败:', error);
      push("处理流式响应失败", "error");
    } finally {
      // 处理完成后，从处理中的任务集合中移除
      processingTasksRef.current.delete(taskId);
      console.log('[handleStreamResponse] 任务处理完成，移除:', taskId);
    }
  }, [push]);

  // 获取素材列表
  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      if (!mounted) return;
      
      try {
        setLoading(true);
        
        // 获取素材列表
        const matsRes = await fetch('/api/materials');
        if (!matsRes.ok) throw new Error('获取素材失败');
        const matsData: Material[] = await matsRes.json();
        
        // 如果有初始ID，只显示这些素材
        const filteredMats = initialIds.length > 0 
          ? matsData.filter(m => initialIds.includes(m.id))
          : matsData;
        
        setMaterials(filteredMats);
        
        // 设置第一个素材为当前素材
        if (filteredMats.length > 0 && !currentMaterialId) {
          setCurrentMaterialId(filteredMats[0].id);
        }
        
        // 获取改写任务（不限制contentIds，获取所有任务）
        console.log('[初始化] 开始获取所有改写任务...');
        const tasksRes = await fetch('/api/rewrite');
        console.log('[初始化] API响应状态:', tasksRes.status);
        
        if (tasksRes.ok) {
          const tasksData: RewriteTask[] = await tasksRes.json();
          console.log('[初始化] 获取到任务数据:', {
            total: tasksData.length,
            tasks: tasksData
          });
          
          const tasksMap = new Map<string, RewriteTask>();
          const pendingTasks: RewriteTask[] = [];
          
          tasksData.forEach(task => {
            console.log('[初始化] 处理任务:', {
              content_id: task.content_id,
              status: task.status,
              has_results: !!task.rewrite_results,
              results_count: task.rewrite_results?.length || 0
            });
            tasksMap.set(task.content_id, task);
            
            // 收集待处理或处理中的任务
            if (task.status === 'pending' || task.status === 'processing') {
              pendingTasks.push(task);
            }
          });
          
          console.log('[初始化] 设置任务Map，待处理任务数:', pendingTasks.length);
          setTasks(tasksMap);
          
          // 对待处理的任务启动流式处理
          // 使用setTimeout避免React严格模式导致的重复执行
          setTimeout(() => {
            for (const task of pendingTasks) {
              console.log('[初始化] 启动流式处理:', task.id);
              handleStreamResponse(
                task.id,
                task.content_id,
                task.ai_model,
                task.prompt_template
              );
            }
          }, 100);
        } else {
          console.error('[初始化] 获取任务失败:', tasksRes.status);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        push("获取数据失败", "error");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    // 清理函数
    return () => {
      mounted = false;
    };
  }, [initialIds]);
  
  // 移除了轮询机制，改为使用流式响应
  // 流式响应会在创建任务时实时更新状态
  
  // 获取原文内容
  const fetchOriginalContent = useCallback(async (material: Material) => {
    if (!material.url) return;
    
    // 验证是否为微信文章链接
    const isWechatUrl = material.url.includes('mp.weixin.qq.com');
    if (!isWechatUrl) {
      // 不是微信链接，显示占位内容
      setOriginalContents(prev => new Map(prev).set(material.id, {
        title: material.title,
        html: '<p>暂无原文内容（非微信文章）</p>',
        loading: false
      }));
      return;
    }
    
    // 设置加载状态
    setOriginalContents(prev => {
      const existing = prev.get(material.id);
      // 如果已经有内容且不在加载中，不重复获取
      if (existing && !existing.loading && existing.html !== '<p>加载中...</p>') {
        return prev;
      }
      
      const newMap = new Map(prev);
      newMap.set(material.id, {
        title: material.title,
        html: '<p>加载中...</p>',
        loading: true
      });
      return newMap;
    });
    
    try {
      // 创建新的API路由来获取原文
      const response = await fetch('/api/article/original', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: material.url })
      });
      
      if (!response.ok) throw new Error('获取原文失败');
      
      const data = await response.json();
      
      setOriginalContents(prev => new Map(prev).set(material.id, {
        title: data.title,
        html: data.html,
        loading: false
      }));
    } catch (error) {
      console.error('获取原文失败:', error);
      setOriginalContents(prev => new Map(prev).set(material.id, {
        title: material.title,
        html: '<p>获取原文失败</p>',
        loading: false,
        error: '获取失败'
      }));
    }
  }, []); // 移除originalContents依赖，避免无限循环
  
  // 当切换素材时，获取原文
  useEffect(() => {
    const material = materials.find(m => m.id === currentMaterialId);
    if (material) {
      fetchOriginalContent(material);
    }
  }, [currentMaterialId, materials, fetchOriginalContent]);
  
  // 筛选后的素材列表
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const task = tasks.get(material.id);
      const matchesSearch = material.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "not_started" && !task) ||
        (task && task.status === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [materials, tasks, search, statusFilter]);
  
  // 当前素材和任务
  const currentMaterial = materials.find(m => m.id === currentMaterialId);
  const currentTask = currentMaterialId ? tasks.get(currentMaterialId) : undefined;
  const currentResults = currentTask?.rewrite_results || [];
  const currentResult = currentResults.find(r => r.id === currentResultId) || currentResults[0];
  const currentOriginal = currentMaterialId ? originalContents.get(currentMaterialId) : undefined;
  
  // 调试：打印当前任务和结果状态
  useEffect(() => {
    if (currentTask) {
      console.log('[当前任务状态]', {
        materialId: currentMaterialId,
        task: currentTask,
        status: currentTask.status,
        has_results: !!currentTask.rewrite_results,
        results_count: currentResults.length,
        current_result: currentResult,
        current_result_id: currentResultId
      });
    }
  }, [currentTask, currentResult, currentResultId]);
  
  // 编辑器状态
  const [isDirty, setIsDirty] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const lastPersistRef = useRef<number>(0);
  
  const persistDraft = useCallback((data: { title: string; contentHtml: string }) => {
    if (!currentResult) return;
    const key = `rewrite:${currentResult.id}`;
    const record = { ...data, updatedAt: Date.now(), isDirty: true };
    localStorage.setItem(key, JSON.stringify(record));
  }, [currentResult]);
  
  // TipTap编辑器
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Link.configure({ openOnClick: true, autolink: true, HTMLAttributes: { target: "_blank", rel: "noopener" } }),
      Image,
    ],
    content: currentResult?.edited_content_html || currentResult?.content_html || "",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "prose dark:prose-invert max-w-none min-h-[400px] focus:outline-none" },
      handlePaste(view, event) {
        const html = event.clipboardData?.getData("text/html");
        const text = event.clipboardData?.getData("text/plain");
        if (html) {
          const clean = sanitizeHtmlForWeChat(html);
          editor?.commands.insertContent(clean);
          event.preventDefault();
          return true;
        }
        if (text) {
          editor?.commands.insertContent(`<p>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`);
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setIsDirty(true);
      const now = Date.now();
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        if (now - lastPersistRef.current >= 3000) {
          persistDraft({ title: currentResult?.title || "", contentHtml: html });
          lastPersistRef.current = Date.now();
        }
      }, 1000);
    },
  }, [currentResultId]);
  
  useEffect(() => {
    if (!editor) return;
    const content = currentResult?.edited_content_html || currentResult?.content_html || "";
    editor.commands.setContent(content);
    setIsDirty(false);
  }, [currentResultId, editor, currentResult]);
  
  // 保存到数据库
  const onSaveToDb = async () => {
    if (!currentResult || !editor) return;
    const html = editor.getHTML();
    
    try {
      const response = await fetch('/api/rewrite', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: currentResult.id,
          title: currentResult.title,
          contentHtml: html
        })
      });
      
      if (!response.ok) throw new Error('保存失败');
      
      setIsDirty(false);
      push("已保存到数据库", "success");
      
      // 更新本地状态
      if (currentTask) {
        const updatedTask = { ...currentTask };
        if (updatedTask.rewrite_results) {
          const resultIndex = updatedTask.rewrite_results.findIndex(r => r.id === currentResult.id);
          if (resultIndex >= 0) {
            updatedTask.rewrite_results[resultIndex] = {
              ...currentResult,
              edited_content_html: html,
              is_edited: true,
              updated_at: new Date().toISOString()
            };
          }
        }
        setTasks(prev => new Map(prev).set(currentMaterialId, updatedTask));
      }
    } catch (error) {
      console.error('保存失败:', error);
      push("保存失败", "error");
    }
  };
  

  // 重新生成
  const onRegenerate = async () => {
    if (!currentMaterial) {
      console.error('[重新生成] 没有选中的素材');
      return;
    }
    
    // 如果是第一次生成（没有currentTask），使用默认模型
    const aiModel = currentTask?.ai_model || 'claude-4';
    const promptTemplate = currentTask?.prompt_template || '';
    
    console.log('[重新生成] 开始创建任务', {
      materialId: currentMaterial.id,
      aiModel,
      hasCurrentTask: !!currentTask
    });
    
    try {
      // 先创建任务记录
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentIds: [currentMaterial.id],
          aiModel: aiModel
        })
      });
      
      if (!response.ok) throw new Error('创建任务失败');
      
      const data = await response.json();
      console.log('[重新生成] 创建任务响应:', data);
      
      const newTask = data.tasks?.[0];
      
      if (newTask) {
        console.log('[重新生成] 新任务:', newTask);
        
        // 立即更新本地状态 - 确保状态为pending
        newTask.status = 'pending';
        newTask.rewrite_results = [];
        setTasks(prev => {
          const newMap = new Map(prev);
          newMap.set(currentMaterial.id, newTask);
          console.log('[重新生成] 更新任务Map:', newMap.get(currentMaterial.id));
          return newMap;
        });
        
        // 使用流式API处理改写
        await handleStreamResponse(
          newTask.id,
          currentMaterial.id,
          aiModel,
          promptTemplate || newTask.prompt_template
        );
      } else {
        console.error('[重新生成] 未获取到新任务');
      }
    } catch (error) {
      console.error('[重新生成] 失败:', error);
      push("重新生成失败", "error");
    }
  };
  
  // 拖拽调整布局
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (draggingLeftRef.current) {
        setLeftWidth(Math.min(400, Math.max(240, e.clientX)));
      } else if (draggingSplitRef.current) {
        const container = document.getElementById("rw-split");
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setSplitRatio(Math.min(0.8, Math.max(0.2, x / rect.width)));
      }
    };
    const onUp = () => { 
      draggingLeftRef.current = false; 
      draggingSplitRef.current = false; 
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { 
      window.removeEventListener("mousemove", onMove); 
      window.removeEventListener("mouseup", onUp); 
    };
  }, [setLeftWidth, setSplitRatio]);
  
  const [showValidation, setShowValidation] = useState(false);
  const { pass, issues } = useMemo(() => validateWeChatHtml(editor?.getHTML() || ""), [editor]);
  
  return (
    <div className="h-[calc(100vh-64px)] w-full flex overflow-hidden rounded-lg border">
      {/* 左栏：素材列表 */}
      <div style={{ width: `${leftWidth}px` }} className="h-full border-r flex flex-col bg-background">
        <div className="p-3 border-b">
          <div className="flex gap-2">
            <input
              className="input w-full"
              placeholder="搜索素材标题"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">全部</option>
              <option value="processing">处理中</option>
              <option value="pending">待处理</option>
              <option value="failed">失败</option>
              <option value="completed">已完成</option>
              <option value="not_started">未开始</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-0 right-[-4px] w-2 h-full cursor-col-resize" 
               onMouseDown={() => (draggingLeftRef.current = true)} />
        </div>
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Icons.loader className="w-6 h-6 animate-spin mx-auto mb-2" />
              加载中...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              暂无素材
            </div>
          ) : (
            filteredMaterials.map(material => {
              const task = tasks.get(material.id);
              const status = task?.status || "not_started";
              return (
                <button
                  key={material.id}
                  onClick={() => setCurrentMaterialId(material.id)}
                  className={cn(
                    "w-full text-left p-3 border-b hover:bg-muted/50 focus:bg-muted/70 outline-none",
                    currentMaterialId === material.id && "bg-muted/60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <StatusDot status={status} />
                    <span className="font-medium line-clamp-2">{material.title}</span>
                  </div>
                  {task && (
                    <div className="text-xs text-muted-foreground mt-1 ml-6">
                      {task.ai_model && MODEL_DISPLAY_NAMES[task.ai_model as keyof typeof MODEL_DISPLAY_NAMES]}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
      
      {/* 中/右分栏容器 */}
      <div id="rw-split" className="flex-1 h-full flex relative">
        {/* 中栏：原文 */}
        <div style={{ width: `${splitRatio * 100}%` }} className="h-full overflow-hidden border-r">
          <div className="h-full overflow-auto p-4">
            {currentOriginal ? (
              currentOriginal.loading ? (
                <div className="text-center py-8">
                  <Icons.loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">加载原文中...</p>
                </div>
              ) : currentOriginal.error ? (
                <div className="text-center py-8">
                  <Icons.alertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  <p className="text-muted-foreground">{currentOriginal.error}</p>
                </div>
              ) : (
                <article className="prose dark:prose-invert max-w-none">
                  <h1 className="text-xl font-semibold">{currentOriginal.title}</h1>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlForWeChat(currentOriginal.html) }} />
                </article>
              )
            ) : (
              <EmptyState 
                icon={<Icons.fileText className="w-10 h-10" />} 
                title="请选择素材" 
                sub="从左侧选择一条素材开始改写" 
              />
            )}
          </div>
        </div>
        
        {/* 分割线 */}
        <div className="w-1 hover:w-1.5 transition-colors cursor-col-resize bg-border" 
             onMouseDown={() => (draggingSplitRef.current = true)} />
        
        {/* 右栏：改写编辑 */}
        <div style={{ width: `${(1 - splitRatio) * 100}%` }} className="h-full overflow-hidden">
          <div className="h-full flex flex-col">
            {/* 顶部工具栏 */}
            <div className="border-b p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {currentTask && currentTask.status === "completed" && currentResults.length > 0 && (
                  <RewriteDropdown
                    results={currentResults}
                    currentId={currentResultId || currentResults[0]?.id}
                    onSelect={setCurrentResultId}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* 临时测试按钮 */}
                <Button 
                  variant="ghost" 
                  onClick={testSSE}
                  className="gap-2 text-xs"
                  title="测试SSE连接"
                >
                  <Icons.zap className="w-3 h-3" />
                  测试
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onRegenerate} 
                  disabled={!currentMaterial || currentTask?.status === "processing"}
                  className="gap-2"
                >
                  <Icons.refresh className="w-4 h-4" />
                  {currentTask ? '重新生成' : '开始改写'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowValidation(v => !v)} 
                  className={cn("gap-2", pass ? "" : "border-red-400 text-red-600")}
                >
                  {pass ? <Icons.shieldCheck className="w-4 h-4" /> : <Icons.shieldAlert className="w-4 h-4" />}
                  校验
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={onSaveToDb} 
                  disabled={!currentResult || !editor}
                  className="gap-2"
                >
                  <Icons.save className="w-4 h-4" />
                  保存
                </Button>
                <Button 
                  disabled={!currentResult} 
                  className="gap-2"
                >
                  <Icons.upload className="w-4 h-4" />
                  一键入库
                </Button>
              </div>
            </div>
            
            {/* 编辑器主体 */}
            <div className="flex-1 overflow-auto grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="p-4">
                {(() => {
                  // 调试：打印当前渲染状态
                  console.log('[渲染调试]', {
                    hasCurrentTask: !!currentTask,
                    taskStatus: currentTask?.status,
                    hasResults: !!currentTask?.rewrite_results,
                    resultsCount: currentTask?.rewrite_results?.length || 0,
                    hasCurrentResult: !!currentResult,
                    currentResultId: currentResultId
                  });
                  
                  if (!currentTask) {
                    return (
                      <EmptyState 
                        icon={<Icons.sparkles className="w-10 h-10" />} 
                        title="暂未创建改写任务" 
                        sub="请先从素材库选择内容进行批量改写" 
                      />
                    );
                  }
                  
                  if (currentTask.status === "processing" || currentTask.status === "pending") {
                    const streaming = streamingContent.get(currentMaterialId);
                    return (
                      <div className="py-4">
                        {streaming ? (
                          // 显示流式内容
                          <>
                            <div className="flex items-center gap-2 mb-3">
                              <Icons.loader className="w-4 h-4 animate-spin" />
                              <span className="text-sm text-muted-foreground">正在生成中...</span>
                            </div>
                            <div className="border rounded-lg p-4 bg-muted/10">
                              <div className="prose dark:prose-invert max-w-none">
                                <p className="text-sm text-muted-foreground italic">{streaming}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          // 默认加载状态
                          <div className="text-center py-8">
                            <Icons.loader className="w-8 h-8 animate-spin mx-auto mb-3" />
                            <p className="font-medium">正在改写中...</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              使用 {MODEL_DISPLAY_NAMES[currentTask.ai_model as keyof typeof MODEL_DISPLAY_NAMES] || currentTask.ai_model}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              状态: {currentTask.status}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  if (currentTask.status === "failed") {
                    return (
                      <div className="text-center py-8">
                        <Icons.alertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
                        <p className="font-medium text-red-600">改写失败</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentTask.error_message || "未知错误"}
                        </p>
                        <Button 
                          onClick={onRegenerate} 
                          className="mt-4 gap-2"
                        >
                          <Icons.refresh className="w-4 h-4" />
                          重试
                        </Button>
                      </div>
                    );
                  }
                  
                  if (currentResult) {
                    return (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-muted-foreground">
                            版本 {currentResult.version}
                          </span>
                          {isDirty && <span className="inline-block w-2 h-2 rounded-full bg-orange-500" title="有未保存更改" />}
                          {currentResult.is_edited && <span className="text-xs text-blue-600">已编辑</span>}
                        </div>
                        <Toolbar editor={editor} />
                        <div className="mt-3 border rounded-lg p-3 bg-background">
                          <EditorContent editor={editor} />
                        </div>
                      </>
                    );
                  }
                  
                  // 默认情况：已完成但没有结果
                  return (
                    <EmptyState 
                      icon={<Icons.sparkles className="w-10 h-10" />} 
                      title="暂无改写结果" 
                      sub={'点击"重新生成"创建新的改写'} 
                    />
                  );
                })()}
              </div>
              
              {/* 校验侧栏 */}
              <div className={cn("border-l p-4 hidden lg:block", showValidation ? "" : "opacity-60")}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {pass ? <Icons.shieldCheck className="text-emerald-600 w-5 h-5" /> : <Icons.shieldAlert className="text-red-600 w-5 h-5" />}
                    <span className={cn("text-sm", pass ? "text-emerald-600" : "text-red-600")}>
                      {pass ? "兼容校验通过" : `发现 ${issues.length} 个问题`}
                    </span>
                  </div>
                </div>
                {!pass && (
                  <ul className="space-y-2 text-sm list-disc pl-5">
                    {issues.map((it, idx) => (<li key={idx} className="text-red-600">{it}</li>))}
                  </ul>
                )}
                {pass && <p className="text-sm text-muted-foreground">未发现不兼容元素，可直接入库并发布。</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "processing" ? "bg-blue-500 animate-pulse" :
    status === "pending" ? "bg-gray-400" :
    status === "failed" ? "bg-red-500" :
    status === "completed" ? "bg-emerald-500" :
    "bg-muted-foreground";
  return <span className={cn("inline-block w-2 h-2 rounded-full", color)} />;
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center text-center text-muted-foreground">
      <div>
        <div className="mx-auto mb-3 opacity-60">{icon}</div>
        <div className="font-medium">{title}</div>
        {sub && <div className="text-xs mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  if (!editor) return null;
  const e = editor;
  const onPickImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = (input.files && input.files[0]) || null;
      if (!file) return;
      const url = URL.createObjectURL(file);
      e?.commands.setImage({ src: url });
    };
    input.click();
  };
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <ToolbarButton active={e.isActive("bold")} onClick={() => e.chain().focus().toggleBold().run()} icon={<Icons.bold className="w-4 h-4" />} />
      <ToolbarButton active={e.isActive("italic")} onClick={() => e.chain().focus().toggleItalic().run()} icon={<Icons.italic className="w-4 h-4" />} />
      <ToolbarButton active={e.isActive("underline")} onClick={() => e.chain().focus().toggleUnderline().run()} icon={<Icons.underline className="w-4 h-4" />} />
      <Divider />
      <ToolbarButton active={e.isActive("heading", { level: 1 })} onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()} text="H1" />
      <ToolbarButton active={e.isActive("heading", { level: 2 })} onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()} text="H2" />
      <ToolbarButton active={e.isActive("heading", { level: 3 })} onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()} text="H3" />
      <Divider />
      <ToolbarButton active={e.isActive("bulletList")} onClick={() => e.chain().focus().toggleBulletList().run()} icon={<Icons.list className="w-4 h-4" />} />
      <ToolbarButton active={e.isActive("orderedList")} onClick={() => e.chain().focus().toggleOrderedList().run()} icon={<Icons.listOrdered className="w-4 h-4" />} />
      <ToolbarButton active={e.isActive("blockquote")} onClick={() => e.chain().focus().toggleBlockquote().run()} icon={<Icons.quote className="w-4 h-4" />} />
      <ToolbarButton onClick={() => e.chain().focus().setHorizontalRule().run()} icon={<Icons.minus className="w-4 h-4" />} />
      <Divider />
      <ToolbarButton onClick={() => {
        const url = prompt("请输入链接地址（http/https）");
        if (!url) return;
        if (!/^https?:\/\//.test(url)) return alert("仅支持 http/https 链接");
        e.chain().focus().setLink({ href: url, target: "_blank", rel: "noopener" }).run();
      }} icon={<Icons.link className="w-4 h-4" />} />
      <ToolbarButton onClick={onPickImage} icon={<Icons.image className="w-4 h-4" />} />
      <Divider />
      <ToolbarButton onClick={() => e.chain().focus().undo().run()} icon={<Icons.undo className="w-4 h-4" />} />
      <ToolbarButton onClick={() => e.chain().focus().redo().run()} icon={<Icons.redo className="w-4 h-4" />} />
    </div>
  );
}

function ToolbarButton({ active, onClick, icon, text }: { active?: boolean; onClick: () => void; icon?: React.ReactNode; text?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("btn btn-ghost h-8 px-2", active && "bg-muted")}
    >
      {icon}
      {text && <span className="ml-1 text-xs font-semibold">{text}</span>}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-6 bg-border" />;
}

function RewriteDropdown({ results, currentId, onSelect }: { 
  results: RewriteResult[]; 
  currentId?: string; 
  onSelect: (id: string) => void;
}) {
  const sorted = results.slice().sort((a, b) => b.version - a.version);
  const current = sorted.find(r => r.id === currentId) || sorted[0];
  
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <Icons.chevronsUpDown className="w-4 h-4" />
          <span>版本 {current?.version || 1}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-popover border rounded-md shadow-md min-w-[220px]">
        {sorted.map((r, index) => (
          <button
            key={`${r.id}-${index}`}
            className={cn(
              "w-full text-left p-2 hover:bg-muted/50",
              r.id === currentId && "bg-muted/70"
            )}
            onClick={() => onSelect(r.id)}
          >
            <div className="text-sm">版本 {r.version}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(r.created_at).toLocaleString()}
            </div>
          </button>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}