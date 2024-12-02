'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, ArrowRight, ArrowUp, ArrowDown, Search, Calendar, MapPin, Users, CreditCard, Luggage, Utensils, Wifi, Film, Moon, Plus, Minus, X, ShoppingCart, Info } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Slider } from "~/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { toast } from "~/hooks/use-toast"
import './Flights.css';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchType, setSearchType] = useState('oneWay');
  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);
  const [recentSelectedFlight, setRecentSelectedFlight] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'Economy',
  });
  const [multiCityFlights, setMultiCityFlights] = useState([
    { departureCity: '', arrivalCity: '', departureDate: '' },
    { departureCity: '', arrivalCity: '', departureDate: '' },
  ]);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    directFlightsOnly: false,
    amenities: [],
  });
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('https://qairline-t28f.onrender.com/api/flights');
        if (!response.ok) {
          throw new Error('Failed to fetch flights data');
        }
        const data = await response.json();
        const formattedData = data.map(flight => ({
          id: flight._id,
          departureCity: flight.departureAirport.city,
          arrivalCity: flight.arrivalAirport.city,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          flightDuration: flight.flightDuration,
          price: flight.flightClass.economy.price, // Defaulting to Economy price
          class: 'Economy',
          stopover: false, // Assuming no stopover data in API
          amenities: [], // Assuming no amenities data in API
          flightNumber: flight.aircraft.code,
          airline: flight.aircraft.manufacturer,
          aircraft: flight.aircraft.model,
          availableSeats: flight.flightClass.economy.seatsAvailable, // Defaulting to Economy available seats
        }));
        setFlights(formattedData);
        setFilteredFlights(formattedData);
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flights data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, []);


  useEffect(() => {
    applyFilters();
  }, [flights, filters, sortBy, sortOrder, searchCriteria, selectedDepartureFlight, recentSelectedFlight]);

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
    );

    if (searchType === 'roundTrip' && selectedDepartureFlight) {
      filtered = flights.filter(flight =>
        flight.departureCity.toLowerCase() === selectedDepartureFlight.arrivalCity.toLowerCase() &&
        flight.arrivalCity.toLowerCase() === selectedDepartureFlight.departureCity.toLowerCase() &&
        new Date(flight.departureTime) > new Date(selectedDepartureFlight.arrivalTime) // Thời gian đi của chuyến về phải lớn hơn thời gian đến của chuyến đi
      );
    }
    console.log(recentSelectedFlight);

    if (searchType === 'multiCity' && recentSelectedFlight.length > 0) {
      const lastFlight = recentSelectedFlight[recentSelectedFlight.length - 1]; // Lấy chuyến bay cuối cùng đã chọn
      filtered = flights.filter(flight =>
        flight.departureCity.toLowerCase() === lastFlight.arrivalCity.toLowerCase() && // Thành phố khởi hành khớp với thành phố đến của chuyến bay cuối
        new Date(flight.departureTime) > new Date(lastFlight.arrivalTime) // Thời gian khởi hành hợp lệ
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'duration') {
        const durationA = parseInt(a.flightDuration.split('h')[0]);
        const durationB = parseInt(b.flightDuration.split('h')[0]);
        return sortOrder === 'asc' ? durationA - durationB : durationB - durationA;
      }
      return 0;
    });

    setFilteredFlights(filtered);
  };

  const handleSearch = () => {
    applyFilters();
    toast({
      title: 'Search Completed',
      description: `Found ${filteredFlights.length} flights matching your criteria.`,
    });
  };

  const handleAddToCart = async (flight, flightClass) => {
    const existingItem = cart.find(item => item.flight.id === flight.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.flight.id === flight.id
          ? { ...item, passengers: item.passengers + searchCriteria.passengers }
          : item
      ));
    } else {
      setCart([...cart, { flight, passengers: searchCriteria.passengers, flightClass }]);
    }

    if (searchType === 'roundTrip') {
      if (selectedDepartureFlight) {
        setSelectedDepartureFlight(null);
      } else {
        setSelectedDepartureFlight(flight);
      }
    }

    if (searchType === 'multiCity') {
      const updatedRecentSelectedFlight = [...recentSelectedFlight, flight];
      setRecentSelectedFlight(updatedRecentSelectedFlight);
    }

    toast({
      title: "Added to Cart",
      description: `${searchCriteria.passengers} ticket(s) for flight added to cart.`,
    })
  };

  const handleRemoveFromCart = flightId => {
    setCart(cart.filter(item => item.flight.id !== flightId));

    if (searchType === 'roundTrip') {
      setSelectedDepartureFlight(null);
    }

    if (searchType === 'multiCity' && recentSelectedFlight) {
      const updatedRecentSelectedFlight = recentSelectedFlight.slice(0, -1);
      setRecentSelectedFlight(updatedRecentSelectedFlight);
    }

    console.log(selectedDepartureFlight);

    toast({
      title: 'Removed from Cart',
      description: 'Flight removed from cart.',
      variant: 'destructive',
    });
  };

  const handleProceedToPayment = async () => {
    if (cart.length === 0) {
      toast({
        title: 'No Items in Cart',
        description: 'Please add flights to your cart before proceeding to payment.',
        status: 'warning',
      });
      return;
    }
    const bookingPromises = cart.map(item => {
      const bookingData = {
        userID: "674b6d8245ff24b20112416a",
        flightID: item.flight.id,
        flightClass: item.flightClass || "economy",
        passengerCount: item.passengers,
        passengerIDs: ["674a2003f51d087e0c39aebb"],
      };

      return fetch("https://qairline-t28f.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      }).then(async response => {
        if (!response.ok) {
          const errorMessage = `Failed to create booking for flight ${item.flight.flightNumber}.`;
          console.error(errorMessage, response.status, response.statusText);
          throw new Error(errorMessage);
        }
        return response.json();
      });
    });

    try {
      const results = await Promise.all(bookingPromises);
      console.log("All bookings successful:", results);

      toast({
        title: 'Bookings Created',
        description: 'All flights in your cart have been booked successfully.',
      });
      setCart([]); // remove all cart items after successful booking
    } catch (error) {
      console.error("Error processing bookings:", error);
      toast({
        title: 'Booking Failed',
        description: 'An error occurred while processing your bookings.',
        status: 'error',
      });
    }

    toast({
      title: 'Payment',
      description: 'Redirecting to payment gateway...',
    });
  };


  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.flight.price * item.passengers, 0);
  };

  const amenityIcons = {
    wifi: <Wifi className="h-4 w-4" />,
    meal: <Utensils className="h-4 w-4" />,
    entertainment: <Film className="h-4 w-4" />,
    lounge: <Users className="h-4 w-4" />,
    flatbed: <Moon className="h-4 w-4" />,
  };

  if (isLoading) {
    return <div>Loading data, please wait...</div>;
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

                <Button onClick={() => handleProceedToPayment()} className="payment-button">
                  <CreditCard className="payment-icon" /> Proceed to Payment
                </Button>
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
          <Card className="flight-card">
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







                    <Card className="flight-result-card">
                      <CardContent className="flight-result-card-content">
                        <div className="flight-result-header">
                          <div className="flight-info">
                            <div className="flight-icon">
                              <Plane className="plane-icon" />
                            </div>
                            <div>
                              <h3 className="flight-name">{flight.airline} {flight.flightNumber}</h3>
                              <p className="flight-aircraft">{flight.aircraft}</p>
                            </div>
                          </div>
                          <div className="price-info">
                            <p className="price">${flight.price}</p>
                            <Badge variant="secondary">{flight.class}</Badge>
                          </div>
                        </div>
                        <div className="flight-details">
                          <div className="departure-info">
                            <p className="departure-city">{flight.departureCity}</p>
                            <p className="departure-time">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="flight-duration">
                            <ArrowRight className="arrow-icon" />
                            <p className="duration">
                              {new Date(flight.flightDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </p>
                            {flight.stopover && (
                              <p className="stopover">{flight.stopover}</p>
                            )}
                          </div>
                          <div className="arrival-info">
                            <div>
                              <p className="arrival-city">{flight.arrivalCity}</p>
                              <p className="arrival-time">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flight-actions">
                          <div className="amenities">
                            {flight.amenities.map((amenity) => (
                              <Popover key={amenity}>
                                <PopoverTrigger>
                                  <Button className="amenity-icon">{amenityIcons[amenity]}</Button>
                                </PopoverTrigger>
                                <PopoverContent className="amenity-tooltip">
                                  <p>{amenity}</p>
                                </PopoverContent>
                              </Popover>
                            ))}
                          </div>
                          <p className="seats-left">{flight.availableSeats} seats left</p>
                          <div className="action-buttons">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="details-button">
                                  <Info className="details-button-icon" />
                                  More Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{flight.airline} {flight.flightNumber}</DialogTitle>
                                  <DialogDescription>Flight Details</DialogDescription>
                                </DialogHeader>
                                {/* Add Dialog Content Here */}
                              </DialogContent>
                            </Dialog>
                            <Button onClick={() => handleAddToCart(flight, "economy")} className="add-to-cart-button">
                              Book Economy
                            </Button>

                            <Button onClick={() => handleAddToCart(flight, "business")} className="add-to-cart-button">
                              Book Business
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

