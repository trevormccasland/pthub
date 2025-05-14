const applyTimezone = (date: Date | string, timezone: string): Date => {
    if (!date || !timezone) return date instanceof Date ? date : new Date(date);
    const d = typeof date === "string" ? new Date(date) : date;
    // Convert to target timezone string, then back to Date
    const localeString = d.toLocaleString("en-US", { timeZone: timezone });
    return new Date(localeString);
}

export const timezoneTransformer = () => {
    return {
        to: (value: Date) => value,
        from: function (value: Date, entity?: any) {
            const tz = entity?.timezone || this['timezone'];
            return tz ? applyTimezone(value, tz) : value;
        }
    };
}
