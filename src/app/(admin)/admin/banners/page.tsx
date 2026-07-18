"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { settingsApi } from "@/lib/api";
import type { PromotionalBanner } from "@/types";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBanners = async () => {
    try {
      const data = await settingsApi.getAdminBanners();
      setBanners(data);
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadBanners(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <AddBannerDialog onSuccess={loadBanners} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <div className="aspect-video bg-muted flex items-center justify-center text-4xl">
                🖼️
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{banner.title}</h3>
                  <Badge variant={banner.isActive ? "success" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {banner.description && (
                  <p className="text-sm text-muted-foreground">{banner.description}</p>
                )}
                {banner.badge && (
                  <Badge variant="secondary" className="mt-2">{banner.badge}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
          {!isLoading && banners.length === 0 && (
            <p className="text-center text-muted-foreground py-8 col-span-full">No banners yet</p>
          )}
        </div>
      )}
    </div>
  );
}

function AddBannerDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    imageUrl: "",
    description: "",
    badge: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await settingsApi.createBannerAdmin({
        ...form,
        description: form.description || undefined,
        badge: form.badge || undefined,
      });
      toast.success("Banner created");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to create banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Banner</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Banner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bannerId">Banner ID</Label>
            <Input id="bannerId" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerTitle">Title</Label>
            <Input id="bannerTitle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerImage">Image URL</Label>
            <Input id="bannerImage" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerDesc">Description</Label>
            <Input id="bannerDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerBadge">Badge</Label>
            <Input id="bannerBadge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Banner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
