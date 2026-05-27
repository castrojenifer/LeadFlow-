import React, { useState, useEffect } from 'react';
import { User, Phone, Share2, PlusCircle, Save, Loader2, ClipboardCheck, Edit3 } from 'lucide-react';
import { leadsApi } from '../services/api';

const LeadForm = ({ currentLead, onFormSubmitSuccess, onCancelEdit, addToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('Call');
  const [status, setStatus] = useState('Interested');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!currentLead;

  // Set form values if editing
  useEffect(() => {
    if (currentLead) {
      setName(currentLead.name);
      setPhone(currentLead.phone);
      setSource(currentLead.source);
      setStatus(currentLead.status);
    } else {
      resetForm();
    }
  }, [currentLead]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setSource('Call');
    setStatus('Interested');
    setErrors({});
  };

  // Input Validation Rules
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Basic phone format check: allows +, numbers, spaces, and hyphens (7-15 chars)
      const phoneRegex = /^[+]?[0-9\s\-]{7,15}$/;
      if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
      }
    }

    if (!['Call', 'WhatsApp', 'Field'].includes(source)) {
      newErrors.source = 'Please select a valid communication source';
    }

    if (isEditing && !['Interested', 'Not Interested', 'Converted'].includes(status)) {
      newErrors.status = 'Please select a valid lead status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      source,
      ...(isEditing && { status }), // Include status only when editing
    };

    try {
      if (isEditing) {
        const response = await leadsApi.update(currentLead.id, payload);
        addToast(`Lead "${response.data.name}" updated successfully!`, 'success');
      } else {
        const response = await leadsApi.create(payload);
        addToast(`Lead "${response.data.name}" successfully created!`, 'success');
      }
      resetForm();
      onFormSubmitSuccess();
    } catch (err) {
      addToast(err.message || 'Failed to submit form. Please check server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container glass-panel animate-fade-in" style={{ position: 'sticky', top: '100px' }}>
      <h3 className="form-title">
        {isEditing ? (
          <>
            <Edit3 size={18} style={{ color: 'var(--primary)' }} />
            Edit Lead
          </>
        ) : (
          <>
            <PlusCircle size={18} style={{ color: 'var(--primary)' }} />
            Add New Lead
          </>
        )}
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name input */}
        <div className="form-group">
          <label className="form-label" htmlFor="lead-name">Name</label>
          <div style={{ position: 'relative' }}>
            <User 
              size={16} 
              style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
            <input
              id="lead-name"
              type="text"
              className={`form-control ${errors.name ? 'input-invalid' : ''}`}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="e.g. Amit Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          {errors.name && <span className="form-error-msg">{errors.name}</span>}
        </div>

        {/* Phone input */}
        <div className="form-group">
          <label className="form-label" htmlFor="lead-phone">Phone Number</label>
          <div style={{ position: 'relative' }}>
            <Phone 
              size={16} 
              style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
            <input
              id="lead-phone"
              type="tel"
              className={`form-control ${errors.phone ? 'input-invalid' : ''}`}
              style={{ paddingLeft: '2.5rem' }}
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
          {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
        </div>

        {/* Source selector */}
        <div className="form-group">
          <label className="form-label" htmlFor="lead-source">Lead Source</label>
          <div style={{ position: 'relative' }}>
            <Share2 
              size={16} 
              style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
            <select
              id="lead-source"
              className={`form-control ${errors.source ? 'input-invalid' : ''}`}
              style={{ paddingLeft: '2.5rem', appearance: 'none' }}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={loading}
            >
              <option value="Call">Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Field">Field</option>
            </select>
          </div>
          {errors.source && <span className="form-error-msg">{errors.source}</span>}
        </div>

        {/* Status selector (only shown when editing) */}
        {isEditing && (
          <div className="form-group">
            <label className="form-label" htmlFor="lead-status">Status</label>
            <div style={{ position: 'relative' }}>
              <ClipboardCheck 
                size={16} 
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
              />
              <select
                id="lead-status"
                className={`form-control ${errors.status ? 'input-invalid' : ''}`}
                style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
              >
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
            {errors.status && <span className="form-error-msg">{errors.status}</span>}
          </div>
        )}

        {/* Actions Button */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 2 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" style={{ borderTopColor: '#fff', width: 16, height: 16 }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? 'Update Lead' : 'Create Lead'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
