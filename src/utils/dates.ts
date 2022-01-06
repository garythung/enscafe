import { format } from "date-fns";

// Format date to readable
// Ex: "January 11, 2021"
export const formatDateHuman = (d: Date | string) => {
  if (typeof d === "string") {
    return format(new Date(d), "LLLL d, y");
  }

  return format(d, "LLLL d, y");
};

// Format date and time to readable
// Ex: "January 11, 2021 at 5:30 PM"
export const formatDateTimeHuman = (d) => {
  return format(d, "LLLL d, y 'at' p");
  // return format(d, "PPPp"); // Ex: "January 11th, 2021 at 5:30 PM"
};

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
