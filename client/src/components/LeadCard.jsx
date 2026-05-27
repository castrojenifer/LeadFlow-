import React, { useState } from 'react';
import { Phone, Calendar, Trash2, Edit2, Loader2, MessageCircle } from 'lucide-react';
import { leadsApi } from '../services/api';

const LeadCard = ({ lead, onEditClick, onDeleteSuccess, onStatusChangeSuccess, addToast }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Status Badge Class Generator
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Converted':
        return 'badge-interested badge-converted';
      case 'Not Interested':
        return 'badge-interested badge-not-interested';
      case 'Interested':
      default:
        return 'badge-interested';
    }
  };

  // Humanize Created Date
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Recent';
    }
  };

  // Status Update Trigger
  const handleStatusChange = async (newStatus) => {
    setLoadingStatus(true);
    try {
      await leadsApi.update(lead.id, { status: newStatus });
      onStatusChangeSuccess();
      addToast(`Status for "${lead.name}" changed to ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setLoadingStatus(false);
    }
  };

  // Delete Action Trigger
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete lead "${lead.name}"?`)) {
      setLoadingDelete(true);
      try {
        await leadsApi.delete(lead.id);
        addToast(`Lead "${lead.name}" deleted successfully.`, 'success');
        onDeleteSuccess(lead.id);
      } catch (err) {
        addToast(err.message || 'Failed to delete lead.', 'error');
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  // Generate WhatsApp Message Deep Link
  const getWhatsAppLink = () => {
    // Strip non-numeric characters for safety in wa.me linking
    const cleanPhone = lead.phone.replace(/[^\d+]/g, '');
    const encodedText = encodeURIComponent(
      `Hello ${lead.name},\n\nThis is regarding our recent interaction. Let us know how we can assist you further!`
    );
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  };

  return (
    <div className="lead-card glass-panel animate-fade-in">
      <div className="lead-card-header">
        <div>
          <h4 className="lead-name">{lead.name}</h4>
          <div className="lead-date">
            <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {formatDate(lead.created_at)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <span className={`badge ${getStatusBadgeClass(lead.status)}`}>
            {lead.status}
          </span>
          <span className="badge badge-source">{lead.source}</span>
        </div>
      </div>

      <div className="lead-details-row">
        <a 
          href={`tel:${lead.phone}`} 
          className="detail-item clickable"
          title="Make regular voice call"
        >
          <Phone size={14} />
          <span>{lead.phone}</span>
        </a>
      </div>

      <div className="lead-actions-row">
        {/* Status Dropdown */}
        <div className="status-dropdown-wrapper">
          {loadingStatus ? (
            <Loader2 size={14} className="spinner" />
          ) : (
            <select
              className="status-dropdown"
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={loadingStatus}
              title="Update status"
            >
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Converted">Converted</option>
            </select>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-btn-actions">
          {/* WhatsApp Direct Chat button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-chat-link"
            title="Chat via WhatsApp"
          >
            <MessageCircle size={14} />
            <span>Chat</span>
          </a>

          {/* Edit Button */}
          <button
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            onClick={() => onEditClick(lead)}
            title="Edit Lead details"
          >
            <Edit2 size={13} />
          </button>

          {/* Delete Button */}
          <button
            className="btn-icon"
            style={{ 
              width: '32px', 
              height: '32px',
              color: 'var(--danger)',
              borderColor: 'rgba(239,68,68,0.2)',
            }}
            onClick={handleDelete}
            disabled={loadingDelete}
            title="Delete Lead"
          >
            {loadingDelete ? (
              <Loader2 size={13} className="spinner" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
