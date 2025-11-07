"use client";

import { useRouter } from "next/navigation";
import { GrDiamond } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import DialogContentOverlayBlur from "@/components/dialog/dialog-content-overlay-blur";
import { Dialog, DialogFooter, DialogTitle } from "@/components/ui/dialog";

export interface InformationProps {
  open: boolean;
  title: string;
  description: string;
  isCreditButton?: boolean;
}

interface InformationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isCreditButton?: boolean;
}

export default function InformationDialog({ open, onClose, title, description, isCreditButton = false }: InformationDialogProps) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContentOverlayBlur>
        <DialogTitle className="mt-3">{title}</DialogTitle>
        <div
          style={{
            whiteSpace: "pre-line",
            paddingLeft: "16px",
            lineHeight: "1.8",
          }}
        >
          {description}
        </div>
        <DialogFooter>
          { isCreditButton ? (
            <Button onClick={() => router.push("/subscription")}
              className="ml-auto flex items-center gap-2 text-white bg-gradient-to-br from-purple-600 to-blue-600 rounded-md shadow-lg"
            >
              <GrDiamond className="w-5 h-5 font-medium" />
              <span className="font-medium">追加</span>
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose}>確認</Button>
          )}
        </DialogFooter>
      </DialogContentOverlayBlur>
    </Dialog>
  );
}
