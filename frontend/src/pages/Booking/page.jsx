'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Clock, MapPin, AlertTriangle, CreditCard, Luggage, Utensils, Wifi, Film, CloudSun, QrCode, Phone, ChevronDown, ChevronUp, Sun, Cloud, CloudRain, Wind, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import Link from 'next/link'
import "./booking.css";

export default function Bookings() {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [upcomingFlights, setUpcomingFlights] = useState({});
    const [pastFlights, setPastFlights] = useState({});
    const [bookingInfos, setBookingInfos] = useState({});
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                const userId = '6749fb9b6904a9ed9d4a4a56';
                const userEndpoint = `https://qairline-t28f.onrender.com/api/users/674b6d8245ff24b20112416a`
                const upcomingBookingsEndpoint = `https://qairline-t28f.onrender.com/api/bookings/user/674b6d8245ff24b20112416a?type=Upcoming`;
                const pastBookingsEndpoint = `https://qairline-t28f.onrender.com/api/bookings/user/674b6d8245ff24b20112416a?type=Past`;

                const [upcomingBookingResponse, pastBookingResponse, userResponse] = await Promise.all([
                    fetch(upcomingBookingsEndpoint),
                    fetch(pastBookingsEndpoint),
                    fetch(userEndpoint)
                ]);

                const upcomingBookingData = await upcomingBookingResponse.json();
                const pastBookingData = await pastBookingResponse.json();
                const userData = await userResponse.json();

                setUpcomingBookings(upcomingBookingData);
                setPastBookings(pastBookingData);
                setUser(userData);

                // console.log(upcomingBookingData);
                // console.log(pastBookingData);

                const upcomingFlightData = {};
                await Promise.all(
                    upcomingBookingData.map(async (booking) => {
                        if (booking.flightID) {
                            const flightEndpoint = `https://qairline-t28f.onrender.com/api/flights/${booking.flightID}`;
                            const flightResponse = await fetch(flightEndpoint);
                            const flightData = await flightResponse.json();
                            upcomingFlightData[booking.flightID] = flightData;
                        }
                    })
                );
                setUpcomingFlights(upcomingFlightData);

                const pastFlightData = {};
                await Promise.all(
                    pastBookingData.map(async (booking) => {
                        if (booking.flightID) {
                            const flightEndpoint = `https://qairline-t28f.onrender.com/api/flights/${booking.flightID}`;
                            const flightResponse = await fetch(flightEndpoint);
                            const flightData = await flightResponse.json();
                            pastFlightData[booking.flightID] = flightData;
                        }
                    })
                );
                setPastFlights(pastFlightData);
                const bookingInfoData = {};
                await Promise.all(
                    upcomingBookingData.map(async (booking) => {
                        if (booking._id) {
                            const bookingInfoEndpoint = `https://qairline-t28f.onrender.com/api/bookings/${booking._id}`;
                            const bookingInfoResponse = await fetch(bookingInfoEndpoint);
                            const bookingInfo = await bookingInfoResponse.json();
                            bookingInfoData[booking._id] = bookingInfo;
                        }
                    })
                );
                setBookingInfos(bookingInfoData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleCancelBooking = async (id) => {
        console.log(id);
        const booking = upcomingBookings.find(b => b._id === id);
        console.log(booking);
        if (booking) {
            const departureDate = new Date(booking.departureTime);
            const now = new Date();
            const timeDiff = departureDate.getTime() - now.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
    
            if (daysDiff > 1) {
                try {
                    const response = await fetch(`https://qairline-t28f.onrender.com/api/bookings/${id}`, {
                        method: 'DELETE',
                    });
    
                    if (response.ok) {
                        setUpcomingBookings(upcomingBookings.map(b =>
                            b.id === id ? { ...b, status: 'Cancelled' } : b
                        ));
                        toast({
                            title: "Booking Cancelled",
                            description: `Your booking for flight ${booking.flightNumber} has been cancelled.`,
                        });
                    } else {
                        console.log(id);
                        console.error("Failed to cancel booking:", response.status, response.statusText);
                        toast({
                            title: "Cancellation Failed",
                            description: "There was an issue cancelling your booking. Please try again later.",
                            variant: "destructive",
                        });
                    }
                } catch (error) {
                    console.error("Error cancelling booking:", error);
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred while cancelling your booking.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Cancellation Not Allowed",
                    description: "Cancellation is not allowed within 24 hours of departure.",
                    variant: "destructive",
                });
            }
        }
    };
    

    if (isLoading) {
        return <div>Loading data, please wait...</div>;
    }

    return (
        <div className="container">
            <h1 className="heading">My Bookings</h1>

            <Tabs defaultValue="upcoming" className="tabs">
                <TabsList className="tabs-list" style={{ marginBottom: '1.5rem' }}>
                    <TabsTrigger value="upcoming">Upcoming Flights</TabsTrigger>
                    <TabsTrigger value="past">Past Flights</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <div className="cards-container">
                        {upcomingBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancelBooking}
                                isPast={false}
                                flight={upcomingFlights[booking.flightID]}
                                user={user}
                                bookingInfo={bookingInfos[booking._id]}
                            />
                        ))}
                        {upcomingBookings.length === 0 && (
                            <Card>
                                <CardContent className="empty-state">
                                    <Plane className="empty-state-icon" />
                                    <p className="empty-state-title">No upcoming bookings</p>
                                    <p className="empty-state-description">
                                        Your future flights will appear here.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="past">
                    <div className="cards-container">
                        {pastBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancelBooking}
                                isPast={true}
                                flight={pastFlights[booking.flightID]}
                                user={user}
                                bookingInfo={bookingInfos[booking._id]}
                            />
                        ))}
                        {pastBookings.length === 0 && (
                            <Card>
                                <CardContent className="empty-state">
                                    <Plane className="empty-state-icon" />
                                    <p className="empty-state-title">No past bookings</p>
                                    <p className="empty-state-description">
                                        Your flight history will appear here.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>


    )
}


function BookingCard({ booking, onCancel, isPast, flight, user, bookingInfo }) {
    const [progress, setProgress] = useState(0)
    const [countdown, setCountdown] = useState('')
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        const updateBooking = () => {
            const now = new Date().getTime()
            const departure = new Date(booking.departureTime).getTime()
            const arrival = new Date(booking.arrivalTime).getTime()

            if (now < departure) {
                const timeToDepature = departure - now
                setCountdown(formatDuration(timeToDepature))
                setProgress(0)
            } else if (now < arrival) {
                const totalDuration = arrival - departure
                const elapsed = now - departure
                const newProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
                setProgress(newProgress)
                const timeToArrival = arrival - now
                setCountdown(formatDuration(timeToArrival))
            } else {
                setProgress(100)
                setCountdown('Arrived')
            }
        }

        updateBooking()
        const timer = setInterval(updateBooking, 60000) // Update every minute

        return () => clearInterval(timer)
    }, [booking])

    const formatDuration = (duration) => {
        const days = Math.floor(duration / (1000 * 60 * 60 * 24))
        const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
        return `${days}d ${hours}h ${minutes}m`
    }


    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        switch (status.toLowerCase()) {
            case 'scheduled': return 'bg-blue-100 text-blue-800'
            case 'on time': return 'bg-green-100 text-green-800'
            case 'delayed': return 'bg-yellow-100 text-yellow-800'
            case 'boarding': return 'bg-purple-100 text-purple-800'
            case 'in air': return 'bg-indigo-100 text-indigo-800'
            case 'landed': return 'bg-teal-100 text-teal-800'
            case 'arrived': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const inFlightServiceIcons = {
        wifi: <Wifi className="h-4 w-4" />,
        meal: <Utensils className="h-4 w-4" />,
        entertainment: <Film className="h-4 w-4" />,
        flatbed: <Luggage className="h-4 w-4" />,
    }

    return (
        <Card className="card-container">
            <CardHeader className="booking-card-header">
                <CardTitle className="booking-card-title">
                    <div className="booking-airline-info">
                        <Image src={booking.airlineLogo} alt={booking.airline} width={30} height={30} className="airline-logo" />
                        <span>{flight.aircraft.code} {flight.aircraft.manufacturer}</span>
                    </div>
                    <Badge variant="outline" className={`status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </Badge>
                </CardTitle>
                <CardDescription className="booking-card-description">
                    Booking Reference: {booking.bookingReference} • Passenger: {user?.name || 'N/A'}
                </CardDescription>
            </CardHeader>





            <CardContent className="booking-card-content">
                <div className="booking-flight-info">
                    <div className="departure-info">
                        <MapPin className="icon" size={18} />
                        <div>
                            <p className="city">{booking.departureAirport.city}</p>
                            <p className="time">{new Date(booking.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    <Plane className="plane-icon" size={24} />
                    <div className="arrival-info">
                        <div>
                        <p className="city">{booking.arrivalAirport.city}</p>
                        <p className="time">{new Date(booking.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                {!isPast && (
                    <div className="progress-info">
                        <h3 className="progress-title">
                            <Clock className="clock-icon" size={18} />
                            {progress === 0 ? 'Time to Departure' : (progress === 100 ? 'Flight Status' : 'Time to Arrival')}
                        </h3>
                        <p className="progress-text">
                            {progress === 100 ? `Arrived at ${new Date(booking.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : countdown}
                        </p>
                    </div>
                )}

                <div className="flight-details">
                    <div>
                        <p className="detail-label">Seat</p>
                        <p className="detail-value">{booking.seat}</p>
                    </div>
                    <div>
                        <p className="detail-label">Class</p>
                        <p className="detail-value">{bookingInfo.flightClass}</p>
                    </div>
                    <div>
                        <p className="detail-label">Gate</p>
                        <p className="detail-value">{booking.gate || 'TBA'}</p>
                    </div>
                    <div>
                        <p className="detail-label">Terminal</p>
                        <p className="detail-value">{booking.terminal || 'TBA'}</p>
                    </div>
                </div>

                <div className="in-flight-services">
                    <p className="services-label">In-flight Services</p>
                    <div className="services-icons">
                        {/* {booking.inFlightServices.map((service) => (
                            <TooltipProvider key={service}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="service-icon">
                                            {inFlightServiceIcons[service]}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="capitalize">{service}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))} */}
                    </div>
                </div>

                {booking.status === 'Delayed' && (
                    <div className="delay-warning">
                        <AlertTriangle className="alert-icon" size={20} />
                        <p className="alert-text">This flight is experiencing delays. Please check with the airline for more information.</p>
                    </div>
                )}

                <div className="weather-info">
                    <div className="weather-card">
                        <h4 className="weather-title">
                            <CloudSun className="weather-icon" size={18} />
                            Departure Weather
                        </h4>
                        <div className="weather-details">
                            {/* {booking.departureWeather.icon} */}
                            {/* <span>{booking.departureWeather.condition}, {booking.departureWeather.temperature}°C</span> */}
                        </div>
                    </div>
                    <div className="weather-card">
                        <h4 className="weather-title">
                            <CloudSun className="weather-icon" size={18} />
                            Arrival Weather
                        </h4>
                        <div className="weather-details">
                            {/* {booking.arrivalWeather.icon} */}
                            {/* <span>{booking.arrivalWeather.condition}, {booking.arrivalWeather.temperature}°C</span> */}
                        </div>
                    </div>
                </div>
            </CardContent>


            <CardFooter className="card-footer">
                {!isPast && (
                    <>
                        <div className="footer-top">
                            <div className="boarding-info">
                                <QrCode className="icon" size={24} />
                                <span className="text">Scan for boarding pass</span>
                            </div>
                            <div className="support-info">
                                <Phone className="icon" size={18} />
                                <span className="text">Support: +1 (800) 123-4567</span>
                            </div>
                        </div>
                        <div className="footer-actions">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="button-outline">Change Flight</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Change Flight</DialogTitle>
                                        <DialogDescription>
                                            This feature is not yet implemented. In a real application, you would be able to search for and select a new flight here.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button type="button" variant="secondary">Close</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="destructive"
                                className="button-destructive"
                                onClick={() => onCancel(booking._id)}
                            >
                                <X className="icon" size={18} />
                                Cancel Booking
                            </Button>
                        </div>
                        <div className="footer-policy">
                            <Link href="/terms" className="link">View change/cancel policy</Link>
                        </div>
                    </>
                )}
                <Button
                    variant="outline"
                    className="button-toggle"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                    {showDetails ? <ChevronUp className="icon" size={18} /> : <ChevronDown className="icon" size={18} />}
                </Button>
                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="details-expanded"
                        >
                            <div className="details-content">
                                <div>
                                    <h4 className="details-title">Flight Details</h4>
                                    <p>Aircraft: {booking.aircraft}</p>
                                    <p>Flight Duration: {formatDuration(new Date(booking.arrivalTime).getTime() - new Date(booking.departureTime).getTime())}</p>
                                </div>
                                <div>
                                    <h4 className="details-title">Baggage Information</h4>
                                    <p>Checked Baggage: {booking.baggage}</p>
                                    <p>Additional Baggage: {booking.additionalBaggage}</p>
                                </div>
                                <div>
                                    <h4 className="details-title">Meal Preference</h4>
                                    <p>{booking.meal}</p>
                                </div>
                                <div>
                                    <h4 className="details-title">Price Breakdown</h4>
                                    <div className="price-breakdown">
                                        <div className="price-item">
                                            <span>Base Fare</span>
                                            <span>${(booking.price * 0.7).toFixed(2)}</span>
                                        </div>
                                        <div className="price-item">
                                            <span>Taxes & Fees</span>
                                            <span>${(booking.price * 0.25).toFixed(2)}</span>
                                        </div>
                                        <div className="price-item">
                                            <span>Service Charge</span>
                                            <span>${(booking.price * 0.05).toFixed(2)}</span>
                                        </div>
                                        <div className="price-item total">
                                            <span>Total</span>
                                            <span>${booking.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardFooter>


        </Card>

    )
}

