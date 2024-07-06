import {patchChannelMenu, patchChatArea, patchPopoutTargetElementRef} from "./injector";
import {Tab} from "./tabs/tabsManager";

interface DynamicPatches {
    [id: string]: () => void;
}

export default class Plugin extends EventTarget {
    patchesAppliedSuccessfully = false;

    patches: ((plugin: Plugin) => any | undefined)[] = [
        patchChatArea,
        patchChannelMenu,
        patchPopoutTargetElementRef,
    ];
    cleanUpFunctions: (() => void)[] = [];
    dynamicPatches: DynamicPatches = {};
    
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

    onTabSelectComplete(handler: () => void): () => void {
        this.addEventListener('tab-select-complete', handler)
        return () => this.removeEventListener('tab-select-complete', handler);
    }
    
    onNextTabSelect(handler: () => void): () => void {
        this.addEventListener('next-tab-select', handler);
        return () => this.removeEventListener('next-tab-select', handler);
    }
    
    onPreviousTabSelect(handler: () => void): () => void {
        this.addEventListener('previous-tab-select', handler);
        return () => this.removeEventListener('previous-tab-select', handler);
    }
    
    onCurrentTabSelect(handler: () => void): () => void {
        this.addEventListener('current-tab-select', handler);
        return () => this.removeEventListener('current-tab-select', handler);
    }
    
    dispatchCurrentTabSelect() {
        this.dispatchEvent(new Event('current-tab-select'));
    }
    
    dispatchPreviousTabSelect() {
        this.dispatchEvent(new Event('previous-tab-select'));
    }
    
    dispatchNextTabSelect() {
        this.dispatchEvent(new Event('next-tab-select'));
    }
    
    dispatchTabSelectComplete() {
        this.dispatchEvent(new Event('tab-select-complete'));
    }
    
    addDynamicPatch(id: string, patcher: () => (() => void) | undefined) {
        if (id in this.dynamicPatches) return;
        const unpatchFunc = patcher();
        if (unpatchFunc) this.dynamicPatches[id] = unpatchFunc;
    }
    
    start() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        this.patchesAppliedSuccessfully = this.applyPatches(...this.patches);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp)
    }

    stop() {
        this.cleanUpFunctions.forEach(x => x());
        for (const id in this.dynamicPatches) {
            this.dynamicPatches[id]?.();
        }
        BdApi.Patcher.unpatchAll('quinchs-tabs');
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    
    handleKeyUp(event: KeyboardEvent) {
        if (event.key === "Control") {
            this.dispatchTabSelectComplete();
        }
    }
    
    handleKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey) {
            switch (event.key) {
                case "a":
                    this.dispatchPreviousTabSelect();
                    event.preventDefault();
                    return;
                case "d":
                    this.dispatchNextTabSelect();
                    event.preventDefault();
                    return;
                case "w":
                    this.dispatchCurrentTabSelect();
                    event.preventDefault();
                    return;
            }
        }
    }

    onSwitch() {
        this.dispatchEvent(new Event('location-switch'));

        if (!this.patchesAppliedSuccessfully) {
            this.patchesAppliedSuccessfully = this.applyPatches(...this.patches);
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