"use client";

import * as React from "react";
import { useState } from "react";
import { Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarrierGroups, sampleCarriers } from "@/lib/carriers";

// Context to manage the configuration state
interface ConfigContextType {
  showAmsConnectionError: boolean;
  toggleAmsConnectionError: () => void;
  showCrmConnectionError: boolean;
  toggleCrmConnectionError: () => void;
  showOnboarding: boolean;
  toggleOnboarding: () => void;
  onboardingStep: 'welcome' | 'select-ams' | 'connection-setup' | 'in-progress' | 'completed-first-step' | 'requoting-setup';
  setOnboardingStep: (step: 'welcome' | 'select-ams' | 'connection-setup' | 'in-progress' | 'completed-first-step' | 'requoting-setup') => void;
  selectedAms: string | null;
  setSelectedAms: (ams: string | null) => void;
  carrierGroups: CarrierGroups;
  setCarrierGroups: React.Dispatch<React.SetStateAction<CarrierGroups>>;
}

const ConfigContext = React.createContext<ConfigContextType>({
  showAmsConnectionError: false,
  toggleAmsConnectionError: () => {},
  showCrmConnectionError: false,
  toggleCrmConnectionError: () => {},
  showOnboarding: false,
  toggleOnboarding: () => {},
  onboardingStep: 'welcome',
  setOnboardingStep: () => {},
  selectedAms: null,
  setSelectedAms: () => {},
  carrierGroups: sampleCarriers,
  setCarrierGroups: () => {},
});

export const useConfig = () => React.useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [showAmsConnectionError, setShowAmsConnectionError] = useState(false);
  const [showCrmConnectionError, setShowCrmConnectionError] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'select-ams' | 'connection-setup' | 'in-progress' | 'completed-first-step' | 'requoting-setup'>('welcome');
  const [selectedAms, setSelectedAms] = useState<string | null>(null);
  const [carrierGroups, setCarrierGroups] = useState<CarrierGroups>(sampleCarriers);
  
  const toggleAmsConnectionError = () => {
    setShowAmsConnectionError((prev) => !prev);
  };
  
  const toggleCrmConnectionError = () => {
    setShowCrmConnectionError((prev) => !prev);
  };
  
  const toggleOnboarding = () => {
    setShowOnboarding((prev) => !prev);
  };
  
  return (
    <ConfigContext.Provider
      value={{
        showAmsConnectionError,
        toggleAmsConnectionError,
        showCrmConnectionError,
        toggleCrmConnectionError,
        showOnboarding,
        toggleOnboarding,
        onboardingStep,
        setOnboardingStep,
        selectedAms,
        setSelectedAms,
        carrierGroups,
        setCarrierGroups,
      }}
    >
      {children}
      <ConfigPanel />
    </ConfigContext.Provider>
  );
}

export function ConfigPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    showAmsConnectionError, 
    toggleAmsConnectionError,
    showCrmConnectionError,
    toggleCrmConnectionError,
    showOnboarding,
    toggleOnboarding,
    onboardingStep,
    setOnboardingStep,
  } = useConfig();
  
  return (
    <div className="fixed top-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg border shadow-lg w-64 overflow-hidden">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-medium text-sm">Configuration</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">AMS Connection Error</span>
                <div
                  onClick={toggleAmsConnectionError}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                    showAmsConnectionError ? "bg-green-500" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      showAmsConnectionError ? "translate-x-4" : "translate-x-0.5"
                    )}
                    style={{ margin: "2px 0" }}
                  />
                </div>
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm">CRM Connection Error</span>
                <div
                  onClick={toggleCrmConnectionError}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                    showCrmConnectionError ? "bg-green-500" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      showCrmConnectionError ? "translate-x-4" : "translate-x-0.5"
                    )}
                    style={{ margin: "2px 0" }}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm">Show Onboarding</span>
                <div
                  onClick={toggleOnboarding}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                    showOnboarding ? "bg-green-500" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      showOnboarding ? "translate-x-4" : "translate-x-0.5"
                    )}
                    style={{ margin: "2px 0" }}
                  />
                </div>
              </label>

              {showOnboarding && (
                <label className="flex items-center justify-between">
                  <span className="text-sm">Onboarding Step</span>
                  <select 
                    value={onboardingStep}
                    onChange={(e) => setOnboardingStep(e.target.value as 'welcome' | 'select-ams' | 'connection-setup' | 'in-progress' | 'completed-first-step' | 'requoting-setup')}
                    className="text-xs border rounded p-1"
                  >
                    <option value="welcome">Welcome</option>
                    <option value="select-ams">Select AMS</option>
                    <option value="connection-setup">Connection Setup</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed-first-step">First Step Completed</option>
                    <option value="requoting-setup">Re-quoting Setup</option>
                  </select>
                </label>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white p-2 rounded-lg border shadow-md hover:bg-gray-50"
        >
          <Settings2 className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
} 