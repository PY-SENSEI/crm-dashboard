import express from 'express';
import auth from '../middleware/auth.js';
import Lead from '../models/Lead.js';

const router = express.Router();

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // total leads
    const totalLeads = await Lead.countDocuments();

    const leadsByStatus = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get leads created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLeads = await Lead.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get total value
    const totalValueResult = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' }
        }
      }
    ]);
    
    const totalValue = totalValueResult[0]?.totalValue || 0;
    
    // Get leads over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const leadsOverTime = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json({
      totalLeads,
      convertedLeads: leadsByStatus.find(s => s._id === 'converted')?.count || 0,
      leadsByStatus,
      leadsBySource,
      recentLeads,
      totalValue,
      leadsOverTime
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;