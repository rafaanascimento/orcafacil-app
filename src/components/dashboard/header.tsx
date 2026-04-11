'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/safe-image';

interface DashboardHeaderProps {
  userEmail: string;
}

const clearStaleAuthStorage = () => {
  try {
    const keysToRemove: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith('sb-') && key.endsWith('-auth-token')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // storage may be unavailable in restricted contexts.
  }
};

export const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const router = useRouter();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLogoutError(null);
    setIsLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      clearStaleAuthStorage();

      if (error) {
        router.replace('/login?reason=session_expired');
      } else {
        router.replace('/login?reason=signed_out');
      }
    } catch {
      clearStaleAuthStorage();
      setLogoutError('Falha ao encerrar sessão localmente. Redirecionando para login...');
      router.replace('/login?reason=session_expired');
    } finally {
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="rounded-2xl border border-blue-200/60 bg-gradient-to-r from-primary via-secondary to-blue-700 px-3.5 py-3 text-white shadow-[0_16px_30px_-24px_rgba(30,64,175,0.9)] sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <SafeImage
            src="/images/branding/logo-icon.png"
            alt="Logo OrçaFácil"
            className="h-9 w-9 rounded-lg bg-white/15 object-contain p-1.5 sm:h-12 sm:w-12 sm:rounded-xl"
            fallbackClassName="h-9 w-9 rounded-lg bg-white/25 text-sm sm:h-12 sm:w-12 sm:rounded-xl"
            fallbackLabel="OF"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-blue-100 sm:text-xs">Painel técnico</p>
            <h1 className="text-lg font-bold leading-tight sm:text-2xl">OrçaFácil</h1>
            <p className="truncate text-[11px] text-blue-100/85 sm:text-sm">Bem-vindo, {userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/history"
            className="inline-flex h-8 w-auto items-center justify-center whitespace-nowrap rounded-lg border border-white/25 bg-white/10 px-3 text-xs font-medium text-white/95 transition hover:bg-white/20 sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm sm:font-semibold"
          >
            Histórico
          </Link>
          <Button
            onClick={handleLogout}
            isLoading={isLoggingOut}
            variant="ghost"
            className="h-8 w-auto whitespace-nowrap rounded-lg border border-white/55 bg-white/20 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-white/30 sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            Sair
          </Button>
        </div>
      </div>
      {logoutError && <p className="mt-2 text-xs text-blue-100/95">{logoutError}</p>}
    </header>
  );
};
