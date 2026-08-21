import axios from "axios";
import { z, type ZodType } from "zod";

export const errorResponseSchema = z.object({
  status: z.number().int(),
  message: z.string().min(1),
  timestamp: z.number(),
  path: z.string(),
});

export class ApiContractError extends Error {
  readonly endpoint: string;
  readonly issues: readonly string[];

  constructor(endpoint: string, issues: readonly string[]) {
    super(`API response không đúng contract tại ${endpoint}.`);
    this.name = "ApiContractError";
    this.endpoint = endpoint;
    this.issues = issues;
  }
}

export function parseApiResponse<T>(schema: ZodType<T>, data: unknown, endpoint: string): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw new ApiContractError(endpoint, result.error.issues.map((issue) => `${issue.path.join(".") || "response"}: ${issue.message}`));
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiContractError) return "Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại sau.";
  if (!axios.isAxiosError(error)) return fallback;
  if ((error.response?.status ?? 0) >= 500) return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
  const parsed = errorResponseSchema.safeParse(error.response?.data);
  return parsed.success ? parsed.data.message : fallback;
}
