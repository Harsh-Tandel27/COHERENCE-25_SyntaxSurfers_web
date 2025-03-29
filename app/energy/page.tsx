"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bolt, Cloud, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

const EnergyConsumptionDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.electricitymap.org/v3/power-breakdown/latest?zone=IN-WE",
      {
        method: "GET",
        headers: {
          "auth-token": "lRvsnEiOCnQIa6wTlia0",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Error loading data</p>;

  const stats = [
    {
      title: "Total Consumption",
      value: `${data?.powerConsumptionTotal} MW`,
      description: "Total energy consumed",
      color: "bg-blue-500",
      icon: Bolt,
    },
    {
      title: "Total Production",
      value: `${data?.powerProductionTotal} MW`,
      description: "Total energy produced",
      color: "bg-green-500",
      icon: TrendingUp,
    },
    {
      title: "Total Imports",
      value: `${data?.powerImportTotal} MW`,
      description: "Imported energy",
      color: "bg-yellow-500",
      icon: TrendingDown,
    },
    {
      title: "Total Exports",
      value: `${data?.powerExportTotal} MW`,
      description: "Exported energy",
      color: "bg-red-500",
      icon: Cloud,
    },
  ];

  const powerBreakdown = Object.entries(data?.powerConsumptionBreakdown).map(
    ([key, value]) => ({ name: key, value })
  );

  const historicalData = Array.from({ length: 7 }, (_, i) => ({
    datetime: `Day ${i + 1}`,
    powerConsumptionTotal: data?.powerConsumptionTotal - i * 1000,
    powerProductionTotal: data?.powerProductionTotal - i * 900,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Traffic Congestion</h1>
        <p className="text-muted-foreground">
          Real-time traffic data and congestion analysis
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2" />
                ) : (
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                )}
                {loading ? (
                  <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {loading ? (
                  <Skeleton className="h-5 w-5" />
                ) : (
                  <stat.icon className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
          </Card>
        ))}

        <div className="col-span-2">
          <h2 className="text-2xl font-bold">
            Energy Consumption vs Production
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={historicalData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="datetime" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="powerConsumptionTotal"
                stroke={COLORS[0]}
                strokeWidth={2}
                name="Consumption"
              />
              <Line
                type="monotone"
                dataKey="powerProductionTotal"
                stroke={COLORS[1]}
                strokeWidth={2}
                name="Production"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2">
          <h2 className="text-2xl font-bold">Power Consumption Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={powerBreakdown}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {powerBreakdown.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EnergyConsumptionDashboard;
