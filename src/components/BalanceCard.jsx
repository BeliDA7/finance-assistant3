import React from 'react';

export default function BalanceCard({ totalApproved, totalInvoices }) {
  const balance = totalApproved - totalInvoices;

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Баланс</h2>
      <div className="text-2xl md:text-3xl font-bold mb-2">
        {balance.toLocaleString('ru-RU')} ₽
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Оплачено</span>
          <span className="text-green-600 font-medium">{totalApproved.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className="flex justify-between">
          <span>К оплате</span>
          <span className="text-red-600 font-medium">{totalInvoices.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    </div>
  );
}