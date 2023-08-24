let start: Date;
let end: Date;
export function resetTimer() {
  start = new Date();
  end = new Date(start.getTime() + 5 * 60 * 1000);
}

export function getSecondsRemaining() {
  const ms = end.getTime() - new Date().getTime();
  const s = ms / 1000;
  const roundedSeconds = Math.floor(s);
  return roundedSeconds <= 0 ? 0 : roundedSeconds;
}
