import { notFound } from "next/navigation"
import CityNotFound from "@/components/city-not-found"
import DetailedCityAnalytics from "@/components/detailed-city-analytics"

interface SearchPageProps {
  searchParams: { q?: string }
}

// This is a mock function - replace with actual API call
const validateCity = (city: string) => {
  const validCities = ["london", "new york", "tokyo", "paris"]
  return validCities.includes(city.toLowerCase())
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q

  if (!query) {
    notFound()
  }

  const isValidCity = validateCity(query)

  if (!isValidCity) {
    return <CityNotFound query={query} />
  }

  return (
    <main className="container py-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">{query}</h1>
      <DetailedCityAnalytics city={query} />
    </main>
  )
}

