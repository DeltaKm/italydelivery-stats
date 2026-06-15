import { OrderData, WeekGroup, MonthGroup } from '@/types/order';
import { 
  startOfWeek, 
  endOfWeek, 
  format, 
  parseISO, 
  startOfMonth,
  getYear,
  isValid
} from 'date-fns';
import { it } from 'date-fns/locale';

export function groupOrdersByWeekAndMonth(data: unknown[], selectedYear?: number): MonthGroup[] {
  // Mappa i dati grezzi al formato OrderData
  const parseDate = (val: unknown): Date | null => {
    if (!val) return null;
    const normalized = String(val).replace(' ', 'T');
    const d = parseISO(normalized);
    return isValid(d) ? d : null;
  };

  const orders: OrderData[] = (data as Record<string, unknown>[]).map(row => ({
    created_at: String(row.created_at || ''),
    reference: String(row.reference || ''),
    customer: `${row.delivery_name || ''} ${row.delivery_surname || ''}`.trim() || String(row.customer || ''),
    status: String(row.state || row.status || ''),
    total_products: parseFloat(String(row.total_products || 0).replace(',', '.')),
    total_shipping: parseFloat(String(row.total_shipping || 0).replace(',', '.')),
  }));

  // Rimuovi duplicati basandosi su reference + created_at
  const uniqueOrders: OrderData[] = [];
  const seenKeys = new Set<string>();
  
  orders.forEach(order => {
    const uniqueKey = `${order.reference}-${order.created_at}`;
    if (!seenKeys.has(uniqueKey)) {
      seenKeys.add(uniqueKey);
      uniqueOrders.push(order);
    }
  });

  // Filtra per anno se specificato
  const filteredOrders = selectedYear 
    ? uniqueOrders.filter(order => {
        const date = parseDate(order.created_at);
        return date !== null && getYear(date) === selectedYear;
      })
    : uniqueOrders;

  // Raggruppa per mese e settimana
  const monthMap = new Map<string, WeekGroup[]>();

  filteredOrders.forEach(order => {
    if (!order.created_at) return;

    const date = parseDate(order.created_at);
    if (!date) return;

    const monthKey = format(startOfMonth(date), 'yyyy-MM');
    
    // Calcola l'inizio della settimana (lunedì)
    const weekStart = startOfWeek(date, { weekStartsOn: 1 as const });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 as const });
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }

    const weeks = monthMap.get(monthKey)!;
    let week = weeks.find(w => format(w.startDate, 'yyyy-MM-dd') === weekKey);

    if (!week) {
      week = {
        weekRange: `${format(weekStart, 'dd/MM', { locale: it })} - ${format(weekEnd, 'dd/MM', { locale: it })}`,
        startDate: weekStart,
        endDate: weekEnd,
        orders: [],
        totalOrders: 0,
        totalProducts: 0,
        totalShipping: 0,
        orderCount: 0,
        shippingCount: 0,
      };
      weeks.push(week);
    }

    week.orders.push(order);
    week.totalProducts += order.total_products;
    week.totalShipping += order.total_shipping;
    week.orderCount++;
    if (order.total_shipping > 0) {
      week.shippingCount++;
    }
  });

  // Converti in array di MonthGroup
  const monthGroups: MonthGroup[] = Array.from(monthMap.entries()).map(([monthKey, weeks]) => {
    const monthDate = parseISO(monthKey + '-01');
    
    // Ordina le settimane per data
    weeks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const totalProducts = weeks.reduce((sum, week) => sum + week.totalProducts, 0);
    const totalShipping = weeks.reduce((sum, week) => sum + week.totalShipping, 0);
    const orderCount = weeks.reduce((sum, week) => sum + week.orderCount, 0);
    const shippingCount = weeks.reduce((sum, week) => sum + week.shippingCount, 0);

    return {
      month: format(monthDate, 'MMMM yyyy', { locale: it }),
      monthDate,
      weeks,
      totalOrders: orderCount,
      totalProducts,
      totalShipping,
      orderCount,
      shippingCount,
    };
  });

  // Ordina per data
  monthGroups.sort((a, b) => a.monthDate.getTime() - b.monthDate.getTime());

  return monthGroups;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function getAvailableYears(data: unknown[]): number[] {
  const years = new Set<number>();
  
  (data as Record<string, unknown>[]).forEach(row => {
    if (row.created_at) {
      const normalized = String(row.created_at).replace(' ', 'T');
      const date = parseISO(normalized);
      if (isValid(date)) years.add(getYear(date));
    }
  });
  
  return Array.from(years).sort((a, b) => b - a); // Ordina dal più recente al più vecchio
}
