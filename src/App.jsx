import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileCard from './components/ProfileCard';
import BalanceCard from './components/BalanceCard';
import InvoicesTable from './components/InvoicesTable';
import PaymentsTable from './components/PaymentsTable';
import TuitionCalculator from './components/TuitionCalculator';
import SimpleChart from './components/SimpleChart';
import UpcomingPayments from './components/UpcomingPayments';

// Данные перенесены сюда
const user = {
  name: 'Иванов Иван Иванович',
  group: 'Ф-18',
  course: 1,
  email: 'ivan.ivanov@akademy.ru',
};

const initialInvoices = [];
const initialPayments = [];

const specialties = {
  'Лечебное дело': { semesters: 12, pricePerSemester: 60000 },
  'Фармация': { semesters: 10, pricePerSemester: 55000 },
  'Менеджмент': { semesters: 8, pricePerSemester: 45000 },
  'Экономика': { semesters: 8, pricePerSemester: 40000 },
  'Информатика': { semesters: 8, pricePerSemester: 50000 },
  'Психология': { semesters: 8, pricePerSemester: 35000 },
  'Юриспруденция': { semesters: 8, pricePerSemester: 42000 },
  'Строительство': { semesters: 8, pricePerSemester: 38000 },
  'Журналистика': { semesters: 8, pricePerSemester: 32000 },
  'Дизайн': { semesters: 8, pricePerSemester: 48000 },
};

function App() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Лечебное дело');
  const [generatedPayments, setGeneratedPayments] = useState([]);

  useEffect(() => {
    const spec = specialties[selectedSpecialty];
    if (!spec) {
      setGeneratedPayments([]);
      return;
    }
    const list = [];
    const startDate = new Date();
    let year = startDate.getFullYear();
    let semesterType = 'Осень';
    for (let i = 1; i <= spec.semesters; i++) {
      const month = semesterType === 'Осень' ? 8 : 1;
      const deadline = new Date(year, month, 1);
      list.push({
        id: i,
        semester: i,
        deadline: deadline.toISOString().slice(0, 10),
        amount: spec.pricePerSemester,
      });
      if (semesterType === 'Осень') {
        semesterType = 'Весна';
      } else {
        semesterType = 'Осень';
        year += 1;
      }
    }
    setGeneratedPayments(list);
  }, [selectedSpecialty]);

  const handleAddInvoice = (newInvoice) => {
    const maxId = invoices.reduce((max, inv) => Math.max(max, inv.id), 0);
    setInvoices([...invoices, { ...newInvoice, id: maxId + 1, status: 'Новая' }]);
  };

  const handleApprovePayment = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    const newPayment = {
      id: payments.length + 1,
      date: new Date().toISOString().slice(0, 10),
      description: `Оплата за обучение (${invoice.semester})`,
      amount: invoice.amount,
      status: 'Утверждено',
    };
    setPayments([...payments, newPayment]);
  };

  const totalApproved = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalInvoices = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const allSemesters = generatedPayments.map(p => p.semester);
  const pricePerSemester = specialties[selectedSpecialty]?.pricePerSemester || 0;
  const hasData = invoices.length > 0 || payments.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProfileCard user={user} />
          <UpcomingPayments payments={generatedPayments} historyPayments={payments} />
          <BalanceCard totalApproved={totalApproved} totalInvoices={totalInvoices} />
        </div>

        <div className="mb-6">
          <TuitionCalculator
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            hasData={hasData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoicesTable
            invoices={invoices}
            onAdd={handleAddInvoice}
            onApprove={handleApprovePayment}
            allSemesters={allSemesters}
            pricePerSemester={pricePerSemester}
            historyPayments={payments}
          />
          <PaymentsTable payments={payments} />
        </div>

        <div className="mt-6">
          <SimpleChart payments={payments} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;