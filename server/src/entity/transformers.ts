const applyTimezone = (date: Date | string, timezone: string): Date => {
    const d = typeof date === "string" ? new Date(date) : date;
    if (!timezone) return d;
    // Convert to target timezone string, then back to Date
    const localeString = d.toLocaleString("en-US", { timeZone: timezone });
    return new Date(localeString);
}

const parseAsUTC = (date: Date | string): Date => {
    if (typeof date !== "string") return date;
    if (!date.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(date)) {
        // If string lacks timezone info, treat as UTC by appending 'Z'
        return new Date(date + "Z");
    }
    return new Date(date);
};

export const timezoneTransformer = () => {
    return {
        to: (value: Date) => value,
        from: function (this: { timezone?: string }, value: Date | string, entity?: { timezone?: string }): Date {
            const tz = entity?.timezone || this.timezone;
            return tz ? applyTimezone(value, tz) : (value instanceof Date ? value : parseAsUTC(value));
        }
    };
}