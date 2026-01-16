import type { RuleGroup } from './rules';

export type FieldType = 'input' | 'switch' | 'textarea' | 'select';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldProperties {
  // For input
  placeholder?: string;
  inputType?: 'text' | 'number' | 'email';

  // For select
  options?: SelectOption[];
  multiple?: boolean;

  // For textarea
  rows?: number;

  // For switch
  defaultValue?: boolean;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface Field {
  id: string;
  лейбл: string;
  name: string;
  системныйЛейбл: string;
  тип: FieldType;
  groupId: string;
  свойства: FieldProperties;
  валидация: FieldValidation;
  зависимость?: RuleGroup | null;
}

export interface FieldTemplate {
  id: string;
  названиеШаблона: string;
  лейбл: string;
  name: string;
  тип: FieldType;
  свойства: FieldProperties;
  валидация: FieldValidation;
  createdAt: number;
}

export interface Group {
  id: string;
  название: string;
  системноеНазвание: string;
  опубликовано: boolean;
  formId: string;
  fieldIds: string[];
  видимость?: RuleGroup | null;
}

export interface Form {
  id: string;
  название: string;
  системноеНазвание: string;
  groupIds: string[];
}

export interface FormStore {
  forms: Record<string, Form>;
  groups: Record<string, Group>;
  fields: Record<string, Field>;
  templates: Record<string, FieldTemplate>;

  // Forms actions
  createForm: (название: string, системноеНазвание: string) => string;
  updateForm: (formId: string, данные: Partial<Omit<Form, 'id' | 'groupIds'>>) => void;
  deleteForm: (formId: string) => void;

  // Groups actions
  createGroup: (
    formId: string,
    название: string,
    системноеНазвание: string,
    опубликовано: boolean
  ) => string;
  updateGroup: (groupId: string, данные: Partial<Omit<Group, 'id' | 'formId' | 'fieldIds'>>) => void;
  deleteGroup: (groupId: string) => void;
  moveGroupUp: (formId: string, groupId: string) => void;
  moveGroupDown: (formId: string, groupId: string) => void;
  copyGroup: (sourceGroupId: string, targetFormId: string) => string;

  // Fields actions
  createField: (groupId: string, данные: Omit<Field, 'id' | 'groupId'>) => string;
  updateField: (fieldId: string, данные: Partial<Omit<Field, 'id' | 'groupId'>>) => void;
  deleteField: (fieldId: string) => void;
  moveFieldUp: (groupId: string, fieldId: string) => void;
  moveFieldDown: (groupId: string, fieldId: string) => void;

  // Field Templates actions
  createTemplate: (данные: Omit<FieldTemplate, 'id' | 'createdAt'>) => string;
  updateTemplate: (templateId: string, данные: Partial<Omit<FieldTemplate, 'id' | 'createdAt'>>) => void;
  deleteTemplate: (templateId: string) => void;

  // Initialize
  initMockData: () => void;
}

export interface FieldTypeConfig {
  label: string;
  specificProps: Record<string, {
    type: string;
    label: string;
    required?: boolean;
    default?: string | number | boolean;
    options?: string[];
  }>;
}

export interface CommonFieldPropsConfig {
  [key: string]: {
    type: string;
    label: string;
    required: boolean;
  };
}

export * from './rules';
