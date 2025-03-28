import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function CityNotFound({ query }: { query: string }) {
  return (
    <main className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 h-40 w-40">
          <Image
            src="https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=1000&auto=format&fit=crop"
            alt="City not found"
            fill
            className="rounded-full object-cover"
            priority
          />
          <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-2 shadow-lg">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold">City Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          We couldn't find any data for "{query}". Please try searching for a different city.
        </p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </main>
  )
}