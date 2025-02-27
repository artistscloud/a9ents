
interface NodeLabelProps {
  label: string;
  description: string;
}

export function NodeLabel({ label, description }: NodeLabelProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
