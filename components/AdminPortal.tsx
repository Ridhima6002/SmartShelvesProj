import React from 'react';
import { User } from '../types';

interface AdminPortalProps {
  user: User;
  onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ user, onBack }) => {
  // Placeholder admin UI — replace with the UI you want.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-24">
      <div className="w-full max-w-4xl p-12 bg-white rounded-[2rem] border border-slate-100 shadow-lg text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Admin Dashboard</h1>
        <p className="text-slate-500 mb-6">Welcome, <strong>{user.name}</strong>. This is the admin area.</p>
        <div className="space-y-4">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">Manage users, inventory, and settings here.</div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">Admin-only reports and tools will appear here.</div>
        </div>
        <div className="mt-8">
          <button onClick={onBack} className="px-6 py-3 bg-[#003366] text-white rounded-2xl">Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
