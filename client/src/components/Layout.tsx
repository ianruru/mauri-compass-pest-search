import { Link, useLocation } from "wouter";
import { Leaf, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Pest Search" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary-foreground">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
          scrolled 
            ? "bg-background/80 backdrop-blur-md border-border/50 py-3 shadow-sm" 
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="container flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Leaf className="w-5 h-5" />
                <div className="absolute inset-0 rounded-full border border-primary/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"></div>
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl tracking-tight text-foreground">Mauri Compass Pest Search</h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Aotearoa</p>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer relative group ${
                  location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}>
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    location === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </span>
              </Link>
            ))}
            <Link href="/search">
              <Button variant="outline" size="sm" className="rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all duration-300">
                <Search className="w-4 h-4 mr-2" />
                Find a Pest
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-border/50">
                <div className="flex flex-col gap-8 mt-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-xl">Menu</h2>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span className={`text-lg font-heading transition-colors cursor-pointer ${
                          location === link.href ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        }`}>
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-16 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/40 py-12 relative z-10">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-lg">Mauri Compass Pest Search</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Helping you identify and manage invasive plants and animals in Aotearoa to protect our unique environment.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>For Kaitiaki by Kaitiaki. &copy; 2025 Mauri Compass. All rights reserved.</p>
            <p className="text-center md:text-right italic font-heading">Toitu te marae a tane; Toitu te marae a Tangaroa; Toitu te iwi.<br/><span className="font-sans not-italic">Protect and strengthen the realms of the land and sea, and they will protect and strengthen the people.</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
