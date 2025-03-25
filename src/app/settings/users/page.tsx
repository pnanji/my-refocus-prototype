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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, PlusIcon } from "lucide-react";
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
      <Badge className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-sm font-medium whitespace-nowrap px-2 py-0.5">
        Admin
      </Badge>
    );
  }
  
  return null;
}

export default function UsersPage() {
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

  // Edit user state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
  });

  // Handle edit dialog open
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit form role change
  const handleEditRoleChange = (role: "admin" | "user") => {
    setEditFormData(prev => ({
      ...prev,
      role,
    }));
  };

  // Save edited user
  const saveEditedUser = () => {
    if (!editingUser) return;
    
    setUsers(
      users.map((user) => 
        user.id === editingUser.id ? { ...user, ...editFormData } : user
      )
    );
    
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const newId = (users.length + 1).toString();
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({ name: "", email: "", role: "user" });
    setShowAddForm(false);
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
              <h1 className="text-base font-medium text-gray-900">Users</h1>
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
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
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id} className="h-12 hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.name}
                        {user.role === "admin" && <RoleBadge role="admin" />}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? "Admin" : "User"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="px-2.5 py-1 h-auto"
                        onClick={() => openEditDialog(user)}
                      >
                        Edit
                      </Button>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value: "admin" | "user") => handleEditRoleChange(value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 