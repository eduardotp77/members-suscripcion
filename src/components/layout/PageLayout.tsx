import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación
 * Incluye sidebar fijo y área de contenido con offset.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* pt-14 para la barra top en móvil; md:ml-60 para el sidebar en desktop */}
      <main className="pt-14 md:ml-60 md:pt-0">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
