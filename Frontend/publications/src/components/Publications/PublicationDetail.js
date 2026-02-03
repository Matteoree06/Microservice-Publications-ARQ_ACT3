import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { publicationService, authorService } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const PublicationDetail = () => {
  const [publication, setPublication] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAuthor, setLoadingAuthor] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const toast = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const statusOptions = [
    { label: 'Borrador', value: 'DRAFT' },
    { label: 'En Revisión', value: 'IN_REVIEW' },
    { label: 'Aprobado', value: 'APPROVED' },
    { label: 'Publicado', value: 'PUBLISHED' },
    { label: 'Rechazado', value: 'REJECTED' }
  ];

  const statusConfig = {
    'DRAFT': { label: 'Borrador', severity: 'info' },
    'IN_REVIEW': { label: 'En Revisión', severity: 'warning' },
    'APPROVED': { label: 'Aprobado', severity: 'help' },
    'PUBLISHED': { label: 'Publicado', severity: 'success' },
    'REJECTED': { label: 'Rechazado', severity: 'danger' }
  };

  useEffect(() => {
    if (id) {
      loadPublication();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPublication = async () => {
    try {
      setLoading(true);
      const response = await publicationService.getPublication(id);
      setPublication(response.data);
      setSelectedStatus(response.data.status);
      
      // Cargar información del autor si existe authorId
      if (response.data.authorId) {
        loadAuthorInfo(response.data.authorId);
      }
    } catch (error) {
      console.error('Error loading publication:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la publicación'
      });
      navigate('/publications');
    } finally {
      setLoading(false);
    }
  };

  const loadAuthorInfo = async (authorId) => {
    try {
      setLoadingAuthor(true);
      
      const response = await authorService.getAuthorById(authorId);
      
      // La API de Laravel devuelve { data: { autor_info } }
      if (response && response.data && response.data.data) {
        setAuthor(response.data.data);
      } else if (response && response.data) {
        setAuthor(response.data);
      } else {
        setAuthor(null);
      }
    } catch (error) {
      setAuthor(null);
      // Mostrar mensaje de advertencia al usuario
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se pudo cargar la información del autor'
      });
    } finally {
      setLoadingAuthor(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === publication.status) {
      setShowStatusDialog(false);
      return;
    }

    try {
      setUpdatingStatus(true);
      await publicationService.updatePublicationStatus(id, selectedStatus);
      
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estado actualizado correctamente'
      });

      setPublication(prev => ({
        ...prev,
        status: selectedStatus
      }));
      
      setShowStatusDialog(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el estado'
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openStatusDialog = () => {
    setSelectedStatus(publication.status);
    setShowStatusDialog(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    navigate('/publications');
  };

  const statusDialogFooter = (
    <div>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        onClick={() => setShowStatusDialog(false)} 
        className="p-button-text"
        disabled={updatingStatus}
      />
      <Button 
        label="Actualizar" 
        icon="pi pi-check" 
        onClick={handleStatusUpdate} 
        loading={updatingStatus}
        disabled={!selectedStatus || selectedStatus === publication?.status}
      />
    </div>
  );

  if (loading) {
    return (
      <div style={{ width: '100%', margin: 0, padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div className="flex align-items-center" style={{ position: 'relative' }}>
            <Skeleton width="200px" height="2.5rem" />
            <Skeleton width="120px" height="2rem" style={{ position: 'absolute', right: 0 }} />
          </div>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '8px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
          marginBottom: '2rem'
        }}>
          <div style={{ borderBottom: '3px solid #2196F3', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <Skeleton width="80%" height="3rem" style={{ margin: '0 auto' }} />
          </div>
          
          <Divider style={{ margin: '2rem 0' }} />
          
          <div style={{ margin: '2rem 0' }}>
            <Skeleton width="150px" height="1.5rem" className="mb-3" />
            <div>
              <Skeleton width="100%" height="1rem" className="mb-2" />
              <Skeleton width="95%" height="1rem" className="mb-2" />
              <Skeleton width="88%" height="1rem" className="mb-3" />
              <Skeleton width="92%" height="1rem" className="mb-2" />
            </div>
          </div>
          
          <Divider style={{ margin: '2rem 0' }} />
          
          <div style={{ padding: '1.5rem', background: '#f8f9fb', borderRadius: '8px', marginBottom: '2rem' }}>
            <Skeleton width="250px" height="1.5rem" className="mb-3" />
            <div className="grid">
              <div className="col-12 md:col-4">
                <Skeleton width="150px" height="0.8rem" className="mb-1" />
                <Skeleton width="200px" height="1rem" />
              </div>
              <div className="col-12 md:col-4">
                <Skeleton width="100px" height="0.8rem" className="mb-1" />
                <Skeleton width="80px" height="1rem" />
              </div>
              <div className="col-12 md:col-4">
                <Skeleton width="120px" height="0.8rem" className="mb-1" />
                <Skeleton width="100px" height="1.5rem" />
              </div>
            </div>
          </div>
          
          <Divider style={{ margin: '2rem 0' }} />
          
          <div style={{ padding: '1.5rem', background: '#f8f9fb', borderRadius: '8px' }}>
            <Skeleton width="100px" height="1.5rem" className="mb-3" />
            <div className="flex align-items-center" style={{ gap: '1rem' }}>
              <Skeleton width="60px" height="60px" borderRadius="50%" />
              <div>
                <Skeleton width="200px" height="1.5rem" className="mb-2" />
                <Skeleton width="250px" height="1rem" className="mb-2" />
                <div className="flex" style={{ gap: '0.5rem' }}>
                  <Skeleton width="80px" height="1.5rem" />
                  <Skeleton width="60px" height="1.5rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div style={{ width: '100%', margin: 0, padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '8px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
          marginBottom: '2rem' 
        }}>
          <div className="text-center" style={{ padding: '4rem 2rem' }}>
            <i className="pi pi-file-excel" style={{ fontSize: '4rem', color: '#ff9800', marginBottom: '1rem' }}></i>
            <h2 style={{ margin: '1rem 0', color: '#666' }}>Publicación no encontrada</h2>
            <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: '2rem' }}>
              La publicación que busca no existe o ha sido eliminada.
            </p>
            <Button 
              label="Volver a Publicaciones" 
              icon="pi pi-arrow-left" 
              onClick={handleBack}
              className="p-button-outlined"
              style={{ padding: '0.75rem 1.5rem' }}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentStatusConfig = statusConfig[publication.status] || { label: publication.status, severity: 'info' };

  // Función para obtener las iniciales del autor
  const getAuthorInitials = (author) => {
    if (!author) return 'A';
    const firstName = author.nombre || '';
    const lastName = author.apellido || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'A';
  };

  // Función para formatear fecha en estilo académico
  const formatAcademicDate = (dateString) => {
    if (!dateString) return 'Fecha no especificada';
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Función para obtener la fecha de publicación (usar autor createdAt como fallback)
  const getPublicationDate = () => {
    // Usar publishedDate de la publicación si existe, sino usar createdAt del autor
    return publication?.publishedDate || author?.createdAt || null;
  };

  return (
    <div style={{ width: '100%', margin: 0, padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Toast ref={toast} />

      {/* Header con controles administrativos */}
      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
        <div className="flex align-items-center" style={{ position: 'relative' }}>
          <Button 
            label="← Volver a Publicaciones" 
            onClick={handleBack}
            className="p-button-text p-button-plain"
            style={{ color: '#666' }}
          />
          <Button 
            label="Cambiar Estado" 
            icon="pi pi-pencil" 
            onClick={openStatusDialog}
            className="p-button-outlined p-button-sm"
            style={{ 
              height: '2rem', 
              fontSize: '0.8rem',
              position: 'absolute',
              right: 0
            }}
          />
        </div>
      </div>

      {/* Artículo IEEE */}
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
        marginBottom: '2rem',
        lineHeight: 1.6
      }}>
        <div>
          {/* Título principal */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '2rem',
            lineHeight: 1.2,
            borderBottom: '3px solid #2196F3',
            paddingBottom: '1rem'
          }}>
            {publication.title}
          </h1>
        </div>

        <Divider style={{ margin: '2rem 0', borderTop: '2px solid #e0e0e0' }} />

        {/* Contenido del artículo */}
        <div style={{ margin: '2rem 0' }}>
          <div>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #2196F3'
            }}>
              Contenido
            </h2>
            <div style={{
              fontSize: '1rem',
              lineHeight: 1.8,
              textAlign: 'justify',
              color: '#2d2d2d'
            }}>
              {publication.content.split('\n').map((paragraph, index) => (
                <p key={index} style={{
                  marginBottom: '1rem',
                  textIndent: index === 0 ? 0 : '2rem'
                }}>
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>

        <Divider style={{ margin: '2rem 0', borderTop: '2px solid #e0e0e0' }} />

        {/* Metadata de la publicación */}
        <div style={{
          margin: '2rem 0',
          padding: '1.5rem',
          background: '#f8f9fb',
          borderRadius: '8px',
          borderLeft: '4px solid #2196F3'
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #2196F3'
          }}>
            Información de Publicación
          </h2>
          <div className="grid">
            <div className="col-12 md:col-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>Fecha de Publicación:</strong>
                <span style={{ fontSize: '1rem', color: '#1a1a1a' }}>{formatAcademicDate(getPublicationDate())}</span>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>ID de Artículo:</strong>
                <span style={{ fontSize: '1rem', color: '#1a1a1a' }}>#{publication.id}</span>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>Estado Editorial:</strong>
                <Tag 
                  value={currentStatusConfig.label} 
                  severity={currentStatusConfig.severity}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información del autor */}
        {publication.authorId && (
          <div>
            <Divider style={{ margin: '2rem 0', borderTop: '2px solid #e0e0e0' }} />
            <div style={{
              margin: '2rem 0',
              padding: '1.5rem',
              background: '#f8f9fb',
              borderRadius: '8px',
              borderLeft: '4px solid #2196F3'
            }}>
              <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #2196F3'
              }}>
                Autor
              </h2>
              {loadingAuthor ? (
                <div className="flex align-items-center" style={{ gap: '1rem' }}>
                  <Skeleton width="60px" height="60px" borderRadius="50%" />
                  <div>
                    <Skeleton width="150px" height="1rem" className="mb-1" />
                    <Skeleton width="200px" height="0.8rem" />
                  </div>
                </div>
              ) : author ? (
                <div className="flex align-items-center" style={{ gap: '1rem' }}>
                  <div>
                    <Avatar 
                      label={getAuthorInitials(author)}
                      size="large"
                      shape="circle"
                      style={{ 
                        backgroundColor: '#2196F3', 
                        color: 'white',
                        fontSize: '1.2rem',
                        width: '60px',
                        height: '60px'
                      }}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#1a1a1a'
                    }}>
                      {author.nombre} {author.apellido}
                    </h3>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      color: '#2196F3',
                      fontSize: '0.95rem'
                    }}>
                      <i className="pi pi-envelope mr-1"></i>
                      {author.email}
                    </p>
                    <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
                      <Chip 
                        label={`Tipo: ${author.type}`} 
                        style={{ fontSize: '0.8rem' }}
                      />
                      <Chip 
                        label={author.activo ? 'Activo' : 'Inactivo'} 
                        style={{ 
                          fontSize: '0.8rem',
                          backgroundColor: author.activo ? '#4caf50' : '#f44336',
                          color: 'white'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex align-items-center" style={{ 
                  gap: '1rem',
                  borderLeft: '4px solid #ff9800',
                  background: '#fff3e0',
                  padding: '1rem',
                  borderRadius: '4px'
                }}>
                  <div>
                    <Avatar 
                      icon="pi pi-user"
                      size="large"
                      shape="circle"
                      style={{ 
                        backgroundColor: '#ff9800', 
                        color: 'white',
                        width: '60px',
                        height: '60px'
                      }}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#ff9800'
                    }}>
                      Información del autor no disponible
                    </h3>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      color: '#666',
                      fontSize: '0.95rem'
                    }}>
                      ID: {publication.authorId}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      <i className="pi pi-exclamation-triangle mr-1"></i>
                      No se pudo cargar la información del autor
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer del artículo */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div className="flex justify-content-between flex-wrap" style={{ gap: '1rem' }}>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', color: '#666' }}>
              <i className="pi pi-calendar mr-1"></i>
              Publicado el {formatAcademicDate(getPublicationDate())}
            </p>
            {publication.authorId && author && (
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', color: '#666' }}>
                <i className="pi pi-user mr-1"></i>
                Autor correspondiente: {author.email}
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog
        header="Cambiar Estado Editorial"
        visible={showStatusDialog}
        style={{ width: '450px' }}
        footer={statusDialogFooter}
        onHide={() => setShowStatusDialog(false)}
      >
        <div className="confirmation-content">
          <div className="flex align-items-center mb-4">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'var(--orange-500)' }}></i>
            <span>¿Está seguro que desea cambiar el estado editorial de esta publicación?</span>
          </div>
          
          <div className="field">
            <label htmlFor="status" className="block mb-2 font-semibold">Nuevo Estado</label>
            <Dropdown
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.value)}
              options={statusOptions}
              placeholder="Seleccione el nuevo estado"
              className="w-full"
            />
          </div>

          <div className="bg-blue-50 p-3 border-round mt-3">
            <div className="flex align-items-start">
              <i className="pi pi-info-circle mr-2 text-blue-600" style={{ marginTop: '0.25rem' }}></i>
              <div>
                <strong className="text-blue-800">Estado actual:</strong>
                <span className="ml-2">{currentStatusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PublicationDetail;