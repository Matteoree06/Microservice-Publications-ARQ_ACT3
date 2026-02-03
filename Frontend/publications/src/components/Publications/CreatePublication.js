import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { publicationService, authorService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePublication = () => {
  const [publication, setPublication] = useState({
    title: '',
    content: '',
    authorId: '',
    publishedDate: null,
    status: 'DRAFT'
  });
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  const statusOptions = [
    { label: 'Borrador', value: 'DRAFT' },
    { label: 'En Revisión', value: 'IN_REVIEW' },
    { label: 'Aprobado', value: 'APPROVED' },
    { label: 'Publicado', value: 'PUBLISHED' },
    { label: 'Rechazado', value: 'REJECTED' }
  ];

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoadingAuthors(true);
      const response = await authorService.getAuthors({
        page: 1,
        per_page: 1000 // Cargar todos los autores
      });
      
      const authorOptions = response.data.data.map(author => ({
        label: `${author.nombre} ${author.apellido} (${author.email})`,
        value: author.uuid
      }));
      
      setAuthors(authorOptions);
    } catch (error) {
      console.error('Error loading authors:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los autores'
      });
    } finally {
      setLoadingAuthors(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`Setting ${field}:`, value); // Debug
    setPublication(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!publication.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!publication.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    }

    if (!publication.authorId || publication.authorId === '') {
      newErrors.authorId = 'Debe seleccionar un autor';
    }

    if (publication.status === 'PUBLISHED' && !publication.publishedDate) {
      newErrors.publishedDate = 'La fecha de publicación es requerida para publicaciones publicadas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const publicationData = {
        title: publication.title,
        content: publication.content,
        authorId: publication.authorId, // Debe ser string UUID
        status: publication.status,
        publishedDate: publication.publishedDate ? publication.publishedDate.toISOString().split('T')[0] : null
      };
      
      console.log('Sending publication data:', publicationData); // Debug
      
      await publicationService.createPublication(publicationData);
      
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Publicación creada correctamente'
      });

      setTimeout(() => {
        navigate('/publications');
      }, 1500);
    } catch (error) {
      console.error('Error creating publication:', error);
      
      let errorMessage = 'No se pudo crear la publicación';
      
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
        errorMessage = 'Por favor corrija los errores en el formulario';
      }
      
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/publications');
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="card">
        <Card title="Crear Nueva Publicación">
          <form onSubmit={handleSubmit}>
            <div className="p-fluid formgrid grid">
              <div className="field col-12">
                <label htmlFor="title">
                  Título <span style={{ color: 'red' }}>*</span>
                </label>
                <InputText
                  id="title"
                  value={publication.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'p-invalid' : ''}
                  placeholder="Ingrese el título de la publicación"
                />
                {errors.title && (
                  <small className="p-error">{errors.title}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="authorId">
                  Autor <span style={{ color: 'red' }}>*</span>
                </label>
                <Dropdown
                  id="authorId"
                  value={publication.authorId}
                  onChange={(e) => handleInputChange('authorId', e.value)}
                  options={authors}
                  placeholder="Seleccione un autor"
                  className={errors.authorId ? 'p-invalid' : ''}
                  loading={loadingAuthors}
                  disabled={loadingAuthors}
                  filter
                  showClear
                />
                {errors.authorId && (
                  <small className="p-error">{errors.authorId}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="status">
                  Estado <span style={{ color: 'red' }}>*</span>
                </label>
                <Dropdown
                  id="status"
                  value={publication.status}
                  onChange={(e) => handleInputChange('status', e.value)}
                  options={statusOptions}
                  placeholder="Seleccione el estado"
                />
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="publishedDate">Fecha de Publicación</label>
                <Calendar
                  id="publishedDate"
                  value={publication.publishedDate}
                  onChange={(e) => handleInputChange('publishedDate', e.value)}
                  className={errors.publishedDate ? 'p-invalid' : ''}
                  placeholder="Seleccione la fecha de publicación"
                  dateFormat="dd/mm/yy"
                  showIcon
                />
                {errors.publishedDate && (
                  <small className="p-error">{errors.publishedDate}</small>
                )}
              </div>

              <div className="field col-12">
                <label htmlFor="content">
                  Contenido <span style={{ color: 'red' }}>*</span>
                </label>
                <InputTextarea
                  id="content"
                  value={publication.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={6}
                  className={errors.content ? 'p-invalid' : ''}
                  placeholder="Ingrese el contenido de la publicación"
                />
                {errors.content && (
                  <small className="p-error">{errors.content}</small>
                )}
              </div>

              <div className="field col-12">
                <div className="flex justify-content-end gap-2">
                  <Button
                    type="button"
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    label="Crear Publicación"
                    icon="pi pi-check"
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreatePublication;