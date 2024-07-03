import {FunctionComponent, HTMLAttributes} from "react";

export default BdApi.Webpack.getModule((m) => m.Type?.SPINNING_CIRCLE, {
    searchExports: true,
    fatal: true
}) as FunctionComponent<{
    type: "wanderingCubes" | "chasingDots" | "pulsingEllipsis" | "spinningCircle" | "spinningCircleSimple" | "lowMotion",
    animated: boolean,
    className?: string,
    itemClassName?: string,
} & HTMLAttributes<HTMLDivElement>>;

