export default SettingPanel;

/**
 * Grouping of controls for easier management in settings panels.
 * @memberof module:Settings
 */
declare class SettingPanel extends Listenable {
    element: HTMLElement | DocumentFragment | NodeList;

    /**
     * Creates a new settings panel
     * @param {callable} onChange - callback to fire when settings change
     * @param {(...HTMLElement|...jQuery|...module:Settings.SettingField|...module:Settings.SettingGroup)} nodes  - list of nodes to add to the panel container
     */
    constructor(onChange: Function, ...nodes: any);

    /**
     * Creates a new settings panel
     * @param {callable} onChange - callback to fire when settings change
     * @param {(...HTMLElement|...jQuery|...module:Settings.SettingField|...module:Settings.SettingGroup)} nodes  - list of nodes to add to the panel container
     * @returns {HTMLElement} - root node for the panel.
     */
    static build(onChange: Function, ...nodes: any): HTMLElement;

    /** Fires onchange to listeners */
    onChange(...args: any[]): void;

    /** @returns {HTMLElement} - root node for the panel. */
    getElement(): HTMLElement;

    /**
     * Adds multiple nodes to this panel.
     * @param {(...HTMLElement|...jQuery|...SettingField|...SettingGroup)} nodes - list of nodes to add to the panel container
     * @returns {module:Settings.SettingPanel} - returns self for chaining
     */
    append(...nodes: any): any;
}

import Listenable from "../../structs/listenable";
