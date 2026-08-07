"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { gamesApi } from "@/lib/api";
import type { DigitalProduct } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { formatMmk, resolveImageUrl } from "@/lib/utils";
import { AxiosError } from "axios";

export default function AdminDigitalProductsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await gamesApi.getDigitalProductsAdmin();
      setProducts(data);
    } catch {
      toast.error("Failed to load digital products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await gamesApi.deleteDigitalProductAdmin(id);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Digital Products</h1>
        <AddProductDialog onSuccess={loadProducts} />
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
                      <Badge variant={product.isActive ? "success" : "secondary"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatMmk(product.priceMmk)} | <span className={product.inStock ? "text-emerald-600" : "text-destructive"}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                    </p>
                    {product.description && <p className="text-xs text-muted-foreground mt-1">{product.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <EditProductDialog product={product} onSuccess={loadProducts} />
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

function errorMessage(err: unknown): string {
  if (err instanceof AxiosError && err.response?.data?.message) {
    const m = err.response.data.message;
    return Array.isArray(m) ? m[0] : m;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

function ProductImageField({ value, onChange }: { value: string | File | null; onChange: (f: File | null) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = value instanceof File ? URL.createObjectURL(value) : resolveImageUrl(value);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    onChange(file);
    setIsUploading(false);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
        >
          {isUploading ? <ImageIcon className="h-4 w-4 animate-pulse" /> : <Upload className="h-4 w-4" />}
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
        {preview && <img src={preview} alt="" className="h-10 w-10 rounded-md object-cover" />}
      </div>
    </div>
  );
}

function AddProductDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", description: "", priceMmk: "" });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.createDigitalProductAdmin(
        {
          name: form.name,
          category: form.category || undefined,
          description: form.description || undefined,
          priceMmk: Number(form.priceMmk),
        },
        image ?? undefined,
      );
      toast.success("Product created");
      setOpen(false);
      setForm({ name: "", category: "", description: "", priceMmk: "" });
      setImage(null);
      onSuccess();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </DialogTrigger>
      <DialogContent>
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
          <div className="space-y-2">
            <Label htmlFor="price">Price (MMK)</Label>
            <Input id="price" type="number" value={form.priceMmk} onChange={(e) => setForm({ ...form, priceMmk: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <ProductImageField value={image} onChange={setImage} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Creating..." : "Create"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({ product, onSuccess }: { product: DigitalProduct; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    description: product.description || "",
    priceMmk: String(product.priceMmk),
    isAvailable: product.isAvailable,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.updateDigitalProductAdmin(
        product.id,
        {
          name: form.name,
          category: form.category || undefined,
          description: form.description || undefined,
          priceMmk: Number(form.priceMmk),
          isAvailable: form.isAvailable,
        },
        image ?? undefined,
      );
      toast.success("Product updated");
      setOpen(false);
      setImage(null);
      onSuccess();
    } catch (err) {
      toast.error(errorMessage(err));
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
          <div className="space-y-2">
            <Label htmlFor="eprice">Price (MMK)</Label>
            <Input id="eprice" type="number" value={form.priceMmk} onChange={(e) => setForm({ ...form, priceMmk: e.target.value })} required />
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
          <div className="space-y-2">
            <Label>Image</Label>
            <ProductImageField value={image ?? product.image} onChange={setImage} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
