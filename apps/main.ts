import { ADMIN_BASE_PATH } from "@shared/config/routes";

const { pathname } = window.location;
const isAdminPath =
  pathname === ADMIN_BASE_PATH ||
  pathname.startsWith(`${ADMIN_BASE_PATH}/`);

if (isAdminPath) {
  void import("./admin/src/main");
} else {
  void import("./portfolio/src/main");
}
