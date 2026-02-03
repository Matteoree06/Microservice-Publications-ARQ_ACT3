import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Card } from 'primereact/card';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: 'Autores',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Listar Autores',
          icon: 'pi pi-list',
          command: () => navigate('/authors')
        },
        {
          label: 'Crear Autor',
          icon: 'pi pi-plus',
          command: () => navigate('/authors/create')
        }
      ]
    },
    {
      label: 'Publicaciones',
      icon: 'pi pi-book',
      items: [
        {
          label: 'Listar Publicaciones',
          icon: 'pi pi-list',
          command: () => navigate('/publications')
        },
        {
          label: 'Crear Publicación',
          icon: 'pi pi-plus',
          command: () => navigate('/publications/create')
        }
      ]
    }
  ];

  const start = (
    <span 
      className='p-text-bold' 
      style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#1976d2' }}
      onClick={() => navigate('/')}
    >
      📚 Sistema de Publicaciones
    </span>
  );

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/':
      case '/authors':
        return 'Lista de Autores';
      case '/authors/create':
        return 'Crear Nuevo Autor';
      case '/publications':
        return 'Lista de Publicaciones';
      case '/publications/create':
        return 'Crear Nueva Publicación';
      default:
        if (location.pathname.includes('/publications/')) {
          return 'Detalle de Publicación';
        }
        return 'Sistema de Publicaciones';
    }
  };

  return (
    <div className='App'>
      <Menubar model={items} start={start} />
      <div className='content'>
        <div className='card-container'>
          <Card title={getPageTitle()} className='p-mb-4'>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Layout;