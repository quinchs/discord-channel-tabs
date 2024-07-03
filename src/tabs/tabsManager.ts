export interface Tab {
    channelId: string;
    guildId?: string;
    userId?: string;
    name: string;
}

export const createTabFromChannel = (channel: any): Tab | undefined => {
    if (channel.isGroupDM()) {
        let name = channel.name;
        if (!name && channel.recipients) {
            name = channel.recipients
                .map((x: string) => ZLibrary.DiscordModules.UserStore.getUser(x).globalName)
                .join(", ");
        }

        return {
            channelId: channel.id,
            name: name ?? "Unknown Group"
        }
    } else if (channel.isDM()) {
        const user = ZLibrary.DiscordModules.UserStore.getUser(channel.getRecipientId());
        return {
            channelId: channel.id,
            name: user.globalName ?? user.username,
            userId: user.id
        }
    } else if (channel.guild_id) {
        return {
            name: channel.name,
            guildId: channel.guild_id,
            channelId: channel.id
        }
    }
}

export const getTabType = (tab: Tab): "GUILD_CHANNEL" | "GROUP_DM" | "DM" => {
    if (tab.userId) return "DM";
    if (tab.guildId) return "GUILD_CHANNEL";
    return "GROUP_DM";
}

export const getChannelFromUri = (uri: string): { channelId: string, parent?: string } | undefined => {
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

    return BdApi.Data.load("quinchs-discord", "open-tabs") ?? [] as Tab[]
}

export const saveTabsState = (tabs: Tab[]) => {
    BdApi.Data.save("quinchs-discord", "open-tabs", tabs);
}