import {Location} from "react-router-dom";
import tabHeader from "./tabHeader";

export interface Tab {
    channelId: string;
    guildId?: string;
    userId?: string;
    name: string;
}

export const getTabType = (tab: Tab): "GUILD_CHANNEL" | "GROUP_DM" | "DM" => {
    if (tab.userId) return "DM";
    if (tab.guildId) return "GUILD_CHANNEL";
    return "GROUP_DM";
}

export const getChannelFromUri = (uri: string): {channelId: string, parent?: string} | undefined => {
    const matches = uri.match(/\/channels\/(\d+|@me|@favorites)\/(\d+)/);
    
    if (!matches || matches.length !== 3) return;
    
    return {
        parent: matches[1],
        channelId: matches[2],
    }
}

export const isUriAtTab = (uri: string, tab: Tab) => {
    const path = getChannelFromUri(uri);
    
    if (!path) return false;
    
    return path.channelId === tab.channelId;
}

export const getOpenTabs = (): Tab[] => {
    // return [
    //     {
    //         name: "Liege",
    //         channelId: "692174723341221958",
    //         userId: "619241308912877609"
    //     },
    //     {
    //         name: "general",
    //         channelId: "732297728826277942",
    //         guildId: "732297728826277939"
    //     },
    //     {
    //         name: "android",
    //         channelId: "732297837953679412",
    //         guildId: "732297728826277939"
    //     },
    //    
    // ]

    return BdApi.Data.load("quinchs-discord", "open-tabs") as Tab[]
}

export const saveTabsState = (tabs: Tab[]) => {
    BdApi.Data.save("quinchs-discord", "open-tabs", tabs);
}