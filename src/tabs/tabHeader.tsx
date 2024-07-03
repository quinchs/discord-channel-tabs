/** @jsx jsx */
import {css, jsx} from '@emotion/react'
import {getTabType, Tab} from "./tabsManager";
import {connectStores} from "../discord/flux";
import {UnreadStore} from "../discord/stores";
import {LegacyRef, useEffect, useRef} from "react";
import styled from "@emotion/styled";
import Spinner from "../discord/spinner";

type Props = {
    innerRef?: LegacyRef<HTMLSpanElement> | undefined;
    tab: Tab;
    selected: boolean;
    onTabUpdated: () => void;
};

const TabHeaderContent = styled.span`
    display: flex;
    align-items: center;
`;

const TabIcon = styled.svg`
    width: 20px;
    height: 20px;
    margin-left: 8px;
`;

const TabIconImage = styled.img`
    height: 20px;
    border-radius: 50%;
    -webkit-user-drag: none;
`;

const getStatusStyles = (status: string) => {
    switch (status) {
        case "online":
            return css`
                stroke: hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%);
                fill: hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%);
                mask: url(#svg-mask-status-online);
            `;
        case "idle":
            return css`
                stroke: hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%);
                fill: hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%);
                mask: url(#svg-mask-status-idle);
            `;
        case "dnd":
            return css`
                stroke: hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%);
                fill: hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%);
                mask: url(#svg-mask-status-dnd);
            `;
        default:
            return css`
                stroke: hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%);
                fill: hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%);
                mask: url(#svg-mask-status-offline);
            `;
    }
}

const Badge = css`
    border-radius: 8px;
    padding: 0 4px;
    min-width: 8px;
    width: fit-content;
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    text-align: center;
    margin: 0 4px;
    text-wrap: nowrap;
`;

const MentionsBadge = styled.div`
    ${Badge};
    color: #fff;
    background-color: hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%);
`;

const NewUnreadsBadge = styled.div`
    ${Badge};
    color: #fff;
    background-color: var(--brand-500);
`

const TabName = styled.div`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    flex: 1 1 auto;
    margin: 0 8px;
    text-wrap: nowrap;
`;

const TabHeaderComponent = ({tab, innerRef, selected, onTabUpdated, ...state}: TabState & Props) => {
    const initialRender = useRef<boolean>(false);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        onTabUpdated();
    }, [state]);

    const getTabIconUrl = () => {
        const defaultIcon = "https://cdn.discordapp.com/embed/avatars/0.png";

        if (tab.guildId) {
            return ZLibrary.DiscordModules.GuildStore.getGuild(tab.guildId)?.getIconURL(40, false) as string ?? defaultIcon;
        } else if (tab.userId) {
            return ZLibrary.DiscordModules.UserStore.getUser(tab.userId)?.getAvatarURL(null, 40, false) as string ?? defaultIcon;
        }

        return defaultIcon;
    }

    const getFormattedUnreadCount = () => {
        let count = state.unreadCount?.toString();

        if (count && state.unreadIsEstimate)
            count += '+';

        return count
            ? `${count} NEW`
            : 'NEW'
    }

    return (
        <TabHeaderContent
            ref={innerRef}
        >
            <TabIcon viewBox={"0 0 20 20"}>
                <foreignObject x={0} y={0} width={20} height={20}
                               mask={state.userStatus && "url(#svg-mask-avatar-status-round-20)"}>
                    <TabIconImage alt={`${tab.name} icon`} src={getTabIconUrl()}/>
                </foreignObject>
                {state.userStatus && (
                    <rect width={6} height={6} x={14} y={14} css={getStatusStyles(state.userStatus)}/>
                )}
            </TabIcon>
            <TabName css={css`
                color: ${selected ? 'var(--interactive-active)' : 'var(--channels-default)'};
            `}>{tab.name}</TabName>
            {state.hasUsersTyping && <Spinner type={"pulsingEllipsis"} animated/>}
            {state.mentionCount > 0 && (
                <MentionsBadge>{state.mentionCount}</MentionsBadge>
            )}
            {getTabType(tab) === "GUILD_CHANNEL" && !!state.unreadCount && (
                <NewUnreadsBadge>{getFormattedUnreadCount()}</NewUnreadsBadge>
            )}
        </TabHeaderContent>
    );
}

interface TabState {
    unreadCount: number | undefined;
    unreadIsEstimate: boolean;
    hasUnread: boolean;
    mentionCount: number;
    hasUsersTyping: boolean;
    userStatus: any;
}

const hasUsersTyping = (channelId: string): boolean => {
    const currentUserId = ZLibrary.DiscordModules.UserStore.getCurrentUser()?.id;
    return !!Object.keys(ZLibrary.DiscordModules.UserTypingStore.getTypingUsers(channelId))
        .find(x => x !== currentUserId)
}

//
export default connectStores<TabState, Props>([
        UnreadStore,
        ZLibrary.DiscordModules.UserTypingStore,
        ZLibrary.DiscordModules.UserStatusStore
    ], (props: Props) => ({
        unreadCount: UnreadStore.getUnreadCount(props.tab.channelId) as number | undefined,
        unreadIsEstimate: UnreadStore.isEstimated(props.tab.channelId) as boolean,
        hasUnread: UnreadStore.hasUnread(props.tab.channelId) as boolean,
        mentionCount: UnreadStore.getMentionCount(props.tab.channelId) as number,
        hasUsersTyping: hasUsersTyping(props.tab.channelId),
        userStatus: props.tab.userId && ZLibrary.DiscordModules.UserStatusStore.getStatus(props.tab.userId),
    })
)(TabHeaderComponent);