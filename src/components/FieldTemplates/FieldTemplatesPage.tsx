import { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FieldTemplatesTable from './FieldTemplatesTable';
import FieldTemplateDrawer from './FieldTemplateDrawer';

const { Title } = Typography;

const FieldTemplatesPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingTemplateId(null);
    setDrawerOpen(true);
  };

  const handleEdit = (templateId: string) => {
    setEditingTemplateId(templateId);
    setDrawerOpen(true);
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
        <Title level={2}>Шаблоны полей</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Создать шаблон
        </Button>
      </Space>

      <FieldTemplatesTable onEdit={handleEdit} />

      <FieldTemplateDrawer
        templateId={editingTemplateId}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingTemplateId(null);
        }}
      />
    </div>
  );
};

export default FieldTemplatesPage;
