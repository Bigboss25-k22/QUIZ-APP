import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  status?: number;
  error?: string;
  path?: string;
  timestamp?: string;
}

// Extends from AxiosError to strongly type the `error.response.data`
export type AppAxiosError = AxiosError<ApiErrorResponse>;
