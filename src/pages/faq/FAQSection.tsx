"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AddFAQDialog } from "./AddFAQDialog";
import { EditFAQDialog } from "./EditFAQDialog";
import { FAQList } from "./FAQList";
import type { FaqItem } from "@/schema/faqs";

export default function FAQPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FaqItem | null>(null);
  function handleEdit(faq: FaqItem) {
    setEditingFAQ(faq);
    setShowEditDialog(true);
  }

  function handleCloseEditDialog() {
    setShowEditDialog(false);
    setEditingFAQ(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Section</h1>
        <p className="text-muted-foreground">
          Manage the Frequently Asked Questions section of your website
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>FAQ Questions</CardTitle>
            <CardDescription>
              Manage your frequently asked questions and answers
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>Add New FAQ</Button>
        </CardHeader>
        <CardContent>
          <FAQList onEdit={handleEdit} />
        </CardContent>
      </Card>

      <AddFAQDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      <EditFAQDialog
        open={showEditDialog}
        onOpenChange={handleCloseEditDialog}
        faq={editingFAQ}
      />
    </div>
  );
}
