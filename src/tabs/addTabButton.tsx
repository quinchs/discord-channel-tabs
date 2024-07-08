/** @jsx jsx */
import {jsx} from '@emotion/react'
import styled from "@emotion/styled";
import {Navigator, PlusIconSmall} from "../discord";
import {hookDiscordAction, QUICKSWITCHER_SHOW, QUICKSWITCHER_SWITCH_TO} from "../discord/actionLogger";

type Props = {
    onClick: () => void;
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
    

    return (
        <Icon onClick={props.onClick}/>
    );
};