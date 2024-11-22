declare module 'katex' {
    export function render(
        latex: string,
        element: HTMLElement,
        options?: { throwOnError?: boolean, displayMode?: boolean, output?: string }
    ): void;

    export function renderToString(
        latex: string,
        options?: { throwOnError?: boolean, displayMode?: boolean, output?: string }
    ): string;

    export const version: string;
}