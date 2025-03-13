"use client";

import * as React from "react";
import { useState } from "react";
import { Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Context to manage the configuration state
interface ConfigContextType {
  showAmsConnectionError: boolean;
  toggleAmsConnectionError: () => void;
}

const ConfigContext = React.createContext<ConfigContextType>({
  showAmsConnectionError: false,
  toggleAmsConnectionError: () => {},
});

export const useConfig = () => React.useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [showAmsConnectionError, setShowAmsConnectionError] = useState(false);
  
  const toggleAmsConnectionError = () => {
    setShowAmsConnectionError((prev) => !prev);
  };
  
  return (
    <ConfigContext.Provider
      value={{
        showAmsConnectionError,
        toggleAmsConnectionError,
      }}
    >
      {children}
      <ConfigPanel />
    </ConfigContext.Provider>
  );
}

export function ConfigPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { showAmsConnectionError, toggleAmsConnectionError } = useConfig();
  
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