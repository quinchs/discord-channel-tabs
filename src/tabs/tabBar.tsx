/** @jsx jsx */
/** @jsxFrag */
import {css, jsx} from '@emotion/react'
import styled from '@emotion/styled'
import {
    createTabFromChannel,
    getChannelFromUri,
    getOpenTabs,
    isUriAtTab,
    saveTabsState,
    Tab as TabInfo
} from "./tabsManager";
import {Tab} from "./tab";
import React, {MouseEvent, useContext, useEffect, useRef, useState} from "react";
import {getOrCreatePrivateChannelForUser, Navigator, resolveChannelIdFromGuildId, selectChannel} from "../discord";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import Plugin, {PluginContext} from "../index";
import {AddTabButton} from "./addTabButton";
import {ChannelStore} from "../discord/stores";
import {PopoutControlsState, TabPopout} from "./tabPopout";
import {combineDestructors} from "../utils/deconstructors";
import {useSettings} from "../settings/useSettings";
import {hookDiscordAction, QUICKSWITCHER_SHOW, QUICKSWITCHER_SWITCH_TO} from "../discord/actionLogger";

type Props = {};

const TabWrapper = styled.div`
    &:hover {
    }
`;

const TabsContainer = styled.div`
    display: flex;
    overflow: hidden;
    align-items: center;
    background-color: var(--background-secondary);
    height: 40px;
    min-height: 40px;
`

const TabSpacer = styled.span`
    width: 2px;
    height: 50%;
    background-color: var(--channels-default);
    transition: opacity 0.1s ease-in-out;
    opacity: 0.4;

    &:hover {
        opacity: 0;
    }

    ${TabWrapper}:hover + & {
        opacity: 0;
    }

    &:has(+ ${TabWrapper}:hover) {
        opacity: 0;
    }
`

const TabSpacerWhenDragging = css`
    opacity: 0 !important;
`;

const TabPlunger = styled.div`
    flex: 1 1 auto;
    background-color: var(--background-nested-floating);
    height: 40px;
    border-bottom-left-radius: 20px;
    position: relative;
    display: flex;
    align-items: center;

    &:after {
        content: "";
        position: absolute;
        height: 20px;
        width: 20px;
        left: -20px;
        border-top-right-radius: 20px;
        top: 0;
        background-color: transparent;
        box-shadow: 3px -5px 0 3px var(--background-nested-floating);
    }
`;

const TabBarArea = styled.section`
    ${TabsContainer}
`

export const TabBar = (props: Props) => {
    const plugin = useContext(PluginContext);
    const settings = useSettings();
        
    const tabRefs = useRef<Map<string, HTMLElement | null>>(new Map);
    const dragTargetBounds = useRef<DOMRect | null>();

    const [isReordering, setIsReordering] = useState(false);
    const [tabBarBounds, setTabBarBounds] = useState<DOMRect>();
    const [tabs, setTabs] = useState<TabInfo[]>([]);
    const [currentTab, setCurrentTab] = useState<TabInfo | null>(null);
    const [outlinedTab, setOutlinedTab] = useState<TabInfo | null>(null);

    const popoutContainerRef = useRef<HTMLDivElement | null>(null);
    const popoutTargetRef = useRef<HTMLElement | null>(null);
    const [popoutTargetTab, setPopoutTargetTab] = useState<TabInfo | null>(null);
    const popoutControls = useRef<PopoutControlsState | null>(null);

    useEffect(() => {
        return combineDestructors(
            plugin.events.subscribe('tab-navigator', handleShowQuickSwitch),
            plugin.events.subscribe('request-tab-close', onTabClose),
            plugin.events.subscribe('request-tab-add', tab => {
                setCurrentTab(tab);
                selectChannel(tab.channelId, tab.guildId);

                if (tabs.find(x => x.channelId === tab.channelId)) {
                    return;
                }

                const newTabs = [...tabs, tab];
                setTabs(newTabs);
                saveTabsState(newTabs);
            }),
            plugin.events.subscribe('tab-quickswitch-complete', () => {
                if (outlinedTab) {
                    onTabNavigate(outlinedTab);
                    setOutlinedTab(null);
                }
            }),
            plugin.events.subscribe('tab-quickswitch-current', () => {
                if (currentTab) {
                    setOutlinedTab(currentTab);
                }
            }),
            plugin.events.subscribe('tab-quickswitch-next', () => {
                const target = outlinedTab ?? currentTab;

                const nextTab = !target
                    ? tabs[tabs.length - 1]
                    : tabs[tabs.indexOf(target) + 1];
                
                if (!nextTab) return;

                setOutlinedTab(nextTab);
            }),
            plugin.events.subscribe('tab-quickswitch-prev', () => {
                const target = outlinedTab ?? currentTab;

                const nextTab = !target
                    ? tabs[0]
                    : tabs[tabs.indexOf(target) - 1];
                
                if (!nextTab) return;

                setOutlinedTab(nextTab);
            }),
            plugin.events.subscribe('location-switch', () => {
                const matchingTab = tabs.find(x => isUriAtTab(window.location.pathname, x)) ?? null;

                setCurrentTab(matchingTab);
            })
        )
    }, [tabs, currentTab, outlinedTab]);

    useEffect(() => {
        const savedTabs = getOpenTabs();
        setTabs(savedTabs);

        setCurrentTab(savedTabs.find(x => isUriAtTab(window.location.pathname, x)) ?? null);
    }, []);

    const onAddRequested = async (type: string, record: any) => {
        const pushTab = (tab: TabInfo) => {
            console.log(`Created tab from quickswitch type ${type}`, tab);
            setCurrentTab(tab);
            if (!tabs.find(x => x.channelId === tab.channelId)) {
                const newTabs = [...tabs, tab];
                setTabs(newTabs);
                saveTabsState(newTabs)
            }
        }

        switch (type) {
            case "GUILD":
                const channelId = resolveChannelIdFromGuildId(record.id);
                const channelName = ChannelStore.getChannel(channelId).name;
                pushTab({
                    channelId,
                    guildId: record.id,
                    name: channelName
                })
                break;
            case "GROUP_DM":
            case "TEXT_CHANNEL":
            case "VOICE_CHANNEL":
                const tab = createTabFromChannel(record);
                if (tab) pushTab(tab);
                break;
            case "USER":
                const dmChannelId = await getOrCreatePrivateChannelForUser(record.id);

                pushTab({
                    channelId: dmChannelId,
                    name: record.globalName,
                    userId: record.id
                });
                break;
            default:
                break;
        }
    }

    const onTabClose = (tab: TabInfo) => {
        const tabIndex = tabs.indexOf(tab);

        if (tabIndex === -1) return;

        const newTabs = [
            ...tabs.slice(0, tabIndex),
            ...tabs.slice(tabIndex + 1)
        ];

        setTabs(newTabs);
        saveTabsState(newTabs);
    }

    const onTabNavigate = (tab: TabInfo) => {
        if (popoutTargetTab?.channelId === tab.channelId) {
            setPopoutTargetTab(null);
            popoutTargetRef.current = null;
        }
        setCurrentTab(tab);
        selectChannel(tab.channelId, tab.guildId);
    }

    const handleReorder = (result: DropResult) => {
        if (result.destination) {
            const newTabs = Array.from(tabs);
            const [removed] = newTabs.splice(result.source.index, 1);
            newTabs.splice(result.destination.index, 0, removed);

            setTabs(newTabs);
            saveTabsState(newTabs);
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        if (!event.dataTransfer) return;

        const uri = event.dataTransfer.getData("text/uri-list");

        const match = getChannelFromUri(uri);

        if (!match) return;

        const channel = ChannelStore.getChannel(match.channelId);

        if (!channel) return;

        const existingTabIndex = tabs.findIndex(tab => tab.channelId === match.channelId);

        if (existingTabIndex !== -1) {
            if (currentTab?.channelId === match.channelId) return;
            onTabNavigate(tabs[existingTabIndex])
            return;
        }

        const tab = createTabFromChannel(channel);

        if (!tab) return;

        if (tabs.length === 0) {
            setTabs([tab]);
            saveTabsState([tab]);
        }

        // find the closest element
        const element = Array.from(tabRefs.current.entries())
            .filter(x => !!x[1])
            .map(x => ({
                id: x[0],
                element: x[1],
                bounds: x[1]!.getBoundingClientRect()
            }))
            .reduce((previous, current) => {
                const currentCenter = current.bounds.left + (current.bounds.width / 2);
                const previousCenter = previous.bounds.left + (previous.bounds.width / 2);

                return Math.abs(currentCenter - event.clientX) < Math.abs(previousCenter - event.clientX)
                    ? current
                    : previous
            });

        // get the index of that element
        let index = tabs.findIndex(x => x.channelId === element.id);

        // do we add to the left or right?
        const addToLeft = (element.bounds.left + (element.bounds.width / 2)) < event.clientX;

        if (addToLeft)
            index++;

        const newTabs = [
            ...tabs.slice(0, index),
            tab,
            ...tabs.slice(index),
        ];

        setTabs(newTabs);
        saveTabsState(newTabs);

        if (isUriAtTab(window.location.pathname, tab)) {
            setCurrentTab(tab);
        }
    }

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
        if (popoutTargetTab) {
            setPopoutTargetTab(null);
            popoutTargetRef.current = null;
        }
    }

    const handleTabMouseEnter = (event: MouseEvent<HTMLDivElement>, tab: TabInfo) => {
        if (popoutTargetTab && popoutTargetTab.channelId !== tab.channelId && tab.channelId !== currentTab?.channelId) {
            popoutTargetRef.current = tabRefs.current.get(tab.channelId) ?? null;
            setPopoutTargetTab(tab);

            console.log("Switching to ", tab);

            if (popoutControls.current) {
                popoutControls.current.updatePosition();
            }
        }
    }

    const handleTabRequestPopout = (tab: TabInfo) => {
        if (popoutTargetTab) return;

        if (!tabs.find(x => x.channelId === tab.channelId)) return;

        popoutTargetRef.current = tabRefs.current.get(tab.channelId) ?? null;
        setPopoutTargetTab(tab);
    }

    const handleTabClick = (event: MouseEvent<HTMLDivElement>, tab: TabInfo) => {
        // @ts-ignore
        if (popoutContainerRef.current?.contains(event.target)) return;

        onTabNavigate(tab);
    }

    const handleShowQuickSwitch = () => {
        Navigator.QUICKSWITCHER_SHOW.action();

        let cleanOnShown: Function;
        let cleanOnSwitch: Function;

        cleanOnShown = hookDiscordAction(QUICKSWITCHER_SHOW, () => {
            console.log("Quick switch shown, but it wasn't us");
            cleanOnSwitch();
            cleanOnShown();
        });

        cleanOnSwitch = hookDiscordAction(QUICKSWITCHER_SWITCH_TO, (e: any) => {
            console.log("Quick switch switched", e);

            cleanOnSwitch();
            cleanOnShown();

            if (!e?.result?.type || !e.result.record) return;

            const _ = onAddRequested(e.result.type, e.result.record);
        })

    }
    
    return (
        <DragDropContext
            onBeforeDragStart={e => {
                dragTargetBounds.current = tabRefs.current.get(e.draggableId)?.getBoundingClientRect();
            }}
            onDragStart={() => {
                setIsReordering(true);
            }}
            onDragEnd={(e) => {
                setIsReordering(false);
                handleReorder(e);
            }}
        >
            <Droppable droppableId="channel-tabs-droppable" direction="horizontal">
                {(providedDroppable, snapshot) => (
                    <TabBarArea
                        {...providedDroppable.droppableProps}
                        onDrop={handleDrop}
                        onMouseLeave={handleMouseLeave}
                        onDragOver={event => {
                            if (event.dataTransfer.types.includes("text/uri-list")) {
                                event.dataTransfer.dropEffect = "copy";
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }}
                        onDragEnter={event => {
                            if (event.dataTransfer.types.includes("text/uri-list")) {
                                event.dataTransfer.dropEffect = "copy";
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }}
                        ref={(e) => {
                            providedDroppable.innerRef(e);

                            if (e) {
                                // todo: perf hit
                                const bounds = e.getBoundingClientRect();
                                if (tabBarBounds?.x !== bounds.x || tabBarBounds?.width !== bounds.width)
                                    setTabBarBounds(bounds);
                            }
                        }}
                    >
                        <TabPopout
                            popoutContainerRef={popoutContainerRef}
                            popoutControlsRef={popoutControls}
                            popoutOpen={!!popoutTargetTab && settings.showPopouts}
                            popoutTargetRef={popoutTargetRef}
                            popoutTargetTab={popoutTargetTab}
                            onRequestClose={() => setPopoutTargetTab(null)}
                        >
                            {(popoutProps, details) => (
                                <TabsContainer
                                    {...popoutProps}
                                >
                                    {tabs.map((tab, i) => (
                                        <>
                                            <TabWrapper>
                                                <Draggable key={tab.channelId} draggableId={tab.channelId} index={i}>
                                                    {(providedDraggable, snapshot) => {
                                                        // Restrict dragging to horizontal axis
                                                        let transform = providedDraggable.draggableProps.style?.transform;

                                                        if (snapshot.isDragging && dragTargetBounds.current && tabBarBounds && transform) {
                                                            transform = transform.replace(/\(([-+]*\d+)px, [-+]*\d+px/, match => {
                                                                const offset = Number.parseInt(match.slice(1))

                                                                const x = dragTargetBounds.current!.left + offset;

                                                                const bounds = Math.min(tabBarBounds.right - dragTargetBounds.current!.width, Math.max(tabBarBounds.left, x)) - dragTargetBounds.current!.left;
                                                                return `(${bounds}px, 0px`;
                                                            });

                                                            // @ts-ignore
                                                            providedDraggable.draggableProps.style = {
                                                                ...providedDraggable.draggableProps.style,
                                                                transform
                                                            }
                                                        }
                                                        return (
                                                            <Tab
                                                                {...providedDraggable.draggableProps}
                                                                {...providedDraggable.dragHandleProps}
                                                                outlined={outlinedTab?.channelId === tab.channelId}
                                                                onMouseEnter={event => handleTabMouseEnter(event, tab)}
                                                                popoutPresent={popoutTargetTab?.channelId === tab.channelId}
                                                                onRequestPopout={() => handleTabRequestPopout(tab)}
                                                                tab={tab}
                                                                isDragging={snapshot.isDragging}
                                                                innerRef={(e) => {
                                                                    providedDraggable.innerRef(e);
                                                                    tabRefs.current.set(tab.channelId, e);
                                                                }}
                                                                selected={tab.channelId === currentTab?.channelId}
                                                                onClose={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    onTabClose(tab);
                                                                }}
                                                                onClick={event => handleTabClick(event, tab)}
                                                                onAuxClick={e => {
                                                                    if (e.button === 1) { // middle mouse button
                                                                        e.preventDefault();
                                                                        onTabClose(tab);
                                                                    }
                                                                }}/>
                                                        )
                                                    }}
                                                </Draggable>
                                            </TabWrapper>
                                            {i + 1 < tabs.length && (
                                                <TabSpacer css={css`
                                                    ${isReordering && TabSpacerWhenDragging}
                                                `}/>
                                            )}
                                        </>

                                    ))}
                                    {providedDroppable.placeholder}
                                    <TabPlunger>
                                        <AddTabButton onClick={handleShowQuickSwitch}/>
                                    </TabPlunger>
                                </TabsContainer>
                            )}
                        </TabPopout>
                    </TabBarArea>
                )}
            </Droppable>
        </DragDropContext>

    );
};