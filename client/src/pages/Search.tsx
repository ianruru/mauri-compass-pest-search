import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, Filter, X, ChevronDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/Layout";
import { pests, getPestGroups, getPestTypes, getPestImage } from "@/lib/pest-data";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  const groups = useMemo(() => getPestGroups(), []);
  const types = useMemo(() => getPestTypes(), []);

  const filteredPests = useMemo(() => {
    return pests.filter((pest) => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        pest.Title.toLowerCase().includes(searchLower) || 
        pest.Latin.toLowerCase().includes(searchLower) ||
        (typeof pest.AlsoKnownAs === 'string' && pest.AlsoKnownAs.toLowerCase().includes(searchLower)) ||
        pest.keywords.toLowerCase().includes(searchLower);

      // Group filter
      const matchesGroup = 
        selectedGroups.length === 0 || 
        (pest.pestgroups && pest.pestgroups.split(',').some(g => selectedGroups.includes(g.trim())));

      // Type filter
      const matchesType = 
        selectedTypes.length === 0 || 
        (pest.pesttypes && pest.pesttypes.split(',').some(t => selectedTypes.includes(t.trim())));

      // Alert filter
      const matchesAlert = !showAlertsOnly || pest.Alert;

      return matchesSearch && matchesGroup && matchesType && matchesAlert;
    });
  }, [searchQuery, selectedGroups, selectedTypes, showAlertsOnly]);

  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGroups([]);
    setSelectedTypes([]);
    setShowAlertsOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedGroups.length > 0 || selectedTypes.length > 0 || showAlertsOnly;

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border/40 py-12 md:py-20">
        <div className="container max-w-5xl">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-8">Pest Database</h1>
          
          <div className="bg-background rounded-2xl shadow-lg border border-border/50 p-2 md:p-4 max-w-3xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                type="text" 
                placeholder="Search by common name, latin name, or keywords..." 
                className="pl-12 h-14 text-lg border-none shadow-none focus-visible:ring-0 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`rounded-full border-border/60 ${selectedGroups.length > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background'}`}>
                  <Filter className="w-4 h-4 mr-2" />
                  Groups {selectedGroups.length > 0 && `(${selectedGroups.length})`}
                  <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Filter by Group</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {groups.map(group => (
                  <DropdownMenuCheckboxItem 
                    key={group}
                    checked={selectedGroups.includes(group)}
                    onCheckedChange={() => toggleGroup(group)}
                  >
                    {group}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`rounded-full border-border/60 ${selectedTypes.length > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background'}`}>
                  <Filter className="w-4 h-4 mr-2" />
                  Types {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                  <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {types.map(type => (
                  <DropdownMenuCheckboxItem 
                    key={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              className={`rounded-full border-border/60 ${showAlertsOnly ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-background'}`}
              onClick={() => setShowAlertsOnly(!showAlertsOnly)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts Only
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-destructive">
                Clear all
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredPests.length}</span> results
          </p>
        </div>

        {filteredPests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPests.map((pest, i) => {
              const imagePath = getPestImage(pest);
              
              return (
                <Link key={i} href={`/pest/${encodeURIComponent(pest.Title)}`}>
                  <div className="group cursor-pointer flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {imagePath ? (
                        <img 
                          src={imagePath} 
                          alt={pest.Title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <SearchIcon className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                      
                      {pest.Alert && (
                        <div className="absolute top-3 right-3 bg-destructive/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                          Alert
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-sm font-medium flex items-center">
                          View Details <SearchIcon className="w-3 h-3 ml-2" />
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-2">
                        <Badge variant="secondary" className="text-[10px] font-bold tracking-wider uppercase bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 border-none">
                          {pest.pestgroups.split(',')[0]}
                        </Badge>
                      </div>
                      
                      <h3 className="font-serif text-lg font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                        {pest.Title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground italic font-serif mb-4 line-clamp-1">
                        {pest.Latin}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border/30 flex flex-wrap gap-1">
                        {pest.pesttypes.split(',').slice(0, 2).map((type, idx) => (
                          <span key={idx} className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-sm">
                            {type.trim()}
                          </span>
                        ))}
                        {pest.pesttypes.split(',').length > 2 && (
                          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-sm">
                            +{pest.pesttypes.split(',').length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any pests matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
