import {createTabFromChannel} from "./tabsManager";
import Plugin from "../index";
import {getOrCreatePrivateChannelForUser} from "../discord";

export const buildCloseTabsMenuItems = (onClose: () => void) => {
    return BdApi.ContextMenu.buildMenuChildren([{
        type: "group",
        items: [{
            type: "text",
            label: "Close Tab",
            onClick: onClose
        }]
    }])
}

export const buildTabsContextMenuItems = (plugin: Plugin, menu: any, props: any) => {
    return BdApi.ContextMenu.buildMenuChildren([{
        type: "group",
        items: [{
            type: "text",
            label: props.user ? "Open DM in New Tab" : "Open Channel in New Tab",
            //@ts-ignore
            onClick: async () => {
                if (props.user) {
                    const dmChannelId = await getOrCreatePrivateChannelForUser(props.user.id);

                    plugin.events.dispatchEvent('request-tab-add', {
                        channelId: dmChannelId,
                        name: props.user.globalName ?? props.user.username,
                        userId: props.user.id
                    })
                } else if (props.channel) {
                    const tab = createTabFromChannel(props.channel);
                    if (!tab) return;
                    plugin.events.dispatchEvent('request-tab-add', tab)
                }
            }
        }]
    }]);
}