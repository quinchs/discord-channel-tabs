/** @jsx jsx */
import {css, jsx} from '@emotion/react'
import styled from '@emotion/styled'
import {CloseIcon} from "../icons/closeIcon";
import {
    createContext,
    HTMLAttributes,
    MouseEvent,
    MutableRefObject,
    RefCallback,
    RefObject, useEffect,
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
import {ChannelStore, GuildStore, UserStore} from "../discord/stores";
import {TabPopout} from "./tabPopout";
import {useStateFromStores} from "../discord";

type Props = HTMLAttributes<HTMLDivElement> & {
    selected: boolean;
    outlined: boolean;
    onClose: (e: MouseEvent<SVGSVGElement>) => void;
    innerRef: RefCallback<HTMLDivElement> | undefined;
    isDragging: boolean;
    tab: TabData;
    
    onRequestPopout: () => void;
    popoutPresent: boolean
};

const TabElementHovered = css`
    background-color: color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary))
`;

const TabElementOutlined = css`
    outline: 3px solid var(--indicator-selected-border)
`

const TabElementPopoutOpen = css`
    position: relative;
    ${TabElementHovered}

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
        ${TabElementHovered}
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

const growStyles = (sz: number | undefined) => css`
    ${sz && css`
        width: ${sz}px;
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

export interface TabContextType {
    scrollerRef: MutableRefObject<HTMLElement | null>
    tabRef: RefObject<HTMLElement> | undefined
    channel: any,
    guild?: any
    tab: TabData,
    popoutRef: RefObject<HTMLDivElement>,
    tabWidth: number | undefined
}

export const Tab = ({tab, ...props}: Props) => {
    const tabContainerRef = useRef<HTMLSpanElement>(null);
    const tabElementRef = useRef<HTMLDivElement | null>(null);

    const [tabWidth, setTabWidth] = useState<number>();

    const openTimeoutId = useRef<NodeJS.Timeout>();
    const closeTimeoutId = useRef<NodeJS.Timeout>();

    const resetTimerStates = () => {
        clearTimeout(openTimeoutId.current);
        clearTimeout(closeTimeoutId.current);
    }

    useEffect(() => {
        return resetTimerStates
    }, []);

    const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
        if (props.onMouseEnter)
            props.onMouseEnter(e);

        if (props.selected) return;

        resetTimerStates();

        openTimeoutId.current = setTimeout(() => {
            props.onRequestPopout();
        }, 600);
    }

    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        if (props.onMouseLeave)
            props.onMouseLeave(e)

        if (props.selected) return;

        resetTimerStates();
    }
    
    const contextMenu = (e: MouseEvent<HTMLDivElement>) => {
        const type = getTabType(tab);

        let menu: {
            renderer: ContextMenuRenderer,
            props: any
        } | undefined;

        const channel = ChannelStore.getChannel(tab.channelId);
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
                const user = UserStore.getUser(tab.userId);

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
                const guild = GuildStore.getGuild(tab.guildId);

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

        openContextMenu(e, menu.renderer, {
            ...menu.props,
            tab
        });
    }

    return (
        <TabElement
            {...props}
            onClick={e => {
                resetTimerStates();
                
                if (props.onClick)
                    props.onClick(e);
            }}
            onContextMenu={contextMenu}
            ref={e => {
                if (props.innerRef) {
                    props.innerRef(e);
                }

                tabElementRef.current = e;
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            css={css`
                    cursor: ${props.isDragging ? "grab" : "pointer"} !important;
                    transition: width 0.1s ease-in-out, background-color 0.2s;
                
                    ${props.outlined && TabElementOutlined}
                    ${props.popoutPresent && !props.isDragging && TabElementPopoutOpen};
                    ${growStyles(tabWidth)};
                    ${props.selected && !props.isDragging && !props.popoutPresent && selectedCSS};
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
                {props.selected && <CloseIcon css={closeIconStyles} onClick={props.onClose}/>}
            </TabContentContainer>
        </TabElement>
    );
};