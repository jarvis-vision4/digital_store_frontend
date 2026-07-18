"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gamesApi } from "@/lib/api";
import type { Game, GamePackage, GameCategory } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGames = async () => {
    try {
      const data = await gamesApi.getGames();
      setGames(data);
    } catch {
      toast.error("Failed to load games");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadGames(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this game? This cannot be undone.")) return;
    try {
      await gamesApi.deleteGameAdmin(id);
      toast.success("Game deleted");
      loadGames();
    } catch {
      toast.error("Failed to delete game");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Games</h1>
        <AddGameDialog onSuccess={loadGames} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <Card key={game.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{game.image}</span>
                  <div>
                    <p className="font-medium">{game.name}</p>
                    <p className="text-sm text-muted-foreground">{game.id} - {game.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={game.isActive ? "success" : "secondary"}>
                    {game.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <PackagesDialog game={game} onSuccess={loadGames} />
                  <EditGameDialog game={game} onSuccess={loadGames} />
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(game.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
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

function AddGameDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "mobile_games",
    image: "",
    description: "",
    minAmount: "500 MMK",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.createGameAdmin(form as any);
      toast.success("Game created");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to create game");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Game</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameId">Game ID</Label>
            <Input id="gameId" placeholder="e.g. mobile-legends" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gameName">Name</Label>
            <Input id="gameName" placeholder="e.g. Mobile Legends" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as GameCategory })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["mobile_games", "pc_games", "gift_card", "mobile_app", "redeem_code", "social_service"] as GameCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Emoji Icon</Label>
            <Input id="image" placeholder="e.g. 🎮" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Game"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditGameDialog({ game, onSuccess }: { game: Game; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: game.name,
    category: game.category,
    image: game.image,
    description: game.description || "",
    minAmount: game.minAmount,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.updateGameAdmin(game.id, form);
      toast.success("Game updated");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to update game");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game - {game.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editName">Name</Label>
            <Input id="editName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as GameCategory })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["mobile_games", "pc_games", "gift_card", "mobile_app", "redeem_code", "social_service"] as GameCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editImage">Emoji Icon</Label>
            <Input id="editImage" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editDesc">Description</Label>
            <Input id="editDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PackagesDialog({ game, onSuccess }: { game: Game; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [packages, setPackages] = useState<GamePackage[]>(game.packages);
  const [isLoading, setIsLoading] = useState(false);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const g = await gamesApi.getGame(game.id);
      setPackages(g.packages);
    } catch {
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (open) loadPackages(); }, [open, game.id]);

  const handleDeletePackage = async (pkgId: number) => {
    if (!confirm("Delete this package?")) return;
    try {
      await apiClient.delete(`/admin/games/${game.id}/packages/${pkgId}`);
      toast.success("Package deleted");
      loadPackages();
      onSuccess();
    } catch {
      toast.error("Failed to delete package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Package className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Packages - {game.name}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end">
          <AddPackageDialog gameId={game.id} onSuccess={() => { loadPackages(); onSuccess(); }} />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No packages yet</p>
        ) : (
          <div className="space-y-2">
            {packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{pkg.packageName}</p>
                      <Badge variant={pkg.isActive ? "success" : "secondary"}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Price: {Number(pkg.priceMmk).toLocaleString()} MMK
                      {pkg.originalPrice && ` (was ${Number(pkg.originalPrice).toLocaleString()})`}
                      &nbsp;| Stock: {pkg.stockQuantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditPackageDialog pkg={pkg} gameId={game.id} onSuccess={() => { loadPackages(); onSuccess(); }} />
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePackage(pkg.id)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddPackageDialog({ gameId, onSuccess }: { gameId: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    packageName: "",
    priceMmk: "",
    originalPrice: "",
    stockQuantity: "999",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await gamesApi.addPackageAdmin(gameId, {
        packageName: form.packageName,
        priceMmk: Number(form.priceMmk),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stockQuantity: Number(form.stockQuantity),
      });
      toast.success("Package added");
      setOpen(false);
      setForm({ packageName: "", priceMmk: "", originalPrice: "", stockQuantity: "999" });
      onSuccess();
    } catch {
      toast.error("Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Package</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Package</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pkgName">Package Name</Label>
            <Input id="pkgName" placeholder="e.g. 86 Diamonds" value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (MMK)</Label>
            <Input id="price" type="number" placeholder="1000" value={form.priceMmk} onChange={(e) => setForm({ ...form, priceMmk: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="origPrice">Original Price (for discount display)</Label>
            <Input id="origPrice" type="number" placeholder="Leave empty if no discount" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockQty">Stock Quantity</Label>
            <Input id="stockQty" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Package"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditPackageDialog({ pkg, gameId, onSuccess }: { pkg: GamePackage; gameId: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    packageName: pkg.packageName,
    priceMmk: String(pkg.priceMmk),
    originalPrice: pkg.originalPrice ? String(pkg.originalPrice) : "",
    stockQuantity: String(pkg.stockQuantity),
    isActive: pkg.isActive,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.put(`/admin/games/${gameId}/packages/${pkg.id}`, {
        packageName: form.packageName,
        priceMmk: Number(form.priceMmk),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stockQuantity: Number(form.stockQuantity),
        isActive: form.isActive,
      });
      toast.success("Package updated");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to update package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="epkgName">Package Name</Label>
            <Input id="epkgName" value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eprice">Price (MMK)</Label>
            <Input id="eprice" type="number" value={form.priceMmk} onChange={(e) => setForm({ ...form, priceMmk: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eorigPrice">Original Price</Label>
            <Input id="eorigPrice" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estockQty">Stock Quantity</Label>
            <Input id="estockQty" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
