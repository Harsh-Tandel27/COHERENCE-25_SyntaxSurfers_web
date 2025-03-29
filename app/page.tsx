"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { saveUserToFirebase } from "@/config/firebase"
import { useUser } from "@clerk/nextjs"
import { BarChart3, Cloud, Droplets, Lightbulb, MessageSquare, ShieldAlert, Truck, User } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function LandingPage() {
  const { user } = useUser()

  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        // Save user data to Firebase
        await saveUserToFirebase(user)
      }
    }
    saveUser()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Smart City Monitoring Platform
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Real-time insights into your city's vital systems. Monitor air quality, traffic conditions, water
                    levels, and energy usage all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">View Demo</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl border bg-background p-2 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 dark:from-blue-950 dark:via-blue-950 dark:to-indigo-950"></div>
                  <div className="relative z-10 h-full w-full rounded-lg border bg-background/80 backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs">City Dashboard</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Air Quality</div>
                        <div className="mt-1 text-lg font-medium">Good (32 AQI)</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[32%] rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Traffic Flow</div>
                        <div className="mt-1 text-lg font-medium">Moderate</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[65%] rounded-full bg-yellow-500"></div>
                        </div>
                      </div>
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Water Levels</div>
                        <div className="mt-1 text-lg font-medium">Normal (78%)</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[78%] rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Energy Usage</div>
                        <div className="mt-1 text-lg font-medium">Low (42%)</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[42%] rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-md border p-2">
                      <div className="text-xs text-muted-foreground">Recent Alerts</div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span>Minor traffic congestion on Main St.</span>
                          <span className="ml-auto text-muted-foreground">10m ago</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>Air quality improved in Downtown.</span>
                          <span className="ml-auto text-muted-foreground">25m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live City Metrics */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Live City Metrics</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real-time data from sensors across the city, providing insights into urban conditions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-500" />
                    Air Quality
                  </CardTitle>
                  <CardDescription>Current AQI readings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">32 AQI</div>
                  <p className="text-xs text-muted-foreground">Good air quality</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[32%] rounded-full bg-green-500"></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150</span>
                    <span>200+</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-yellow-500" />
                    Traffic
                  </CardTitle>
                  <CardDescription>Current congestion levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">65%</div>
                  <p className="text-xs text-muted-foreground">Moderate congestion</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[65%] rounded-full bg-yellow-500"></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Water Levels
                  </CardTitle>
                  <CardDescription>Reservoir capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">Normal water levels</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[78%] rounded-full bg-blue-500"></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Energy Usage
                  </CardTitle>
                  <CardDescription>City-wide consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42%</div>
                  <p className="text-xs text-muted-foreground">Below average usage</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-full w-[42%] rounded-full bg-green-500"></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span>Low</span>
                    <span>Average</span>
                    <span>High</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" className="gap-1">
                <BarChart3 className="h-4 w-4" />
                View Detailed Analytics
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Platform Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive suite of tools helps city managers make data-driven decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Real-time Monitoring",
                  description: "Get instant updates on all city systems with our real-time monitoring dashboard.",
                  icon: BarChart3,
                },
                {
                  title: "Smart Alerts",
                  description: "Receive notifications when metrics exceed normal thresholds or require attention.",
                  icon: ShieldAlert,
                },
                {
                  title: "Data Analytics",
                  description: "Analyze historical data to identify patterns and make informed decisions.",
                  icon: BarChart3,
                },
                {
                  title: "Mobile Access",
                  description: "Access your dashboard from anywhere with our mobile-responsive platform.",
                  icon: User,
                },
                {
                  title: "Community Engagement",
                  description: "Enable citizen reporting and feedback to improve city services.",
                  icon: MessageSquare,
                },
                {
                  title: "Custom Reports",
                  description: "Generate detailed reports for stakeholders and city officials.",
                  icon: BarChart3,
                },
              ].map((feature, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your City?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join hundreds of cities worldwide using our platform to improve urban living.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Cloud className="h-6 w-6 text-primary" />
            <span>SmartCity</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/about" className="text-xs hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/features" className="text-xs hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="/pricing" className="text-xs hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="/contact" className="text-xs hover:underline underline-offset-4">
              Contact
            </Link>
            <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
          </nav>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SmartCity Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

