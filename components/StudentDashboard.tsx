import React, { useState, useEffect } from 'react';
import { User, Book } from '../types';
import { Clock, CreditCard, ChevronRight, BookOpen, Download } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { supabase } from '../services/supabase';

interface StudentDashboardProps {
  user: User;
  books: Book[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, books }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fineAmount, setFineAmount] = useState<number>(0);
  const [loadingFines, setLoadingFines] = useState(true);

  const fetchFines = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('fines')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Error fetching fines:', error);
    } else {
      setFineAmount(data?.fines ?? 0);
    }
    setLoadingFines(false);
  };

  useEffect(() => {
    fetchFines();
  }, [user.email]);

  const handlePaymentSuccess = async () => {
    const { error } = await supabase
      .from('students')
      .update({ fines: 0 })
      .eq('email', user.email);

    if (error) {
      console.error('Error updating fines:', error);
    } else {
      setFineAmount(0);
    }
  };

  const issuedBookDetails = user.issuedBooks.map(ib => ({
    ...ib,
    book: books.find(b => b.id === ib.bookId)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Currently Issued Books */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" /> Currently Issued Books
            </h3>
            <div className="space-y-4">
              {issuedBookDetails.length > 0 ? issuedBookDetails.map((ib, i) => (
                <div key={i} className="group p-5 bg-gray-50 rounded-3xl border border-gray-200 flex items-center justify-between hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={ib.book?.image} className="w-12 h-16 rounded-lg object-cover shadow-md" alt="book" />
                    <div>
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{ib.book?.title}</h4>
                      <p className="text-gray-500 text-sm">{ib.book?.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-1">
                      <Clock className="w-4 h-4" /> Due: {ib.dueDate}
                    </div>
                    <p className="text-gray-400 text-xs">14-day reminder sent</p>
                  </div>
                </div>
              )) : (
                <div className="py-12 flex flex-col items-center text-gray-400">
                  <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                  <p>You haven't issued any books yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Book Bank Program */}
          <div className="bg-blue-50 p-8 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <CreditCard className="w-48 h-48 text-blue-200" />
            </div>
            <div className="relative z-10">
              <span className="px-4 py-1.5 bg-white/50 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-600">
                New Benefit
              </span>
              <h3 className="text-3xl font-bold mt-4 mb-2 text-blue-700">Book Bank Program</h3>
              <p className="text-blue-600 max-w-md text-sm leading-relaxed mb-6">
                Get full semester book bundles at 20% of the cost. A collaborative initiative for all engineering years at SPIT.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-blue-200 text-blue-700 font-bold rounded-2xl shadow hover:bg-blue-300 transition-all active:scale-95">
                  Enroll Now
                </button>
                <button className="px-8 py-3 bg-transparent border border-blue-200 text-blue-700 font-bold rounded-2xl hover:bg-blue-100 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Fines & Payments */}
          <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-8 rounded-3xl border border-gray-200 shadow-lg text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-1 tracking-tight">
                Library Fees
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Secure Student Payment Portal
              </p>
              <div className="bg-white p-6 mb-6 border border-gray-200 rounded-2xl">
                <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Total Balance</span>
                <h2 className="text-3xl font-black text-gray-800 mt-2">
                  {loadingFines ? 'Loading...' : `₹${fineAmount.toFixed(2)}`}
                </h2>
              </div>
              {fineAmount > 0 && !loadingFines ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-blue-200 text-blue-700 py-4 rounded-2xl font-bold text-lg hover:bg-blue-300 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Clear Dues Now
                </button>
              ) : (
                !loadingFines && (
                  <div className="py-4 px-6 bg-green-100 border border-green-200 rounded-2xl text-green-600 font-bold">
                    All Dues Cleared
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
              Recent Activity <ChevronRight className="w-5 h-5 text-gray-400" />
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-600">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-green-700 text-sm">Book Bank Receipt</h4>
                  <p className="text-green-500 text-[10px] font-bold uppercase">Downloaded • Oct 12</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 opacity-60">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 text-sm">Book Returned</h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">LA Fundamentals • Sep 28</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          amount={fineAmount}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
