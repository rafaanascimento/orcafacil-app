'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const supabase = createClient();

    const action = isRegisterMode
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });

    const { error: authError } = await action;

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (isRegisterMode) {
      setMessage('Cadastro realizado. Verifique seu e-mail para confirmação, se necessário.');
    } else {
      router.replace('/dashboard');
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-ink">{isRegisterMode ? 'Criar conta' : 'Entrar'}</h1>
        <p className="text-sm text-gray-500">
          Acesse o OrçaFácil para gerar orçamentos técnicos com rapidez.
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <Input
          type="email"
          required
          placeholder="seuemail@empresa.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          required
          minLength={6}
          placeholder="Digite sua senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="text-right text-xs text-gray-500">
          <button type="button" className="hover:text-primary">
            Esqueci minha senha
          </button>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processando...' : isRegisterMode ? 'Criar conta' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        {isRegisterMode ? 'Já possui conta?' : 'Ainda não possui conta?'}{' '}
        <button
          type="button"
          onClick={() => setIsRegisterMode((prev) => !prev)}
          className="font-semibold text-primary hover:text-blue-800"
        >
          {isRegisterMode ? 'Entrar' : 'Cadastrar'}
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </Card>
  );
};
