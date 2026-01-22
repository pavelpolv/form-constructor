import { Modal, Select, Button, Space, Typography, notification } from 'antd';
import { useState } from 'react';
import { useFormStore } from '../../../entities/form';
import { useGroupStore } from '../../../entities/group';
import { useFieldStore } from '../../../entities/field';

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

  const groups = useGroupStore((state) => state.groups);
  const copyGroup = useGroupStore((state) => state.copyGroup);
  const addFieldToGroup = useGroupStore((state) => state.addFieldToGroup);
  const addGroupToForm = useFormStore((state) => state.addGroupToForm);
  const fields = useFieldStore((state) => state.fields);
  const createField = useFieldStore((state) => state.createField);

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
      const sourceGroup = groups[selectedGroupId];

      // Копируем группу
      const newGroupId = copyGroup(selectedGroupId, targetFormId);

      // Копируем все поля из исходной группы
      sourceGroup.fieldIds.forEach((fieldId) => {
        const sourceField = fields[fieldId];
        if (sourceField) {
          const { id, groupId, ...fieldData } = sourceField;
          const newFieldId = createField(newGroupId, fieldData);
          addFieldToGroup(newGroupId, newFieldId);
        }
      });

      // Добавляем группу в форму
      addGroupToForm(targetFormId, newGroupId);

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
