export const iterateKeys = <T extends {}, U extends keyof T>(value: T): U[] => {
    return Object.keys(value) as U[];
}