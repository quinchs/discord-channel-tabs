import {ComponentType, ForwardRefExoticComponent} from "react";

const flux = BdApi.Webpack.getModule(
    BdApi.Webpack.Filters.byProps("Store", "connectStores"),
    {fatal: true}
)! as any;

/**
 * Discords HoC component for wrapping a FluxContainer
 * @param stores The stores you want to subscribe to
 * @param map A function to map props & store data
 */
export const connectStores = <T, U>(
    stores: any[],
    map: (props: U) => T
): (comp: ComponentType<U & T>) => ForwardRefExoticComponent<U> => {
    return flux.connectStores(stores, map, {
        forwardRef: true
    });
}