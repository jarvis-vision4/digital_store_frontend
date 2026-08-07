export const categoryLabels: Record<string, string> = {
  mobile_games: "Mobile Games",
  pc_games: "PC Games",
  gift_card: "Gift Cards",
  mobile_app: "Mobile Apps",
  redeem_code: "Redeem Codes",
  social_service: "Social Services",
};

export const categoryColors: Record<string, string> = {
  mobile_games: "from-violet-500/20 to-blue-500/20",
  pc_games: "from-orange-500/20 to-red-500/20",
  gift_card: "from-emerald-500/20 to-teal-500/20",
  mobile_app: "from-pink-500/20 to-rose-500/20",
  redeem_code: "from-amber-500/20 to-yellow-500/20",
  social_service: "from-cyan-500/20 to-sky-500/20",
};

export const allCategories = ["all", ...Object.keys(categoryLabels)] as const;

export type BadgeVariant = "success" | "warning" | "destructive" | "secondary";

export function statusVariant(status: string): BadgeVariant {
  switch (status.toLowerCase()) {
    case "success":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}
