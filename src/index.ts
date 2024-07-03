import {patchChannelMenu, patchChatArea} from "./injector";
import {Tab} from "./tabs/tabsManager";
import {subscribeToDiscordAction, unsubscribeFromDiscordAction} from "./discord/actionLogger";
import {getDiscordsInternalRequire} from "./discord/require";

export default class Plugin extends EventTarget {
    patchesAppliedSuccessfully = false;
    
    patches: ((plugin: Plugin) => any | undefined)[] = [
        patchChatArea,
        patchChannelMenu,
    ];
    cleanUpFunctions: (() => void)[] = [];

    dispatchTabAdd(tab: Tab) {
        this.dispatchEvent(new CustomEvent('tab-add', {
            detail: tab
        }))
    }

    dispatchTabClose(tab: Tab) {
        this.dispatchEvent(new CustomEvent('tab-close', {
            detail: tab
        }));
    }
    
    onTabAdd(handler: (tab: Tab) => void): () => void {
        // @ts-ignore
        const listener = evt => handler(evt.detail);
        this.addEventListener('tab-add', listener)
        return () => this.removeEventListener('tab-add', listener);
    }
    
    onTabClose(handler: (tab: Tab) => void): () => void {
        // @ts-ignore
        const listener = evt => handler(evt.detail);
        
        this.addEventListener('tab-close', listener);
        return () => this.removeEventListener('tab-close', listener);
    }
    
    onLocationSwitch(handler: () => void): () => void {
        this.addEventListener('location-switch', handler)
        return () => this.removeEventListener('location-switch', handler);
    }
    
    start() {
        this.patchesAppliedSuccessfully = this.applyPatches(...this.patches);
    }

    stop() {
        this.cleanUpFunctions.forEach(x => x());
        BdApi.Patcher.unpatchAll('quinchs-tabs');
    }

    onSwitch() {
        this.dispatchEvent(new Event('location-switch'));

        if (!this.patchesAppliedSuccessfully){
            this.patchesAppliedSuccessfully = this.applyPatches(...this.patches);
        }
    }
    
    private applyPatches(...patches: ((plugin: Plugin) => () => void | undefined)[]): boolean {
        BdApi.Patcher.unpatchAll("quinchs-tabs");
        
        for (const p of patches) {
            const cleanUp = p(this);
            if(!cleanUp) return false;
            this.cleanUpFunctions.push(cleanUp);
        }
        
        return true;
    }
}