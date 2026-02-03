import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import Layout from './components/Layout';
import AuthorList from './components/Authors/AuthorList';
import CreateAuthor from './components/Authors/CreateAuthor';
import PublicationList from './components/Publications/PublicationList';
import CreatePublication from './components/Publications/CreatePublication';
import PublicationDetail from './components/Publications/PublicationDetail';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<AuthorList />} />
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/authors/create" element={<CreateAuthor />} />
            <Route path="/publications" element={<PublicationList />} />
            <Route path="/publications/create" element={<CreatePublication />} />
            <Route path="/publications/:id" element={<PublicationDetail />} />
          </Routes>
        </Layout>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
