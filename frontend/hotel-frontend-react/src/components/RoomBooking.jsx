import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { roomClient, reservationClient } from '../lib/apollo';
import { GET_AVAILABLE_ROOMS_QUERY, CREATE_RESERVATION_MUTATION } from '../lib/graphql';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, DollarSign, Bed } from 'lucide-react';

export default function RoomBooking() {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: roomsData, loading: roomsLoading, refetch } = useQuery(GET_AVAILABLE_ROOMS_QUERY, {
    client: roomClient,
  });

  const [createReservation, { loading: bookingLoading }] = useMutation(CREATE_RESERVATION_MUTATION, {
    client: reservationClient,
  });

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingForm.checkInDate || !bookingForm.checkOutDate) {
      return 0;
    }

    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * selectedRoom.price : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedRoom) {
      setError('Please select a room');
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      setError('Please select valid dates');
      return;
    }

    try {
      const { data } = await createReservation({
        variables: {
          input: {
            userId: user.id,
            roomId: selectedRoom.id,
            checkInDate: new Date(bookingForm.checkInDate),
            checkOutDate: new Date(bookingForm.checkOutDate),
            numberOfGuests: parseInt(bookingForm.numberOfGuests),
            totalPrice,
            specialRequests: bookingForm.specialRequests,
          },
        },
      });

      if (data?.createReservation) {
        setSuccess('Reservation created successfully!');
        setSelectedRoom(null);
        setBookingForm({
          checkInDate: '',
          checkOutDate: '',
          numberOfGuests: 1,
          specialRequests: '',
        });
        refetch(); // Refresh available rooms
      }
    } catch (err) {
      setError(err.message || 'Booking failed');
    }
  };

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading available rooms...</div>
      </div>
    );
  }

  const rooms = roomsData?.availableRooms || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Rooms</h1>
        <p className="text-gray-600">Choose from our selection of comfortable rooms</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Selection */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Select a Room</h2>
          {rooms.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">No rooms available at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            rooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all ${
                  selectedRoom?.id === room.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        Room {room.roomNumber}
                      </CardTitle>
                      <CardDescription>{room.roomType}</CardDescription>
                    </div>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{room.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Max {room.maxGuests} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${room.price}/night</span>
                      </div>
                    </div>

                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Booking Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Book Your Stay</h2>
          
          {selectedRoom ? (
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  Room {selectedRoom.roomNumber} - {selectedRoom.roomType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={bookingForm.checkInDate}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, checkInDate: e.target.value })
                        }
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={bookingForm.checkOutDate}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, checkOutDate: e.target.value })
                        }
                        min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={selectedRoom.maxGuests}
                      value={bookingForm.numberOfGuests}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, numberOfGuests: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      value={bookingForm.specialRequests}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, specialRequests: e.target.value })
                      }
                      placeholder="Any special requests or preferences..."
                    />
                  </div>

                  {calculateTotalPrice() > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Price:</span>
                        <span className="text-xl font-bold">${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={bookingLoading}>
                    {bookingLoading ? 'Processing...' : 'Book Now'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500 text-center">
                  Please select a room to continue with booking
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

