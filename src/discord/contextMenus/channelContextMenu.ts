import {byModuleStrings} from "../../utils/moduleSearchFilters";
import {getDiscordsInternalRequire} from "../require";

let cachedRequiredModules: {
    GROUP_DM: (require: any) => any;
    DM: (require: any) => any;
    GUILD_CHANNEL: (require: any) => any;
} | undefined = undefined;

const loadRequiredModules = () => {
    if (cachedRequiredModules) return cachedRequiredModules;

    // get the module for channels, we're going to extract the module ids for the context menu from it
    const module = byModuleStrings("handleContextMenu", "GROUP_DM", "DM", "getGuild", "channel", "guild");

    if (!module) return;

    const matches = BdApi.Webpack.modules[module].toString().match(/Promise\.all\((.*?)\)\.then\((.*?)\);/gm);

    if (!matches || matches.length !== 3) return;

    cachedRequiredModules = {
        // @ts-ignore
        GROUP_DM: new Function(`const n = arguments[0]; return ${matches[0]}`),
        // @ts-ignore
        DM: new Function(`const n = arguments[0]; return ${matches[1]}`),
        // @ts-ignore
        GUILD_CHANNEL: new Function(`const n = arguments[0]; return ${matches[2]}`),
    };

    return cachedRequiredModules;
}

export const groupDMContextMenuItems = async () => {
    const discordsRequire = getDiscordsInternalRequire();
    const modules = loadRequiredModules();
    if (!modules) return;

    return (await modules.GROUP_DM(discordsRequire))?.default;
}

export const DMContextMenuItems = async () => {
    const discordsRequire = getDiscordsInternalRequire();
    const modules = loadRequiredModules();
    if (!modules) return;

    return (await modules.DM(discordsRequire))?.default;
}

export const guildChannelContextMenuItems = async () => {
    const discordsRequire = getDiscordsInternalRequire();
    const modules = loadRequiredModules();
    if (!modules) return;

    return (await modules.GUILD_CHANNEL(discordsRequire))?.default
}