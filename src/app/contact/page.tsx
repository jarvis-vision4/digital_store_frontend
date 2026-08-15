import { ContactUs } from "@/components/contact-us";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Contact Us | Shwe Family Digital Store",
  description: "Reach us on Telegram, TikTok and Facebook for support and order enquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-10 px-4">
      <div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">We&apos;re here to help — reach us on any channel below.</p>
      </div>
      <ContactUs />
      <Card>
        <CardContent className="p-6 space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Business Hours</p>
          <p>Daily: 9:00 AM – 9:00 PM (Myanmar Time)</p>
          <p>We usually reply within a few minutes during business hours.</p>
        </CardContent>
      </Card>
    </div>
  );
}
