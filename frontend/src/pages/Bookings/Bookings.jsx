'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Users } from 'lucide-react'
import BookingsStyle from './Bookings.module.css'

export default function Bookings() {
    const [activeTab, setActiveTab] = useState('upcoming')
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [sortBy, setSortBy] = useState('departureDate')

    const userID = '674f27aae3e51236a5d700d4'

    useEffect(() => {
        fetchBookings()
    }, [activeTab])

    const fetchBookings = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`https://qairline-t28f.onrender.com/api/bookings/user/${userID}?type=${activeTab === 'upcoming' ? 'Upcoming' : 'Past'}`)
            if (!response.ok) throw new Error('Failed to fetch bookings')
            const data = await response.json()
            setBookings(data)
        } catch (err) {
            setError('An error occurred while fetching bookings. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await fetch(`https://qairline-t28f.onrender.com/api/bookings/${bookingId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to cancel booking')
            const data = await response.json()
            alert(data.message)
            fetchBookings()
        } catch (err) {
            alert('An error occurred while cancelling the booking. Please try again.')
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

    const canCancelBooking = (bookingDate) => {
        const now = new Date()
        const bookingTime = new Date(bookingDate)
        const timeDiff = now.getTime() - bookingTime.getTime()
        const hoursDiff = timeDiff / (1000 * 3600)
        return hoursDiff <= 24
    }

    const sortedBookings = [...bookings].sort((a, b) => {
        if (sortBy === 'departureDate') {
            return new Date(b.departureTime) - new Date(a.departureTime)
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
                                <div className={`${BookingsStyle.booking_card} ${activeTab === 'upcoming' && canCancelBooking(booking.bookingDate) ? BookingsStyle.booking_card_can_cancel : ''}`}>


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
                                {activeTab === 'upcoming' && canCancelBooking(booking.bookingDate) && (
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
                    className={`${BookingsStyle.tab} ${activeTab === 'upcoming' ? BookingsStyle.tab_active : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming Flights
                </button>
                <button
                    className={`${BookingsStyle.tab} ${activeTab === 'past' ? BookingsStyle.tab_active : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past Flights
                </button>
            </div>

            <div className={BookingsStyle.sort_container}>
                <select
                    className={BookingsStyle.sort_select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
        </div>
    )
}
