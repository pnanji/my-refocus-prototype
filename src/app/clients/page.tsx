"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Download, RefreshCw } from "lucide-react";
import { getClients } from "@/lib/data";
import { Client } from "@/lib/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define filter states
type FilterState = 'at-risk' | 'completed' | 'in-progress' | 'all';

// Context menu data type
type ContextMenuPosition = {
  visible: boolean;
  x: number;
  y: number;
  clientId: string | null;
}

export default function ClientsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterState>('all');
  const [sorting, setSorting] = useState({ column: 'name', direction: 'asc' as 'asc' | 'desc' });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition>({
    visible: false, 
    x: 0, 
    y: 0, 
    clientId: null
  });

  // Get clients data
  const clientsData = getClients();

  // Count clients for each filter category
  const atRiskCount = clientsData.filter(client => 
    client.cancellationRisk === 'High' || client.cancellationRisk === 'Medium'
  ).length;
  
  // For the prototype, we'll simulate completed and in-progress with hardcoded IDs
  const completedCount = clientsData.filter(client => 
    client.id === '2' || client.id === '5'
  ).length;
  
  const inProgressCount = clientsData.filter(client => 
    client.id === '1' || client.id === '3'
  ).length;

  // Filter the clients based on active filter
  const filteredData = clientsData.filter(client => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'at-risk') return client.cancellationRisk === 'High' || client.cancellationRisk === 'Medium';
    // In a real app, we'd have actual fields for these states
    // For the prototype, we'll simulate with random assignments
    if (activeFilter === 'completed') return client.id === '2' || client.id === '5'; // Simulate completed remarkets
    if (activeFilter === 'in-progress') return client.id === '1' || client.id === '3'; // Simulate in-progress remarkets
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
    router.push(`/clients/${clientId}?tab=quotes`);
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
  
  const handleStartRemarket = (clientIds: string[]) => {
    // This would actually start the remarket process
    console.log('Starting remarket for clients:', clientIds);
    // Show toast notification instead of alert
    toast.success(`Started remarket for ${clientIds.length} ${clientIds.length === 1 ? 'client' : 'clients'}`);
    setSelectedRows([]);
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
          <h1 className="text-2xl font-semibold">Clients</h1>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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
            <span className={`ml-1.5 text-xs rounded-full px-1.5 ${
              activeFilter === 'all'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {clientsData.length}
            </span>
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer px-3 py-1 font-medium ${
              activeFilter === 'at-risk' 
                ? 'bg-orange-50 text-orange-500 border border-orange-200' 
                : 'bg-transparent text-gray-700 border'
            }`}
            onClick={() => setActiveFilter('at-risk')}
          >
            At-Risk Accounts 
            <span className={`ml-1.5 text-xs rounded-full px-1.5 ${
              activeFilter === 'at-risk'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {atRiskCount}
            </span>
          </Badge>
          <Badge 
            variant="outline"
            className={`cursor-pointer px-3 py-1 font-medium ${
              activeFilter === 'completed' 
                ? 'bg-orange-50 text-orange-500 border border-orange-200' 
                : 'bg-transparent text-gray-700 border'
            }`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed Remarkets 
            <span className={`ml-1.5 text-xs rounded-full px-1.5 ${
              activeFilter === 'completed'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {completedCount}
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
                  { key: 'cancellationRisk', label: 'Cancellation Risk' },
                  { key: 'renewalDate', label: 'Renewal Date' },
                  { key: 'premium', label: 'Premium', align: 'right' }
                ].map(({ key, label, align }) => (
                  <TableHead 
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`border-l cursor-pointer group ${align === 'right' ? 'text-right' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full text-gray-600 group-hover:text-foreground">
                      <span>{label}</span>
                      <ArrowUpDown className="h-3.5 w-3.5 ml-2 text-muted-foreground/50 group-hover:text-muted-foreground" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No clients match the current filter
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((client) => (
                  <TableRow 
                    key={client.id}
                    className="h-12 hover:bg-orange-50 cursor-pointer"
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
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      {client.cancellationRisk ? (
                        <Badge 
                          variant={
                            client.cancellationRisk === 'High' ? 'destructive' : 
                            client.cancellationRisk === 'Medium' ? 'warning' : 
                            'secondary'
                          }
                        >
                          {client.cancellationRisk}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>{client.renewalDate}</TableCell>
                    <TableCell className="text-right">${client.premium.toLocaleString()}</TableCell>
                  </TableRow>
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
                  handleStartRemarket([contextMenu.clientId]);
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Remarket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Action Bar (appears when items are selected) */}
        {selectedRows.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-full py-2 px-4 z-50 flex items-center gap-4">
            <div className="text-sm font-medium">
              {selectedRows.length} {selectedRows.length === 1 ? 'client' : 'clients'} selected
            </div>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleStartRemarket(selectedRows)}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Remarket
            </Button>
          </div>
        )}
        
        {/* Add Toaster component for notifications */}
        <Toaster position="top-right" />
      </div>
    </DashboardLayout>
  );
} 