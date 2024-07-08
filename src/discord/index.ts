import {byFuncString} from "../utils/moduleSearchFilters";
import {
    ComponentClass, CSSProperties,
    DetailedHTMLProps,
    ForwardRefExoticComponent, FunctionComponent, HTMLAttributes, MemoExoticComponent, MutableRefObject,
    PropsWithChildren,
    PropsWithoutRef, ReactNode, Ref,
    RefAttributes
} from "react";

const messagesActor = BdApi.Webpack.getByKeys("jumpToMessage", "_sendMessage", {fatal: true})! as any;
const privateChannelsActor = BdApi.Webpack.getByKeys("getOrEnsurePrivateChannel", {fatal: true})! as any;
const channelsActor = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("selectChannel"))! as any;
const guildsActor = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("transitionToGuildSync"))! as any;
export const commonUI = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("PlusMediumIcon", "Shakeable", "List")) as any;

const guildChannelResolver = Object.values(BdApi.Webpack.getModule(
    byFuncString("shouldShowOnboarding", "getDefaultChannel"),
    {fatal: true}
) as any)[0]! as (e: string) => string;

export const fetchMessages = (channelId: string): Promise<void> => {
    return messagesActor.fetchMessages({ channelId,  limit: 50});
}

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

export const PlusIconMedium = commonUI.PlusMediumIcon;
export const PlusIconSmall = commonUI.PlusSmallIcon;
export const Popout = commonUI.Popout as ComponentClass<{
    shouldShow?: boolean,
    position?: "top" | "bottom" | "left" | "right" | "center" | "window_center",
    onRequestClose?: Function,
    onRequestOpen?: Function
    align: "left" | "top" | "center",
    autoInvert?: boolean,
    renderPopout: Function,
    spacing?: number,
    disablePointerEvents?: boolean,
    children: Function,
    animation?: "1" | "2" | "3" | "4",
    popoutTargetElementRef?: MutableRefObject<HTMLElement | null>,
    popoutClassName?: string
    preload?: () => Promise<void>
}>;

export const PinToBottomScrollerAuto = commonUI.PinToBottomScrollerAuto as ForwardRefExoticComponent<
    PropsWithChildren<{
        onResize: Function,
        onScroll: Function,
        contentClassName?: string, 
        dir?: string, 
        fade?: boolean
    }> & 
    PropsWithoutRef<HTMLAttributes<HTMLDivElement>> &
    RefAttributes<HTMLElement>
>

export const Navigator = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("QUICKSWITCHER_SHOW")) as any;
export const useStateFromStores = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byStrings('useStateFromStores'), {searchExports: true, fatal: true}
)! as <T>(stores: any[], func: () => T, dependencies?: any[]) => T;

export const getChannelStream = BdApi.Webpack.getByStrings(
    'oldestUnreadMessageId', 'MESSAGE_GROUP_BLOCKED',
    {fatal: true}
)! as (props: {
    channel: any,
    messages: any[],
    oldestUnreadMessageId: any,
    treatSpam?: any,
    summaries?: any,
    selectedSummary?: any
}) => any[];

export const ChannelStreamItemTypes = BdApi.Webpack.getByKeys(
    'MESSAGE', 'DIVIDER', 
    {searchExports: true, fatal: true}
)! as {
    DIVIDER: string,
    DIVIDER_NEW_MESSAGES: string,
    DIVIDER_TIME_STAMP: string,
    FORUM_POST_ACTION_BAR: string,
    JUMP_TARGET: string,
    MESSAGE: string,
    MESSAGE_GROUP: string,
    MESSAGE_GROUP_BLOCKED: string,
    MESSAGE_GROUP_SPAMMER: string,
    THREAD_STARTER_MESSAGE: string
};

export const MessageDivider = BdApi.Webpack.getModule(
    m => BdApi.Webpack.Filters.byStrings('divider', 'isBeforeGroup')(m?.type?.render), 
    {fatal: true}
)! as MemoExoticComponent<ForwardRefExoticComponent<PropsWithChildren<{
    isBeforeGroup?: boolean, 
    isUnread?: boolean
    contentClassName?: string
    cut?: boolean
} & HTMLAttributes<HTMLDivElement>>>>;

export const ThreadStarterMessage = BdApi.Webpack.getByStrings(
    'must be a thread starter message', 
    {searchExports: true, fatal: true}
)! as FunctionComponent<{
    id?: string
    channel: any
    message: any
    groupId?: string, 
    compact?: boolean
}>;

export const Message = BdApi.Webpack.getModule(
    module => BdApi.Webpack.Filters.byStrings('must not be a thread starter message')(module?.type),
    {searchExports: true, fatal: true}
)! as MemoExoticComponent<FunctionComponent<{
    id?: string
    channel: any
    message: any
    groupId?: string,
    compact?: boolean
}>>;

export const EmptyMessage = BdApi.Webpack.getByStrings(
    'SYSTEM_DM_EMPTY_MESSAGE', 'BEGINNING_CHANNEL_WELCOME', 
    {fatal: true}
)! as FunctionComponent<{
    channel: any, 
    showingBanner?: boolean
}>;

export enum KeyCodeType {
    KeyboardKey,
    MouseButton,
    KeyboardKeyModifier,
    GamepadButton
}

export type KeyCode = [type: KeyCodeType, code: number, platform: number | string | null];
export type KeyBind = KeyCode[];

export const KeybindInput = BdApi.Webpack.getByStrings(
    "inputCaptureRegisterElement", 
    {fatal: true}
)! as ComponentClass<{
    disabled?: boolean, 
    onChange: (value: KeyBind) => void;
    defaultValue: KeyBind;
}>;

export const FormToggleSwitch = commonUI.FormSwitch as FunctionComponent<PropsWithChildren<{
    value: boolean,
    disabled?: boolean,
    hideBorder?: boolean,
    tooltipNode?: string,
    onChange: (value: boolean) => void,
    className?: string,
    style?: CSSProperties,
    note?: string
}>>;

export const FormText = BdApi.Webpack.getByStrings(
    "DEFAULT", "SELECTABLE", "DISABLED", "disabled", "type", 
    {searchExports: true}
)! as FunctionComponent<PropsWithChildren<{ 
    type?: "default" | "placeholder" | "description" | "labelBold" | "labelSelected" | "labelDescriptor" | "error" | "success",
    disabled?: boolean,
    selectable?: "modeDefault" | "modeDisabled" | "modeSelectable"
}> & HTMLAttributes<HTMLElement>>


export const FormHeader = BdApi.Webpack.getByStrings(
    "legend", "h5", {searchExports: true, fatal: true}
)! as FunctionComponent<PropsWithChildren<{
    tag?: "legend" | "label" | string, 
    faded?: boolean,
    disabled?: boolean,
    required?: boolean,
    error?: any, 
    errorId?: string,
}> & HTMLAttributes<HTMLElement>>;

export const FormInput = BdApi.Webpack.getByStrings(
    "inputPrefix", "disabled", "editable", "onChange", "inputWrapper", 
    {searchExports: true, fatal: true},
)! as ComponentClass<{
    inputClassName?: string,
    onChange: (value: string) => void;
    inputPrefix?: ReactNode,
    disabled?: boolean, 
    size?: string, 
    editable?: boolean, 
    inputRef?: Ref<HTMLInputElement>,
    prefixElement?: ReactNode,
    focusProps?: any, 
    value?: string, 
} & Omit<HTMLAttributes<HTMLInputElement>, 'onChange'>>;
