type FormatDateTimeParams = {
  milliseconds: number;
  hour?: Intl.DateTimeFormatOptions["hour"];
  minute?: Intl.DateTimeFormatOptions["minute"];
};

export const formatDateTime = ({
  milliseconds,
  hour = "2-digit",
  minute = "2-digit",
}: FormatDateTimeParams) => {
  const date = new Date(milliseconds);

  return new Intl.DateTimeFormat("en-GB", {
    hour,
    minute,
    timeZone: "Europe/Madrid",
  }).format(date);
};
