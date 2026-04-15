import type { Scenario5Result } from "./types.js";

export const SCENARIO5_LOCAL_TIMEZONE = "America/Los_Angeles";
export const SCENARIO5_BOLIVIA_TIMEZONE = "America/La_Paz";
export const SCENARIO5_REFERENCE_DATE = "2026-04-16";

export function getScenario5ExpectedResult(): Scenario5Result {
  return {
    proposedStartIso: "2026-04-16T17:00:00.000Z",
    proposedEndIso: "2026-04-16T17:30:00.000Z",
    localTimezone: SCENARIO5_LOCAL_TIMEZONE,
    boliviaTimezone: SCENARIO5_BOLIVIA_TIMEZONE,
    rationale:
      "Selected a 30-minute overlap that stays within 09:00-17:00 working hours in both time zones and avoids known busy slots.",
  };
}

export function getScenario5SchedulingContext() {
  return {
    localTimezone: SCENARIO5_LOCAL_TIMEZONE,
    boliviaTimezone: SCENARIO5_BOLIVIA_TIMEZONE,
    localWorkingHours: { startHour24: 9, endHour24: 17 },
    boliviaWorkingHours: { startHour24: 9, endHour24: 17 },
    localBusySlots: [
      {
        startIso: "2026-04-16T16:00:00.000Z",
        endIso: "2026-04-16T16:30:00.000Z",
      },
      {
        startIso: "2026-04-16T18:00:00.000Z",
        endIso: "2026-04-16T19:00:00.000Z",
      },
    ],
    boliviaBusySlots: [
      {
        startIso: "2026-04-16T15:00:00.000Z",
        endIso: "2026-04-16T15:30:00.000Z",
      },
      {
        startIso: "2026-04-16T19:00:00.000Z",
        endIso: "2026-04-16T19:30:00.000Z",
      },
    ],
  };
}
