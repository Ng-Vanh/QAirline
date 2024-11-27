'use client';

import { useState } from 'react';
import { Search, Calendar, MapPin, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FlightSearchForm() {
    const [tripType, setTripType] = useState('roundTrip');
    const [flightLegs, setFlightLegs] = useState([
        { from: '', to: '', date: '' },
        { from: '', to: '', date: '' },
    ]);
    const [passengers, setPassengers] = useState(1);
    const [cabinClass, setCabinClass] = useState('economy');

    const handleTripTypeChange = (value) => {
        setTripType(value);
        if (value === 'oneWay') {
            setFlightLegs([{ from: '', to: '', date: '' }]);
        } else if (value === 'roundTrip') {
            setFlightLegs([
                { from: '', to: '', date: '' },
                { from: '', to: '', date: '' },
            ]);
        }
    };

    const handleFlightLegChange = (index, field, value) => {
        const updatedLegs = [...flightLegs];
        updatedLegs[index] = { ...updatedLegs[index], [field]: value };
        setFlightLegs(updatedLegs);
    };

    const addFlightLeg = () => {
        if (flightLegs.length < 5) {
            setFlightLegs([...flightLegs, { from: '', to: '', date: '' }]);
        }
    };

    const removeFlightLeg = (index) => {
        if (flightLegs.length > 1) {
            setFlightLegs(flightLegs.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Search criteria:', { tripType, flightLegs, passengers, cabinClass });
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <RadioGroup defaultValue={tripType} onValueChange={handleTripTypeChange} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RadioGroupItem value="oneWay" id="oneWay" />
                        <Label htmlFor="oneWay">One-way</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RadioGroupItem value="roundTrip" id="roundTrip" />
                        <Label htmlFor="roundTrip">Round-trip</Label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RadioGroupItem value="multiCity" id="multiCity" />
                        <Label htmlFor="multiCity">Multi-city</Label>
                    </div>
                </RadioGroup>
            </div>

            {flightLegs.map((leg, index) => (
                <div key={index} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr auto', marginBottom: '1rem' }}>
                    <div>
                        <Label htmlFor={`from-${index}`}>From</Label>
                        <div style={{ position: 'relative' }}>
                            <MapPin style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} size={18} />
                            <Input
                                id={`from-${index}`}
                                value={leg.from}
                                onChange={(e) => handleFlightLegChange(index, 'from', e.target.value)}
                                placeholder="Departure City"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={`to-${index}`}>To</Label>
                        <div style={{ position: 'relative' }}>
                            <MapPin style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} size={18} />
                            <Input
                                id={`to-${index}`}
                                value={leg.to}
                                onChange={(e) => handleFlightLegChange(index, 'to', e.target.value)}
                                placeholder="Arrival City"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={`date-${index}`}>Date</Label>
                        <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} size={18} />
                            <Input
                                id={`date-${index}`}
                                type="date"
                                value={leg.date}
                                onChange={(e) => handleFlightLegChange(index, 'date', e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    {tripType === 'multiCity' && (
                        <Button type="button" onClick={() => removeFlightLeg(index)} style={{ alignSelf: 'center', marginTop: '1rem' }}>
                            <Minus size={18} />
                        </Button>
                    )}
                </div>
            ))}

            {tripType === 'multiCity' && flightLegs.length < 5 && (
                <Button type="button" onClick={addFlightLeg} style={{ marginBottom: '1.5rem' }}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Add Flight
                </Button>
            )}

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1.5rem' }}>
                <div>
                    <Label htmlFor="passengers">Passengers</Label>
                    <Input
                        id="passengers"
                        type="number"
                        min="1"
                        max="9"
                        value={passengers}
                        onChange={(e) => setPassengers(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <Label htmlFor="cabinClass">Cabin Class</Label>
                    <Select value={cabinClass} onValueChange={setCabinClass}>
                        <SelectTrigger id="cabinClass">
                            <SelectValue placeholder="Select cabin class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="premiumEconomy">Premium Economy</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="first">First Class</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" style={{ width: '100%' }}>
                <Search size={18} style={{ marginRight: '0.5rem' }} />
                Search Flights
            </Button>
        </form>
    );
}
