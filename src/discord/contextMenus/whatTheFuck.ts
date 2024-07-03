import {FunctionComponent} from "react";

export default (BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("MenuItem", "Menu")) as any).Menu as FunctionComponent<{
    navId: string, 
    variant?: string, 
    hideScrollbar?: boolean,
    className?: string, 
    children: any[], // pass 0 children :)
    onClose?: Function,
    onSelect?: Function
}>
    