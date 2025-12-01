import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mountain, Droplets, Users, Send, Upload, X, Image as ImageIcon } from "lucide-react";

interface MauriImpactFormProps {
  pestTitle: string;
}

export default function MauriImpactForm({ pestTitle }: MauriImpactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

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
          <h3 className="font-heading text-xl font-bold text-foreground">Ngā mihi nui!</h3>
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
        <CardTitle className="font-heading text-xl flex items-center gap-2">
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

          <div className="space-y-3">
            <Label>Visual Documentation</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-border/60 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handlePhotoChange}
                />
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium">Upload Photos</p>
                <p className="text-xs text-muted-foreground mt-1">Click or drag images here</p>
              </div>

              {photos.length > 0 && (
                <div className="space-y-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{photo.name}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Observation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
