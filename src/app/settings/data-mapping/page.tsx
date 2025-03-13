"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function DataMappingSettings() {
  // State for policy status column
  const [policyStatusColumn, setPolicyStatusColumn] = useState("policy_status");
  
  // State for policy type, business line, and dates
  const [policyTypeColumn, setPolicyTypeColumn] = useState("policy_type");
  const [businessLineColumn, setBusinessLineColumn] = useState("business_line");
  const [dateWrittenColumn, setDateWrittenColumn] = useState("date_written");
  const [dateExpiresColumn, setDateExpiresColumn] = useState("date_expires");
  
  // Available options for policy status values - only human-readable options
  const [availableOptions, setAvailableOptions] = useState([
    "Active", "Cancelled", "Pending", "Expired", "Renewed", "Lapsed", "Terminated"
  ]);
  
  // Selected values for each category
  const [activePolicies, setActivePolicies] = useState<string[]>([]);
  const [cancelledPolicies, setCancelledPolicies] = useState<string[]>([]);
  const [otherPolicyStatuses, setOtherPolicyStatuses] = useState<string[]>([]);
  
  // State for tracking form changes
  const [hasChanges, setHasChanges] = useState(false);

  // Get available options (excluding already selected values)
  const getAvailableOptions = () => {
    const selectedValues = [...activePolicies, ...cancelledPolicies, ...otherPolicyStatuses];
    return availableOptions.filter(option => !selectedValues.includes(option));
  };

  // Handle selection for active policies
  const handleActiveSelect = (value: string) => {
    if (value && !activePolicies.includes(value)) {
      setActivePolicies([...activePolicies, value]);
      setHasChanges(true);
    }
  };

  // Handle selection for cancelled policies
  const handleCancelledSelect = (value: string) => {
    if (value && !cancelledPolicies.includes(value)) {
      setCancelledPolicies([...cancelledPolicies, value]);
      setHasChanges(true);
    }
  };

  // Handle selection for other policy statuses
  const handleOtherSelect = (value: string) => {
    if (value && !otherPolicyStatuses.includes(value)) {
      setOtherPolicyStatuses([...otherPolicyStatuses, value]);
      setHasChanges(true);
    }
  };

  // Remove a value from active policies
  const removeActivePolicy = (value: string) => {
    setActivePolicies(activePolicies.filter(item => item !== value));
    setHasChanges(true);
  };

  // Remove a value from cancelled policies
  const removeCancelledPolicy = (value: string) => {
    setCancelledPolicies(cancelledPolicies.filter(item => item !== value));
    setHasChanges(true);
  };

  // Remove a value from other policy statuses
  const removeOtherPolicyStatus = (value: string) => {
    setOtherPolicyStatuses(otherPolicyStatuses.filter(item => item !== value));
    setHasChanges(true);
  };

  // Handle column selection changes
  const handlePolicyStatusColumnChange = (value: string) => {
    setPolicyStatusColumn(value);
    setHasChanges(true);
  };

  const handlePolicyTypeColumnChange = (value: string) => {
    setPolicyTypeColumn(value);
    setHasChanges(true);
  };

  const handleBusinessLineColumnChange = (value: string) => {
    setBusinessLineColumn(value);
    setHasChanges(true);
  };

  const handleDateWrittenColumnChange = (value: string) => {
    setDateWrittenColumn(value);
    setHasChanges(true);
  };

  const handleDateExpiresColumnChange = (value: string) => {
    setDateExpiresColumn(value);
    setHasChanges(true);
  };

  // Initialize with some default selections
  useEffect(() => {
    setActivePolicies(["Active"]);
    setCancelledPolicies(["Cancelled"]);
    setOtherPolicyStatuses(["Expired"]);
    setHasChanges(false);
  }, []);

  const handleSave = () => {
    // In a real implementation, this would save data to backend
    toast.success("Data mapping settings saved successfully");
    setHasChanges(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[780px] mx-auto px-4 pb-10">
          {/* Back button */}
          <div className="mb-4">
            <Link href="/settings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </div>
          
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-base font-medium text-foreground">Data Mapping</h1>
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

          {/* Policy Status Mapping */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">
                Verify the mapping of your policy status column to our standard categories.
              </h2>
              
              {/* Policy Status Column Selection */}
              <div className="mb-6">
                <Label htmlFor="policy-status-column" className="mb-2">Which column shows policy status?</Label>
                <Select value={policyStatusColumn} onValueChange={handlePolicyStatusColumnChange}>
                  <SelectTrigger id="policy-status-column" className="w-full max-w-[300px]">
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policy_status">policy_status</SelectItem>
                    <SelectItem value="status">status</SelectItem>
                    <SelectItem value="policy_state">policy_state</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Policy Status Value Mapping */}
              <div>
                <Label className="mb-4">
                  Of the values in your policy status column, which correspond to our standard categories?
                </Label>
                
                <div className="bg-gray-100 p-6 rounded-md mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Active Policies */}
                    <div>
                      <Label htmlFor="active-policies" className="mb-2">Active Policies</Label>
                      <Select 
                        value="" 
                        onValueChange={handleActiveSelect}
                      >
                        <SelectTrigger id="active-policies" className="w-full bg-white">
                          <SelectValue placeholder="Add a value..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableOptions().map(option => (
                            <SelectItem key={`active-${option}`} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-2 space-y-2">
                        {activePolicies.map(value => (
                          <div 
                            key={`active-tag-${value}`} 
                            className="flex items-center justify-between bg-gray-300 rounded-md px-3 py-2 w-full"
                          >
                            <span className="text-sm">{value}</span>
                            <button 
                              onClick={() => removeActivePolicy(value)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Canceled Policies */}
                    <div>
                      <Label htmlFor="cancelled-policies" className="mb-2">Canceled Policies</Label>
                      <Select 
                        value="" 
                        onValueChange={handleCancelledSelect}
                      >
                        <SelectTrigger id="cancelled-policies" className="w-full bg-white">
                          <SelectValue placeholder="Add a value..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableOptions().map(option => (
                            <SelectItem key={`cancelled-${option}`} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-2 space-y-2">
                        {cancelledPolicies.map(value => (
                          <div 
                            key={`cancelled-tag-${value}`} 
                            className="flex items-center justify-between bg-gray-300 rounded-md px-3 py-2 w-full"
                          >
                            <span className="text-sm">{value}</span>
                            <button 
                              onClick={() => removeCancelledPolicy(value)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Other Policy Statuses */}
                    <div>
                      <Label htmlFor="other-statuses" className="mb-2">Other Policy Statuses</Label>
                      <Select 
                        value="" 
                        onValueChange={handleOtherSelect}
                      >
                        <SelectTrigger id="other-statuses" className="w-full bg-white">
                          <SelectValue placeholder="Add a value..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableOptions().map(option => (
                            <SelectItem key={`other-${option}`} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-2 space-y-2">
                        {otherPolicyStatuses.map(value => (
                          <div 
                            key={`other-tag-${value}`} 
                            className="flex items-center justify-between bg-gray-300 rounded-md px-3 py-2 w-full"
                          >
                            <span className="text-sm">{value}</span>
                            <button 
                              onClick={() => removeOtherPolicyStatus(value)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Policy Details Mapping */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">
                Verify the mapping for other policy details like type, business line, and dates.
              </h2>
              
              {/* Policy Type */}
              <div className="mb-6">
                <Label htmlFor="policy-type" className="mb-2">Policy Type</Label>
                <Select value={policyTypeColumn} onValueChange={handlePolicyTypeColumnChange}>
                  <SelectTrigger id="policy-type" className="w-full max-w-[300px]">
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policy_type">policy_type</SelectItem>
                    <SelectItem value="type">type</SelectItem>
                    <SelectItem value="policy_category">policy_category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Line of Business */}
              <div className="mb-6">
                <Label htmlFor="business-line" className="mb-2">Line of Business</Label>
                <Select value={businessLineColumn} onValueChange={handleBusinessLineColumnChange}>
                  <SelectTrigger id="business-line" className="w-full max-w-[300px]">
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business_line">business_line</SelectItem>
                    <SelectItem value="line_of_business">line_of_business</SelectItem>
                    <SelectItem value="lob">lob</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* First Written Date */}
              <div className="mb-6">
                <Label htmlFor="date-written" className="mb-2">First Written Date</Label>
                <Select value={dateWrittenColumn} onValueChange={handleDateWrittenColumnChange}>
                  <SelectTrigger id="date-written" className="w-full max-w-[300px]">
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_written">date_written</SelectItem>
                    <SelectItem value="written_date">written_date</SelectItem>
                    <SelectItem value="first_written">first_written</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Expiration Date */}
              <div>
                <Label htmlFor="date-expires" className="mb-2">Expiration Date</Label>
                <Select value={dateExpiresColumn} onValueChange={handleDateExpiresColumnChange}>
                  <SelectTrigger id="date-expires" className="w-full max-w-[300px]">
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_expires">date_expires</SelectItem>
                    <SelectItem value="expiration_date">expiration_date</SelectItem>
                    <SelectItem value="expires_on">expires_on</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </DashboardLayout>
  );
} 