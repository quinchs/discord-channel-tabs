/** @jsx jsx */
import {jsx, SerializedStyles} from '@emotion/react'
import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
    css?: SerializedStyles;
};
export const CloseIcon = ({css, ...props}: Props) => {
    return (
        <svg {...props} css={css} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
             fill="#e8eaed">
            <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
    );
};