import { Modal, Select, Button, Space, Typography, notification } from 'antd';
import { useState } from 'react';
import useFormStore from '../../../store/useFormStore';

const { Title } = Typography;

interface CopyGroupModalProps {
  open: boolean;
  onClose: () => void;
  targetFormId: string;
}

interface GroupOption {
  label: string;
  value: string;
}

const CopyGroupModal = ({ open, onClose, targetFormId }: CopyGroupModalProps) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);

  const groups = useFormStore((state) => state.groups);
  const copyGroup = useFormStore((state) => state.copyGroup);

  // Формируем список всех групп из всех форм
  const groupOptions: GroupOption[] = Object.values(groups).map((group) => ({
    label: group.системноеНазвание || group.название,
    value: group.id,
  }));

  const handleInsert = () => {
    if (!selectedGroupId) {
      return;
    }

    try {
      copyGroup(selectedGroupId, targetFormId);

      notification.success({
        message: 'Успех',
        description: 'Группа успешно скопирована',
        placement: 'topRight',
      });

      setSelectedGroupId(undefined);
      onClose();
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось скопировать группу',
        placement: 'topRight',
      });
    }
  };

  const handleCancel = () => {
    setSelectedGroupId(undefined);
    onClose();
  };

  return (
    <Modal
      title="Параметры вставки копированием"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Title level={5}>Выберите группу для копирования:</Title>
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите группу"
            showSearch
            value={selectedGroupId}
            onChange={setSelectedGroupId}
            options={groupOptions}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        <Button
          type="primary"
          block
          onClick={handleInsert}
          disabled={!selectedGroupId}
        >
          Вставить
        </Button>
      </Space>
    </Modal>
  );
};

export default CopyGroupModal;
