// @flow 
import * as React from 'react';
import BdApiModule from "../types/bdapi";
import {createElement} from "react";

type Props = {
    user: any;
};

// @ts-ignore
const native = (BdApi.Webpack.getModule((a,b,c) => {
    return b.id === 974674
}) as any).qE;

export const UserAvatar = (props: Props) => {
    return createElement(native, {...props.user})
};