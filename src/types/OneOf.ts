import type { ExcludeProps } from "./ExcludeProps.ts";
import type { MergeTypes } from "./MergeTypes.ts";

export type OneOf<
  Types extends unknown[],
  Result = never,
  AllProperties = MergeTypes<Types>,
> = Types extends [infer Head, ...infer Tail]
  ? OneOf<Tail, Result | ExcludeProps<Head, AllProperties>, AllProperties>
  : Result;
