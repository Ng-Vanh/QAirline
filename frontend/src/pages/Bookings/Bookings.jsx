'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Users } from 'lucide-react'
import BookingsStyle from './Bookings.module.css'
import { useAuth } from '../../components/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Config from '../../Config.js'
import * as Toast from "@radix-ui/react-toast"

export default function Bookings() {
    const { isAuthenticated, name, userId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const apiBaseUrl = Config.apiBaseUrl;

    const handleLoginRedirect = () => {
        navigate('/login', {
            state: {
                from: location.pathname,
                prevState: {
                    // dropdownState: isDropdownOpen,
                },
            },
        });
    };

    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState({
        title: '',
        description: '',
        type: '',
    });

    const showToast = (title, description, type) => {
        setToastMessage({ title, description, type });
        setIsToastOpen(true);
    }

    // const getCurrentUser = async () => {
    //     const userData = localStorage.getItem('user');
    //     if (userData) {
    //         const user = JSON.parse(userData);
    //         console.log("data: ", user)
    //         if (user.userId) {
    //             setCurrentUser(user);
    //             console.log(`Current user: ${user.userId}`)
    //         }
    //     }
    //     else {
    //         console.log('User not in local storage.')
    //     }
    // }

    // useEffect(() => {
    //     getCurrentUser()
    // }, []
    // )

    const [activeTab, setActiveTab] = useState('upcoming')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [sortBy, setSortBy] = useState('departureDate')
    const [countdowns, setCountdowns] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeTab === 'upcoming') {
                const updatedCountdowns = {};
                bookings.forEach((booking) => {
                    const now = new Date();
                    const departureTime = new Date(booking.departureTime);
                    const timeDiff = departureTime - now;

                    if (timeDiff > 0) {
                        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                        if (days > 0) {
                            updatedCountdowns[booking._id] = `${days}d ${hours}h ${minutes}m`;
                        } else if (hours > 0) {
                            updatedCountdowns[booking._id] = `${hours}h ${minutes}m ${seconds}s`;
                        } else if (minutes > 0) {
                            updatedCountdowns[booking._id] = `${minutes}m ${seconds}s`;
                        } else {
                            updatedCountdowns[booking._id] = `${seconds}s`;
                        }
                    } else {
                        updatedCountdowns[booking._id] = 'Departed';
                    }
                });
                setCountdowns(updatedCountdowns);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [bookings, activeTab]);


    const renderCountdown = (bookingId) => {
        const countdownValue = countdowns[bookingId];
        if (!countdownValue) {
            return '';
        }
        else if (countdownValue === 'Departed') {
            return '';
        }
        else {
            return "Time until departure: " + countdownValue;
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            console.log("Is authen")
            fetchBookings('upcoming');
        }
        else {
            handleLoginRedirect();
        }
    }, [isAuthenticated])

    const fetchBookings = async (tab) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiBaseUrl}/api/bookings/user/${userId}?type=${tab === 'upcoming' ? 'Upcoming' : 'Past'}`)
            if (!response.ok) throw new Error('Failed to fetch bookings')
            const data = await response.json()
            setBookings(data)
        } catch (err) {
            setError('An error occurred while fetching bookings. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     fetchBookings();
    // }, [activeTab])

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/bookings/${bookingId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to cancel booking')
            const data = await response.json()
            // alert(data.message)
            showToast('Booking Cancelled', 'Your booking has been successfully cancelled.', 'success');
            fetchBookings()
        } catch (err) {
            // alert('An error occurred while cancelling the booking. Please try again.')
            showToast('Error', 'An error occurred while cancelling the booking. Please try again.', 'error');
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const canCancelBooking = (booking) => {
        if (!booking || !booking.bookingDate || !booking.departureTime) {
            throw new Error("Invalid booking data");
        }

        const now = new Date();
        const bookingTime = new Date(booking.bookingDate);
        const departureTime = new Date(booking.departureTime);

        if (isNaN(bookingTime) || isNaN(departureTime)) {
            throw new Error("Invalid date format in booking data");
        }

        const hoursSinceBooking = (now - bookingTime) / (1000 * 3600);
        const hoursUntilDeparture = (departureTime - now) / (1000 * 3600);

        const MAX_HOURS_SINCE_BOOKING = 24;
        const MIN_HOURS_BEFORE_DEPARTURE = 0.5;

        return hoursSinceBooking <= MAX_HOURS_SINCE_BOOKING && hoursUntilDeparture > MIN_HOURS_BEFORE_DEPARTURE;
    };

    const sortedBookings = [...bookings].sort((a, b) => {
        if (sortBy === 'departureDate') {
            return new Date(a.departureTime) - new Date(b.departureTime)
        } else {
            return new Date(b.bookingDate) - new Date(a.bookingDate)
        }
    })

    const renderBookings = () => {
        if (loading) {
            return (
                <div className={BookingsStyle.loading_spinner}>
                    <div className={BookingsStyle.spinner}></div>
                </div>
            )
        }

        if (error) {
            return <div className={BookingsStyle.error_message}>{error}</div>
        }

        if (bookings.length === 0) {
            return (
                <div className={BookingsStyle.empty_state}>
                    <Plane className={BookingsStyle.empty_state_icon} />
                    <p className={BookingsStyle.empty_state_text}>No bookings found</p>
                    <p className={BookingsStyle.empty_state_subtext}>Your {activeTab} flights will appear here.</p>
                </div>
            )
        }

        return (
            <AnimatePresence>
                <div className={BookingsStyle.booking_count}>Showing {bookings.length} bookings</div>
                <div className={BookingsStyle.booking_list}>
                    {sortedBookings.map((booking) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={BookingsStyle.booking_card_container}>
                                <div className={`${BookingsStyle.booking_card} ${activeTab === 'upcoming' && canCancelBooking(booking) ? BookingsStyle.booking_card_can_cancel : ''}`}>


                                    <div className={`${BookingsStyle.booking_header} ${BookingsStyle[`booking_header_${booking.flightClass}`]}`}>

                                        <div className={BookingsStyle.header_watermark}>
                                            {booking.flightClass} {booking.flightClass}
                                        </div>

                                        <div className={BookingsStyle.header_ends}>
                                            <div className={BookingsStyle.flight_code_container}>
                                                <span className={BookingsStyle.flight_code}>{booking.flightCode}</span>
                                                <span className={BookingsStyle.aircraft_model}>{booking.aircraftModel}</span>
                                            </div>

                                            <span className={`${BookingsStyle.flight_status} ${BookingsStyle[`status_${booking.flightStatus.toLowerCase().replace(' ', '_')}`]}`}>
                                                {booking.flightStatus}
                                            </span>
                                        </div>

                                        <button
                                            className={BookingsStyle.passenger_button}
                                            onClick={() => {
                                                setSelectedBooking(booking)
                                                setShowModal(true)
                                            }}
                                        >
                                            <Users className={BookingsStyle.passenger_icon} size={16} />
                                            {booking.passengerCount} Passenger{booking.passengerCount > 1 ? 's' : ''}
                                        </button>



                                    </div>


                                    <div className={BookingsStyle.booking_content}>
                                        <div className={BookingsStyle.flight_info}>
                                            <div className={BookingsStyle.airport_info}>
                                                <p className={BookingsStyle.city}>{booking.departureAirport.city}</p>
                                                <p className={BookingsStyle.airport}>{booking.departureAirport.code}</p>
                                                <p className={BookingsStyle.time}>{formatDate(booking.departureTime)}</p>
                                            </div>
                                            <div className={BookingsStyle.flight_duration}>
                                                <Plane className={BookingsStyle.flight_icon} />
                                                <span className={BookingsStyle.duration}>{booking.flightDuration}</span>
                                                {booking.flightStatus !== 'Landed' && (
                                                    <span className={BookingsStyle.countdown}>
                                                        {renderCountdown(booking._id)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={BookingsStyle.airport_info}>
                                                <p className={BookingsStyle.city}>{booking.arrivalAirport.city}</p>
                                                <p className={BookingsStyle.airport}>{booking.arrivalAirport.code}</p>
                                                <p className={BookingsStyle.time}>{formatDate(booking.arrivalTime)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={BookingsStyle.booking_footer}>
                                        <p className={BookingsStyle.booking_date}>Booked on: {formatDate(booking.bookingDate)}</p>
                                    </div>

                                </div>
                                {activeTab === 'upcoming' && canCancelBooking(booking) && (
                                    <div className={BookingsStyle.danger_area}>
                                        <button
                                            className={`${BookingsStyle.button} ${BookingsStyle.button_danger}`}
                                            onClick={() => handleCancelBooking(booking._id)}
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        )


    }

    return (
        <div className={BookingsStyle.container}>
            <h1 className={BookingsStyle.title}>My Bookings</h1>

            <div className={BookingsStyle.tabs}>
                <button
                    className={`${BookingsStyle.tab} ${BookingsStyle.halfWidth} ${activeTab === 'upcoming' ? BookingsStyle.tab_active : ''}`}
                    onClick={() => {
                        // setActiveTab('upcoming')
                        activeTab !== 'upcoming' && setActiveTab('upcoming')
                        fetchBookings('upcoming')
                    }}
                >
                    Upcoming Flights
                </button>
                <button
                    className={`${BookingsStyle.tab} ${BookingsStyle.halfWidth} ${activeTab === 'past' ? BookingsStyle.tab_active : ''}`}
                    onClick={() => {
                        activeTab !== 'past' && setActiveTab('past')
                        // setActiveTab('past')
                        fetchBookings('past')
                    }}
                >
                    Past Flights
                </button>
            </div>

            <div className={BookingsStyle.sortDropdownContainer}>
                <select
                    className={BookingsStyle.sortDropdown}
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy}
                >
                    <option value="departureDate">Sort by departure date</option>
                    <option value="bookingDate">Sort by booking date</option>
                </select>
            </div>


            {renderBookings()}

            {showModal && selectedBooking && (
                <div className={BookingsStyle.modal}>
                    <div className={BookingsStyle.modal_content}>
                        <h2 className={BookingsStyle.modal_title}>Passenger Details</h2>
                        <div className={BookingsStyle.passenger_list}>
                            {selectedBooking.passengerDetails.map((passenger, index) => (
                                <div key={passenger._id} className={BookingsStyle.passenger_item}>
                                    <h3>Passenger {index + 1}</h3>
                                    <p>Name: {passenger.name}</p>
                                    <p>Email: {passenger.email}</p>
                                </div>
                            ))}
                        </div>
                        <button className={BookingsStyle.close_button} onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Toast.Provider>
                <Toast.Root
                    className={`${BookingsStyle.toast} ${toastMessage.type === 'error' ? BookingsStyle.toastError : BookingsStyle.toastSuccess}`}
                    open={isToastOpen}
                    onOpenChange={setIsToastOpen}
                >
                    <Toast.Title className={BookingsStyle.toastTitle}>
                        {toastMessage.title}
                    </Toast.Title>

                    <Toast.Description className={BookingsStyle.toastDescription}>
                        {toastMessage.description}
                    </Toast.Description>
                </Toast.Root>

                <Toast.Viewport className={BookingsStyle.toastViewport} />
            </Toast.Provider>
        </div>
    )
}
