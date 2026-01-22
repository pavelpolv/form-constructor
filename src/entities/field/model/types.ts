import type { RuleGroup } from '../../rule';

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
