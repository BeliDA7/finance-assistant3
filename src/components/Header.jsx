import React from 'react';

export default function Header() {
  return (
    <header className="bg-teal-200 text-slate-950 shadow-md">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Финансовый помощник студента</h1>
        <div className="text-sm">Личный кабинет</div>
      </div>
    </header>
  );
}