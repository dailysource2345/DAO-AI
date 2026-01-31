export function formatDistanceToNow(date: Date | string | number, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  let result: string;

  if (diffSec < 60) {
    result = diffSec <= 1 ? "less than a minute" : `${diffSec} seconds`;
  } else if (diffMin < 60) {
    result = diffMin === 1 ? "1 minute" : `${diffMin} minutes`;
  } else if (diffHour < 24) {
    result = diffHour === 1 ? "about 1 hour" : `about ${diffHour} hours`;
  } else if (diffDay < 7) {
    result = diffDay === 1 ? "1 day" : `${diffDay} days`;
  } else if (diffWeek < 4) {
    result = diffWeek === 1 ? "about 1 week" : `about ${diffWeek} weeks`;
  } else if (diffMonth < 12) {
    result = diffMonth === 1 ? "about 1 month" : `about ${diffMonth} months`;
  } else {
    result = diffYear === 1 ? "about 1 year" : `about ${diffYear} years`;
  }

  return options?.addSuffix ? `${result} ago` : result;
}
