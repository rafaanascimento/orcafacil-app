import { redirect } from 'next/navigation';
import { getSafeUser } from '@/lib/supabase/server';

export default async function HomePage() {
  const user = await getSafeUser();

  if (user) {
    redirect('/dashboard');
  }

  redirect('/login');
}
