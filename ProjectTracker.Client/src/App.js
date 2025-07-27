import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectService from './services/ProjectService';

/**
 * Root component for the project tracker client.  Fetches projects from the API
 * and renders the form and list components.  Handles create, update and delete
 * operations by delegating to the ProjectService.
 */
function App() {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  const loadProjects = async (status) => {
    try {
      const response = await ProjectService.getProjects(status);
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects', error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (project) => {
    try {
      await ProjectService.createProject(project);
      loadProjects(filterStatus);
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  const handleUpdate = async (id, updatedProject) => {
    try {
      await ProjectService.updateProject(id, updatedProject);
      loadProjects(filterStatus);
    } catch (error) {
      console.error('Error updating project', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ProjectService.deleteProject(id);
      loadProjects(filterStatus);
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    loadProjects(status);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Tracker
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <ProjectForm onSubmit={handleCreate} />
        </Paper>
      </Box>
      <ProjectList
        projects={projects}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />
    </Container>
  );
}

export default App;