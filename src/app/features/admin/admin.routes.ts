import type { Routes } from "@angular/router"
import { adminAuthGuard } from "./guards/admin-auth.guard"

export const adminRoutes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./login/admin-login.component").then((m) => m.AdminLoginComponent),
    title: "Admin Login",
  },
  {
    path: "dashboard",
    loadComponent: () => import("./dashboard/admin-dashboard.component").then((m) => m.AdminDashboardComponent),
    title: "Admin Dashboard",
    canActivate: [adminAuthGuard],
  },
  {
    path: "dashboard/:page",
    loadComponent: () => import("./dashboard/admin-dashboard.component").then((m) => m.AdminDashboardComponent),
    title: "Admin Dashboard",
    canActivate: [adminAuthGuard],
  },
  {
    path: "applications/:tab",
    loadComponent: () => import("./dashboard/admin-dashboard.component").then((m) => m.AdminDashboardComponent),
    title: "Admin Applications",
    canActivate: [adminAuthGuard],
  },
  {
    path: "settings",
    loadComponent: () => import("./settings/admin-settings.component").then((m) => m.AdminSettingsComponent),
    title: "Admin Settings",
    canActivate: [adminAuthGuard],
  },
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
]
