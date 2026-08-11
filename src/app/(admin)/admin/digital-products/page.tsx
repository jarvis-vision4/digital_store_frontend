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
import type { DigitalProduct } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatMmk, errorMessage, resolveImageUrl } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";

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
  const [form, setForm] = useState({ name: "", category: "", description: "", priceMmk: "" });
  const [image, setImage] = useState<File | null>(null);
  const createProduct = useCreateDigitalProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        dto: {
          name: form.name,
          category: form.category || undefined,
          description: form.description || undefined,
          priceMmk: Number(form.priceMmk),
        },
        image: image ?? undefined,
      });
      toast.success("Product created");
      setOpen(false);
      setForm({ name: "", category: "", description: "", priceMmk: "" });
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
    isAvailable: product.isAvailable,
  });
  const [image, setImage] = useState<File | null>(null);
  const updateProduct = useUpdateDigitalProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        dto: {
          name: form.name,
          category: form.category || undefined,
          description: form.description || undefined,
          priceMmk: Number(form.priceMmk),
          isAvailable: form.isAvailable,
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
            <ImageUpload value={image ?? product.image} onChange={setImage} />
          </div>
          <Button type="submit" disabled={updateProduct.isPending} className="w-full">{updateProduct.isPending ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
