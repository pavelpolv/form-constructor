import { useState } from 'react';
import { Drawer, Table, Button, Radio, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTemplateStore } from '../../../entities/template';
import type { FieldTemplate } from '../../../entities/template';

interface SelectTemplateDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

interface TemplateDataType extends FieldTemplate {
  key: string;
}

const SelectTemplateDrawer = ({ open, onClose, onSelectTemplate }: SelectTemplateDrawerProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const templates = useTemplateStore((state) => state.templates);

  const columns: ColumnsType<TemplateDataType> = [
    {
      title: '',
      key: 'radio',
      width: 50,
      render: (_, record) => (
        <Radio
          checked={selectedTemplateId === record.id}
          onChange={() => setSelectedTemplateId(record.id)}
        />
      ),
    },
    {
      title: 'Название шаблона',
      dataIndex: 'названиеШаблона',
      key: 'названиеШаблона',
    },
  ];

  // Сортировка по createdAt (новые первыми)
  const dataSource: TemplateDataType[] = Object.values(templates)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((template) => ({
      ...template,
      key: template.id,
    }));

  const handleApply = () => {
    if (selectedTemplateId) {
      onSelectTemplate(selectedTemplateId);
      setSelectedTemplateId(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedTemplateId(null);
    onClose();
  };

  return (
    <Drawer
      title="Выберите шаблон"
      open={open}
      onClose={handleCancel}
      width="50%"
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>Отмена</Button>
            <Button
              type="primary"
              onClick={handleApply}
              disabled={!selectedTemplateId}
            >
              Применить
            </Button>
          </Space>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => setSelectedTemplateId(record.id),
          style: { cursor: 'pointer' },
        })}
      />
    </Drawer>
  );
};

export default SelectTemplateDrawer;
