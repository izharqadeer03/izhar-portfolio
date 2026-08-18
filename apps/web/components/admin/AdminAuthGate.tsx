'use client';

import { OSButton } from '@izhar-os/ui';
import { KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

interface AdminAuthGateProps {
  onAuthenticated: () => void;
}

export function AdminAuthGate({ onAuthenticated }: AdminAuthGateProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the admin passcode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('izhar_admin_key', passcode);
        onAuthenticated();
      } else {
        setError(data.message || 'Invalid admin passcode');
      }
    } catch {
      setError('Network error while authenticating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080a0f] text-fg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(60% 60% at 50% 40%, rgba(244,63,94,0.12) 0%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-line/80 bg-surface/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="size-12 rounded-xl border border-rose-500/30 bg-rose-500/10 grid place-items-center text-rose-400 shadow-inner">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="text-[20px] font-bold tracking-tight text-fg">
              IZHAR OS // Admin Console
            </h1>
            <p className="text-[12.5px] text-muted mt-1">
              Authenticate to manage dynamic portfolio content & database.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-passcode"
              className="text-[11.5px] font-semibold text-faint uppercase tracking-wider block"
            >
              Admin Passcode
            </label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3 top-3 text-muted" />
              <input
                id="admin-passcode"
                type="password"
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter secret key..."
                className="w-full h-10 rounded-xl border border-line bg-void/80 pl-9 pr-3 text-[13px] text-fg placeholder:text-faint focus:border-rose-500/60 focus:outline-hidden"
              />
            </div>
            {error ? <p className="text-[12px] text-rose-400 mt-1">{error}</p> : null}
          </div>

          <OSButton
            size="md"
            variant="accent"
            type="submit"
            disabled={loading}
            className="w-full justify-center bg-rose-600 hover:bg-rose-500 text-white font-medium"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={15} className="mr-1.5" />
                <span>Unlock Control Center</span>
              </>
            )}
          </OSButton>
        </form>

        <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-faint">
          <span>Protected via Supabase RLS</span>
          <a href="/" className="hover:text-fg underline transition-colors">
            Return to OS
          </a>
        </div>
      </div>
    </div>
  );
}
