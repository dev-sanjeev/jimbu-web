import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Home,
  Wallet,
  Receipt,
  Tags,
  Settings,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { Text } from "@/shared/Text";
import { BrandIcon } from "@/shared/BrandIcon";
import { useAuthStore } from "@/stores/authStore";
import { useIconColors } from "@/hooks/useIconColors";

const APP_VERSION = "1.0.0";

interface SidebarProps {
  isWide: boolean;
  onClose: () => void;
  isOpen?: boolean;
}

function NavItem({
  icon: Icon,
  label,
  active,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const icon = useIconColors();
  return (
    <button
      onClick={onPress}
      className={`w-full flex flex-row items-center gap-3 px-3 py-3 rounded-lg mb-0.5 transition-colors cursor-pointer ${
        active ? "bg-accent" : "hover:bg-accent-subtle"
      }`}
    >
      <Icon
        size={20}
        color={active ? icon.inverse : icon.muted}
        strokeWidth={1}
      />
      <Text
        variant="label"
        className={`font-semibold ${active ? "text-white" : "text-foreground"}`}
      >
        {label}
      </Text>
    </button>
  );
}

export function Sidebar({ isWide, onClose, isOpen = true }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const icon = useIconColors();
  const queryClient = useQueryClient();

  const pathname = location.pathname;
  const isHome = pathname === "/main" || pathname === "/main/";
  const isAccounts = pathname.startsWith("/main/accounts");
  const isTransactions = pathname.startsWith("/main/transactions");
  const isCategories = pathname.startsWith("/main/categories");
  const isSettings = pathname === "/main/settings";

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "?";

  const handleSignOut = async () => {
    await logout();
    queryClient.clear();
    navigate("/login", { replace: true });
    toast.success("Signed out", {
      description: "You have been signed out successfully.",
    });
  };

  const go = (path: string) => {
    navigate(path);
    if (!isWide) onClose();
  };

  return (
    <div
      className={`flex flex-col h-full ${
        isWide
          ? "w-64 border border-subtle-border rounded-xl bg-transparent mr-4 mt-3 mb-3"
          : `w-72 bg-white fixed left-0 top-0 bottom-0 z-50 shadow-card transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`
      }`}
    >
      {/* Scrollable nav content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {/* User header */}
        <div className="flex flex-row justify-between items-start mb-6">
          <div className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center">
              <Text variant="h2" className="text-accent">
                {initials}
              </Text>
            </div>
            <div>
              <Text variant="body" className="font-medium text-foreground">
                {fullName}
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                {user?.username ?? ""}
              </Text>
            </div>
          </div>
          {!isWide && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted cursor-pointer"
            >
              <X size={20} color={icon.muted} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Main nav */}
        <div className="mb-2">
          <Text
            variant="caption"
            className="text-muted-foreground uppercase tracking-wider mb-2 pl-3 block"
          >
            MAIN
          </Text>
          <NavItem
            icon={Home}
            label="Home"
            active={isHome}
            onPress={() => go("/main")}
          />
          <NavItem
            icon={Wallet}
            label="Accounts"
            active={isAccounts}
            onPress={() => go("/main/accounts")}
          />
          <NavItem
            icon={Receipt}
            label="Transactions"
            active={isTransactions}
            onPress={() => go("/main/transactions")}
          />
          <NavItem
            icon={Tags}
            label="Categories"
            active={isCategories}
            onPress={() => go("/main/categories")}
          />
        </div>

        {/* Manage nav */}
        <div className="mb-2">
          <Text
            variant="caption"
            className="text-muted-foreground uppercase tracking-wider mb-2 pl-3 block"
          >
            MANAGE
          </Text>
          <NavItem
            icon={Settings}
            label="Settings"
            active={isSettings}
            onPress={() => go("/main/settings")}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 pt-4 border-t border-border"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 0px) + 8px, 24px)",
        }}
      >
        <div className="p-4 bg-accent-subtle rounded-xl mb-4">
          <div className="flex flex-row items-center gap-2 mb-2">
            <BrandIcon size={24} radius={6} />
            <Text variant="body" className="font-semibold text-foreground">
              Jimbu
            </Text>
            <Text variant="caption" className="text-muted-foreground">
              v{APP_VERSION}
            </Text>
          </div>
          <Text variant="caption" className="text-muted-foreground">
            Track your everyday finances and manage your family budget with
            ease.
          </Text>
          <div className="flex flex-row items-center gap-2 mt-2">
            <Text
              variant="caption"
              className="text-accent cursor-pointer"
              onPress={() => go("/main/terms")}
            >
              Terms &amp; Conditions
            </Text>
            <Text variant="caption" className="text-muted-foreground">
              ·
            </Text>
            <Text
              variant="caption"
              className="text-accent cursor-pointer"
              onPress={() => go("/main/privacy")}
            >
              Privacy Policy
            </Text>
          </div>
        </div>

        <button
          className="w-full flex flex-row items-center gap-2.5 p-3 rounded-lg bg-card border border-subtle-border hover:bg-destructive/5 transition-colors cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut size={20} color={icon.destructive} strokeWidth={1.8} />
          <Text variant="label" className="font-semibold text-destructive">
            Sign Out
          </Text>
        </button>
      </div>
    </div>
  );
}
