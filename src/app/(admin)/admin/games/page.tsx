"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
import {
  useGames,
  useGame,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  useAddPackage,
  useUpdatePackage,
  useDeletePackage,
  useUploadGameImage,
} from "@/hooks/queries";
import type { Game, GamePackage, GameCategory } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { errorMessage } from "@/lib/utils";
import { GameImage } from "@/components/game-image";
import { ImageUpload } from "@/components/image-upload";

export default function AdminGamesPage() {
  const { data: games = [], isLoading } = useGames();
  const deleteGame = useDeleteGame();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this game? This cannot be undone.")) return;
    try {
      await deleteGame.mutateAsync(id);
      toast.success("Game deleted");
    } catch {
      toast.error("Failed to delete game");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Games</h1>
        <AddGameDialog />
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
                  <GameImage value={game.image} className="h-8 w-8 rounded-md" />
                  <div>
                    <p className="font-medium">{game.name}</p>
                    <p className="text-sm text-muted-foreground">{game.id} - {game.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={game.isActive ? "success" : "secondary"}>
                    {game.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <PackagesDialog game={game} />
                  <EditGameDialog game={game} />
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

function AddGameDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "mobile_games",
    image: "",
    description: "",
    minAmount: "500 MMK",
    pkgName: "",
    pkgPrice: "",
  });
  const createGame = useCreateGame();
  const uploadImage = useUploadGameImage();

  const canSubmit = form.image && form.pkgName.trim() && form.pkgPrice.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: form.id,
        name: form.name,
        category: form.category as GameCategory,
        image: form.image,
        description: form.description || undefined,
        minAmount: form.minAmount,
        packages: [
          {
            packageName: form.pkgName.trim(),
            priceMmk: Number(form.pkgPrice),
          },
        ],
      };
      await createGame.mutateAsync(payload);
      toast.success("Game created");
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
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
            <Label>Emoji Icon / Image</Label>
            <ImageUpload
              value={form.image}
              onUpload={(file) => uploadImage.mutateAsync(file)}
              onChange={(file) => {
                if (file) setForm({ ...form, image: file as unknown as string });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Initial Package</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pkgName">Package Name</Label>
                <Input id="pkgName" placeholder="e.g. 86 Diamonds" value={form.pkgName} onChange={(e) => setForm({ ...form, pkgName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pkgPrice">Price (MMK)</Label>
                <Input id="pkgPrice" type="number" placeholder="1000" value={form.pkgPrice} onChange={(e) => setForm({ ...form, pkgPrice: e.target.value })} required />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">You can add more packages later.</p>
          </div>

          <Button type="submit" disabled={createGame.isPending || !canSubmit} className="w-full">
            {createGame.isPending ? "Creating..." : "Create Game"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditGameDialog({ game }: { game: Game }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: game.name,
    category: game.category,
    image: game.image,
    description: game.description || "",
    minAmount: game.minAmount,
  });
  const updateGame = useUpdateGame();
  const uploadImage = useUploadGameImage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGame.mutateAsync({ id: game.id, dto: form });
      toast.success("Game updated");
      setOpen(false);
    } catch {
      toast.error("Failed to update game");
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
            <Label>Emoji Icon / Image</Label>
            <ImageUpload
              value={form.image}
              onUpload={(file) => uploadImage.mutateAsync(file)}
              onChange={(file) => {
                if (file) setForm({ ...form, image: file as unknown as string });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editDesc">Description</Label>
            <Input id="editDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Button type="submit" disabled={updateGame.isPending || !form.image} className="w-full">
            {updateGame.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PackagesDialog({ game }: { game: Game }) {
  const [open, setOpen] = useState(false);
  const { data: gameDetail, isLoading, refetch } = useGame(game.id);
  const packages = gameDetail?.packages ?? game.packages;
  const deletePackage = useDeletePackage();

  const handleDeletePackage = async (pkgId: number) => {
    if (!confirm("Delete this package?")) return;
    try {
      await deletePackage.mutateAsync({ gameId: game.id, pkgId });
      toast.success("Package deleted");
      await refetch();
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
          <AddPackageDialog gameId={game.id} onSuccess={refetch} />
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
                    <EditPackageDialog pkg={pkg} onSuccess={refetch} />
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
  const addPackage = useAddPackage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPackage.mutateAsync({
        gameId,
        dto: {
          packageName: form.packageName,
          priceMmk: Number(form.priceMmk),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
          stockQuantity: Number(form.stockQuantity),
        },
      });
      toast.success("Package added");
      setOpen(false);
      setForm({ packageName: "", priceMmk: "", originalPrice: "", stockQuantity: "999" });
      onSuccess();
    } catch {
      toast.error("Failed to add package");
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
          <Button type="submit" disabled={addPackage.isPending} className="w-full">
            {addPackage.isPending ? "Adding..." : "Add Package"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditPackageDialog({ pkg, onSuccess }: { pkg: GamePackage; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    packageName: pkg.packageName,
    priceMmk: String(pkg.priceMmk),
    originalPrice: pkg.originalPrice ? String(pkg.originalPrice) : "",
    stockQuantity: String(pkg.stockQuantity),
    isActive: pkg.isActive,
  });
  const updatePackage = useUpdatePackage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePackage.mutateAsync({
        pkgId: pkg.id,
        dto: {
          packageName: form.packageName,
          priceMmk: Number(form.priceMmk),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
          stockQuantity: Number(form.stockQuantity),
          isActive: form.isActive,
        },
      });
      toast.success("Package updated");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to update package");
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
          <Button type="submit" disabled={updatePackage.isPending} className="w-full">
            {updatePackage.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
