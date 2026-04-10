'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/safe-image';

interface DashboardHeaderProps {
  userEmail: string;
}

export const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <header className="rounded-2xl border border-blue-200/60 bg-gradient-to-r from-primary via-secondary to-blue-700 p-4 text-white shadow-[0_18px_36px_-24px_rgba(30,64,175,0.9)] sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <SafeImage
            src="/images/branding/logo-icon.png"
            alt="Logo OrçaFácil"
            className="h-10 w-10 rounded-lg bg-white/15 object-contain p-1.5 sm:h-12 sm:w-12 sm:rounded-xl"
            fallbackClassName="h-10 w-10 rounded-lg bg-white/25 text-sm sm:h-12 sm:w-12 sm:rounded-xl"
            fallbackLabel="OF"
          />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-100 sm:text-xs">Painel técnico</p>
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">OrçaFácil</h1>
            <p className="text-xs text-blue-100 sm:text-sm">Bem-vindo, {userEmail}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Link
            href="/history"
            className="rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/95 transition hover:bg-white/20 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm sm:font-semibold"
          >
            Histórico
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-auto rounded-lg border border-white/25 px-3 py-1.5 text-xs font-medium text-white/95 hover:bg-white/20 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm sm:font-semibold"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
