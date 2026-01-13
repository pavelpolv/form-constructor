import { useState } from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useFormStore from '../../../store/useFormStore';
import GroupDrawer from './GroupDrawer';
import FieldDrawer from './FieldDrawer';
import type { Group, Field } from '../../../types';

interface GroupTableProps {
  group: Group;
}

interface FieldDataType extends Field {
  key: string;
}

const GroupTable = ({ group }: GroupTableProps) => {
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const fields = useFormStore((state) => state.fields);
  const deleteGroup = useFormStore((state) => state.deleteGroup);
  const moveGroupUp = useFormStore((state) => state.moveGroupUp);
  const moveGroupDown = useFormStore((state) => state.moveGroupDown);
  const deleteField = useFormStore((state) => state.deleteField);
  const moveFieldUp = useFormStore((state) => state.moveFieldUp);
  const moveFieldDown = useFormStore((state) => state.moveFieldDown);

  const hasVisibilityRules = Object.keys(group.видимость || {}).length > 0;

  const columns: ColumnsType<FieldDataType> = [
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
      title: 'Системный лейбл',
      dataIndex: 'системныйЛейбл',
      key: 'системныйЛейбл',
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
      title: 'Зависимость',
      key: 'зависимость',
      render: (_, record) => {
        const hasDependency = record.зависимость && Object.keys(record.зависимость).length > 0;
        return hasDependency ? (
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
          <Tooltip title="Переместить вверх">
            <Button
              size="small"
              icon={<UpOutlined />}
              onClick={() => moveFieldUp(group.id, record.id)}
            />
          </Tooltip>
          <Tooltip title="Переместить вниз">
            <Button
              size="small"
              icon={<DownOutlined />}
              onClick={() => moveFieldDown(group.id, record.id)}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingFieldId(record.id);
                setFieldDrawerOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteField(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const dataSource: FieldDataType[] = group.fieldIds.map((fieldId) => ({
    ...fields[fieldId],
    key: fieldId,
  }));

  const title = () => (
    <Space>
      <Tooltip title="Переместить вверх">
        <Button
          size="small"
          icon={<UpOutlined />}
          onClick={() => moveGroupUp(group.formId, group.id)}
        />
      </Tooltip>
      <Tooltip title="Переместить вниз">
        <Button
          size="small"
          icon={<DownOutlined />}
          onClick={() => moveGroupDown(group.formId, group.id)}
        />
      </Tooltip>
      <span>
        <strong>{group.название}</strong>
        {group.системноеНазвание && ` (${group.системноеНазвание})`}
      </span>
      {hasVisibilityRules && <EyeOutlined style={{ color: 'blue' }} />}
      <Tooltip title="Удалить">
        <Button
          size="small"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteGroup(group.id)}
        />
      </Tooltip>
      <Tooltip title="Редактировать">
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={() => setGroupDrawerOpen(true)}
        />
      </Tooltip>
    </Space>
  );

  const footer = () => (
    <Button
      type="dashed"
      block
      onClick={() => {
        setEditingFieldId(null);
        setFieldDrawerOpen(true);
      }}
    >
      Добавить поле
    </Button>
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        title={title}
        footer={footer}
        pagination={false}
      />

      <GroupDrawer
        group={group}
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
      />

      <FieldDrawer
        groupId={group.id}
        fieldId={editingFieldId}
        open={fieldDrawerOpen}
        onClose={() => {
          setFieldDrawerOpen(false);
          setEditingFieldId(null);
        }}
      />
    </>
  );
};

export default GroupTable;
