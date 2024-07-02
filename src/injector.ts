import {createElement, Fragment} from "react";
import {TabArea} from "./tabs/tabArea";
import Plugin from "./index";
import {Tab} from "./tabs/tabsManager";

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
        returnValue.props.children.push(
            BdApi.ContextMenu.buildMenuChildren([{
                type: "group",
                items: [{
                    type: "text",
                    label: "Open in new tab",
                    //@ts-ignore
                    onClick: newValue => {
                        if (!props.channel) return;
                        
                        const tab: Tab = {
                            name: props.channel.name, 
                            channelId: props.channel.id,
                            guildId: props.channel.guild_id,
                        };
                        
                        console.log(plugin,  tab);
                        plugin.dispatchTabAdd(tab);
                    }
                }]
            }])
        )
    });
}
