"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CheckIcon, Loader, Copy, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConfig } from "@/components/config-panel";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CRMSettings() {
  const { showCrmConnectionError } = useConfig();
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false
  const [showAuthenticatedButton, setShowAuthenticatedButton] = useState(false); // New state to control button visibility
  const [formData, setFormData] = useState({
    username: "bobbyjaffery@cjinsurance.com",
    password: "securepassword123",
  });
  
  // New states for disconnect/reconnect flow
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [selectedCrm, setSelectedCrm] = useState<string | undefined>(undefined);
  const [reconnectFormData, setReconnectFormData] = useState({
    username: "",
    password: ""
  });
  
  // Update authentication state when the connection error toggle changes
  useEffect(() => {
    if (showCrmConnectionError) {
      setIsAuthenticated(false);
      setShowAuthenticatedButton(false);
    } else {
      setIsAuthenticated(true);
      setShowAuthenticatedButton(false); // Don't show button in default state
    }
  }, [showCrmConnectionError]);
  
  // Notification preferences
  const [notificationType, setNotificationType] = useState("tasks");
  const [assignee, setAssignee] = useState("bobbyjaffery@cjinsurance.com");
  const [taskDueDate, setTaskDueDate] = useState("7 days from creation");
  
  // Email invitation
  const [inviteEmail] = useState("cjinsurancegroup@refocusai.com");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real implementation, this would save data to backend
    toast.success("Settings saved successfully");
    setHasChanges(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If in disconnected state and trying to authenticate
    if (isDisconnected) {
      // Simulate authentication process
      setIsAuthenticating(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Update the main formData with reconnect values
        setFormData({
          username: reconnectFormData.username,
          password: reconnectFormData.password
        });
        
        setIsAuthenticating(false);
        setIsDisconnected(false);
        setSelectedCrm(undefined);
        // Reset notification preferences to defaults
        setNotificationType("tasks");
        setAssignee("");
        setTaskDueDate("7 days from creation");
        
        // Reset reconnect form data
        setReconnectFormData({ username: "", password: "" });
      }, 1500);
      
      return;
    }
    
    // If in error state and trying to authenticate
    if (showCrmConnectionError) {
      // Simulate authentication process
      setIsAuthenticating(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
        setShowAuthenticatedButton(true); // Show the button after successful authentication
      }, 1500);
    }
  };

  const handleDisconnect = () => {
    // Disconnect logic
    setIsDisconnected(true);
    setOpen(false);
    setIsAuthenticated(false);
    // Reset reconnect form data
    setReconnectFormData({ username: "", password: "" });
  };
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(inviteEmail);
    setCopySuccess(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-base font-medium text-gray-900">CRM</h1>
              <p className="text-sm text-gray-500">
                Manage connection and notifications to a CRM
              </p>
            </div>
            {!isDisconnected && (
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={!hasChanges}
                onClick={handleSave}
              >
                Save
              </Button>
            )}
          </div>

          {isDisconnected ? (
            // Connect CRM Card (shown when disconnected)
            <>
              <div className="bg-white border rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-sm font-medium text-gray-900 mb-4">
                    Select the CRM you would like to connect
                  </h2>
                  
                  <div className="max-w-[240px]">
                    <Select value={selectedCrm} onValueChange={setSelectedCrm}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agencyzoom">AgencyZoom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Show AgencyZoom authentication card when selected */}
              {selectedCrm === "agencyzoom" && (
                <div className="bg-white border rounded-lg overflow-hidden mb-6">
                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Agency Zoom Logo */}
                    <div className="flex justify-center mt-6 mb-10">
                      <Image 
                        src="/agencyzoom-logo.png" 
                        alt="Agency Zoom Logo" 
                        width={240}
                        height={77}
                        className="h-14 object-contain"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="reconnectUsername" variant="form">
                          Username
                        </Label>
                        <Input
                          type="text"
                          id="reconnectUsername"
                          placeholder="email@example.com"
                          value={reconnectFormData.username}
                          onChange={(e) => setReconnectFormData(prev => ({ ...prev, username: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="reconnectPassword" variant="form">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="reconnectPassword"
                          placeholder="************"
                          value={reconnectFormData.password}
                          onChange={(e) => setReconnectFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={isAuthenticating}
                      >
                        {isAuthenticating ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin mr-2" />
                            Authenticating
                          </>
                        ) : (
                          "Authenticate"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            // Connected state UI
            <>
              {/* Agency Zoom Connection Card */}
              <div className="bg-white border rounded-lg overflow-hidden mb-6">
                <form onSubmit={handleSubmit} className="p-6">
                  {/* Agency Zoom Logo */}
                  <div className="flex justify-center mt-6 mb-10">
                    <Image 
                      src="/agencyzoom-logo.png" 
                      alt="Agency Zoom Logo" 
                      width={240}
                      height={77}
                      className="h-14 object-contain"
                    />
                  </div>
                  
                  {/* Authentication error alert - only show when in error state and not authenticated */}
                  {showCrmConnectionError && !isAuthenticated && (
                    <Alert variant="error" className="bg-red-50 border border-red-200 rounded-lg mb-6">
                      <AlertDescription className="text-gray-900">
                        We&apos;re having trouble authenticating with AgencyZoom. Please re-enter your details and try clicking <strong>Authenticate</strong> again or <Link href="https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6" className="underline">contact our support team</Link> for assistance.
                      </AlertDescription>
                    </Alert>
                  )}
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="username" variant="form">
                        Username
                      </Label>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="email@example.com"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!showCrmConnectionError}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" variant="form">
                        Password
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="************"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={!showCrmConnectionError}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Show Authenticate button only when in error state */}
                  {showCrmConnectionError && !isAuthenticated && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={isAuthenticating}
                      >
                        {isAuthenticating ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin mr-2" />
                            Authenticating
                          </>
                        ) : (
                          "Authenticate"
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {/* Show Authenticated button only after successful authentication */}
                  {showAuthenticatedButton && isAuthenticated && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-green-50 text-green-700 border-green-200"
                        disabled={true}
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Authenticated
                      </Button>
                    </div>
                  )}
                </form>
              </div>

              {/* Notification Preferences Card */}
              <div className="bg-white border rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-sm font-medium text-gray-900 mb-4">
                    How would you like to be notified of at-risk cancellations in AgencyZoom?
                  </h2>
                  
                  <div className="mb-6">
                    <RadioGroup 
                      value={notificationType} 
                      onValueChange={(value) => {
                        setNotificationType(value);
                        setHasChanges(true);
                      }}
                    >
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem value="tasks" id="tasks" />
                        <Label htmlFor="tasks" className="cursor-pointer">Tasks <span className="text-muted-foreground">(most common)</span></Label>
                      </div>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem value="notes" id="notes" />
                        <Label htmlFor="notes" className="cursor-pointer">Notes</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Conditional rendering based on notification type */}
                    {notificationType === "tasks" ? (
                      <>
                        <div className="max-w-[240px]">
                          <Label htmlFor="assignee" variant="form">
                            Who to assign the task?
                          </Label>
                          <Input
                            type="text"
                            id="assignee"
                            placeholder="Email"
                            value={assignee}
                            onChange={(e) => {
                              setAssignee(e.target.value);
                              setHasChanges(true);
                            }}
                          />
                        </div>
                        
                        <div className="max-w-[240px]">
                          <Label htmlFor="taskDueDate" variant="form">
                            Task Due Date
                          </Label>
                          <Select 
                            value={taskDueDate} 
                            onValueChange={(value) => {
                              setTaskDueDate(value);
                              setHasChanges(true);
                            }}
                          >
                            <SelectTrigger className="w-full" id="taskDueDate">
                              <SelectValue placeholder="Select a due date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3 days from creation">3 days from creation</SelectItem>
                              <SelectItem value="5 days from creation">5 days from creation</SelectItem>
                              <SelectItem value="7 days from creation">7 days from creation</SelectItem>
                              <SelectItem value="14 days from creation">14 days from creation</SelectItem>
                              <SelectItem value="30 days from creation">30 days from creation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <div className="max-w-[240px]">
                        <Label htmlFor="noteAssignee" variant="form">
                          Who to assign the note?
                        </Label>
                        <Input
                          type="text"
                          id="noteAssignee"
                          placeholder="Email"
                          value={assignee}
                          onChange={(e) => {
                            setAssignee(e.target.value);
                            setHasChanges(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {notificationType === "tasks" && (
                    <Alert variant="default" className="mt-6 bg-gray-50 border-gray-200">
                      <Info className="h-5 w-5 text-gray-500" />
                      <AlertDescription>
                        All tasks added by ReFocus in AgencyZoom will include the tag <span className="font-medium whitespace-nowrap">rf-cancel-risk</span> for easy filtering and tracking of our recommendations.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              
              {/* Email Invitation Card */}
              <div className="bg-white border rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <p className="text-sm text-gray-900 mb-4">
                    Please invite this email as a user in <span className="font-medium">AgencyZoom</span> to allow us to send notifications.
                  </p>
                  
                  <div className="flex items-stretch">
                    <div className="flex-1 bg-gray-50 border rounded-l-md px-3 py-2 text-sm text-gray-700 overflow-hidden overflow-ellipsis flex items-center">
                      {inviteEmail}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none border-l-0 h-auto"
                      onClick={handleCopyEmail}
                    >
                      {copySuccess ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Disconnect Card */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-6">
                  <p className="text-sm/6 text-muted-foreground mb-4">
                    Disconnecting from AgencyZoom will prevent ReFocus from sending notifications to your CRM.
                  </p>
                  <div className="flex justify-center">
                    <AlertDialog open={open} onOpenChange={setOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-red-600"
                        >
                          Disconnect AgencyZoom
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to disconnect AgencyZoom?</AlertDialogTitle>
                          <AlertDialogDescription>
                            <strong>Warning:</strong> This action will remove the connection between ReFocusAI and your CRM. You will no longer receive notifications about at-risk renewals in AgencyZoom.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDisconnect} variant="destructive">
                            Disconnect
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </DashboardLayout>
  );
} 