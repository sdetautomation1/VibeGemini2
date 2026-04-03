/**
 * Simple Logger Utility
 * 
 * Provides timestamped, color-coded console logging.
 * Can be expanded to write to files or integrate with reporting tools.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'STEP';

const colors: Record<LogLevel, string> = {
  INFO:  '\x1b[36m',  // Cyan
  WARN:  '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m',  // Red
  DEBUG: '\x1b[90m',  // Gray
  STEP:  '\x1b[32m',  // Green
};

const RESET = '\x1b[0m';

function getTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  const color = colors[level];
  const timestamp = getTimestamp();
  console.log(`${color}[${timestamp}] [${level}]${RESET} ${message}`, ...args);
}

export const logger = {
  info:  (message: string, ...args: unknown[]) => log('INFO', message, ...args),
  warn:  (message: string, ...args: unknown[]) => log('WARN', message, ...args),
  error: (message: string, ...args: unknown[]) => log('ERROR', message, ...args),
  debug: (message: string, ...args: unknown[]) => log('DEBUG', message, ...args),
  step:  (message: string, ...args: unknown[]) => log('STEP', message, ...args),
};
