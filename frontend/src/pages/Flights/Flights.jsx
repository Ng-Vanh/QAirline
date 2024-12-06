'use client'

import { useState, useEffect } from 'react'
import { Plane, ArrowRight, ArrowLeft, Search, Calendar, MapPin, Users, CreditCard, Luggage, X, ShoppingCart, Info, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FlightsStyle from './Flights.module.css'

export default function Flights() {
  const [searchType, setSearchType] = useState('oneWay')
  const [searchCriteria, setSearchCriteria] = useState({
    departureCity: '',
    destinationCity: '',
    departureDate: '',
    passengerCount: 1
  })
  const [returnDate, setReturnDate] = useState('')
  const [multiCityFlights, setMultiCityFlights] = useState([
    { departureCity: '', destinationCity: '', departureDate: '' },
    { departureCity: '', destinationCity: '', departureDate: '' }
  ])
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSearchStep, setCurrentSearchStep] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showFlightDetails, setShowFlightDetails] = useState(false)
  const [selectedFlights, setSelectedFlights] = useState({})
  const [showPassengerInfo, setShowPassengerInfo] = useState(false)
  const [passengers, setPassengers] = useState([])
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [maxReachedStep, setMaxReachedStep] = useState(0)
  const [previousLegArrivalTime, setPreviousLegArrivalTime] = useState(null)
  const [doneChoosing, setDoneChoosing] = useState(false)
  const [isAutoSearch, setIsAutoSearch] = useState(true)

  const isFlightsPage = () => {
    return window.location.pathname === '/flights'
  }

  const getTotalRoutes = () => {
    if (searchType === 'oneWay') return 1
    if (searchType === 'roundTrip') return 2
    return multiCityFlights.length
  }

  const retrieveUrlData = async () => {
    const searchParams = new URLSearchParams(window.location.search)

    const type = searchParams.get('searchType');
    if (type) setSearchType(type);

    const departureCityParam = searchParams.get('departureCity');
    const destinationCityParam = searchParams.get('destinationCity');
    const departureDateParam = searchParams.get('departureDate');
    const passengerCountParam = searchParams.get('passengerCount');
    const returnDateParam = searchParams.get('returnDate');
    const multiCityFlightsParam = searchParams.get('multiCityFlights');

    if (departureCityParam || destinationCityParam || departureDateParam || passengerCountParam) {
      console.log("YES, url has data")
      console.log(departureCityParam)
      console.log(destinationCityParam)
      console.log(departureDateParam)
      console.log(passengerCountParam)
      console.log({
        departureCity: departureCityParam || '',
        destinationCity: destinationCityParam || '',
        departureDate: departureDateParam || '',
        passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
      });

      setSearchCriteria({
        departureCity: departureCityParam || '',
        destinationCity: destinationCityParam || '',
        departureDate: departureDateParam || '',
        passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
      });
      console.log(searchCriteria)
      console.log('-----------------------')
    }

    if (returnDateParam) setReturnDate(returnDateParam);

    if (multiCityFlightsParam) {
      try {
        const parsedMultiCityFlights = JSON.parse(multiCityFlightsParam);
        setMultiCityFlights(parsedMultiCityFlights);
      } catch (error) {
        console.error('Error parsing multiCityFlights:', error);
      }
    }

    if (type) {
      handleSearch()
    }
  }


  const searchFlights = async (criteria) => {
    console.log('Searching flights with criteria:', criteria)
    setIsLoading(true)
    try {
      const response = await fetch('https://qairline-t28f.onrender.com/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...criteria,
          passengerCount: searchCriteria.passengerCount
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Search results:', data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error searching flights:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   retrieveUrlData()
  // }, []);

  // useEffect(() => {
  //   if (isFlightsPage()) {
  //     const searchParams = new URLSearchParams(window.location.search)

  //     const type = searchParams.get('searchType');
  //     if (type) setSearchType(type);

  //     const departureCityParam = searchParams.get('departureCity');
  //     const destinationCityParam = searchParams.get('destinationCity');
  //     const departureDateParam = searchParams.get('departureDate');
  //     const passengerCountParam = searchParams.get('passengerCount');
  //     const returnDateParam = searchParams.get('returnDate');
  //     const multiCityFlightsParam = searchParams.get('multiCityFlights');

  //     if (departureCityParam || destinationCityParam || departureDateParam || passengerCountParam) {
  //       console.log("YES, url has data")
  //       console.log(departureCityParam)
  //       console.log(destinationCityParam)
  //       console.log(departureDateParam)
  //       console.log(passengerCountParam)
  //       console.log({
  //         departureCity: departureCityParam || '',
  //         destinationCity: destinationCityParam || '',
  //         departureDate: departureDateParam || '',
  //         passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
  //       });

  //       setSearchCriteria({
  //         departureCity: departureCityParam || '',
  //         destinationCity: destinationCityParam || '',
  //         departureDate: departureDateParam || '',
  //         passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
  //       });
  //       console.log(searchCriteria)
  //       console.log('-----------------------')
  //     }

  //     if (returnDateParam) setReturnDate(returnDateParam);

  //     if (multiCityFlightsParam) {
  //       try {
  //         const parsedMultiCityFlights = JSON.parse(multiCityFlightsParam);
  //         setMultiCityFlights(parsedMultiCityFlights);
  //       } catch (error) {
  //         console.error('Error parsing multiCityFlights:', error);
  //       }
  //     }
  //   }
  // }, []);


  useEffect(() => {
    if (isFlightsPage()) {
      const searchParams = new URLSearchParams(window.location.search);

      const type = searchParams.get('searchType');
      if (type) setSearchType(type);

      const departureCityParam = searchParams.get('departureCity');
      const destinationCityParam = searchParams.get('destinationCity');
      const departureDateParam = searchParams.get('departureDate');
      const passengerCountParam = searchParams.get('passengerCount');
      const returnDateParam = searchParams.get('returnDate');
      const multiCityFlightsParam = searchParams.get('multiCityFlights');

      if (departureCityParam || destinationCityParam || departureDateParam || passengerCountParam) {
        console.log("YES, url has data");
        console.log(departureCityParam);
        console.log(destinationCityParam);
        console.log(departureDateParam);
        console.log(passengerCountParam);

        const newSearchCriteria = {
          departureCity: departureCityParam || '',
          destinationCity: destinationCityParam || '',
          departureDate: departureDateParam || '',
          passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
        };

        setSearchCriteria(newSearchCriteria); // Update state
        console.log('Setting search criteria:', searchCriteria);  // Log what you are setting
      }

      if (returnDateParam) setReturnDate(returnDateParam);

      if (multiCityFlightsParam) {
        try {
          console.log("this is multicity flights")
          const parsedMultiCityFlights = JSON.parse(multiCityFlightsParam);
          setMultiCityFlights(parsedMultiCityFlights);
          console.log(parsedMultiCityFlights);
        } catch (error) {
          console.error('Error parsing multiCityFlights:', error);
        }
      }

      if (type) {
        setIsAutoSearch(true);
      }
      else {
        setIsAutoSearch(false);
      }
    }
  }, []);

  const checkValidParams = () => {
    if (searchType != 'multiCity') {
      return (searchCriteria && searchCriteria.departureCity && searchCriteria.departureDate && searchCriteria.destinationCity && searchCriteria.passengerCount)
    }
    else {
      return (multiCityFlights.length >= 2 && multiCityFlights[0].departureCity && multiCityFlights[0].departureDate && searchCriteria.passengerCount)
    }
  }

  useEffect(() => {
    if (isFlightsPage() && isAutoSearch) {
      if (checkValidParams()) {
        handleSearch();
        setIsAutoSearch(false);
      }
    }
  }, [searchCriteria, returnDate, multiCityFlights]);

  // useEffect(() => {
  //   handleSearch()
  //   console.log('Updated Search Criteria:', searchCriteria)
  // }, [searchCriteria])  // This effect runs every time `searchCriteria` changes

  const resetState = () => {
    setSearchResults([])
    clearCart()
    setDoneChoosing(false)
  }

  const handleSearch = async () => {
    if (!isFlightsPage()) {
      const params = new URLSearchParams()
      params.set('searchType', searchType)
      params.set('departureCity', searchCriteria.departureCity)
      params.set('destinationCity', searchCriteria.destinationCity)
      params.set('departureDate', searchCriteria.departureDate)
      params.set('passengerCount', searchCriteria.passengerCount.toString())
      if (searchType === 'roundTrip') {
        params.set('returnDate', returnDate)
      } else if (searchType === 'multiCity') {
        params.set('multiCityFlights', JSON.stringify(multiCityFlights))
      }
      window.location.href = `/flights?${params.toString()}`
      return
    }

    console.log('Searching for:', searchType)
    setIsLoading(true)
    setSearchResults([])
    setSelectedFlights({})
    setCurrentStep(0)
    setMaxReachedStep(0)
    setPreviousLegArrivalTime(null)
    setDoneChoosing(false)

    let searchPromises = []

    if (searchType === 'oneWay') {
      searchPromises = [searchFlights(searchCriteria)]
    } else if (searchType === 'roundTrip') {
      searchPromises = [
        searchFlights(searchCriteria),
        searchFlights({
          departureCity: searchCriteria.destinationCity,
          destinationCity: searchCriteria.departureCity,
          departureDate: returnDate,
          passengerCount: searchCriteria.passengerCount
        })
      ]
    } else if (searchType === 'multiCity') {
      searchPromises = multiCityFlights.map(flight =>
        searchFlights({
          departureCity: flight.departureCity,
          destinationCity: flight.destinationCity,
          departureDate: flight.departureDate,
          passengerCount: searchCriteria.passengerCount
        })
      )
    }

    try {
      const results = await Promise.all(searchPromises)
      setSearchResults(results)
      if (results.some(flights => flights.length > 0)) {
        setCurrentStep(0)
        setMaxReachedStep(getTotalRoutes() - 1)
      } else {
        // alert('No flights found for the given criteria. Please try different search parameters.')
      }
    } catch (error) {
      console.error('Error searching flights:', error)
      alert('An error occurred while searching for flights. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (flight, flightClass) => {
    const newItem = {
      flight,
      class: flightClass,
      passengers: searchCriteria.passengerCount
    };

    // if (Object.keys(selectedFlights).length >= getTotalRoutes() - 1) {
    //   setDoneChoosing(true);
    // }

    if (currentStep === getTotalRoutes() - 1) {
      setDoneChoosing(true);
    }

    setSelectedFlights(prev => ({
      ...prev,
      [currentStep]: newItem
    }));

    setPreviousLegArrivalTime(flight.arrivalTime);

    if (currentStep === maxReachedStep && currentStep < getTotalRoutes() - 1) {
      setMaxReachedStep(currentStep + 1);
    }
    if (currentStep < getTotalRoutes() - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const removeFromCart = (index) => {
    setSelectedFlights(prev => {
      const newSelectedFlights = { ...prev };
      delete newSelectedFlights[index];
      return newSelectedFlights;
    });
  }

  const clearCart = () => {
    setSelectedFlights({});
    setCurrentStep(0);
    setMaxReachedStep(0);
    setPreviousLegArrivalTime(null);
  }

  const getTotalPrice = () => {
    return Object.values(selectedFlights).reduce((total, item) => {
      return total + item.flight.flightClass[item.class].price * item.passengers
    }, 0)
  }

  const renderFlightResults = (flights, routeIndex) => {
    const routeInfo = getRouteInfo(routeIndex);

    const gtty = routeInfo.departureCity;
    if (Object.keys(selectedFlights).length === getTotalRoutes()) {
      console.log("Already selected all flights", getTotalRoutes());
      console.log("Status of doneChoosing: ", doneChoosing);
    }

    console.log("this is step: ", currentStep);

    // if (Object.keys(selectedFlights).length === getTotalRoutes()) {
    //   return renderBookedFlights();
    // }

    const filteredFlights = routeIndex > 0 && previousLegArrivalTime
      ? flights.filter(flight => new Date(flight.departureTime) > new Date(previousLegArrivalTime))
      : flights;

    if (doneChoosing) {
      // if (Object.keys(selectedFlights).length === getTotalRoutes()) {
      return renderBookedFlights();
      // }
    }

    // setDoneChoosing(false)
    return ( // flights here
      <div className={FlightsStyle.flight_results}>

        <h2 className={FlightsStyle.flight_results_title}>
          {filteredFlights.length > 0
            ? `${filteredFlights.length} Flights found `
            : 'No flights found '}
          for {filteredFlights.length > 0
            ? `${filteredFlights[0].departureAirportDetails.city} to ${filteredFlights[0].arrivalAirportDetails.city}, `
            : ' your selected route'}
          {filteredFlights.length > 0
            ? `${new Date(filteredFlights[0].departureTime).getDate()}/${new Date(filteredFlights[0].departureTime).getMonth() + 1}/${new Date(filteredFlights[0].departureTime).getFullYear()}`
            : ''}
        </h2>

        {/* <h2 className={FlightsStyle.flight_results_title}> */}
        {/* {filteredFlights.length > 0 ? `${filteredFlights.length} Flights found` : 'No flights found'} for {filteredFlights[0].departureAirportDetails.city} to {filteredFlights[0].arrivalAirportDetails.city}, {`${new Date(filteredFlights[0].departureTime).getDate()}/${new Date(filteredFlights[0].departureTime).getMonth() + 1}/${new Date(filteredFlights[0].departureTime).getFullYear()}`} */}

        {/* {filteredFlights.length > 0 ? `${filteredFlights.length} Flights found` : 'No flights found'} for {searchCriteria.departureCity} to {searchCriteria.destinationCity}, {searchCriteria.departureDate} */}
        {/* </h2> */}

        {/* <div className={FlightsStyle.navigation_buttons_section}>

          <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline} ${FlightsStyle.navigation_buttons}`} onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className={FlightsStyle.button_icon} />
            Back
          </button>

          <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline} ${FlightsStyle.navigation_buttons}`} onClick={handleNext} disabled={currentStep >= maxReachedStep || currentStep >= getTotalRoutes() - 1}>
            Next
            <ArrowRight className={FlightsStyle.button_icon} />
          </button>

        </div> */}

        {filteredFlights.length > 0 && (
          <div className={FlightsStyle.navigation_buttons_section}>

            <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline} ${FlightsStyle.navigation_buttons}`} onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className={FlightsStyle.button_icon} />
              Back
            </button>

            <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline} ${FlightsStyle.navigation_buttons}`} onClick={handleNext} disabled={currentStep >= maxReachedStep || currentStep >= getTotalRoutes() - 1}>
              Next
              <ArrowRight className={FlightsStyle.button_icon} />
            </button>

          </div>
        )}

        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => {
            const isSelected = selectedFlights[routeIndex]?.flight._id === flight._id;
            const selectedClass = selectedFlights[routeIndex]?.class;
            return (
              <div key={flight._id} className={`${FlightsStyle.flight_card} ${FlightsStyle.fade_in} ${isSelected ? FlightsStyle.selected_flight : ''}`}>
                <div className={FlightsStyle.flight_card_content}>
                  <div className={FlightsStyle.flight_header}>
                    <div className={FlightsStyle.flight_header_left_container}>
                      <h3>{flight.flightCode}</h3>
                      <h4>{flight.aircraft}</h4>
                    </div>

                    <span className={FlightsStyle.flight_duration}>{flight.flightDuration}</span>
                  </div>
                  <div className={FlightsStyle.flight_details}>

                    <div className={FlightsStyle.flight_route}>
                      <h4>{flight.departureAirportDetails.city} ({flight.departureAirportDetails.code})</h4>
                      <p>{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p>
                        {`${new Date(flight.departureTime).getDate()}/${new Date(flight.departureTime).getMonth() + 1}/${new Date(flight.departureTime).getFullYear()}`}
                      </p>
                    </div>

                    <div className={FlightsStyle.middle_container}>
                      <Plane className={FlightsStyle.flight_icon} />
                    </div>


                    <div className={FlightsStyle.flight_route}>
                      <h4>{flight.arrivalAirportDetails.city} ({flight.arrivalAirportDetails.code})</h4>
                      <p>{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p>
                        {`${new Date(flight.arrivalTime).getDate()}/${new Date(flight.arrivalTime).getMonth() + 1}/${new Date(flight.arrivalTime).getFullYear()}`}
                      </p>
                    </div>

                  </div>

                  <div className={FlightsStyle.flight_actions}>
                    <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline}`} onClick={() => {
                      setSelectedFlight(flight)
                      setShowFlightDetails(true)
                    }}>
                      <Info className={FlightsStyle.button_icon} />
                      Details
                    </button>

                    <div className={FlightsStyle.class_buttons_container}>
                      <button
                        className={`${FlightsStyle.button} ${isSelected && selectedClass === 'economy' ? FlightsStyle.button_selected : FlightsStyle.button_primary} ${isSelected && selectedClass === 'economy' ? FlightsStyle.selected_class : ''}`}
                        onClick={() => handleAddToCart(flight, 'economy')}
                      >
                        Economy: ${flight.flightClass.economy.price}
                        <span className={FlightsStyle.seats_available}>({flight.flightClass.economy.seatsAvailable} seats left)</span>
                      </button>
                      <button
                        className={`${FlightsStyle.button} ${isSelected && selectedClass === 'business' ? FlightsStyle.button_selected : FlightsStyle.button_secondary} ${isSelected && selectedClass === 'business' ? FlightsStyle.selected_class : ''}`}
                        onClick={() => handleAddToCart(flight, 'business')}
                      >
                        Business: ${flight.flightClass.business.price}
                        <span className={FlightsStyle.seats_available}>({flight.flightClass.business.seatsAvailable} seats left)</span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p>No suitable flights found for this route and date. Please try different search criteria or adjust your previous flight selection.</p>
        )}
      </div>
    )
  }

  const getRouteInfo = (routeIndex) => {
    if (searchType === 'oneWay' || (searchType === 'roundTrip' && routeIndex === 0)) {
      return {
        departureCity: searchCriteria.departureCity,
        destinationCity: searchCriteria.destinationCity,
        departureDate: searchCriteria.departureDate
      };
    } else if (searchType === 'roundTrip' && routeIndex === 1) {
      return {
        departureCity: searchCriteria.destinationCity,
        destinationCity: searchCriteria.departureCity,
        departureDate: returnDate
      };
    } else if (searchType === 'multiCity') {
      return multiCityFlights[routeIndex];
    }
    return { departureCity: '', destinationCity: '', departureDate: '' };
  };

  const handlePreviousStep = () => {
    setDoneChoosing(false);
    // if (currentSearchStep > 0) {
    //   setCurrentSearchStep(currentSearchStep - 1)
    // }
    if (currentStep >= 0) {
      let newStep = currentStep;
      // if (searchType === 'multiCity') {
      //   newStep = currentStep - 1;
      // }
      // else {
      //   newStep = currentStep;
      // }

      console.log("back step: ", newStep);
      setCurrentStep(newStep);
      setSelectedFlights(prev => {
        const newSelectedFlights = { ...prev };
        // delete newSelectedFlights[currentStep];
        return newSelectedFlights;
      });
      setMaxReachedStep(newStep);
      if (newStep > 0) {
        const previousFlight = selectedFlights[newStep - 1]?.flight;
        setPreviousLegArrivalTime(previousFlight ? previousFlight.arrivalTime : null);
      } else {
        setPreviousLegArrivalTime(null);
      }
    }
  }

  const handleNextStep = () => {
    if (currentSearchStep < getTotalRoutes() - 1) {
      setCurrentSearchStep(currentSearchStep + 1)
    }
  }

  const isLastStep = () => {
    return currentSearchStep === getTotalRoutes() - 1 && Object.keys(selectedFlights).length === getTotalRoutes();
  };


  const renderBookedFlights = () => (
    <div className={FlightsStyle.booked_flights}>
      <h2 className={FlightsStyle.flight_results_title}>Here are your booked flights</h2>

      {/* <div className={FlightsStyle.navigation_buttons}>
        <button
          className={`${FlightsStyle.button} ${FlightsStyle.button_outline}`}
          onClick={handlePreviousStep}
        > 
          <ArrowLeft className={FlightsStyle.button_icon} />
          Back to Flight Selection
        </button>
      </div> */}

      <div className={FlightsStyle.navigation_buttons_section}>
        <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline} ${FlightsStyle.navigation_buttons}`} onClick={handlePreviousStep}>
          <ArrowLeft className={FlightsStyle.button_icon} />
          Back to flights selection
        </button>
      </div>

      {Object.entries(selectedFlights).map(([index, item]) => (
        <div key={index} className={`${FlightsStyle.flight_card} ${FlightsStyle.fade_in}`}>
          <div className={FlightsStyle.flight_card_content}>
            <div className={FlightsStyle.flight_header}>
              <h3>{item.flight.flightCode}</h3>
              <span className={FlightsStyle.flight_duration}>{item.flight.flightDuration}</span>
            </div>
            <div className={FlightsStyle.flight_details}>
              <div className={FlightsStyle.flight_route}>
                <h4>{item.flight.departureAirportDetails.city} ({item.flight.departureAirportDetails.code})</h4>
                <p>{new Date(item.flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>
                  {`${new Date(item.flight.departureTime).getDate()}/${new Date(item.flight.departureTime).getMonth() + 1}/${new Date(item.flight.departureTime).getFullYear()}`}
                </p>
              </div>

              <div className={FlightsStyle.middle_container}>
                <Plane className={FlightsStyle.flight_icon} />
              </div>


              <div className={FlightsStyle.flight_route}>
                <h4>{item.flight.arrivalAirportDetails.city} ({item.flight.arrivalAirportDetails.code})</h4>
                <p>{new Date(item.flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>
                  {`${new Date(item.flight.arrivalTime).getDate()}/${new Date(item.flight.arrivalTime).getMonth() + 1}/${new Date(item.flight.arrivalTime).getFullYear()}`}
                </p>
              </div>
            </div>
            <div className={FlightsStyle.flight_actions}>
              <p className={FlightsStyle.capitalize}>Class: {item.class}</p>
              <div className={FlightsStyle.middle_container}>
                <p>Passengers: {item.passengers}</p>
              </div>
              <p>Total: ${item.flight.flightClass[item.class].price * item.passengers}</p>
            </div>
          </div>
        </div>
      ))}

    </div>
    // setDoneChoosing(true)
  );

  const handleFillPassengerInfo = () => {
    setShowPassengerInfo(true);
    setPassengers(Array(searchCriteria.passengerCount).fill({ name: '', email: '' }));
  };

  const handlePassengerInfoChange = (index, field, value) => {
    setPassengers(prevPassengers => {
      const newPassengers = [...prevPassengers];
      newPassengers[index] = { ...newPassengers[index], [field]: value };
      return newPassengers;
    });
  };

  const handleConfirmBooking = async () => {
    try {
      const createdPassengers = await Promise.all(
        passengers.map(passenger =>
          fetch('https://qairline-t28f.onrender.com/api/passengers/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passenger)
          }).then(res => res.json())
        )
      );

      const passengerIDs = createdPassengers.map(p => p.passenger._id);
      console.log("Here are passenger ids: ", passengerIDs);

      const bookingPromises = Object.values(selectedFlights).map(item =>
        fetch('https://qairline-t28f.onrender.com/api/bookings/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userID: "674f27aae3e51236a5d700d4",
            flightID: item.flight._id,
            flightClass: item.class,
            passengerCount: item.passengers,
            passengerIDs: passengerIDs,
          })
        }).then(res => res.json())
      );

      const bookingResults = await Promise.all(bookingPromises);

      console.log('Booking results:', bookingResults);

      setBookingConfirmed(true);
      setSelectedFlights({});
      setCurrentStep(0);
      setMaxReachedStep(0);
      setShowPassengerInfo(false);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Error during booking process:', error);
      alert('An error occurred while confirming your booking. Please try again.');
    }

    resetState();
  };

  const handleBack = () => {
    setDoneChoosing(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep > 1) {
        const previousFlight = selectedFlights[currentStep - 2]?.flight;
        setPreviousLegArrivalTime(previousFlight ? previousFlight.arrivalTime : null);
      } else {
        setPreviousLegArrivalTime(null);
      }
    }
  };

  const handleNext = () => {
    setDoneChoosing(false);
    if (currentStep < maxReachedStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderSearchArea = () => (
    <div className={`${FlightsStyle.search_area} ${isFlightsPage() === true ? '' : FlightsStyle.not_in_flights}`}>
      <div className={FlightsStyle.tabs}>
        <button
          className={`${FlightsStyle.tab} ${searchType === 'oneWay' ? FlightsStyle.active : ''}`}
          onClick={() => {
            resetState();
            setSearchType('oneWay');
          }}
        >
          One Way
        </button>
        <button
          className={`${FlightsStyle.tab} ${searchType === 'roundTrip' ? FlightsStyle.active : ''}`}
          onClick={() => {
            resetState();
            setSearchType('roundTrip');
          }}
        >
          Round Trip
        </button>
        <button
          className={`${FlightsStyle.tab} ${searchType === 'multiCity' ? FlightsStyle.active : ''}`}
          onClick={() => {
            resetState();
            setSearchType('multiCity');
          }}
        >
          Multi-City
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={searchType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {searchType === 'oneWay' && (
            <div className={FlightsStyle.form_group}>
              <div className={FlightsStyle.form_grid}>
                <div className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="departureCity">From</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        id="departureCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.departureCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, departureCity: e.target.value })}
                        placeholder="Departure City"
                      />
                    </div>
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="destinationCity">To</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        id="destinationCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.destinationCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, destinationCity: e.target.value })}
                        placeholder="Destination City"
                      />
                    </div>
                  </div>

                </div>
                <div className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="departureDate">Departure Date</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Calendar className={FlightsStyle.input_icon} />
                      <input
                        id="departureDate"
                        className={FlightsStyle.input}
                        type="date"
                        value={searchCriteria.departureDate}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, departureDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* <div className={FlightsStyle.form_row}> */}
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="passengerCount">Passengers</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Users className={FlightsStyle.input_icon} />
                      <input
                        id="passengerCount"
                        className={FlightsStyle.input}
                        type="number"
                        value={searchCriteria.passengerCount}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, passengerCount: parseInt(e.target.value) })}
                        min={1}
                      />
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>

            </div>
          )}

          {searchType === 'roundTrip' && (
            <div className={FlightsStyle.form_group}>
              <div className={FlightsStyle.form_grid}>
                <div className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="departureCity">From</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        id="departureCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.departureCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, departureCity: e.target.value })}
                        placeholder="Departure City"
                      />
                    </div>
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="destinationCity">To</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        id="destinationCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.destinationCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, destinationCity: e.target.value })}
                        placeholder="Destination City"
                      />
                    </div>
                  </div>
                </div>
                <div className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="departureDate">Departure Date</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Calendar className={FlightsStyle.input_icon} />
                      <input
                        id="departureDate"
                        className={FlightsStyle.input}
                        type="date"
                        value={searchCriteria.departureDate}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, departureDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="returnDate">Return Date</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Calendar className={FlightsStyle.input_icon} />
                      <input
                        id="returnDate"
                        className={FlightsStyle.input}
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className={FlightsStyle.form_row}>
                <div className={FlightsStyle.form_group}>
                  <label className={FlightsStyle.label} htmlFor="passengerCount">Passengers</label>
                  <div className={FlightsStyle.input_wrapper}>
                    <Users className={FlightsStyle.input_icon} />
                    <input
                      id="passengerCount"
                      className={FlightsStyle.input}
                      type="number"
                      value={searchCriteria.passengerCount}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, passengerCount: parseInt(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            </div>

          )}

          {searchType === 'multiCity' && (
            <div className={FlightsStyle.multi_city_flights}>
              {multiCityFlights.map((flight, index) => (
                <div key={index} className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor={`departureCity-${index}`}>From</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        id={`departureCity-${index}`}
                        className={FlightsStyle.input}
                        value={flight.departureCity}
                        onChange={(e) => {
                          const newFlights = [...multiCityFlights];
                          newFlights[index].departureCity = e.target.value;
                          setMultiCityFlights(newFlights);
                        }}
                        placeholder="Departure City"
                      />
                    </div>
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor={`destinationCity-${index}`}>To</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        id={`destinationCity-${index}`}
                        className={FlightsStyle.input}
                        value={flight.destinationCity}
                        onChange={(e) => {
                          const newFlights = [...multiCityFlights];
                          newFlights[index].destinationCity = e.target.value;
                          setMultiCityFlights(newFlights);
                        }}
                        placeholder="Destination City"
                      />
                    </div>
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor={`departureDate-${index}`}>Date</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Calendar className={FlightsStyle.input_icon} />
                      <input
                        id={`departureDate-${index}`}
                        className={FlightsStyle.input}
                        type="date"
                        value={flight.departureDate}
                        onChange={(e) => {
                          const newFlights = [...multiCityFlights];
                          newFlights[index].departureDate = e.target.value;
                          setMultiCityFlights(newFlights);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={FlightsStyle.multi_city_actions}>
                <button
                  className={`${FlightsStyle.button} ${FlightsStyle.button_secondary}`}
                  onClick={() => setMultiCityFlights([...multiCityFlights, { departureCity: '', destinationCity: '', departureDate: '' }])}
                >
                  Add Flight
                </button>
                <button
                  className={`${FlightsStyle.button} ${FlightsStyle.button_outline}`}
                  onClick={() => setMultiCityFlights(multiCityFlights.slice(0, -1))}
                  disabled={multiCityFlights.length <= 2}
                >
                  Remove Flight
                </button>
              </div>
              <div className={FlightsStyle.form_row}>
                <div className={FlightsStyle.form_group}>
                  <label className={FlightsStyle.label} htmlFor="passengerCount">Passengers</label>
                  <div className={FlightsStyle.input_wrapper}>
                    <Users className={FlightsStyle.input_icon} />
                    <input
                      id="passengerCount"
                      className={FlightsStyle.input}
                      type="number"
                      value={searchCriteria.passengerCount}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, passengerCount: parseInt(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button className={`${FlightsStyle.button} ${FlightsStyle.button_primary} ${FlightsStyle.button_full}`} onClick={handleSearch}>
        <Search className={FlightsStyle.button_icon} />
        Search Flights
      </button>
    </div>
  )

  if (!isFlightsPage()) {
    return renderSearchArea();
  }

  return (
    <div className={FlightsStyle.container}>
      <h1 className={FlightsStyle.search_title}>Find Your Perfect Flight</h1>

      {renderSearchArea()}

      {isLoading && (
        <div className={FlightsStyle.loader_container}>
          <div className={FlightsStyle.loader}></div>
        </div>
      )}

      {currentStep < getTotalRoutes() && searchResults.length > 0 && (
        <div className={FlightsStyle.flight_results_container}>
          {renderFlightResults(searchResults[currentStep] || [], currentStep)}

        </div>
      )}

      {/* {currentStep === getTotalRoutes() - 1 && Object.keys(selectedFlights).length === getTotalRoutes() && (
        <div className={FlightsStyle.booked_flights_container}>
          {renderBookedFlights()}
          <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline}`} onClick={handlePreviousStep}>
            <ArrowLeft className={FlightsStyle.button_icon} />
            Back to Flight Selection
          </button>
        </div>
      )} */}

      <button className={FlightsStyle.cart_button} onClick={() => setIsCartOpen(!isCartOpen)}>
        <ShoppingCart className={FlightsStyle.button_icon} />
        Cart ({Object.keys(selectedFlights).length})
      </button>

      {isCartOpen && (
        <div className={FlightsStyle.cart_popover}>
          <h2 className={FlightsStyle.cart_title}>Your Cart</h2>
          <div className={FlightsStyle.cart_scroll_area}>
            {Object.entries(selectedFlights).map(([index, item]) => (
              <div key={index} className={FlightsStyle.cart_item}>
                <div className={`${FlightsStyle['flight-details']} ${FlightsStyle.details_container}`}>

                  <p className={FlightsStyle['flight-code']}>
                    {item.flight.flightCode}: {item.flight.departureAirportDetails.city} to {item.flight.arrivalAirportDetails.city}
                  </p>
                  <p className="class">
                    <span>Class:</span> {item.class}
                  </p>

                  <p className="passengers">
                    <span>Passengers:</span> {item.passengers}
                  </p>

                  <p className="price">
                    <span>Price:</span> ${item.flight.flightClass[item.class].price * item.passengers}
                  </p>

                </div>
                <div className={FlightsStyle['separator']} />

                <div className={FlightsStyle.full_height_container}>
                  <button className={`${FlightsStyle.button} ${FlightsStyle.clear_button}`} onClick={() => removeFromCart(parseInt(index))}>
                    <X />
                  </button>
                </div>

              </div>
            ))}
          </div>
          <div className={FlightsStyle.cart_total}>
            <span>Total:</span>
            <span className={FlightsStyle.cart_total_price}>${getTotalPrice()}</span>
          </div>
          <div className={FlightsStyle.cart_actions}>
            <button className={`${FlightsStyle.button} ${FlightsStyle.button_primary} ${FlightsStyle.button_full}`} onClick={handleFillPassengerInfo}>
              <h3>Fill Passenger Info</h3>
            </button>
            <button className={`${FlightsStyle.button} ${FlightsStyle.button_outline} ${FlightsStyle.button_full} ${FlightsStyle.clear_button}`} onClick={clearCart}>
              <Trash2 className={FlightsStyle.button_icon} />
              <h2 div className={FlightsStyle.white_text}>Clear Cart</h2>
            </button>
          </div>
        </div>
      )}

      {showPassengerInfo && (
        <div className={FlightsStyle.modal}>
          <div className={FlightsStyle.modal_content}>
            <button className={FlightsStyle.close_button} onClick={() => setShowPassengerInfo(false)}>×</button>
            <h2 className={FlightsStyle.center_text}>Passenger Information</h2>
            {passengers.map((passenger, index) => (
              <div key={index} className={`${FlightsStyle.passenger_form} ${FlightsStyle.details_container}`}>
                <h3>Passenger {index + 1}</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={passenger.name}
                  onChange={(e) => handlePassengerInfoChange(index, 'name', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerInfoChange(index, 'email', e.target.value)}
                />
              </div>
            ))}
            <button className={`${FlightsStyle.button} ${FlightsStyle.button_primary} ${FlightsStyle.bottom_button}`} onClick={handleConfirmBooking}>
              <h2 className={FlightsStyle.white_text}>Confirm Booking</h2>
            </button>
          </div>
        </div>
      )}

      {showFlightDetails && (
        <div className={FlightsStyle.modal}>
          <div className={FlightsStyle.modal_content}>
            <h2 className={FlightsStyle.center_text}>Flight Details</h2>
            {selectedFlight && (
              <div className={FlightsStyle.details_container}>
                <p><strong>Flight Code:</strong> {selectedFlight.flightCode}</p>
                <p><strong>From:</strong> {selectedFlight.departureAirportDetails.city} ({selectedFlight.departureAirportDetails.code})</p>
                <p><strong>To:</strong> {selectedFlight.arrivalAirportDetails.city} ({selectedFlight.arrivalAirportDetails.code})</p>
                <p><strong>Departure:</strong> {new Date(selectedFlight.departureTime).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {new Date(selectedFlight.arrivalTime).toLocaleString()}</p>
                <p><strong>Duration:</strong> {selectedFlight.flightDuration}</p>
                <p><strong>Aircraft:</strong> {selectedFlight.aircraft}</p>
                <h3>Economy Class:</h3>
                <ul>
                  <li>Price: ${selectedFlight.flightClass.economy.price}</li>
                  <li>Available Seats: {selectedFlight.flightClass.economy.seatsAvailable}</li>
                </ul>
                <h3>Business Class:</h3>
                <ul>
                  <li>Price: ${selectedFlight.flightClass.business.price}</li>
                  <li>Available Seats: {selectedFlight.flightClass.business.seatsAvailable}</li>
                </ul>
              </div>
            )}
            <button className={`${FlightsStyle.button} ${FlightsStyle.bottom_button}`} onClick={() => setShowFlightDetails(false)}>Close</button>
          </div>
        </div>
      )}

      {bookingConfirmed && (
        <div className={FlightsStyle.modal}>
          <div className={FlightsStyle.modal_content}>
            <h2>Booking Confirmed</h2>
            <p>Your booking has been successfully confirmed. Thank you for choosing our airline!</p>
            <button className={`${FlightsStyle.button_primary}`} onClick={() => {
              setBookingConfirmed(false);
              setShowPassengerInfo(false);
              setIsCartOpen(false);
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )

}

