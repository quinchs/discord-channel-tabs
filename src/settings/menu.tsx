/** @jsx jsx */
/** @jsxFrag */
import {jsx} from '@emotion/react'
import {useSettings} from "./useSettings";
import styled from "@emotion/styled";
import {FormHeader, FormInput, FormText, FormToggleSwitch, KeybindInput} from '../discord';
import Plugin, {PluginContext} from "../index";
import {PluginKeybindNames, PluginSettings} from "../settings";
import {iterateKeys} from "../utils/typeUtils";
import React, {useContext} from 'react';

type Props = {
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
    box-shadow: inset 0 -1px 0 hsl(var(--primary-400-hsl)/.3)
`

const renderKeybinds = (settings: PluginSettings, plugin: Plugin) => {
    const grouped = Object.groupBy(iterateKeys(PluginKeybindNames), value => PluginKeybindNames[value].group);

    return iterateKeys(grouped).map(group => {
        return (
            <>
                <FormHeader tag={'h3'}>{group}</FormHeader>
                {grouped[group]?.map(keybindIdentifier => {
                    const {summary, title} = PluginKeybindNames[keybindIdentifier];
                    return (
                        <Row>
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
            </>
        )
    })
}

export const Menu = (props: Props) => {
    const plugin = useContext(PluginContext);
    const settings = useSettings();

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
                        if(value === '' || value === 'NaN')
                            value = '0';
                        
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