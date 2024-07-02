/** @jsx jsx */
import {css, jsx} from '@emotion/react'
import styled from "@emotion/styled";
import {Navigator, PlusIconSmall} from "../discord";
import {
    hookDiscordAction,
    QUICKSWITCHER_SHOW,
    QUICKSWITCHER_SWITCH_TO
} from "../discord/actionLogger";

type Props = {
    onAdd: (type: string, record: any) => void;
};
const Icon = styled(PlusIconSmall)`
    border-radius: 12px;
    margin-left: 8px;
    background-color: transparent;
    transition: background-color 0.1s ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: color-mix(in lch, var(--background-tertiary) 15%, transparent);
    }
`

export const AddTabButton = (props: Props) => {
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
            
            props.onAdd(e.result.type, e.result.record);
        })
        
    }
    
    return (
        <Icon onClick={handleShowQuickSwitch}/>
    );
};