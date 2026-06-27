import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: ReactNode; onAccept?: () => void; acceptLabel?: string; }

export const LegalModal = ({ open, onOpenChange, title, children, onAccept, acceptLabel = "I Accept" }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl glass-card border-none">
      <DialogHeader>
        <DialogTitle className="font-heading text-2xl">{title}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[60vh] pr-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">{children}</div>
      </ScrollArea>
      {onAccept && (
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => { onAccept(); onOpenChange(false); }} className="shadow-glow">{acceptLabel}</Button>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
