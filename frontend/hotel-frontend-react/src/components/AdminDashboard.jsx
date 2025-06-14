import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { roomClient } from '../lib/apollo';
import { GET_ROOMS_QUERY, CREATE_ROOM_MUTATION } from '../lib/graphql';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Bed, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: roomsData, loading, refetch } = useQuery(GET_ROOMS_QUERY, {
    client: roomClient,
  });

  const [createRoom, { loading: createLoading }] = useMutation(CREATE_ROOM_MUTATION, {
    client: roomClient,
  });

  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    description: '',
    amenities: '',
    maxGuests: '2',
  });

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const amenitiesArray = newRoom.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const { data } = await createRoom({
        variables: {
          input: {
            roomNumber: newRoom.roomNumber,
            roomType: newRoom.roomType,
            price: parseFloat(newRoom.price),
            description: newRoom.description,
            amenities: amenitiesArray,
            maxGuests: parseInt(newRoom.maxGuests),
          },
        },
      });

      if (data?.createRoom) {
        setSuccess('Room created successfully!');
        setNewRoom({
          roomNumber: '',
          roomType: '',
          price: '',
          description: '',
          amenities: '',
          maxGuests: '2',
        });
        setIsDialogOpen(false);
        refetch();
      }
    } catch (err) {
      setError(err.message || 'Failed to create room');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const rooms = roomsData?.rooms || [];
  const availableRooms = rooms.filter(room => room.availability);
  const occupiedRooms = rooms.filter(room => !room.availability);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your hotel rooms and reservations</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Create a new room for your hotel
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      value={newRoom.roomNumber}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, roomNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Input
                      id="roomType"
                      value={newRoom.roomType}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, roomType: e.target.value })
                      }
                      placeholder="e.g., Standard, Deluxe, Suite"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Night</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newRoom.price}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxGuests">Max Guests</Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      min="1"
                      value={newRoom.maxGuests}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, maxGuests: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRoom.description}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, description: e.target.value })
                    }
                    placeholder="Describe the room features..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    value={newRoom.amenities}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, amenities: e.target.value })
                    }
                    placeholder="WiFi, TV, Air Conditioning, Mini Bar"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <Badge variant="secondary">{availableRooms.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableRooms.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
            <Badge variant="destructive">{occupiedRooms.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedRooms.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">All Rooms</h2>
        
        {rooms.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
              <p className="text-gray-500">Start by adding your first room.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        Room {room.roomNumber}
                      </CardTitle>
                      <CardDescription>{room.roomType}</CardDescription>
                    </div>
                    <Badge 
                      variant={room.availability ? "secondary" : "destructive"}
                    >
                      {room.availability ? "Available" : "Occupied"}
                    </Badge>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

