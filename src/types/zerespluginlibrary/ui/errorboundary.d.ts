export function WrapBoundary(Original: any): {
    new(): {
        render(): any;
    };
};

export default class ErrorBoundary {
    state: {
        hasError: boolean;
    };

    constructor(props: any);

    componentDidCatch(): void;

    render(): any;
}
