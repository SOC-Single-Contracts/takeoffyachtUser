import BookingWizard from "./BookingWizard";

export default function BookingPage({ searchParams }) {
  const { bookingId } = searchParams;
  return <BookingWizard initialBookingId={bookingId} />;
}