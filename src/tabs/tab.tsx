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
    RefObject,
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
    onClose: (e: MouseEvent<SVGSVGElement>) => void;
    innerRef: RefCallback<HTMLDivElement> | undefined;
    isDragging: boolean;
    tab: TabData;
};



const TabElementHovered = css`
    background-color: color-mix(in lch, var(--background-secondary) 40%, var(--background-tertiary))
`;

const TabElementPopoutOpen = css`
    position: relative;
    ${TabElementHovered}
    
    &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 20px;
        bottom: -20px;
        background-color: red;
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

export const TabContext = createContext<TabContextType | null>(null)

export const Tab = ({tab, ...props}: Props) => {
    const scrollerRef = useRef<HTMLElement | null>(null);
    const tabContainerRef = useRef<HTMLSpanElement>(null);
    const tabElementRef = useRef<HTMLDivElement | null>(null);
    const popoutRef = useRef<HTMLDivElement | null>(null);

    const [tabWidth, setTabWidth] = useState<number>();
    const [popoutOpen, setPopoutOpen] = useState(props.selected);
    const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(tab.channelId));

    const openTimeoutId = useRef<NodeJS.Timeout>();
    const closeTimeoutId = useRef<NodeJS.Timeout>();

    const resetTimerStates = () => {
        clearTimeout(openTimeoutId.current);
        clearTimeout(closeTimeoutId.current);
    }

    const onMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
        if (props.onMouseEnter)
            props.onMouseEnter(e);

        if (props.selected) return;

        resetTimerStates();

        // wait 0.4s before showing the close icon
        openTimeoutId.current = setTimeout(() => {
            setPopoutOpen(true);
        }, 800);
    }

    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        if (props.onMouseLeave)
            props.onMouseLeave(e)

        if (props.selected) return;

        resetTimerStates();
        setPopoutOpen(false);
    }

    const handleTabClick = (e: MouseEvent<HTMLDivElement>) => {
        // don't do the onclick for parent in popout
        if (popoutRef.current?.contains(e.target as HTMLElement)) {
            return;
        } 
        
        if (props.onClick)
            props.onClick(e);
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
        <TabContext.Provider
            value={{
                tabRef: tabElementRef,
                channel,
                guild: tab.guildId && GuildStore.getGuild(tab.guildId),
                scrollerRef,
                tab,
                popoutRef,
                tabWidth: tabWidth,
            }}
        >
            <TabElement
                {...props}
                onClick={handleTabClick}
                onContextMenu={contextMenu}
                ref={e => {
                    if (props.innerRef) {
                        props.innerRef(e);
                    }

                    tabElementRef.current = e;
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onWheel={event => {
                    if (scrollerRef.current) {
                        // @ts-ignore
                        // scrollerRef.current.getScrollerNode().scrollBy({
                        //     top: event.deltaY,
                        // })
                    }
                }}
                css={css`
                    cursor: ${props.isDragging ? "grab" : "pointer"} !important;
                    transition: width 0.1s ease-in-out, background-color 0.2s;
                    
                    ${popoutOpen && TabElementPopoutOpen};
                    //${growStyles(tabWidth)};
                    ${props.selected && !props.isDragging && selectedCSS};
                    ${props.isDragging && css`
                        background-color: #FFFFFF20;
                    `}
                `}
            >
                <TabPopout
                    popoutOpen={popoutOpen}
                    selected={props.selected}
                    onRequestClose={() => setPopoutOpen(false)}
                    channel={channel}
                >
                    {(popoutProps, details) => (
                        <TabContentContainer {...popoutProps}>
                            <TabHeader
                                selected={props.selected}
                                tab={tab}
                                innerRef={tabContainerRef}
                                onTabUpdated={() => {
                                    if (!tabContainerRef.current) return;
                                    
                                    //console.log("tab updated", tabContainerRef.current.clientWidth);

                                    if (tabContainerRef.current?.clientWidth !== tabWidth) {
                                        setTabWidth(tabContainerRef.current.clientWidth);
                                    }

                                }}
                            />
                            {props.selected && <CloseIcon css={closeIconStyles} onClick={props.onClose}/>}
                        </TabContentContainer>
                    )}
                </TabPopout>
            </TabElement>
        </TabContext.Provider>
    );
};