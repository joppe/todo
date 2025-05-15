import { assertEquals } from "jsr:@std/assert";

import { input } from "./input.ts";

Deno.test("input", async (t) => {
  await t.step("long", () => {
    const args = ["--foo", "--bar"];
    const result = input(args);

    assertEquals(result, [
      { value: "foo", type: "long" },
      { value: "bar", type: "long" },
    ]);
  });

  await t.step("short", () => {
    const args = ["-f", "-b"];

    const result = input(args);
    assertEquals(result, [
      { value: "f", type: "short" },
      { value: "b", type: "short" },
    ]);
  });

  await t.step("anonymous", () => {
    const args = ["foo", "bar"];
    const result = input(args);

    assertEquals(result, [
      { value: "foo", type: "anonymous" },
      { value: "bar", type: "anonymous" },
    ]);
  });

  await t.step("mixed", () => {
    const args = ["--foo", "-b", "bar"];
    const result = input(args);

    assertEquals(result, [
      { value: "foo", type: "long" },
      { value: "b", type: "short" },
      { value: "bar", type: "anonymous" },
    ]);
  });

  await t.step("expanded short", () => {
    const args = ["-abc", "foo"];
    const result = input(args);

    assertEquals(result, [
      { value: "a", type: "short" },
      { value: "b", type: "short" },
      { value: "c", type: "short" },
      { value: "foo", type: "anonymous" },
    ]);
  });
});
