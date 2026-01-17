import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert,
  LinearProgress,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'New', color: 'primary' },
    { value: 'contacted', label: 'Contacted', color: 'info' },
    { value: 'qualified', label: 'Qualified', color: 'warning' },
    { value: 'proposal', label: 'Proposal', color: 'secondary' },
    { value: 'negotiation', label: 'Negotiation', color: 'default' },
    { value: 'converted', label: 'Converted', color: 'success' },
    { value: 'lost', label: 'Lost', color: 'error' }
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'email_campaign', label: 'Email Campaign' },
    { value: 'event', label: 'Event' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await api.get(`/leads/${id}`);
      setLead(response.data);
    } catch (error) {
      toast.error('Error fetching lead details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/leads/${id}`, lead);
      toast.success('Lead updated successfully');
      setIsEditing(false);
      fetchLead();
    } catch (error) {
      toast.error('Error updating lead');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setLead(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!lead) {
    return (
      <Alert severity="error">
        Lead not found
      </Alert>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === lead.status);
  const currentSource = sourceOptions.find(s => s.value === lead.source);

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/leads')}
        >
          Back to Leads
        </Button>
        
        {!isEditing && (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
          >
            Edit Lead
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">
                {isEditing ? 'Edit Lead' : 'Lead Details'}
              </Typography>
              
              {isEditing && (
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      fetchLead();
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={lead.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={lead.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={lead.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={lead.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={lead.status || 'new'}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={lead.source || 'website'}
                    label="Source"
                    onChange={(e) => handleChange('source', e.target.value)}
                  >
                    {sourceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lead Value"
                  type="number"
                  value={lead.value || 0}
                  onChange={(e) => handleChange('value', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={lead.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Information
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={currentStatus?.label || 'New'}
                    color={currentStatus?.color || 'primary'}
                    size="small"
                  />
                  <Chip
                    label={currentSource?.label || 'Website'}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Divider />

                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {lead.phone || 'No phone provided'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {lead.email}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {lead.company || 'No company'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoneyIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatCurrency(lead.value || 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box display="flex" alignItems="center" gap={1}>
                  <UpdateIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    Created: {formatDate(lead.createdAt)}
                  </Typography>
                </Box>

                {lead.lastContacted && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <UpdateIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      Last Contacted: {formatDate(lead.lastContacted)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadDetail;