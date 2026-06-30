import React, { useState } from 'react';

export default function InvoicesTable({ invoices, onAdd, onApprove, allSemesters, pricePerSemester, historyPayments }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [amount, setAmount] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [fileName, setFileName] = useState('');

  const paidSemesters = historyPayments
    .filter(p => p.status === 'Утверждено')
    .map(p => {
      const match = p.description?.match(/семестр\s*(\d+)/i);
      return match ? parseInt(match[1]) : null;
    })
    .filter(num => num !== null);

  const invoicedSemesters = invoices
    .map(inv => {
      const match = inv.semester?.match(/семестр\s*(\d+)/i);
      return match ? parseInt(match[1]) : null;
    })
    .filter(num => num !== null);

  const excludedSemesters = new Set([...paidSemesters, ...invoicedSemesters]);

  const availableSemesters = allSemesters.filter(sem => !excludedSemesters.has(sem));

  const handleSemesterChange = (e) => {
    const semesterNumber = e.target.value;
    setSelectedSemester(semesterNumber);
    if (semesterNumber && pricePerSemester) {
      setAmount(String(pricePerSemester));
    } else {
      setAmount('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSemester || !amount) return;
    const today = new Date().toISOString().slice(0, 10);
    onAdd({
      date: today,
      semester: `Семестр ${selectedSemester}`,
      semesterNumber: Number(selectedSemester),
      amount: Number(amount),
      file: fileAttached ? fileName : null,
    });
    setSelectedSemester('');
    setAmount('');
    setFileAttached(false);
    setFileName('');
    setShowForm(false);
  };

  const handleAttachFile = () => {
    const fakeName = `квитанция_${Date.now()}.pdf`;
    setFileName(fakeName);
    setFileAttached(true);
    alert(`Файл "${fakeName}" успешно прикреплён (демонстрация)`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700">Счета к оплате</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setFileAttached(false);
              setFileName('');
              setSelectedSemester('');
              setAmount('');
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base w-full sm:w-auto"
        >
          {showForm ? '✕ Отмена' : '+ Добавить счёт'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Семестр</label>
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="w-full border rounded px-3 py-2 text-sm"
                required
              >
                <option value="">Выберите семестр</option>
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Семестр {sem}
                  </option>
                ))}
              </select>
              {availableSemesters.length === 0 && (
                <p className="text-sm text-green-600 mt-1">Все семестры оплачены или уже есть заведённые счета</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Сумма</label>
              <input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAttachFile}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
            >
              📎 Приложить файл
            </button>
            {fileAttached && (
              <span className="text-sm text-green-600">
                ✅ Файл: {fileName}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
          >
            Сохранить счёт
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-3 text-gray-600">Дата</th>
              <th className="text-left py-2 px-3 text-gray-600">Семестр</th>
              <th className="text-right py-2 px-3 text-gray-600">Сумма</th>
              <th className="text-center py-2 px-3 text-gray-600">Статус</th>
              <th className="text-center py-2 px-3 text-gray-600">Действие</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{inv.date}</td>
                <td className="py-2 px-3">{inv.semester}</td>
                <td className="text-right py-2 px-3">{inv.amount.toLocaleString('ru-RU')} ₽</td>
                <td className="text-center py-2 px-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {inv.status}
                  </span>
                </td>
                <td className="text-center py-2 px-3">
                  <button
                    onClick={() => onApprove(inv.id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition"
                  >
                    Оплатить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="text-center text-gray-500 py-4">Нет счетов</div>
        )}
      </div>
    </div>
  );
}