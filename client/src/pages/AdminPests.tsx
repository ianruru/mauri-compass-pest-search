import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function AdminPests() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: pests, isLoading } = trpc.pests.list.useQuery();

  const filteredPests = pests?.filter(pest => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      pest.title.toLowerCase().includes(query) ||
      pest.latin?.toLowerCase().includes(query) ||
      pest.keywords?.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pest Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage the species database ({pests?.length || 0} species)
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, latin name, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (!filteredPests || filteredPests.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No pests found matching your search" : "No pests in database"}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && filteredPests && filteredPests.length > 0 && (
          <div className="grid gap-4">
            {filteredPests.map((pest) => (
              <Card key={pest.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{pest.title}</h3>
                        {pest.alert && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            ALERT
                          </Badge>
                        )}
                        {pest.pinned && (
                          <Badge variant="secondary">Pinned</Badge>
                        )}
                        {!pest.visible && (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </div>
                      
                      {pest.latin && (
                        <p className="text-sm text-muted-foreground italic">{pest.latin}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        {pest.pestGroups && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                            {pest.pestGroups}
                          </span>
                        )}
                        {pest.pestTypes && (
                          <span className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded">
                            {pest.pestTypes}
                          </span>
                        )}
                      </div>

                      {pest.alsoKnownAs && (
                        <p className="text-xs text-muted-foreground">
                          Also known as: {pest.alsoKnownAs}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {pest.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pest.link} target="_blank" rel="noopener noreferrer">
                            View Details
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
