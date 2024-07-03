
let discordsRequire: any | undefined = undefined;

export const getDiscordsInternalRequire = () => {
    if (discordsRequire) return discordsRequire;
    const id = 'qd-ext-req-' + Date.now();
    
    // @ts-ignore
    window['webpackChunkdiscord_app'].push([[id], {}, r => discordsRequire = r]);
    delete discordsRequire.m[id];
    delete discordsRequire.c[id];
    
    return discordsRequire;
}