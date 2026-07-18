"use client";

import { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatMmk } from "@/lib/utils";

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
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{product.name}</p>
                    <Badge variant={product.isActive ? "success" : "secondary"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatMmk(product.priceMmk)} | Stock: {product.stock}
                  </p>
                  {product.description && <p className="text-xs text-muted-foreground mt-1">{product.description}</p>}
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

function AddProductDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", description: "", priceMmk: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.createDigitalProductAdmin({
        name: form.name,
        category: form.category || undefined,
        description: form.description || undefined,
        priceMmk: Number(form.priceMmk),
      });
      toast.success("Product created");
      setOpen(false);
      setForm({ name: "", category: "", description: "", priceMmk: "" });
      onSuccess();
    } catch {
      toast.error("Failed to create product");
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.updateDigitalProductAdmin(product.id, {
        name: form.name,
        category: form.category || undefined,
        description: form.description || undefined,
        priceMmk: Number(form.priceMmk),
      });
      toast.success("Product updated");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to update product");
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
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
