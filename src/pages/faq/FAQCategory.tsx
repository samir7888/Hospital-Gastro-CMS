"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { FaqItem } from "@/schema/faqs";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  faq: FaqItem;
  onEdit: (faq: FaqItem) => void;
  onDelete: (id: string) => void;
}

export function FAQCategory({ faq, onEdit, onDelete }: FAQItemProps) {
  

  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted">
        <h4 className="font-medium break-words flex-1 mr-2">{faq.title}</h4>
        <div className="flex space-x-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onEdit(faq)}>
            Edit
          </Button>
          <Dialog
                  open={deleteDialogId === faq.id}
                  onOpenChange={(open) => !open && setDeleteDialogId(null)}
                >
                  <DialogTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogId(faq.id);
                      }}
                      className="p-1 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete FAQ</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this FAQ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setDeleteDialogId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onDelete(faq.id);
                          setDeleteDialogId(null);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
        </div>
      </div>
      <div
        className="p-3 prose prose-sm max-w-none break-words overflow-wrap-anywhere"
        dangerouslySetInnerHTML={{ __html: faq.description }}
      />
    </div>
  );

}

//  