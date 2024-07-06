/** @jsx jsx */
/** @jsxfrag */
import {css, jsx} from '@emotion/react'
import {
    ChannelStreamItemTypes, EmptyMessage,
    fetchMessages,
    getChannelStream,
    Message,
    MessageDivider,
    PinToBottomScrollerAuto,
    Popout,
    ThreadStarterMessage,
    useStateFromStores
} from "../discord";
import {createElement, HTMLAttributes, PropsWithChildren, ReactNode, useContext, useEffect, useRef} from "react";
import {GuildStore, MessageStore, UnreadStore} from "../discord/stores";
import styled from "@emotion/styled";
import {Chat} from "../discord/classNames";
import {TabContext} from "./tab";
import {ChatBoxComponentType} from "../discord/discord";
import {
    chatInputTypes,
    chatRelatedClassNames,
    textAreaRelatedClassNames,
    tryGetChatComponentClass
} from "../discord/chatBox";
import {ChatBoxComponent} from "../discord/chatBoxComponent";
import React from 'react';

type Props = {
    popoutOpen: boolean;
    selected: boolean;
    onRequestClose: () => void;
    channel: any;
    children: (props: HTMLAttributes<HTMLElement>, details: {isShown: boolean,  position: number}) => ReactNode;
};

const Divider = styled(MessageDivider)`
    ${props => props.cut && css`
        margin-top: 40px !important;
        border-style: dashed;
        
        span {
            font-weight: 400;
        }
    `}
`

const PopoutPreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 30vh;
    min-height: 150px;
    width: 30vw;
    min-width: 350px;
    overflow: hidden;
    border-radius: 10px;
    margin-top: 20px;
    
    .${chatRelatedClassNames.channelTextArea} {
        border-radius: 0 0 8px 8px !important;
    }
    
    .${textAreaRelatedClassNames.scrollableContainer} {
        border-radius: 0 0 8px 8px !important;
    }
`;

const PopoutPreviewContent = styled.div`
    padding-bottom: 25px;

    * {
        list-style: none;
    }
`;

const PinToBottomScroller = styled(PinToBottomScrollerAuto)`
    background: color-mix(in lch, var(--background-secondary) 75%, var(--background-tertiary));
    display: flex;
    flex-direction: column-reverse;
    overflow-anchor: auto;
    height: 30vh;
    width: 100%;
    scroll-behavior: smooth;
`

const PopoutHeader = styled.span`
    background-color:  color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    height: 20px;
    display: flex;
    position: relative;
    
    &:after {
        content: "";
        position: absolute;
        height: 14px;
        width: 14px;
        right: -14px;
        border-bottom-left-radius: 14px;
        bottom: 0;
        background-color: transparent;
        box-shadow: -4px 4px 0 0 color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    }
    &:before {
        content: "";
        position: absolute;
        height: 14px;
        width: 14px;
        left: -14px;
        border-bottom-right-radius: 14px;
        bottom: 0;
        background-color: transparent;
        box-shadow: 4px 4px 0 0 color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    }
`;

const PopoutRenderer = (props: { messages: any, channel: any }) => {
    const tabContext = useContext(TabContext);
    
    if (!tabContext) return (<></>);
    
    const oldestUnreadMessageId = useStateFromStores([UnreadStore], () => UnreadStore.getOldestUnreadMessageId(props.channel.id));

    const channelStream = getChannelStream({
        channel: props.channel,
        messages: props.messages,
        oldestUnreadMessageId
    });

    const isGroupStarter = (item: any) => {
        return item?.type === ChannelStreamItemTypes.MESSAGE &&
            item.content.id === item.groupId;
    }

    return (
        <PopoutPreviewContainer
            ref={tabContext.popoutRef}
        >
            <PinToBottomScroller
                ref={tabContext?.scrollerRef}
                contentClassName={Chat.scrollerContent}
                onScroll={() => {
                }}
                onResize={() => {
                }}
            >
                <PopoutPreviewContent>
                    {channelStream.map((item, index) => {
                        switch (item.type) {
                            case "NONE":
                                return (
                                    <EmptyMessage channel={props.channel}/>
                                )
                            case ChannelStreamItemTypes.DIVIDER:
                                return (
                                    <Divider
                                        cut={item.cut}
                                        isUnread={!!item.unreadId}
                                        isBeforeGroup={!item.content && isGroupStarter(channelStream[index + 1])}
                                        children={item.content}
                                    />
                                );
                            case ChannelStreamItemTypes.MESSAGE:
                                return (
                                    <Message
                                        message={item.content}
                                        channel={props.channel}
                                        groupId={item.groupId}
                                        id={`chat-messages-${props.channel.id}-${item.content.id}`}
                                    />
                                )
                            case ChannelStreamItemTypes.THREAD_STARTER_MESSAGE:
                                return (
                                    <ThreadStarterMessage
                                        message={item.content}
                                        channel={props.channel}
                                        groupId={item.groupId}
                                        id={`chat-messages-${props.channel.id}-${item.content.id}`}
                                    />
                                );
                        }
                    })}
                </PopoutPreviewContent>
            </PinToBottomScroller>
            <ChatBoxComponent
                channel={tabContext.channel}
                guild={tabContext.guild}
                chatInputType={chatInputTypes.OVERLAY}
            />
        </PopoutPreviewContainer>
    )
}

export const TabPopout = (props: Props) => {
    const messages = useStateFromStores(
        [MessageStore],
        () => MessageStore.getMessages(props.channel.id)
    );

    useEffect(() => {
        if (props.popoutOpen)
            fetchMessages(props.channel.id);
    }, [props.popoutOpen]);

    return (
        <Popout
            position={"bottom"}
            align={"center"}
            renderPopout={(data: any) => {
                console.log("popout data", data);
                try {
                    return (<PopoutRenderer messages={messages} channel={props.channel}/>)
                } catch (err) {
                    console.log(err);
                    return (<div>Yeah it failed</div>);
                }
            }}
            shouldShow={props.popoutOpen && !props.selected}
            spacing={0}
            onRequestClose={props.onRequestClose}
            children={props.children}
        />
    );
};