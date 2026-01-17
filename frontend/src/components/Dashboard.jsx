import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  const stats = [
    {
      title: 'Total Leads',
      value: analytics?.totalLeads || 0,
      icon: <PeopleIcon />,
      color: '#1976d2'
    },
    {
      title: 'Converted Leads',
      value: analytics?.convertedLeads || 0,
      icon: <CheckCircleIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Recent Leads (30 days)',
      value: analytics?.recentLeads || 0,
      icon: <TrendingUpIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Total Value',
      value: `$${(analytics?.totalValue || 0).toLocaleString()}`,
      icon: <MoneyIcon />,
      color: '#9c27b0'
    }
  ];

  const statusData = analytics?.leadsByStatus.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    count: item.count
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" color="textSecondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      borderRadius: '50%',
                      p: 1
                    }}
                  >
                    <Box sx={{ color: stat.color }}>
                      {stat.icon}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Leads by Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Leads by Source
            </Typography>
            <Box>
              {analytics?.leadsBySource.map((source, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    borderBottom: index < analytics.leadsBySource.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <Typography>
                    {source._id.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Chip label={source.count} color="primary" size="small" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;