import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import FlightSearchForm from "../../components/FlightSearchForm";
import GlobalFlightTracker from "../../components/GlobalFlightTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Bell, Info, Megaphone, Tag, Plane, Globe, Shield, MapPin, Calendar, Users } from 'lucide-react';

import './styles.css'

// This would typically come from an API or database
const promotions = [
    { id: 1, title: "Summer Sale", description: "Get up to 20% off on select flights to Europe", link: "/promotions/summer-sale", image: "/placeholder.svg?height=200&width=300" },
    { id: 2, title: "Business Class Upgrade", description: "Upgrade to Business Class for just $200 on long-haul flights", link: "/promotions/business-upgrade", image: "/placeholder.svg?height=200&width=300" },
    { id: 3, title: "Frequent Flyer Bonus", description: "Earn double miles on all flights this month", link: "/promotions/frequent-flyer-bonus", image: "/placeholder.svg?height=200&width=300" },
]

const news = [
    { id: 1, title: "New Direct Route to Paris", content: "We're excited to announce our new direct route from New York to Paris, starting next month!", date: "2023-06-01", image: "/placeholder.svg?height=150&width=250" },
    { id: 2, title: "QAirline Wins Best Airline Award", content: "QAirline has been voted the Best Airline of 2023 by Skytrax, recognizing our commitment to excellence in service and safety.", date: "2023-05-15", image: "/placeholder.svg?height=150&width=250" },
    { id: 3, title: "Introducing In-Flight Wi-Fi", content: "Stay connected at 30,000 feet with our new high-speed in-flight Wi-Fi, now available on all international flights.", date: "2023-05-01", image: "/placeholder.svg?height=150&width=250" },
]

const destinations = [
    { name: "Paris", image: "/placeholder.svg?height=300&width=400" },
    { name: "Tokyo", image: "/placeholder.svg?height=300&width=400" },
    { name: "New York", image: "/placeholder.svg?height=300&width=400" },
    { name: "Sydney", image: "/placeholder.svg?height=300&width=400" },
]

const alerts = [
    { id: 1, title: "COVID-19 Travel Updates", description: "Stay informed about the latest travel restrictions and requirements. Check our regularly updated COVID-19 information page.", link: "/covid-19-updates" },
    { id: 2, title: "Airport Construction Notice", description: "Ongoing construction at Terminal 2 may cause slight delays. Please arrive early and follow signage for alternative routes.", link: "/airport-updates" },
]
const Home = () => {
    return (
        <main className="main-container">
            <section className="hero-section">
                <image
                    src="/placeholder.svg?height=600&width=1600"
                    alt="QAirline fleet flying over a cityscape"
                    layout="fill"
                    objectFit="cover"
                    className="hero-image"
                />
                <div className="hero-content">
                    <h1 className="hero-title">Discover Your Next Adventure</h1>
                    <p className="hero-subtitle">Fly with QAirline to over 150 destinations worldwide</p>
                    <Button className="hero-content_btn" size="lg" asChild>
                        <Link className="hero-content_link" href="/flights">Book Now</Link>
                    </Button>
                </div>
            </section>
        </main>
    )

};

export default Home;
