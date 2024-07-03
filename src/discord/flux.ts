import {ComponentType, ForwardRefExoticComponent} from "react";

/**
 * Discords HoC component for wrapping a FluxContainer
 * @param stores The stores you want to subscribe to
 * @param map A function to map props & store data
 */
export const connectStores = <T, U>(
    stores: any[],
    map: (props: U) => T
): (comp: ComponentType<U & T>) => ForwardRefExoticComponent<U> => {
    return ZLibrary.DiscordModules.Flux.connectStores(stores, map, {
        forwardRef: true
    });
}