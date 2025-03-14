"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { getClients } from "@/lib/data";

// Define the type for our data
type RiskData = {
  id: string;
  name: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  reason: string;
  renewalDate: string;
  dateAdded: string;
  premium: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState({ column: 'name', direction: 'asc' });
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  // Get clients data
  const clientsData = getClients();

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData.map(item => item.name));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (name: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, name]);
    } else {
      setSelectedRows(prev => prev.filter(row => row !== name));
    }
  };

  const handleRowClick = (clientId: string) => {
    router.push(`/clients/${clientId}?tab=quotes`);
  };

  const sortedData = [...clientsData].sort((a, b) => {
    const direction = sorting.direction === 'asc' ? 1 : -1;
    const aValue = a[sorting.column as keyof RiskData];
    const bValue = b[sorting.column as keyof RiskData];
    
    if (typeof aValue === 'string') {
      return direction * aValue.localeCompare(String(bValue));
    }
    return direction * (Number(aValue) - Number(bValue));
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        {/* Header with company name */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">CJ Insurance Group</h1>
        </div>

        {/* Weekly Insights Section */}
        <div className="mb-3">
          <h2 className="text-base font-medium">Weekly Insights</h2>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Policies Saved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">19</div>
              <p className="text-xs text-gray-500">+0.8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Commission Retained</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">$10.1k</div>
              <p className="text-xs text-gray-500">+0.8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">93%</div>
              <p className="text-xs text-gray-500">+0.8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Cancel Reason</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xl font-bold">Change with Property</div>
              <p className="text-xs text-gray-500">Last Month: Rate Increase</p>
            </CardContent>
          </Card>
        </div>

        {/* At Risk Renewals Table */}
        <div className="space-y-3">
          {/* Header with title and download button - now outside any container */}
          <div className="flex justify-between items-center">
            <h2 className="text-base font-medium">Remarkets Ready for Review</h2>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>

          {/* Table with updated styling */}
          <div className="rounded-lg border overflow-hidden">
            <Table className="bg-white">
              <TableHeader className="bg-gray-50">
                <TableRow className="h-12">
                  <TableHead className="w-12 p-0">
                    <div className="h-12 w-12 flex items-center justify-center">
                      <Checkbox 
                        checked={selectedRows.length === sortedData.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                  </TableHead>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'riskLevel', label: 'Risk Level' },
                    { key: 'reason', label: 'Reason' },
                    { key: 'renewalDate', label: 'Renewal Date' },
                    { key: 'dateAdded', label: 'Date Added' },
                    { key: 'premium', label: 'Premium At-Risk', align: 'right' }
                  ].map(({ key, label, align }) => (
                    <TableHead 
                      key={key}
                      onClick={() => handleSort(key)}
                      className={`border-l cursor-pointer group ${
                        sorting.column === key ? 'bg-orange-50' : ''
                      } ${align === 'right' ? 'text-right' : ''}`}
                    >
                      <div
                        className={`flex items-center justify-between w-full ${
                          sorting.column === key 
                            ? 'text-primary font-medium' 
                            : 'text-gray-600 group-hover:text-foreground'
                        }`}
                      >
                        <span>{label}</span>
                        <ArrowUpDown 
                          className={`h-3.5 w-3.5 ml-2 transition-transform ${
                            sorting.column === key
                              ? sorting.direction === 'asc'
                                ? 'text-primary'
                                : 'text-primary rotate-180'
                              : 'text-muted-foreground/50 group-hover:text-muted-foreground'
                          }`}
                        />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow 
                    key={item.id}
                    className="h-12 hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleRowClick(item.id)}
                  >
                    <TableCell 
                      className="w-12 p-0"
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on checkbox
                    >
                      <div className="h-12 w-12 flex items-center justify-center">
                        <Checkbox 
                          checked={selectedRows.includes(item.name)}
                          onCheckedChange={(checked) => handleSelectRow(item.name, checked as boolean)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.riskLevel === 'High' ? 'destructive' : 
                          item.riskLevel === 'Medium' ? 'warning' : 
                          'secondary'
                        }
                      >
                        {item.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>{item.renewalDate}</TableCell>
                    <TableCell>{item.dateAdded}</TableCell>
                    <TableCell className="text-right">${item.premium.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
              <Button variant="outline" size="sm" className="text-gray-600">Previous</Button>
              <Button variant="outline" size="sm" className="text-gray-600">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
