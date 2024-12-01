'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, ArrowRight, ArrowUp, ArrowDown, Search, Calendar, MapPin, Users, CreditCard, Luggage, Utensils, Wifi, Film, Moon, Plus, Minus, X, ShoppingCart, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import './flights.css';

interface Flight {
  id: string
  flightNumber: string
  airline: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  price: number
  aircraft: string
  availableSeats: number
  flightDuration: string
  stopover: string | null
  class: 'Economy' | 'Business' | 'First'
  amenities: string[]
  gate: string
  terminal: string
}

const mockFlights: Flight[] = [
  {
    id: '1',
    flightNumber: 'QA101',
    airline: 'QAirline',
    departureCity: 'New York',
    arrivalCity: 'London',
    departureTime: '2023-07-15T10:00:00Z',
    arrivalTime: '2023-07-15T22:00:00Z',
    price: 500,
    aircraft: 'Boeing 787 Dreamliner',
    availableSeats: 150,
    flightDuration: '7h 00m',
    stopover: null,
    class: 'Economy',
    amenities: ['wifi', 'meal', 'entertainment'],
    gate: 'A1',
    terminal: 'T1'
  },
  {
    id: '2',
    flightNumber: 'QA202',
    airline: 'QAirline',
    departureCity: 'Paris',
    arrivalCity: 'Tokyo',
    departureTime: '2023-07-16T14:30:00Z',
    arrivalTime: '2023-07-17T09:30:00Z',
    price: 800,
    aircraft: 'Airbus A350',
    availableSeats: 100,
    flightDuration: '12h 00m',
    stopover: 'Dubai (2h)',
    class: 'Business',
    amenities: ['wifi', 'meal', 'entertainment', 'lounge', 'flatbed'],
    gate: 'B3',
    terminal: 'T2'
  },
  {
    id: '3',
    flightNumber: 'QA303',
    airline: 'QAirline',
    departureCity: 'London',
    arrivalCity: 'New York',
    departureTime: '2023-07-17T09:00:00Z',
    arrivalTime: '2023-07-17T18:00:00Z',
    price: 600,
    aircraft: 'Boeing 777',
    availableSeats: 80,
    flightDuration: '8h 00m',
    stopover: null,
    class: 'Economy',
    amenities: ['wifi', 'meal', 'entertainment'],
    gate: 'C5',
    terminal: 'T3'
  },
  {
    id: '4',
    flightNumber: 'QA404',
    airline: 'QAirline',
    departureCity: 'Tokyo',
    arrivalCity: 'Sydney',
    departureTime: '2023-07-18T23:00:00Z',
    arrivalTime: '2023-07-19T10:00:00Z',
    price: 750,
    aircraft: 'Airbus A380',
    availableSeats: 200,
    flightDuration: '10h 00m',
    stopover: 'Singapore (1h)',
    class: 'Economy',
    amenities: ['wifi', 'meal', 'entertainment'],
    gate: 'D5',
    terminal: 'T4'
  },
  {
    id: '5',
    flightNumber: 'QA505',
    airline: 'QAirline',
    departureCity: 'Dubai',
    arrivalCity: 'Paris',
    departureTime: '2023-07-19T12:00:00Z',
    arrivalTime: '2023-07-19T17:00:00Z',
    price: 550,
    aircraft: 'Airbus A330',
    availableSeats: 120,
    flightDuration: '6h 00m',
    stopover: null,
    class: 'Business',
    amenities: ['wifi', 'meal', 'entertainment', 'lounge'],
    gate: 'E1',
    terminal: 'T2'
  },
]

interface CartItem {
  flight: Flight
  passengers: number
}

export default function Flights() {
  const [flights, setFlights] = useState<Flight[]>(mockFlights)
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(mockFlights)
  const [searchType, setSearchType] = useState<'oneWay' | 'roundTrip' | 'multiCity'>('oneWay')
  const [searchCriteria, setSearchCriteria] = useState({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'Economy' as 'Economy' | 'Business' | 'First',
  })
  const [multiCityFlights, setMultiCityFlights] = useState([
    { departureCity: '', arrivalCity: '', departureDate: '' },
    { departureCity: '', arrivalCity: '', departureDate: '' },
  ])
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    directFlightsOnly: false,
    amenities: [] as string[],
  })
  const [sortBy, setSortBy] = useState('price')
  const [sortOrder, setSortOrder] = useState('asc')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [flights, filters, sortBy, sortOrder, searchCriteria])

  const applyFilters = () => {
    let filtered = flights.filter(flight =>
      (!searchCriteria.departureCity || flight.departureCity.toLowerCase().includes(searchCriteria.departureCity.toLowerCase())) &&
      (!searchCriteria.arrivalCity || flight.arrivalCity.toLowerCase().includes(searchCriteria.arrivalCity.toLowerCase())) &&
      (!searchCriteria.departureDate || new Date(flight.departureTime).toDateString() === new Date(searchCriteria.departureDate).toDateString()) &&
      flight.price >= filters.minPrice &&
      flight.price <= filters.maxPrice &&
      (searchCriteria.class === 'Economy' || flight.class === searchCriteria.class) &&
      (!filters.directFlightsOnly || !flight.stopover) &&
      (filters.amenities.length === 0 || filters.amenities.every(amenity => flight.amenities.includes(amenity)))
    )

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      } else if (sortBy === 'duration') {
        const durationA = parseInt(a.flightDuration.split('h')[0])
        const durationB = parseInt(b.flightDuration.split('h')[0])
        return sortOrder === 'asc' ? durationA - durationB : durationB - durationA
      }
      return 0
    })

    setFilteredFlights(filtered)
  }

  const handleSearch = () => {
    // In a real application, this would make an API call with the search criteria
    // For now, we'll just apply the filters to our mock data
    applyFilters()
    toast({
      title: "Search Completed",
      description: `Found ${filteredFlights.length} flights matching your criteria.`,
    })
  }

  const handleAddToCart = (flight: Flight) => {
    const existingItem = cart.find(item => item.flight.id === flight.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.flight.id === flight.id
          ? { ...item, passengers: item.passengers + searchCriteria.passengers }
          : item
      ))
    } else {
      setCart([...cart, { flight, passengers: searchCriteria.passengers }])
    }
    toast({
      title: "Added to Cart",
      description: `${searchCriteria.passengers} ticket(s) for flight ${flight.flightNumber} added to cart.`,
    })
  }

  const handleRemoveFromCart = (flightId: string) => {
    setCart(cart.filter(item => item.flight.id !== flightId))
    toast({
      title: "Removed from Cart",
      description: `Flight removed from cart.`,
      variant: "destructive",
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.flight.price * item.passengers, 0)
  }

  const amenityIcons: { [key: string]: JSX.Element } = {
    wifi: <Wifi className="h-4 w-4" />,
    meal: <Utensils className="h-4 w-4" />,
    entertainment: <Film className="h-4 w-4" />,
    lounge: <Users className="h-4 w-4" />,
    flatbed: <Moon className="h-4 w-4" />,
  }

  return (
    <div className="page-container">





      <div className="hero-section">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Your Next Adventure
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Fly with QAirline to over 150 destinations worldwide
          </motion.p>
        </div>
      </div>

      <div className="search-section">
        <h2 className="search-title">Search Flights</h2>
        <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
          <PopoverTrigger asChild>
            <button className="cart-button">
              <ShoppingCart className="cart-icon" />
              Cart
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="cart-popover">
            <div className="cart-scroll">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.flight.id} className="cart-item">
                      <div>
                        <p className="item-title">
                          {item.flight.airline} {item.flight.flightNumber}
                        </p>
                        <p className="item-details">{item.flight.departureCity} to {item.flight.arrivalCity}</p>
                        <p className="item-details">{item.passengers} passenger(s)</p>
                      </div>
                      <div className="item-actions">
                        <p className="item-price">${item.flight.price * item.passengers}</p>
                        <button className="remove-button" onClick={() => handleRemoveFromCart(item.flight.id)}>
                          <X className="remove-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-total">
                <div className="total-details">
                  <p className="total-label">Total:</p>
                  <p className="total-price">${getTotalPrice()}</p>
                </div>
                <button className="payment-button">
                  <CreditCard className="payment-icon" /> Proceed to Payment
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>







      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle className="card-title">Find Your Perfect Flight</CardTitle>
          <CardDescription className="card-description">Search for the best deals on flights worldwide</CardDescription>
        </CardHeader>
        <CardContent className="card-content">
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value)} className="tabs">
            <TabsList className="tabs-list">
              <TabsTrigger value="oneWay" className="tabs-trigger">One Way</TabsTrigger>
              <TabsTrigger value="roundTrip" className="tabs-trigger">Round Trip</TabsTrigger>
              <TabsTrigger value="multiCity" className="tabs-trigger">Multi-City</TabsTrigger>
            </TabsList>
            <TabsContent value="oneWay" className="tabs-content">


              <div className="search-form-grid">
                <div className="input-wrapper">
                  <Label htmlFor="departureCity" className="label">From</Label>
                  <div className="relative">
                    <MapPin className="input-icon" />
                    <Input
                      id="departureCity"
                      value={searchCriteria.departureCity}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, departureCity: e.target.value })}
                      placeholder="Departure City"
                      className="input"
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <Label htmlFor="arrivalCity" className="label">To</Label>
                  <div className="relative">
                    <MapPin className="input-icon" />
                    <Input
                      id="arrivalCity"
                      value={searchCriteria.arrivalCity}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, arrivalCity: e.target.value })}
                      placeholder="Arrival City"
                      className="input"
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <Label htmlFor="departureDate" className="label">Departure Date</Label>
                  <div className="relative">
                    <Calendar className="input-icon" />
                    <Input
                      id="departureDate"
                      type="date"
                      value={searchCriteria.departureDate}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, departureDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="roundTrip" className="tabs-content">


              <div className="form-grid">
                <div className="input-wrapper">
                  <Label htmlFor="departureCity" className="label">From</Label>
                  <div className="relative">
                    <MapPin className="input-icon" />
                    <Input
                      id="departureCity"
                      value={searchCriteria.departureCity}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, departureCity: e.target.value })}
                      placeholder="Departure City"
                      className="input"
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <Label htmlFor="arrivalCity" className="label">To</Label>
                  <div className="relative">
                    <MapPin className="input-icon" />
                    <Input
                      id="arrivalCity"
                      value={searchCriteria.arrivalCity}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, arrivalCity: e.target.value })}
                      placeholder="Arrival City"
                      className="input"
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <Label htmlFor="departureDate" className="label">Departure Date</Label>
                  <div className="relative">
                    <Calendar className="input-icon" />
                    <Input
                      id="departureDate"
                      type="date"
                      value={searchCriteria.departureDate}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, departureDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <Label htmlFor="returnDate" className="label">Return Date</Label>
                  <div className="relative">
                    <Calendar className="input-icon" />
                    <Input
                      id="returnDate"
                      type="date"
                      value={searchCriteria.returnDate}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, returnDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            {/* Add multi-city content similarly */}
          </Tabs>
          <div className="form-input-grid">
            <div className="input-wrapper">
              <Label htmlFor="passengers" className="label">Passengers</Label>
              <div className="relative">
                <Users className="input-icon" />
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={searchCriteria.passengers}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, passengers: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
            </div>
            <div className="input-wrapper">
              <Label htmlFor="class" className="label">Class</Label>
              <Select
                value={searchCriteria.class}
                onValueChange={(value) => setSearchCriteria({ ...searchCriteria, class: value })}
              >
                <SelectTrigger id="class" className="select-trigger">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="Economy" className="select-item">Economy</SelectItem>
                  <SelectItem value="Business" className="select-item">Business</SelectItem>
                  <SelectItem value="First" className="select-item">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="card-footer">
          <Button onClick={handleSearch} className="button button-primary">
            <Search className="mr-2 h-4 w-4" /> Search Flights
          </Button>
        </CardFooter>
      </Card>




















      <div className="filter-container">
        <Card className="filter-card">
          <CardHeader className="filter-card-header">
            <CardTitle className="filter-card-title">Filters</CardTitle>
          </CardHeader>
          <CardContent className="filter-card-content">
            <div className="filter-section">
              <div className="filter-item">
                <Label htmlFor="priceRange" className="filter-label">Price Range</Label>
                <div className="price-range">
                  <Input
                    id="minPrice"
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                    className="price-input"
                  />
                  <span className="price-separator">-</span>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="price-input"
                  />
                </div>
                <Slider
                  min={0}
                  max={2000}
                  step={50}
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={(value) => {
                    setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] });
                  }}
                  className="price-slider"
                />
              </div>
              <div className="filter-item">
                <div className="checkbox-wrapper">
                  <Checkbox
                    id="directFlights"
                    checked={filters.directFlightsOnly}
                    onCheckedChange={(checked) => setFilters({ ...filters, directFlightsOnly: checked })}
                    className="filter-checkbox"
                  />
                  <Label htmlFor="directFlights" className="filter-label">Direct flights only</Label>
                </div>
              </div>
              <div className="filter-item">
                <Label className="filter-label">Amenities</Label>
                <div className="amenities-grid">
                  {Object.entries(amenityIcons).map(([amenity, icon]) => (
                    <div key={amenity} className="amenity-item">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          const newAmenities = checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter((a) => a !== amenity);
                          setFilters({ ...filters, amenities: newAmenities });
                        }}
                        className="filter-checkbox"
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="amenity-label">
                        {icon}
                        <span className="amenity-text">{amenity}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>












        <div className="flight-results-container">
          <Card className="flight-card bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="header-container">
                <CardTitle className="flight-card-title">Flight Results</CardTitle>
                <div className="filter-container">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="select-trigger">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <ArrowUp className="sort-icon" /> : <ArrowDown className="sort-icon" />}
                  </Button>
                </div>
              </div>
              <CardDescription>Showing {filteredFlights.length} flights</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {filteredFlights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="flight-result-card mb-4 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="flight-result-card-content">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="flight-info flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="flight-icon">
                              <Plane className="plane-icon" />
                            </div>
                            <div>
                              <h3 className="flight-name">{flight.airline} {flight.flightNumber}</h3>
                              <p className="flight-aircraft">{flight.aircraft}</p>
                            </div>
                          </div>
                          <div className="price-info text-right">
                            <p className="price">${flight.price}</p>
                            <Badge variant="secondary">{flight.class}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="flex-1">
                            <p className="font-semibold">{flight.departureCity}</p>
                            <p className="text-sm text-gray-500">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="flex flex-col items-center my-2 md:my-0">
                            <ArrowRight className="arrow-icon" />
                            <p className="text-sm font-medium">{flight.flightDuration}</p>
                            {flight.stopover && (
                              <p className="text-xs text-gray-400">{flight.stopover}</p>
                            )}
                          </div>
                          <div className="flex-1 text-right">
                            <p className="font-semibold">{flight.arrivalCity}</p>
                            <p className="text-sm text-gray-500">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <div className="flight-actions mt-4 flex flex-wrap justify-between items-center">
                          <div className="amenities flex items-center space-x-2">
                            {flight.amenities.map((amenity) => (
                              <Popover key={amenity}>
                                <PopoverTrigger>
                                  <Button variant="outline" size="icon" className="h-8 w-8">
                                    {amenityIcons[amenity]}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto">
                                  <p className="capitalize">{amenity}</p>
                                </PopoverContent>
                              </Popover>
                            ))}
                          </div>
                          <p className="seats-left text-sm text-gray-500">{flight.availableSeats} seats left</p>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <Info className="mr-2 h-4 w-4" />
                                  More Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{flight.airline} {flight.flightNumber}</DialogTitle>
                                  <DialogDescription>Flight Details</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="departure">Departure</Label>
                                    <div>
                                      <p>{flight.departureCity}</p>
                                      <p className="text-sm text-gray-500">{new Date(flight.departureTime).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="arrival">Arrival</Label>
                                    <div>
                                      <p>{flight.arrivalCity}</p>
                                      <p className="text-sm text-gray-500">{new Date(flight.arrivalTime).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="duration">Duration</Label>
                                    <p>{flight.flightDuration}</p>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="aircraft">Aircraft</Label>
                                    <p>{flight.aircraft}</p>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="class">Class</Label>
                                    <p>{flight.class}</p>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="amenities">Amenities</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {flight.amenities.map((amenity) => (
                                        <Badge key={amenity} variant="secondary">{amenity}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="gate">Gate</Label>
                                    <p>{flight.gate}</p>
                                  </div>
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="terminal">Terminal</Label>
                                    <p>{flight.terminal}</p>
                                  </div>
                                  {flight.stopover && (
                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <Label htmlFor="stopover">Stopover</Label>
                                      <p>{flight.stopover}</p>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 items-center gap-4">
                                    <Label htmlFor="availableSeats">Available Seats</Label>
                                    <p>{flight.availableSeats}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button onClick={() => handleAddToCart(flight)} className="add-to-cart-button bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>






      </div>























      <div className="why-choose-container">
        <h2 className="section-title">Why Choose QAirline?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <Plane className="icon" />
            </div>
            <h3 className="feature-title">Modern Fleet</h3>
            <p className="feature-description">
              Experience comfort and efficiency with our state-of-the-art aircraft.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Users className="icon" />
            </div>
            <h3 className="feature-title">Exceptional Service</h3>
            <p className="feature-description">
              Our dedicated crew ensures a pleasant journey from takeoff to landing.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Luggage className="icon" />
            </div>
            <h3 className="feature-title">Generous Baggage Allowance</h3>
            <p className="feature-description">
              Travel with ease knowing you have ample space for your belongings.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

