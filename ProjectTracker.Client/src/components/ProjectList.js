import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/**
 * Displays a list of projects in a table with actions to delete and update.  A
 * drop‑down filter allows users to filter by status.  Updating is implemented
 * with a simple prompt for demonstration purposes; a modal dialog could replace
 * this for a more complete UX.
 */
function ProjectList({ projects, onUpdate, onDelete, filterStatus, onFilterChange }) {
  const handleStatusChange = (event) => {
    onFilterChange(event.target.value);
  };

  const handleEdit = (project) => {
    const newStatus = window.prompt(
      'Enter new status (Planned, InProgress, Completed):',
      project.status
    );
    if (!newStatus) return;
    // Only update if the status has actually changed
    if (newStatus !== project.status) {
      onUpdate(project.id, { ...project, status: newStatus });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={filterStatus}
          label="Status Filter"
          onChange={handleStatusChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Planned">Planned</MenuItem>
          <MenuItem value="InProgress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.owner}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.startDate}</TableCell>
                <TableCell>{project.endDate}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(project)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(project.id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ProjectList;