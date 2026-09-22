import * as LucideIcons from 'lucide-react';
import React from 'react';

type LucideComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const IONICONS_TO_LUCIDE: Record<string, string> = {
  restaurant: 'Utensils',
  cart: 'ShoppingCart',
  flash: 'Zap',
  medkit: 'Stethoscope',
  'game-controller': 'Gamepad2',
  'bag-handle': 'ShoppingBag',
  school: 'GraduationCap',
  airplane: 'Plane',
  cut: 'Scissors',
  'shield-checkmark': 'ShieldCheck',
  'ellipsis-horizontal': 'MoreHorizontal',
  cash: 'Banknote',
  business: 'Building',
  'add-circle': 'PlusCircle',
  cafe: 'Coffee',
  book: 'BookOpen',
  pricetag: 'Tag',
  pricetags: 'Tags',
  card: 'CreditCard',
  'pie-chart-outline': 'PieChart',
  'sparkles-outline': 'Sparkles',
  'wallet-outline': 'Wallet',
  'bar-chart': 'BarChart3',
  close: 'X',
  'log-out': 'LogOut',
  'trash-outline': 'Trash2',
};

function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
}

export function resolveLucideIcon(name: string): LucideComponent {
  const exports = LucideIcons as unknown as Record<string, LucideComponent>;
  const mapped = IONICONS_TO_LUCIDE[name];
  return exports[mapped ?? toPascalCase(name)] ?? exports.Circle;
}
