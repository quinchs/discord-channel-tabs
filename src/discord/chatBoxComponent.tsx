/** @jsx jsx */
/** @jsxFrag */
import {css, jsx} from '@emotion/react'
import {createElement, memo, useEffect, useRef, useState} from "react";
import {ChatBoxComponentType} from "./discord";
import {chatInputTypes, getPlaceholder, getShakeIntensity, tryGetChatComponentClass} from "./chatBox";
import React from 'react';
import {useStateFromStores} from "./index";
import {PendingReplyStore} from "./stores";
import {actionLogger, ActionLoggerEventTypes, hookDiscordAction} from "./actionLogger";

type Props = {
    channel: any, 
    guild?: any,
    placeholder?: string,
    chatInputType?: any
};

const renderChatBox = (props: Props, component: typeof ChatBoxComponentType) => {
    const [focused, setFocused] = useState(false);
    const [highlighted, setHighlighted] = useState(false);
    
    useEffect(() => {
        return hookDiscordAction(ActionLoggerEventTypes.FOCUS_CHANNEL_TEXT_AREA, handleRequestFocus);
    }, []);
    
    const handleRequestFocus = (e: any) => {
        if (e.channelId !== props.channel.id) return;
        setFocused(true);
    }
    
    const handleInputFocus = (e: any) => {
        if (!!e?.highlight) {
            setHighlighted(e.highlight);
        }

        setFocused(true);
    }
    
    const handleInputBlur = () => {
        setFocused(false);
        setHighlighted(false);
    }
    
    const handleInputKeyDown = () => {
        if (highlighted) {
            setHighlighted(false);
        }
    }

    const pendingReply = useStateFromStores([PendingReplyStore], () => PendingReplyStore.getPendingReply(props.channel.id))

    const {placeholder, accessibilityLabel} = getPlaceholder(props.channel);
    
    return createElement(component, {
        focused,
        highlighted,
        channel: props.channel,
        guild: props.guild,
        onFocus: handleInputFocus,
        onBlur: handleInputBlur,
        onKeyDown: handleInputKeyDown,
        hasModalOpen: false, 
        pendingReply,
        chatInputType: props.chatInputType ?? chatInputTypes.NORMAL,
        placeholder: props.placeholder ?? placeholder,
        accessibilityLabel,
        shakeIntensity: getShakeIntensity(props.channel),
        poggermodeEnabled: false,
    })
}

export const ChatBoxComponent = memo((props: Props) => {
    const chatBox = useRef<typeof ChatBoxComponentType | null>(tryGetChatComponentClass());
    
    if(!chatBox.current)
        chatBox.current = tryGetChatComponentClass();
    
    if (!chatBox.current) return (<></>)

    return renderChatBox(props,  chatBox.current);
});