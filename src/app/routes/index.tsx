import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../../shared/ui/layout';
import { FormsListPage } from '../../pages/forms-list';
import { FormEditPage } from '../../pages/form-edit';
import { FieldTemplatesPage } from '../../pages/field-templates';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Navigate to="/forms" replace />} />
      <Route path="forms" element={<FormsListPage />} />
      <Route path="forms/:formId" element={<FormEditPage />} />
      <Route path="field-templates" element={<FieldTemplatesPage />} />
      <Route path="*" element={<Navigate to="/forms" replace />} />
    </Route>
  </Routes>
);
