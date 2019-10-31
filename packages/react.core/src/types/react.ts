/** Shorthand for {@link JSX.IntrinsicElements}. */
export type HTMLTags = JSX.IntrinsicElements;

/** Type alias for HTML tag names. */
export type HTMLTag = string & keyof JSX.IntrinsicElements;

/** Type alias for getting detailed HTML props. */
export type HTMLTagProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];
