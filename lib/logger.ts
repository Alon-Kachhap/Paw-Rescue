type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  extraData?: Record<string, any>;
  userId?: string;
  action?: string;
}

export function logger(message: string, options: LogOptions = {}) {
  const { 
    level = 'info', 
    extraData = {}, 
    userId = 'anonymous',
    action = 'general'
  } = options;
  
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    message,
    userId,
    action,
    environment: process.env.NODE_ENV || 'development',
    ...extraData
  };
  
  // In development, pretty print
  if (process.env.NODE_ENV === 'development') {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[${timestamp}] [${level.toUpperCase()}] ${message}`,
      extraData
    );
  } else {
    // In production, use JSON format for structured logging
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](JSON.stringify(logData));
  }
} 