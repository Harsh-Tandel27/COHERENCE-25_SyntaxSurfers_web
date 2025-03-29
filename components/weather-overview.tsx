"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/context/UserContext"
import { Bell, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface NewsArticle {
  title: string
  description: string
  url: string
  published_at: string
  source: string
}

export default function WeatherAlert() {
  const [newsAlerts, setNewsAlerts] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const { place } = useUser()

  useEffect(() => {
    const fetchNewsAlerts = async () => {
      try {
        setLoading(true)
        // Use TheNewsAPI to fetch weather-related news for the user's location
        const API_KEY = process.env.NEXT_PUBLIC_THENEWSAPI_KEY
        const response = await fetch(
          `https://api.thenewsapi.com/v1/news/all?api_token=${API_KEY}&search=${place}+weather+alert&language=en&limit=5`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch news alerts")
        }

        const data = await response.json()
        setNewsAlerts(data.data || [])
      } catch (error) {
        console.error("Error fetching news alerts:", error)
        // Fallback to sample data if API fails
        setNewsAlerts([
          {
            title: "Heavy Rain Expected in Downtown Area",
            description: "Meteorologists predict significant rainfall over the next 48 hours.",
            url: "#",
            published_at: new Date().toISOString(),
            source: "Weather Service",
          },
          {
            title: "Heat Wave Warning Issued",
            description: "Temperatures expected to rise above normal levels this weekend.",
            url: "#",
            published_at: new Date(Date.now() - 86400000).toISOString(),
            source: "National Weather Center",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchNewsAlerts()
  }, [place])

  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center">
        <Bell className="h-6 w-6 mr-2 text-red-500" /> Weather Alerts
      </h2>

      {loading ? (
        <>
          <Skeleton className="h-[80px] w-full" />
          <Skeleton className="h-[80px] w-full" />
        </>
      ) : newsAlerts.length > 0 ? (
        newsAlerts.map((alert, index) => (
          <Card key={index} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-red-800 dark:text-red-300">{alert.title}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(alert.published_at)}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{alert.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Source: {alert.source}</span>
                {alert.url !== "#" && (
                  <a
                    href={alert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Read more <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No weather alerts found for your area.</p>
      )}
    </div>
  )
}

