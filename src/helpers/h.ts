export const toCamelCase = (key: string) => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

export const serializeResponse = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(serializeResponse);
    }
    if (value instanceof Date || value === null || typeof value !== "object") {
        return value;
    }

    const plainValue = "toJSON" in value && typeof value.toJSON === "function"
        ? value.toJSON() as Record<string, unknown>
        : value as Record<string, unknown>;

    return Object.fromEntries(
        Object.entries(plainValue).map(([key, item]) => [
            toCamelCase(key),
            serializeResponse(item)
        ])
    );
};