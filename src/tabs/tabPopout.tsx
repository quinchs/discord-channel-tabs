/** @jsx jsx */
/** @jsxfrag */
import {ClassNames, css, jsx} from '@emotion/react'
import {
    ChannelStreamItemTypes,
    EmptyMessage,
    fetchMessages,
    getChannelStream,
    Message,
    MessageDivider,
    PinToBottomScrollerAuto,
    Popout,
    ThreadStarterMessage,
    useStateFromStores
} from "../discord";
import React, {HTMLAttributes, MutableRefObject, ReactNode, RefObject, useEffect, useState} from "react";
import {ChannelStore, GuildStore, MessageStore, UnreadStore, UserStore, UserTypingStore} from "../discord/stores";
import styled from "@emotion/styled";
import {Chat} from "../discord/classNames";
import {
    chatRelatedClassNames,
    formatUsersTyping,
    tabChatInputType,
    textAreaRelatedClassNames
} from "../discord/chatBox";
import {ChatBoxComponent} from "../discord/chatBoxComponent";
import {Tab} from "./tabsManager";
import Spinner from "../discord/spinner";

type Props = {
    popoutControlsRef: MutableRefObject<PopoutControlsState | null>,
    popoutOpen: boolean;
    popoutTargetRef?: MutableRefObject<HTMLElement | null>,
    popoutTargetTab: Tab | null,
    onRequestClose: () => void;
    children: (props: HTMLAttributes<HTMLElement>, details: { isShown: boolean, position: number }) => ReactNode;
    popoutContainerRef: MutableRefObject<HTMLDivElement | null>
};

export interface PopoutControlsState {
    closePopout: Function,
    isPositioned: boolean,
    nudge: number,
    position: string,
    setPopoutRef: Function,
    updatePosition: () => void;
}

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
    min-height: 450px;
    max-height: 800px;
    width: 30vw;
    min-width: 350px;
    max-width: 600px;
    overflow: hidden;
    border-radius: 10px;
    //margin-top: 20px;

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

const PopoutScrollingWrapper = styled(PinToBottomScrollerAuto)`
    background: color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    display: flex;
    flex-direction: column-reverse;
    overflow-anchor: auto;
    height: 30vh;
    width: 100%;
    scroll-behavior: smooth;
`

const PopoutHeader = styled.span`
    background-color: color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    height: 8px;
    min-height: 8px;
    display: flex;
    position: relative;
    //border-radius: 4px 4px 0 0;

    &:after {
        content: "";
        position: absolute;
        height: 8px;
        width: 8px;
        right: -8px;
        border-bottom-left-radius: 8px;
        bottom: 0;
        background-color: transparent;
        box-shadow: -2px 2px 0 2px color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    }

    &:before {
        content: "";
        position: absolute;
        height: 8px;
        width: 8px;
        left: -8px;
        border-bottom-right-radius: 8px;
        bottom: 0;
        background-color: transparent;
        box-shadow: 2px 2px 0 2px color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    }
`;

const PopoutSpacer = styled.span`
    background-color: color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    border-radius: 8px 8px 0 0;
    height: 8px;
    width: 100%;
`

interface PopoutRendererProps {
    tab: Tab,
    tabRef: RefObject<HTMLElement>,
    popoutContainerRef: MutableRefObject<HTMLDivElement | null>
}

const PopoutRenderer = (props: PopoutRendererProps) => {
    const channel = ChannelStore.getChannel(props.tab.channelId);
    const guild = props.tab.guildId && GuildStore.getGuild(props.tab.guildId);

    const [loading, setIsLoading] = useState(false);

    if (!channel) return (<></>)

    const messages = useStateFromStores(
        [MessageStore],
        () => MessageStore.getMessages(channel.id),
        [props.tab.channelId]
    );
    

    useEffect(() => {
        if (!loading && messages.length === 0 && (messages.hasMoreBefore || messages.hasMoreAfter)) {
            setIsLoading(true);

            fetchMessages(props.tab.channelId).then(() => {
                setIsLoading(false);
                console.log("load done");
            });
        }
    }, [loading, props.tab.channelId]);

    const oldestUnreadMessageId = useStateFromStores(
        [UnreadStore],
        () => UnreadStore.getOldestUnreadMessageId(channel.id),
        [props.tab.channelId]
    );

    const channelStream = getChannelStream({
        channel,
        messages,
        oldestUnreadMessageId
    });

    const isGroupStarter = (item: any) => {
        return item?.type === ChannelStreamItemTypes.MESSAGE &&
            item.content.id === item.groupId;
    }

    return (
        <PopoutPreviewContainer
            ref={props.popoutContainerRef}
        >
            <PopoutSpacer/>
            <PopoutScrollingWrapper
                contentClassName={Chat.scrollerContent}
                onScroll={() => {
                }}
                onResize={() => {
                }}
            >
                <PopoutPreviewContent className={"group-spacing-16"}>
                    {channelStream.map((item, index) => {
                        switch (item.type) {
                            case "NONE":
                                return (
                                    <EmptyMessage channel={channel}/>
                                )
                            case ChannelStreamItemTypes.DIVIDER:
                                // divider_d5deea hasContent_d5deea divider_c2654d hasContent_c2654d
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
                                        channel={channel}
                                        groupId={item.groupId}
                                        id={`chat-messages-${channel.id}-${item.content.id}`}
                                    />
                                )
                            case ChannelStreamItemTypes.THREAD_STARTER_MESSAGE:
                                return (
                                    <ThreadStarterMessage
                                        message={item.content}
                                        channel={channel}
                                        groupId={item.groupId}
                                        id={`chat-messages-${channel.id}-${item.content.id}`}
                                    />
                                );
                        }
                    })}
                </PopoutPreviewContent>
            </PopoutScrollingWrapper>
            <ChatBoxComponent
                channel={channel}
                guild={guild}
                chatInputType={tabChatInputType}
            />
        </PopoutPreviewContainer>
    )
}

export const TabPopout = (props: Props) => {
    useEffect(() => {
        if (!props.popoutOpen) props.popoutControlsRef.current = null;
    }, [props.popoutOpen]);

    return (
        <ClassNames>
            {({css, cx}) => (
                <Popout
                    popoutClassName={css`
                        transition: left 0.2s ease-in-out;
                    `}
                    position={"bottom"}
                    align={"center"}
                    renderPopout={(data: any) => {
                        props.popoutControlsRef.current = data;
                        return props.popoutTargetTab && props.popoutTargetRef && (
                            <PopoutRenderer popoutContainerRef={props.popoutContainerRef} tab={props.popoutTargetTab}
                                            tabRef={props.popoutTargetRef}/>)
                    }}
                    shouldShow={props.popoutOpen && !!props.popoutTargetTab}
                    spacing={0}
                    onRequestClose={props.onRequestClose}
                    children={props.children}
                    animation={"3"}
                    popoutTargetElementRef={props.popoutTargetRef}
                />
            )}
        </ClassNames>
    );
};