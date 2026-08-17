"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useDigitalProductsAdmin,
  useCreateDigitalProduct,
  useUpdateDigitalProduct,
  useDeleteDigitalProduct,
} from "@/hooks/queries";
import type { DigitalProduct, CreateDigitalProductVariantDto, CreateDigitalProductFeatureDto } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Flame, ListChecks } from "lucide-react";
import { formatMmk, errorMessage, resolveImageUrl } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";

interface VariantForm {
  id?: number;
  name: string;
  durationDays: string;
  priceMmk: string;
  badge: string;
}

interface FeatureForm {
  name: string;
}

function VariantsEditor({
  variants,
  onChange,
}: {
  variants: VariantForm[];
  onChange: (v: VariantForm[]) => void;
}) {
  const update = (i: number, patch: Partial<VariantForm>) =>
    onChange(variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-3">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">Variants (plans)</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...variants, { name: "", durationDays: "30", priceMmk: "", badge: "" }])}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Variant
        </Button>
      </div>
      {variants.length === 0 && <p className="text-xs text-muted-foreground">No variants — uses base price.</p>}
      {variants.map((v, i) => (
        <div key={i} className="grid grid-cols-[1fr_80px_110px_80px_32px] gap-2 items-center">
          <Input
            placeholder="e.g. 1 Month Pro"
            value={v.name}
            onChange={(e) => update(i, { name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Days"
            value={v.durationDays}
            onChange={(e) => update(i, { durationDays: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price MMK"
            value={v.priceMmk}
            onChange={(e) => update(i, { priceMmk: e.target.value })}
          />
          <Input
            placeholder="Badge"
            value={v.badge}
            onChange={(e) => update(i, { badge: e.target.value })}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(variants.filter((_, idx) => idx !== i))}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function FeaturesEditor({
  features,
  onChange,
}: {
  features: FeatureForm[];
  onChange: (v: FeatureForm[]) => void;
}) {
  const update = (i: number, patch: Partial<FeatureForm>) =>
    onChange(features.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-3">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">Features</Label>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...features, { name: "" }])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Feature
        </Button>
      </div>
      {features.length === 0 && <p className="text-xs text-muted-foreground">No features listed.</p>}
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            placeholder="e.g. All Pro Filters & Effects"
            value={f.name}
            onChange={(e) => update(i, { name: e.target.value })}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(features.filter((_, idx) => idx !== i))}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  );
}

const emptyVariants: VariantForm[] = [];
const emptyFeatures: FeatureForm[] = [];

export default function AdminDigitalProductsPage() {
  const { data: products = [], isLoading } = useDigitalProductsAdmin();
  const deleteProduct = useDeleteDigitalProduct();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Digital Products</h1>
        <AddProductDialog />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">No digital products yet</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {product.image && (
                    <img
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{product.name}</p>
                      {product.badge && (
                        <Badge className="border-none bg-primary text-primary-foreground">
                          <Flame className="h-3 w-3 mr-1" /> {product.badge}
                        </Badge>
                      )}
                      <Badge variant={product.isActive ? "success" : "secondary"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatMmk(product.priceMmk)} | <span className={product.inStock ? "text-emerald-600" : "text-destructive"}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                      {Number(product.rating) > 0 && (
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {Number(product.rating).toFixed(1)}</span>
                      )}
                      <span>{product.salesCount} sold</span>
                      <span className="flex items-center gap-1">
                        <ListChecks className="h-3 w-3" /> {product.variants?.length ?? 0} variants · {product.features?.length ?? 0} features
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <EditProductDialog product={product} />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", description: "", priceMmk: "", rating: "", badge: "" });
  const [variants, setVariants] = useState<VariantForm[]>(emptyVariants);
  const [features, setFeatures] = useState<FeatureForm[]>(emptyFeatures);
  const [image, setImage] = useState<File | null>(null);
  const createProduct = useCreateDigitalProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const variantDtos: CreateDigitalProductVariantDto[] = variants
        .filter((v) => v.name.trim() && v.priceMmk)
        .map((v, i) => ({
          ...(v.id ? { id: v.id } : {}),
          name: v.name.trim(),
          durationDays: Number(v.durationDays) || 0,
          priceMmk: Number(v.priceMmk),
          badge: v.badge.trim() || undefined,
          sortOrder: i,
        }));
      const featureDtos: CreateDigitalProductFeatureDto[] = features
        .filter((f) => f.name.trim())
        .map((f, i) => ({ name: f.name.trim(), sortOrder: i }));
      await createProduct.mutateAsync({
        dto: {
          name: form.name,
          category: form.category || undefined,
          description: form.description || undefined,
          priceMmk: Number(form.priceMmk),
          rating: form.rating ? Number(form.rating) : undefined,
          badge: form.badge || undefined,
          variants: variantDtos,
          features: featureDtos,
        },
        image: image ?? undefined,
      });
      toast.success("Product created");
      setOpen(false);
      setForm({ name: "", category: "", description: "", priceMmk: "", rating: "", badge: "" });
      setVariants([]);
      setFeatures([]);
      setImage(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Digital Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat">Category</Label>
            <Input id="cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. gift_card, steam" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (MMK)</Label>
              <Input id="price" type="number" value={form.priceMmk} onChange={(e) => setForm({ ...form, priceMmk: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0–5)</Label>
              <Input id="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="e.g. 4.9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge">Badge (optional)</Label>
            <Input id="badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. HOT, NEW" />
          </div>
          <VariantsEditor variants={variants} onChange={setVariants} />
          <FeaturesEditor features={features} onChange={setFeatures} />
          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <Button type="submit" disabled={createProduct.isPending} className="w-full">{createProduct.isPending ? "Creating..." : "Create"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({ product }: { product: DigitalProduct }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: product.description || "",
    priceMmk: String(product.priceMmk),
    rating: product.rating ? String(product.rating) : "",
    badge: product.badge || "",
    isAvailable: product.isAvailable,
  });
  const [variants, setVariants] = useState<VariantForm[]>(
    product.variants?.map((v) => ({
      id: v.id,
      name: v.name,
      durationDays: String(v.durationDays),
      priceMmk: String(v.priceMmk),
      badge: v.badge || "",
    })) ?? [],
  );
  const [features, setFeatures] = useState<FeatureForm[]>(
    product.features?.map((f) => ({ name: f.name })) ?? [],
  );
  const [image, setImage] = useState<File | null>(null);
  const updateProduct = useUpdateDigitalProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const variantDtos: CreateDigitalProductVariantDto[] = variants
        .filter((v) => v.name.trim() && v.priceMmk)
        .map((v, i) => ({
          ...(v.id ? { id: v.id } : {}),
          name: v.name.trim(),
          durationDays: Number(v.durationDays) || 0,
          priceMmk: Number(v.priceMmk),
          badge: v.badge.trim() || undefined,
          sortOrder: i,
        }));
      const featureDtos: CreateDigitalProductFeatureDto[] = features
        .filter((f) => f.name.trim())
        .map((f, i) => ({ name: f.name.trim(), sortOrder: i }));
      await updateProduct.mutateAsync({
        id: product.id,
        dto: {
          name: form.name,
          category: form.category || undefined,
          description: form.description || undefined,
          priceMmk: Number(form.priceMmk),
          rating: form.rating ? Number(form.rating) : undefined,
          badge: form.badge || undefined,
          isAvailable: form.isAvailable,
          variants: variantDtos,
          features: featureDtos,
        },
        image: image ?? undefined,
      });
      toast.success("Product updated");
      setOpen(false);
      setImage(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ename">Name</Label>
            <Input id="ename" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ecat">Category</Label>
            <Input id="ecat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edesc">Description</Label>
            <Textarea id="edesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="eprice">Base Price (MMK)</Label>
              <Input id="eprice" type="number" value={form.priceMmk} onChange={(e) => setForm({ ...form, priceMmk: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="erating">Rating (0–5)</Label>
              <Input id="erating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="e.g. 4.9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ebadge">Badge (optional)</Label>
            <Input id="ebadge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. HOT, NEW" />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            Stock Available
          </label>
          <VariantsEditor variants={variants} onChange={setVariants} />
          <FeaturesEditor features={features} onChange={setFeatures} />
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload value={image ?? product.image} onChange={setImage} />
          </div>
          <Button type="submit" disabled={updateProduct.isPending} className="w-full">{updateProduct.isPending ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
