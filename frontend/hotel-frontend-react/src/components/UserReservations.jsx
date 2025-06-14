import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { reservationClient } from '../lib/apollo';
import { GET_USER_RESERVATIONS_QUERY, CANCEL_RESERVATION_MUTATION } from '../lib/graphql';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, Users, DollarSign, MapPin } from 'lucide-react';

export default function UserReservations() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: reservationsData, loading, refetch } = useQuery(GET_USER_RESERVATIONS_QUERY, {
    client: reservationClient,
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const [cancelReservation, { loading: cancelLoading }] = useMutation(CANCEL_RESERVATION_MUTATION, {
    client: reservationClient,
  });

  const handleCancelReservation = async (reservationId) => {
    setError('');
    setSuccess('');

    try {
      const { data } = await cancelReservation({
        variables: { id: reservationId },
      });

      if (data?.cancelReservation) {
        setSuccess('Reservation cancelled successfully');
        refetch();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your reservations...</div>
      </div>
    );
  }

  const reservations = reservationsData?.userReservations || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reservations</h1>
        <p className="text-gray-600">Manage your hotel bookings</p>
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

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-500">You haven't made any reservations yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Reservation #{reservation.id.slice(-8)}
                    </CardTitle>
                    <CardDescription>
                      Room ID: {reservation.roomId}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Check-in</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(reservation.checkInDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Check-out</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(reservation.checkOutDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Guests</p>
                      <p className="text-sm text-gray-600">
                        {reservation.numberOfGuests}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-sm text-gray-600">
                        ${reservation.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Special Requests:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {reservation.specialRequests}
                    </p>
                  </div>
                )}

                {reservation.paymentId && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Payment ID: {reservation.paymentId}
                    </p>
                  </div>
                )}

                {reservation.status === 'confirmed' && (
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? 'Cancelling...' : 'Cancel Reservation'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

