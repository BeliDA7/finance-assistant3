import React from 'react';

export default function UpcomingPayments({ payments, historyPayments }) {
  const isPaid = (semesterNumber) => {
    return historyPayments.some(p => {
      if (!p.description) return false;
      const match = p.description.match(/семестр\s*(\d+)/i);
      if (match) {
        return parseInt(match[1]) === semesterNumber && p.status === 'Утверждено';
      }
      return false;
    });
  };

  const unpaidPayments = payments.filter(p => !isPaid(p.semester));

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Предстоящие платежи</h2>
      {unpaidPayments.length === 0 ? (
        <div className="text-gray-500 text-sm">Все семестры оплачены</div>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          <ul className="space-y-2">
            {unpaidPayments.map(p => (
              <li key={p.id} className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b border-gray-100 pb-1 text-sm">
                <div>
                  <span className="font-medium">Семестр {p.semester}</span>
                  <span className="text-gray-500 ml-2 text-xs">(оплатить до: {p.deadline})</span>
                </div>
                <span className="font-semibold text-gray-800 mt-1 sm:mt-0">{p.amount.toLocaleString('ru-RU')} ₽</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}