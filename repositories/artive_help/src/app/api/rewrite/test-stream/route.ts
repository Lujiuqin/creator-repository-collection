import { NextRequest } from 'next/server';

// 测试SSE流式响应
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  let counter = 0;
  
  const stream = new ReadableStream({
    async start(controller) {
      // 发送几个测试事件
      const events = [
        { type: 'start', message: '开始测试' },
        { type: 'progress', message: '处理中...' },
        { type: 'data', value: '测试数据1' },
        { type: 'data', value: '测试数据2' },
        { type: 'complete', message: '测试完成' }
      ];
      
      for (const event of events) {
        // 发送事件
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        console.log('[测试SSE] 发送事件:', event);
        
        // 等待一秒
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 关闭流
      controller.close();
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