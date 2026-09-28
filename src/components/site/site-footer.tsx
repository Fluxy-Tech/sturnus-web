import Image from "next/image";
import Link from "next/link";
import fluxyIcon from "@/assets/IconeAzulSemFundo.png";

export function SiteFooter() {
  return (
    <footer className="border-border w-full border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src={fluxyIcon} alt="" className="h-8 w-8 object-contain" />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold">Sturnus Flow</span>
        </div>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <a href="mailto:sturnusflow@gmail.com" className="text-muted-foreground text-sm hover:underline">
            sturnusflow@gmail.com
          </a>
          <Link href="/politica-de-privacidade" className="text-muted-foreground text-xs hover:underline">
            Política de privacidade
          </Link>
          <span className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Sturnus Flow. Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
