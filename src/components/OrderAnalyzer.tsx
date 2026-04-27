'use client';

import { useState, useMemo } from 'react';
import { groupOrdersByWeekAndMonth, formatCurrency, getAvailableYears } from '@/utils/orderUtils';

interface OrderAnalyzerProps {
  data: unknown[];
}

export function OrderAnalyzer({ data }: OrderAnalyzerProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

  const availableYears = useMemo(() => getAvailableYears(data), [data]);
  
  const monthGroups = useMemo(() => groupOrdersByWeekAndMonth(data, selectedYear), [data, selectedYear]);

  const totals = useMemo(() => {
    return monthGroups.reduce(
      (acc, month) => ({
        totalProducts: acc.totalProducts + month.totalProducts,
        totalShipping: acc.totalShipping + month.totalShipping,
        orderCount: acc.orderCount + month.orderCount,
        shippingCount: acc.shippingCount + month.shippingCount,
      }),
      { totalProducts: 0, totalShipping: 0, orderCount: 0, shippingCount: 0 }
    );
  }, [monthGroups]);

  const toggleMonth = (month: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedMonths(newExpanded);
  };

  const toggleWeek = (weekKey: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekKey)) {
      newExpanded.delete(weekKey);
    } else {
      newExpanded.add(weekKey);
    }
    setExpandedWeeks(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Filtro Anno */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label htmlFor="year-filter" className="text-sm font-semibold text-gray-900">
            Filtra per anno:
          </label>
          <select
            id="year-filter"
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Tutti gli anni</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {selectedYear && (
            <button
              onClick={() => setSelectedYear(undefined)}
              className="text-sm text-gray-700 hover:text-gray-900 underline"
            >
              Rimuovi filtro
            </button>
          )}
          <div className="ml-auto text-sm text-gray-900">
            {monthGroups.length} mes{monthGroups.length === 1 ? 'e' : 'i'} visualizzat{monthGroups.length === 1 ? 'o' : 'i'}
          </div>
        </div>
      </div>

      {/* Raggruppamenti Mensili */}
      {monthGroups.map((month) => (
        <div key={month.month} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Mese */}
          <button
            onClick={() => toggleMonth(month.month)}
            className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg text-gray-500">
                {expandedMonths.has(month.month) ? '▼' : '▶'}
              </span>
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                {month.month}
              </h3>
              <span className="text-sm text-gray-500">
                ({month.weeks.length} settiman{month.weeks.length === 1 ? 'a' : 'e'})
              </span>
            </div>
            <div className="flex items-center gap-12 text-sm">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-green-600">🛒</span>
                  <span className="text-gray-600">Ordini:</span>
                  <span className="font-semibold text-gray-900">{month.orderCount}</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(month.totalProducts)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-orange-600">📦</span>
                  <span className="text-gray-600">Consegne:</span>
                  <span className="font-semibold text-gray-900">{month.shippingCount}</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(month.totalShipping)}</span>
                </div>
              </div>
            </div>
          </button>

          {/* Settimane */}
          {expandedMonths.has(month.month) && (
            <div className="p-4 space-y-2 bg-gray-50">
              {month.weeks.map((week) => {
                const weekKey = `${month.month}-${week.weekRange}`;
                return (
                  <div key={weekKey} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header Settimana */}
                    <button
                      onClick={() => toggleWeek(weekKey)}
                      className="w-full bg-white hover:bg-gray-50 px-5 py-3 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {expandedWeeks.has(weekKey) ? '▼' : '▶'}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          📅 {week.weekRange}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({week.orders.length} ordin{week.orders.length === 1 ? 'e' : 'i'})
                        </span>
                      </div>
                      <div className="flex items-center gap-12 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">🛒</span>
                          <span className="text-gray-600">N° Ordini</span>
                          <span className="font-semibold">{week.orderCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">€ Valore Ordini</span>
                          <span className="font-semibold">{formatCurrency(week.totalProducts)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600">📦</span>
                          <span className="text-gray-600">N° Consegne</span>
                          <span className="font-semibold">{week.shippingCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">€ Valore Consegne</span>
                          <span className="font-semibold text-orange-600">{formatCurrency(week.totalShipping)}</span>
                        </div>
                      </div>
                    </button>

                    {/* Dettagli Ordini */}
                    {expandedWeeks.has(weekKey) && (
                      <div className="bg-white border-t border-gray-200">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Data/Ora</th>
                              <th className="px-4 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Riferimento</th>
                              <th className="px-4 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Cliente</th>
                              <th className="px-4 py-2.5 text-center font-semibold text-gray-600 uppercase tracking-wide">Stato</th>
                              <th className="px-4 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wide">Prodotti</th>
                              <th className="px-4 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wide">Spedizione</th>
                            </tr>
                          </thead>
                          <tbody>
                            {week.orders.map((order, idx) => (
                              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2.5 text-gray-600">
                                  <span className="text-gray-500">📅</span> {order.created_at}
                                </td>
                                <td className="px-4 py-2.5 font-medium text-gray-900">{order.reference}</td>
                                <td className="px-4 py-2.5 text-gray-700">
                                  <span className="text-gray-500">👤</span> {order.customer}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                                    order.total_shipping > 0
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {order.total_shipping > 0 ? '📦 Consegnato' : '🟢 Confermato'}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right font-semibold text-gray-900">{formatCurrency(order.total_products)}</td>
                                <td className="px-4 py-2.5 text-right font-semibold text-orange-600">
                                  {order.total_shipping > 0 ? formatCurrency(order.total_shipping) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Subtotale Mese */}
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-5 py-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Subtotale {month.month}</span>
                  <div className="flex items-center gap-12 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{month.orderCount}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(month.totalProducts)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{month.shippingCount}</span>
                      <span className="font-semibold text-orange-600">{formatCurrency(month.totalShipping)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Totale Generale */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-xl shadow-lg p-6 text-white mt-6">
        <h2 className="text-2xl font-bold mb-5">Totale Generale</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-green-200 mb-1">N° Ordini</p>
            <p className="text-3xl font-bold">{totals.orderCount}</p>
          </div>
          <div>
            <p className="text-sm text-green-200 mb-1">Valore Ordini</p>
            <p className="text-3xl font-bold">{formatCurrency(totals.totalProducts)}</p>
          </div>
          <div>
            <p className="text-sm text-green-200 mb-1">N° Consegne</p>
            <p className="text-3xl font-bold">{totals.shippingCount}</p>
          </div>
          <div>
            <p className="text-sm text-green-200 mb-1">Valore Consegne</p>
            <p className="text-3xl font-bold text-orange-300">{formatCurrency(totals.totalShipping)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
