"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { subscriptionData } from "@/data/subscription";
import { useConfig } from "@/components/config-panel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Generate past months for the dropdown
const generatePastMonths = () => {
  const months = [];
  const currentDate = new Date(2025, 3); // April 2025 (month is 0-indexed)
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const value = `${monthName.toLowerCase()}-${year}`;
    const label = i === 0 ? `${monthName} ${year} (Current)` : `${monthName} ${year}`;
    
    months.push({
      value,
      label,
      monthName,
      year,
      isCurrent: i === 0
    });
  }
  
  return months;
};

export default function BillingPage() {
  // Get the showServicePlan and exceedRemarketingQuota states from config context
  const { showServicePlan, exceedRemarketingQuota } = useConfig();
  
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState("april-2025");
  const pastMonths = generatePastMonths();
  
  // Find the selected month data
  const currentMonthData = pastMonths.find(month => month.value === selectedMonth);
  const isCurrentMonth = currentMonthData?.isCurrent || false;
  
  // Current month details (for this prototype)
  const currentMonth = currentMonthData?.monthName || "April";
  const currentYear = currentMonthData?.year || 2025;
  const currentDate = `${currentMonth} 30, ${currentYear}`;
  
  // Monthly analyzed accounts (simulate different values for past months)
  const getMonthlyAnalyzedAccounts = (monthValue: string) => {
    const baseAccounts = 256;
    // Simulate variation in past months
    const variations: Record<string, number> = {
      "april-2025": 256,
      "march-2025": 234,
      "february-2025": 198,
      "january-2025": 267,
      "december-2024": 289,
      "november-2024": 245,
      "october-2024": 223,
      "september-2024": 201,
      "august-2024": 278,
      "july-2024": 234,
      "june-2024": 256,
      "may-2024": 189
    };
    return variations[monthValue] || baseAccounts;
  };
  
  const monthlyAnalyzedAccounts = getMonthlyAnalyzedAccounts(selectedMonth);
  
  // Calculate costs based on monthly analyzed accounts
  const corePlatformCost = subscriptionData.pricePerAccount * monthlyAnalyzedAccounts;
  // Only include service plan cost if showServicePlan is true
  const servicePlanCost = showServicePlan 
    ? corePlatformCost * (subscriptionData.servicePlanPercentage / 100) 
    : 0;
    
  // Calculate remarketing costs if over quota (based on annual quota from total accounts)
  const totalRemarketsAllowed = Math.round(subscriptionData.totalAccounts * (subscriptionData.remarketsPercentage / 100));
  const remarketingOverage = exceedRemarketingQuota ? 15 : 0; // Simulating 15 accounts over the annual limit
  const overageRate = 20; // $20 per additional remarket
  const remarketingOverageCost = remarketingOverage * overageRate;
  
  // Calculate total cost including any overages
  const totalCost = corePlatformCost + servicePlanCost + remarketingOverageCost;
  
  // Format currency with commas and round to nearest whole number
  const formatCurrency = (amount: number) => {
    return Math.round(amount).toLocaleString('en-US');
  };
  
  // Create a modified features list with simplified remarketing text
  const featuresWithRemarketing = subscriptionData.features.map(feature => {
    if (feature.name.includes('remarketing')) {
      return { 
        ...feature, 
        name: `${subscriptionData.remarketsPercentage}% of total accounts eligible for remarketing` 
      };
    }
    return feature;
  });
  
  // For the remarketing usage card, we'll show exceeded usage when the toggle is on
  const usedRemarketing = exceedRemarketingQuota 
    ? totalRemarketsAllowed + remarketingOverage 
    : Math.round(totalRemarketsAllowed * 0.75); // Using 75% of the annual quota for the demo
  const remarketingPercentage = exceedRemarketingQuota 
    ? 100 // Exactly 100% to show a completely full bar
    : (usedRemarketing / totalRemarketsAllowed) * 100;

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6 min-h-screen">
        <div className="max-w-[900px] mx-auto px-4 pb-10">
          <h1 className="text-base font-medium text-gray-900 mb-3">Billing</h1>
          
          {/* Consolidated Subscription Overview Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <div>
                  <CardTitle className="text-xl">Subscription Overview</CardTitle>
                  <CardDescription>{showServicePlan ? `${subscriptionData.plan} Plan` : 'Core Plan'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Cost Breakdown Section */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 w-full my-4">
                <div className="flex flex-col space-y-4">
                  {/* Month selector heading */}
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">Monthly Activity</h3>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-fit min-w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pastMonths.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isCurrentMonth ? `As of ${currentDate}` : `Final bill for ${currentMonth} ${currentYear}`}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-800 space-y-4 pt-2">
                    <div className="flex justify-between">
                      <span>Core Platform ({monthlyAnalyzedAccounts.toLocaleString()} accounts analyzed @ ${subscriptionData.pricePerAccount.toFixed(2)}/ea)</span>
                      <span className="font-medium">${formatCurrency(corePlatformCost)}</span>
                    </div>
                    {showServicePlan && (
                      <div className="flex justify-between">
                        <span>{subscriptionData.plan} Service ({subscriptionData.servicePlanPercentage}%)</span>
                        <span className="font-medium">${formatCurrency(servicePlanCost)}</span>
                      </div>
                    )}
                    
                    {/* Show remarketing overage costs when quota is exceeded, but with normal text color */}
                    {exceedRemarketingQuota && (
                      <div className="flex justify-between">
                        <span>Remarketing Overage ({remarketingOverage} accounts @ ${overageRate}/ea)</span>
                        <span className="font-medium">${formatCurrency(remarketingOverageCost)}</span>
                      </div>
                    )}
                    
                    {/* Total for current month so far */}
                    <div className="flex justify-between pt-3 border-t border-gray-200 font-medium text-gray-900">
                      <span>{isCurrentMonth ? `Total as of ${currentDate}` : `Total for ${currentMonth} ${currentYear}`}</span>
                      <span>${formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                  
                  {isCurrentMonth && (
                    <div className="mt-2 text-sm text-gray-500 italic">
                      Your final monthly bill will be based on the total accounts analyzed by the end of {currentMonth}.
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features Section - Divided into Core and Service Plan */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core Platform Features */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 mb-3">Core Platform Features</h3>
                    <div className="space-y-2">
                      {featuresWithRemarketing.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Service Plan Features - Only shown if showServicePlan is true */}
                  {showServicePlan && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-600 mb-3">{subscriptionData.plan} Service Features</h3>
                      <div className="space-y-2">
                        {subscriptionData.servicePlanFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-base font-medium text-gray-900 mb-3">Usage</h2>
          
          {/* Usage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Remarketing Usage Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Remarketing Quota</CardTitle>
                  <div className="text-sm text-gray-500">{currentYear}</div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Quota Details Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <div className="text-sm text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <span>Total accounts:</span>
                      <span className="font-medium">{subscriptionData.totalAccounts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual remarketing quota (12%):</span>
                      <span className="font-medium">{totalRemarketsAllowed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Usage Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm text-gray-500">Usage</div>
                    <div className="text-sm font-medium">
                      {usedRemarketing.toLocaleString()} / {totalRemarketsAllowed.toLocaleString()}
                    </div>
                  </div>
                  <Progress 
                    value={remarketingPercentage} 
                    className={`h-2 ${exceedRemarketingQuota ? 'bg-gray-100 [&>div]:bg-yellow-500' : 'bg-gray-100'}`}
                  />
                </div>
                
                {exceedRemarketingQuota ? (
                  <Alert variant="warning" className="mt-4 bg-yellow-50 border-yellow-200">
                    <AlertDescription>
                      You&apos;re <strong>{remarketingOverage}</strong> remarkets over your annual limit. Each additional remarket costs <strong>${overageRate}</strong>.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="info" className="mt-4 bg-blue-50 border-blue-200 [&>svg]:text-blue-600">
                    <AlertDescription>
                      Remarkets over your annual plan limit cost {subscriptionData.usage.remarketing.overage}.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 