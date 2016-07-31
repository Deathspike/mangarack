declare let console: {log: (message: string) => void};
declare function isFinite(value: number | undefined): value is number;
declare function setTimeout(handler: () => void, timeout: number): number;
