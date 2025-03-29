// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { get, getDatabase, ref, set } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_oosrhMrq4oEHsJXy_lYm9gKOHETbNPM",
  authDomain: "syntaxsurfers-hackathon.firebaseapp.com",
  projectId: "syntaxsurfers-hackathon",
  storageBucket: "syntaxsurfers-hackathon.firebasestorage.app",
  messagingSenderId: "560851073910",
  appId: "1:560851073910:web:a454769b4be0f8dbb79857",
  measurementId: "G-W2X4MWG7H6",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const database = getDatabase(app)
export async function saveUserToFirebase(userData: any) {
  try {
    const userRef = ref(database, `users/${userData.id}`)

    // Check if user already exists
    const snapshot = await get(userRef)
    const existingUser = snapshot.val()

    // If user exists, only update if data has changed
    if (existingUser) {
      const newUserData = {
        id: userData.id,
        email: userData.emailAddresses[0]?.emailAddress,
        avatar: userData.imageUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: existingUser.createdAt, // Keep original creation date
        lastUpdated: new Date().toISOString(),
      }

      // Check if any data has actually changed
      const hasChanges = Object.keys(newUserData).some(
        (key) =>
          // @ts-ignore
          newUserData[key] !== existingUser[key] && key !== "lastUpdated",
      )

      if (hasChanges) {
        await set(userRef, newUserData)
        console.log("User data updated:", userData.id)
      } else {
        console.log("No changes detected for user:", userData.id)
      }
    } else {
      // New user, save with current timestamp
      await set(userRef, {
        id: userData.id,
        email: userData.emailAddresses[0]?.emailAddress,
        avatar: userData.imageUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      })
      console.log("New user created:", userData.id)
    }
  } catch (error) {
    console.error("Error saving user to Firebase:", error)
    throw error
  }
}

