import {ChatBoxComponentType} from "./discord";
import {ReactNode} from "react";

export const chatInputTypes = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps('OVERLAY', 'SIDEBAR'),
    {fatal: true, searchExports: true}
) as {
    NORMAL: any
    OVERLAY: any
    SIDEBAR: any
    EDIT: any
    FORM: any
    VOICE_CHANNEL_STATUS: any
    THREAD_CREATION: any
    USER_PROFILE: any
    PROFILE_BIO_INPUT: any
    CUSTOM_GIFT: any
    RULES_INPUT: any
    CREATE_FORUM_POST: any
    CREATE_POLL: any
    FORUM_CHANNEL_GUIDELINES: any
    ATOMIC_REACTOR_REPLY_INPUT: any
};

export const tabChatInputType = (() => {
    let type = {...chatInputTypes.NORMAL};
    type.analyticsName = "channel_tab";
    return type;
})();

export const getPlaceholder = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byStrings('placeholder', 'accessibilityLabel'),
    {fatal: true, searchExports: true}
)! as (channel: any) => {
    placeholder: string,
    accessibilityLabel: string;
}

export const getShakeIntensity = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byStrings('shakeLocation', 'getUserComboShakeIntensity'),
    {fatal: true, searchExports: true}
)! as (channel: any) => any;

export const textAreaRelatedClassNames = BdApi.Webpack.getByKeys("buttons", "channelTextArea", "textArea", {fatal: true})! as {
    channelTextArea: string
    highlighted: string
    focusRing: string
    scrollableContainer: string
    themedBackground: string
    indentCharacterCount: string
    textArea: string
    channelTextAreaDisabled: string
    hasConnectedBar: string
    inner: string
    innerDisabled: string
    sansAttachButton: string
    sansAttachButtonCreateThread: string
    sansAttachButtonCreatePost: string
    attachButton: string
    textAreaSlate: string
    textAreaThreadCreation: string
    profileBioInput: string
    textAreaWithoutAttachmentButton: string
    textAreaForPostCreation: string
    textAreaForUserProfile: string
    textAreaCustomGift: string
    textAreaDisabled: string
    buttons: string
    buttonContainer: string
    button: string
    emojiButton: string
    stickerButton: string
    stickerButtonTilted: string
    fontSize12Padding: string
    fontSize14Padding: string
    fontSize15Padding: string
    fontSize16Padding: string
    fontSize18Padding: string
    fontSize20Padding: string
    fontSize24Padding: string
    stackedAttachedBar: string
    attachedBars: string
    expressionPickerPositionLayer: string
    textAreaMobileThemed: string
}

export const chatRelatedClassNames = BdApi.Webpack.getByKeys("chat", "avatar", "chatContent", {fatal: true})! as {
    chat: string
    uploadArea: string
    threadSidebarOpen: string
    threadSidebarFloating: string
    form: string
    chatContent: string
    cursorPointer: string
    content: string
    noChat: string
    channelBottomBarArea: string
    channelTextArea: string
    avatar: string
    parentChannelName: string
    title: string
    followButton: string
    guildBreadcrumbContainer: string
    guildSidebar: string
    guildBreadcrumbIcon: string
    loader: string
    forumPostTitle: string
    subtitleContainer: string
    secureFramesIcon: string
    shaker: string
}

let chatBoxClassComponent: typeof ChatBoxComponentType | undefined = undefined;
export const tryGetChatComponentClass = () => {
    if (chatBoxClassComponent) return chatBoxClassComponent;
    
    const element = document.querySelector(`.${chatRelatedClassNames.channelBottomBarArea}`);
    
    if (!element) return null;
    
    const instance = BdApi.ReactUtils.getInternalInstance(element);
    
    if (!instance) return null;
    
    // @ts-ignore
    const classType = instance?.child?.memoizedProps?.children?.type;
    
    return chatBoxClassComponent = classType as typeof ChatBoxComponentType;
}

const messagesFormatting = BdApi.Webpack.getModule(
    m => m.Messages && m._getParsedMessages && m.Messages.ONE_USER_TYPING, 
    {searchExports: true}
)! as any;

export const formatUsersTyping = (guildId: string | undefined, channelId: string, typingUsers: any[]): ReactNode => {
    if (typingUsers.length === 0) return;

    let [a, b, c] = typingUsers;
    
    switch(typingUsers.length) {
        case 1:
            return messagesFormatting.Messages.ONE_USER_TYPING.format({a});
        case 2:
            return messagesFormatting.Messages.TWO_USERS_TYPING.format({a, b});
        case 3:
            return messagesFormatting.Messages.THREE_USERS_TYPING.format({a, b, c});
        default:
            return messagesFormatting.Messages.SEVERAL_USERS_TYPING;
    }
}