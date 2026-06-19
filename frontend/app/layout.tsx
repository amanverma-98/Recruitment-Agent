import type { Metadata } from 'next';
import Providers from './providers'; // Same folder se import
import '@/app/globals.css';

// Official Next.js Server Metadata (Best for SSR/SEO)
export const metadata: Metadata = {
  title: {
    default: "RecruitAI - Agent Platform",
    template: "%s | RecruitAI"
  },
  description: "Review and take action on AI-generated questions.",
  icons: {
    icon: "/white.png",
    apple: "/white.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Saare client components providers ke andar safely wrap ho gaye */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}