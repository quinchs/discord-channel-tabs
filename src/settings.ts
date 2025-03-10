﻿import {KeyBind} from "./discord";

export interface PluginSettings {
    keybinds: PluginKeybinds;
    showPopouts: boolean;
    popoutDelay: number;
    keybindsActive: boolean
}

export const PluginKeybindNames = {
    'quick-switch-next-tab': {
        group: 'Quick Switch',
        title: "Next Tab",
        summary: "Selects the next tab"
    },
    'quick-switch-start': {
        group: "Quick Switch",
        title: "Start QuickSwitch",
        summary: "Starts a quick switch, releasing this key will end the quick switch, navigating to whatever tab was selected",
    },
    'quick-switch-prev-tab': {
        group: "Quick Switch",
        title: "Previous Tab",
        summary: "Selects the previous tab"
    },
    'quick-switch-current-tab': {
        group: "Quick Switch",
        title: "Current Tab",
        summary: "Selects the current open tab"
    },
    'tab-navigator': {
        group: "Tab Bar",
        title: "Open New Tab Navigator",
        summary: "Opens the navigator for adding a new tab"
    }
};

export type PluginKeybinds = {
    [T in keyof typeof PluginKeybindNames]?: KeyBind;
}

export const DefaultSettings: PluginSettings = {
    showPopouts: true,
    keybinds: {
        "tab-navigator": [
            [
                0,
                162,
                "0:0"
            ],
            [
                0,
                160,
                "0:0"
            ],
            [
                0,
                75,
                "0:0"
            ]
        ]
    },
    popoutDelay: 600,
    keybindsActive: true
}

export const fixSettings = (settings: PluginSettings) => {
    for (const key in settings) {
        // @ts-ignore
        if (settings[key] === undefined) {
            // @ts-ignore
            settings[key] = DefaultSettings[key];
        }
    }
}

export const loadSettingsData = () => {
    let settings = BdApi.Data.load("quinchs-tabs", "settings") as PluginSettings;
    console.log("LOAD SETTINGS", settings);
    if (!settings)
        settings = DefaultSettings;
    fixSettings(settings);
    return settings;
};

export const saveSettingsData = (settings: PluginSettings) => BdApi.Data.save("quinchs-tabs", "settings", {
    ...settings,
    keybinds: Object.fromEntries(Object.entries(settings.keybinds))
});
