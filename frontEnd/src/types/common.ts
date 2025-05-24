export interface AlertInfo {
  message: string;
  type: "success" | "error" | "warning" | "info";
  key?: number;
  duration?: number; // (ms)
}
