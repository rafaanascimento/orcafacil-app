import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { SafeImage } from '@/components/ui/safe-image';
import { getSafeUser } from '@/lib/supabase/server';

interface LoginPageProps {
  searchParams?: Promise<{ reason?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSafeUser();

  if (user) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const reason = Array.isArray(params?.reason) ? params?.reason[0] : params?.reason;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary via-secondary to-blue-900 px-4 py-8">
      <div className="absolute inset-0 opacity-15">
        <SafeImage
          src="/images/branding/login-bg.png"
          alt="Fundo decorativo"
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full rounded-none bg-gradient-to-br from-blue-900/80 to-primary/70 text-transparent"
          fallbackLabel=""
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center gap-8 lg:justify-between">
        <section className="hidden max-w-lg text-white lg:block">
          <SafeImage
            src="/images/branding/logo-full.png"
            alt="OrçaFácil"
            className="mb-8 h-14 w-auto object-contain"
            fallbackClassName="mb-8 h-14 w-fit rounded-lg bg-white/20 px-4"
          />
          <h2 className="text-4xl font-bold leading-tight">Orçamentos técnicos com padrão profissional.</h2>
          <p className="mt-4 text-blue-100">
            Gere propostas estruturadas, salve histórico e acelere sua operação em campo e no escritório.
          </p>
        </section>

        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <SafeImage
              src="/images/branding/logo-full.png"
              alt="OrçaFácil"
              className="h-12 w-auto object-contain"
              fallbackClassName="h-12 w-fit rounded-lg bg-white/20 px-4"
            />
          </div>
          <LoginForm initialSessionReason={reason} />
        </div>
      </div>
    </main>
  );
}
