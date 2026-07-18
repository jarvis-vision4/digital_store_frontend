"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/lib/api";
import { formatMmk, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { User, Shield, Copy, Check, Users, Gift, RefreshCw } from "lucide-react";
import type { ReferralInfo } from "@/types";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);

  useEffect(() => {
    authApi.getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch(() => {});
  }, [setUser]);

  const loadReferralInfo = () => {
    setIsLoadingReferrals(true);
    authApi.getReferralInfo()
      .then((data) => setReferralInfo(data))
      .catch(() => {})
      .finally(() => setIsLoadingReferrals(false));
  };

  useEffect(() => {
    loadReferralInfo();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const copyReferral = async () => {
    if (!user?.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = user.referralCode;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral code copied!");
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground text-xs">Username</Label>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <p className="font-medium">{user.email || "Not set"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Role</Label>
              <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>{user.role}</Badge>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Member Since</Label>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">VIP Level</Label>
              <p className="font-medium">{user.vipName} (Lv.{user.vipLevel})</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Discount Rate</Label>
              <p className="font-medium">{(Number(user.discountRate) * 100).toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Referral Program
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={loadReferralInfo}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Share your referral code and earn bonuses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono">
              {user.referralCode}
            </code>
            <Button variant="outline" size="icon" onClick={copyReferral}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
                <div className="text-lg font-bold">
                  {isLoadingReferrals ? <Skeleton className="h-6 w-8" /> : referralInfo?.totalReferrals ?? 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Gift className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Bonus</p>
                <div className="text-lg font-bold">
                  {isLoadingReferrals ? <Skeleton className="h-6 w-20" /> : formatMmk(referralInfo?.totalBonus ?? 0)}
                </div>
              </div>
            </div>
          </div>

          {referralInfo && referralInfo.referrals && referralInfo.referrals.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Referred Users</p>
              <div className="space-y-2">
                {referralInfo.referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between text-sm rounded-lg border p-2">
                    <div>
                      <span className="font-medium">{ref.referee.username}</span>
                      <p className="text-xs text-muted-foreground">{formatDate(ref.referee.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={ref.status === "Rewarded" ? "success" : "warning"}>{ref.status}</Badge>
                      <span className="text-xs font-medium">{formatMmk(Number(ref.bonusAmountMmk))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
