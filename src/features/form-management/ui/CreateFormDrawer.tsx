import { Drawer, Form, Input, Button, Space } from 'antd';

interface CreateFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (название: string, системноеНазвание: string) => void;
}

interface FormValues {
  название: string;
  системноеНазвание?: string;
}

const CreateFormDrawer = ({ open, onClose, onCreate }: CreateFormDrawerProps) => {
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onCreate(values.название, values.системноеНазвание || '');
      form.resetFields();
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Создание формы"
      open={open}
      onClose={handleCancel}
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
          <Input placeholder="Введите название формы" />
        </Form.Item>
        <Form.Item name="системноеНазвание" label="Системное название">
          <Input placeholder="Введите системное название" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateFormDrawer;
