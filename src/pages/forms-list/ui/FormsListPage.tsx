import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useFormStore } from '../../../entities/form';
import { FormsTable, CreateFormDrawer } from '../../../features/form-management';

const { Title } = Typography;

const FormsListPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const forms = useFormStore((state) => state.forms);
  const createForm = useFormStore((state) => state.createForm);
  const deleteForm = useFormStore((state) => state.deleteForm);

  const handleCreate = (название: string, системноеНазвание: string) => {
    const formId = createForm(название, системноеНазвание);
    navigate(`/forms/${formId}`);
  };

  const handleEdit = (formId: string) => {
    navigate(`/forms/${formId}`);
  };

  const handleDelete = (formId: string) => {
    deleteForm(formId);
  };

  return (
    <div>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={2}>Формы</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerOpen(true)}
        >
          Создать
        </Button>
      </Space>

      <FormsTable forms={forms} onEdit={handleEdit} onDelete={handleDelete} />

      <CreateFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default FormsListPage;
