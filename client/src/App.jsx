import React, { useState, useEffect, useCallback } from 'react';
import { Search, Grid, List, RefreshCw, Edit2, Trash2, MessageCircle, Moon, Sun } from 'lucide-react';
import { leadsApi } from './services/api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import LeadCard from './components/LeadCard';
import Toast from './components/Toast';

const App = () => {
  // Global States
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLead, setCurrentLead] = useState(null);
  
  // Theme & Layout Settings
  const [theme, setTheme] = useState(localStorage.getItem('crm_theme') || 'dark');
  const [viewFormat, setViewFormat] = useState(localStorage.getItem('crm_view_format') || 'grid');
  
  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  
  // Notification States
  const [toasts, setToasts] = useState([]);

  // Toast Generator Helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch leads database
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadsApi.getAll({
        search: search.trim(),
        status: statusFilter,
        source: sourceFilter,
      });
      setLeads(response.data || []);
    } catch (err) {
      addToast(err.message || 'Could not connect to CRM backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, addToast]);

  // Sync leads list
  useEffect(() => {
    // Debounce search typing
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchLeads]);

  // CRUD Operations Helpers
  const handleFormSubmitSuccess = () => {
    setCurrentLead(null);
    fetchLeads();
  };

  const handleEditClick = (lead) => {
    setCurrentLead(lead);
    // Smooth scroll to form in small viewports
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSuccess = (deletedId) => {
    setLeads((prev) => prev.filter((l) => l.id !== deletedId));
  };

  const handleStatusChangeSuccess = () => {
    fetchLeads();
  };

  const handleInlineStatusChange = async (leadId, leadName, newStatus) => {
    try {
      await leadsApi.update(leadId, { status: newStatus });
      fetchLeads();
      addToast(`Status for "${leadName}" updated to ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update status.', 'error');
    }
  };

  const handleInlineDelete = async (leadId, leadName) => {
    if (window.confirm(`Are you sure you want to permanently delete lead "${leadName}"?`)) {
      try {
        await leadsApi.delete(leadId);
        addToast(`Lead "${leadName}" deleted successfully.`, 'success');
        handleDeleteSuccess(leadId);
      } catch (err) {
        addToast(err.message || 'Failed to delete lead.', 'error');
      }
    }
  };

  // Toggle Theme Helper
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('crm_theme', nextTheme);
  };

  // Toggle View Helper
  const toggleView = (format) => {
    setViewFormat(format);
    localStorage.setItem('crm_view_format', format);
  };

  // Date Formatter helper
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  // Deep Link WhatsApp
  const getWhatsAppLink = (phone, name) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const encodedText = encodeURIComponent(
      `Hello ${name},\n\nThis is regarding our recent CRM inquiry.`
    );
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  };

  return (
    <div className="app-container">
      {/* Navbar Panel */}
      <Navbar 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Dynamic Metric Dashboard */}
        <Dashboard leads={leads} />

        {/* Workspace controls */}
        <div className="workspace-grid">
          
          {/* Left Column: Form Panel */}
          <section className="form-column">
            <LeadForm 
              currentLead={currentLead}
              onFormSubmitSuccess={handleFormSubmitSuccess}
              onCancelEdit={() => setCurrentLead(null)}
              addToast={addToast}
            />
          </section>

          {/* Right Column: Interactive Leads Directory */}
          <section className="directory-column">
            
            {/* Search and Filters panel */}
            <div className="controls-panel glass-panel">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search leads by name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filters-wrapper">
                {/* Status Filter */}
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  title="Filter by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Converted">Converted</option>
                </select>

                {/* Source Filter */}
                <select
                  className="filter-select"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  title="Filter by source"
                >
                  <option value="All">All Sources</option>
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Field">Field</option>
                </select>
              </div>
            </div>

            {/* Leads List Header */}
            <div className="leads-header">
              <div className="leads-count">
                Showing <strong>{leads.length}</strong> lead{leads.length !== 1 ? 's' : ''}
              </div>

              {/* View Layout Toggler */}
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewFormat === 'grid' ? 'active' : ''}`}
                  onClick={() => toggleView('grid')}
                  title="Grid Layout View"
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`toggle-btn ${viewFormat === 'table' ? 'active' : ''}`}
                  onClick={() => toggleView('table')}
                  title="Table Layout View"
                  aria-label="Table view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Leads View Render */}
            {loading && leads.length === 0 ? (
              <div className="loading-container glass-panel">
                <div className="spinner spinner-large"></div>
                <p>Retrieving leads database...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="empty-state glass-panel">
                <Search size={48} className="empty-state-icon" />
                <h3>No CRM Leads Found</h3>
                <p>Try refining your filters or create a new lead to get started.</p>
              </div>
            ) : viewFormat === 'grid' ? (
              /* Grid Layout Mode */
              <div className="leads-grid">
                {leads.map((lead) => (
                  <LeadCard 
                    key={lead.id}
                    lead={lead}
                    onEditClick={handleEditClick}
                    onDeleteSuccess={handleDeleteSuccess}
                    onStatusChangeSuccess={handleStatusChangeSuccess}
                    addToast={addToast}
                  />
                ))}
              </div>
            ) : (
              /* Table Layout Mode */
              <div className="table-responsive glass-panel">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="animate-fade-in">
                        <td style={{ fontWeight: '600' }}>{lead.name}</td>
                        <td>
                          <a href={`tel:${lead.phone}`} style={{ color: 'var(--text-secondary)' }} title="Call lead">
                            {lead.phone}
                          </a>
                        </td>
                        <td>
                          <span className="badge badge-source">{lead.source}</span>
                        </td>
                        <td>
                          <select
                            className="status-dropdown"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            value={lead.status}
                            onChange={(e) => handleInlineStatusChange(lead.id, lead.name, e.target.value)}
                          >
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Converted">Converted</option>
                          </select>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          {formatDate(lead.created_at)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                            {/* WhatsApp button */}
                            <a
                              href={getWhatsAppLink(lead.phone, lead.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="whatsapp-chat-link"
                              style={{ padding: '0.25rem 0.5rem' }}
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={13} />
                              <span>Chat</span>
                            </a>
                            
                            {/* Edit */}
                            <button
                              className="btn-icon"
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => handleEditClick(lead)}
                              title="Edit details"
                            >
                              <Edit2 size={11} />
                            </button>
                            
                            {/* Delete */}
                            <button
                              className="btn-icon"
                              style={{ 
                                width: '28px', 
                                height: '28px',
                                color: 'var(--danger)',
                                borderColor: 'rgba(239,68,68,0.2)',
                              }}
                              onClick={() => handleInlineDelete(lead.id, lead.name)}
                              title="Delete Lead"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Secondary Refresh Indicator */}
            {loading && leads.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <RefreshCw size={14} className="spinner" />
                <span>Refreshing database directory...</span>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating self-dismissing Toast alerts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
