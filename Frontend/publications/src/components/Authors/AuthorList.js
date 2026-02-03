import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { authorService } from '../../services/api';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    loadAuthors();
  }, [first, rows]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const response = await authorService.getAuthors({
        page: Math.floor(first / rows) + 1,
        per_page: rows
      });
      
      setAuthors(response.data.data);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error('Error loading authors:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los autores'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAuthor = async (authorUuid) => {
    try {
      await authorService.deleteAuthor(authorUuid);
      loadAuthors();
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Autor eliminado correctamente'
      });
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el autor'
      });
    }
  };

  const confirmDelete = (author) => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar este autor?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteAuthor(author.uuid),
      acceptLabel: 'Sí',
      rejectLabel: 'No'
    });
  };

  const typeBodyTemplate = (rowData) => {
    const typeLabels = {
      'regular': 'Regular',
      'premium': 'Premium',
      'admin': 'Admin'
    };
    return typeLabels[rowData.type] || rowData.type;
  };

  const nameBodyTemplate = (rowData) => {
    return `${rowData.nombre} ${rowData.apellido}`;
  };

  const activeBodyTemplate = (rowData) => {
    return rowData.activo ? 'Activo' : 'Inactivo';
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Eliminar autor"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
    );
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="card">
        <h1>Autores</h1>
        
        <DataTable
          value={authors}
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
          emptyMessage="No se encontraron autores"
        >
          <Column field="uuid" header="UUID" sortable style={{ width: '8rem' }} />
          <Column field="nombre" header="Nombre Completo" body={nameBodyTemplate} sortable />
          <Column field="email" header="Email" sortable />
          <Column field="type" header="Tipo" body={typeBodyTemplate} sortable />
          <Column field="activo" header="Estado" body={activeBodyTemplate} sortable />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default AuthorList;