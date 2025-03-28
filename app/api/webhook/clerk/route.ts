import { database } from "@/config/firebase";
import { WebhookEvent } from "@clerk/nextjs/server";
import { ref, set } from "firebase/database";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      created_at,
    } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;

    // Save user data to Firebase RTDB
    const userRef = ref(database, `users/${id}`);
    await set(userRef, {
      id,
      email: primaryEmail,
      avatar: image_url,
      firstName: first_name,
      lastName: last_name,
      createdAt: created_at,
      lastUpdated: new Date().toISOString(),
    });
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
