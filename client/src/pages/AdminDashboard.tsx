import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FileText, Bug, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: submissions, isLoading: loadingSubmissions } = trpc.submissions.list.useQuery();
  const { data: pests, isLoading: loadingPests } = trpc.pests.list.useQuery();

  const totalSubmissions = submissions?.length || 0;
  const totalPests = pests?.length || 0;
  const alertPests = pests?.filter(p => p.alert).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage pest database and community submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingSubmissions ? "..." : totalSubmissions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Community observations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Species</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingPests ? "..." : totalPests}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alert Species</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {loadingPests ? "..." : alertPests}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requiring immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/submissions">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  View Submissions
                </CardTitle>
                <CardDescription>
                  Review and manage community observations with photos and impact assessments
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/pests">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Manage Pests
                </CardTitle>
                <CardDescription>
                  Add, edit, or remove species from the database
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Submissions Preview */}
        {submissions && submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest 5 community observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{submission.pestTitle}</p>
                      <p className="text-sm text-muted-foreground">{submission.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/admin/submissions/${submission.id}`}>
                      <CheckCircle className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
