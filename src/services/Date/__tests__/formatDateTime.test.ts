import { describe, expect, it } from "vitest";
import { formatDateTime } from "../formatDateTime";
// import { formatDateTime } from '../formatDateTime';

describe("formatDateTime", () => {
  it('formats milliseconds to "HH:MM" in Europe/Madrid timezone by default', () => {
    // 2023-01-01T15:05:00.000Z is 16:05 in Europe/Madrid (UTC+1)
    const ms = Date.UTC(2023, 0, 1, 15, 5, 0, 0);
    expect(formatDateTime({ milliseconds: ms })).toBe("16:05");
  });

  it("respects custom hour and minute formats", () => {
    // 2023-01-01T08:09:00.000Z is 09:09 in Europe/Madrid (UTC+1)
    const ms = Date.UTC(2023, 0, 1, 8, 9, 0, 0);
    expect(
      formatDateTime({
        milliseconds: ms,
        hour: "numeric",
        minute: "2-digit",
      })
    ).toBe("9:09");
  });

  it("handles midnight correctly", () => {
    // 2023-01-01T23:00:00.000Z is 00:00 next day in Europe/Madrid (UTC+1)
    const ms = Date.UTC(2023, 0, 1, 23, 0, 0, 0);
    expect(formatDateTime({ milliseconds: ms })).toBe("00:00");
  });

  it("handles noon correctly", () => {
    // 2023-01-01T11:00:00.000Z is 12:00 in Europe/Madrid (UTC+1)
    const ms = Date.UTC(2023, 0, 1, 11, 0, 0, 0);
    expect(formatDateTime({ milliseconds: ms })).toBe("12:00");
  });
});
