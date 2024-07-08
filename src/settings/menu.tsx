/** @jsx jsx */
/** @jsxFrag */
import {jsx} from '@emotion/react'
import {useSettings} from "./useSettings";
import styled from "@emotion/styled";
import {FormHeader, FormInput, FormText, FormToggleSwitch, KeybindInput} from '../discord';
import Plugin from "../index";
import {PluginKeybindNames, PluginSettings} from "../settings";
import {KeybindClassNames} from "../discord/keybinds";
import {iterateKeys} from "../utils/typeUtils";

type Props = {
    plugin: Plugin
};

const MenuContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`

const MenuControlsContainer = styled.div`
    padding-bottom: 20px;
`;

const Row = styled.div`
    margin-bottom: 20px;
    padding-bottom: 20px;
`

const renderKeybinds = (settings: PluginSettings, plugin: Plugin) => {
    const grouped = Object.groupBy(iterateKeys(PluginKeybindNames), value => PluginKeybindNames[value].group);

    return iterateKeys(grouped).map(group => {
        return (
            <div className={KeybindClassNames.keybindGroup}>
                <FormHeader tag={'h3'}>{group}</FormHeader>
                {grouped[group]?.map(keybindIdentifier => {
                    const {summary, title} = PluginKeybindNames[keybindIdentifier];
                    return (
                        <Row className={KeybindClassNames.row}>
                            <FormHeader tag={'legend'}>{title}</FormHeader>
                            <KeybindInput
                                onChange={keybind => {
                                    settings.keybinds[keybindIdentifier] = keybind;
                                    plugin.saveSettings(settings);
                                }}
                                defaultValue={settings.keybinds[keybindIdentifier] ?? []}
                            />
                            <FormText type={"description"}>{summary}</FormText>
                        </Row>
                    )
                })}
            </div>
        )
    })
}

export const Menu = ({plugin}: Props) => {
    const settings = useSettings(plugin);

    return (
        <MenuContainer>
            <FormHeader tag={'h1'}>Popouts</FormHeader>
            <MenuControlsContainer>
                <FormToggleSwitch
                    value={settings.showPopouts}
                    note={"Whether to display popouts when hovering a tab."}
                    onChange={value => {
                        settings.showPopouts = value;
                        plugin.saveSettings(settings);
                    }}
                >
                    Tab Popouts
                </FormToggleSwitch>
                <FormHeader>Popout delay</FormHeader>
                <FormInput
                    value={settings.popoutDelay.toString()}
                    onChange={value => {
                        settings.popoutDelay = Number.parseInt(value)
                        plugin.saveSettings(settings);
                    }}
                />
                <FormText type={"description"}>The delay to wait in milliseconds before showing the popout</FormText>
            </MenuControlsContainer>
            <FormHeader tag={'h1'}>Keybinds</FormHeader>
            <MenuControlsContainer>
                <FormToggleSwitch
                    value={settings.keybindsActive}
                    note={"Whether keybinds for tabs are enabled."}
                    onChange={value => {
                        settings.keybindsActive = value;
                        plugin.saveSettings(settings);
                    }}
                >
                    Enable Keybinds
                </FormToggleSwitch>
                {renderKeybinds(settings, plugin)}
            </MenuControlsContainer>
        </MenuContainer>
    );
};