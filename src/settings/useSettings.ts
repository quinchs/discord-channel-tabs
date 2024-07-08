import {PluginContext} from "../index";
import {useContext, useEffect, useState} from "react";
import {PluginSettings} from "../settings";

export const useSettings: () => PluginSettings = () => {
    const plugin = useContext(PluginContext);
    
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