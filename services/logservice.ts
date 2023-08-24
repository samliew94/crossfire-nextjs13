let logs: string[] = [];

export function resetLogs() {
  logs.length = 0;
}

export function appendLog(log: string) {
  logs.push(log);
}

export function getAllLogs() {
  return logs;
}
export function getAllLogsDesc() {
  return [...logs].reverse();
}
