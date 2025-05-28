"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Sample carrier data
const carrierData: Record<string, any> = {
  "allstate": {
    name: "Allstate",
    isConnected: false,
    linesOfBusiness: ["Auto", "Home", "Renters"],
    refocusEmail: "elevated-allstate@refocusai.com",
    refocusPassword: "Kx9Pm2Nq8vL",
  },
  "bristol-west": {
    name: "Bristol West",
    isConnected: true,
    linesOfBusiness: ["Auto"],
    refocusEmail: "elevated-bristolwest@refocusai.com",
    refocusPassword: "Zy3Qm75Hd#eL",
    setupMethod: "non-licensed",
  },
  "nationwide": {
    name: "Nationwide",
    isConnected: false,
    linesOfBusiness: ["Home", "Auto"],
    refocusEmail: "elevated-nationwide@refocusai.com",
    refocusPassword: "Lq4Xn87TdIwJ",
  },
  "progressive": {
    name: "Progressive",
    isConnected: true,
    linesOfBusiness: ["Home", "Auto"],
    refocusEmail: "elevated-progressive@refocusai.com",
    refocusPassword: "Vy6Mz25Hp*uL",
    setupMethod: "shared-credentials",
    elevatedUsername: "agency_user_123",
    elevatedPassword: "user_password_456",
  },
  "safeco": {
    name: "Safeco",
    isConnected: false,
    linesOfBusiness: ["Home", "Auto"],
    refocusEmail: "elevated-safeco@refocusai.com",
    refocusPassword: "Dn3Cy80Kv@qN",
  },
};

interface CarrierDetailPageProps {
  params: Promise<{
    carrierId: string;
  }>;
}

export default function CarrierDetailPage({ params }: CarrierDetailPageProps) {
  const { carrierId } = React.use(params);
  const carrier = carrierData[carrierId];
  
  const [setupMethod, setSetupMethod] = useState<"non-licensed" | "shared-credentials">(
    carrier?.setupMethod || "non-licensed"
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [elevatedUsername, setElevatedUsername] = useState(carrier?.elevatedUsername || "");
  const [elevatedPassword, setElevatedPassword] = useState(carrier?.elevatedPassword || "");

  if (!carrier) {
    return (
      <DashboardLayout>
        <div className="bg-gray-50 py-6">
          <div className="max-w-[640px] mx-auto px-4 pb-10">
            <div className="text-center">
              <h1 className="text-lg font-medium text-gray-900 mb-2">Carrier not found</h1>
              <Link href="/settings/carriers" className="text-blue-600 hover:underline">
                Back to carriers
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSave = () => {
    // Simulate saving the configuration
    alert("Carrier configuration saved successfully!");
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/settings/carriers" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to carriers
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mr-4">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">{carrier.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={carrier.isConnected ? "default" : "secondary"}>
                      {carrier.isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Lines: {carrier.linesOfBusiness.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <Alert className="mb-6">
            <AlertDescription>
              <strong>Preferred Method:</strong> Add us as a non-licensed user using the credentials below. 
              This is the most secure and reliable way to set up carrier access.
            </AlertDescription>
          </Alert>

          {/* Setup Method Selection */}
          <div className="mb-6">
            <h2 className="text-base font-medium text-gray-900 mb-4">Choose Setup Method</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Non-Licensed User Option */}
              <Card 
                className={`cursor-pointer transition-all ${
                  setupMethod === "non-licensed" 
                    ? "ring-2 ring-blue-500 border-blue-200" 
                    : "hover:border-gray-300"
                }`}
                onClick={() => setSetupMethod("non-licensed")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Add us as a non-licensed user (Preferred)
                    </CardTitle>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      setupMethod === "non-licensed" 
                        ? "bg-blue-500 border-blue-500" 
                        : "border-gray-300"
                    }`}>
                      {setupMethod === "non-licensed" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Create a non-licensed user account for ReFocus using the credentials below
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Shared Credentials Option */}
              <Card 
                className={`cursor-pointer transition-all ${
                  setupMethod === "shared-credentials" 
                    ? "ring-2 ring-blue-500 border-blue-200" 
                    : "hover:border-gray-300"
                }`}
                onClick={() => setSetupMethod("shared-credentials")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Share existing credentials
                    </CardTitle>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      setupMethod === "shared-credentials" 
                        ? "bg-blue-500 border-blue-500" 
                        : "border-gray-300"
                    }`}>
                      {setupMethod === "shared-credentials" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Provide your existing username and password for this carrier
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Configuration Content */}
          {setupMethod === "non-licensed" && (
            <Card>
              <CardHeader>
                <CardTitle>ReFocus Credentials</CardTitle>
                <CardDescription>
                  Use these credentials to create a non-licensed user account for ReFocus on {carrier.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="refocus-email">ReFocus Email</Label>
                  <div className="flex mt-1">
                    <Input
                      id="refocus-email"
                      value={carrier.refocusEmail}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(carrier.refocusEmail, "email")}
                    >
                      {copiedField === "email" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="refocus-password">ReFocus Password</Label>
                  <div className="flex mt-1">
                    <Input
                      id="refocus-password"
                      value={carrier.refocusPassword}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(carrier.refocusPassword, "password")}
                    >
                      {copiedField === "password" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    After creating the non-licensed user account, please set up MFA forwarding 
                    to <strong>{carrier.refocusEmail}</strong> so we can receive authentication codes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {setupMethod === "shared-credentials" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Credentials</CardTitle>
                  <CardDescription>
                    Provide your existing username and password for {carrier.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="elevated-username">Username</Label>
                    <Input
                      id="elevated-username"
                      value={elevatedUsername}
                      onChange={(e) => setElevatedUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="elevated-password">Password</Label>
                    <Input
                      id="elevated-password"
                      type="password"
                      value={elevatedPassword}
                      onChange={(e) => setElevatedPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>MFA Forwarding Setup</CardTitle>
                  <CardDescription>
                    Set up email forwarding for MFA codes from {carrier.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="mfa-forward-email">Forward MFA emails to:</Label>
                    <div className="flex mt-1">
                      <Input
                        id="mfa-forward-email"
                        value={carrier.refocusEmail}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => copyToClipboard(carrier.refocusEmail, "mfa-email")}
                      >
                        {copiedField === "mfa-email" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Set up an email rule in your email client (Outlook, Gmail, etc.) to automatically 
                      forward all MFA messages from {carrier.name} to this ReFocus email address.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 