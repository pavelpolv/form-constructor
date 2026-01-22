import { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Button,
  Space,
  Divider,
  Typography,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { useFieldStore } from '../../../entities/field';
import { useGroupStore } from '../../../entities/group';
import { useTemplateStore } from '../../../entities/template';
import { FIELD_TYPES } from '../../../shared/config';
import type { FieldType, SelectOption } from '../../../entities/field';
import type { RuleGroup } from '../../../entities/rule';
import { RuleEditor } from '../../../widgets/rule-editor';
import SelectTemplateDrawer from './SelectTemplateDrawer';

const { Title } = Typography;
const { Option } = Select;

interface FieldDrawerProps {
  groupId: string;
  fieldId: string | null;
  open: boolean;
  onClose: () => void;
}

interface FieldFormValues {
  тип: FieldType;
  лейбл: string;
  name: string;
  системныйЛейбл?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
  inputType?: 'text' | 'number' | 'email';
  options?: SelectOption[];
  multiple?: boolean;
  rows?: number;
  defaultValue?: boolean;
  зависимость?: RuleGroup | null;
}

const FieldDrawer = ({
  groupId, fieldId, open, onClose,
}: FieldDrawerProps) => {
  const [form] = Form.useForm<FieldFormValues>();
  const [selectedType, setSelectedType] = useState<FieldType>('input');
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);

  const fields = useFieldStore((state) => state.fields);
  const templates = useTemplateStore((state) => state.templates);
  const createField = useFieldStore((state) => state.createField);
  const updateField = useFieldStore((state) => state.updateField);
  const addFieldToGroup = useGroupStore((state) => state.addFieldToGroup);

  const field = fieldId ? fields[fieldId] : null;
  const isEditing = Boolean(fieldId);

  useEffect(() => {
    if (open) {
      if (field) {
        setSelectedType(field.тип);
        form.setFieldsValue({
          тип: field.тип,
          лейбл: field.лейбл,
          name: field.name,
          системныйЛейбл: field.системныйЛейбл,
          ...field.свойства,
          ...field.валидация,
          зависимость: field.зависимость || null,
        });
      } else {
        form.resetFields();
        setSelectedType('input');
      }
    }
  }, [open, field, form]);

  const handleApplyTemplate = (templateId: string) => {
    const template = templates[templateId];
    if (!template) return;

    setSelectedType(template.тип);
    form.setFieldsValue({
      тип: template.тип,
      лейбл: template.лейбл,
      name: template.name,
      ...template.свойства,
      ...template.валидация,
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const {
        тип, лейбл, name, системныйЛейбл,
        required, minLength, maxLength, pattern,
        зависимость,
        ...specificProps
      } = values;

      const fieldData = {
        тип,
        лейбл,
        name,
        системныйЛейбл: системныйЛейбл || '',
        свойства: specificProps,
        валидация: {
          ...(required !== undefined && { required }),
          ...(minLength !== undefined && { minLength }),
          ...(maxLength !== undefined && { maxLength }),
          ...(pattern && { pattern }),
        },
        зависимость: зависимость || null,
      };

      if (isEditing && fieldId) {
        updateField(fieldId, fieldData);
      } else {
        const newFieldId = createField(groupId, fieldData);
        addFieldToGroup(groupId, newFieldId);
      }

      form.resetFields();
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const renderSpecificProps = () => {
    const typeConfig = FIELD_TYPES[selectedType];
    if (!typeConfig) return null;

    return Object.entries(typeConfig.specificProps).map(([propKey, propConfig]: [string, {
      type: string;
      label: string;
      required?: boolean;
      default?: string | number | boolean;
      options?: string[];
    }]) => {
      if (propConfig.type === 'string') {
        return (
          <Form.Item
            key={propKey}
            name={propKey}
            label={propConfig.label}
            rules={[{
              required: propConfig.required,
              message: `Пожалуйста, введите ${propConfig.label}`,
            }]}
          >
            <Input placeholder={`Введите ${propConfig.label}`} />
          </Form.Item>
        );
      }

      if (propConfig.type === 'number') {
        return (
          <Form.Item
            key={propKey}
            name={propKey}
            label={propConfig.label}
            initialValue={propConfig.default}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        );
      }

      if (propConfig.type === 'boolean') {
        return (
          <Form.Item
            key={propKey}
            name={propKey}
            label={propConfig.label}
            valuePropName="checked"
            initialValue={propConfig.default}
          >
            <Switch />
          </Form.Item>
        );
      }

      if (propConfig.type === 'select' && propConfig.options) {
        return (
          <Form.Item
            key={propKey}
            name={propKey}
            label={propConfig.label}
            initialValue={propConfig.default}
          >
            <Select>
              {propConfig.options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      }

      if (propConfig.type === 'array') {
        return (
          <Form.Item key={propKey} label={propConfig.label}>
            <Form.List name={propKey}>
              {(optionFields, { add, remove }) => (
                <>
                  {optionFields.map(({ key, name: optionName, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[optionName, 'label']}
                        rules={[{ required: true, message: 'Введите label' }]}
                      >
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[optionName, 'value']}
                        rules={[{ required: true, message: 'Введите value' }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(optionName)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Добавить опцию
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        );
      }

      return null;
    });
  };

  return (
    <Drawer
      title={isEditing ? 'Редактирование поля' : 'Создание поля'}
      open={open}
      onClose={handleCancel}
      width="50%"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => setTemplateDrawerOpen(true)}
          >
            Заполнить из шаблона
          </Button>
          <Space>
            <Button onClick={handleCancel}>Отмена</Button>
            <Button type="primary" onClick={handleSubmit}>
              Сохранить
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Title level={5}>Выбор типа поля</Title>
        <Form.Item
          name="тип"
          label="Тип поля"
          rules={[{ required: true, message: 'Пожалуйста, выберите тип поля' }]}
          initialValue="input"
        >
          <Select onChange={(value) => setSelectedType(value as FieldType)}>
            {Object.entries(FIELD_TYPES).map(([key, config]) => (
              <Option key={key} value={key}>
                {config.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        <Title level={5}>Общие свойства</Title>
        <Form.Item
          name="лейбл"
          label="Лейбл"
          rules={[{ required: true, message: 'Пожалуйста, введите лейбл' }]}
        >
          <Input placeholder="Введите лейбл" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Пожалуйста, введите name' }]}
        >
          <Input placeholder="Введите name" />
        </Form.Item>

        <Form.Item name="системныйЛейбл" label="Системный лейбл">
          <Input placeholder="Введите системный лейбл" />
        </Form.Item>

        <Divider />

        <Title level={5}>Специфичные свойства</Title>
        {renderSpecificProps()}

        <Divider />

        <Title level={5}>Правила валидации</Title>
        <Form.Item name="required" label="Обязательное поле" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="minLength" label="Минимальная длина">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="maxLength" label="Максимальная длина">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="pattern" label="Паттерн (регулярное выражение)">
          <Input placeholder="Введите регулярное выражение" />
        </Form.Item>

        <Divider />

        <Title level={5}>Зависимость</Title>
        <Form.Item name="зависимость">
          <RuleEditor
            value={form.getFieldValue('зависимость')}
            onChange={(value) => form.setFieldsValue({ зависимость: value })}
          />
        </Form.Item>
      </Form>

      <SelectTemplateDrawer
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        onSelectTemplate={handleApplyTemplate}
      />
    </Drawer>
  );
};

export default FieldDrawer;
