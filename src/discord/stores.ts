export const UnreadStore = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("isEstimated"),
    {fatal: true}
)! as any;

export const ChannelStore = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("getChannel", "getDMFromUserId"),
    {fatal: true}
)! as any;

export const UserStore = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("getCurrentUser", "getUser"),
    {fatal: true}
)! as any;

export const GuildStore = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("getGuild", "getGuildIds"),
    {fatal: true}
)! as any;

export const UserTypingStore = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("isTyping"),
    {fatal: true}
)! as any;

export const UserStatusStore = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("getStatus", "getState"),
    {fatal: true}
)! as any;