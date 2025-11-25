import { expect, test } from "vitest";
import { plus } from "./plus";

test("plus(1, 1) equals 2", () => {
  expect(plus(1, 1)).toBe(2);
});
