import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="animate-spin text-primary" size={28} />
      <p className="text-sm">Wird geladen …</p>
    </div>
  );
}
