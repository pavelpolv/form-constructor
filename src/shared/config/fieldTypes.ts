import type { CommonFieldPropsConfig, FieldTypeConfig, FieldType } from '../../entities/field/model/types';

export const COMMON_FIELD_PROPS: CommonFieldPropsConfig = {
  лейбл: {
    type: 'string',
    label: 'Лейбл',
    required: true,
  },
  name: {
    type: 'string',
    label: 'Name',
    required: true,
  },
  системныйЛейбл: {
    type: 'string',
    label: 'Системный лейбл',
    required: false,
  },
};

export const FIELD_TYPES: Record<FieldType, FieldTypeConfig> = {
  input: {
    label: 'Input',
    specificProps: {
      placeholder: {
        type: 'string',
        label: 'Placeholder',
        required: false,
      },
      inputType: {
        type: 'select',
        label: 'Тип',
        options: ['text', 'number', 'email'],
        default: 'text',
      },
    },
  },

  switch: {
    label: 'Switch',
    specificProps: {
      defaultValue: {
        type: 'boolean',
        label: 'Значение по умолчанию',
        default: false,
      },
    },
  },

  textarea: {
    label: 'Textarea',
    specificProps: {
      placeholder: {
        type: 'string',
        label: 'Placeholder',
        required: false,
      },
      rows: {
        type: 'number',
        label: 'Количество строк',
        default: 4,
      },
    },
  },

  select: {
    label: 'Select',
    specificProps: {
      options: {
        type: 'array',
        label: 'Опции',
        required: true,
      },
      multiple: {
        type: 'boolean',
        label: 'Множественный выбор',
        default: false,
      },
    },
  },
};
