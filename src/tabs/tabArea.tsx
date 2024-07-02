// @flow 
import * as React from 'react';
import {PropsWithChildren, ReactNode} from "react";
import {TabBar} from "./tabBar";

export const TabArea = (props: PropsWithChildren<{}>) => {
    return (
        <>
            <TabBar/>
            {props.children}
        </>
    );
};