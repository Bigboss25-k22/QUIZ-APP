import axios from "axios";
import { describe, expect, it } from "vitest";
import { ApiContractError } from "@/lib/http/api-contract";
import { shouldRetryQuery } from "./query-client";

describe("query retry policy", () => {
  it("retry lỗi mạng nhưng không retry contract hoặc khi quá giới hạn", () => {
    expect(shouldRetryQuery(0, new axios.AxiosError("network"))).toBe(true);
    expect(shouldRetryQuery(0, new ApiContractError("/api/test", ["id: invalid"]))).toBe(false);
    expect(shouldRetryQuery(2, new axios.AxiosError("network"))).toBe(false);
  });

  it("chỉ retry response từ 5xx", () => {
    const clientError = new axios.AxiosError("bad request");
    Object.assign(clientError, { response: { status: 400 } });
    const serverError = new axios.AxiosError("server error");
    Object.assign(serverError, { response: { status: 503 } });
    expect(shouldRetryQuery(0, clientError)).toBe(false);
    expect(shouldRetryQuery(0, serverError)).toBe(true);
  });
});
