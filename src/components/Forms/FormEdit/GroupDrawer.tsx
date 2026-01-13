import { useEffect } from 'react';
import { Drawer, Form, Input, Switch, Button, Space, Divider, Typography } from 'antd';
import useFormStore from '../../../store/useFormStore';
import type { Group, RuleGroup } from '../../../types';
import { RuleEditor } from '../../Rules';

const { Title } = Typography;

interface GroupDrawerProps {
  group: Group;
  open: boolean;
  onClose: () => void;
}

interface GroupFormValues {
  название: string;
  системноеНазвание?: string;
  опубликовано: boolean;
  видимость?: RuleGroup | null;
}

const GroupDrawer = ({ group, open, onClose }: GroupDrawerProps) => {
  const [form] = Form.useForm<GroupFormValues>();
  const updateGroup = useFormStore((state) => state.updateGroup);

  useEffect(() => {
    if (open && group) {
      form.setFieldsValue({
        название: group.название,
        системноеНазвание: group.системноеНазвание,
        опубликовано: group.опубликовано,
        видимость: group.видимость || null,
      });
    }
  }, [open, group, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateGroup(group.id, {
        название: values.название,
        системноеНазвание: values.системноеНазвание,
        опубликовано: values.опубликовано,
        видимость: values.видимость || null,
      });
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Редактирование группы"
      open={open}
      onClose={handleCancel}
      width="50%"
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button type="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="название"
          label="Название"
          rules={[{ required: true, message: 'Пожалуйста, введите название' }]}
        >
          <Input placeholder="Введите название группы" />
        </Form.Item>

        <Form.Item name="системноеНазвание" label="Системное название">
          <Input placeholder="Введите системное название" />
        </Form.Item>

        <Form.Item name="опубликовано" label="Опубликовано" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Divider />

        <Title level={5}>Видимость</Title>
        <Form.Item name="видимость">
          <RuleEditor
            value={form.getFieldValue('видимость')}
            onChange={(value) => form.setFieldsValue({ видимость: value })}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GroupDrawer;
