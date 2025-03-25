"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CloseAccountSettings() {
  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-6">
        <div className="max-w-[640px] mx-auto px-4 pb-10">
          {/* Header with title */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-base font-medium text-gray-900">Close Account</h1>
              <p className="text-sm text-gray-500">
                Learn about account closure and data handling
              </p>
            </div>
          </div>

          {/* Information Card */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-sm font-medium mb-4">What happens when you close your account?</h2>
              
              <div className="space-y-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  When you close your ReFocus account:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Your subscription will be cancelled immediately</li>
                  <li>Access to the platform will be removed for all users</li>
                  <li>Your data will be securely archived for 60 days before permanent deletion</li>
                  <li>You'll receive an email confirmation of the account closure</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Need to switch your AMS instead? You can do that in the <Link href="/settings/ams" className="underline">AMS settings</Link>.
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  asChild
                  size="default"
                >
                  <Link href="https://share.hsforms.com/1cKYQNvogQa6mk6faCaNm2Q4sbg6">
                    Contact Us To Close Account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 