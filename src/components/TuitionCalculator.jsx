import React, { useState, useEffect, useRef } from 'react';

export default function TuitionCalculator({ 
  specialties, 
  selectedSpecialty, 
  onSpecialtyChange,
  hasData 
}) {
  const spec = specialties[selectedSpecialty];
  const [result, setResult] = useState(null);
  const prevSpecialtyRef = useRef(selectedSpecialty);

  useEffect(() => {
    setResult(null);
  }, [selectedSpecialty]);

  const handleSpecialtyChange = (e) => {
    const newSpecialty = e.target.value;
    if (hasData && newSpecialty !== selectedSpecialty) {
      alert('Нельзя сменить специальность, так как уже есть счета или история платежей. Сначала очистите данные.');
      e.target.value = selectedSpecialty;
      return;
    }
    prevSpecialtyRef.current = newSpecialty;
    onSpecialtyChange(newSpecialty);
  };

  const handleCalculate = () => {
    if (!spec) return;
    const total = spec.semesters * spec.pricePerSemester;
    setResult({
      specialty: selectedSpecialty,
      semesters: spec.semesters,
      total: total,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Калькулятор стоимости обучения</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Специальность</label>
          <select
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base"
          >
            {Object.keys(specialties).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Количество семестров</label>
          <input
            type="number"
            value={spec ? spec.semesters : ''}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed text-sm md:text-base"
          />
        </div>
        <div>
          <button
            onClick={handleCalculate}
            className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm md:text-base"
          >
            Рассчитать
          </button>
        </div>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-base md:text-lg font-semibold text-blue-800">
            Полная стоимость обучения за {result.semesters} семестров по специальности «{result.specialty}»:
            <span className="ml-2 text-xl md:text-2xl">{result.total.toLocaleString('ru-RU')} ₽</span>
          </p>
          <p className="text-sm text-red-600 mt-2">*Увеличение стоимости платных образовательных услуг после заключения настоящего Договора не допускается,
            за исключением увеличения стоимости указанных услуг с учетом уровня инфляции, предусмотренного основными характеристиками федерального бюджета
             на очередной финансовый год и плановый период.</p>
        </div>
      )}
    </div>
  );
}