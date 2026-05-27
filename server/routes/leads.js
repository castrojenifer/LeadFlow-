const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Dynamic Check: Use Supabase REST API directly if credentials are provided in .env
const useSupabaseRest = () => {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
};

// Generate standard Supabase headers
const getSupabaseHeaders = () => ({
  'apikey': process.env.SUPABASE_KEY,
  'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
  'Content-Type': 'application/json',
});

// GET /api/leads - Retrieve all leads with optional filtering and search
router.get('/', async (req, res, next) => {
  try {
    const { search, status, source } = req.query;

    // OPTION A: Connect via Supabase REST API
    if (useSupabaseRest()) {
      const baseUrl = process.env.SUPABASE_URL;
      let url = `${baseUrl}/rest/v1/leads?select=*`;

      // Filter: status
      if (status && status !== 'All') {
        url += `&status=eq.${status}`;
      }

      // Filter: source
      if (source && source !== 'All') {
        url += `&source=eq.${source}`;
      }

      // Filter: Fuzzy search
      if (search && search.trim() !== '') {
        const term = encodeURIComponent(`%${search.trim()}%`);
        url += `&or=(name.ilike.${term},phone.ilike.${term})`;
      }

      // Order: newest first
      url += `&order=created_at.desc`;

      const response = await fetch(url, {
        headers: getSupabaseHeaders(),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({
          success: false,
          error: `Supabase database error: ${errText}. Please make sure you have run the schema.sql script inside Supabase SQL Editor.`,
        });
      }

      const data = await response.json();
      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    }

    // OPTION B: Fallback to local PostgreSQL Pool
    let sql = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (source && source !== 'All') {
      params.push(source);
      sql += ` AND source = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      sql += ` AND (name ILIKE $${params.length} OR phone ILIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/leads - Create a new lead
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, source, status } = req.body;

    // Form input validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    if (!source || !['Call', 'WhatsApp', 'Field'].includes(source)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Source is required and must be either Call, WhatsApp, or Field' 
      });
    }

    const finalStatus = status || 'Interested';
    if (!['Interested', 'Not Interested', 'Converted'].includes(finalStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid lead status' });
    }

    // OPTION A: Write directly to Supabase REST
    if (useSupabaseRest()) {
      const baseUrl = process.env.SUPABASE_URL;
      const response = await fetch(`${baseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          source,
          status: finalStatus,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({
          success: false,
          error: `Supabase write failed: ${errText}`,
        });
      }

      const data = await response.json();
      return res.status(201).json({
        success: true,
        message: 'Lead created successfully in Supabase',
        data: data[0],
      });
    }

    // OPTION B: Fallback to local PostgreSQL
    const insertSql = `
      INSERT INTO leads (name, phone, source, status) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const result = await db.query(insertSql, [
      name.trim(), 
      phone.trim(), 
      source, 
      finalStatus
    ]);

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully in local database',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/leads/:id - Update lead details (e.g. status)
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, source, status } = req.body;

    // OPTION A: Write directly to Supabase REST
    if (useSupabaseRest()) {
      const baseUrl = process.env.SUPABASE_URL;

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (phone !== undefined) updateData.phone = phone.trim();
      if (source !== undefined) updateData.source = source;
      if (status !== undefined) updateData.status = status;

      const response = await fetch(`${baseUrl}/rest/v1/leads?id=eq.${id}`, {
        method: 'PATCH', // PostgREST uses PATCH for updates
        headers: {
          ...getSupabaseHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({
          success: false,
          error: `Supabase update failed: ${errText}`,
        });
      }

      const data = await response.json();
      if (data.length === 0) {
        return res.status(404).json({ success: false, error: `Lead with ID ${id} not found` });
      }

      return res.status(200).json({
        success: true,
        message: 'Lead updated successfully in Supabase',
        data: data[0],
      });
    }

    // OPTION B: Fallback to local PostgreSQL
    const checkSql = 'SELECT * FROM leads WHERE id = $1';
    const checkResult = await db.query(checkSql, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Lead with ID ${id} not found` });
    }

    const currentLead = checkResult.rows[0];

    const updatedName = name !== undefined ? name.trim() : currentLead.name;
    const updatedPhone = phone !== undefined ? phone.trim() : currentLead.phone;
    const updatedSource = source !== undefined ? source : currentLead.source;
    const updatedStatus = status !== undefined ? status : currentLead.status;

    if (!updatedName || !updatedPhone) {
      return res.status(400).json({ success: false, error: 'Name and Phone cannot be blank' });
    }

    const updateSql = `
      UPDATE leads 
      SET name = $1, phone = $2, source = $3, status = $4
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(updateSql, [
      updatedName,
      updatedPhone,
      updatedSource,
      updatedStatus,
      id
    ]);

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully in local database',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/leads/:id - Remove a lead
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // OPTION A: Write directly to Supabase REST
    if (useSupabaseRest()) {
      const baseUrl = process.env.SUPABASE_URL;
      const response = await fetch(`${baseUrl}/rest/v1/leads?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          ...getSupabaseHeaders(),
          'Prefer': 'return=representation',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({
          success: false,
          error: `Supabase delete failed: ${errText}`,
        });
      }

      const data = await response.json();
      if (data.length === 0) {
        return res.status(404).json({ success: false, error: `Lead with ID ${id} not found` });
      }

      return res.status(200).json({
        success: true,
        message: 'Lead deleted successfully from Supabase',
        deletedLead: data[0],
      });
    }

    // OPTION B: Fallback to local PostgreSQL
    const deleteSql = 'DELETE FROM leads WHERE id = $1 RETURNING *';
    const result = await db.query(deleteSql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Lead with ID ${id} not found` });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully from local database',
      deletedLead: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
