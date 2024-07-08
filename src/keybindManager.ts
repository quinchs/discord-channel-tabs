import Plugin from "./index";
import {formatKeybind, keyCodesFromString, ParsedKeybind, parseKeybind} from "./discord/keybinds";
import {iterateKeys} from "./utils/typeUtils";
import {PluginKeybindNames, PluginSettings} from "./settings";
import {KeyBind} from "./discord";

export default class KeybindManager {
    private plugin: Plugin;
    private keystates: Set<number> = new Set<number>();
    private activeBinds: Set<keyof typeof PluginKeybindNames> = new Set();
    
    private static modifiers = [
        'meta',
        'ctrl',
        'shift',
        'alt'
    ]
    private static modifierKeyCodes = new Map(this.modifiers.map(value => [value, keyCodesFromString(value)]));
    
    private parsedKeybinds: {
        id: keyof typeof PluginKeybindNames,
        combo: KeyBind
    }[];

    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this.parsedKeybinds = this.parseKeybindsFromSettings(plugin.settings);
        
        plugin.events.addEventListener('settings-updated', settings => {
            this.parsedKeybinds = this.parseKeybindsFromSettings(plugin.settings);
        })
    }
    
    private parseKeybindsFromSettings(settings: PluginSettings) {
        return iterateKeys(settings.keybinds).map(id => ({
            id,
            combo: settings.keybinds[id]!
        }))
    }

    register() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    unregister() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    
    private handleKeystatesUpdated(event: KeyboardEvent) {
        if (!this.plugin.settings.keybindsActive) return;
        
        const comboMatchesState = (combo: KeyBind) => {
            for (const key of combo) {
                if (!this.keystates.has(key[1])) return false;
            }
            
            return true;
        }
        
        const comboHasNonModifier = (combo: KeyBind) => {
            for (const [,key,] of combo) {
                if (![...KeybindManager.modifierKeyCodes.values()].map(value => value[0][1]).includes(key)) return true;
            }
            
            return false;
        }
        
        for (const keybind of this.parsedKeybinds) {
            if (comboMatchesState(keybind.combo)) {
                if (!this.activeBinds.has(keybind.id)) {
                    this.plugin.events.dispatchEvent('keybind-active', keybind.id);
                    this.activeBinds.add(keybind.id);
                }
                
                if (comboHasNonModifier(keybind.combo)) event.preventDefault();
            } else if (this.activeBinds.has(keybind.id)) {
                this.plugin.events.dispatchEvent('keybind-inactive', keybind.id);
                this.activeBinds.delete(keybind.id);
            }
        }
    }
    
    private handleKeyUp(event: KeyboardEvent) {
        this.keystates.delete(this.getKeyCode(event));
        this.updateModifierStates(event);
        this.handleKeystatesUpdated(event);
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (!event.getModifierState(event.key))
            this.keystates.add(this.getKeyCode(event));
        
        this.updateModifierStates(event);
        this.handleKeystatesUpdated(event);
    }
    
    private updateModifierStates(event: KeyboardEvent) {
        for (const [modifier, [[,keycode,]]] of KeybindManager.modifierKeyCodes) {
            // @ts-ignore
            if (event[`${modifier}Key`] as boolean)
                this.keystates.add(keycode);
            else
                this.keystates.delete(keycode);
        }
    }

    private getKeyCode(event: KeyboardEvent) {
        return event.which || event.keyCode || event.charCode;
    }
}