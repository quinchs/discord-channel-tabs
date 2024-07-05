/** @jsx jsx */
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
import {HTMLAttributes, PropsWithChildren, ReactNode, useContext, useEffect, useRef} from "react";
import {MessageStore, UnreadStore} from "../discord/stores";
import styled from "@emotion/styled";
import {Chat} from "../discord/classNames";
import {TabContext} from "./tab";

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
    height: 30vh;
    pointer-events: none;
    background: color-mix(in lch, var(--background-secondary) 75%, var(--background-tertiary));
    border-radius: 10px;
    min-height: 150px;
    width: 30vw;
    min-width: 350px;
    overflow: hidden;
    
    * {
        pointer-events: none !important;
    }
`;

const PopoutPreviewContent = styled.div`
    padding-bottom: 25px;
    
    * {
        list-style: none;
    }
`;

const PinToBottomScroller = styled(PinToBottomScrollerAuto)`
    display: flex;
    flex-direction: column-reverse;
    overflow-anchor: auto;
    height: 30vh;
`

const PopoutHeader = styled.h3`

`;

const PopoutRenderer = (props: { messages: any, channel: any }) => {
    const tabContext = useContext(TabContext);
    
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
        <PopoutPreviewContainer>
            <PinToBottomScroller
                ref={tabContext?.scrollerRef}
                contentClassName={Chat.scrollerContent}
                onScroll={() => {
                }}
                onResize={() => {
                }}
            >
                <PopoutPreviewContent>
                    {!props.messages.hasMoreBefore && (
                        <PopoutHeader>Displaying last 50 messages.</PopoutHeader>
                    )}
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
            animation={'1'}
            position={"bottom"}
            align={"center"}
            renderPopout={() => {
                try {
                    return (<PopoutRenderer messages={messages} channel={props.channel}/>)
                } catch (err) {
                    console.log(err);
                    return (<div>Yeah it failed</div>);
                }
            }}
            shouldShow={props.popoutOpen && !props.selected}
            spacing={16}
            disablePointerEvents={true}
            onRequestClose={props.onRequestClose}
            children={props.children}
        />
    );
};