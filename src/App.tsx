import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import FormsListPage from './components/Forms/FormsList/FormsListPage';
import FormEditPage from './components/Forms/FormEdit/FormEditPage';
import { FieldTemplatesPage } from './components/FieldTemplates';
import useFormStore from './store/useFormStore';

const App = () => {
  const initMockData = useFormStore((state) => state.initMockData);

  useEffect(() => {
    initMockData();
  }, [initMockData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/forms" replace />} />
          <Route path="forms" element={<FormsListPage />} />
          <Route path="forms/:formId" element={<FormEditPage />} />
          <Route path="field-templates" element={<FieldTemplatesPage />} />
          <Route path="*" element={<Navigate to="/forms" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
