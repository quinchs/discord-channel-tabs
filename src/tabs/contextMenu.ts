import {Tab} from "./tabsManager";
import Plugin from "../index";

export const buildCloseTabsMenuItems = (onClose: () => void) => {
    return BdApi.ContextMenu.buildMenuChildren([{
        type: "group",
        items: [{
            type: "text",
            label: "Close tab",
            onClick: onClose
        }]
    }])
}

export const buildTabsContextMenuItems = (plugin: Plugin, menu: any, props: any) => {
    console.log("Constructing menu", menu, props);
    
    return BdApi.ContextMenu.buildMenuChildren([{
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
    }]);
}