type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    correlationId?: string;
    [key: string]: unknown;
}

function formatEntry(entry: LogEntry): string {
    return JSON.stringify(entry);
}

class Logger {
    private context: Record<string, unknown> = {};

    withContext(ctx: Record<string, unknown>): Logger {
        const child = new Logger();
        child.context = { ...this.context, ...ctx };
        return child;
    }

    withCorrelationId(id: string): Logger {
        return this.withContext({ correlationId: id });
    }

    debug(message: string, data?: Record<string, unknown>) {
        this.log('debug', message, data);
    }

    info(message: string, data?: Record<string, unknown>) {
        this.log('info', message, data);
    }

    warn(message: string, data?: Record<string, unknown>) {
        this.log('warn', message, data);
    }

    error(message: string, data?: Record<string, unknown>) {
        this.log('error', message, data);
    }

    private log(level: LogLevel, message: string, data?: Record<string, unknown>) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            ...this.context,
            ...data,
        };

        const output = formatEntry(entry);

        switch (level) {
            case 'error':
                console.error(output);
                break;
            case 'warn':
                console.warn(output);
                break;
            default:
                console.log(output);
        }
    }
}

export const logger = new Logger();
export type { LogLevel, LogEntry };
