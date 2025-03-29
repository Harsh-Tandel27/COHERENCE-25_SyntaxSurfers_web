"use client"; // Ensures this runs only on the client

import { database } from "@/config/firebase";
import { useAuth } from "@clerk/nextjs";
import { get, ref } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  userId: string | null | undefined;
  place: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [_userId, setUserId] = useState<string | null>();
  const [place, setPlace] = useState<string>("Palghar");
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined" || !database) return; // Prevents SSR errors

    // Fetch authenticated user from Clerk
    if (userId) {
      setUserId(userId);

      const userRef = ref(database, `users/${userId}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setPlace(snapshot.val().place || "DefaultCity");
            console.log("place--", snapshot.val().place);
          } else {
            console.log("No data found for user.");
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId, isLoaded]);

  return (
    <UserContext.Provider value={{ userId, place }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
