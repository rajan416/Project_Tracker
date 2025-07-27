import axios from 'axios';

// Base URL for the API.  REACT_APP_API_URL can be set in a .env file to
// override the default (which assumes the API is running on the same host with
// an /api prefix).  For local development, the API project typically runs on
// https://localhost:5001 and is proxied via package.json if necessary.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getProjects = (status) => {
  const params = status ? { status } : {};
  return axiosInstance.get('/projects', { params });
};

const getProject = (id) => {
  return axiosInstance.get(`/projects/${id}`);
};

const createProject = (project) => {
  return axiosInstance.post('/projects', project);
};

const updateProject = (id, project) => {
  return axiosInstance.put(`/projects/${id}`, project);
};

const deleteProject = (id) => {
  return axiosInstance.delete(`/projects/${id}`);
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};