import Plugin from "./index";
import {buildCloseTabsMenuItems, buildTabsContextMenuItems} from "./tabs/contextMenu";
import {createElement} from "react";
import {TabBar} from "./tabs/tabBar";
import {chatRelatedClassNames} from "./discord/chatBox";

export const patchPopoutTargetElementRef = (plugin: Plugin) => {
    const popoutCommon = BdApi.Webpack.getModule(
        BdApi.Webpack.Filters.byStrings('renderPopout', 'onRequestOpen', 'shouldShow', 'Unexpected position: '),
        {fatal: true, searchExports: true}
    )! as any;
    
    const target = BdApi.Webpack.getByPrototypeKeys('getDomElement', 'setupShowPopout', {searchExports: true});
    
    if (!target || !popoutCommon) return;

    const commonPopoutPatch = BdApi.Patcher.after("quinchs-tabs", popoutCommon.prototype, "render", (instance: any, args: any, returnVal: any) => {
        if (instance?.props?.popoutTargetElementRef && returnVal?.props) {
            returnVal.props.popoutTargetElementRef = instance.props.popoutTargetElementRef;
        }
        
        if (instance?.props?.popoutClassName && returnVal?.props) {
            returnVal.props.popoutClassName = instance.props.popoutClassName;
        }
    });
    
    const getDomElementPatch = BdApi.Patcher.instead("quinchs-tabs", target.prototype, "getDomElement", (instance: any, args: any, original: any) => {
        if (instance?.props?.popoutTargetElementRef) {
            if (instance.domElementRef) {
                instance.domElementRef = instance.props.popoutTargetElementRef;
            }
            return instance?.props?.popoutTargetElementRef.current
        }
        
        return original(args);
    });
    
    const popoutLayerPatch = BdApi.Patcher.after("quinchs-tabs", target.prototype, "renderLayer", (instance: any, args: any, returnVal: any) => {
        if (returnVal?.props?.children?.props && instance?.props?.popoutClassName) {
            returnVal.props.children.props.className = instance.props.popoutClassName;
        }
    })
    
    return () => {
        commonPopoutPatch();
        popoutLayerPatch();
        getDomElementPatch();
    }
}

export const patchChatArea = (plugin: Plugin) => {
    const chatName = chatRelatedClassNames.chat;
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
