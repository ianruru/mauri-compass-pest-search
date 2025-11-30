import { useRoute, Link } from "wouter";
import { ArrowLeft, AlertTriangle, ExternalLink, Tag, Info, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { pests, getPestImage } from "@/lib/pest-data";
import NotFound from "@/pages/NotFound";

export default function PestDetail() {
  const [match, params] = useRoute("/pest/:title");
  
  if (!match || !params) return <NotFound />;
  
  const decodedTitle = decodeURIComponent(params.title);
  const pest = pests.find(p => p.Title === decodedTitle);
  
  if (!pest) return <NotFound />;
  
  const imagePath = getPestImage(pest);
  
  // Parse comma-separated lists
  const groups = pest.pestgroups ? pest.pestgroups.split(',').map(s => s.trim()) : [];
  const types = pest.pesttypes ? pest.pesttypes.split(',').map(s => s.trim()) : [];
  const approaches = pest.managementapproaches ? pest.managementapproaches.split(',').map(s => s.trim()) : [];
  const keywords = pest.keywords ? pest.keywords.split(',').map(s => s.trim()) : [];

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border/40">
        <div className="container py-8">
          <Link href="/search">
            <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-primary mb-6 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 md:items-start">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {groups.map(group => (
                  <Badge key={group} variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 border-none uppercase tracking-wider text-[10px] font-bold">
                    {group}
                  </Badge>
                ))}
                {pest.Alert && (
                  <Badge variant="destructive" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border-none uppercase tracking-wider text-[10px] font-bold">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Alert
                  </Badge>
                )}
              </div>
              
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {pest.Title}
              </h1>
              
              <div className="flex flex-col gap-1">
                <p className="text-xl md:text-2xl text-primary font-serif italic">
                  {pest.Latin}
                </p>
                {pest.AlsoKnownAs && (
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Also known as:</span> {pest.AlsoKnownAs}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <a href={`https://www.ecan.govt.nz${pest.Link}`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full">
                  View on ECan Website <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content - Image */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-border/50 bg-muted relative group">
              {imagePath ? (
                <img 
                  src={imagePath} 
                  alt={pest.Title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted text-muted-foreground">
                  <div className="text-center">
                    <Leaf className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No image available</p>
                  </div>
                </div>
              )}
              
              {/* Watercolor effect overlay */}
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center">
                <Info className="w-5 h-5 mr-3 text-primary" />
                Identification Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted/50 text-sm text-muted-foreground border border-border/50">
                    <Tag className="w-3 h-3 mr-2 opacity-50" />
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Details */}
          <div className="lg:col-span-5 space-y-8">
            {pest.Alert && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-destructive/10 p-3 rounded-full text-destructive shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-destructive mb-2">Active Alert</h3>
                    <p className="text-destructive/80 leading-relaxed">
                      This species is classified as a high-priority pest. Please report any sightings immediately to Environment Canterbury.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border/50 pb-2">
                  Classification
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Pest Type</span>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type, i) => (
                        <span key={i} className="font-serif text-lg text-foreground">
                          {type}{i < types.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border/50 pb-2">
                  Management
                </h3>
                <div className="space-y-4">
                  {approaches.map((approach, i) => (
                    <div key={i} className="bg-secondary/20 rounded-xl p-4 border border-secondary/30">
                      <h4 className="font-bold text-secondary-foreground mb-1">{approach}</h4>
                      <p className="text-sm text-muted-foreground">
                        {approach === "Community led" && "Managed primarily through community initiatives and volunteer groups."}
                        {approach === "Canterbury Regional Pest Management Plan" && "Subject to specific rules in the Regional Pest Management Plan."}
                        {approach === "Unwanted organisms" && "Legally declared as an unwanted organism under the Biosecurity Act."}
                        {approach === "National Interest Pest Response" && "Managed under a national coordinated response program."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
