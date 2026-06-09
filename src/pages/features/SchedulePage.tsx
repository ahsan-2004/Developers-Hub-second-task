import React, { useMemo, useState } from 'react';
import { CalendarDays, Plus, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useRoleView } from '../../context/RoleViewContext';

interface AvailabilitySlot {
  id: string;
  day: string;
  time: string;
  available: boolean;
}

interface MeetingRequest {
  id: string;
  subject: string;
  day: string;
  time: string;
  status: 'pending' | 'confirmed' | 'declined';
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['09:00', '11:00', '13:00', '15:00', '17:00'];

export const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { viewMode, setViewMode } = useRoleView();
  const [slots, setSlots] = useState<AvailabilitySlot[]>(
    days.flatMap(day =>
      times.map(time => ({
        id: `${day}-${time}`,
        day,
        time,
        available: Math.random() > 0.7,
      }))
    )
  );
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [requests, setRequests] = useState<MeetingRequest[]>([
    {
      id: 'req-1',
      subject: 'Investor sync',
      day: 'Tuesday',
      time: '11:00',
      status: 'pending',
    },
    {
      id: 'req-2',
      subject: 'Deal review',
      day: 'Thursday',
      time: '15:00',
      status: 'confirmed',
    },
  ]);

  const availableSlots = useMemo(() => slots.filter(slot => slot.available), [slots]);
  const confirmedMeetings = useMemo(
    () => requests.filter(request => request.status === 'confirmed'),
    [requests]
  );

  const toggleAvailability = (slotId: string) => {
    setSlots(prev =>
      prev.map(slot =>
        slot.id === slotId ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  const handleAddSlot = () => {
    setSlots(prev =>
      prev.map(slot =>
        slot.day === selectedDay && slot.time === selectedTime
          ? { ...slot, available: true }
          : slot
      )
    );
  };

  const sendMeetingRequest = (slot: AvailabilitySlot) => {
    const newRequest: MeetingRequest = {
      id: `req-${Date.now()}`,
      subject: `${viewMode === 'investor' ? 'Capital review' : 'Strategy session'}`,
      day: slot.day,
      time: slot.time,
      status: 'pending',
    };
    setRequests(prev => [newRequest, ...prev]);
    toggleAvailability(slot.id);
  };

  const updateRequestStatus = (requestId: string, status: MeetingRequest['status']) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            <CalendarDays size={18} /> Schedule Center
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Meeting Scheduling Calendar</h1>
          <p className="text-gray-600">Manage availability, send meeting requests, and confirm sessions directly from your dashboard.</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="secondary">View mode: {viewMode}</Badge>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'investor' ? 'entrepreneur' : 'investor')}>
            Switch to {viewMode === 'investor' ? 'Entrepreneur' : 'Investor'} View
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Weekly availability</h2>
              <p className="text-sm text-gray-600">Toggle slots and request meetings from the calendar below.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Open slots {availableSlots.length}</Badge>
              <Badge variant="success">Confirmed {confirmedMeetings.length}</Badge>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-600">
                    <th className="sticky left-0 z-10 bg-gray-100 px-4 py-3">Time</th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-3">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {times.map(time => (
                    <tr key={time} className="border-t border-gray-200">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-gray-700">{time}</td>
                      {days.map(day => {
                        const slot = slots.find(item => item.day === day && item.time === time)!;
                        return (
                          <td key={`${day}-${time}`} className="px-3 py-3 align-top">
                            <div className={`rounded-2xl border p-3 text-sm ${slot.available ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-medium ${slot.available ? 'text-primary-700' : 'text-gray-500'}`}>
                                  {slot.available ? 'Available' : 'Busy'}
                                </span>
                                <button
                                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${slot.available ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                  onClick={() => toggleAvailability(slot.id)}
                                >
                                  {slot.available ? 'Close' : 'Open'}
                                </button>
                              </div>
                              <div className="mt-3">
                                <Button
                                  size="xs"
                                  variant={slot.available ? 'success' : 'outline'}
                                  fullWidth
                                  onClick={() => sendMeetingRequest(slot)}
                                  disabled={!slot.available}
                                >
                                  Request
                                </Button>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Availability builder</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Day
                    <select
                      className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      value={selectedDay}
                      onChange={e => setSelectedDay(e.target.value)}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                    <select
                      className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                    >
                      {times.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <Button fullWidth leftIcon={<Plus size={18} />} onClick={handleAddSlot}>
                  Add time block
                </Button>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock3 size={18} />
                    <span>Selected {selectedDay} at {selectedTime}. Toggle to create a fresh calendar slot.</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Meeting requests</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests yet. Select an available slot to send your first meeting invite.</p>
              ) : (
                requests.map(request => (
                  <div key={request.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{request.subject}</p>
                        <p className="text-sm text-gray-500">{request.day}, {request.time}</p>
                      </div>
                      <Badge variant={request.status === 'confirmed' ? 'success' : request.status === 'pending' ? 'warning' : 'error'}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.status === 'pending' && (
                        <> 
                          <Button size="sm" variant="success" leftIcon={<CheckCircle2 size={16} />} onClick={() => updateRequestStatus(request.id, 'confirmed')}>
                            Accept
                          </Button>
                          <Button size="sm" variant="error" leftIcon={<XCircle size={16} />} onClick={() => updateRequestStatus(request.id, 'declined')}>
                            Decline
                          </Button>
                        </>
                      )}
                      {request.status === 'confirmed' && (
                        <div className="text-sm text-gray-500">Meeting confirmed and reflected in your dashboard stream.</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
