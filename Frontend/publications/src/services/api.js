import axios from 'axios';

// URLs base de los microservicios
const AUTHORS_BASE_URL = 'http://localhost:8000/'; // Laravel
const PUBLICATIONS_BASE_URL = 'http://localhost:5050'; // Spring Boot

// Configuración de axios para autores
export const authorsApi = axios.create({
  baseURL: AUTHORS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Configuración de axios para publicaciones
export const publicationsApi = axios.create({
  baseURL: PUBLICATIONS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Servicios para autores
export const authorService = {
  // Obtener todos los autores con paginación
  getAuthors: async (params = {}) => {
    const response = await authorsApi.get('/authors', { params });
    return response;
  },

  // Crear un nuevo autor
  createAuthor: async (authorData) => {
    const response = await authorsApi.post('/authors', authorData);
    return response;
  },

  // Obtener un autor por UUID
  getAuthorById: async (uuid) => {
    const response = await authorsApi.get(`/authors/${uuid}`);
    return response;
  },

  // Eliminar un autor
  deleteAuthor: async (uuid) => {
    const response = await authorsApi.delete(`/authors/${uuid}`);
    return response;
  },
};

// Servicios para publicaciones
export const publicationService = {
  // Obtener todas las publicaciones con paginación
  getPublications: async (params = {}) => {
    const response = await publicationsApi.get('/publications', { params });
    return response;
  },

  // Crear una nueva publicación
  createPublication: async (publicationData) => {
    const response = await publicationsApi.post('/publications', publicationData);
    return response;
  },

  // Obtener una publicación por ID
  getPublication: async (id) => {
    const response = await publicationsApi.get(`/publications/${id}`);
    return response;
  },

  // Actualizar estado de una publicación
  updatePublicationStatus: async (id, status) => {
    const response = await publicationsApi.patch(`/publications/${id}/status`, { status });
    return response;
  },

  // Eliminar una publicación
  deletePublication: async (id) => {
    const response = await publicationsApi.delete(`/publications/${id}`);
    return response;
  },
};