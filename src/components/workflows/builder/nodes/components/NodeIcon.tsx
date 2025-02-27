
import { LucideIcon } from "lucide-react";

interface NodeIconProps {
  icon: LucideIcon;
}

export function NodeIcon({ icon: Icon }: NodeIconProps) {
  return <Icon className="h-5 w-5 shrink-0" />;
}
