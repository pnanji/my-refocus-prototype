// Mock subscription data for the billing page prototype
export const subscriptionData = {
  plan: "Momentum Silver",
  pricePerAccount: 5.00,
  servicePlanPercentage: 20,
  totalAccounts: 2434,
  remarketsPercentage: 12,
  features: [
    { name: "Unlimited policy monitoring", included: true },
    { name: "AMS & CRM integrations", included: true },
    { name: "Retention insights", included: true },
    { name: "12% of accounts eligible for remarketing", included: true }
  ],
  servicePlanFeatures: [
    { name: "Round Robin Retention Manager", included: true },
    { name: "ReFocus Guided Onboarding", included: true },
    { name: "Quarterly Strategy Meetings", included: true },
    { name: "5 Renewal Workflow Templates", included: true },
    { name: "10 Renewal Optimization Sessions per Quarter", included: true }
  ],
  usage: {
    remarketing: {
      used: 98,
      total: 292,
      overage: "$20 per additional remarket"
    },
    customRules: {
      used: 5,
      total: 100,
      addonPrice: "$100/month for unlimited rules"
    }
  },
  billingHistory: [
    {
      date: "December 2023",
      invoiceNumber: "INV-2023-12",
      amount: 6085.00,
      status: "Paid"
    },
    {
      date: "November 2023",
      invoiceNumber: "INV-2023-11",
      amount: 6085.00,
      status: "Paid"
    },
    {
      date: "October 2023",
      invoiceNumber: "INV-2023-10",
      amount: 6085.00,
      status: "Paid"
    }
  ],
  nextBillingDate: "January 1, 2024"
}; 