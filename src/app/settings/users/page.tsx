"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, MoreHorizontal, PlusIcon, ShieldCheck, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Role badge component
function RoleBadge({ role }: { role: "admin" | "user" }) {
  if (role === "admin") {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        <ShieldCheck className="mr-1 h-3 w-3" />
        Admin
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">
      <User className="mr-1 h-3 w-3" />
      User
    </Badge>
  );
}

export default function UserManagementPage() {
  // In a real app, this would come from a database
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "user" },
    { id: "4", name: "Alice Williams", email: "alice@example.com", role: "user" },
    { id: "5", name: "David Brown", email: "david@example.com", role: "user" },
    { id: "6", name: "Sarah Miller", email: "sarah@example.com", role: "admin" },
    { id: "7", name: "Michael Davis", email: "michael@example.com", role: "user" },
    { id: "8", name: "Emily Wilson", email: "emily@example.com", role: "user" },
    { id: "9", name: "James Taylor", email: "james@example.com", role: "user" },
    { id: "10", name: "Jessica Anderson", email: "jessica@example.com", role: "user" },
    { id: "11", name: "Robert Martinez", email: "robert@example.com", role: "user" },
    { id: "12", name: "Jennifer Thomas", email: "jennifer@example.com", role: "admin" },
    { id: "13", name: "Daniel Jackson", email: "daniel@example.com", role: "user" },
  ]);

  // Sort state
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle role change
  const handleRoleChange = (userId: string, role: "admin" | "user") => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, role } : user))
    );
  };

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const newId = (users.length + 1).toString();
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({ name: "", email: "", role: "user" });
    setShowAddForm(false);
  };

  // Remove user
  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  // Toggle sort direction
  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Sort users by name
  const sortedUsers = [...users].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[1000px] mx-auto px-4 pb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-base font-medium text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500">
                Manage users and their roles within your agency
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="flex items-center gap-1"
              disabled={showAddForm}
            >
              <PlusIcon className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-white p-4 rounded-lg border mb-6">
              <h2 className="text-sm font-medium mb-4">Add New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "user") => 
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" />
                          Admin
                        </div>
                      </SelectItem>
                      <SelectItem value="user">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-600" />
                          User
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </div>
          )}

          <div className="rounded-lg border overflow-hidden">
            <Table className="bg-white">
              <TableHeader className="bg-gray-50">
                <TableRow className="h-12">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={toggleSort}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className={cn(
                        "ml-2 h-4 w-4", 
                        sortDirection === 'asc' ? "text-gray-700" : "text-gray-700 rotate-180"
                      )} />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id} className="h-12 hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: "admin" | "user") => 
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <RoleBadge role={user.role} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-gray-600" />
                              User
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemoveUser(user.id)}
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
            {users.length === 0 && (
              <div className="text-center py-12 bg-white">
                <p className="text-gray-500">No users added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 