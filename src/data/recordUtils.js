export const clone = (value) => JSON.parse(JSON.stringify(value))

export const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
