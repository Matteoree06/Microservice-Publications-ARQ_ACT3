import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { authorService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateAuthor = () => {
  const [author, setAuthor] = useState({
    nombre: '',
    apellido: '',
    email: '',
    type: 'regular',
    activo: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const authorTypes = [
    { label: 'Regular', value: 'regular' },
    { label: 'Premium', value: 'premium' },
    { label: 'Admin', value: 'admin' }
  ];

  const handleInputChange = (field, value) => {
    setAuthor(prev => ({
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

    if (!author.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!author.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!author.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(author.email)) {
      newErrors.email = 'El formato del email no es válido';
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
      await authorService.createAuthor(author);
      
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Autor creado correctamente'
      });

      setTimeout(() => {
        navigate('/authors');
      }, 1500);
    } catch (error) {
      console.error('Error creating author:', error);
      
      let errorMessage = 'No se pudo crear el autor';
      
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
    navigate('/authors');
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="card">
        <Card title="Crear Nuevo Autor">
          <form onSubmit={handleSubmit}>
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="nombre">
                  Nombre <span style={{ color: 'red' }}>*</span>
                </label>
                <InputText
                  id="nombre"
                  value={author.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={errors.nombre ? 'p-invalid' : ''}
                  placeholder="Ingrese el nombre del autor"
                />
                {errors.nombre && (
                  <small className="p-error">{errors.nombre}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="apellido">
                  Apellido <span style={{ color: 'red' }}>*</span>
                </label>
                <InputText
                  id="apellido"
                  value={author.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className={errors.apellido ? 'p-invalid' : ''}
                  placeholder="Ingrese el apellido del autor"
                />
                {errors.apellido && (
                  <small className="p-error">{errors.apellido}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="email">
                  Email <span style={{ color: 'red' }}>*</span>
                </label>
                <InputText
                  id="email"
                  type="email"
                  value={author.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'p-invalid' : ''}
                  placeholder="Ingrese el email del autor"
                />
                {errors.email && (
                  <small className="p-error">{errors.email}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="type">
                  Tipo <span style={{ color: 'red' }}>*</span>
                </label>
                <Dropdown
                  id="type"
                  value={author.type}
                  onChange={(e) => handleInputChange('type', e.value)}
                  options={authorTypes}
                  placeholder="Seleccione el tipo de autor"
                />
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
                    label="Crear Autor"
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

export default CreateAuthor;