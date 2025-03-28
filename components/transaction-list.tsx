"use client"

import { Card } from "@/components/ui/card"
import { Cloud, Sun, CloudRain } from "lucide-react"

const transactions = [
  {
    id: 1,
    title: "Heavy Rain Alert",
    time: "01:21 pm",
    date: "Dec 3, 2022",
    amount: "Severe",
    icon: CloudRain,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    title: "Clear Skies",
    time: "01:21 pm",
    date: "Dec 4, 2022",
    amount: "Moderate",
    icon: Sun,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  {
    id: 3,
    title: "Storm Warning",
    time: "01:21 pm",
    date: "Dec 5, 2022",
    amount: "High",
    icon: Cloud,
    iconColor: "text-gray-500",
    bgColor: "bg-gray-100",
  },
]

export default function TransactionList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weather Alerts</h2>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${transaction.bgColor}`}>
                <transaction.icon className={`h-5 w-5 ${transaction.iconColor}`} />
              </div>
              <div>
                <p className="font-medium">{transaction.title}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{transaction.amount}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}