import React, { useState } from 'react';
import { TextField, Button, MenuItem, Grid } from '@mui/material';

const statusOptions = [
  { value: 'Planned', label: 'Planned' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

/**
 * Form component for creating a new project.  Maintains local state for
 * each field and calls the onSubmit callback with the project object on submit.
 */
function ProjectForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    owner: '',
    status: 'Planned',
    startDate: '',
    endDate: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Map status to enum string; other values are passed verbatim
    onSubmit({
      ...form
    });
    // Reset form after submission
    setForm({
      name: '',
      description: '',
      owner: '',
      status: 'Planned',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Owner"
            name="owner"
            value={form.owner}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Create Project
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default ProjectForm;