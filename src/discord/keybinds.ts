import {KeyBind, KeyCode, KeyCodeType} from "./index";

export type ParsedKeybind = {
    keyCode: number,
    metaKey: boolean, 
    shiftKey: boolean, 
    altKey: boolean, 
    ctlKey: boolean,
}

export type ParseKeybindFunction = (codes: KeyCode[]) => ParsedKeybind[];

export const parseKeybind = BdApi.Webpack.getByStrings(
    "keyCode", "metaKey", "shiftKey", "combo", "BROWSER", 
    {searchExports: true, fatal: true}
)! as ParseKeybindFunction;

export const KeybindClassNames = BdApi.Webpack.getByKeys(
    "row", "switch", "keybindGroup", 
    {fatal: true}
)! as {
    item: string
    keybindMessage: string
    switch: string
    removeKeybind: string
    keybindGroup: string
    defaultKeybind: string
    defaultKeybindGroup: string
    defaultKeybindShortcutGroup: string
    defaultKeybindGroupHeader: string
    defaultKeybindGroupWithDescription: string
    defaultKeybindGroupDescription: string
    browserNotice: string
    row: string
}

export const keyCodeToString = BdApi.Webpack.getByStrings(
    "LINUX", "BROWSER", '+', 
    {searchExports: true, fatal: true}
)! as (code: KeyCode) => string | undefined;

export const formatKeybind =  BdApi.Webpack.getByStrings(
    "KEYBOARD_KEY", "KEYBOARD_MODIFIER_KEY", "Mac OS X",
    {searchExports: true, fatal: true}
)! as (bind: KeyBind, useSpaceFormat?: boolean) => string;

export const modifierRegex = /shift|meta|ctrl|alt$/;

export const keyCodesFromString = BdApi.Webpack.getByStrings("numpad plus", "/mod/i",{searchExports: true})! as (key: string, device?: number, type?: KeyCodeType) => KeyCode[];