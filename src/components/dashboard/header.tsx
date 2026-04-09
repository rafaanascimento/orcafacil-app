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
    <header className="rounded-3xl border border-blue-100 bg-gradient-to-r from-primary via-secondary to-blue-700 p-5 text-white shadow-lg sm:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <SafeImage
            src="/images/branding/logo-icon.png"
            alt="Logo OrçaFácil"
            className="h-12 w-12 rounded-xl bg-white/15 object-contain p-1.5"
            fallbackClassName="h-12 w-12 rounded-xl bg-white/25 text-sm"
            fallbackLabel="OF"
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-100">Painel técnico</p>
            <h1 className="text-2xl font-bold leading-tight">OrçaFácil</h1>
            <p className="text-sm text-blue-100">Bem-vindo, {userEmail}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/history"
            className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Histórico
          </Link>
          <Button onClick={handleLogout} variant="ghost" className="w-auto border border-white/30 text-white hover:bg-white/20">
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
