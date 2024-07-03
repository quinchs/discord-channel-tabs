// @flow 
import * as React from 'react';
import {PropsWithChildren} from 'react';
import {TabBar} from "./tabBar";

export const TabArea = (props: PropsWithChildren<{}>) => {
    return (
        <>
            <TabBar/>
            {props.children}
        </>
    );
};