import React from 'react';

export default function SimpleChart({ payments }) {
  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Статистика расходов</h2>
        <p className="text-gray-500 text-center py-8">Нет данных для отображения</p>
      </div>
    );
  }

  const data = {};
  payments.forEach(p => {
    const match = p.description?.match(/семестр\s*(\d+)/i);
    if (match) {
      const sem = parseInt(match[1]);
      if (!data[sem]) data[sem] = 0;
      data[sem] += p.amount;
    } else {
      if (!data['Прочие']) data['Прочие'] = 0;
      data['Прочие'] += p.amount;
    }
  });

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  const sortedKeys = Object.keys(data).sort((a, b) => {
    if (a === 'Прочие') return 1;
    if (b === 'Прочие') return -1;
    return parseInt(a) - parseInt(b);
  });

  const colors = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#5eead4', '#2dd4bf'];
  let gradientString = '';
  let cumulativePercent = 0;
  sortedKeys.forEach((key, idx) => {
    const percent = (data[key] / total) * 100;
    const start = cumulativePercent;
    const end = cumulativePercent + percent;
    gradientString += `${colors[idx % colors.length]} ${start}% ${end}%, `;
    cumulativePercent = end;
  });
  gradientString = gradientString.slice(0, -2);

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Статистика расходов по семестрам</h2>
      <div className="flex flex-col items-center">
        <div
          className="w-36 h-36 sm:w-48 sm:h-48 rounded-full shadow-inner"
          style={{ background: `conic-gradient(${gradientString})` }}
        ></div>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs md:text-sm">
          {sortedKeys.map((key, idx) => {
            const percent = ((data[key] / total) * 100).toFixed(1);
            const label = key === 'Прочие' ? 'Прочие' : `Сем. ${key}`;
            return (
              <div key={key} className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 rounded" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                {label} ({percent}%)
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Итого: <span className="font-semibold">{total.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    </div>
  );
}