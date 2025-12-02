import pestsData from "@/data/pests.json";

export interface Pest {
  keywords: string;
  pestgroups: string;
  pesttypes: string;
  managementapproaches: string;
  Alert: boolean;
  FeaturedImage: string;
  Title: string;
  Latin: string;
  Pinned: boolean;
  AlsoKnownAs: string | boolean;
  visible: boolean;
  Link: string;
}

export const pests = pestsData as Pest[];

export const getPestGroups = () => {
  const groups = new Set<string>();
  pests.forEach(pest => {
    if (pest.pestgroups) {
      pest.pestgroups.split(',').forEach(g => groups.add(g.trim()));
    }
  });
  return Array.from(groups).sort();
};

export const getPestTypes = () => {
  const types = new Set<string>();
  pests.forEach(pest => {
    if (pest.pesttypes) {
      pest.pesttypes.split(',').forEach(t => types.add(t.trim()));
    }
  });
  return Array.from(types).sort();
};

export const getManagementApproaches = () => {
  const approaches = new Set<string>();
  pests.forEach(pest => {
    if (pest.managementapproaches) {
      pest.managementapproaches.split(',').forEach(a => approaches.add(a.trim()));
    }
  });
  return Array.from(approaches).sort();
};

// Accept both old Pest interface and new database pest type
type PestLike = Pest | { title: string; featuredImage: string | null };

export const getPestImage = (pest: PestLike) => {
  // Handle both old and new pest types
  const hasFeaturedImage = 'FeaturedImage' in pest ? pest.FeaturedImage : pest.featuredImage;
  if (!hasFeaturedImage) return null;
  
  // Get the title from either format
  const pestTitle = 'Title' in pest ? pest.Title : pest.title;
  
  // Convert ECan path to local path
  // Format: /assets/Uploads/Pest-images/Name.jpg -> /pest_images/001_Name.jpg
  // We need to find the matching file in our local directory
  
  // Since we renamed files during download, we'll construct the path based on the title
  // consistent with how we saved them
  const safeTitle = pestTitle.replace(/[^a-zA-Z0-9 \-_]/g, "").trim().replace(/ /g, "_");
  
  // We need to find the index to match the numbering
  const index = pests.findIndex(p => p.Title === pestTitle) + 1;
  const paddedIndex = index.toString().padStart(3, '0');
  
  return `/pest_images/${paddedIndex}_${safeTitle}.jpg`;
};
