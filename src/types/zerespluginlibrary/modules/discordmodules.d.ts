import {FunctionComponent, HTMLAttributes} from "react";

export default class DiscordModules {
    get React(): any;

    get ReactDOM(): any;

    get Events(): any;

    /* Guild Info, Stores, and Utilities */
    get GuildStore(): any;

    get SortedGuildStore(): any;

    get SelectedGuildStore(): any;

    get GuildSync(): any;

    get GuildInfo(): any;

    get GuildChannelsStore(): any;

    get GuildMemberStore(): any;

    get MemberCountStore(): any;

    get GuildEmojiStore(): any;

    get GuildActions(): any;

    get GuildPermissions(): any;

    /* Channel Store & Actions */
    get ChannelStore(): any;

    get SelectedChannelStore(): any;

    get ChannelActions(): any;

    get PrivateChannelActions(): any;

    /* Current User Info, State and Settings */
    get UserInfoStore(): any;

    get UserSettingsStore(): any;

    get StreamerModeStore(): any;

    get UserSettingsUpdater(): any;

    get OnlineWatcher(): any;

    get CurrentUserIdle(): any;

    get RelationshipStore(): any;

    get RelationshipManager(): any;

    get MentionStore(): any;

    /* User Stores and Utils */
    get UserStore(): any;

    get UserStatusStore(): any;

    get UserTypingStore(): any;

    get UserActivityStore(): any;

    get UserNameResolver(): any;

    get UserNoteStore(): any;

    get UserNoteActions(): any;

    /* Emoji Store and Utils */
    get EmojiInfo(): any;

    get EmojiUtils(): any;

    get EmojiStore(): any;

    /* Invite Store and Utils */
    get InviteStore(): any;

    get InviteResolver(): any;

    get InviteActions(): any;

    /* Discord Objects & Utils */
    get DiscordConstants(): any;

    get DiscordPermissions(): any;

    get Permissions(): any;

    get ColorConverter(): any;

    get ColorShader(): any;

    get TinyColor(): any;

    get ClassResolver(): any;

    get ButtonData(): any;

    get NavigationUtils(): any;

    get KeybindStore(): any;

    /* Discord Messages */
    get MessageStore(): any;

    get ReactionsStore(): any;

    get MessageActions(): any;

    get MessageQueue(): any;

    get MessageParser(): any;

    /* Experiments */
    get ExperimentStore(): any;

    get ExperimentsManager(): any;

    get CurrentExperiment(): any;

    /* Streams */
    get StreamStore(): any;

    get StreamPreviewStore(): any;

    /* Images, Avatars and Utils */
    get ImageResolver(): any;

    get ImageUtils(): any;

    get AvatarDefaults(): any;

    /* Drag & Drop */
    get DNDSources(): any;

    get DNDObjects(): any;

    /* Electron & Other Internals with Utils*/
    get ElectronModule(): any;

    get Flux(): any;

    get Dispatcher(): any;

    get PathUtils(): any;

    get NotificationModule(): any;

    get RouterModule(): any;

    get APIModule(): any;

    get AnalyticEvents(): any;

    get KeyGenerator(): any;

    get Buffers(): any;

    get DeviceStore(): any;

    get SoftwareInfo(): any;

    get i18n(): any;

    /* Media Stuff (Audio/Video) */
    get MediaDeviceInfo(): any;

    get MediaInfo(): any;

    get MediaEngineInfo(): any;

    get VoiceInfo(): any;

    get SoundModule(): any;

    /* Window, DOM, HTML */
    get WindowInfo(): any;

    get DOMInfo(): any;

    /* Locale/Location and Time */
    get LocaleManager(): any;

    get Moment(): any;

    get LocationManager(): any;

    get Timestamps(): any;

    /* Strings and Utils */
    get Strings(): any;

    get StringFormats(): any;

    get StringUtils(): any;

    /* URLs and Utils */
    get URLParser(): any;

    get ExtraURLs(): any;

    /* Text Processing */
    get hljs(): any;

    get SimpleMarkdown(): any;

    /* DOM/React Components */

    /* ==================== */
    get LayerManager(): any;

    get UserSettingsWindow(): any;

    get ChannelSettingsWindow(): any;

    get GuildSettingsWindow(): any;

    /* Modals */
    get ModalActions(): any;

    get ModalStack(): any;

    get UserProfileModals(): any;

    get AlertModal(): any;

    get ConfirmationModal(): any;

    get ChangeNicknameModal(): any;

    get CreateChannelModal(): any;

    get PruneMembersModal(): any;

    get NotificationSettingsModal(): any;

    get PrivacySettingsModal(): any;

    get Changelog(): any;

    get ModalRoot(): any;

    /* Popouts */
    get PopoutStack(): any;

    get PopoutOpener(): any;

    get UserPopout(): any;

    /* Context Menus */
    get ContextMenuActions(): any;

    get ContextMenuItemsGroup(): any;

    get ContextMenuItem(): any;

    /* Misc */
    get ExternalLink(): any;

    get TextElement(): any;

    get Anchor(): any;

    get Flex(): any;

    get FlexChild(): any;

    get Clickable(): any;

    get Titles(): any;

    get HeaderBar(): any;

    get TabBar(): any;

    get Tooltip(): any;

    get Spinner(): any;

    /* Forms */
    get FormTitle(): any;

    get FormSection(): any;

    get FormNotice(): any;

    /* Scrollers */
    get ScrollerThin(): FunctionComponent<HTMLAttributes<HTMLDivElement> & {
        orientation: string;
        fade?: boolean;
    }>;

    get ScrollerAuto(): FunctionComponent<any>;

    get AdvancedScrollerThin(): any;

    get AdvancedScrollerAuto(): any;

    get AdvancedScrollerNone(): any;

    /* Settings */
    get SettingsWrapper(): any;

    get SettingsNote(): any;

    get SettingsDivider(): any;

    get ColorPicker(): any;

    get Dropdown(): any;

    get Keybind(): any;

    get RadioGroup(): any;

    get Slider(): any;

    get SwitchRow(): any;

    get Textbox(): any;
}
