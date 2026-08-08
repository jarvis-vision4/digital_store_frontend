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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner? This cannot be undone.")) return;
    try {
      await settingsApi.deleteBannerAdmin(id);
      toast.success("Banner deleted");
      loadBanners();
    } catch {
      toast.error("Failed to delete banner");
    }
  };

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
              {banner.imageUrl ? (
                <img src={resolveImageUrl(banner.imageUrl)} alt={banner.title} className="aspect-video w-full object-cover" />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center text-4xl">🖼️</div>
              )}
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
              <CardContent className="pt-0 flex items-center justify-end">
                <EditBannerDialog banner={banner} onSuccess={loadBanners} />
                <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
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
    description: "",
    badge: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await settingsApi.createBannerAdmin(
        {
          ...form,
          description: form.description || undefined,
          badge: form.badge || undefined,
        },
        image ?? undefined,
      );
      toast.success("Banner created");
      setOpen(false);
      setForm({ id: "", title: "", description: "", badge: "" });
      setImage(null);
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
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
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

function EditBannerDialog({ banner, onSuccess }: { banner: PromotionalBanner; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: banner.title,
    description: banner.description || "",
    badge: banner.badge || "",
    isActive: banner.isActive,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        title: banner.title,
        description: banner.description || "",
        badge: banner.badge || "",
        isActive: banner.isActive,
      });
      setImage(null);
    }
  }, [open, banner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await settingsApi.updateBannerAdmin(
        banner.id,
        {
          title: form.title,
          description: form.description || undefined,
          badge: form.badge || undefined,
          isActive: form.isActive,
        },
        image ?? undefined,
      );
      toast.success("Banner updated");
      setOpen(false);
      setImage(null);
      onSuccess();
    } catch {
      toast.error("Failed to update banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Banner</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="etBannerTitle">Title</Label>
            <Input id="etBannerTitle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload value={image ?? banner.imageUrl} onChange={setImage} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etBannerDesc">Description</Label>
            <Input id="etBannerDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etBannerBadge">Badge</Label>
            <Input id="etBannerBadge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}