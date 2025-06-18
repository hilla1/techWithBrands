import React, { useState, useEffect } from 'react';
import ReusableModal from '../reusable/ReusableModal';
import CalendarWeekPicker from './CalendarWeekPicker';
import {
  FiEye, FiEdit, FiMail, FiUser, FiClock, FiCheckCircle, FiUsers,
  FiInfo, FiTag, FiBriefcase, FiTrash2, FiPhone
} from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ResponseModal from './ResponseModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const editSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number too short'),
  services: z.string().min(5, 'Services are required'),
  status: z.enum(['pending', 'scheduled', 'rescheduled', 'completed', 'canceled']),
});

export default function ConsultationModalTabs({ isOpen, onClose, consultation, onUpdate, onDelete }) {
  const { backend , role } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [selectedDate, setSelectedDate] = useState(new Date(consultation?.timeSlot || Date.now()));
  const [originalTimeSlot, setOriginalTimeSlot] = useState(new Date(consultation?.timeSlot || Date.now()));
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [assignInput, setAssignInput] = useState('');
  const [assignEmails, setAssignEmails] = useState([]);
  const [assignAction, setAssignAction] = useState('assign');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      phoneNumber: consultation?.phoneNumber || '',
      services: Array.isArray(consultation?.services)
        ? consultation?.services.join(', ')
        : consultation?.services || '',
      status: consultation?.status || 'pending',
    }
  });

  useEffect(() => {
    const date = new Date(consultation?.timeSlot || Date.now());
    setSelectedDate(date);
    setOriginalTimeSlot(date);
    setResponse(null);
    setAssignEmails([]);
    setAssignInput('');
    setConfirmDelete(false);
    setAssignAction('assign');
    reset({
      phoneNumber: consultation?.phoneNumber || '',
      services: Array.isArray(consultation?.services)
        ? consultation?.services.join(', ')
        : consultation?.services || '',
      status: consultation?.status || 'pending',
    });
  }, [consultation, reset]);

  useEffect(() => {
    if (activeTab === 'assign') {
      axios.get(`${backend}/user/emails-by-role?role=consultant`, { withCredentials: true })
        .then(res => setConsultants(res?.data?.users || []))
        .catch(() => setConsultants([]));
    }
  }, [activeTab]);

  const formatDateWithTimezone = (date) => {
    if (!date || !(date instanceof Date)) return '';
    const day = date.toDateString().split(' ').slice(0, 4).join(' ');
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const minutes = String(Math.abs(offset) % 60).padStart(2, '0');
    return `${day} ${time} GMT${sign}${hours}:${minutes}`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const isTimeSlotChanged = originalTimeSlot?.getTime() !== selectedDate?.getTime();
      const updated = {
        ...consultation,
        phoneNumber: data.phoneNumber,
        services: data.services.split(',').map(s => s.trim()),
        timeSlot: formatDateWithTimezone(selectedDate),
        status: isTimeSlotChanged ? 'rescheduled' : data.status,
      };

      const res = await axios.patch(`${backend}/consultation/update/${consultation?._id}`, updated, {
        withCredentials: true,
      });

      setResponse(res?.data);
      onUpdate();
    } catch (e) {
      setResponse({ success: false, message: e.response?.data?.message || e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${backend}/consultation/delete/${consultation?._id}`, {
        withCredentials: true,
      });
      setResponse(res?.data);
      onDelete();
      onClose();
    } catch (e) {
      setResponse({ success: false, message: e.response?.data?.message || e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    const emails = assignEmails?.filter(email => !!email.trim());
    if (!emails || emails.length === 0)
      return setResponse({ success: false, message: 'At least one email is required' });

    setLoading(true);
    try {
      const payload = {
        action: assignAction,
        emails
      };

      const res = await axios.patch(`${backend}/consultation/assign-handler/${consultation?._id}`, payload, {
        withCredentials: true,
      });

      setResponse(res?.data);
      onUpdate();
    } catch (e) {
      setResponse({ success: false, message: e.response?.data?.message || e.message });
    } finally {
      setLoading(false);
    }
  };

  const addEmailsFromInput = () => {
    const newEmails = assignInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email && !assignEmails.includes(email));
    if (newEmails.length > 0) {
      setAssignEmails(prev => [...prev, ...newEmails]);
      setAssignInput('');
    }
  };

  return (
    <>
      <ReusableModal isOpen={isOpen} onClose={onClose}>
        <div className="flex space-x-2 mb-4 border-b pb-2">
          {['view', 'update', ...(role === 'admin' || role === 'consultant' ? ['assign'] : [])].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-t-md font-medium transition ${
                activeTab === tab
                  ? 'bg-white border-b-2 border-[#F89F2D] text-[#2E3191]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'view' && <FiEye className="inline mr-1 text-blue-500" />}
              {tab === 'update' && <FiEdit className="inline mr-1 text-green-500" />}
              {tab === 'assign' && <FiUsers className="inline mr-1 text-orange-400" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'view' && (
          <>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2 items-center"><FiUser className="text-[#F89F2D]" /><strong>{consultation?.user?.name || 'N/A'}</strong></div>
              <div className="flex gap-2 items-center"><FiMail className="text-[#F89F2D]" /><span>{consultation?.user?.email || 'N/A'}</span></div>
              <div className="flex gap-2 items-center"><FiPhone className="text-[#F89F2D]" /><span>{consultation?.phoneNumber || 'N/A'}</span></div>
              <div className="flex gap-2 items-center"><FiCheckCircle className="text-[#F89F2D]" /><span>{Array.isArray(consultation?.services) ? consultation.services.join(', ') : consultation?.services || 'N/A'}</span></div>
              <div className="flex gap-2 items-center"><FiClock className="text-[#F89F2D]" /><span>{consultation?.timeSlot || 'N/A'}</span></div>
              <div className="flex gap-2 items-center"><FiBriefcase className="text-[#F89F2D]" /><span>{consultation?.budget || 'N/A'}</span></div>
              <div className="flex gap-2 items-center"><FiTag className="text-[#F89F2D]" /><span>{consultation?.timeline || 'N/A'}</span></div>
              <div className="flex gap-2 items-start"><FiInfo className="text-[#F89F2D] mt-1" /><span>{consultation?.description || 'N/A'}</span></div>
              <div className="flex gap-2 items-center"><FiUsers className="text-[#F89F2D]" /><span>{consultation?.handlers?.length > 0 ? consultation.handlers.map(h => typeof h === 'string' ? h : h?.email).join(', ') : 'Unassigned'}</span></div>
            </div>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="absolute bottom-4 right-4 text-red-600 hover:text-red-800"
                title="Delete Consultation"
              >
                <FiTrash2 size={22} />
              </button>
            ) : (
              <div className="absolute bottom-4 right-4 bg-white border rounded shadow p-4 w-[240px]">
                <p className="text-red-600 font-semibold text-sm mb-3">Confirm deletion?</p>
                <div className="flex justify-between">
                  <button onClick={() => setConfirmDelete(false)} className="text-gray-600 text-sm hover:underline">Cancel</button>
                  <button onClick={handleDelete} disabled={loading} className="text-red-600 font-bold text-sm flex items-center gap-1">
                    {loading ? <FaSpinner className="animate-spin" /> : <FiTrash2 />} Delete
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'update' && (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <CalendarWeekPicker
              initialDate={selectedDate}
              onDateSelect={({ date }) => setSelectedDate(new Date(date))}
            />
            <input
              {...register('phoneNumber')}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Phone Number"
            />
            {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber.message}</p>}

            <input
              {...register('services')}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Services (comma separated)"
            />
            {errors.services && <p className="text-red-600 text-sm">{errors.services.message}</p>}

            <select {...register('status')} className="w-full border px-4 py-2 rounded-md">
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>

            <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D] px-6 py-2 text-white rounded-md flex justify-center items-center gap-2">
              {loading ? <FaSpinner className="animate-spin" /> : <FiCheckCircle />} Update
            </button>
          </form>
        )}

        {activeTab === 'assign' && (role === 'admin' || role === 'consultant') && (
          <div className="space-y-4">
            {consultation?.handlers?.length > 0 && (
              <div className="text-sm text-blue-900">
                <strong>Assigned consultants:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {consultation.handlers.map((h, i) => (
                    <li key={i}>{typeof h === 'string' ? h : h?.email}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Action:</label>
              <select
                value={assignAction}
                onChange={(e) => setAssignAction(e.target.value)}
                className="border px-3 py-1 rounded-md text-sm"
              >
                <option value="assign">Assign</option>
                <option value="remove">Remove</option>
              </select>
            </div>

            <select
              onChange={(e) => {
                const email = e.target.value;
                if (email && !assignEmails.includes(email)) {
                  setAssignEmails(prev => [...prev, email]);
                }
              }}
              className="w-full border px-4 py-2 rounded-md"
            >
              <option value="">Select consultant to add</option>
              {consultants?.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Or type consultant emails (comma-separated)"
              className="w-full border px-4 py-2 rounded-md"
              value={assignInput}
              onChange={(e) => setAssignInput(e.target.value)}
              onBlur={addEmailsFromInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addEmailsFromInput();
                }
              }}
            />

            {assignEmails?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {assignEmails.map((email, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                  >
                    {email}
                    <button
                      onClick={() => setAssignEmails(prev => prev.filter(e => e !== email))}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleAssign}
              disabled={loading}
              className="bg-gradient-to-r from-[#2E3191] to-[#F89F2D] px-6 py-2 text-white rounded-md flex justify-center items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FiCheckCircle />} {assignAction === 'assign' ? 'Assign' : 'Remove'}
            </button>
          </div>
        )}
      </ReusableModal>

      <ResponseModal response={response} onClose={() => setResponse(null)} />
    </>
  );
}
