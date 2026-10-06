/** Odoo app names (as written in scenarios.json and cases) → Lucide icon and short label. */
import type { IconName } from '../icons/lucide';

export const appIcons: Record<string, IconName> = {
  CRM: 'users',
  Sales: 'receipt-text',
  Project: 'kanban',
  Timesheets: 'clock',
  Accounting: 'calculator',
  Recruitment: 'user-check',
  Website: 'globe',
  'Our contractor module': 'puzzle',
  Purchase: 'shopping-cart',
  Inventory: 'package',
  Barcode: 'scan-barcode',
  eCommerce: 'store',
  Manufacturing: 'factory',
  Quality: 'clipboard-check',
};

export const appIcon = (app: string): IconName => appIcons[app] ?? 'layers';
export const appLabel = (app: string) => (app === 'Our contractor module' ? 'Contractors' : app);
