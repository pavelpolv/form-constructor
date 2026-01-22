import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Form } from '../../../entities/form';

interface FormsTableProps {
  forms: Record<string, Form>;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
}

interface FormDataType extends Form {
  key: string;
}

const FormsTable = ({ forms, onEdit, onDelete }: FormsTableProps) => {
  const columns: ColumnsType<FormDataType> = [
    {
      title: 'Название',
      dataIndex: 'название',
      key: 'название',
    },
    {
      title: 'Системное название',
      dataIndex: 'системноеНазвание',
      key: 'системноеНазвание',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Редактировать">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const dataSource: FormDataType[] = Object.values(forms).map((form) => ({
    ...form,
    key: form.id,
  }));

  return <Table columns={columns} dataSource={dataSource} />;
};

export default FormsTable;
