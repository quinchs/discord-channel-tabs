import {PureComponent} from "react";

export interface ChatBoxComponentProps {
    channel: any;
    focused?: boolean, 
    onBlur?: Function,
    onFocus?: Function,
    hasModalOpen?: boolean, 
    highlighted?: boolean,
    pendingReply?: any, 
    chatInputType?: any, 
    placeholder?: string,
    accessibilityLabel?: any,
    shakeIntensity?: any,
    poggermodeEnabled?: boolean
}

export class ChatBoxComponentType extends PureComponent<ChatBoxComponentProps> {
    constructor(...props: any);
}