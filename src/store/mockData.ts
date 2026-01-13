import { v4 as uuidv4 } from 'uuid';
import type { Form, Group, Field } from '../types';

interface MockData {
  forms: Record<string, Form>;
  groups: Record<string, Group>;
  fields: Record<string, Field>;
}

export const generateMockData = (): MockData => {
  const form1Id = uuidv4();
  const form2Id = uuidv4();

  const group1Id = uuidv4();
  const group2Id = uuidv4();
  const group3Id = uuidv4();

  const field1Id = uuidv4();
  const field2Id = uuidv4();
  const field3Id = uuidv4();
  const field4Id = uuidv4();
  const field5Id = uuidv4();
  const field6Id = uuidv4();
  const field7Id = uuidv4();

  return {
    forms: {
      [form1Id]: {
        id: form1Id,
        название: 'Регистрационная форма',
        системноеНазвание: 'registration_form',
        groupIds: [group1Id, group2Id],
      },
      [form2Id]: {
        id: form2Id,
        название: 'Форма обратной связи',
        системноеНазвание: 'feedback_form',
        groupIds: [group3Id],
      },
    },

    groups: {
      [group1Id]: {
        id: group1Id,
        название: 'Основная информация',
        системноеНазвание: 'main_info',
        опубликовано: true,
        formId: form1Id,
        fieldIds: [field1Id, field2Id, field3Id],
        видимость: null,
      },
      [group2Id]: {
        id: group2Id,
        название: 'Дополнительные настройки',
        системноеНазвание: 'additional_settings',
        опубликовано: false,
        formId: form1Id,
        fieldIds: [field4Id, field5Id],
        видимость: null,
      },
      [group3Id]: {
        id: group3Id,
        название: 'Контактная информация',
        системноеНазвание: 'contact_info',
        опубликовано: true,
        formId: form2Id,
        fieldIds: [field6Id, field7Id],
        видимость: null,
      },
    },

    fields: {
      [field1Id]: {
        id: field1Id,
        лейбл: 'Имя пользователя',
        name: 'username',
        системныйЛейбл: 'user_name',
        тип: 'input',
        groupId: group1Id,
        свойства: {
          placeholder: 'Введите имя',
          inputType: 'text',
        },
        валидация: {
          required: true,
          minLength: 3,
          maxLength: 50,
        },
        зависимость: null,
      },
      [field2Id]: {
        id: field2Id,
        лейбл: 'Email',
        name: 'email',
        системныйЛейбл: 'user_email',
        тип: 'input',
        groupId: group1Id,
        свойства: {
          placeholder: 'example@mail.com',
          inputType: 'email',
        },
        валидация: {
          required: true,
          pattern: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
        },
        зависимость: null,
      },
      [field3Id]: {
        id: field3Id,
        лейбл: 'Страна',
        name: 'country',
        системныйЛейбл: 'user_country',
        тип: 'select',
        groupId: group1Id,
        свойства: {
          options: [
            { label: 'Россия', value: 'ru' },
            { label: 'США', value: 'us' },
            { label: 'Германия', value: 'de' },
          ],
          multiple: false,
        },
        валидация: {
          required: true,
        },
        зависимость: null,
      },
      [field4Id]: {
        id: field4Id,
        лейбл: 'Получать уведомления',
        name: 'notifications',
        системныйЛейбл: 'enable_notifications',
        тип: 'switch',
        groupId: group2Id,
        свойства: {
          defaultValue: true,
        },
        валидация: {},
        зависимость: null,
      },
      [field5Id]: {
        id: field5Id,
        лейбл: 'О себе',
        name: 'bio',
        системныйЛейбл: 'user_bio',
        тип: 'textarea',
        groupId: group2Id,
        свойства: {
          placeholder: 'Расскажите о себе',
          rows: 4,
        },
        валидация: {
          maxLength: 500,
        },
        зависимость: null,
      },
      [field6Id]: {
        id: field6Id,
        лейбл: 'Телефон',
        name: 'phone',
        системныйЛейбл: 'contact_phone',
        тип: 'input',
        groupId: group3Id,
        свойства: {
          placeholder: '+7 (999) 123-45-67',
          inputType: 'text',
        },
        валидация: {
          required: true,
          pattern: '^\\+?[1-9]\\d{1,14}$',
        },
        зависимость: null,
      },
      [field7Id]: {
        id: field7Id,
        лейбл: 'Тип обращения',
        name: 'request_type',
        системныйЛейбл: 'request_type',
        тип: 'select',
        groupId: group3Id,
        свойства: {
          options: [
            { label: 'Вопрос', value: 'question' },
            { label: 'Жалоба', value: 'complaint' },
            { label: 'Предложение', value: 'suggestion' },
          ],
          multiple: false,
        },
        валидация: {
          required: true,
        },
        зависимость: null,
      },
    },
  };
};
