"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/components/config-panel";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { CarrierManagement } from "@/components/carrier-management";

export function OnboardingView() {
  const { onboardingStep, setOnboardingStep, selectedAms, setSelectedAms } = useConfig();

  const handleGetStarted = () => {
    setOnboardingStep('select-ams');
  };

  const handleSelectAms = (amsName: string) => {
    // Only proceed to connection-setup for AMS360
    if (amsName === 'AMS360') {
      setSelectedAms(amsName);
      setOnboardingStep('connection-setup');
    }
  };

  const handleStartRequoting = () => {
    // Switch to requoting setup step
    setOnboardingStep('requoting-setup');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center px-4">
        <div className="flex flex-col items-center w-full rounded-xl p-8">
          {onboardingStep === 'connection-setup' ? (
            <ConnectionSetupView />
          ) : onboardingStep === 'requoting-setup' ? (
            <CarrierManagement />
          ) : (
            <>
              <div className="mb-6 text-center">
                <Image 
                  src="/refocus-logomark.png" 
                  alt="ReFocus Logo" 
                  width={72} 
                  height={72} 
                  priority
                />
              </div>
              
              {onboardingStep === 'welcome' ? (
                <WelcomeView onGetStarted={handleGetStarted} />
              ) : onboardingStep === 'select-ams' ? (
                <SelectAmsView onSelectAms={handleSelectAms} />
              ) : onboardingStep === 'in-progress' ? (
                <InProgressView />
              ) : (
                <CompletedFirstStepView onStartRequoting={handleStartRequoting} />
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function WelcomeView({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to ReFocus</h1>
      
      <div className="mb-8 text-center">
        <p className="text-sm text-foreground">
          Click <span className="font-medium text-foreground">Get Started</span> to link your AMS and unlock powerful retention insights.
          <br />
          Once completed, we'll help you enable automated requoting for effortless renewals.
        </p>
      </div>

      <div className="space-y-3">
        <div className="border rounded-lg bg-white">
          <div className="p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium">Connect AMS and Setup Retention Insights</h2>
              <p className="text-sm text-muted-foreground">6 Steps</p>
            </div>
            <Button onClick={onGetStarted}>
              Get Started
            </Button>
          </div>
        </div>

        <div className="border rounded-lg bg-white opacity-60">
          <div className="p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium">Automated Requoting</h2>
              <p className="text-sm text-muted-foreground">4 Steps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectAmsView({ onSelectAms }: { onSelectAms: (amsName: string) => void }) {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to ReFocus</h1>
      
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">
          Choose your AMS so we can sync your data and start predicting at-risk renewals.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div 
          className="border rounded-lg bg-white p-8 flex items-center justify-center cursor-pointer transition-all hover:shadow-sm"
          onClick={() => onSelectAms('AMS360')}
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
          onClick={() => onSelectAms('EZLynx')}
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
          onClick={() => onSelectAms('HawkSoft')}
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
          onClick={() => onSelectAms('Veruna')}
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
  );
}

function ConnectionSetupView() {
  const { setOnboardingStep } = useConfig();
  
  const handleScreenshotClick = () => {
    setOnboardingStep('in-progress');
  };
  
  return (
    <div className="w-full flex justify-center">
      <div 
        className="max-w-3xl cursor-pointer" 
        onClick={handleScreenshotClick}
      >
        <Image 
          src="/onboarding-screenshot.png" 
          alt="Onboarding Authentication Screen" 
          width={1000} 
          height={700}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

function InProgressView() {
  const { setOnboardingStep } = useConfig();

  const handleContinue = () => {
    // Complete the first step and move to the second card activation state
    setOnboardingStep('completed-first-step');
  };

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to ReFocus</h1>
      
      <div className="mb-8 text-center">
        <p className="text-sm text-muted-foreground">
          Click <span className="font-medium text-foreground">Continue</span> to finish onboarding.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 flex items-center bg-white border-b">
            <div className="flex-1">
              <h2 className="text-sm font-medium">Connect AMS and Setup Retention Insights</h2>
              <p className="text-sm text-muted-foreground">6 Steps</p>
            </div>
            <Button onClick={handleContinue}>
              Continue
            </Button>
          </div>
          
          <div className="bg-gray-50 py-0">
            <div className="divide-y">
              <div className="flex items-center h-14 px-4">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm">Authenticate AMS</span>
              </div>
              
              <div className="flex items-center h-14 px-4">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xs font-medium text-gray-500">
                  2
                </div>
                <span className="ml-2 text-sm">Notifications</span>
              </div>
              
              <div className="flex items-center h-14 px-4">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xs font-medium text-gray-500">
                  3
                </div>
                <span className="ml-2 text-sm">Connect CRM</span>
              </div>
              
              <div className="flex items-center h-14 px-4">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xs font-medium text-gray-500">
                  4
                </div>
                <span className="ml-2 text-sm">Data Sync</span>
              </div>
              
              <div className="flex items-center h-14 px-4">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xs font-medium text-gray-500">
                  5
                </div>
                <span className="ml-2 text-sm">Data Mapping</span>
              </div>
              
              <div className="flex items-center h-14 px-4">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xs font-medium text-gray-500">
                  6
                </div>
                <span className="ml-2 text-sm">Filter Options</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-white opacity-60">
          <div className="p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium">Automated Requoting</h2>
              <p className="text-sm text-muted-foreground">4 Steps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletedFirstStepView({ onStartRequoting }: { onStartRequoting: () => void }) {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to ReFocus</h1>
      
      <div className="mb-8 text-center">
        <p className="text-sm text-foreground">
          Congratulations! You've successfully connected your AMS.
          <br />
          Now you're ready to set up Automated Requoting to streamline your renewal process.
        </p>
      </div>

      <div className="space-y-3">
        <div className="border rounded-lg bg-white">
          <div className="p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium">Connect AMS and Setup Retention Insights</h2>
              <p className="text-sm text-muted-foreground">6 Steps</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1.5 px-3 py-1.5 rounded-md">
              <CheckCircle className="h-3.5 w-3.5" />
              Completed
            </Badge>
          </div>
        </div>

        <div className="border rounded-lg bg-white">
          <div className="p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium">Automated Requoting</h2>
              <p className="text-sm text-muted-foreground">4 Steps</p>
            </div>
            <Button onClick={onStartRequoting}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 