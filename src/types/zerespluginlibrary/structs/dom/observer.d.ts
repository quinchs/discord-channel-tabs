export default DOMObserver;

/**
 * Representation of a MutationObserver but with helpful utilities.
 * @memberof module:DOMTools
 **/
declare class DOMObserver {
    active: boolean;
    observer: MutationObserver;

    constructor(root: any, options: any);

    _root: any;

    get root(): any;

    set root(root: any);

    _options: any;

    get options(): any;

    set options(options: any);

    _subscriptions: any[] | undefined;

    get subscriptions(): any[];

    /**
     * Starts observing the element. This will be called when attaching a callback.
     * You don't need to call this manually.
     */
    observe(): void;

    /**
     * Subscribes to mutations.
     * @param {Function} callback A function to call when on a mutation
     * @param {Function} filter A function to call to filter mutations
     * @param {Any} bind Something to bind the callback to
     * @param {Boolean} group Whether to call the callback with an array of mutations instead of a single mutation
     * @return {Object}
     */
    subscribe(callback: Function, filter: Function, bind: Any, group: boolean): Object;

    observerCallback(mutations: any): void;

    /**
     * Disconnects this observer. This stops callbacks being called, but does not unbind them.
     * You probably want to use observer.unsubscribeAll instead.
     */
    disconnect(): void;

    reconnect(): void;

    /**
     * Removes a subscription and disconnect if there are none left.
     * @param {Object} subscription A subscription object returned by observer.subscribe
     */
    unsubscribe(subscription: Object): void;

    unsubscribeAll(): void;

    /**
     * Subscribes to mutations that affect an element matching a selector.
     * @param {Function} callback A function to call when on a mutation
     * @param {Function} filter A function to call to filter mutations
     * @param {Any} bind Something to bind the callback to
     * @param {Boolean} group Whether to call the callback with an array of mutations instead of a single mutation
     * @return {Object}
     */
    subscribeToQuerySelector(callback: Function, selector: any, bind: Any, group: boolean): Object;
}
