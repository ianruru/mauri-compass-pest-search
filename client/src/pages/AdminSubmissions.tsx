import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, ExternalLink, Trash2, MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminSubmissions() {
  const { data: submissions, isLoading, refetch } = trpc.submissions.list.useQuery();
  const deleteMutation = trpc.submissions.delete.useMutation({
    onSuccess: () => {
      toast.success("Submission deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete submission: ${error.message}`);
    },
  });

  const handleDelete = (id: number, pestTitle: string) => {
    if (confirm(`Are you sure you want to delete the submission for "${pestTitle}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const getImpactColor = (impact: string | null) => {
    if (!impact) return "text-muted-foreground";
    switch (impact) {
      case "severe": return "text-red-600 font-bold";
      case "high": return "text-orange-600 font-semibold";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getImpactLabel = (impact: string | null) => {
    return impact ? impact.charAt(0).toUpperCase() + impact.slice(1) : "Not assessed";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
            <p className="text-muted-foreground mt-2">
              Review community observations and impact assessments
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (!submissions || submissions.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No submissions yet</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && submissions && submissions.length > 0 && (
          <div className="grid gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{submission.pestTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {submission.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(submission.observationDate).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(submission.id, submission.pestTitle)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mauri Impact Assessments */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Whenua (Land)</p>
                      <p className={getImpactColor(submission.impactWhenua)}>
                        {getImpactLabel(submission.impactWhenua)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Wai (Water)</p>
                      <p className={getImpactColor(submission.impactWai)}>
                        {getImpactLabel(submission.impactWai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Tangata (People)</p>
                      <p className={getImpactColor(submission.impactTangata)}>
                        {getImpactLabel(submission.impactTangata)}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {submission.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Observation Notes</p>
                      <p className="text-sm text-muted-foreground">{submission.notes}</p>
                    </div>
                  )}

                  {/* Photo */}
                  {submission.photoUrls && (
                    <div>
                      <p className="text-sm font-medium mb-2">Photo</p>
                      <a 
                        href={submission.photoUrls} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        View Photo <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Submitter Info */}
                  <div className="flex items-center gap-6 text-xs text-muted-foreground pt-2 border-t">
                    {submission.submitterName && (
                      <span>Submitted by: {submission.submitterName}</span>
                    )}
                    {submission.submitterEmail && (
                      <span>Email: {submission.submitterEmail}</span>
                    )}
                    <span>Submitted: {new Date(submission.createdAt).toLocaleString()}</span>
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
