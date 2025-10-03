// Error tracking and logging utilities
// In production, integrate with services like Sentry, LogRocket, or Rollbar

interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

class ErrorTracker {
  private isProduction = import.meta.env.PROD;

  captureException(error: Error, context?: ErrorContext) {
    // Log to console in development
    if (!this.isProduction) {
      console.error('[Error Tracker]', error, context);
      return;
    }

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, context);
    
    // For now, log to console with structured data
    console.error('[Production Error]', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (!this.isProduction) {
      console.log(`[${level.toUpperCase()}]`, message, context);
      return;
    }

    // Send to logging service
    console.log('[Production Log]', {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  setUser(user: { id: string; email?: string }) {
    // Set user context for error tracking
    if (this.isProduction) {
      // Example: Sentry.setUser(user);
      console.log('[User Context Set]', user);
    }
  }

  clearUser() {
    // Clear user context
    if (this.isProduction) {
      // Example: Sentry.setUser(null);
      console.log('[User Context Cleared]');
    }
  }
}

export const errorTracker = new ErrorTracker();

// Helper to wrap async functions with error tracking
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTracker.captureException(error as Error, context);
      throw error;
    }
  }) as T;
}
