export const ADMIN_BASE_PATH = "/admin";

export const adminRoute = {
  login: "/login",
  dashboard: "/dashboard",
  mfaSetup: "/mfa/setup",
  mfaVerify: "/mfa/verify",
} as const;

export function getAdminUrl(path: string): string {
  return `${ADMIN_BASE_PATH}${path}`;
}
