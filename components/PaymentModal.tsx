import React, { useState } from 'react';
import { X, ChevronRight, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, onClose, onSuccess }) => {
  const [step, setStep] = useState<'options' | 'processing' | 'success'>('options');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      onSuccess();
    }, 2000);
  };

  return (
<div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[9999] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-12">
          <span className="px-4 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wide">
            SECURE CHECKOUT
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-10 pb-10 pt-8">

          {/* OPTIONS */}
          {step === 'options' && (
            <div className="space-y-6">
              <div className="text-left">
                <p className="text-slate-500 text-sm font-medium">Paying Fine Amount</p>
                <h2 className="text-5xl font-black text-slate-900 mt-3 mb-6">
                  ₹{amount.toFixed(2)}
                </h2>
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mb-4">
  Select Payment Method
</p>


              </div>

              <div className="space-y-3 pb-6">
                {/* Google Pay */}
                <button
                  onClick={handlePay}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-slate-200 hover:border-blue-500 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                      alt="Google Pay"
                      className="h-5"
                    />
    <span className="font-semibold text-slate-800 hover:text-blue-500 transition-colors"> Google Pay
    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>

                {/* Razorpay */}
                {/* <button
                  onClick={handlePay}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-semibold">Razorpay / UPI</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button> */}
              </div>
            </div>
          )}

          {/* PROCESSING */}
          {step === 'processing' && (
            <div className="py-14 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-slate-900">Processing Payment</h3>
                <p className="text-slate-500 text-sm">Connecting to bank servers…</p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="py-10 flex flex-col items-center text-center gap-6 animate-in slide-in-from-bottom-3">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl">
                ✓
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Payment Successful</h3>
                <p className="text-slate-500 mt-2 text-sm">
                  Receipt sent to your registered email.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
