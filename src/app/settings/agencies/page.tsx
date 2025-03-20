"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PlusIcon, MoreHorizontal, Trash2, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock agency data
interface Agency {
  id: string;
  name: string;
  location: string;
  hasRetentionInsights: boolean;
  hasAutomatedQuoting: boolean;
  userCount?: number;
}

export default function AgencyManagementPage() {
  const router = useRouter();
  
  // In a real app, this would come from a database
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: "1",
      name: "Acme Insurance Agency",
      location: "New York, NY",
      hasRetentionInsights: true,
      hasAutomatedQuoting: true,
      userCount: 3,
    },
    {
      id: "2",
      name: "Best Coverage Insurance",
      location: "Chicago, IL",
      hasRetentionInsights: true,
      hasAutomatedQuoting: false,
      userCount: 2,
    },
    {
      id: "3",
      name: "Safe Haven Insurance",
      location: "Los Angeles, CA",
      hasRetentionInsights: false,
      hasAutomatedQuoting: false,
      userCount: 5,
    },
    {
      id: "4",
      name: "Coastal Protection Group",
      location: "Miami, FL",
      hasRetentionInsights: true,
      hasAutomatedQuoting: true,
      userCount: 4,
    },
    {
      id: "5",
      name: "Mountain State Insurance",
      location: "Denver, CO",
      hasRetentionInsights: false,
      hasAutomatedQuoting: true,
      userCount: 2,
    },
    {
      id: "6",
      name: "Evergreen Coverage",
      location: "Seattle, WA",
      hasRetentionInsights: true,
      hasAutomatedQuoting: false,
      userCount: 3,
    },
    {
      id: "7",
      name: "Golden State Insurers",
      location: "San Francisco, CA",
      hasRetentionInsights: true,
      hasAutomatedQuoting: true,
      userCount: 6,
    },
    {
      id: "8",
      name: "Lone Star Insurance",
      location: "Dallas, TX",
      hasRetentionInsights: false,
      hasAutomatedQuoting: false,
      userCount: 2,
    },
    {
      id: "9",
      name: "Keystone Coverage Solutions",
      location: "Philadelphia, PA",
      hasRetentionInsights: true,
      hasAutomatedQuoting: false,
      userCount: 4,
    },
    {
      id: "10",
      name: "Windy City Protectors",
      location: "Chicago, IL",
      hasRetentionInsights: false,
      hasAutomatedQuoting: true,
      userCount: 3,
    },
    {
      id: "11",
      name: "Capital Risk Management",
      location: "Washington, DC",
      hasRetentionInsights: true,
      hasAutomatedQuoting: true,
      userCount: 5,
    },
    {
      id: "12",
      name: "Bayou Insurance Group",
      location: "New Orleans, LA",
      hasRetentionInsights: false,
      hasAutomatedQuoting: false,
      userCount: 2,
    },
    {
      id: "13",
      name: "Desert Sun Coverage",
      location: "Phoenix, AZ",
      hasRetentionInsights: true,
      hasAutomatedQuoting: false,
      userCount: 3,
    }
  ]);

  // Sort state
  const [sortField, setSortField] = useState<'name' | 'location' | 'userCount'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // New agency form state
  const [newAgency, setNewAgency] = useState({
    name: "",
    location: "",
    hasRetentionInsights: false,
    hasAutomatedQuoting: false,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Toggle sort direction or change sort field
  const toggleSort = (field: 'name' | 'location' | 'userCount') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort agencies by the selected field
  const sortedAgencies = [...agencies].sort((a, b) => {
    if (sortField === 'userCount') {
      return sortDirection === 'asc' 
        ? (a.userCount || 0) - (b.userCount || 0)
        : (b.userCount || 0) - (a.userCount || 0);
    }
    
    const compareValue = sortDirection === 'asc' 
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
    return compareValue;
  });

  // Toggle feature for an agency
  const toggleFeature = (agencyId: string, feature: "hasRetentionInsights" | "hasAutomatedQuoting") => {
    setAgencies(
      agencies.map((agency) => 
        agency.id === agencyId 
          ? { ...agency, [feature]: !agency[feature] } 
          : agency
      )
    );
  };

  // Add new agency
  const handleAddAgency = () => {
    if (!newAgency.name || !newAgency.location) return;
    
    const newId = (agencies.length + 1).toString();
    setAgencies([...agencies, { ...newAgency, id: newId, userCount: 0 }]);
    setNewAgency({
      name: "",
      location: "",
      hasRetentionInsights: false,
      hasAutomatedQuoting: false,
    });
    setShowAddForm(false);
  };

  // Remove agency
  const handleRemoveAgency = (agencyId: string) => {
    setAgencies(agencies.filter(agency => agency.id !== agencyId));
  };

  // Navigate to agency's user management page
  const navigateToAgencyUsers = (agencyId: string) => {
    router.push(`/settings/agencies/${agencyId}/users`);
  };

  // Custom toggle switch component (reusing the same style from config-panel)
  const ToggleSwitch = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: () => void 
  }) => (
    <div
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
        checked ? "bg-green-500" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
        style={{ margin: "2px 0" }}
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[1000px] mx-auto px-4 pb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-base font-medium text-gray-900">Agency Management</h1>
              <p className="text-sm text-gray-500">
                Manage agencies and their feature access
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="flex items-center gap-1"
              disabled={showAddForm}
            >
              <PlusIcon className="h-4 w-4" />
              Add Agency
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-white p-4 rounded-lg border mb-6">
              <h2 className="text-sm font-medium mb-4">Add New Agency</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Input
                    placeholder="Agency Name"
                    value={newAgency.name}
                    onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Location"
                    value={newAgency.location}
                    onChange={(e) => setNewAgency({ ...newAgency, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAgency}>Add Agency</Button>
              </div>
            </div>
          )}

          <div className="rounded-lg border overflow-hidden">
            <Table className="bg-white">
              <TableHeader className="bg-gray-50">
                <TableRow className="h-12">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center">
                      Agency Name
                      {sortField === 'name' && (
                        <ArrowUpDown className={cn(
                          "ml-2 h-4 w-4", 
                          sortDirection === 'desc' ? "text-gray-700 rotate-180" : "text-gray-700"
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSort('location')}
                  >
                    <div className="flex items-center">
                      Location
                      {sortField === 'location' && (
                        <ArrowUpDown className={cn(
                          "ml-2 h-4 w-4", 
                          sortDirection === 'desc' ? "text-gray-700 rotate-180" : "text-gray-700"
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSort('userCount')}
                  >
                    <div className="flex items-center">
                      Users
                      {sortField === 'userCount' && (
                        <ArrowUpDown className={cn(
                          "ml-2 h-4 w-4", 
                          sortDirection === 'desc' ? "text-gray-700 rotate-180" : "text-gray-700"
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Retention Insights</TableHead>
                  <TableHead>Automated Quoting</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAgencies.map((agency) => (
                  <TableRow 
                    key={agency.id} 
                    className="h-12 hover:bg-gray-50"
                  >
                    <TableCell 
                      className="font-medium cursor-pointer"
                      onClick={() => navigateToAgencyUsers(agency.id)}
                    >
                      {agency.name}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => navigateToAgencyUsers(agency.id)}
                    >
                      {agency.location}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => navigateToAgencyUsers(agency.id)}
                    >
                      {agency.userCount || 0}
                    </TableCell>
                    <TableCell>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        toggleFeature(agency.id, "hasRetentionInsights");
                      }}>
                        <ToggleSwitch
                          checked={agency.hasRetentionInsights}
                          onChange={() => {}}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div onClick={(e) => {
                        e.stopPropagation();
                        toggleFeature(agency.id, "hasAutomatedQuoting");
                      }}>
                        <ToggleSwitch
                          checked={agency.hasAutomatedQuoting}
                          onChange={() => {}}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemoveAgency(agency.id)}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {agencies.length === 0 && (
              <div className="text-center py-12 bg-white">
                <p className="text-gray-500">No agencies added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 