-- Schema for Lead Management System (Mini CRM)
-- Database Name suggestion: lead_crm

-- Create Table for Leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
    status VARCHAR(20) DEFAULT 'Interested' CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimizations on filters and search
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Seed Data for instant visualization
INSERT INTO leads (name, phone, source, status, created_at) VALUES
('Amit Sharma', '+919876543210', 'Call', 'Interested', NOW() - INTERVAL '2 days'),
('Sneha Patel', '+919988776655', 'WhatsApp', 'Converted', NOW() - INTERVAL '1 day'),
('John Doe', '+1555019922', 'Field', 'Not Interested', NOW() - INTERVAL '4 days'),
('Priya Nair', '+919123456789', 'WhatsApp', 'Interested', NOW() - INTERVAL '6 hours'),
('Carlos Santana', '+1415555267', 'Call', 'Converted', NOW() - INTERVAL '3 days'),
('Vikram Malhotra', '+918888888888', 'Field', 'Interested', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;
