import type { FieldType, FieldProperties, FieldValidation } from '../../field';

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
