import Plugin from "./index";
import {buildCloseTabsMenuItems, buildTabsContextMenuItems} from "./tabs/contextMenu";
import {createElement} from "react";
import {TabBar} from "./tabs/tabBar";

export const patchChatArea = (plugin: Plugin) => {
    const chatName = BdApi.Webpack.getByKeys("chat", "avatar", "chatContent", {fatal: true}).chat;
    const chatAreaDOMNode = document.querySelector(`.${chatName}`);

    if (!chatAreaDOMNode) return;

    const chatArea = BdApi.ReactUtils.getOwnerInstance(chatAreaDOMNode);

    if (!chatArea) return;

    return BdApi.Patcher.after("quinchs-tabs", chatArea, "render", (self: any, args: any, returnVal: any) => {
        console.log("RENDER", self, args, returnVal);

        const target = BdApi.Utils.findInTree(
            returnVal,
            (prop: any) => prop?.className === chatName,
            {
                walkable: ["props", "children"],
            }
        );
        
        if (!target) return;

        target.children.unshift(createElement(TabBar))
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
        groupContext();
    }
}
