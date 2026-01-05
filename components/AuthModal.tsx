import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../services/firebase';
import { User } from '../types';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: User | null) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signin') {
        const user = await signInWithEmail(email, password);
        onSuccess(user);
      } else {
        const user = await signUpWithEmail(email, password, name || undefined);
        onSuccess(user);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl">{mode === 'signin' ? 'Log In' : 'Sign Up'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="mb-4 text-sm text-slate-500">{mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}</div>

        {mode === 'signin' && (
          <div className="mb-4">
            <button type="button" onClick={handleGoogle} disabled={loading} className="w-full mb-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5" />
              <span className="text-sm font-bold">Continue with Google</span>
            </button>
            <div className="text-center text-xs text-slate-400 uppercase tracking-wider">or</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">Full name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-slate-100" />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-500 uppercase font-bold">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-slate-100" />
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase font-bold">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-slate-100" />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex items-center justify-between gap-3">
            <button disabled={loading} type="submit" className="px-6 py-3 bg-[#003366] text-white rounded-2xl font-bold w-full">
              {loading ? 'Please wait...' : mode === 'signin' ? 'Log In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-slate-500">
          {mode === 'signin' ? (
            <>
              Don’t have an account?{' '}
              <button onClick={() => setMode('signup')} className="font-bold text-[#003366]">Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="font-bold text-[#003366]">Log in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
