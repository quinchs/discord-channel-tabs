import {Component, ComponentClass, PropsWithChildren} from "react";

const popout = BdApi.Webpack.getByKeys("Popout").Popout;

export default popout as ComponentClass<PropsWithChildren<{
    shouldShow?: boolean,
    position?: "top" | "bottom" | "left" | "right" | "center" | "window_center",
    onRequestClose?: Function,
    onRequestOpen?: Function
    align: "left" | "top" | "center",
    autoInvert?: boolean,
}>>