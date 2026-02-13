"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Landmark,
  ArrowRight,
  Eye,
  ThumbsUp,
  Clock,
  BarChart3,
  Shield,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "Every issue is publicly visible with a complete status timeline from submission to resolution.",
  },
  {
    icon: ThumbsUp,
    title: "Community Prioritization",
    description:
      "Residents upvote issues to signal urgency, ensuring the most critical problems get attention first.",
  },
  {
    icon: Clock,
    title: "SLA Accountability",
    description:
      "Real-time SLA timers track response times with color-coded indicators for accountability.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Comprehensive dashboards show resolution rates, trending issues, and governance performance.",
  },
  {
    icon: Shield,
    title: "Official Workflow",
    description:
      "Government officials manage issues through a structured state machine with audit trails.",
  },
  {
    icon: Users,
    title: "Civic Engagement",
    description:
      "Bridge the gap between residents and government with an intuitive, accessible platform.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(217_91%_50%/0.08),transparent_60%)]" />
          <div className="relative mx-auto max-w-5xl px-4 py-20 text-center lg:py-32">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Landmark className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Transparent Civic
              <br />
              Issue Tracking
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
              CivicBridge transforms traditional complaint systems into transparent, accountable
              public workflows with visible state tracking, SLA monitoring, and community-driven
              prioritization.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/issues/new">
                <Button variant="outline" size="lg">
                  Report an Issue
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              How CivicBridge Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              A complete platform for civic engagement and government accountability
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group transition-all hover:shadow-md hover:border-primary/20"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Ready to improve your community?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start reporting issues and tracking civic progress today.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/issues/new">
                <Button size="lg">Report an Issue</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Browse Issues
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">CivicBridge</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Transparent governance for better communities
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
