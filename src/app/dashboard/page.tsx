import { redirect } from 'next/navigation';
import { BudgetForm } from '@/components/dashboard/budget-form';
import { FeatureCards } from '@/components/dashboard/feature-cards';
import { DashboardHeader } from '@/components/dashboard/header';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
      <DashboardHeader userEmail={user.email ?? 'usuário'} />
      <BudgetForm />
      <FeatureCards />
    </main>
  );
}
