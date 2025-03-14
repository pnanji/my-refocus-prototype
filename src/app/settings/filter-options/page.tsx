"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
  isNew?: boolean;
}

export default function FilterOptionsSettings() {
  // Policy Status options
  const [policyStatusOptions, setPolicyStatusOptions] = useState<FilterOption[]>([
    { id: "active", label: "Active", checked: true },
    { id: "cancelled", label: "Cancelled", checked: true },
    { id: "renewed", label: "Renewed", checked: true },
  ]);

  // Policy Type options
  const [policyTypeOptions, setPolicyTypeOptions] = useState<FilterOption[]>([
    { id: "commercial", label: "Commercial", checked: true },
    { id: "personal", label: "Personal", checked: true },
    { id: "etc", label: "Etc", checked: true },
  ]);

  // Line of Business options
  const [lineOfBusinessOptions, setLineOfBusinessOptions] = useState<FilterOption[]>([
    { id: "auto", label: "Auto", checked: true, isNew: true },
    { id: "home", label: "Dashboard", checked: true },
    { id: "earthquake", label: "Earthquake", checked: true },
    { id: "etc", label: "Etc.", checked: true },
  ]);

  // State for tracking form changes
  const [hasChanges, setHasChanges] = useState(false);

  // Handle checkbox changes for Policy Status
  const handlePolicyStatusChange = (id: string, checked: boolean) => {
    setPolicyStatusOptions(
      policyStatusOptions.map((option) =>
        option.id === id ? { ...option, checked } : option
      )
    );
    setHasChanges(true);
  };

  // Handle checkbox changes for Policy Type
  const handlePolicyTypeChange = (id: string, checked: boolean) => {
    setPolicyTypeOptions(
      policyTypeOptions.map((option) =>
        option.id === id ? { ...option, checked } : option
      )
    );
    setHasChanges(true);
  };

  // Handle checkbox changes for Line of Business
  const handleLineOfBusinessChange = (id: string, checked: boolean) => {
    setLineOfBusinessOptions(
      lineOfBusinessOptions.map((option) =>
        option.id === id ? { ...option, checked } : option
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real implementation, this would save data to backend
    toast.success("Filter options saved successfully");
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
              Agency Settings
            </Link>
          </div>
          
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-base font-medium text-foreground">Filter Options</h1>
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

          {/* Main content card */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-foreground">
                  Select which types of policies to include in your analysis and prediction model. Excluded
                  options will be completely removed from consideration.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Policy Status Section */}
                  <div>
                    <h2 className="text-sm font-medium text-foreground bg-gray-100 p-4 rounded-md mb-3 h-9 flex items-center">Policy Status</h2>
                    <div className="space-y-3 px-4">
                      {policyStatusOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`policy-status-${option.id}`}
                            checked={option.checked}
                            onCheckedChange={(checked) => 
                              handlePolicyStatusChange(option.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`policy-status-${option.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Policy Type Section */}
                  <div>
                    <h2 className="text-sm font-medium text-foreground bg-gray-100 p-4 rounded-md mb-3 h-9 flex items-center">Policy Type</h2>
                    <div className="space-y-3 px-4">
                      {policyTypeOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`policy-type-${option.id}`}
                            checked={option.checked}
                            onCheckedChange={(checked) => 
                              handlePolicyTypeChange(option.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`policy-type-${option.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Line of Business Section */}
                  <div>
                    <h2 className="text-sm font-medium text-foreground bg-gray-100 p-4 rounded-md mb-3 h-9 flex items-center">Line of Business</h2>
                    <div className="space-y-3 px-4">
                      {lineOfBusinessOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`line-of-business-${option.id}`}
                            checked={option.checked}
                            onCheckedChange={(checked) => 
                              handleLineOfBusinessChange(option.id, checked as boolean)
                            }
                          />
                          <div className="flex items-center">
                            <Label
                              htmlFor={`line-of-business-${option.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option.label}
                            </Label>
                            {option.isNew && (
                              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-sm font-medium">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column - What do other agencies typically exclude */}
                <div className="bg-gray-100 rounded-md self-start">
                  <div className="p-4">
                    <div className="flex items-start mb-4">
                      <Info className="h-4 w-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                      <h2 className="text-sm font-medium text-gray-600">
                        What do other agencies typically exclude?
                      </h2>
                    </div>

                    <div className="space-y-4 pl-6">
                      {/* Policy Status Info */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Policy Status</h3>
                        <p className="text-sm text-gray-600">
                          Most agencies include all their policy status values.
                        </p>
                      </div>

                      {/* Policy Type Info */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Policy Type</h3>
                        <p className="text-sm text-gray-600">
                          Some agencies prefer to exclude commercial and focus on personal lines.
                        </p>
                      </div>

                      {/* Line of Business Info */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Line of Business</h3>
                        <p className="text-sm text-gray-600">
                          Some also exclude specialty lines with low volume.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </DashboardLayout>
  );
} 