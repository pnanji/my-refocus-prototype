"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function NotificationsSettings() {
  // State for form values
  const [personalDays, setPersonalDays] = useState("45");
  const [commercialDays, setCommercialDays] = useState("45");
  // Store initial values that never change for comparison
  const [initialPersonalDays] = useState("45");
  const [initialCommercialDays] = useState("45");
  // State for showing alerts
  const [personalDaysReduced, setPersonalDaysReduced] = useState(false);
  const [commercialDaysReduced, setCommercialDaysReduced] = useState(false);
  const [primaryEmail, setPrimaryEmail] = useState("jacobjones@agency.com");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [notificationMethod, setNotificationMethod] = useState("automated");
  const [suspenseDue, setSuspenseDue] = useState("7 days from creation");
  const [assignee, setAssignee] = useState("");
  
  // State for tracking form changes
  const [hasChanges, setHasChanges] = useState(false);
  
  // Refs for debounce timers
  const personalDaysTimerRef = useRef<NodeJS.Timeout | null>(null);
  const commercialDaysTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to calculate date range for help text
  const calculateDateRange = (daysInAdvance: number) => {
    // Use January 1st as the base date
    const baseDate = new Date(new Date().getFullYear(), 0, 1); // January 1st of current year
    
    // Calculate start date (base date + days in advance)
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() + daysInAdvance);
    
    // Calculate end date (start date + 6 days to make a 7-day range)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    // Format dates as Month Day (e.g., February 15)
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };
    
    return {
      startFormatted: formatDate(startDate),
      endFormatted: formatDate(endDate)
    };
  };

  // Get formatted date ranges for help text
  const personalDateRange = calculateDateRange(Number(personalDays) || 0);
  const commercialDateRange = calculateDateRange(Number(commercialDays) || 0);

  // Generate appropriate alert message based on which values are reduced
  const getAlertMessage = () => {
    const personalGapDays = Number(initialPersonalDays) - Number(personalDays);
    const commercialGapDays = Number(initialCommercialDays) - Number(commercialDays);
    
    // Both personal and commercial days reduced
    if (personalDaysReduced && commercialDaysReduced) {
      return `You won't see predictions for personal policies for the next ${personalGapDays} days and commercial policies for the next ${commercialGapDays} days due to these changes.`;
    }
    
    // Only personal days reduced
    if (personalDaysReduced) {
      return getPredictionGapMessage(Number(initialPersonalDays), Number(personalDays), "Personal");
    }
    
    // Only commercial days reduced
    if (commercialDaysReduced) {
      return getPredictionGapMessage(Number(initialCommercialDays), Number(commercialDays), "Commercial");
    }
    
    return null;
  };

  // Calculate prediction gap message for a single policy type
  const getPredictionGapMessage = (oldDays: number, newDays: number, type: string) => {
    if (oldDays <= newDays) return null;
    const gapDays = oldDays - newDays;
    return `For ${type.toLowerCase()} policies, you won't see predictions for the next ${gapDays} days due to this change.`;
  };

  // Handle input changes with debounced validation
  const handlePersonalDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setPersonalDays(value);
    setHasChanges(true);
    
    // Clear any existing timer
    if (personalDaysTimerRef.current) {
      clearTimeout(personalDaysTimerRef.current);
    }
    
    // Set a new timer to check the value after typing stops
    personalDaysTimerRef.current = setTimeout(() => {
      setPersonalDaysReduced(Number(value) < Number(initialPersonalDays));
    }, 500);
  };

  const handleCommercialDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setCommercialDays(value);
    setHasChanges(true);
    
    // Clear any existing timer
    if (commercialDaysTimerRef.current) {
      clearTimeout(commercialDaysTimerRef.current);
    }
    
    // Set a new timer to check the value after typing stops
    commercialDaysTimerRef.current = setTimeout(() => {
      setCommercialDaysReduced(Number(value) < Number(initialCommercialDays));
    }, 500);
  };

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (personalDaysTimerRef.current) {
        clearTimeout(personalDaysTimerRef.current);
      }
      if (commercialDaysTimerRef.current) {
        clearTimeout(commercialDaysTimerRef.current);
      }
    };
  }, []);

  const handlePrimaryEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryEmail(e.target.value);
    setHasChanges(true);
  };

  const handleNotificationMethodChange = (value: string) => {
    setNotificationMethod(value);
    setHasChanges(true);
  };

  const handleSuspenseDueChange = (value: string) => {
    setSuspenseDue(value);
    setHasChanges(true);
  };

  const handleAssigneeChange = (value: string) => {
    setAssignee(value);
    setHasChanges(true);
  };

  const handleAddEmail = () => {
    setAdditionalEmails([...additionalEmails, ""]);
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real implementation, this would save data to backend
    toast.success("Notification settings saved successfully");
    setHasChanges(false);
    // Reset the comparison base after saving
    setPersonalDaysReduced(false);
    setCommercialDaysReduced(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[696px] mx-auto px-4 pb-10">
          {/* Back button */}
          <div className="mb-4">
            <Link href="/settings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </div>
          
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-base font-medium text-foreground">Notifications</h1>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={!hasChanges}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>

          {/* At-Risk Notifications */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              {/* Show alert if either personal or commercial days were decreased */}
              {(personalDaysReduced || commercialDaysReduced) && (
                <Alert variant="warning" className="mb-6">
                  <AlertDescription className="text-foreground">
                    {getAlertMessage()} Need help understanding this change? <Link href="https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6" className="underline">Contact our support team</Link>.
                  </AlertDescription>
                </Alert>
              )}

              {/* Personal Section */}
              <h2 className="text-sm font-medium text-foreground mb-1">
                When should we notify you about upcoming personal at-risk cancellations?
              </h2>
              <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-md">
                <span className="text-sm text-muted-foreground">Notify me</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={personalDays}
                  onChange={handlePersonalDaysChange}
                  className="w-12 h-8 text-center [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-muted-foreground flex-1">
                  days in advance and include policies expiring in the next 7 days.
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 mb-8">
                e.g. This means on January 1st, you'll be notified of expirations from {personalDateRange.startFormatted} - {personalDateRange.endFormatted}.
              </p>

              {/* Commercial Section */}
              <h2 className="text-sm font-medium text-foreground mb-1">
                When should we notify you about upcoming commercial at-risk cancellations?
              </h2>
              <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-md">
                <span className="text-sm text-muted-foreground">Notify me</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={commercialDays}
                  onChange={handleCommercialDaysChange}
                  className="w-12 h-8 text-center [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-muted-foreground flex-1">
                  days in advance and include policies expiring in the next 7 days.
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Summary Recipients */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-sm font-medium text-foreground mb-1">
                Who should receive the weekly summary email about at-risk cancellations?
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                You can add up to 10 people.
              </p>
              
              <div className="space-y-4">
                <div className="grid w-full max-w-60 items-center gap-2">
                  <Label htmlFor="primary-email">Primary</Label>
                  <Input
                    type="email"
                    id="primary-email"
                    value={primaryEmail}
                    onChange={handlePrimaryEmailChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cc:</Label>
                  <div className="space-y-1.5">
                    {additionalEmails.map((email, index) => (
                      <Input
                        key={index}
                        type="email"
                        value={email}
                        readOnly
                        placeholder="Email"
                        className="max-w-60"
                      />
                    ))}
                    <Input
                      type="email"
                      placeholder="Email"
                      className="max-w-60"
                    />
                  </div>
                </div>
              </div>
              
              <Button
                type="button"
                variant="dashed"
                size="default"
                className="text-sm mt-2 w-[240px]"
                onClick={handleAddEmail}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Additional Email
              </Button>
            </div>
          </div>

          {/* AMS360 Notification Preferences */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">
                How would you like to be notified of at-risk cancellations in AMS360?
              </h2>
              
              <RadioGroup 
                value={notificationMethod} 
                onValueChange={handleNotificationMethodChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="automated" id="automated" />
                  <Label htmlFor="automated" className="font-normal">
                    Automated Suspense <span className="text-muted-foreground text-sm">(most common)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notes" id="notes" />
                  <Label htmlFor="notes" className="font-normal">Notes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dont-notify" id="dont-notify" />
                  <Label htmlFor="dont-notify" className="font-normal">Don&apos;t notify me in AMS360</Label>
                </div>
              </RadioGroup>

              {/* Suspense Assignment (only visible when automated is selected) */}
              {notificationMethod === "automated" && (
                <>
                  <div className="mt-6 mb-4">
                    <Label className="text-sm text-foreground mb-2">
                      Who to assign the suspense?
                    </Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={assignee}
                      onChange={(e) => {
                        setAssignee(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full max-w-60"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-foreground mb-2">
                      Suspense Due Date
                    </Label>
                    <Select value={suspenseDue} onValueChange={handleSuspenseDueChange}>
                      <SelectTrigger className="w-full max-w-60">
                        <SelectValue placeholder="Select days..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7 days from creation">7 days from creation</SelectItem>
                        <SelectItem value="14 days from creation">14 days from creation</SelectItem>
                        <SelectItem value="30 days from creation">30 days from creation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </DashboardLayout>
  );
} 