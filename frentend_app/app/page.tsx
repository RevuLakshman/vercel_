import { HeroSection } from '@/components/hero-section';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GitHub Deploy. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Not affiliated with GitHub, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}