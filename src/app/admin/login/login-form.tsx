"use client";

import { type FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import sturnusWordmark from "@/assets/NomeSemFundo.png";
import accessCover from "@/assets/CapaTelaDeAcesso.jpeg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { signIn } from "@/lib/auth-client";

const FEATURES = [
  { icon: Bot, text: "Leads do site chegam direto no CRM" },
  { icon: MessageSquare, text: "Kanban para acompanhar cada negociação" },
  { icon: Zap, text: "Agenda de reuniões vinculada a cada lead" },
  { icon: ShieldCheck, text: "Acesso restrito à equipe Sturnus Flow" },
];

/// Split-screen igual ao login do Agent Console: foto + destaques à esquerda,
/// card de login à direita.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn.email({ email, password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message ?? "Não foi possível entrar. Verifique suas credenciais.");
      return;
    }
    router.replace("/admin/leads");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <Image src={accessCover} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

        <div className="relative flex flex-col gap-8">
          <h1 className="max-w-md font-[family-name:var(--font-display)] text-4xl leading-tight font-semibold text-white">
            Painel de leads da Sturnus Flow.
          </h1>
          <ul className="flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                  <Icon className="size-4" />
                </span>
                <span className="mt-1 text-sm text-white/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Sturnus Flow</p>
      </div>

      <div className="bg-dot-grid flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <div className="mb-1 flex items-center justify-center">
              <Link href="/" aria-label="Ir para a página inicial">
                <Image src={sturnusWordmark} alt="Sturnus Flow" className="h-16 w-auto" />
              </Link>
            </div>
            <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Acesse o painel administrativo do site.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="voce@sturnusflow.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="mt-2" size="lg">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
