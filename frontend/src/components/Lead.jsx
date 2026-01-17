import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const navigate = useNavigate();

  const statusColors = {
    new: 'primary',
    contacted: 'info',
    qualified: 'warning',
    proposal: 'secondary',
    negotiation: 'default',
    converted: 'success',
    lost: 'error'
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page + 1,
        limit: pagination.limit,
        ...filters
      };

      const response = await api.get('/leads', { params });
      setLeads(response.data.leads);
      setPagination({
        ...response.data.pagination,
        page: response.data.pagination.page - 1
      });
    } catch (error) {
      toast.error('Error fetching leads');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, pagination.limit, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      source: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Leads</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/leads/new')}
        >
          Add New Lead
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name, email, or company"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="proposal">Proposal</MenuItem>
                <MenuItem value="negotiation">Negotiation</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                value={filters.source}
                label="Source"
                onChange={(e) => handleFilterChange('source', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="social_media">Social Media</MenuItem>
                <MenuItem value="email_campaign">Email Campaign</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="value">Value</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={filters.sortOrder}
                label="Order"
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchLeads}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading && <LinearProgress />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id} hover>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  <Chip
                    label={lead.status}
                    color={statusColors[lead.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.source}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatCurrency(lead.value)}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={handlePageChange}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default Leads;