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
    <header className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-5 text-white shadow-lg sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <SafeImage
            src="/images/branding/logo-icon.png"
            alt="Logo OrçaFácil"
            className="h-10 w-10 rounded-lg bg-white/15 object-contain p-1"
            fallbackClassName="h-10 w-10 rounded-lg bg-white/20 text-xs"
            fallbackLabel="OF"
          />
          <div>
            <h1 className="text-xl font-semibold">OrçaFácil</h1>
            <p className="text-sm text-blue-100">Olá, {userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Histórico
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-auto bg-white/10 text-white hover:bg-white/20"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
