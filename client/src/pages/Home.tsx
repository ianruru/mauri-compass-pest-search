import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, AlertTriangle, Info } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch pests from API
  const { data: pests, isLoading } = trpc.pests.list.useQuery();
  const featuredPests = pests?.slice(0, 3) || [];
  const totalSpecies = pests?.length || 0;
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Mauri Compass
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Identify & Manage <br />
              <span className="text-primary font-light">Invasive Species</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              A comprehensive field guide to {totalSpecies} invasive plants and animals affecting our region's biodiversity. Learn to identify, report, and manage them.
            </p>

            <div className="max-w-xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-4 text-muted-foreground w-5 h-5 z-10" />
                <Input 
                  type="text" 
                  placeholder="Search for a pest (e.g., 'Gorse', 'Possum')..." 
                  className="pl-12 pr-32 h-16 rounded-full text-lg shadow-lg border-primary/20 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="absolute right-1.5 rounded-full px-6 h-13 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105"
                >
                  Search
                </Button>
              </form>
              <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>Popular:</span>
                <Link href="/search?q=Gorse"><span className="hover:text-primary cursor-pointer underline decoration-dotted">Gorse</span></Link>
                <Link href="/search?q=Wallaby"><span className="hover:text-primary cursor-pointer underline decoration-dotted">Wallaby</span></Link>
                <Link href="/search?q=Broom"><span className="hover:text-primary cursor-pointer underline decoration-dotted">Broom</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Info Section */}
      <section className="py-16 bg-white/50 border-y border-border/40 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl hover:bg-white/60 transition-colors duration-500">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground mb-2">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold">Identify</h3>
              <p className="text-muted-foreground">Browse our extensive database with high-quality images to correctly identify pests.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl hover:bg-white/60 transition-colors duration-500">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold">Report</h3>
              <p className="text-muted-foreground">Find out which species are under active management and need to be reported immediately.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl hover:bg-white/60 transition-colors duration-500">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold">Manage</h3>
              <p className="text-muted-foreground">Access detailed management approaches and community-led initiatives for each species.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Species Preview */}
      <section className="py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Recent Additions</h2>
              <p className="text-muted-foreground max-w-md">Explore some of the species currently listed in our database.</p>
            </div>
            <Link href="/search">
              <Button variant="ghost" className="group text-primary hover:text-primary/80 hover:bg-primary/5">
                View all species <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPests.map((pest, i) => (
              <Link key={i} href={`/pest/${encodeURIComponent(pest.title)}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                    {pest.featuredImage && (
                      <img 
                        src={`/pest_images/${((pests?.findIndex(p => p.title === pest.title) ?? -1) + 1).toString().padStart(3, '0')}_${pest.title.replace(/[^a-zA-Z0-9 \-_]/g, "").trim().replace(/ /g, "_")}.jpg`}
                        alt={pest.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {pest.alert && (
                      <div className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        ALERT
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-primary uppercase">{pest.pestGroups}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {pest.title}
                    </h3>
                    <p className="text-sm text-muted-foreground italic font-sans">
                      {pest.latin}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        
        <div className="container relative z-10 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">Help Protect Our Environment</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Your observations help us manage pests effectively. If you spot an invasive species, check our database for management advice or report it.
          </p>
          <Link href="/search">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/20">
              Browse Species Database
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
