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
            variant="ghost"
            className="h-8 w-auto whitespace-nowrap rounded-lg border border-white/20 bg-white/5 px-3 text-xs font-medium text-blue-50/95 hover:bg-white/15 sm:h-10 sm:rounded-xl sm:px-4 sm:text-sm sm:font-semibold"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
