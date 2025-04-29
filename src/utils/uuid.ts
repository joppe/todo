import { v1 } from "jsr:@std/uuid";

export function uuid(): string {
  return v1.generate();
}
