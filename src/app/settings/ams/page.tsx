"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CheckIcon, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

export default function AMSSettings() {
  const { showAmsConnectionError, isAmsConnected, setIsAmsConnected } = useConfig();
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(!isAmsConnected);
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

  // Update isDisconnected state when isAmsConnected changes
  useEffect(() => {
    setIsDisconnected(!isAmsConnected);
  }, [isAmsConnected]);

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
    // Disconnect logic
    setIsDisconnected(true);
    setIsAmsConnected(false);
    setOpen(false);
  };

  const handleSelectAms = (amsName: string) => {
    // Only allow reconnecting to AMS360 for now
    if (amsName === 'AMS360') {
      setIsDisconnected(false);
      setIsAmsConnected(true);
      // Reset authentication status
      setIsAuthenticated(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">          
          {/* Header with title and save button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-base font-medium text-gray-900">AMS</h1>
              <p className="text-sm text-gray-500">
                Manage connection to your AMS
              </p>
            </div>
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

          {isDisconnected ? (
            // Show AMS selection grid when disconnected
            <div className="bg-white border rounded-lg overflow-hidden mb-6 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">Select an AMS to connect</h2>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Choose your AMS so we can sync your data and start predicting at-risk renewals.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="border rounded-lg bg-white p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-sm"
                  onClick={() => handleSelectAms('AMS360')}
                >
                  <Image 
                    src="/ams360-logo-large.png" 
                    alt="AMS360 Logo" 
                    width={160} 
                    height={50} 
                  />
                </div>

                <div 
                  className="border rounded-lg bg-white p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-sm"
                  onClick={() => handleSelectAms('EZLynx')}
                >
                  <Image 
                    src="/ezlynx-logo-large.png" 
                    alt="EZLynx Logo" 
                    width={160} 
                    height={50} 
                  />
                </div>

                <div 
                  className="border rounded-lg bg-white p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-sm"
                  onClick={() => handleSelectAms('HawkSoft')}
                >
                  <Image 
                    src="/hawksoft-logo-large.png" 
                    alt="HawkSoft Logo" 
                    width={160} 
                    height={50} 
                  />
                </div>

                <div 
                  className="border rounded-lg bg-white p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-sm"
                  onClick={() => handleSelectAms('Veruna')}
                >
                  <Image 
                    src="/veruna-logo-large.png" 
                    alt="Veruna Logo" 
                    width={160} 
                    height={50} 
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Form Card - Only show when not disconnected */
            <div className="bg-white border rounded-lg overflow-hidden mb-6">
              <form onSubmit={handleSubmit} className="p-6">
                {/* AMS Logo */}
                <div className="flex justify-center mt-6 mb-10">
                  <Image 
                    src="/ams360-logo-large.png" 
                    alt="AMS Logo" 
                    width={300}
                    height={96}
                    className="h-16 object-contain"
                  />
                </div>
                
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
                            <Loader className="h-4 w-4 animate-spin mr-2" />
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
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Authenticated
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {!isDisconnected && (
            /* Switch AMS Card - Only show when not disconnected */
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Need to switch your AMS? We&apos;ll guide you through connecting your new system. Your existing data will be safely stored for 60 days while we help you transition.
                  </p>
                </div>
                <div className="flex justify-center">
                  <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-foreground"
                      >
                        Switch to Different AMS
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Switch from AMS360?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This is a permanent change. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDisconnect}>
                          Switch AMS
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 