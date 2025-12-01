import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mountain, Droplets, Users, Send } from "lucide-react";

interface MauriImpactFormProps {
  pestTitle: string;
}

export default function MauriImpactForm({ pestTitle }: MauriImpactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Mauri impact observation submitted successfully");
    }, 1500);
  };

  if (submitted) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">Ngā mihi nui!</h3>
          <p className="text-muted-foreground">
            Thank you for your observation. Your contribution helps us better understand the impact of {pestTitle} on our local mauri.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Submit another observation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="font-serif text-xl flex items-center gap-2">
          Mauri Impact Assessment
        </CardTitle>
        <CardDescription>
          Share your observations on how {pestTitle} is affecting the mauri (life force) of your local area.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location of Observation</Label>
              <Input id="location" placeholder="e.g., Rakaia Riverbed, Port Hills..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Observed Impact on Mauri</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 p-3 rounded-lg border border-border/60 bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <Mountain className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">Whenua (Land)</span>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No observed impact</SelectItem>
                    <SelectItem value="low">Low impact</SelectItem>
                    <SelectItem value="medium">Medium impact</SelectItem>
                    <SelectItem value="high">High impact</SelectItem>
                    <SelectItem value="severe">Severe impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 p-3 rounded-lg border border-border/60 bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">Wai (Water)</span>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No observed impact</SelectItem>
                    <SelectItem value="low">Low impact</SelectItem>
                    <SelectItem value="medium">Medium impact</SelectItem>
                    <SelectItem value="high">High impact</SelectItem>
                    <SelectItem value="severe">Severe impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 p-3 rounded-lg border border-border/60 bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-sm">Tangata (People)</span>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No observed impact</SelectItem>
                    <SelectItem value="low">Low impact</SelectItem>
                    <SelectItem value="medium">Medium impact</SelectItem>
                    <SelectItem value="high">High impact</SelectItem>
                    <SelectItem value="severe">Severe impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Detailed Observations</Label>
            <Textarea 
              id="notes" 
              placeholder="Describe specific signs of degradation or changes you've noticed..." 
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Observation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
