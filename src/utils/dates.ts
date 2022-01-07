import { format } from "date-fns";

type AllDate = Date | string | number;

// convenience
const formatter = (pattern: string, d: AllDate) =>
  format(
    typeof d === "string" || typeof d === "number" ? new Date(d) : d,
    pattern,
  );

// Format date to readable
// Ex: "January 11, 2021"
export const formatDateHuman = (d: AllDate) => formatter("LLLL d, y", d);

// Format date and time to readable
// Ex: "January 11, 2021 at 5:30 PM"
export const formatDateTimeHuman = (d: AllDate) =>
  formatter("LLLL d, y 'at' p", d);

export const formatCountdown = (days, hours, minutes, seconds) => {
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};
