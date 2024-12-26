import React from 'react';
import { CreditCard, ArrowLeftRight, Building2, Smartphone } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";

export default function HomePage() {
  const transferMethods = [
    {
      icon: CreditCard,
      title: "Transfer via Card Number",
      amount: "$1500",
    },
    {
      icon: ArrowLeftRight,
      title: "Transfer via Other Banks",
      amount: "$1200",
    },
    {
      icon: Building2,
      title: "Transfer Same Bank",
      amount: "$2500",
    },
    {
      icon: Smartphone,
      title: "Transfer with UPI",
      amount: "$2200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {transferMethods.map((method) => (
        <Card key={method.title} className="bg-[#1C1F2E] border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <method.icon className="w-8 h-8 text-teal-500" />
              <button className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-400">{method.title}</div>
            <div className="text-xl font-semibold text-white mt-1">
              {method.amount}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

