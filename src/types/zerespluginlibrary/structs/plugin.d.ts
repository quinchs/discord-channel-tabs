export default class Plugin {
    _config: any;
    _enabled: boolean;
    defaultSettings: {} | undefined;
    settings: any;

    constructor(zplConfig: any);

    get name(): any;

    get description(): any;

    get version(): any;

    get author(): any;

    get isEnabled(): boolean;

    get strings(): any;

    set strings(strings: any);

    getName(): any;

    getDescription(): any;

    getVersion(): any;

    getAuthor(): any;

    start(): Promise<void>;

    stop(): void;

    showSettingsModal(): void;

    showChangelog(footer: any): void;

    saveSettings(settings: any): void;

    loadSettings(defaultSettings: any): object;

    buildSetting(data: any): Settings.Textbox | Settings.ColorPicker | Settings.FilePicker | Settings.Slider | Settings.Switch | Settings.Dropdown | Settings.Keybind | Settings.RadioGroup | null;

    buildSettingsPanel(): Settings.SettingPanel;
}

export function wrapPluginBase(conf: any): {
    new(): {
        readonly name: any;
        readonly description: any;
        readonly version: any;
        readonly author: any;
        getName(): any;
        getDescription(): any;
        getVersion(): any;
        getAuthor(): any;
        readonly isEnabled: boolean;
        strings: any;
        _config: any;
        _enabled: boolean;
        defaultSettings: {} | undefined;
        settings: any;
        start(): Promise<void>;
        stop(): void;
        showSettingsModal(): void;
        showChangelog(footer: any): void;
        saveSettings(settings: any): void;
        loadSettings(defaultSettings: any): object;
        buildSetting(data: any): Settings.Textbox | Settings.ColorPicker | Settings.FilePicker | Settings.Slider | Settings.Switch | Settings.Dropdown | Settings.Keybind | Settings.RadioGroup | null;
        buildSettingsPanel(): Settings.SettingPanel;
    };
};

import * as Settings from "../ui/settings";
