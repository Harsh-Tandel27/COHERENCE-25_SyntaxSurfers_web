"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import { get, getDatabase, ref } from "firebase/database";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAlerts = async () => {
      try {
        const { userId } = useAuth();
        if (!userId) return;

        const db = getDatabase();
        const userRef = ref(db, `users/${userId}/alerts`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setAlerts(Object.values(snapshot.val()));
        } else {
          setAlerts([]);
        }
      } catch (error) {
        console.error("Error fetching user alerts:", error);
      }
      setLoading(false);
    };

    fetchUserAlerts();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center">
        <Bell className="h-6 w-6 mr-2 text-red-500" /> Weather Alerts
      </h2>

      {loading ? (
        <Skeleton className="h-[80px] w-full" />
      ) : alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <Card key={index} className="p-4 bg-red-100 border border-red-400">
            <p className="text-sm font-medium text-red-800">{alert}</p>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No alerts found.</p>
      )}
    </div>
  );
}
