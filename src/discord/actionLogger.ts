export const actionLogger = BdApi.Webpack.getByKeys("actionLogger");

export const subscribeToDiscordAction = (event: string, handler: Function) => {
    actionLogger.subscribe(event, handler);
}

export const unsubscribeFromDiscordAction = (event: string, handler: Function) => {
    actionLogger.unsubscribe(event, handler);
}

export const hookDiscordAction = (event: string, handler: Function): () => void => {
    subscribeToDiscordAction(event,  handler);
    return () => unsubscribeFromDiscordAction(event, handler);
}

export const QUICKSWITCHER_SELECT = "QUICKSWITCHER_SELECT";
export const QUICKSWITCHER_SEARCH = "QUICKSWITCHER_SEARCH";
export const QUICKSWITCHER_SHOW = "QUICKSWITCHER_SHOW";
export const QUICKSWITCHER_HIDE = "QUICKSWITCHER_HIDE";
export const QUICKSWITCHER_SWITCH_TO = "QUICKSWITCHER_SWITCH_TO";