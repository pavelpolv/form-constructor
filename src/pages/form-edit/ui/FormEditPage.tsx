import { useParams } from 'react-router-dom';
import { Button, Typography, Space, Alert } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useFormStore } from '../../../entities/form';
import { useGroupStore } from '../../../entities/group';
import { GroupTable } from '../../../widgets/group-table';
import { CopyGroupModal } from '../../../features/group-management';

const { Title } = Typography;

const FormEditPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const forms = useFormStore((state) => state.forms);
  const createAndAddGroup = useFormStore((state) => state.createAndAddGroup);
  const groups = useGroupStore((state) => state.groups);

  if (!formId) {
    return <Alert message="ID формы не указан" type="error" />;
  }

  const form = forms[formId];

  if (!form) {
    return <Alert message="Форма не найдена" type="error" />;
  }

  const handleAddGroup = () => {
    createAndAddGroup(formId, 'Новая группа', '', true);
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
        {form.groupIds.map((groupId) => {
          const group = groups[groupId];
          if (!group) {
            console.error(`Group ${groupId} not found in groups store`);
            return null;
          }
          return <GroupTable key={groupId} group={group} />;
        })}
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
