import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { publicationService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const PublicationList = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPublications();
  }, [first, rows]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPublications = async () => {
    try {
      setLoading(true);
      const response = await publicationService.getPublications({
        page: Math.floor(first / rows),
        size: rows
      });
      
      if (response.data) {
        const publications = response.data.content || response.data;
        setPublications(publications);
        setTotalRecords(response.data.totalElements || publications.length);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las publicaciones'
      });
    } finally {
      setLoading(false);
    }
  };

  const statusBodyTemplate = (rowData) => {
    const statusConfig = {
      'DRAFT': { label: 'Borrador', severity: 'info' },
      'IN_REVIEW': { label: 'En Revisión', severity: 'warning' },
      'APPROVED': { label: 'Aprobado', severity: 'help' },
      'PUBLISHED': { label: 'Publicado', severity: 'success' },
      'REJECTED': { label: 'Rechazado', severity: 'danger' }
    };

    const config = statusConfig[rowData.status] || { label: rowData.status, severity: 'info' };
    
    return <Tag value={config.label} severity={config.severity} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-info"
          onClick={() => navigate(`/publications/${rowData.id}`)}
          tooltip="Ver detalle"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
    );
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch (error) {
      return '-';
    }
  };

  const dateBodyTemplate = (rowData) => {
    // Probar diferentes nombres de campo de fecha
    const dateValue = rowData.publishedDate || rowData.createdDate || rowData.date || rowData.publishDate;
    return formatDate(dateValue);
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="card">
        <h1>Publicaciones</h1>
        
        <DataTable
          value={publications}
          loading={loading}
          paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          lazy
          rowsPerPageOptions={[10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
          emptyMessage="No se encontraron publicaciones"
        >
          <Column field="id" header="ID" sortable style={{ width: '5rem' }} />
          <Column field="title" header="Título" sortable />
          <Column field="status" header="Estado" body={statusBodyTemplate} sortable />
          <Column field="publishedDate" header="Fecha de Publicación" body={dateBodyTemplate} sortable />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default PublicationList;