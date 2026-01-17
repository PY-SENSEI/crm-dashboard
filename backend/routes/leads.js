import express from 'express';
import Lead from '../models/Lead.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/leads - Get all leads with filtering, sorting, pagination
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      source,
      startDate,
      endDate,
      minValue,
      maxValue
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtering
    if (status) query.status = status;
    if (source) query.source = source;
    
    if (minValue || maxValue) {
      query.value = {};
      if (minValue) query.value.$gte = Number(minValue);
      if (maxValue) query.value.$lte = Number(maxValue);
    }

    // Date filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('assignedTo', 'name email');

    const total = await Lead.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
});

// GET /api/leads/:id - Get single lead
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('activity.user', 'name email');
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Error fetching lead', error: error.message });
  }
});

// POST /api/leads - Create new lead
router.post('/', auth, async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lead', error: error.message });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Error updating lead', error: error.message });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error: error.message });
  }
});

export default router;