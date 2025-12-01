import { Mountain, Droplets, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MauriIconsProps {
  groups: string;
  management?: string;
  alert?: boolean;
  className?: string;
}

export default function MauriIcons({ groups, management, alert, className = "" }: MauriIconsProps) {
  const groupList = groups.toLowerCase();
  const managementList = management?.toLowerCase() || "";

  // Determine active aspects
  const isLand = groupList.includes("plants") || (groupList.includes("animals") && !groupList.includes("freshwater") && !groupList.includes("marine"));
  const isWater = groupList.includes("freshwater") || groupList.includes("marine") || groupList.includes("water");
  const isPeople = alert || managementList.includes("community");

  return (
    <TooltipProvider>
      <div className={`flex gap-2 ${className}`}>
        {isLand && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 border border-green-200">
                <Mountain className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-serif">Whenua (Land)</p>
              <p className="text-xs text-muted-foreground">Impacts land-based ecosystems</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isWater && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                <Droplets className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-serif">Wai (Water)</p>
              <p className="text-xs text-muted-foreground">Impacts waterways and marine environments</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isPeople && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                <Users className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-serif">Tangata (People)</p>
              <p className="text-xs text-muted-foreground">High priority for community health & wellbeing</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
