import {createElement, Fragment} from "react";
import {TabArea} from "./tabs/tabArea";
import Plugin from "./index";
import {buildCloseTabsMenuItems, buildTabsContextMenuItems} from "./tabs/contextMenu";

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
    const callback = (returnValue: any, props: any) => {
        let menuElements;

        if (props.tab) {
            menuElements = buildCloseTabsMenuItems(() => {
                plugin.dispatchTabClose(props.tab)
            })
        } else {
            menuElements = buildTabsContextMenuItems(plugin, returnValue, props);
        }

        if (!menuElements) return;

        returnValue.props.children.push(menuElements);
    };
    
    const channelContext = BdApi.ContextMenu.patch("channel-context", callback);
    const userContext = BdApi.ContextMenu.patch("user-context", callback);
    const groupContext = BdApi.ContextMenu.patch("gdm-context", callback);
    
    return () => {
        channelContext();
        userContext();
    }
}
