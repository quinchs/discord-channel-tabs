/** @jsx jsx */
import {css, jsx} from '@emotion/react'
import styled from '@emotion/styled'
import {CloseIcon} from "../icons/closeIcon";
import {
    createElement,
    HTMLAttributes,
    LegacyRef, MouseEvent, useEffect,
    useRef,
    useState
} from "react";
import {getTabType, Tab as TabData} from "./tabsManager";
import TabHeader from "./tabHeader";
import {ContextMenuRenderer, openContextMenu} from "../discord/contextMenus/contextMenuDispatcher";
import {
    DMContextMenuItems,
    groupDMContextMenuItems,
    guildChannelContextMenuItems
} from "../discord/contextMenus/channelContextMenu";

type Props = HTMLAttributes<HTMLDivElement> & {
    selected: boolean;
    onClose: (e: MouseEvent<SVGSVGElement>) => void;
    innerRef: LegacyRef<HTMLDivElement> | undefined;
    isDragging: boolean;
    tab: TabData;
};

const TabElement = styled.div`
    position: relative;
    display: flex;
    //max-width: 350px;
    margin: 4px 8px 0;
    padding: 4px;
    align-items: center;
    border-radius: 16px 16px 0 0;
    color: var(--header-primary);
    height: 28px;
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary))
    }
`

const selectedCSS = css`
    background-color: var(--background-tertiary);

    transition: box-shadow 0.2s ease;

    &:hover:before {
        box-shadow: 4px 4px 0 0 color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
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
        box-shadow: 4px 4px 0 0 var(--background-tertiary);
    }

    &:hover:after {
        box-shadow: -4px 4px 0 0 color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary));
    }

    &:after {
        content: "";
        position: absolute;
        height: 14px;
        width: 14px;
        right: -14px;
        border-bottom-left-radius: 14px;
        bottom: 0;
        background-color: transparent;
        box-shadow: -4px 4px 0 0 var(--background-tertiary);
    }
`

const growStyles = (sz: number | undefined, closeVisible: boolean) => css`
    ${sz && css`
        width: ${sz + (closeVisible ? 20 : 0)}px;
    `}
`

const closeIconStyles = css`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;

    &:hover {
        background-color: color-mix(in lch, var(--text-muted) 15%, var(--background-tertiary));
    }
`

const TabContentContainer = styled.section`
    display: flex;
    position: relative;
    align-items: center;
    overflow: hidden;
    margin-bottom: 4px;
`

export const Tab = ({tab, ...props}: Props) => {
    const tabContainerRef = useRef<HTMLSpanElement>(null);

    const [tabWidth, setTabWidth] = useState<number>();

    const [tabGrow, setTabGrow] = useState<boolean>(props.selected);
    const [closeVisible, setCloseVisible] = useState(props.selected);

    const openTimeoutId = useRef<NodeJS.Timeout>();
    const closeTimeoutId = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (tabContainerRef.current && tabContainerRef.current.clientWidth !== tabWidth) {
            setTabWidth(tabContainerRef.current.clientWidth);
        }
    }, [tabContainerRef.current]);

    useEffect(() => {
        if (props.selected && (!closeVisible || !tabGrow)) {
            setCloseVisible(true);
            setTabGrow(true);
        } else if (!props.selected) {
            setTabGrow(false);
            closeTimeoutId.current = setTimeout(() => setCloseVisible(false), 100);
        }
    }, [props.selected]);

    const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
        if (props.onMouseEnter)
            props.onMouseEnter(e);

        if (props.selected) return;

        if (closeTimeoutId.current) {
            clearTimeout(closeTimeoutId.current);
            closeTimeoutId.current = undefined;
        }

        if (openTimeoutId.current) {
            clearTimeout(openTimeoutId.current);
        }

        // wait 0.4s before showing the close icon
        openTimeoutId.current = setTimeout(() => {
            setCloseVisible(true);
            setTabGrow(true);
        }, 400);
    }

    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        if (props.onMouseLeave)
            props.onMouseLeave(e)

        if (props.selected) return;

        if (openTimeoutId.current) {
            clearTimeout(openTimeoutId.current);
            openTimeoutId.current = undefined;
        }

        if (closeTimeoutId.current) {
            clearTimeout(closeTimeoutId.current)
        }

        // immediately start shrinking the tab
        setTabGrow(false);

        // wait 0.1s for the animation before removing the close icon.
        closeTimeoutId.current = setTimeout(() => setCloseVisible(false), 100);
    }

    const contextMenu = (e: MouseEvent<HTMLDivElement>) => {
        const type = getTabType(tab);

        let menu: {
            renderer: ContextMenuRenderer,
            props: any
        } | undefined;

        const channel = ZLibrary.DiscordModules.ChannelStore.getChannel(tab.channelId);
        if (!channel) return;

        switch (type) {
            case "GROUP_DM":
                menu = {
                    renderer: groupDMContextMenuItems,
                    props: {
                        channel,
                        selected: true
                    }
                }
                break;
            case "DM":
                const user = ZLibrary.DiscordModules.UserStore.getUser(tab.userId);

                if (!user) return;

                menu = {
                    renderer: DMContextMenuItems,
                    props: {
                        user, 
                        channel,
                        showModalItems: false
                    }
                };
                break;
            case "GUILD_CHANNEL":
                const guild = ZLibrary.DiscordModules.GuildStore.getGuild(tab.guildId);

                if (!guild) return;

                menu = {
                    renderer: guildChannelContextMenuItems,
                    props: {
                        channel,
                        guild
                    }
                };
                break;
        }

        if (!menu) return;

        openContextMenu(e, menu.renderer, menu.props);
    }

    return (
        <TabElement
            {...props}
            onContextMenu={contextMenu}
            ref={props.innerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            css={css`
                cursor: ${props.isDragging ? "grab" : "pointer"} !important;
                transition: width 0.1s ease-in-out, background-color 0.2s;

                ${props.selected && !props.isDragging && selectedCSS};
                ${growStyles(tabWidth, props.selected || tabGrow)};
                ${props.isDragging && css`
                    background-color: #FFFFFF20;
                `}
            `}
        >
            <TabContentContainer>
                <TabHeader
                    selected={props.selected}
                    tab={tab}
                    innerRef={tabContainerRef}
                    onTabUpdated={() => {
                        if (!tabContainerRef.current) return;

                        if (tabContainerRef.current?.clientWidth !== tabWidth) {
                            setTabWidth(tabContainerRef.current.clientWidth);
                        }

                    }}
                />
                {closeVisible && <CloseIcon css={closeIconStyles} onClick={props.onClose}/>}
            </TabContentContainer>
        </TabElement>
    );
};