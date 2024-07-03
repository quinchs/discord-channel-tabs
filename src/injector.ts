import {createElement, Fragment} from "react";
import {TabArea} from "./tabs/tabArea";
import Plugin from "./index";
import {Tab} from "./tabs/tabsManager";
import {byModuleStrings} from "./utils/moduleSearchFilters";
import {buildTabsContextMenuItems} from "./tabs/contextMenu";

export const patchChatArea = (plugin: Plugin) => {
    const chatAreaDOMNode = document.querySelector(".chat_a7d72e");
    
    if(!chatAreaDOMNode) return;
    
    const chatArea = BdApi.ReactUtils.getOwnerInstance(chatAreaDOMNode);
    
    if (!chatArea) return;
    
    return BdApi.Patcher.after("quinchs-tabs", chatArea, "renderHeaderBar", (self: any, args: any, returnVal: any) => {
        return createElement(TabArea, null, returnVal);
    });
}

export const patchChannelMenu = (plugin: Plugin) => {
    return BdApi.ContextMenu.patch("channel-context", (returnValue: any, props: any) => {
        const menuElements = buildTabsContextMenuItems(plugin, returnValue, props);
        
        if (!menuElements) return;
        
        returnValue.props.children.push(menuElements);
    });
}
