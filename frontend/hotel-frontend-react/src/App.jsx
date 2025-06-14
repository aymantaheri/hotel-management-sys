import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import RoomBooking from './components/RoomBooking';
import UserReservations from './components/UserReservations';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bed, Settings } from 'lucide-react';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Book Rooms
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                My Reservations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking">
              <RoomBooking />
            </TabsContent>
            
            <TabsContent value="reservations">
              <UserReservations />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

