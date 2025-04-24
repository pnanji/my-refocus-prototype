"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { subscriptionData } from "@/data/subscription";
import { useConfig } from "@/components/config-panel";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BillingPage() {
  // Get the showServicePlan and exceedRemarketingQuota states from config context
  const { showServicePlan, exceedRemarketingQuota } = useConfig();
  
  // Calculate costs
  const corePlatformCost = subscriptionData.pricePerAccount * subscriptionData.totalAccounts;
  // Only include service plan cost if showServicePlan is true
  const servicePlanCost = showServicePlan 
    ? corePlatformCost * (subscriptionData.servicePlanPercentage / 100) 
    : 0;
    
  // Calculate remarketing costs if over quota
  const totalRemarketsAllowed = Math.round(subscriptionData.totalAccounts * (subscriptionData.remarketsPercentage / 100));
  const remarketingOverage = exceedRemarketingQuota ? 50 : 0; // Simulating 50 accounts over the limit
  const overageRate = 20; // $20 per additional remarket
  const remarketingOverageCost = remarketingOverage * overageRate;
  
  // Calculate total cost including any overages
  const totalCost = corePlatformCost + servicePlanCost + remarketingOverageCost;
  
  // Format currency with commas and round to nearest whole number
  const formatCurrency = (amount: number) => {
    return Math.round(amount).toLocaleString('en-US');
  };
  
  // Create a modified features list with the calculated remarketing accounts
  const featuresWithRemarketing = subscriptionData.features.map(feature => {
    if (feature.name.includes('remarketing')) {
      return { 
        ...feature, 
        name: `${subscriptionData.remarketsPercentage}% of accounts eligible for remarketing (${totalRemarketsAllowed.toLocaleString()} accounts)` 
      };
    }
    return feature;
  });
  
  // Combine key features for the overview card - only include service plan features if showServicePlan is true
  const keyFeatures = showServicePlan 
    ? [...featuresWithRemarketing, ...subscriptionData.servicePlanFeatures]
    : [...featuresWithRemarketing];
    
  // For the remarketing usage card, we'll show exceeded usage when the toggle is on
  const usedRemarketing = exceedRemarketingQuota 
    ? totalRemarketsAllowed + remarketingOverage 
    : subscriptionData.usage.remarketing.used;
  const remarketingPercentage = exceedRemarketingQuota 
    ? 120 // Over 100% to show it's exceeded
    : (subscriptionData.usage.remarketing.used / totalRemarketsAllowed) * 100;

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
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-bold text-gray-900">${formatCurrency(totalCost)}<span className="text-sm font-normal text-gray-500">/year</span></div>
                  <div className="text-sm text-gray-500">Next bill: {subscriptionData.nextBillingDate}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Cost Breakdown Section */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 w-full my-4">
                <div className="text-sm text-gray-800 space-y-4">
                  <div className="flex justify-between">
                    <span>Core Platform ({subscriptionData.totalAccounts.toLocaleString()} accounts @ ${subscriptionData.pricePerAccount.toFixed(2)}/ea)</span>
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
                </div>
              </div>

              {/* Key Features Section */}
              <div>
                 <h3 className="text-sm font-medium text-gray-600 mb-3">Key Features Included</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                   {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                  ))}
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
                <CardTitle>Remarketing Quota</CardTitle>
                <CardDescription>Track your remarketing usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div></div>
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
                      You&apos;re <strong>{remarketingOverage}</strong> accounts over your limit. Each additional account costs {subscriptionData.usage.remarketing.overage}.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="info" className="mt-4 bg-gray-50 border-gray-200 [&>svg]:text-gray-500">
                    <AlertDescription>
                      Each additional remarketing over your plan limit will cost {subscriptionData.usage.remarketing.overage}.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {/* Custom Rules Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Custom Rules</CardTitle>
                <CardDescription>Custom rules for AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div></div>
                    <div className="text-sm font-medium">
                      {subscriptionData.usage.customRules.used} / {subscriptionData.usage.customRules.total}
                    </div>
                  </div>
                  <Progress 
                    value={(subscriptionData.usage.customRules.used / subscriptionData.usage.customRules.total) * 100} 
                    className="h-2 bg-gray-100"
                  />
                </div>
                
                <Alert variant="info" className="mt-4 bg-gray-50 border-gray-200 [&>svg]:text-gray-500">
                  <AlertDescription>
                    Need more than {subscriptionData.usage.customRules.total} custom rules? Add unlimited rules for {subscriptionData.usage.customRules.addonPrice}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 