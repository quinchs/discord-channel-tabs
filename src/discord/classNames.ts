export const Chat = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps('messagesWrapper', 'scrollerContent'), 
    {fatal: true}
)! as any;