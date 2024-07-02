export const byModuleFuncString = (...strings: string[]) => {
    const hasAll = (str: string) => {
        for (const string of strings) {
            if (!str.includes(string)) return false;
        }

        return true;
    }

    return (exports: any, module: any, id: any) => {
        if (typeof (exports) !== 'object') return false;

        for (let p in exports) {
            const element = exports[p];
            if (!element) continue;

            if(typeof (element) === 'function') {
                const str = element.toString();
                if (hasAll(str)) return true;
            }
        }
    }
}