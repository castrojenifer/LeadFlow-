import React from 'react';
import { Users, UserCheck, Heart, Percent } from 'lucide-react';

const Dashboard = ({ leads = [] }) => {
  const totalLeads = leads.length;
  
  // Calculate specific statuses
  const interestedLeads = leads.filter(lead => lead.status === 'Interested').length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const notInterestedLeads = leads.filter(lead => lead.status === 'Not Interested').length;

  // Conversion calculations
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const interestRate = totalLeads > 0 ? Math.round((interestedLeads / totalLeads) * 100) : 0;

  return (
    <div className="dashboard-grid animate-fade-in">
      {/* Total Leads Summary Card */}
      <div className="summary-card total glass-panel">
        <div className="card-icon-wrapper">
          <Users size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">Total Leads</span>
          <span className="card-value">{totalLeads}</span>
          <span className="card-percentage" style={{ color: 'var(--text-secondary)' }}>
            All channel entries
          </span>
        </div>
      </div>

      {/* Interested Leads Summary Card */}
      <div className="summary-card interested glass-panel">
        <div className="card-icon-wrapper">
          <Heart size={22} fill="currentColor" fillOpacity={0.1} />
        </div>
        <div className="card-info">
          <span className="card-title">Interested Leads</span>
          <span className="card-value">{interestedLeads}</span>
          <span className="card-percentage warning">
            {interestRate}% of database
          </span>
        </div>
      </div>

      {/* Converted Leads Summary Card */}
      <div className="summary-card converted glass-panel">
        <div className="card-icon-wrapper">
          <UserCheck size={22} />
        </div>
        <div className="card-info">
          <span className="card-title">Converted Leads</span>
          <span className="card-value">{convertedLeads}</span>
          <span className="card-percentage success">
            {conversionRate}% Conversion Rate
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
