import { timezoneTransformer } from "../transformers";

describe("timezoneTransformer", () => {
    const transformer = timezoneTransformer();

    function isValidDate(date: any): date is Date {
        return date instanceof Date && !isNaN(date.getTime());
    }

    it("parses ISO string with Z as UTC", () => {
        const date = transformer.from("2025-07-06T18:00:00Z");
        expect(isValidDate(date)).toBe(true);
        if (isValidDate(date)) {
            expect(date.getUTCFullYear()).toBe(2025);
            expect(date.getUTCMonth()).toBe(6); // July is 6 (0-based)
            expect(date.getUTCDate()).toBe(6);
            expect(date.getUTCHours()).toBe(18);
        }
    });

    it("parses ISO string with +00:00 as UTC", () => {
        const date = transformer.from("2025-07-06T18:00:00+00:00");
        expect(isValidDate(date)).toBe(true);
        if (isValidDate(date)) {
            expect(date.getUTCHours()).toBe(18);
        }
    });

    it("parses ISO string with offset", () => {
        const date = transformer.from("2025-07-06T20:00:00+02:00");
        expect(isValidDate(date)).toBe(true);
        if (isValidDate(date)) {
            // 20:00+02:00 is 18:00 UTC
            expect(date.getUTCHours()).toBe(18);
        }
    });

    it("parses ISO string without timezone as UTC", () => {
        const date = transformer.from("2025-07-06T18:00:00");
        expect(isValidDate(date)).toBe(true);
        if (isValidDate(date)) {
            // Should be interpreted as 18:00 UTC
            expect(date.getUTCFullYear()).toBe(2025);
            expect(date.getUTCMonth()).toBe(6);
            expect(date.getUTCDate()).toBe(6);
            expect(date.getUTCHours()).toBe(18);
        }
    });

    it("returns Date object unchanged", () => {
        const now = new Date();
        const result = transformer.from(now);
        expect(result).toBe(now);
    });
});