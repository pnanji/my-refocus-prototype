"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Copy, Check, Info, Plus, X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfig } from "@/components/config-panel";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useSavedCarriers } from "../page";

// Sample carrier data
const carrierData: Record<string, any> = {
  "allstate": {
    name: "Allstate",
    isConnected: false,
    linesOfBusiness: ["Auto", "Home", "Renters"],
    refocusEmail: "cjinsurance-mfa@refocusai.com",
    refocusPassword: "Kx9Pm2Nq8vL",
  },
  "bristol-west": {
    name: "Bristol West",
    isConnected: true,
    linesOfBusiness: ["Auto"],
    refocusEmail: "cjinsurance-mfa@refocusai.com",
    refocusPassword: "Zy3Qm75Hd#eL",
    elevatedUsername: "agency_bristol_user",
    elevatedPassword: "bristol_pass_123",
  },
  "nationwide": {
    name: "Nationwide",
    isConnected: false,
    linesOfBusiness: ["Home", "Auto"],
    refocusEmail: "cjinsurance-mfa@refocusai.com",
    refocusPassword: "Lq4Xn87TdIwJ",
  },
  "progressive": {
    name: "Progressive",
    isConnected: true,
    linesOfBusiness: ["Home", "Auto"],
    refocusEmail: "cjinsurance-mfa@refocusai.com",
    refocusPassword: "Vy6Mz25Hp*uL",
    elevatedUsername: "agency_user_123",
    elevatedPassword: "user_password_456",
  },
  "safeco": {
    name: "Safeco",
    isConnected: false,
    linesOfBusiness: ["Home", "Auto"],
    refocusEmail: "cjinsurance-mfa@refocusai.com",
    refocusPassword: "Dn3Cy80Kv@qN",
  },
};

const LINES_OF_BUSINESS = [
  "Home",
  "Auto", 
  "Renters",
  "Umbrella",
  "Motorcycle",
  "Dwelling Fire",
  "Manufactured Home",
  "RV"
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

interface LineOfBusinessConfig {
  id: string;
  line: string;
  states: string[];
}

interface CarrierDetailPageProps {
  params: Promise<{
    carrierId: string;
  }>;
}

export default function CarrierDetailPage({ params }: CarrierDetailPageProps) {
  const { carrierId } = React.use(params);
  const carrier = carrierData[carrierId];
  const { progressiveCredentialError, progressiveMfaError } = useConfig();
  const router = useRouter();
  const { addSavedCarrier } = useSavedCarriers();
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [elevatedUsername, setElevatedUsername] = useState(carrier?.elevatedUsername || "");
  const [elevatedPassword, setElevatedPassword] = useState(carrier?.elevatedPassword || "");
  const [linesOfBusiness, setLinesOfBusiness] = useState<LineOfBusinessConfig[]>([
    { id: "1", line: "", states: [] }
  ]);
  const [isTestingCredentials, setIsTestingCredentials] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  if (!carrier) {
    return (
      <DashboardLayout>
        <div className="bg-gray-50 py-6">
          <div className="max-w-[640px] mx-auto px-4 pb-10">
            <div className="text-center">
              <h1 className="text-lg font-medium text-gray-900 mb-2">Carrier not found</h1>
              <Link href="/settings/carriers" className="text-orange-600 hover:underline">
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
    toast.success("Carrier configuration saved successfully!");
    
    // Navigate back to carriers page after a short delay
    setTimeout(() => {
      router.push("/settings/carriers");
    }, 1000);

    // Add carrier to saved list
    addSavedCarrier(carrierId);
  };

  const testCredentials = async () => {
    setIsTestingCredentials(true);
    setTestResult({ status: null, message: '' });

    try {
      // Simulate the credential testing process
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay for demo
      
      // Simulate different outcomes based on carrier and config
      const random = Math.random();
      if (random < 0.7) {
        setTestResult({
          status: 'success',
          message: 'Credentials verified successfully! Connection is ready for automated quoting.'
        });
      } else {
        setTestResult({
          status: 'error',
          message: 'Unable to verify credentials. Please check your username and password, and ensure MFA forwarding is set up correctly.'
        });
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'An error occurred while testing credentials. Please try again.'
      });
    } finally {
      setIsTestingCredentials(false);
    }
  };

  const addLineOfBusiness = () => {
    const newId = Date.now().toString();
    setLinesOfBusiness([...linesOfBusiness, { id: newId, line: "", states: [] }]);
  };

  const removeLineOfBusiness = (id: string) => {
    if (linesOfBusiness.length > 1) {
      setLinesOfBusiness(linesOfBusiness.filter(lob => lob.id !== id));
    }
  };

  const updateLineOfBusiness = (id: string, field: keyof LineOfBusinessConfig, value: any) => {
    setLinesOfBusiness(linesOfBusiness.map(lob => 
      lob.id === id ? { ...lob, [field]: value } : lob
    ));
  };

  const getAvailableLines = (currentId: string) => {
    const usedLines = linesOfBusiness
      .filter(lob => lob.id !== currentId && lob.line)
      .map(lob => lob.line);
    return LINES_OF_BUSINESS.filter(line => !usedLines.includes(line));
  };

  // Function to get detailed carrier status
  const getCarrierStatus = () => {
    if (carrierId === "progressive") {
      if (progressiveCredentialError) {
        return {
          status: "credential-error",
          title: "Credential Authentication Failed",
          message: "The username and password provided are incorrect or the account has been locked. Please verify your credentials and try again. If issues persist, check this support article for troubleshooting steps, or contact support for assistance.",
          type: "error"
        };
      }
      if (progressiveMfaError) {
        return {
          status: "mfa-error", 
          title: "MFA Setup Issue",
          message: "We're not receiving MFA codes from Progressive. Please check that email forwarding is set up correctly to forward MFA emails to the ReFocus email address. See this support article for troubleshooting steps, or contact support if needed.",
          type: "error"
        };
      }
    }
    
    if (carrier?.isConnected) {
      return {
        status: "connected",
        title: "Connection Active",
        message: "Successfully connected and ready for automated quoting.",
        type: "success"
      };
    }
    
    return {
      status: "not-connected",
      title: "Not Connected", 
      message: "Complete the setup process to enable automated quoting.",
      type: "info"
    };
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mr-4">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-gray-900">{carrier.name}</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Share Credentials */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Share Credentials</CardTitle>
              <CardDescription>
                Share an existing username and password for {carrier.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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

          {/* MFA Forwarding Setup */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>MFA Forwarding Setup</CardTitle>
              <CardDescription>
                Set up email forwarding for MFA codes from {carrier.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                <Alert className="mt-4 bg-gray-100">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Set up an email rule in your email client (Outlook, Gmail, etc.) to automatically 
                    forward all MFA messages from {carrier.name} to this ReFocus email address.{" "}
                    <Link href="#" className="underline text-gray-900">
                      See this support article
                    </Link>{" "}
                    for step-by-step instructions on setting up email forwarding rules.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Lines of Business Configuration */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Lines of Business</CardTitle>
              <CardDescription>
                Select which lines of business you want to quote with {carrier.name} and specify the states for each line
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-2 mb-2">
                <div className="col-span-4">
                  <Label className="text-sm font-medium text-gray-700">Line of Business</Label>
                </div>
                <div className="col-span-7">
                  <Label className="text-sm font-medium text-gray-700">States</Label>
                </div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Rows */}
              <div className="space-y-3">
                {linesOfBusiness.map((lineConfig, index) => (
                  <div key={lineConfig.id} className="grid grid-cols-12 gap-4 items-start">
                    {/* Line of Business Dropdown */}
                    <div className="col-span-4">
                      <Select
                        value={lineConfig.line}
                        onValueChange={(value) => updateLineOfBusiness(lineConfig.id, "line", value)}
                      >
                        <SelectTrigger className="w-full h-auto">
                          <SelectValue placeholder="Select line of business" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableLines(lineConfig.id).map(line => (
                            <SelectItem key={line} value={line}>
                              {line}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* States Column */}
                    <div className="col-span-7">
                      <Select
                        value=""
                        onValueChange={(state) => {
                          if (!lineConfig.states.includes(state)) {
                            updateLineOfBusiness(lineConfig.id, "states", [...lineConfig.states, state]);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-auto">
                          <div className="flex flex-wrap gap-1 w-full">
                            {lineConfig.states.length > 0 ? (
                              lineConfig.states.map(state => (
                                <Badge 
                                  key={state} 
                                  variant="secondary" 
                                  className="text-xs cursor-pointer bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200"
                                  onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateLineOfBusiness(
                                      lineConfig.id, 
                                      "states", 
                                      lineConfig.states.filter(s => s !== state)
                                    );
                                  }}
                                >
                                  {state} ×
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">Select states</span>
                            )}
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.filter(state => !lineConfig.states.includes(state)).map(state => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineOfBusiness(lineConfig.id)}
                        disabled={linesOfBusiness.length === 1}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Row Button */}
              <Button
                variant="outline"
                onClick={addLineOfBusiness}
                className="w-full mt-4"
                disabled={linesOfBusiness.some(lob => !lob.line)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Line of Business
              </Button>

              {linesOfBusiness.some(lob => !lob.line || lob.states.length === 0) && (
                <Alert className="bg-amber-50 border-amber-200 mt-4">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-foreground">
                    Please select a line of business and at least one state for each row.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={linesOfBusiness.some(lob => !lob.line || lob.states.length === 0)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </DashboardLayout>
  );
}