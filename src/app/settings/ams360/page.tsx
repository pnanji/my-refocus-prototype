"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChevronLeft, CheckIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useConfig } from "@/components/config-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export default function AMS360Settings() {
  const { showAmsConnectionError } = useConfig();
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({
    agencyNumber: "123456-1",
    agencyKey: "secretkey123",
    wsapiLoginId: "REFOCUSALTPG",
    wsapiPassword: "securepassword",
  });
  const [formData, setFormData] = useState({
    agencyNumber: "123456-1",
    agencyKey: "secretkey123",
    wsapiLoginId: "REFOCUSALTPG",
    wsapiPassword: "securepassword",
  });

  // Check if form data has changed from original values
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    setHasChanges(changed);
  }, [formData, originalFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If in error state and trying to authenticate
    if (showAmsConnectionError && !isAuthenticated) {
      // Simulate authentication process
      setIsAuthenticating(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsAuthenticating(false);
        setIsAuthenticated(true);
      }, 1500);
      
      return;
    }
    
    // Regular save logic
    alert("Connection details saved successfully!");
    setOriginalFormData({...formData});
    setHasChanges(false);
  };

  const handleDisconnect = () => {
    // Disconnect logic would go here
    alert("AMS360 disconnected successfully");
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* Back button */}
          <div className="mb-4">
            <Link href="/settings" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </div>
          
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-base font-medium text-gray-900">AMS360</h1>
            {/* Save button hidden for now */}
            {false && (
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={!hasChanges}
                onClick={handleSubmit}
              >
                Save
              </Button>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Authentication error alert - only show when not authenticated */}
              {showAmsConnectionError && !isAuthenticated && (
                <Alert variant="error" className="bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertDescription className="text-gray-900">
                    We&apos;re having trouble authenticating. Please re-enter your details and try clicking <strong>Authenticate</strong> again or <Link href="https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6" className="underline">contact our support team</Link> for assistance.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Removing the success alert as requested */}
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="agencyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Number
                  </label>
                  <Input
                    type="text"
                    id="agencyNumber"
                    name="agencyNumber"
                    placeholder="XXXXXX-1"
                    value={formData.agencyNumber}
                    onChange={handleInputChange}
                    disabled={!showAmsConnectionError || isAuthenticated}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="agencyKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Key
                  </label>
                  <Input
                    type="password"
                    id="agencyKey"
                    name="agencyKey"
                    placeholder="************"
                    value={formData.agencyKey}
                    onChange={handleInputChange}
                    disabled={!showAmsConnectionError || isAuthenticated}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="wsapiLoginId" className="block text-sm font-medium text-gray-700 mb-1">
                    WSAPI Login ID
                  </label>
                  <Input
                    type="text"
                    id="wsapiLoginId"
                    name="wsapiLoginId"
                    placeholder="REFOCUSALTPG"
                    value={formData.wsapiLoginId}
                    onChange={handleInputChange}
                    disabled={!showAmsConnectionError || isAuthenticated}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="wsapiPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    WSAPI Password
                  </label>
                  <Input
                    type="password"
                    id="wsapiPassword"
                    name="wsapiPassword"
                    placeholder="************"
                    value={formData.wsapiPassword}
                    onChange={handleInputChange}
                    disabled={!showAmsConnectionError || isAuthenticated}
                    required
                  />
                </div>
              </div>
              
              {/* Show Authenticate button only when in error state and not authenticated */}
              {showAmsConnectionError && (
                <div className="mt-6 flex justify-center">
                  {!isAuthenticated ? (
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Authenticating
                        </>
                      ) : (
                        "Authenticate"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-700 border-green-200"
                      disabled={true}
                    >
                      <CheckIcon className="h-4 w-4" />
                      Authenticated
                    </Button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Disconnect Card */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm/6 text-gray-500 mb-4">
                Disconnecting from AMS360 will prevent ReFocusAI from receiving policy data updates. 
                This will affect your client list and predictions.
              </p>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600"
                  >
                    Disconnect AMS360
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to disconnect AMS360?</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>Warning:</strong> This action is permanent. All synced data will be deleted, and we can&apos;t predict at-risk renewals without a connected AMS.
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
      </div>
    </DashboardLayout>
  );
} 