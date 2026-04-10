'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useTourBookingStore, type TourBooking } from '@/lib/store/useTourBookingStore';
import { Calendar, MapPin, Clock, Video, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG: Record<TourBooking['status'], { label: string; color: string; icon: typeof CheckCircle }> = {
  pending:   { label: 'Pending Confirmation', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  confirmed: { label: 'Confirmed',             color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  cancelled: { label: 'Cancelled',             color: 'bg-red-100 text-red-700',      icon: XCircle },
  completed: { label: 'Completed',             color: 'bg-blue-100 text-blue-700',    icon: CheckCircle },
};

export default function SeekerCalendarPage() {
  const user = useAuthStore((s) => s.user);
  const { bookings, getBySeeker } = useTourBookingStore();

  // Trigger re-render when bookings change
  useEffect(() => {}, [bookings]);

  const myBookings = user ? getBySeeker(user.id) : [];
  const upcoming = myBookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const past = myBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tours</h1>
        <p className="text-sm text-gray-500 mt-1">Track your upcoming and past property tours</p>
      </div>

      {myBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No tours scheduled</h3>
          <p className="text-sm text-gray-400 mt-2">
            Browse listings and book a tour to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming Tours</h2>
              <div className="space-y-3">
                {upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past Tours</h2>
              <div className="space-y-3">
                {past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: TourBooking }) {
  const cfg = STATUS_CONFIG[booking.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Property image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {booking.propertyImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={booking.propertyImage} alt={booking.propertyTitle} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{booking.propertyTitle}</h3>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${cfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{booking.date}</span>
              <span className="mx-1 text-gray-300">·</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{booking.timeLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{booking.propertyLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              {booking.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span className="capitalize">{booking.type} tour</span>
              <span className="mx-1 text-gray-300">·</span>
              <span>Agent: {booking.agentName}</span>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-500">
            <span>Inspection fee: <strong className="text-gray-700">₦{booking.inspectionFee.toLocaleString()}</strong></span>
            <span>Platform fee: <strong className="text-gray-700">₦{booking.platformFee.toLocaleString()}</strong></span>
          </div>

          {booking.cancellationReason && (
            <p className="mt-2 text-xs text-red-500">Reason: {booking.cancellationReason}</p>
          )}
        </div>
      </div>
    </div>
  );
}
