// Performance monitoring and optimization utilities

class PerformanceMonitor {
  private isProduction = import.meta.env.PROD;

  // Mark a performance milestone
  mark(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
    }
  }

  // Measure time between two marks
  measure(name: string, startMark: string, endMark: string) {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        
        if (!this.isProduction) {
          console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        }

        // In production, send to analytics
        if (this.isProduction && measure.duration > 1000) {
          console.warn(`[Slow Operation] ${name}: ${measure.duration.toFixed(2)}ms`);
        }

        return measure.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return 0;
  }

  // Track page load performance
  trackPageLoad() {
    if (typeof window === 'undefined' || !window.performance) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        const metrics = {
          pageLoadTime,
          connectTime,
          renderTime,
          timestamp: new Date().toISOString(),
        };

        if (!this.isProduction) {
          console.log('[Page Load Metrics]', metrics);
        }

        // Send to analytics in production
        if (this.isProduction) {
          console.log('[Production Metrics]', metrics);
        }
      }, 0);
    });
  }

  // Monitor largest contentful paint (Core Web Vital)
  trackLCP() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (!this.isProduction) {
          console.log('[LCP]', lastEntry.startTime.toFixed(2), 'ms');
        }

        // Send to analytics
        if (this.isProduction && lastEntry.startTime > 2500) {
          console.warn('[Slow LCP]', lastEntry.startTime.toFixed(2), 'ms');
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP tracking failed:', error);
    }
  }

  // Monitor first input delay (Core Web Vital)
  trackFID() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          
          if (!this.isProduction) {
            console.log('[FID]', fid.toFixed(2), 'ms');
          }

          // Send to analytics
          if (this.isProduction && fid > 100) {
            console.warn('[Slow FID]', fid.toFixed(2), 'ms');
          }
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID tracking failed:', error);
    }
  }

  // Initialize all performance tracking
  init() {
    this.trackPageLoad();
    this.trackLCP();
    this.trackFID();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Debounce helper for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle helper for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
