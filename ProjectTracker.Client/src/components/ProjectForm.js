import React, { useState } from 'react';
import { TextField, Button, MenuItem, Grid } from '@mui/material';

function ProjectForm({ onSubmit }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        owner: '',
        status: 'Planned',
        startDate: '',
        endDate: ''
    });
    // Store validation errors keyed by field name
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        // Required fields
        if (!form.name.trim()) newErrors.name = 'Project name is required.';
        if (form.name.length < 3 || form.name.length > 100) {
            newErrors.name = 'Name must be between 3 and 100 characters.';
        }
        if (!form.owner.trim()) newErrors.owner = 'Owner is required.';
        // Date range check
        if (form.startDate && form.endDate) {
            const start = new Date(form.startDate);
            const end = new Date(form.endDate);
            if (end < start) newErrors.endDate = 'End date must be on or after start date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return; // stop if there are errors

        onSubmit(form);
        // reset form
        setForm({ name: '', description: '', owner: '', status: 'Planned', startDate: '', endDate: '' });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Project Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Owner"
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.owner)}
                        helperText={errors.owner}
                    />
                </Grid>
                {/* ...description, status fields... */}
                <Grid item xs={6} md={3}>
                    <TextField
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(errors.endDate)}
                        helperText={errors.endDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" type="submit">Create Project</Button>
                </Grid>
            </Grid>
        </form>
    );
}
