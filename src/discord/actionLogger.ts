export const actionLogger = BdApi.Webpack.getByKeys("actionLogger");

export const subscribeToDiscordAction = (event: string, handler: Function) => {
    actionLogger.subscribe(event, handler);
}

export const unsubscribeFromDiscordAction = (event: string, handler: Function) => {
    actionLogger.unsubscribe(event, handler);
}

export const hookDiscordAction = (event: string, handler: Function): () => void => {
    subscribeToDiscordAction(event, handler);
    return () => unsubscribeFromDiscordAction(event, handler);
}

export const ActionLoggerEventTypes = BdApi.Webpack.getByKeys('OPEN_THREAD_NOTIFICATION_SETTINGS', {searchExports: true}) as {
    IFRAME_MOUNT: string
    IFRAME_UNMOUNT: string
    REMEASURE_TARGET: string
    MODAL_SUBMIT: string
    MODAL_CLOSE: string
    TEXTAREA_FOCUS: string
    TEXTAREA_BLUR: string
    SCROLLTO_PRESENT: string
    SCROLLTO_CHANNEL: string
    TOGGLE_CHANNEL_PINS: string
    TOGGLE_INBOX_UNREADS_TAB: string
    MARK_TOP_INBOX_CHANNEL_READ: string
    TOGGLE_EMOJI_POPOUT: string
    TOGGLE_DM_CREATE: string
    INSERT_TEXT: string
    SCROLL_PAGE_DOWN: string
    SCROLL_PAGE_UP: string
    FOCUS_FRIEND_SEARCH: string
    BLUR_INPUT: string
    POPOUT_CLOSE: string
    POPOUT_SHOW: string
    POPOUT_HIDE: string
    UPLOAD_FILE: string
    CALL_ACCEPT: string
    CALL_DECLINE: string
    CALL_START: string
    DDR_ARROW_DOWN: string
    DDR_ARROW_UP: string
    SHAKE_APP: string
    EMPHASIZE_NOTICE: string
    EMPHASIZE_SLOWMODE_COOLDOWN: string
    SET_SEARCH_QUERY: string
    FOCUS_SEARCH: string
    PERFORM_SEARCH: string
    QUICKSWITCHER_RESULT_FOCUS: string
    LAYER_POP_ESCAPE_KEY: string
    LAYER_POP_START: string
    LAYER_POP_COMPLETE: string
    CONTEXT_MENU_CLOSE: string
    WAVE_EMPHASIZE: string
    CAROUSEL_NEXT: string
    CAROUSEL_PREV: string
    MODAL_CAROUSEL_NEXT: string
    MODAL_CAROUSEL_PREV: string
    TOGGLE_GIF_PICKER: string
    CLOSE_GIF_PICKER: string
    TOGGLE_STICKER_PICKER: string
    TOGGLE_SOUNDBOARD: string
    FAVORITE_GIF: string
    GLOBAL_CLIPBOARD_PASTE: string
    SEARCH_RESULTS_CLOSE: string
    OPEN_EMBEDDED_ACTIVITY: string
    RELEASE_ACTIVITY_WEB_VIEW: string
    FOCUS_MESSAGES: string
    FOCUS_CHANNEL_TEXT_AREA: string
    FOCUS_ATTACHMENT_AREA: string
    FOCUS_COMPOSER_TITLE: string
    PREPEND_TEXT: string
    OPEN_EXPRESSION_PICKER: string
    OPEN_THREAD_NOTIFICATION_SETTINGS: string
    CLEAR_TEXT: string
    SHOW_OAUTH2_MODAL: string
    LAUNCH_PAD_SHOW: string
    LAUNCH_PAD_HIDE: string
    FOCUS_CHAT_BUTTON: string
    SHOW_TEXT_IN_VOICE_POPOUT_COMING_SOON_TIP: string
    SHOW_ACTIVITIES_CHANNEL_SELECTOR: string
    SHOW_ACTIVITY_DETAILS: string
    LAST_NITRO_HOST_LEFT: string
    SELECT_ACTIVITY: string
    TOGGLE_CALL_CONTROL_DRAWER: string
    TOGGLE_GUILD_FEED_FEATURED_ITEMS: string
    PREMIUM_SUBSCRIPTION_CREATED: string
    MEDIA_MODAL_CLOSE: string
    VOICE_MESSAGE_PLAYBACK_STARTED: string
    VIDEO_EMBED_PLAYBACK_STARTED: string
    VOICE_PANEL_OPEN: string
    VOICE_PANEL_CLOSE: string
    VOICE_PANEL_TIV_CLOSE: string
    VOICE_PANEL_PIP_CONTENT_READY: string
    MANUAL_IFRAME_RESIZING: string
    NAVIGATOR_READY: string
    CONNECTIONS_CALLBACK_ERROR: string
};

export const QUICKSWITCHER_SELECT = "QUICKSWITCHER_SELECT";
export const QUICKSWITCHER_SEARCH = "QUICKSWITCHER_SEARCH";
export const QUICKSWITCHER_SHOW = "QUICKSWITCHER_SHOW";
export const QUICKSWITCHER_HIDE = "QUICKSWITCHER_HIDE";
export const QUICKSWITCHER_SWITCH_TO = "QUICKSWITCHER_SWITCH_TO";