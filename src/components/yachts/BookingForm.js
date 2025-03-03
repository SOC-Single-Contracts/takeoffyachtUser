'use client';

import { useState } from 'react';
import { yachtApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function YachtBookingForm({ yacht, onClose }) {
  const [formData, setFormData] = useState({
    adults: 1,
    kid_teen: 0,
    duration_hour: yacht.yacht.duration_hour,
    selected_date: '',
    phone_number: '',
    country: '',
    message: '',
    partial_payment: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateTotalCost = () => {
    const hourlyRate = yacht.yacht.per_hour_price;
    const duration = formData.duration_hour;
    return hourlyRate * duration;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const totalCost = calculateTotalCost();
      const bookingData = {
        ...formData,
        yacht_id: yacht.yacht.id,
        total_cost: totalCost,
        paid_cost: formData.partial_payment ? totalCost * 0.3 : totalCost,
        remaining_cost: formData.partial_payment ? totalCost * 0.7 : 0,
      };

      const response = await yachtApi.createBooking(bookingData);
      
      if (response.error_code === 'pass') {
        // Redirect to payment page or show success message
        window.location.href = formData.partial_payment 
          ? `/yacht/partial-payment/${response.data.id}`
          : `/yacht/payment/${response.data.id}`;
      } else {
        setError(response.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {yacht.yacht.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                name="adults"
                type="number"
                min="1"
                max={yacht.yacht.guest}
                value={formData.adults}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="kid_teen">Kids/Teens</Label>
              <Input
                id="kid_teen"
                name="kid_teen"
                type="number"
                min="0"
                value={formData.kid_teen}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="selected_date">Date</Label>
            <Input
              id="selected_date"
              name="selected_date"
              type="datetime-local"
              value={formData.selected_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration_hour">Duration (hours)</Label>
            <Input
              id="duration_hour"
              name="duration_hour"
              type="number"
              min="1"
              value={formData.duration_hour}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Special Requests</Label>
            <Input
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="partial_payment"
              name="partial_payment"
              checked={formData.partial_payment}
              onCheckedChange={(checked) => 
                handleInputChange({ 
                  target: { 
                    name: 'partial_payment', 
                    type: 'checkbox', 
                    checked 
                  } 
                })
              }
            />
            <Label htmlFor="partial_payment">
              Pay 50% now and the rest later
            </Label>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
