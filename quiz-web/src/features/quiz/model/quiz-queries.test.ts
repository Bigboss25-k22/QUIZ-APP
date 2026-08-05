import { skipToken } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { quizKeys, quizQueries } from "./quiz-queries";

describe("quiz query options", () => {
  it("tạo key ổn định và đưa search vào cache identity", () => {
    expect(quizQueries.list("java").queryKey).toEqual(["quiz", "list", { search: "java" }]);
    expect(quizKeys.detail("12")).toEqual(["quiz", "detail", "12"]);
  });

  it("dùng skipToken khi chưa có user id", () => {
    expect(quizQueries.results(undefined).queryFn).toBe(skipToken);
    expect(quizQueries.results(7).staleTime).toBe(30_000);
  });
});
