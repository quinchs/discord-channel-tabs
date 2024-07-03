import {byFuncString, byFuncStringsInAnyExport} from "../../utils/moduleSearchFilters";
import {guildChannelContextMenuItems} from "./channelContextMenu";
import {createElement, Fragment, MouseEvent, ReactNode} from 'react';

const contextMenuDispatcherModule = (BdApi.Webpack.getModule(
    byFuncStringsInAnyExport(
        "getBoundingClientRect",
        "renderLazy",
        "CONTEXT_MENU_CLOSE"
    ),
    {fatal: true}
)! as any).jW;

export type ContextMenuRenderer = () => Promise<any>;

export const openContextMenu = (event: MouseEvent<HTMLDivElement>, content: ContextMenuRenderer, props: any) => {
    contextMenuDispatcherModule(event, async () => {
        const menu = await content();
        return (p: any) => createElement(Fragment, {
            children: createElement(menu, {
                ...p,
                ...props
            })
        })
    });
}