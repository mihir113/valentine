'use client';

import { useState, useEffect } from 'react';
import { TimelineEvent } from '@/types';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [securityData, setSecurityData] = useState({
    question: '',
    answer: '',
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
    loadSecurityQuestion();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityQuestion = async () => {
    try {
      const response = await fetch('/api/config/security-question');
      if (response.ok) {
        const data = await response.json();
        setSecurityData((prev) => ({
          ...prev,
          question: data.question,
        }));
      }
    } catch (error) {
      console.error('Error loading security question:', error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Create or update event
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        image_url: imageUrl,
      };

      if (editingId) {
        // Update event
        const response = await fetch(`/api/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          throw new Error('Failed to update event');
        }
      } else {
        // Create event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to create event');
        }
      }

      // Reset form and reload
      setFormData({ title: '', date: '', description: '' });
      setFile(null);
      setEditingId(null);
      setShowAddForm(false);
      await loadEvents();
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
    });
    setEditingId(event.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityLoading(true);

    try {
      const response = await fetch('/api/config/security-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: securityData.question,
          answer: securityData.answer,
        }),
      });

      if (response.ok) {
        alert('Security question updated successfully!');
      } else {
        alert('Failed to update security question');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating security question');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await loadEvents();
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting event');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ title: '', date: '', description: '' });
    setFile(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add New Event'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Timeline Event' : 'Add New Timeline Event'}
          </h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., First Date"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tell the story of this moment..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Event'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Timeline Events ({events.length})</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events yet. Add your first memory!</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.date}</p>
                  <p className="text-gray-600 mt-2">{event.description}</p>
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="mt-3 max-h-48 rounded-lg"
                    />
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Question Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Security Question Settings</h2>
        <form onSubmit={handleUpdateSecurity} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
            <input
              type="text"
              value={securityData.question}
              onChange={(e) => setSecurityData({ ...securityData, question: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Where did we meet?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
            <input
              type="text"
              value={securityData.answer}
              onChange={(e) => setSecurityData({ ...securityData, answer: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="The answer only she would know..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={securityLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {securityLoading ? 'Updating...' : 'Update Security Question'}
          </button>
        </form>
      </div>
    </div>
  );
}
