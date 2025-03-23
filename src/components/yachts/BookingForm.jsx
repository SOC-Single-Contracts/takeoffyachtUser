'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { yachtApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BookingForm({ yacht, onClose }) {

  const [formData, setFormData] = useState({
    yacht_id: yacht?.yacht?.id?.toString(), // Convert to string initially
    adults: "1",
    kid_teen: "0",
    duration_hour: 3,
    selected_date: "",
    country: "",
    phone_number: "",
    message: "",
    total_cost: yacht?.yacht?.per_hour_price * 3 || 0,
    paid_cost: yacht?.yacht?.per_hour_price || 0,
    remaining_cost: (yacht?.yacht?.per_hour_price * 2) || 0,
    partial_payment: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (name, value) => {
    let updatedFormData = { ...formData, [name]: value };

    // Recalculate costs when duration or number of people changes
    if (["duration_hour", "adults", "kid_teen"].includes(name)) {
      const totalPeople = parseInt(updatedFormData.adults) + parseInt(updatedFormData.kid_teen);
      const hourlyRate = yacht?.yacht?.per_hour_price || 0;
      const duration = parseInt(updatedFormData.duration_hour);
      
      const totalCost = hourlyRate * duration * totalPeople;
      const paidCost = Math.floor(totalCost * 0.3); // 30% upfront
      const remainingCost = totalCost - paidCost;

      updatedFormData = {
        ...updatedFormData,
        total_cost: totalCost,
        paid_cost: paidCost,
        remaining_cost: remainingCost
      };
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure yacht_id exists and is a number
      if (!formData.yacht_id) {
        throw new Error("Yacht ID is missing");
      }

      // Format the date and ensure yacht_id is a number
      const formattedData = {
        ...formData,
        selected_date: formData.selected_date ? format(new Date(formData.selected_date), "yyyy-MM-dd'T'HH:mm") : "",
        yacht_id: parseInt(formData.yacht_id),
        // Ensure all numeric fields are numbers
        adults: parseInt(formData.adults),
        kid_teen: parseInt(formData.kid_teen),
        duration_hour: parseInt(formData.duration_hour),
        total_cost: parseInt(formData.total_cost),
        paid_cost: parseInt(formData.paid_cost),
        remaining_cost: parseInt(formData.remaining_cost)
      };

      const response = await yachtApi.createBooking(formattedData);
      
      if (response.error_code === "failed") {
        throw new Error(response.data || "Booking failed");
      }

      // Close the form on success
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {yacht?.yacht?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Adults</Label>
              <Select
                value={formData.adults}
                onValueChange={(value) => handleInputChange("adults", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select adults" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Adult{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kids/Teens</Label>
              <Select
                value={formData.kid_teen}
                onValueChange={(value) => handleInputChange("kid_teen", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select kids/teens" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Kid{num !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (hours)</Label>
            <Select
              value={formData.duration_hour.toString()}
              onValueChange={(value) => handleInputChange("duration_hour", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7, 8].map((hours) => (
                  <SelectItem key={hours} value={hours.toString()}>
                    {hours} Hours
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={formData.selected_date ? new Date(formData.selected_date) : undefined}
              onSelect={(date) => handleInputChange("selected_date", date)}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Enter your country"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={formData.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Message (Optional)</Label>
            <Input
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Any special requests?"
            />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span>${formData.total_cost}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Initial Payment (50%):</span>
              <span>${formData.paid_cost}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Remaining:</span>
              <span>${formData.remaining_cost}</span>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
