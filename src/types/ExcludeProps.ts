export type ExcludeProps<A, B> = A & { [K in keyof Omit<B, keyof A>]?: never };
