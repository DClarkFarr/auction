/// <reference types="@emotion/react/types/css-prop" />

//https://github.com/emotion-js/emotion/issues/3049
//When using forwardRef it types the return as ReactNode, but emotion sets that return type to include `undefined` which jsx complains about
declare module "@emotion/react/jsx-runtime" {
    namespace JSX {
        type ElementType = React.JSX.ElementType;
    }
}
