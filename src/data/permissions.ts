import type { PermissionAction } from "@/types";

export const PERMISSION_ACTIONS: PermissionAction[] = [
  { label: "Read information", level: "automatic" },
  { label: "Search documents", level: "automatic" },
  { label: "Check inventory", level: "automatic" },
  { label: "Retrieve orders", level: "automatic" },
  { label: "Analyze data", level: "automatic" },
  { label: "Prepare reports", level: "automatic" },
  { label: "Draft responses", level: "automatic" },
  { label: "Sending important emails", level: "approval" },
  { label: "Creating orders", level: "approval" },
  { label: "Updating sensitive data", level: "approval" },
  { label: "Booking appointments", level: "approval" },
  { label: "Changing pricing", level: "approval" },
  { label: "Issuing refunds", level: "approval" },
  { label: "Confirming quotations", level: "approval" },
];
