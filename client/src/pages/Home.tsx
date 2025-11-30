import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, AlertTriangle, Info } from "lucide-react";
import Layout from "@/components/Layout";
import { pests } from "@/lib/pest-data";

export default function Home() {
  // Get some featured pests (random or specific)
  const featuredPests = pests.slice(0, 3);
  const totalSpecies = pests.length;
  
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
              Protecting Waitaha / Canterbury
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Identify & Manage <br />
              <span className="text-primary italic">Invasive Species</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              A comprehensive field guide to {totalSpecies} invasive plants and animals affecting our region's biodiversity. Learn to identify, report, and manage them.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/search">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Start Searching
                </Button>
              </Link>
              <a href="https://www.ecan.govt.nz/your-region/your-environment/biodiversity-and-biosecurity/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                  Learn about Biosecurity
                </Button>
              </a>
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
              <h3 className="font-serif text-xl font-bold">Identify</h3>
              <p className="text-muted-foreground">Browse our extensive database with high-quality images to correctly identify pests.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl hover:bg-white/60 transition-colors duration-500">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Report</h3>
              <p className="text-muted-foreground">Find out which species are under active management and need to be reported immediately.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl hover:bg-white/60 transition-colors duration-500">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Manage</h3>
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
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Recent Additions</h2>
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
              <Link key={i} href={`/pest/${encodeURIComponent(pest.Title)}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                    {pest.FeaturedImage && (
                      <img 
                        src={`/pest_images/${(pests.findIndex(p => p.Title === pest.Title) + 1).toString().padStart(3, '0')}_${pest.Title.replace(/[^a-zA-Z0-9 \-_]/g, "").trim().replace(/ /g, "_")}.jpg`}
                        alt={pest.Title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {pest.Alert && (
                      <div className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        ALERT
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-primary uppercase">{pest.pestgroups}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {pest.Title}
                    </h3>
                    <p className="text-sm text-muted-foreground italic font-serif">
                      {pest.Latin}
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
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">Help Protect Our Environment</h2>
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
