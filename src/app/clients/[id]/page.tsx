"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { getClientById, getClientSummary, getHomeQuoteByClientId, getAutoQuoteByClientId } from '@/lib/data';
// Import all data for debugging
import homeQuotes from '@/data/homeQuotes.json';
import autoQuotes from '@/data/autoQuotes.json';

// Carrier logos as SVG components (placeholder with styling)
const FrontlineLogo = () => (
  <div className="flex items-center justify-center h-12">
    <Image 
      src="/frontline-logo.png" 
      alt="Frontline Insurance" 
      width={120} 
      height={40} 
      className="object-contain"
    />
  </div>
);

const ProgressiveLogo = () => (
  <div className="flex items-center justify-center h-12">
    <Image 
      src="/progressive-logo.png" 
      alt="Progressive Insurance" 
      width={120} 
      height={40} 
      className="object-contain"
    />
  </div>
);

const CitizensLogo = () => (
  <div className="flex items-center justify-center h-12">
    <Image 
      src="/citizens-logo.png" 
      alt="Citizens Insurance" 
      width={120} 
      height={40} 
      className="object-contain"
    />
  </div>
);

// Helper function to get carrier logo
const getCarrierLogo = (carrierName: string) => {
  switch (carrierName.toLowerCase()) {
    case 'frontline':
      return <FrontlineLogo />;
    case 'progressive':
      return <ProgressiveLogo />;
    case 'citizens':
      return <CitizensLogo />;
    default:
      return <div className="font-bold">{carrierName}</div>;
  }
};

export default function ClientPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clientId = params.id as string;
  const router = useRouter();
  
  // Get the tab from URL or default to 'summary'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'summary');
  
  // Get client data
  const client = getClientById(clientId);
  const clientSummary = getClientSummary(clientId);
  const homeQuote = getHomeQuoteByClientId(clientId);
  const autoQuote = getAutoQuoteByClientId(clientId);

  // DEBUGGING LOGS
  console.log('=== DEBUGGING CLIENT DATA ===');
  console.log('Client ID:', clientId, 'Type:', typeof clientId);
  console.log('Client data:', client);
  console.log('Client summary:', clientSummary);
  console.log('Home Quote data:', homeQuote);
  console.log('Auto Quote data:', autoQuote);
  console.log('ALL home quotes:', homeQuotes);
  console.log('ALL auto quotes:', autoQuotes);
  console.log('Home quotes clientIds:', homeQuotes.map(q => ({ id: q.id, clientId: q.clientId, type: typeof q.clientId })));
  console.log('Auto quotes clientIds:', autoQuotes.map(q => ({ id: q.id, clientId: q.clientId, type: typeof q.clientId })));
  console.log('=== END DEBUGGING ===');
  
  // Update the URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/clients/${clientId}?tab=${value}`, { scroll: false });
  };
  
  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-semibold">Client not found</h1>
          <Button className="mt-4" onClick={() => router.push('/')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        {/* Header with client name and navigation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{client.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Applicant ID: {client.applicantId}</span>
              <span>|</span>
              <span>Cancellation Risk: 
                <Badge 
                  variant={
                    client.cancellationRisk === 'High' ? 'destructive' : 
                    client.cancellationRisk === 'Medium' ? 'warning' : 
                    'secondary'
                  }
                  className="ml-2"
                >
                  {client.cancellationRisk}
                </Badge>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/clients/${Number(clientId) + 1}?tab=${activeTab}`}>
              <Button variant="outline" className="flex items-center gap-1">
                Next Client <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="homeAudit">Home Audit</TabsTrigger>
            <TabsTrigger value="autoAudit">Auto Audit</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab Content */}
          <TabsContent value="summary" className="space-y-4">
            {clientSummary && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Customer Profile & Interaction History</h2>
                      <p className="text-gray-700">{clientSummary.customerProfile}</p>
                      <p className="text-gray-700 mt-2">{clientSummary.interactionHistory}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Claims History</h2>
                      <ul className="list-disc pl-5 space-y-2">
                        {clientSummary.claimsHistory.map((claim, index) => (
                          <li key={index}>
                            <span className="font-medium">{claim.date} - {claim.type}</span>: {claim.description}, <span className="font-medium">${claim.amount.toLocaleString()}</span> payout for {claim.type.toLowerCase().includes('auto') ? 'vehicle' : 'property'} repairs.
                          </li>
                        ))}
                        {clientSummary.claimsHistory.length === 0 && (
                          <li>No claims history available.</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Reason for Remarket</h2>
                      <p className="text-gray-700">{clientSummary.reasonForRemarket}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Quotes Tab Content */}
          <TabsContent value="quotes">
            <div className="space-y-8">
              {(homeQuote || autoQuote) ? (
                <div>
                  
                  {/* Fixed width container for both the header and table */}
                  <div className="w-full relative">
                    {/* Fixed carrier headers outside the table */}
                    <div className="sticky top-0 z-10 bg-white border-b">
                      <div className="flex bg-gray-50">
                        {/* Coverage column space (empty in carrier header) */}
                        <div className="w-[300px] shrink-0"></div>
                        
                        {/* Carrier headers */}
                        {(homeQuote ? homeQuote.carriers : autoQuote?.carriers || []).map((carrier) => (
                          <div 
                            key={carrier.id}
                            className={`flex-1 text-center px-2 py-4 ${
                              carrier.name === 'Frontline' ? 'bg-[#eaecdb]' : 
                              carrier.name === 'Progressive' ? 'bg-[#d0dbe7]' : 
                              'bg-[#e9e8e6]'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <div className="mb-1">{getCarrierLogo(carrier.name)}</div>
                              <div className="text-lg font-bold mt-1">
                                ${carrier.premium}
                                {('term' in carrier) && typeof carrier.term === 'string' && (
                                  <span className="text-sm font-normal">/ {carrier.term}</span>
                                )}
                              </div>
                              <Button variant="outline" size="sm" className="mt-2 flex items-center gap-1">
                                Bind <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Column headers row - aligned to match table columns */}
                      <div className="flex bg-gray-50">
                        <div className="w-[300px] p-3 text-left font-medium text-gray-700 border-r border-l border-t shrink-0">
                          Coverage
                        </div>
                        
                        {(homeQuote ? homeQuote.carriers : autoQuote?.carriers || []).map((carrier) => (
                          <div key={`header-${carrier.id}`} className="flex-1 flex">
                            <div className="flex-1 p-3 text-right font-medium text-gray-700 border-t">Limit</div>
                            <div className="flex-1 p-3 text-right font-medium text-gray-700 border-t">Option</div>
                            <div className="flex-1 p-3 text-right font-medium text-gray-700 border-r border-t">Deductible</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Scrollable table content */}
                    <div className="overflow-x-auto">
                      <div className="w-full">
                        <div className="flex flex-col">
                          {/* Home Premium Group */}
                          {homeQuote && (
                            <>
                              {/* Home Premium Group Header */}
                              <div className="flex bg-gray-100 border-l border-r border-b">
                                <div className="w-full p-3 font-semibold">
                                  Home
                                </div>
                              </div>
                              
                              {/* First group in correct order */}
                              {[
                                // Get coverages in specific order with exact names
                                ...['Dwelling (Coverage A)', 'Other structures (Coverage B)', 'Personal Property', 'Loss Of Use (Coverage D)', 'Personal Liability (Coverage E)', 'Medical Payments']
                                  .map(coverageType => 
                                    homeQuote.carriers[0].coverages.find(c => c.type === coverageType)
                                  )
                                  .filter(Boolean) // Remove any undefined items
                              ].map((coverage, index) => (
                                <div key={`home-group1-${index}`} className="flex bg-white border-b">
                                  <div className="w-[300px] p-3 font-medium border-r border-l whitespace-nowrap shrink-0">
                                    {coverage?.type || ''}
                                  </div>
                                  {homeQuote.carriers.map((carrier) => {
                                    const carrierCoverage = coverage?.type ? carrier.coverages.find(c => c.type === coverage.type) : undefined;
                                    return (
                                      <div key={`${carrier.id}-${coverage?.type || index}`} className="flex-1 flex">
                                        <div className="flex-1 p-3 text-right whitespace-nowrap">
                                          {typeof carrierCoverage?.limit === 'number' 
                                            ? `$${carrierCoverage.limit.toLocaleString()}` 
                                            : carrierCoverage?.limit 
                                              ? carrierCoverage.limit.toString().includes('%') 
                                                ? carrierCoverage.limit 
                                                : `$${carrierCoverage.limit}`
                                              : '-'}
                                        </div>
                                        <div className="flex-1 p-3 text-right whitespace-nowrap">
                                          {carrierCoverage?.option 
                                            ? carrierCoverage.option.toString().includes('%')
                                              ? carrierCoverage.option
                                              : isNaN(Number(carrierCoverage.option))
                                                ? carrierCoverage.option
                                                : `$${carrierCoverage.option}`
                                            : '-'}
                                        </div>
                                        <div className="flex-1 p-3 text-right whitespace-nowrap border-r">
                                          {carrierCoverage?.deductible 
                                            ? carrierCoverage.deductible.toString().includes('%')
                                              ? carrierCoverage.deductible
                                              : isNaN(Number(carrierCoverage.deductible))
                                                ? carrierCoverage.deductible
                                                : `$${carrierCoverage.deductible}`
                                            : '-'}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
 
                              {/* Empty spacer row - adding visual gap after Medical Payments */}
                              <div className="flex h-10 bg-gray-50 border-b">
                                <div className="w-[300px] shrink-0"></div>
                                {(homeQuote ? homeQuote.carriers : autoQuote?.carriers || []).map((carrier) => (
                                  <div key={`gap-${carrier.id}`} className="flex-1 flex">
                                    <div className="flex-1"></div>
                                    <div className="flex-1"></div>
                                    <div className="flex-1"></div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Second group: Additional coverages */}
                              {[
                                // Get coverages in specific order
                                ...['Debris Removal', 'Hurricane', 'Building Ordinance or Law Coverage', 'Business Property Away From Home', 'Mold Coverage', 'Unscheduled Jewelry, Watches, Furs']
                                  .map(coverageType => 
                                    homeQuote.carriers[0].coverages.find(c => c.type === coverageType || c.type.includes(coverageType))
                                  )
                                  .filter(Boolean) // Remove any undefined items
                              ].map((coverage, index) => (
                                <div key={`home-group2-${index}`} className="flex bg-white border-b">
                                  <div className="w-[300px] p-3 font-medium border-r border-l whitespace-nowrap shrink-0">
                                    {coverage?.type || ''}
                                  </div>
                                  {homeQuote.carriers.map((carrier) => {
                                    const carrierCoverage = coverage?.type ? carrier.coverages.find(c => c.type === coverage.type) : undefined;
                                    return (
                                      <div key={`${carrier.id}-${coverage?.type || index}`} className="flex-1 flex">
                                        <div className="flex-1 p-3 text-right whitespace-nowrap">
                                          {typeof carrierCoverage?.limit === 'number' 
                                            ? `$${carrierCoverage.limit.toLocaleString()}` 
                                            : carrierCoverage?.limit 
                                              ? carrierCoverage.limit.toString().includes('%') 
                                                ? carrierCoverage.limit 
                                                : `$${carrierCoverage.limit}`
                                              : '-'}
                                        </div>
                                        <div className="flex-1 p-3 text-right whitespace-nowrap">
                                          {carrierCoverage?.option 
                                            ? carrierCoverage.option.toString().includes('%')
                                              ? carrierCoverage.option
                                              : isNaN(Number(carrierCoverage.option))
                                                ? carrierCoverage.option
                                                : `$${carrierCoverage.option}`
                                            : '-'}
                                        </div>
                                        <div className="flex-1 p-3 text-right whitespace-nowrap border-r">
                                          {carrierCoverage?.deductible 
                                            ? carrierCoverage.deductible.toString().includes('%')
                                              ? carrierCoverage.deductible
                                              : isNaN(Number(carrierCoverage.deductible))
                                                ? carrierCoverage.deductible
                                                : `$${carrierCoverage.deductible}`
                                            : '-'}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </>
                          )}
                          
                          {/* Add another gap row before Auto Premium */}
                          {homeQuote && autoQuote && (
                            <div className="flex h-10 bg-gray-50">
                              <div className="w-[300px] shrink-0"></div>
                              {(homeQuote ? homeQuote.carriers : autoQuote?.carriers || []).map((carrier) => (
                                <div key={`gap-auto-${carrier.id}`} className="flex-1 flex">
                                  <div className="flex-1"></div>
                                  <div className="flex-1"></div>
                                  <div className="flex-1"></div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Auto Premium Group */}
                          {autoQuote && (
                            <>
                              {/* Auto Premium Group Header */}
                              <div className="flex bg-gray-100 border-l border-r border-b border-t">
                                <div className="w-full p-3 font-semibold">
                                  Auto
                                </div>
                              </div>
                              
                              {/* Auto coverages */}
                              {autoQuote.carriers[0].coverages.map((coverage, index) => (
                                <div key={`auto-${index}`} className="flex bg-white border-b">
                                  <div className="w-[300px] p-3 font-medium border-r border-l whitespace-nowrap shrink-0">
                                    {coverage.type}
                                  </div>
                                  {autoQuote.carriers.map((carrier) => {
                                    const carrierCoverage = carrier.coverages[index];
                                    return (
                                      <div key={`${carrier.id}-${index}`} className="flex-1 flex">
                                        <div className="flex-1 p-3 text-right whitespace-nowrap">
                                          {typeof carrierCoverage?.limit === 'number' 
                                            ? `$${carrierCoverage.limit.toLocaleString()}` 
                                            : carrierCoverage?.limit 
                                              ? carrierCoverage.limit.toString().includes('%') 
                                                ? carrierCoverage.limit 
                                                : `$${carrierCoverage.limit}`
                                              : '-'}
                                        </div>
                                        <div className="flex-1 p-3 text-right whitespace-nowrap">
                                          {carrierCoverage?.option 
                                            ? carrierCoverage.option.toString().includes('%')
                                              ? carrierCoverage.option
                                              : isNaN(Number(carrierCoverage.option))
                                                ? carrierCoverage.option
                                                : `$${carrierCoverage.option}`
                                            : '-'}
                                        </div>
                                        <div className="flex-1 p-3 text-right whitespace-nowrap border-r">
                                          {carrierCoverage?.deductible 
                                            ? carrierCoverage.deductible.toString().includes('%')
                                              ? carrierCoverage.deductible
                                              : isNaN(Number(carrierCoverage.deductible))
                                                ? carrierCoverage.deductible
                                                : `$${carrierCoverage.deductible}`
                                            : '-'}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-500">No quotes available for this client.</p>
                  <pre className="mt-4 text-left bg-gray-100 p-4 rounded text-xs overflow-auto">
                    Client ID: {clientId} (Type: {typeof clientId})<br/>
                    Available Home Quote IDs: {JSON.stringify(homeQuotes.map(q => ({ id: q.id, clientId: q.clientId })), null, 2)}<br/>
                    Available Auto Quote IDs: {JSON.stringify(autoQuotes.map(q => ({ id: q.id, clientId: q.clientId })), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Home Audit Tab Content */}
          <TabsContent value="homeAudit">
            <div className="space-y-6">
              <p>Home audit details will be implemented later.</p>
            </div>
          </TabsContent>
          
          {/* Auto Audit Tab Content */}
          <TabsContent value="autoAudit">
            <div className="space-y-6">
              <p>Auto audit details will be implemented later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 