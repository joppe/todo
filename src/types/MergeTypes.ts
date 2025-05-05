export type MergeTypes<Types extends unknown[], Result = {}> = Types extends [
  infer Head,
  ...infer Tail,
] ? MergeTypes<Tail, Head & Omit<Result, keyof Head>>
  : Result;
