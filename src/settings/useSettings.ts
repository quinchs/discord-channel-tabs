import Plugin from "../index";
import {useEffect, useState} from "react";
import {PluginSettings} from "../settings";

export const useSettings: (plugin?: Plugin) => PluginSettings = (plugin?: Plugin) => {
    plugin = plugin ?? BdApi.Plugins.get("quinchs-discord") as Plugin;
    
    if (!plugin) throw new Error("Cannot find plugin");
    
    const [settings, setSettings] = useState(plugin.settings);
    const [version, setVersion] = useState<number>();

    useEffect(() => {
        return plugin.events.subscribe('settings-updated', newSettings => {
            console.log("new settings", newSettings);
            setSettings(newSettings);
            setVersion(Date.now);
        })
    }, []);
    
    return settings;
}