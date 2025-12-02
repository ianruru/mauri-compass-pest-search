import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Mountain, Droplets, Users, Send, Upload, X, Image as ImageIcon } from "lucide-react";

interface MauriImpactFormProps {
  pestId: number;
  pestTitle: string;
}

export default function MauriImpactForm({ pestId, pestTitle }: MauriImpactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    location: "",
    observationDate: "",
    notes: "",
    impactWhenua: "none" as "none" | "low" | "medium" | "high" | "severe",
    impactWai: "none" as "none" | "low" | "medium" | "high" | "severe",
    impactTangata: "none" as "none" | "low" | "medium" | "high" | "severe",
    submitterName: "",
    submitterEmail: "",
  });

  const createSubmissionMutation = trpc.submissions.create.useMutation({
    onSuccess: () => {
      toast.success("Observation submitted successfully! Thank you for your contribution.");
      setSubmitted(true);
      // Reset form
      setFormData({
        location: "",
        observationDate: "",
        notes: "",
        impactWhenua: "none",
        impactWai: "none",
        impactTangata: "none",
        submitterName: "",
        submitterEmail: "",
      });
      setPhotos([]);
    },
    onError: (error) => {
      toast.error(`Failed to submit observation: ${error.message}`);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert photo to base64 if exists
    let photoBase64: string | undefined;
    if (photos.length > 0) {
      const reader = new FileReader();
      photoBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photos[0]);
      });
    }

    createSubmissionMutation.mutate({
      pestId,
      pestTitle,
      location: formData.location,
      observationDate: new Date(formData.observationDate),
      notes: formData.notes || undefined,
      impactWhenua: formData.impactWhenua !== "none" ? formData.impactWhenua : undefined,
      impactWai: formData.impactWai !== "none" ? formData.impactWai : undefined,
      impactTangata: formData.impactTangata !== "none" ? formData.impactTangata : undefined,
      photoBase64,
      submitterName: formData.submitterName || undefined,
      submitterEmail: formData.submitterEmail || undefined,
    });
  };

  if (submitted) {
    return (
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Thank You!</h3>
            <p className="text-muted-foreground">
              Your observation has been submitted successfully. Kaitiaki will review your submission.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Submit Another Observation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Report Mauri Impact</CardTitle>
        <CardDescription>
          Share your observations of <strong>{pestTitle}</strong> and assess its impact on the mauri (life force) of whenua (land), wai (water), and tangata (people).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., Banks Peninsula, Christchurch"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Observation Date */}
          <div className="space-y-2">
            <Label htmlFor="observationDate">Observation Date *</Label>
            <Input
              id="observationDate"
              name="observationDate"
              type="date"
              required
              value={formData.observationDate}
              onChange={(e) => setFormData({ ...formData, observationDate: e.target.value })}
            />
          </div>

          {/* Mauri Impact Assessments */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              Mauri Impact Assessment
            </h3>
            <p className="text-sm text-muted-foreground">
              Rate the observed impact on each element of mauri
            </p>

            {/* Whenua (Land) */}
            <div className="space-y-2">
              <Label htmlFor="impactWhenua" className="flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                Whenua (Land)
              </Label>
              <Select
                value={formData.impactWhenua}
                onValueChange={(value) => setFormData({ ...formData, impactWhenua: value as any })}
              >
                <SelectTrigger id="impactWhenua">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="severe">Severe Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wai (Water) */}
            <div className="space-y-2">
              <Label htmlFor="impactWai" className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Wai (Water)
              </Label>
              <Select
                value={formData.impactWai}
                onValueChange={(value) => setFormData({ ...formData, impactWai: value as any })}
              >
                <SelectTrigger id="impactWai">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="severe">Severe Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tangata (People) */}
            <div className="space-y-2">
              <Label htmlFor="impactTangata" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Tangata (People)
              </Label>
              <Select
                value={formData.impactTangata}
                onValueChange={(value) => setFormData({ ...formData, impactTangata: value as any })}
              >
                <SelectTrigger id="impactTangata">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="severe">Severe Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observation Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Describe what you observed..."
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo (optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {photos.length > 0 ? `${photos.length} photo(s) selected` : 'Upload Photo'}
              </Button>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submitter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submitterName">Your Name (optional)</Label>
              <Input
                id="submitterName"
                name="submitterName"
                placeholder="Your name"
                value={formData.submitterName}
                onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="submitterEmail">Your Email (optional)</Label>
              <Input
                id="submitterEmail"
                name="submitterEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.submitterEmail}
                onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={createSubmissionMutation.isPending}
          >
            {createSubmissionMutation.isPending ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Observation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
