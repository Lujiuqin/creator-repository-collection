// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  // 开始计时
  startMeasure(label: string) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${label}-start`);
    }
  }

  // 结束计时并记录
  endMeasure(label: string) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        
        if (measure) {
          // 记录指标
          if (!this.metrics.has(label)) {
            this.metrics.set(label, []);
          }
          this.metrics.get(label)?.push(measure.duration);
          
          // 开发环境下输出到控制台
          if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ ${label}: ${measure.duration.toFixed(2)}ms`);
          }
        }
      } catch (e) {
        // 忽略错误
      }
    }
  }

  // 获取平均性能指标
  getAverageMetric(label: string): number | null {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return null;
    
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  // 输出性能报告
  printReport() {
    console.group('📊 性能报告');
    this.metrics.forEach((values, label) => {
      const avg = this.getAverageMetric(label);
      const min = Math.min(...values);
      const max = Math.max(...values);
      console.log(`${label}: 平均 ${avg?.toFixed(2)}ms | 最小 ${min.toFixed(2)}ms | 最大 ${max.toFixed(2)}ms`);
    });
    console.groupEnd();
  }

  // 清除指标
  clear() {
    this.metrics.clear();
  }
}

// 导出单例
export const perfMonitor = PerformanceMonitor.getInstance();