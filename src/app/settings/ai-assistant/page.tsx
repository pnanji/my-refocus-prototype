"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// Define rule types
interface RuleInput {
  id: string;
  type: "number" | "text" | "select";
  value: string | number;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
}

interface Rule {
  id: string;
  category: "home" | "auto";
  text: string;
  inputs: RuleInput[];
  isActive: boolean;
  isDefault?: boolean;
}

export default function AIAssistantSettings() {
  // State for active (selected) rules
  const [activeRules, setActiveRules] = useState<Rule[]>([
    {
      id: "home-roof-age-less",
      category: "home",
      text: "If roof age or last roof update is unknown and the home was built {0} years ago or less, assume no roof update and set roof age to the year built.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 15,
          min: 1,
          max: 100,
        },
      ],
      isActive: true,
      isDefault: true,
    },
    {
      id: "home-roof-age-more",
      category: "home",
      text: "If roof age or last roof update is unknown and the home was built more than {0} years ago, assume a full roof replacement and set roof age to current year minus {1}.",
      inputs: [
        {
          id: "years-threshold",
          type: "number",
          value: 15,
          min: 1,
          max: 100,
        },
        {
          id: "years-subtract",
          type: "number",
          value: 10,
          min: 1,
          max: 50,
        },
      ],
      isActive: true,
      isDefault: true,
    },
    {
      id: "auto-license-age",
      category: "auto",
      text: "If age first licensed is unknown, assume the client was licensed at age {0}.",
      inputs: [
        {
          id: "age",
          type: "number",
          value: 16,
          min: 16,
          max: 25,
        },
      ],
      isActive: true,
      isDefault: true,
    },
  ]);

  // All available rules in the library
  const [ruleLibrary, setRuleLibrary] = useState<Rule[]>([
    // Home rules
    {
      id: "home-air-conditioning",
      category: "home",
      text: "If air conditioning type is unknown, assume the home has {0}.",
      inputs: [
        {
          id: "ac-type",
          type: "select",
          value: "central air conditioning with shared ducts",
          options: [
            "central air conditioning with shared ducts",
            "central air conditioning with separate ducts",
            "window units",
            "no air conditioning",
          ],
        },
      ],
      isActive: false,
    },
    {
      id: "home-financial-interest",
      category: "home",
      text: "If financial interest information is unknown, assume the home has {0} financial interest.",
      inputs: [
        {
          id: "interest-count",
          type: "select",
          value: "one",
          options: ["one", "two", "three", "no"],
        },
      ],
      isActive: false,
    },
    {
      id: "home-mortgage",
      category: "home",
      text: "If mortgage details are unknown, assume there is only one mortgage.",
      inputs: [],
      isActive: false,
    },
    {
      id: "home-residence-years",
      category: "home",
      text: "If years at residence is unknown, assume client has lived there for {0} years.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 5,
          min: 1,
          max: 50,
        },
      ],
      isActive: false,
    },
    {
      id: "home-purchase-date",
      category: "home",
      text: "If date home was purchased is unknown, assume current year minus {0}.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 5,
          min: 1,
          max: 50,
        },
      ],
      isActive: false,
    },
    {
      id: "home-fire-alarm",
      category: "home",
      text: "If fire alarm system is unknown, assume {0}.",
      inputs: [
        {
          id: "has-alarm",
          type: "select",
          value: "none",
          options: ["none", "local smoke detectors", "central fire alarm"],
        },
      ],
      isActive: false,
    },
    {
      id: "home-sprinkler",
      category: "home",
      text: "If sprinkler system is unknown, assume {0}.",
      inputs: [
        {
          id: "has-sprinkler",
          type: "select",
          value: "none",
          options: ["none", "local sprinklers", "central sprinkler system"],
        },
      ],
      isActive: false,
    },
    {
      id: "home-property-coverage",
      category: "home",
      text: "If years of continuous property coverage is unknown, assume {0} years.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 2,
          min: 0,
          max: 50,
        },
      ],
      isActive: false,
    },
    {
      id: "home-insurance-carrier",
      category: "home",
      text: "If years with current home insurance carrier is unknown, assume {0} years.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 2,
          min: 0,
          max: 50,
        },
      ],
      isActive: false,
    },
    {
      id: "home-deductible",
      category: "home",
      text: "If general or all perils deductible is unknown, enter a value of ${0}.",
      inputs: [
        {
          id: "amount",
          type: "number",
          value: 2500,
          min: 500,
          max: 10000,
        },
      ],
      isActive: false,
    },
    {
      id: "home-windstorm-deductible",
      category: "home",
      text: "If windstorm or hail deductible is unknown, enter a value of {0}%.",
      inputs: [
        {
          id: "percentage",
          type: "number",
          value: 1,
          min: 1,
          max: 10,
        },
      ],
      isActive: false,
    },
    {
      id: "home-optional-coverage",
      category: "home",
      text: "If an optional coverage is presented but not found on the client's current policy, select \"None\" or the lowest available limit if required.",
      inputs: [],
      isActive: false,
    },
    // Auto rules
    {
      id: "auto-commute-distance",
      category: "auto",
      text: "If commute distance is unknown, assume a one-way commute of {0} miles.",
      inputs: [
        {
          id: "miles",
          type: "number",
          value: 10,
          min: 1,
          max: 100,
        },
      ],
      isActive: false,
    },
    {
      id: "auto-mileage",
      category: "auto",
      text: "If annual mileage is unknown, assume {0} miles per year.",
      inputs: [
        {
          id: "miles",
          type: "number",
          value: 12000,
          min: 1000,
          max: 50000,
        },
      ],
      isActive: false,
    },
    {
      id: "auto-telematics",
      category: "auto",
      text: "If desire for participation in a telematics program is unknown, assume {0}.",
      inputs: [
        {
          id: "participation",
          type: "select",
          value: "No",
          options: ["No", "Yes"],
        },
      ],
      isActive: false,
    },
    {
      id: "auto-ownership",
      category: "auto",
      text: "If vehicle ownership status is unknown, assume the vehicle is {0}.",
      inputs: [
        {
          id: "ownership",
          type: "select",
          value: "owned (no lease, no loan)",
          options: ["owned (no lease, no loan)", "leased", "financed"],
        },
      ],
      isActive: false,
    },
    {
      id: "auto-purchase-date",
      category: "auto",
      text: "If vehicle purchase date is unknown, assume current year minus {0}.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 3,
          min: 0,
          max: 20,
        },
      ],
      isActive: false,
    },
    {
      id: "auto-year-licensed",
      category: "auto",
      text: "If a year is required for age first licensed, use the client's date of birth plus {0}.",
      inputs: [
        {
          id: "years",
          type: "number",
          value: 16,
          min: 16,
          max: 25,
        },
      ],
      isActive: false,
    },
    {
      id: "auto-license-revoked",
      category: "auto",
      text: "If asked whether a driver's license was revoked in the past 5 years, always answer \"No.\"",
      inputs: [],
      isActive: false,
    },
    {
      id: "auto-vehicle-use",
      category: "auto",
      text: "If vehicle use is unknown, assume the vehicle is used for {0}.",
      inputs: [
        {
          id: "use-type",
          type: "select",
          value: "commuting to work or school",
          options: ["commuting to work or school", "pleasure", "business", "farm"],
        },
      ],
      isActive: false,
    },
    {
      id: "auto-optional-coverage",
      category: "auto",
      text: "If a coverage is presented but not found on the client's current policy, select \"None\" or the lowest available limit if required.",
      inputs: [],
      isActive: false,
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  // Function to render rule text with input fields for active rules
  const renderActiveRuleText = (rule: Rule) => {
    // If there are no inputs, just return the text
    if (rule.inputs.length === 0) {
      return <p className="text-gray-700 leading-relaxed">{rule.text}</p>;
    }

    // Split the text by the placeholders {0}, {1}, etc.
    const parts = rule.text.split(/\{(\d+)\}/);

    return (
      <p className="text-gray-700 leading-relaxed">
        {parts.map((part, index) => {
          // If the index is even, it's text
          if (index % 2 === 0) {
            return <span key={index}>{part}</span>;
          }
          
          // If the index is odd, it's a placeholder
          const inputIndex = parseInt(part, 10);
          const input = rule.inputs[inputIndex];
          
          if (!input) return null;
          
          // Render the appropriate input type
          if (input.type === "number") {
            return (
              <Input
                key={index}
                type="number"
                value={input.value}
                min={input.min}
                max={input.max}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const updatedRules = activeRules.map(r => 
                    r.id === rule.id 
                      ? {
                          ...r,
                          inputs: r.inputs.map((inp, idx) => 
                            idx === inputIndex ? { ...inp, value } : inp
                          )
                        }
                      : r
                  );
                  
                  setActiveRules(updatedRules);
                  setHasChanges(true);
                }}
                className="inline-block w-16 h-8 mx-1 align-baseline [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            );
          } else if (input.type === "select") {
            return (
              <span key={index} className="inline-block mx-1 align-baseline">
                <Select
                  value={input.value.toString()}
                  onValueChange={(value) => {
                    const updatedRules = activeRules.map(r =>
                      r.id === rule.id
                        ? {
                            ...r,
                            inputs: r.inputs.map((inp, idx) =>
                              idx === inputIndex ? { ...inp, value } : inp
                            )
                          }
                        : r
                    );
                    
                    setActiveRules(updatedRules);
                    setHasChanges(true);
                  }}
                >
                  <SelectTrigger className="h-8 min-w-40 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {input.options?.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
            );
          }
          
          return null;
        })}
      </p>
    );
  };

  // Function to render rule text with highlighted inputs for library rules
  const renderLibraryRuleText = (rule: Rule) => {
    // If there are no inputs, just return the text
    if (rule.inputs.length === 0) {
      return <p className="text-gray-700 leading-relaxed">{rule.text}</p>;
    }

    // Split the text by the placeholders {0}, {1}, etc.
    const parts = rule.text.split(/\{(\d+)\}/);

    // Build the JSX with highlighted parts
    let result = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Text part
        result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      } else {
        // Placeholder part
        const inputIndex = parseInt(parts[i], 10);
        const input = rule.inputs[inputIndex];
        
        if (input) {
          result.push(
            <span key={`input-${i}`} className="text-amber-600 font-medium">
              {input.value}
            </span>
          );
        }
      }
    }

    return <p className="text-gray-700 leading-relaxed">{result}</p>;
  };

  // Add a rule to active rules
  const addRule = (rule: Rule) => {
    // Check if already active
    if (activeRules.some(r => r.id === rule.id)) return;

    // Add to active rules
    setActiveRules([...activeRules, { ...rule, isActive: true }]);
    
    // Update library status
    setRuleLibrary(
      ruleLibrary.map(r => r.id === rule.id ? { ...r, isActive: true } : r)
    );
    
    setHasChanges(true);
  };

  // Remove a rule from active rules
  const removeRule = (ruleId: string) => {
    // Filter out the rule from active rules
    setActiveRules(activeRules.filter(r => r.id !== ruleId));
    
    // Update library status
    setRuleLibrary(
      ruleLibrary.map(r => r.id === ruleId ? { ...r, isActive: false } : r)
    );
    
    setHasChanges(true);
  };

  // Save changes
  const handleSave = () => {
    // In a real implementation, this would send the data to the server
    toast.success("AI assistant rules saved successfully");
    setHasChanges(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="max-w-[960px] mx-auto w-full px-4 py-6 pb-10 flex-1 relative">
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-medium text-gray-900">AI Assistant Personalization</h1>
              <p className="text-sm text-gray-500">
                Customize instructions for your AI assistant to follow your agency's workflows
              </p>
            </div>
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

          {/* Home Quote Rules Card */}
          <div className="bg-white border rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Home Quote Rules</h2>
            
            {activeRules.filter(rule => rule.category === "home").length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No home quote rules have been added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRules
                  .filter(rule => rule.category === "home")
                  .map(rule => (
                    <div 
                      key={rule.id} 
                      className="bg-gray-100 rounded-lg p-4 pr-10 relative"
                    >
                      {renderActiveRuleText(rule)}
                      <button 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                        onClick={() => removeRule(rule.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Auto Quote Rules Card */}
          <div className="bg-white border rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Auto Quote Rules</h2>
            
            {activeRules.filter(rule => rule.category === "auto").length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No auto quote rules have been added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRules
                  .filter(rule => rule.category === "auto")
                  .map(rule => (
                    <div 
                      key={rule.id} 
                      className="bg-gray-100 rounded-lg p-4 pr-10 relative"
                    >
                      {renderActiveRuleText(rule)}
                      <button 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                        onClick={() => removeRule(rule.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right sidebar with rule library - fixed position */}
        <div className="fixed top-0 right-0 w-[420px] h-screen bg-white border-l border-gray-200 z-10 overflow-y-auto">
          <div className="p-6 pb-20">
            <div className="sticky top-0 pt-2 bg-white">
              <h2 className="text-lg font-medium text-gray-900">Rule Library</h2>
              <p className="text-sm text-gray-500 mt-1 mb-3">Click on any rule to add it to your active rules list</p>
              <div className="border-b border-gray-200 -mx-6"></div>
            </div>
            
            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Home Quote Rules</h3>
            <div className="space-y-4 mb-6">
              {ruleLibrary
                .filter(rule => rule.category === "home" && !rule.isActive)
                .map(rule => (
                  <div 
                    key={rule.id} 
                    className="border border-gray-200 rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => addRule(rule)}
                  >
                    {renderLibraryRuleText(rule)}
                  </div>
                ))}
            </div>
            
            <div className="border-b border-gray-200 -mx-6 my-6"></div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Auto Quote Rules</h3>
            <div className="space-y-4">
              {ruleLibrary
                .filter(rule => rule.category === "auto" && !rule.isActive)
                .map(rule => (
                  <div 
                    key={rule.id} 
                    className="border border-gray-200 rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => addRule(rule)}
                  >
                    {renderLibraryRuleText(rule)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </DashboardLayout>
  );
} 