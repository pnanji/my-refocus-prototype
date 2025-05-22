"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ChevronDown, ChevronRight, Search } from "lucide-react";
import { getClients } from "@/lib/data";
import { Client } from "@/lib/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

// Define filter states
type FilterState = 'all' | 'recent' | 'in-progress' | 'upcoming';

// Context menu data type
type ContextMenuPosition = {
  visible: boolean;
  x: number;
  y: number;
  clientId: string | null;
}

// Policy type for the expanded rows
type Policy = {
  id: string;
  type: string;
  policyNumber: string;
  renewalDate: string;
  lastRemarket: string;
  premium: number;
}

// Extended client type with policies
interface ClientWithPolicies extends Client {
  policies?: Policy[];
}

export default function RemarketPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterState>('all');
  const [sorting, setSorting] = useState({ column: 'name', direction: 'asc' as 'asc' | 'desc' });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition>({
    visible: false, 
    x: 0, 
    y: 0, 
    clientId: null
  });

  // Get clients data
  const clientsData: ClientWithPolicies[] = getClients().map(client => {
    // Add mock policies for the prototype
    if (client.id === '1') { // Michelle Young
      return {
        ...client,
        policies: [
          { 
            id: '1-1', 
            type: 'Home', 
            policyNumber: '19812893', 
            renewalDate: '11/1/2025', 
            lastRemarket: '4/1/2025', 
            premium: 2128 
          },
          { 
            id: '1-2', 
            type: 'Auto', 
            policyNumber: '123993231', 
            renewalDate: '5/1/2025', 
            lastRemarket: '4/1/2025', 
            premium: 1227 
          }
        ]
      };
    }
    return client;
  });

  // Count for filters
  const recentCount = 6;
  const inProgressCount = 2;
  const upcomingCount = 20;

  // Filter the clients based on active filter
  const filteredData = clientsData.filter(client => {
    // Apply search filter first
    if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recent') return client.id === '2' || client.id === '1'; // Mock recent remarkets
    if (activeFilter === 'in-progress') return client.id === '7' || client.id === '8'; // Mock in-progress
    if (activeFilter === 'upcoming') return client.renewalDate >= new Date().toISOString().split('T')[0]; // All future renewals
    return true;
  });

  const handleSort = (column: string) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(row => row !== id));
    }
  };

  const handleRowClick = (clientId: string) => {
    router.push(`/remarkets/${encodeURIComponent(clientId)}?tab=quotes`);
  };
  
  const toggleRowExpand = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    
    setExpandedRows(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId) 
        : [...prev, clientId]
    );
  };
  
  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, clientId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      clientId
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const direction = sorting.direction === 'asc' ? 1 : -1;
    const aValue = a[sorting.column as keyof Client];
    const bValue = b[sorting.column as keyof Client];
    
    if (typeof aValue === 'string') {
      return direction * aValue.localeCompare(String(bValue));
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction * (aValue - bValue);
    }
    
    return 0;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 relative min-h-screen">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Remarkets</h1>
          <div className="relative w-64">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search clients" 
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter badges */}
        <div className="flex gap-2">
          <Badge 
            variant="outline"
            className={`cursor-pointer px-3 py-1 font-medium ${
              activeFilter === 'all' 
                ? 'bg-orange-50 text-orange-500 border border-orange-200' 
                : 'bg-transparent text-gray-700 border'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All Clients
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer px-3 py-1 font-medium ${
              activeFilter === 'recent' 
                ? 'bg-orange-50 text-orange-500 border border-orange-200' 
                : 'bg-transparent text-gray-700 border'
            }`}
            onClick={() => setActiveFilter('recent')}
          >
            Recent Remarkets 
            <span className={`ml-1.5 text-xs rounded-full px-1.5 ${
              activeFilter === 'recent'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {recentCount}
            </span>
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer px-3 py-1 font-medium ${
              activeFilter === 'in-progress' 
                ? 'bg-orange-50 text-orange-500 border border-orange-200' 
                : 'bg-transparent text-gray-700 border'
            }`}
            onClick={() => setActiveFilter('in-progress')}
          >
            Remarkets in Progress 
            <span className={`ml-1.5 text-xs rounded-full px-1.5 ${
              activeFilter === 'in-progress'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {inProgressCount}
            </span>
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer px-3 py-1 font-medium ${
              activeFilter === 'upcoming' 
                ? 'bg-orange-50 text-orange-500 border border-orange-200' 
                : 'bg-transparent text-gray-700 border'
            }`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming Renewals 
            <span className={`ml-1.5 text-xs rounded-full px-1.5 ${
              activeFilter === 'upcoming'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {upcomingCount}
            </span>
          </Badge>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table className="bg-white">
            <TableHeader className="bg-gray-50">
              <TableRow className="h-12">
                <TableHead className="w-12 p-0">
                  <div className="h-12 w-12 flex items-center justify-center">
                    <Checkbox 
                      checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'renewalDate', label: 'Renewal Date' },
                  { key: 'lastRemarket', label: 'Last Remarket' },
                  { key: 'premium', label: 'Premium' },
                ].map(({ key, label }) => (
                  <TableHead 
                    key={key}
                    onClick={() => handleSort(key)}
                    className="border-l cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full text-gray-600 group-hover:text-foreground">
                      <span>{label}</span>
                      <ArrowUpDown className="h-3.5 w-3.5 ml-2 text-muted-foreground/50 group-hover:text-muted-foreground" />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-16"></TableHead> {/* Action column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    No clients match the current filter
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((client) => (
                  <React.Fragment key={client.id}>
                    <TableRow
                      className={`h-12 hover:bg-orange-50 data-[state=selected]:bg-muted border-b transition-colors cursor-pointer`}
                      onClick={() => handleRowClick(client.id)}
                      onContextMenu={(e) => handleContextMenu(e, client.id)}
                    >
                      <TableCell 
                        className="w-12 p-0"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on checkbox
                      >
                        <div className="h-12 w-12 flex items-center justify-center">
                          <Checkbox 
                            checked={selectedRows.includes(client.id)}
                            onCheckedChange={(checked) => handleSelectRow(client.id, checked as boolean)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 w-5 p-0"
                            onClick={(e) => toggleRowExpand(e, client.id)}
                          >
                            {expandedRows.includes(client.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell>{client.renewalDate}</TableCell>
                      <TableCell>{client.id === '9' || client.id === '10' ? '-' : '4/1/2025'}</TableCell>
                      <TableCell>${client.premium.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="text-orange-500 h-8">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Policy Rows */}
                    {expandedRows.includes(client.id) && client.policies && 
                      client.policies.map(policy => (
                        <TableRow 
                          key={policy.id} 
                          className="bg-gray-50 h-12"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <TableCell className="w-12 p-0">
                            <div className="h-12 w-12 flex items-center justify-center">
                              <Checkbox 
                                checked={selectedRows.includes(policy.id)}
                                onCheckedChange={(checked) => handleSelectRow(policy.id, checked as boolean)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="pl-8 flex items-center">
                              {policy.type} - {policy.policyNumber}
                            </div>
                          </TableCell>
                          <TableCell>{policy.renewalDate}</TableCell>
                          <TableCell>{policy.lastRemarket}</TableCell>
                          <TableCell>${policy.premium.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="link" className="text-orange-500 h-8">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Context Menu */}
        <DropdownMenu 
          open={contextMenu.visible} 
          onOpenChange={(open) => {
            if (!open) {
              setContextMenu(prev => ({ ...prev, visible: false }));
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <div 
              className="fixed invisible" 
              style={{ top: contextMenu.y, left: contextMenu.x }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => {
                if (contextMenu.clientId) {
                  router.push(`/remarkets/${contextMenu.clientId}?tab=quotes`);
                }
              }}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Add Toaster component for notifications */}
        <Toaster position="top-right" />
        
        {/* Pagination */}
        <div className="flex justify-end items-center text-sm">
          <span className="text-gray-500">Page 1 of 23</span>
        </div>
      </div>
    </DashboardLayout>
  );
} 