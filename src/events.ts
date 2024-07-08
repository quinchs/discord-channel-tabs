import {PluginKeybindNames, PluginSettings} from "./settings";
import {Tab} from "./tabs/tabsManager";

export interface PluginEventTypes {
    'settings-updated': [PluginSettings],
    'request-tab-add': [Tab],
    'request-tab-close': [Tab],
    'location-switch': [],
    'tab-quickswitch-complete': [],
    'tab-quickswitch-next': [],
    'tab-quickswitch-prev': [],
    'tab-quickswitch-current': [],
    
    'tab-navigator': [],
    
    'keybind-active': [keyof typeof PluginKeybindNames];
    'keybind-inactive': [keyof typeof PluginKeybindNames];
}

export type PluginEventName = keyof PluginEventTypes;

export type PluginEventHandler<TKey extends PluginEventName> =  (...args: PluginEventTypes[TKey]) => void;

export default class PluginEventBus {
    private eventHandlers: {
        [T in PluginEventName]?: PluginEventHandler<T>[]
    } = {};
    
    subscribe<TKey extends PluginEventName>(key: TKey, handler: PluginEventHandler<TKey>) {
        this.addEventListener(key, handler);
        return () => {
            this.removeEventListener(key, handler);
        }
    }
    
    addEventListener<TKey extends PluginEventName>(key: TKey, handler: PluginEventHandler<TKey>) {
        let handlers = this.eventHandlers[key];
        
        if (!handlers)
            handlers = this.eventHandlers[key] = [];
        
        handlers.push(handler);
    }
    
    removeEventListener<TKey extends PluginEventName>(key: TKey,  handler: PluginEventHandler<TKey>) {
        const handlers = this.eventHandlers[key];
        const targetIndex = handlers?.indexOf(handler);
        
        if (!handlers || targetIndex === -1) return;

        handlers.splice(targetIndex!, 1);
    }
    
    dispatchEvent<TKey extends PluginEventName>(key: TKey, ...args: PluginEventTypes[TKey]) {
        const handlers = this.eventHandlers[key];
        
        if (!handlers) return;
        
        for (const handler of handlers) {
            handler(...args);
        }
    }
}