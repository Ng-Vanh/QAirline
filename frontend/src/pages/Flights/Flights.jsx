'use client'

import { useState, useEffect, useRef } from 'react'
import { Plane, ArrowRight, ArrowLeft, Search, Calendar, MapPin, Users, CreditCard, Luggage, X, ShoppingCart, Info, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../components/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightsStyle from './Flights.module.css'
import Config from '../../Config.js'
import * as Toast from "@radix-ui/react-toast"

export default function Flights() {
  const { isAuthenticated, name, userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const apiBaseUrl = Config.apiBaseUrl;

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

  // const handleLoginRedirect = (thePrevState = {}) => {
  //   console.log("Inside handle redirect, the prev state is: ", thePrevState);
  //   navigate('/login', {
  //     state: {
  //       from: location.pathname,
  //       prevState: thePrevState
  //     },
  //   });
  // };

  const handleNavigationRedirect = (destination, thePrevState = {}) => {
    console.log("Inside handle redirect, the prev state is: ", thePrevState);
    navigate(destination, {
      state: {
        from: location.pathname,
        prevState: thePrevState
      },
    });
  };

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

  const [lockedSearchCriteria, setLockedSearchCriteria] = useState({
    departureCity: '',
    destinationCity: '',
    departureDate: '',
    passengerCount: 1
  })
  const [lockedReturnDate, setLockedReturnDate] = useState('')
  const [lockedMultiCityFlights, setLockedMultiCityFlights] = useState([
    { departureCity: '', destinationCity: '', departureDate: '' },
    { departureCity: '', destinationCity: '', departureDate: '' }
  ])

  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConfirmBooking, setIsLoadingConfirmBooking] = useState(false)
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
  const [airports, setAirports] = useState([])

  const [openSuggestions, setOpenSuggestions] = useState(null)
  const suggestionRefs = useRef({})

  const flightModalRef = useRef()
  const passengerModalRef = useRef()
  const cartPopverRef = useRef()

  const [emailErrors, setEmailErrors] = useState(Array(passengers.length).fill(''));

  // const [listBookingResults, setListBookingResuls] = useState([])

  const isFlightsPage = () => {
    return window.location.pathname === '/flights'
  }

  const getTotalRoutes = () => {
    if (searchType === 'oneWay') return 1
    if (searchType === 'roundTrip') return 2
    return multiCityFlights.length
  }

  // const retrieveUrlData = async () => {
  //   const searchParams = new URLSearchParams(window.location.search)

  //   const type = searchParams.get('searchType');
  //   if (type) setSearchType(type);

  //   const departureCityParam = searchParams.get('departureCity');
  //   const destinationCityParam = searchParams.get('destinationCity');
  //   const departureDateParam = searchParams.get('departureDate');
  //   const passengerCountParam = searchParams.get('passengerCount');
  //   const returnDateParam = searchParams.get('returnDate');
  //   const multiCityFlightsParam = searchParams.get('multiCityFlights');

  //   if (departureCityParam || destinationCityParam || departureDateParam || passengerCountParam) {
  //     console.log("YES, url has data")
  //     console.log(departureCityParam)
  //     console.log(destinationCityParam)
  //     console.log(departureDateParam)
  //     console.log(passengerCountParam)
  //     console.log({
  //       departureCity: departureCityParam || '',
  //       destinationCity: destinationCityParam || '',
  //       departureDate: departureDateParam || '',
  //       passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
  //     });

  //     setSearchCriteria({
  //       departureCity: departureCityParam || '',
  //       destinationCity: destinationCityParam || '',
  //       departureDate: departureDateParam || '',
  //       passengerCount: passengerCountParam ? parseInt(passengerCountParam) : 1,
  //     });
  //     console.log(searchCriteria)
  //     console.log('-----------------------')
  //   }

  //   if (returnDateParam) setReturnDate(returnDateParam);

  //   if (multiCityFlightsParam) {
  //     try {
  //       const parsedMultiCityFlights = JSON.parse(multiCityFlightsParam);
  //       setMultiCityFlights(parsedMultiCityFlights);
  //     } catch (error) {
  //       console.error('Error parsing multiCityFlights:', error);
  //     }
  //   }

  //   if (type) {
  //     handleSearch()
  //   }
  // }


  const searchFlights = async (criteria) => {
    console.log('Searching flights with criteria:', criteria)
    setIsLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/flights/search`, {
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
      // console.log("hello")
      // const prevState2 = {searchType: 'oneWay', departureCity: 'x', destinationCity: 'x', departureDate: '', passengerCount: 1}
      // console.log("Inside login.jsx, prevState is: ", prevState2);

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
        console.log("Seted auto search based on param");
        setIsAutoSearch(true);
      }
      else {
        setIsAutoSearch(false);
      }
    }
  }, []);


  // useEffect(() => {
  //   const prevState = location.state?.prevState;
  //   console.log("Entire prevState: ", prevState);
  //   if (prevState) {
  //     console.log("prevState exists", prevState)
  //     const {
  //       searchType: searchTypeState,
  //       departureCity: departureCityState,
  //       destinationCity: destinationCityState,
  //       departureDate: departureDateState,
  //       passengerCount: passengerCountState,
  //       returnDate: returnDateState,
  //       multiCityFlights: multiCityFlightsState,
  //     } = prevState;

  //     // Handle searchType
  //     if (searchTypeState) setSearchType(searchTypeState);

  //     // Check for other search criteria
  //     if (departureCityState || destinationCityState || departureDateState || passengerCountState) {
  //       console.log("YES, prevState has data");
  //       console.log(departureCityState);
  //       console.log(destinationCityState);
  //       console.log(departureDateState);
  //       console.log(passengerCountState);

  //       const newSearchCriteria = {
  //         departureCity: departureCityState || '',
  //         destinationCity: destinationCityState || '',
  //         departureDate: departureDateState || '',
  //         passengerCount: passengerCountState ? parseInt(passengerCountState, 10) : 1,
  //       };

  //       setSearchCriteria(newSearchCriteria); // Update state
  //       console.log('Setting search criteria:', newSearchCriteria); // Log what you are setting
  //     }

  //     // Handle returnDate
  //     if (returnDateState) setReturnDate(returnDateState);

  //     // Handle multiCityFlights
  //     if (multiCityFlightsState) {
  //       try {
  //         console.log("This is multi-city flights");
  //         const parsedMultiCityFlights = JSON.parse(multiCityFlightsState);
  //         setMultiCityFlights(parsedMultiCityFlights);
  //         console.log(parsedMultiCityFlights);
  //       } catch (error) {
  //         console.error('Error parsing multiCityFlights:', error);
  //       }
  //     }
  //   }
  // }, [location.state]);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    const prevState = location.state?.prevState;
    console.log("Entire prevState: ", prevState);
    if (prevState) {
      console.log("prevState exists", prevState);

      // Destructure all properties from prevState
      const {
        searchType: searchTypeState,
        departureCity: departureCityState,
        destinationCity: destinationCityState,
        departureDate: departureDateState,
        passengerCount: passengerCountState,
        returnDate: returnDateState,
        multiCityFlights: multiCityFlightsState,
        // Additional states
        // searchResults: searchResultsState,
        // isLoading: isLoadingState,
        isLoadingConfirmBooking: isLoadingConfirmBookingState,
        // currentSearchStep: currentSearchStepState,
        // isCartOpen: isCartOpenState,
        // selectedFlight: selectedFlightState,
        // showFlightDetails: showFlightDetailsState,
        selectedFlights: selectedFlightsState,
        showPassengerInfo: showPassengerInfoState,
        passengers: passengersState,
        // bookingConfirmed: bookingConfirmedState,
        // currentStep: currentStepState,
        // maxReachedStep: maxReachedStepState,
        // previousLegArrivalTime: previousLegArrivalTimeState,
        // doneChoosing: doneChoosingState,
        isAutoSearch: isAutoSearchState,
        // airports: airportsState,
        // openSuggestions: openSuggestionsState,
        // suggestionRefs: suggestionRefsState,
      } = prevState;

      // Handle searchType
      if (searchTypeState) setSearchType(searchTypeState);

      // Check for other search criteria
      if (departureCityState || destinationCityState || departureDateState || passengerCountState) {
        console.log("YES, prevState has data");
        console.log(departureCityState);
        console.log(destinationCityState);
        console.log(departureDateState);
        console.log(passengerCountState);

        const newSearchCriteria = {
          departureCity: departureCityState || '',
          destinationCity: destinationCityState || '',
          departureDate: departureDateState || '',
          passengerCount: passengerCountState ? parseInt(passengerCountState, 10) : 1,
        };

        setSearchCriteria(newSearchCriteria); // Update state
        console.log('Setting search criteria:', newSearchCriteria); // Log what you are setting
      }

      // Handle returnDate
      if (returnDateState) setReturnDate(returnDateState);

      // Handle multiCityFlights
      if (multiCityFlightsState) {
        try {
          console.log("This is multi-city flights");
          const parsedMultiCityFlights = JSON.parse(multiCityFlightsState);
          setMultiCityFlights(parsedMultiCityFlights);
          console.log(parsedMultiCityFlights);
        } catch (error) {
          console.error('Error parsing multiCityFlights:', error);
        }
      }

      // Restore additional states
      // setSearchResults(searchResultsState || []);

      // setIsLoading(isLoadingState || false);

      setIsLoadingConfirmBooking(isLoadingConfirmBookingState || false);
      setIsAutoSearch(isAutoSearchState || false);

      // setCurrentSearchStep(currentSearchStepState || 0);
      // setIsCartOpen(isCartOpenState || false);
      // setSelectedFlight(selectedFlightState || null);
      // setShowFlightDetails(showFlightDetailsState || false);
      setSelectedFlights(selectedFlightsState || {});
      setShowPassengerInfo(showPassengerInfoState || false);
      setPassengers(passengersState || []);
      // setBookingConfirmed(bookingConfirmedState || false);
      // setCurrentStep(currentStepState || 0);
      // setMaxReachedStep(maxReachedStepState || 0);
      // setPreviousLegArrivalTime(previousLegArrivalTimeState || null);
      // setDoneChoosing(doneChoosingState || false);

      // setAirports(airportsState || []);
      // setOpenSuggestions(openSuggestionsState || null);

      // if (suggestionRefsState) suggestionRefs.current = suggestionRefsState; // Restore ref 

      navigate(location.pathname, { replace: true, state: null });

      // if (isAutoSearch) {
      //   handleSearch();
      // }
    }
  }, [location.state]);

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
        console.log("This is auto search");
        handleSearch();
        setIsAutoSearch(false);
      }
    }
  }, [searchCriteria, returnDate, multiCityFlights]);

  useEffect(() => {
    if (isFlightsPage() && isLoadingConfirmBooking) {
      handleConfirmBooking();
    }
  }, [isAuthenticated, passengers]);

  // useEffect(() => {
  //   handleSearch()
  //   console.log('Updated Search Criteria:', searchCriteria)
  // }, [searchCriteria])  // This effect runs every time `searchCriteria` changes

  const resetState = () => {
    setSearchResults([])
    clearCart()
    setDoneChoosing(false)
    setMultiCityFlights([
      { departureCity: searchCriteria.departureCity, destinationCity: searchCriteria.destinationCity, departureDate: searchCriteria.departureDate },
      { departureCity: '', destinationCity: '', departureDate: '' }
    ])
  }

  const handleSearch = async () => {
    if (!isFlightsPage()) {
      // const params = new URLSearchParams()
      // params.set('searchType', searchType)
      // params.set('departureCity', searchCriteria.departureCity)
      // params.set('destinationCity', searchCriteria.destinationCity)
      // params.set('departureDate', searchCriteria.departureDate)
      // params.set('passengerCount', searchCriteria.passengerCount.toString())
      // if (searchType === 'roundTrip') {
      //   params.set('returnDate', returnDate)
      // } else if (searchType === 'multiCity') {
      //   params.set('multiCityFlights', JSON.stringify(multiCityFlights))
      // }

      // window.location.href = `/flights?${params.toString()}`
      // return

      setIsAutoSearch(true);
      console.log("Set is auto search: ", isAutoSearch);
      storePrevStateAndNavigate('/flights')
      // return;
    }

    // if (!isAuthenticated) {
    //   const prevState = {
    //     searchType: searchType,
    //     departureCity: searchCriteria.departureCity || '',
    //     destinationCity: searchCriteria.destinationCity || '',
    //     departureDate: searchCriteria.departureDate || '',
    //     passengerCount: searchCriteria.passengerCount || 1,
    //     ...(searchType === 'roundTrip' && { returnDate: returnDate }),
    //     ...(searchType === 'multiCity' && { multiCityFlights: JSON.stringify(multiCityFlights) }),
    //   };

    //   console.log("Preparing data for navigation", prevState);
    //   handleLoginRedirect(prevState);
    // }



    console.log('Searching for:', searchType)
    setIsLoading(true)
    setSearchResults([])
    setSelectedFlights({})
    setCurrentStep(0)
    setMaxReachedStep(0)
    setPreviousLegArrivalTime(null)
    setDoneChoosing(false)

    let searchPromises = []

    const validPassengerCount = (count) => {
      if (isNaN(count) || count <= 0) {
        return 1;
      }
      return Math.min(9, count);
    };

    searchCriteria.passengerCount = validPassengerCount(searchCriteria.passengerCount);

    setLockedSearchCriteria(searchCriteria)
    setLockedReturnDate(returnDate)
    setLockedMultiCityFlights(multiCityFlights)

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
      showToast('Error', 'An error occurred while searching for flights. Please try again.', 'error');
      // alert('An error occurred while searching for flights. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openSuggestions &&
        suggestionRefs.current[openSuggestions] &&
        !suggestionRefs.current[openSuggestions]?.contains(event.target)
      ) {
        setOpenSuggestions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSuggestions]);


  useEffect(() => {
    const handleClickOutsideEvent = (event, elementRef, setterFunction) => {
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        setterFunction(false);
      }
    };

    const handleClickOutside = (event) => {
      handleClickOutsideEvent(event, flightModalRef, setShowFlightDetails);
      handleClickOutsideEvent(event, passengerModalRef, setShowPassengerInfo);
      handleClickOutsideEvent(event, cartPopverRef, setIsCartOpen);
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowFlightDetails, setShowPassengerInfo, setIsCartOpen]);

  const getFilteredAirports = (value) => {
    if (value.trim() === '') {
      return airports.slice(0, 5); // Return first 5 airports when input is empty
    }
    return airports
      .filter(
        (airport) =>
          airport.city.toLowerCase().includes(value.toLowerCase()) ||
          airport.code.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 results
  };

  const handleInputChange = (value, field) => {
    if (searchType === 'multiCity') {
      const newFlights = [...multiCityFlights];
      const index = parseInt(field.split('-')[1]);
      newFlights[index] = { ...newFlights[index], [field.split('-')[0]]: value };
      setMultiCityFlights(newFlights);
    } else {
      setSearchCriteria((prev) => ({ ...prev, [field]: value }));
    }
    setOpenSuggestions(field);
  };

  const handleSuggestionClick = (airport, field) => {
    if (searchType === 'multiCity') {
      const newFlights = [...multiCityFlights];
      const index = parseInt(field.split('-')[1]);
      newFlights[index] = { ...newFlights[index], [field.split('-')[0]]: airport.city };
      setMultiCityFlights(newFlights);
    } else {
      setSearchCriteria({ ...searchCriteria, [field]: airport.city });
    }
    setOpenSuggestions(null);
  };

  const renderAutocompleteInput = (field, placeholder, value) => (
    <div
      className={FlightsStyle.autocomplete_wrapper}
      ref={(el) => (suggestionRefs.current[field] = el)}
    >
      <div className={FlightsStyle.input_wrapper}>
        <MapPin className={FlightsStyle.input_icon} />
        <input
          className={FlightsStyle.input}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value, field)}
          onFocus={() => setOpenSuggestions(field)}
          autoComplete="off"
        />
      </div>
      <AnimatePresence>
        {openSuggestions === field && (
          <motion.div
            className={FlightsStyle.suggestions_container}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {getFilteredAirports(value).map((airport) => (
              <motion.div
                key={airport._id}
                className={FlightsStyle.suggestion_item}
                onClick={() => handleSuggestionClick(airport, field)}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <span className={FlightsStyle.suggestion_city}>{airport.city}</span>
                <span className={FlightsStyle.suggestion_code}>{airport.code}</span>
              </motion.div>
            ))}
            {getFilteredAirports(value).length === 0 && (
              <div className={FlightsStyle.no_suggestions}>No matching cities found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/airports`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAirports(data.airports)
      } catch (error) {
        console.error('Error fetching airports:', error)
      }
    }

    fetchAirports()
  }, [])

  const handleAddToCart = (flight, flightClass) => {
    const newItem = {
      flight,
      class: flightClass,
      passengers: searchCriteria.passengerCount
    };

    // if (Object.keys(selectedFlights).length >= getTotalRoutes() - 1) {
    //   setDoneChoosing(true);
    // }

    const existingItem = selectedFlights[currentStep];
    if (existingItem && existingItem.flight._id !== flight._id) {
      setSelectedFlights(prev => {
        const updatedFlights = { ...prev };
        for (let step = currentStep + 1; step < getTotalRoutes(); step++) {
          delete updatedFlights[step];
        }
        return updatedFlights;
      });
    }


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

  const [sortCriteria, setSortCriteria] = useState('price');

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortFlights = (flights) => {
    return flights.sort((a, b) => {
      if (sortCriteria === 'price') {
        return a.flightClass.economy.price - b.flightClass.economy.price;
      } else if (sortCriteria === 'departureDate') {
        return new Date(a.departureTime) - new Date(b.departureTime);
      }
      return 0;
    });
  };

  const renderFlightResults = (flights, routeIndex) => {
    const routeInfo = getRouteInfo(routeIndex);

    if (Object.keys(selectedFlights).length === getTotalRoutes()) {
      console.log("Already selected all flights", getTotalRoutes());
      console.log("Status of doneChoosing: ", doneChoosing);
    }

    console.log("this is step: ", currentStep);

    // if (Object.keys(selectedFlights).length === getTotalRoutes()) {
    //   return renderBookedFlights();
    // }

    const _filteredFlights = routeIndex > 0 && previousLegArrivalTime
      ? flights.filter(flight => new Date(flight.departureTime) > new Date(previousLegArrivalTime))
      : flights;

    const filteredFlights = sortFlights(_filteredFlights);

    if (doneChoosing) {
      // if (Object.keys(selectedFlights).length === getTotalRoutes()) {
      return renderBookedFlights();
      // }
    }

    // setDoneChoosing(false)
    return ( // flights here
      <div className={FlightsStyle.flight_results}>

        <div className={FlightsStyle.resultTitleAndDropdownContainer}>
          <h2 className={FlightsStyle.flight_results_title}>
            {(() => {
              const formatDate = (dateString) => {
                const date = new Date(dateString);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              };

              if (searchType === 'oneWay') {
                return `${filteredFlights.length} flights from ${lockedSearchCriteria.departureCity} to ${lockedSearchCriteria.destinationCity} on ${formatDate(lockedSearchCriteria.departureDate)}`;
              } else if (searchType === 'roundTrip') {
                if (currentStep === 0) {
                  return `${filteredFlights.length} flights from ${lockedSearchCriteria.departureCity} to ${lockedSearchCriteria.destinationCity} on ${formatDate(lockedSearchCriteria.departureDate)}`;
                } else {
                  return `${filteredFlights.length} return flights from ${lockedSearchCriteria.destinationCity} to ${lockedSearchCriteria.departureCity} on ${formatDate(lockedReturnDate)}`;
                }
              } else if (searchType === 'multiCity') {
                const currentFlight = lockedMultiCityFlights[currentStep];
                return `${filteredFlights.length} flights from ${currentFlight.departureCity} to ${currentFlight.destinationCity} on ${formatDate(currentFlight.departureDate)}`;
              }
              return '';
            })()}
          </h2>


          <div className={FlightsStyle.sortDropdownContainer}>
            <select
              className={FlightsStyle.sortDropdown}
              onChange={handleSortChange}
              value={sortCriteria}
            >
              <option value="price">Sort by Price</option>
              <option value="departureDate">Sort by Departure Date</option>
            </select>
          </div>

        </div>




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

        {/* filteredFlights.length > 0 &&  */}
        {searchType != 'oneWay' && (
          <div className={FlightsStyle.navigation_buttons_section}>

            <button className={`${FlightsStyle.button} ${FlightsStyle.navigation_buttons}`} onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className={FlightsStyle.button_icon} />
              Back
            </button>

            <h5>{currentStep + 1}/{getTotalRoutes()}</h5>
            <button className={`${FlightsStyle.button} ${FlightsStyle.navigation_buttons}`} onClick={handleNext} disabled={currentStep >= maxReachedStep || currentStep >= getTotalRoutes() - 1}>
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
                        className={`${FlightsStyle.button} ${isSelected && selectedClass === 'business' ? FlightsStyle.button_selected : FlightsStyle.button_primary} ${isSelected && selectedClass === 'business' ? FlightsStyle.selected_class : ''}`}
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
          // <p>No suitable flights found for this route and date. Please try different search criteria or adjust your previous flight selection.</p>
          <></>
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
      <h2 className={FlightsStyle.flight_results_title}>Here are your booked flights. Click on cart to proceed!</h2>

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
        <button className={`${FlightsStyle.button} ${FlightsStyle.navigation_buttons}`} onClick={handlePreviousStep}>
          <ArrowLeft className={FlightsStyle.button_icon} />
          Back to flights selection
        </button>
      </div>

      {Object.entries(selectedFlights).map(([index, item]) => (
        <div key={index} className={`${FlightsStyle.flight_card} ${FlightsStyle.fade_in}`}>
          <div className={FlightsStyle.flight_card_content}>
            <div className={FlightsStyle.flight_header}>
              <div className={FlightsStyle.flight_header_left_container}>
                <h3>{item.flight.flightCode}</h3>
                <h4>{item.flight.aircraft}</h4>
              </div>
              {/* <h3>{item.flight.flightCode}</h3> */}
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

      if (field === 'email') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (value && !emailRegex.test(value)) {
          setEmailErrors(prevErrors => {
            const newErrors = [...prevErrors];
            newErrors[index] = 'Invalid email address';
            return newErrors;
          });
          // return prevPassengers;
        } else {
          setEmailErrors(prevErrors => {
            const newErrors = [...prevErrors];
            newErrors[index] = '';
            return newErrors;
          });
        }
      }

      newPassengers[index] = { ...newPassengers[index], [field]: value };
      return newPassengers;
    });
  };

  const storePrevStateAndNavigate = (destination) => {
    console.log("Inside store prev, is loading is: ", isLoadingConfirmBooking);

    const prevState = {
      searchType: searchType,
      departureCity: searchCriteria.departureCity || '',
      destinationCity: searchCriteria.destinationCity || '',
      departureDate: searchCriteria.departureDate || '',
      passengerCount: searchCriteria.passengerCount || 1,
      ...(searchType === 'roundTrip' && { returnDate: returnDate }),
      ...(searchType === 'multiCity' && { multiCityFlights: JSON.stringify(multiCityFlights) }),
      // Include other states
      // searchResults,
      // isLoading,
      isLoadingConfirmBooking: (destination === '/login' ? true : false),
      // currentSearchStep,
      // isCartOpen,
      // selectedFlight,
      // showFlightDetails,
      selectedFlights,
      showPassengerInfo,
      passengers,
      // bookingConfirmed,
      // currentStep,
      // maxReachedStep,
      // previousLegArrivalTime,
      // doneChoosing,
      isAutoSearch: (destination === '/login' ? false : isAutoSearch),
      // airports,
      // openSuggestions,
      // suggestionRefs: suggestionRefs.current, // Pass ref content
    };

    console.log("Preparing data for navigation", prevState);
    handleNavigationRedirect(destination, prevState);
  }

  const handleConfirmBooking = async () => {
    if (Object.keys(selectedFlights).length === 0) {
      showToast('Error', 'Please select flights to proceed.', 'error');
      return;
    }

    setIsLoadingConfirmBooking(true);

    if (!isAuthenticated) {
      console.log("BEFORE IN STORE PREV, isloading is ", isLoadingConfirmBooking);
      storePrevStateAndNavigate('/login');
      return;
    }
    try {
      console.log("Doing creating passengers");
      // Step 1: Create Passengers
      const createdPassengers = await Promise.all(
        passengers.map(async (passenger) => {
          const response = await fetch(`${apiBaseUrl}/api/passengers/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passenger),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showToast('Error', errorData.message || response.statusText, 'error');
            throw new Error(`Passenger creation failed: ${errorData.message || response.statusText}`);
          }

          return response.json();
        })
      );

      const passengerIDs = createdPassengers.map((p) => p.passenger._id);
      console.log('Here are passenger IDs:', passengerIDs);

      console.log("Can come to passengers?");

      console.log("Selected flights: ", selectedFlights);
      // Step 2: Create Bookings
      const bookingPromises = Object.values(selectedFlights).map(async (item) => {
        const response = await fetch(`${apiBaseUrl}/api/bookings/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userID: userId,
            flightID: item.flight._id,
            flightClass: item.class,
            passengerCount: item.passengers,
            passengerIDs: passengerIDs,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showToast('Error', errorData.message || response.statusText, 'error');
          throw new Error(`Booking creation failed: ${errorData.message || response.statusText}`);
        }

        return response.json();
      });


      const bookingResults = await Promise.all(bookingPromises);

      console.log("Booking promises: ", bookingPromises);

      // setListBookingResuls(bookingResults);

      console.log('Booking results:', bookingResults);

      console.log("Does it even reach this step?")

      // Step 3: Update State on Success
      setBookingConfirmed(true);
      setSelectedFlights({});
      setCurrentStep(0);
      setMaxReachedStep(0);
      setShowPassengerInfo(false);
      setIsCartOpen(false);
      resetState();

      scrollToTop();
    } catch (error) {
      console.error('Error during booking process:', error);

      // Display user-friendly error
      // alert(error.message || 'An unexpected error occurred while confirming your booking. Please try again.');
      showToast('Error', error.message || 'An unexpected error occurred while confirming your booking. Please try again.', 'error');
    } finally {
      setIsLoadingConfirmBooking(false);
      // setBookingConfirmed(true);
      // setSelectedFlights({});
      // setCurrentStep(0);
      // setMaxReachedStep(0);
      // setShowPassengerInfo(false);
      // setIsCartOpen(false);
      // resetState();
    }
  };


  // const handleConfirmBooking = async () => {
  //   setIsLoadingConfirmBooking(true);
  //   try {
  //     const createdPassengers = await Promise.all(
  //       passengers.map(passenger =>
  //         fetch(`${apiBaseUrl}/api/passengers/`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(passenger)
  //         }).then(res => res.json())
  //       )
  //     );

  //     const passengerIDs = createdPassengers.map(p => p.passenger._id);
  //     console.log("Here are passenger ids: ", passengerIDs);

  //     const bookingPromises = Object.values(selectedFlights).map(item =>
  //       fetch(`${apiBaseUrl}/api/bookings/`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           userID: currentUser.userId,
  //           flightID: item.flight._id,
  //           flightClass: item.class,
  //           passengerCount: item.passengers,
  //           passengerIDs: passengerIDs,
  //         })
  //       }).then(res => res.json())
  //     );

  //     const bookingResults = await Promise.all(bookingPromises);

  //     console.log('Booking results:', bookingResults);

  //     setBookingConfirmed(true);
  //     setSelectedFlights({});
  //     setCurrentStep(0);
  //     setMaxReachedStep(0);
  //     setShowPassengerInfo(false);
  //     setIsCartOpen(false);
  //     resetState();
  //   } catch (error) {
  //     console.error('Error during booking process:', error);
  //     alert('An error occurred while confirming your booking. Please try again.');
  //   } finally {
  //     setIsLoadingConfirmBooking(false);
  //   }
  // };

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
    <div
      className={`${FlightsStyle.search_area} ${isFlightsPage() === true ? '' : FlightsStyle.not_in_flights
        }`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearch(); // Trigger the search when Enter is pressed
        }
      }}
    >



      {/* <div className={`${FlightsStyle.search_area} ${isFlightsPage() === true ? '' : FlightsStyle.not_in_flights}`}> */}
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
                    {renderAutocompleteInput('departureCity', 'Departure City', searchCriteria.departureCity)}
                    {/* {RenderAutocompleteInput({
                      placeholder: "Departure City",
                      value: searchCriteria.departureCity,
                      onChange: ((value) => setSearchCriteria({ ...searchCriteria, departureCity: value })),
                    })} */}

                    {/* <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        spellCheck={false}
                        id="departureCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.departureCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, departureCity: e.target.value })}
                        placeholder="Departure City"
                      />
                    </div> */}
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="destinationCity">To</label>
                    {renderAutocompleteInput('destinationCity', 'Destination City', searchCriteria.destinationCity)}
                    {/* {RenderAutocompleteInput({
                      placeholder: "Destination City",
                      value: searchCriteria.destinationCity,
                      onChange: ((value) => setSearchCriteria({ ...searchCriteria, destinationCity: value })),
                    })} */}

                    {/* <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        spellCheck={false}
                        id="destinationCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.destinationCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, destinationCity: e.target.value })}
                        placeholder="Destination City"
                      />
                    </div> */}
                  </div>

                </div>
                <div className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="departureDate">Departure Date</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Calendar className={FlightsStyle.input_icon} />
                      <input
                        spellCheck={false}
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
                        spellCheck={false}
                        id="passengerCount"
                        className={FlightsStyle.input}
                        type="number"
                        value={searchCriteria.passengerCount}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, passengerCount: Math.min(9, parseInt(e.target.value)) })}
                        min={1}
                        max={9}
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
                    {renderAutocompleteInput('departureCity', 'Departure City', searchCriteria.departureCity)}
                    {/* {RenderAutocompleteInput({
                      placeholder: "Departure City",
                      value: searchCriteria.departureCity,
                      onChange: ((value) => setSearchCriteria({ ...searchCriteria, departureCity: value })),
                    })} */}

                    {/* <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        spellCheck={false}
                        id="departureCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.departureCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, departureCity: e.target.value })}
                        placeholder="Departure City"
                      />
                    </div> */}
                  </div>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="destinationCity">To</label>
                    {renderAutocompleteInput('destinationCity', 'Destination City', searchCriteria.destinationCity)}
                    {/* {RenderAutocompleteInput({
                      placeholder: "Destination City",
                      value: searchCriteria.destinationCity,
                      onChange: ((value) => setSearchCriteria({ ...searchCriteria, destinationCity: value })),
                    })} */}

                    {/* <div className={FlightsStyle.input_wrapper}>
                      <MapPin className={FlightsStyle.input_icon} />
                      <input
                        spellCheck={false}
                        id="destinationCity"
                        className={FlightsStyle.input}
                        value={searchCriteria.destinationCity}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, destinationCity: e.target.value })}
                        placeholder="Destination City"
                      />
                    </div> */}
                  </div>
                </div>
                <div className={FlightsStyle.form_row}>
                  <div className={FlightsStyle.form_group}>
                    <label className={FlightsStyle.label} htmlFor="departureDate">Departure Date</label>
                    <div className={FlightsStyle.input_wrapper}>
                      <Calendar className={FlightsStyle.input_icon} />
                      <input
                        spellCheck={false}
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
                        spellCheck={false}
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
                      spellCheck={false}
                      id="passengerCount"
                      className={FlightsStyle.input}
                      type="number"
                      value={searchCriteria.passengerCount}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, passengerCount: Math.min(9, parseInt(e.target.value)) })}
                      min={1}
                      max={9}
                    />
                  </div>
                </div>
              </div>
            </div>

          )}

          {searchType === 'multiCity' && (
            <div className={`${FlightsStyle.multi_city_flights}`}>
              <div className={!isFlightsPage() ? FlightsStyle.scrollable : ''}>
                {multiCityFlights.map((flight, index) => (
                  <div key={index} className={`${FlightsStyle.leg_container}`}>
                    <div className={`${FlightsStyle.form_row}`}>
                      <div className={FlightsStyle.form_group}>

                        <label className={FlightsStyle.label} htmlFor={`departureCity-${index}`}>From</label>
                        {renderAutocompleteInput(`departureCity-${index}`, `Departure City ${index + 1}`, flight.departureCity)}
                        {/* {RenderAutocompleteInput2(`departureCity-${index}`, 'Departure City', flight.departureCity)} */}
                        {/* {RenderAutocompleteInput({
                          placeholder: `Departure City ${index + 1}`,
                          value: flight.departureCity,
                          onChange: ((value) => {
                            const newFlights = [...multiCityFlights];
                            newFlights[index].departureCity = value;
                            setMultiCityFlights(newFlights);
                          }),
                        })} */}
                        {/* <div className={FlightsStyle.input_wrapper}>
                          <MapPin className={FlightsStyle.input_icon} />
                          <input
                            spellCheck={false}
                            id={`departureCity-${index}`}
                            className={FlightsStyle.input}
                            value={flight.departureCity}
                            onChange={(e) => {
                              const newFlights = [...multiCityFlights];
                              newFlights[index].departureCity = e.target.value;
                              setMultiCityFlights(newFlights);
                            }}
                            placeholder={`Departure City ${index + 1}`}
                          />
                        </div> */}
                      </div>
                      <div className={FlightsStyle.form_group}>
                        <label className={FlightsStyle.label} htmlFor={`destinationCity-${index}`}>To</label>
                        {renderAutocompleteInput(`destinationCity-${index}`, `Destination City ${index + 1}`, flight.destinationCity)}
                        {/* {RenderAutocompleteInput2(`destinationCity-${index}`, 'Destination City', flight.destinationCity)} */}
                        {/* {RenderAutocompleteInput({
                          placeholder: `Destination ciy ${index + 1}`,
                          value: flight.destinationCity,
                          onChange: ((value) => {
                            const newFlights = [...multiCityFlights];
                            newFlights[index].destinationCity = value;
                            setMultiCityFlights(newFlights);
                          }),
                        })} */}
                        {/* <div className={FlightsStyle.input_wrapper}>
                          <MapPin className={FlightsStyle.input_icon} />
                          <input
                            spellCheck={false}
                            id={`destinationCity-${index}`}
                            className={FlightsStyle.input}
                            value={flight.destinationCity}
                            onChange={(e) => {
                              const newFlights = [...multiCityFlights];
                              newFlights[index].destinationCity = e.target.value;
                              setMultiCityFlights(newFlights);
                            }}
                            placeholder={`Destination City ${index + 1}`}
                          />
                        </div> */}
                      </div>
                      <div className={FlightsStyle.form_group}>
                        <label className={FlightsStyle.label} htmlFor={`departureDate-${index}`}>Date</label>
                        <div className={FlightsStyle.input_wrapper}>
                          <Calendar className={FlightsStyle.input_icon} />
                          <input
                            spellCheck={false}
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
                  </div>
                ))}
              </div>

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
                      spellCheck={false}
                      id="passengerCount"
                      className={FlightsStyle.input}
                      type="number"
                      value={searchCriteria.passengerCount}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, passengerCount: Math.min(9, parseInt(e.target.value)) })}
                      min={1}
                      max={9}
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

      <button className={`${FlightsStyle.button} ${FlightsStyle.cart_button}`} onClick={() => setIsCartOpen(!isCartOpen)}>
        <ShoppingCart className={FlightsStyle.button_icon} />
        Cart ({Object.keys(selectedFlights).length})
      </button>

      {isCartOpen && (
        <div ref={cartPopverRef} className={FlightsStyle.cart_popover}>
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

            <button className={`${FlightsStyle.button} ${FlightsStyle.button_full} ${FlightsStyle.button_primary} ${FlightsStyle.clear_cart_button}`} onClick={clearCart}>
              <Trash2 className={FlightsStyle.button_icon} />
              <h2 className={FlightsStyle.main_color}>Clear Cart</h2>
            </button>
            <button className={`${FlightsStyle.button} ${FlightsStyle.button_full}`} onClick={handleFillPassengerInfo}>
              <h3 className={FlightsStyle.white_text}>Fill Passenger Info</h3>
            </button>
          </div>
        </div>
      )}

      {showPassengerInfo && (
        <div className={FlightsStyle.modal}>

          <div ref={passengerModalRef} className={FlightsStyle.modal_content}>
            {/* {1 && (
            <div className={`${FlightsStyle.loader_container} ${FlightsStyle.loader_container_absolute}`}>
              <div className={FlightsStyle.loader}></div>
            </div>
          )} */}
            <button className={FlightsStyle.close_button} onClick={() => setShowPassengerInfo(false)}>×</button>
            <h2 className={FlightsStyle.center_text}>Passenger Information</h2>
            <div className={FlightsStyle.passenger_form_container}>
              {passengers.map((passenger, index) => (
                <div key={index} className={`${FlightsStyle.passenger_form} ${FlightsStyle.details_container}`}>
                  <h3>Passenger {index + 1}</h3>
                  <input
                    spellCheck={false}
                    type="text"
                    placeholder="Name"
                    value={passenger.name}
                    onChange={(e) => handlePassengerInfoChange(index, 'name', e.target.value)}
                  />
                  <input
                    spellCheck={false}
                    type="email"
                    placeholder="Email"
                    value={passenger.email}
                    onChange={(e) => handlePassengerInfoChange(index, 'email', e.target.value)}
                  />
                  {emailErrors[index] && <span style={{ color: 'red' }}>{emailErrors[index]}</span>}
                </div>
              ))}
            </div>
            <button className={`${FlightsStyle.button} ${FlightsStyle.bottom_button}`} onClick={handleConfirmBooking}>
              {/* <h2 className={FlightsStyle.white_text}>Confirm Booking</h2> */}
              {/* {isLoadingConfirmBooking && (
                <div className={`${FlightsStyle.loader_container} ${FlightsStyle.loader_container_absolute}`}>
                  <div className={FlightsStyle.loader}></div>
                </div>
              )} */}

              {isLoadingConfirmBooking ? <div className={FlightsStyle.loader}></div> : <h2 className={FlightsStyle.white_text}>Confirm Booking</h2>}
              {/* <div className={FlightsStyle.loader}></div> */}

              {/* {1 && (
                <div className={`${FlightsStyle.loader_container} ${FlightsStyle.loader_container_absolute}`}>
                  <div className={FlightsStyle.loader}></div>
                </div>
              )} */}
            </button>
          </div>
        </div>
      )}

      {showFlightDetails && (
        <div className={FlightsStyle.modal}>
          <div ref={flightModalRef} className={FlightsStyle.modal_content}>
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
            <h2 className={FlightsStyle.center_text}>Booking Confirmed</h2>
            <p>Your booking has been successfully confirmed. Thank you for choosing QAirline!</p>
            <button className={`${FlightsStyle.button} ${FlightsStyle.white_text}`} onClick={() => {
              setBookingConfirmed(false);
              setShowPassengerInfo(false);
              setIsCartOpen(false);
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      <Toast.Provider>
        <Toast.Root
          className={`${FlightsStyle.toast} ${toastMessage.type === 'error' ? FlightsStyle.toastError : FlightsStyle.toastSuccess}`}
          open={isToastOpen}
          onOpenChange={setIsToastOpen}
        >
          <Toast.Title className={FlightsStyle.toastTitle}>
            {toastMessage.title}
          </Toast.Title>

          <Toast.Description className={FlightsStyle.toastDescription}>
            {toastMessage.description}
          </Toast.Description>
        </Toast.Root>

        <Toast.Viewport className={FlightsStyle.toastViewport} />
      </Toast.Provider>
    </div>

  )

}

