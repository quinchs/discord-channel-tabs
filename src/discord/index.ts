import {byModuleFuncString} from "../utils/moduleSearchFilters";

const privateChannelsActor = BdApi.Webpack.getByKeys("getOrEnsurePrivateChannel", { fatal: true})! as any;
const channelsActor = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("selectChannel"))! as any;
const guildsActor = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("transitionToGuildSync"))! as any;
const icons = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("PlusMediumIcon")) as any;

const guildChannelResolver = Object.values(BdApi.Webpack.getModule(
    byModuleFuncString("shouldShowOnboarding", "getDefaultChannel"),
    { fatal: true }
) as any)[0]! as (e: string) => string;

export const getOrCreatePrivateChannelForUser = async (id: string): Promise<any> => {
    const promise = privateChannelsActor.getOrEnsurePrivateChannel(id) as Promise<any>;
    return await promise;
}

export const resolveChannelIdFromGuildId = (guildId: string): string => {
    return guildChannelResolver(guildId);
} 

export const selectChannel = (
    channelId: string,
    guildId?: string,
) => {
    if (!guildId) {
        selectPrivateChannel(channelId);
        return;
    }

    channelsActor.selectChannel({channelId, guildId})
    guildsActor.transitionToGuildSync(guildId, channelId);
}

export const selectPrivateChannel = (
    channelId: string
) => {
    channelsActor.selectPrivateChannel(channelId);
}

export const ScrollerThin = ZLibrary.DiscordModules.ScrollerThin;
export const PlusIconMedium = icons.PlusMediumIcon;
export const PlusIconSmall = icons.PlusSmallIcon;

export const Navigator = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("QUICKSWITCHER_SHOW")) as any;