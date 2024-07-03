/**
 * Creates a filter that looks for strings in any exported member of a module.
 * This checks *all* exported members for *one of* the strings and returns true
 * if the module contains each string in at least one of its exports.
 * @param strings the strings to search for
 */
export const byFuncStringsInAnyExport = (...strings: string[]) => {

    const has = (exports: any, target: string) => {
        for (const exported in exports) {
            const element = exports[exported];
            if (typeof (element) !== 'function') continue;
            if (element.toString().includes(target)) return true;
        }

        return false;
    }

    return (exports: any, module: any, id: any) => {
        if (typeof (exports) !== 'object') return;

        for (const target of strings) {
            if (!has(exports, target)) return false;
        }

        return true;
    }
}

/**
 * Creates a filter that returns true if *one* export in a module contains *all* strings provided
 * @param strings
 */
export const byFuncString = (...strings: string[]) => {
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

            if (typeof (element) === 'function') {
                const str = element.toString();
                if (hasAll(str)) return true;
            }
        }
    }
}

export const byModuleStrings = (...strings: string[]) => {
    const hasAll = (str: string) => {
        for (const string of strings) {
            if (!str.includes(string)) return false;
        }

        return true;
    }

    for (const moduleId in BdApi.Webpack.modules) {
        const module = BdApi.Webpack.modules[moduleId];

        if (typeof (module) !== 'function' || !module.toString) continue;

        if (hasAll(module.toString())) return moduleId;
    }
}