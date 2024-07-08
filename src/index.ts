import {patchChannelMenu, patchChatArea, patchPopoutTargetElementRef} from "./injector";
import {Tab} from "./tabs/tabsManager";
import {createContext, createElement} from "react";
import {Menu} from "./settings/menu";
import {DefaultSettings, loadSettingsData, PluginKeybindNames, PluginSettings, saveSettingsData} from "./settings";
import PluginEventBus from "./events";
import KeybindManager from "./keybindManager";

interface DynamicPatches {
    [id: string]: () => void;
}

export const PluginContext = createContext<Plugin>(null!);

export default class Plugin {
    private _settings: PluginSettings = loadSettingsData() ?? DefaultSettings;
    private _events: PluginEventBus = new PluginEventBus();
    private _keybindManager = new KeybindManager(this);
    
    private patchesAppliedSuccessfully = false;
    private patches: ((plugin: Plugin) => any | undefined)[] = [
        patchChatArea,
        patchChannelMenu,
        patchPopoutTargetElementRef,
    ];
    private cleanUpFunctions: (() => void)[] = [];
    private dynamicPatches: DynamicPatches = {};
    
    get settings(): PluginSettings {
        return this._settings;
    }
    
    get events(): PluginEventBus {
        return this._events;
    }
    
    constructor() {
        this.handleKeybindActive = this.handleKeybindActive.bind(this);
        this.handleKeybindInactive = this.handleKeybindInactive.bind(this);
    }
    
    saveSettings(newSettings: PluginSettings) {
        saveSettingsData(newSettings);
        this._settings = newSettings;
        this.events.dispatchEvent('settings-updated', this._settings);
    }
    
    addDynamicPatch(id: string, patcher: () => (() => void) | undefined) {
        if (id in this.dynamicPatches) return;
        const unpatchFunc = patcher();
        if (unpatchFunc) this.dynamicPatches[id] = unpatchFunc;
    }
    
    start() {
        this._keybindManager.register();
        this.patchesAppliedSuccessfully = this.applyPatches(...this.patches);
        
        this.events.addEventListener('keybind-active', this.handleKeybindActive);
        this.events.addEventListener('keybind-inactive', this.handleKeybindInactive);
    }

    stop() {
        this._keybindManager.unregister();
        
        this.cleanUpFunctions.forEach(x => x());
        for (const id in this.dynamicPatches) {
            this.dynamicPatches[id]?.();
        }
        BdApi.Patcher.unpatchAll('quinchs-tabs');
    }
    
    onSwitch() {
        this.events.dispatchEvent('location-switch');
        //this.dispatchEvent(new Event('location-switch'));

        if (!this.patchesAppliedSuccessfully) {
            this.patchesAppliedSuccessfully = this.applyPatches(...this.patches);
        }
    }
    
    getSettingsPanel() {
        return createElement(PluginContext.Provider, {
            value: this,
            children: createElement(Menu)
        });
    }
    
    private handleKeybindActive(id: keyof typeof PluginKeybindNames) {
        switch (id) {
            case "quick-switch-next-tab":
                this.events.dispatchEvent('tab-quickswitch-next');
                break;
            case 'quick-switch-prev-tab':
                this.events.dispatchEvent('tab-quickswitch-prev');
                break;
            case 'quick-switch-current-tab':
                this.events.dispatchEvent('tab-quickswitch-current');
                break;
            case 'tab-navigator':
                this.events.dispatchEvent('tab-navigator');
                break;
        }
    }
    
    private handleKeybindInactive(id: keyof typeof PluginKeybindNames) {
        if (id === 'quick-switch-start') {
            this.events.dispatchEvent('tab-quickswitch-complete');
        }
    }

    private applyPatches(...patches: ((plugin: Plugin) => () => void | undefined)[]): boolean {
        BdApi.Patcher.unpatchAll("quinchs-tabs");

        for (const p of patches) {
            const cleanUp = p(this);
            if (!cleanUp) return false;
            this.cleanUpFunctions.push(cleanUp);
        }

        return true;
    }
}