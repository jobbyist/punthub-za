import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  User, Shield, MessageSquare, Upload, Save, Camera, Coins,
  Twitter, MessageCircle, Send,
} from "lucide-react";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  age_verified: boolean;
  kyc_status: string;
  government_id_url: string | null;
  bank_confirmation_url: string | null;
  proof_of_address_url: string | null;
  social_twitter: string | null;
  social_discord: string | null;
  social_telegram: string | null;
  punt_points: number;
}

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSupportMessages();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();

    if (!error && data) setProfile(data as Profile);
    setLoading(false);
  };

  const fetchSupportMessages = async () => {
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) setSupportMessages(data as SupportMessage[]);
  };

  const updateProfile = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        full_name: profile.full_name,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        address_line1: profile.address_line1,
        address_line2: profile.address_line2,
        city: profile.city,
        state: profile.state,
        postal_code: profile.postal_code,
        country: profile.country,
        social_twitter: profile.social_twitter,
        social_discord: profile.social_discord,
        social_telegram: profile.social_telegram,
      })
      .eq("id", user!.id);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const filePath = `${user.id}/avatar.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setProfile((p) => p ? { ...p, avatar_url: publicUrl } : p);
    toast({ title: "Avatar updated!" });
  };

  const uploadKYCDoc = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const filePath = `${user.id}/${docType}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("kyc-documents").upload(filePath, file, { upsert: true });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }

    const field = docType === "government-id" ? "government_id_url"
      : docType === "bank-confirmation" ? "bank_confirmation_url"
      : "proof_of_address_url";

    await supabase.from("profiles").update({
      [field]: filePath,
      kyc_status: "submitted",
    }).eq("id", user.id);

    setProfile((p) => p ? { ...p, [field]: filePath, kyc_status: "submitted" } : p);
    toast({ title: "Document uploaded!", description: "We'll review it shortly." });
  };

  const sendSupportMessage = async () => {
    if (!newSubject.trim() || !newMessage.trim() || !user) return;

    const { error } = await supabase.from("support_messages").insert({
      user_id: user.id,
      subject: newSubject,
      message: newMessage,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setNewSubject("");
      setNewMessage("");
      fetchSupportMessages();
    }
  };

  const updateField = (field: keyof Profile, value: string) => {
    setProfile((p) => p ? { ...p, [field]: value } : p);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) return null;

  const kycStatusColor = {
    pending: "bg-muted text-muted-foreground",
    submitted: "bg-punt-gold/20 text-punt-gold",
    verified: "bg-punt-green/20 text-punt-green",
    rejected: "bg-destructive/20 text-destructive",
  }[profile.kyc_status] || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-5 w-5 text-background" />
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{profile.display_name || profile.username}</h1>
            <p className="text-muted-foreground">{profile.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="gap-1">
                <Coins className="h-3 w-3" /> {profile.punt_points.toLocaleString()} PuntPoints
              </Badge>
              <Badge className={kycStatusColor}>KYC: {profile.kyc_status}</Badge>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account"><User className="h-4 w-4 mr-1 hidden sm:inline" />Account</TabsTrigger>
            <TabsTrigger value="verification"><Shield className="h-4 w-4 mr-1 hidden sm:inline" />Verification</TabsTrigger>
            <TabsTrigger value="social"><Twitter className="h-4 w-4 mr-1 hidden sm:inline" />Social</TabsTrigger>
            <TabsTrigger value="support"><MessageSquare className="h-4 w-4 mr-1 hidden sm:inline" />Support</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input value={profile.username} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={profile.display_name || ""} onChange={(e) => updateField("display_name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.full_name || ""} onChange={(e) => updateField("full_name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email || ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone || ""} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 555 000 0000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={profile.date_of_birth || ""} onChange={(e) => updateField("date_of_birth", e.target.value)} />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="font-medium mb-3">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address Line 1</Label>
                      <Input value={profile.address_line1 || ""} onChange={(e) => updateField("address_line1", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address Line 2</Label>
                      <Input value={profile.address_line1 || ""} onChange={(e) => updateField("address_line2", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={profile.city || ""} onChange={(e) => updateField("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={profile.state || ""} onChange={(e) => updateField("state", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input value={profile.postal_code || ""} onChange={(e) => updateField("postal_code", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input value={profile.country || ""} onChange={(e) => updateField("country", e.target.value)} />
                    </div>
                  </div>
                </div>
                <Button onClick={updateProfile} disabled={saving} className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification (KYC)</CardTitle>
                <CardDescription>Upload documents to verify your identity and unlock full platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Government-Issued ID</Label>
                    {profile.government_id_url && <Badge variant="outline" className="text-punt-green">Uploaded</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Passport, driver's license, or national ID card</p>
                  <label className="flex items-center gap-2 border border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => uploadKYCDoc(e, "government-id")} />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Bank Account Confirmation Letter</Label>
                    {profile.bank_confirmation_url && <Badge variant="outline" className="text-punt-green">Uploaded</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Official bank letter or statement confirming your account</p>
                  <label className="flex items-center gap-2 border border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => uploadKYCDoc(e, "bank-confirmation")} />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Proof of Address</Label>
                    {profile.proof_of_address_url && <Badge variant="outline" className="text-punt-green">Uploaded</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Utility bill, bank statement, or official letter (less than 3 months old)</p>
                  <label className="flex items-center gap-2 border border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => uploadKYCDoc(e, "proof-of-address")} />
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Accounts</CardTitle>
                <CardDescription>Link your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter / X</Label>
                  <Input placeholder="@handle" value={profile.social_twitter || ""} onChange={(e) => updateField("social_twitter", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Discord</Label>
                  <Input placeholder="username#0000" value={profile.social_discord || ""} onChange={(e) => updateField("social_discord", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Send className="h-4 w-4" /> Telegram</Label>
                  <Input placeholder="@username" value={profile.social_telegram || ""} onChange={(e) => updateField("social_telegram", e.target.value)} />
                </div>
                <Button onClick={updateProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>New Support Message</CardTitle>
                  <CardDescription>Need help? Send us a message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input placeholder="What do you need help with?" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea placeholder="Describe your issue..." rows={4} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  </div>
                  <Button onClick={sendSupportMessage} disabled={!newSubject.trim() || !newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                </CardContent>
              </Card>

              {supportMessages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Previous Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supportMessages.map((msg) => (
                      <div key={msg.id} className="border border-border rounded-lg p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{msg.subject}</h4>
                          <Badge variant="outline" className="text-xs capitalize">{msg.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
