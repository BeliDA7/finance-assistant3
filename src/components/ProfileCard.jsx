import React from 'react';

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Профиль</h2>
      <div className="space-y-1 md:space-y-2 text-sm md:text-base">
        <p><span className="font-medium">ФИО:</span> {user.name}</p>
        <p><span className="font-medium">Группа:</span> {user.group}</p>
        <p><span className="font-medium">Курс:</span> {user.course}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
      </div>
    </div>
  );
}