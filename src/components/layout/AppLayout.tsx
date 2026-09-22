import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { BrandIcon } from "@/shared/BrandIcon";
import { useIconColors } from "@/hooks/useIconColors";
import { Text } from "@/shared/Text";

const SIDEBAR_BREAKPOINT = 768;

function AppHeader({
  isWide,
  onMenuPress,
}: {
  isWide: boolean;
  onMenuPress: () => void;
}) {
  const icon = useIconColors();
  return (
    <div
      className={`flex flex-row items-center gap-2.5 py-4 ${isWide ? "" : "px-6"}`}
    >
      {!isWide && (
        <button
          onClick={onMenuPress}
          className="rounded-lg flex items-center justify-center hover:bg-muted cursor-pointer"
        >
          <Menu size={22} color={icon.default} strokeWidth={1.8} />
        </button>
      )}
      <BrandIcon size={28} radius={8} />
      <Text variant="h2" className="text-accent">
        JIMBU
      </Text>
    </div>
  );
}

export function AppLayout() {
  const { width } = useWindowSize();
  const isWide = width >= SIDEBAR_BREAKPOINT;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`flex h-screen overflow-hidden ${isWide ? "flex-row px-12" : "flex-col"}`}
    >
      {/* Permanent sidebar on wide screens */}
      {isWide && <Sidebar isWide={true} onClose={() => {}} />}

      {/* Overlay sidebar on mobile — always mounted for smooth transition */}
      {!isWide && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            isWide={false}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <AppHeader isWide={isWide} onMenuPress={() => setSidebarOpen(true)} />
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
