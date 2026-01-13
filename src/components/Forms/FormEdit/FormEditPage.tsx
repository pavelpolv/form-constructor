import { useParams } from 'react-router-dom';
import { Button, Typography, Space, Alert } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useFormStore from '../../../store/useFormStore';
import GroupTable from './GroupTable';
import CopyGroupModal from './CopyGroupModal';

const { Title } = Typography;

const FormEditPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const forms = useFormStore((state) => state.forms);
  const groups = useFormStore((state) => state.groups);
  const createGroup = useFormStore((state) => state.createGroup);

  if (!formId) {
    return <Alert message="ID формы не указан" type="error" />;
  }

  const form = forms[formId];

  if (!form) {
    return <Alert message="Форма не найдена" type="error" />;
  }

  const handleAddGroup = () => {
    createGroup(formId, 'Новая группа', '', true);
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
        <Title level={2}>{form.название}</Title>
        <Space>
          <Button
            type="default"
            icon={<CopyOutlined />}
            onClick={() => setCopyModalOpen(true)}
          >
            Добавить группу копированием
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddGroup}
          >
            Добавить группу
          </Button>
        </Space>
      </Space>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {form.groupIds.map((groupId) => (
          <GroupTable key={groupId} group={groups[groupId]} />
        ))}
      </Space>

      <CopyGroupModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        targetFormId={formId}
      />
    </div>
  );
};

export default FormEditPage;
