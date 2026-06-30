import React, { useState } from 'react';

export default function PaymentsTable({ payments }) {
  const [filter, setFilter] = useState('all');

  const years = [...new Set(payments.map(p => p.date.slice(0,4)))];
  const filtered = filter === 'all'
    ? payments
    : payments.filter(p => p.date.startsWith(filter));

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700">История платежей</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-auto"
        >
          <option value="all">Все годы</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-3 text-gray-600">Дата</th>
              <th className="text-left py-2 px-3 text-gray-600">Назначение</th>
              <th className="text-right py-2 px-3 text-gray-600">Сумма</th>
              <th className="text-center py-2 px-3 text-gray-600">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{p.date}</td>
                <td className="py-2 px-3">{p.description}</td>
                <td className="text-right py-2 px-3">{p.amount.toLocaleString('ru-RU')} ₽</td>
                <td className="text-center py-2 px-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-4">Нет записей</div>
        )}
      </div>
    </div>
  );
}