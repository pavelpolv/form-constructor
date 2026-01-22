import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTemplateStore } from '../../../entities/template';
import type { FieldTemplate } from '../../../entities/template';

interface FieldTemplateDataType extends FieldTemplate {
  key: string;
}

interface FieldTemplatesTableProps {
  onEdit: (templateId: string) => void;
}

const FieldTemplatesTable = ({ onEdit }: FieldTemplatesTableProps) => {
  const templates = useTemplateStore((state) => state.templates);
  const deleteTemplate = useTemplateStore((state) => state.deleteTemplate);

  const columns: ColumnsType<FieldTemplateDataType> = [
    {
      title: 'Название шаблона',
      dataIndex: 'названиеШаблона',
      key: 'названиеШаблона',
    },
    {
      title: 'Лейбл',
      dataIndex: 'лейбл',
      key: 'лейбл',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тип',
      dataIndex: 'тип',
      key: 'тип',
    },
    {
      title: 'Правила валидации',
      key: 'валидация',
      render: (_, record) => {
        const hasValidation = record.валидация && Object.keys(record.валидация).length > 0;
        return hasValidation ? (
          <CheckCircleOutlined style={{ color: 'green' }} />
        ) : (
          <CloseCircleOutlined style={{ color: 'red' }} />
        );
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Редактировать">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteTemplate(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Сортировка по createdAt (новые первыми)
  const dataSource: FieldTemplateDataType[] = Object.values(templates)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((template) => ({
      ...template,
      key: template.id,
    }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={{ pageSize: 10 }}
    />
  );
};

export default FieldTemplatesTable;
