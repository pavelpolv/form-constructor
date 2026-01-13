import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FormStore, Form, Field, Group } from '../types';
import { generateMockData } from './mockData';

const useFormStore = create<FormStore>((set) => ({
  forms: {},
  groups: {},
  fields: {},

  // Forms actions
  createForm: (название, системноеНазвание) => {
    const id = uuidv4();
    set((state) => ({
      forms: {
        ...state.forms,
        [id]: {
          id,
          название,
          системноеНазвание,
          groupIds: [],
        },
      },
    }));
    return id;
  },

  updateForm: (formId, данные) => set((state) => ({
    forms: {
      ...state.forms,
      [formId]: {
        ...state.forms[formId],
        ...данные,
      },
    },
  })),

  deleteForm: (formId) => set((state) => {
    const form = state.forms[formId];
    const newForms = { ...state.forms };
    const newGroups = { ...state.groups };
    const newFields = { ...state.fields };

    delete newForms[formId];

    form.groupIds.forEach((groupId) => {
      const group = state.groups[groupId];
      if (group) {
        group.fieldIds.forEach((fieldId) => {
          delete newFields[fieldId];
        });
        delete newGroups[groupId];
      }
    });

    return { forms: newForms, groups: newGroups, fields: newFields };
  }),

  // Groups actions
  createGroup: (formId, название, системноеНазвание, опубликовано) => {
    const id = uuidv4();
    set((state) => ({
      forms: {
        ...state.forms,
        [formId]: {
          ...state.forms[formId],
          groupIds: [...state.forms[formId].groupIds, id],
        },
      },
      groups: {
        ...state.groups,
        [id]: {
          id,
          название,
          системноеНазвание,
          опубликовано,
          formId,
          fieldIds: [],
          видимость: null,
        },
      },
    }));
    return id;
  },

  updateGroup: (groupId, данные) => set((state) => ({
    groups: {
      ...state.groups,
      [groupId]: {
        ...state.groups[groupId],
        ...данные,
      },
    },
  })),

  deleteGroup: (groupId) => set((state) => {
    const group = state.groups[groupId];
    const newGroups = { ...state.groups };
    const newFields = { ...state.fields };
    const newForms = { ...state.forms };

    delete newGroups[groupId];

    group.fieldIds.forEach((fieldId) => {
      delete newFields[fieldId];
    });

    const form = newForms[group.formId];
    newForms[group.formId] = {
      ...form,
      groupIds: form.groupIds.filter((id) => id !== groupId),
    };

    return { forms: newForms, groups: newGroups, fields: newFields };
  }),

  moveGroupUp: (formId, groupId) => set((state) => {
    const form = state.forms[formId];
    const index = form.groupIds.indexOf(groupId);
    if (index <= 0) return state;

    const newGroupIds = [...form.groupIds];
    [newGroupIds[index - 1], newGroupIds[index]] = [newGroupIds[index], newGroupIds[index - 1]];

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...form,
          groupIds: newGroupIds,
        },
      },
    };
  }),

  moveGroupDown: (formId, groupId) => set((state) => {
    const form = state.forms[formId];
    const index = form.groupIds.indexOf(groupId);
    if (index === -1 || index >= form.groupIds.length - 1) return state;

    const newGroupIds = [...form.groupIds];
    [newGroupIds[index], newGroupIds[index + 1]] = [newGroupIds[index + 1], newGroupIds[index]];

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...form,
          groupIds: newGroupIds,
        },
      },
    };
  }),

  copyGroup: (sourceGroupId, targetFormId) => {
    const newGroupId = uuidv4();
    const timestamp = Date.now();

    set((state) => {
      const sourceGroup = state.groups[sourceGroupId];

      if (!sourceGroup) {
        console.error(`Группа с ID ${sourceGroupId} не найдена`);
        return state;
      }

      // Копируем все поля с новыми UUID
      const newFieldIds: string[] = [];
      const newFields: Record<string, Field> = { ...state.fields };

      sourceGroup.fieldIds.forEach((oldFieldId) => {
        const sourceField = state.fields[oldFieldId];
        if (sourceField) {
          const newFieldId = uuidv4();
          newFieldIds.push(newFieldId);

          newFields[newFieldId] = {
            ...sourceField,
            id: newFieldId,
            groupId: newGroupId,
          };
        }
      });

      // Создаем новую группу с timestamp в системном названии
      const newGroup: Group = {
        ...sourceGroup,
        id: newGroupId,
        системноеНазвание: `${sourceGroup.системноеНазвание}_${timestamp}`,
        formId: targetFormId,
        fieldIds: newFieldIds,
      };

      return {
        forms: {
          ...state.forms,
          [targetFormId]: {
            ...state.forms[targetFormId],
            groupIds: [...state.forms[targetFormId].groupIds, newGroupId],
          },
        },
        groups: {
          ...state.groups,
          [newGroupId]: newGroup,
        },
        fields: newFields,
      };
    });

    return newGroupId;
  },

  // Fields actions
  createField: (groupId, данные) => {
    const id = uuidv4();
    set((state) => ({
      groups: {
        ...state.groups,
        [groupId]: {
          ...state.groups[groupId],
          fieldIds: [...state.groups[groupId].fieldIds, id],
        },
      },
      fields: {
        ...state.fields,
        [id]: {
          id,
          groupId,
          ...данные,
        } as Field,
      },
    }));
    return id;
  },

  updateField: (fieldId, данные) => set((state) => ({
    fields: {
      ...state.fields,
      [fieldId]: {
        ...state.fields[fieldId],
        ...данные,
      },
    },
  })),

  deleteField: (fieldId) => set((state) => {
    const field = state.fields[fieldId];
    const newFields = { ...state.fields };
    const newGroups = { ...state.groups };

    delete newFields[fieldId];

    const group = newGroups[field.groupId];
    newGroups[field.groupId] = {
      ...group,
      fieldIds: group.fieldIds.filter((id) => id !== fieldId),
    };

    return { fields: newFields, groups: newGroups };
  }),

  moveFieldUp: (groupId, fieldId) => set((state) => {
    const group = state.groups[groupId];
    const index = group.fieldIds.indexOf(fieldId);
    if (index <= 0) return state;

    const newFieldIds = [...group.fieldIds];
    [newFieldIds[index - 1], newFieldIds[index]] = [newFieldIds[index], newFieldIds[index - 1]];

    return {
      groups: {
        ...state.groups,
        [groupId]: {
          ...group,
          fieldIds: newFieldIds,
        },
      },
    };
  }),

  moveFieldDown: (groupId, fieldId) => set((state) => {
    const group = state.groups[groupId];
    const index = group.fieldIds.indexOf(fieldId);
    if (index === -1 || index >= group.fieldIds.length - 1) return state;

    const newFieldIds = [...group.fieldIds];
    [newFieldIds[index], newFieldIds[index + 1]] = [newFieldIds[index + 1], newFieldIds[index]];

    return {
      groups: {
        ...state.groups,
        [groupId]: {
          ...group,
          fieldIds: newFieldIds,
        },
      },
    };
  }),

  // Инициализация моковыми данными
  initMockData: () => set(generateMockData()),
}));

export default useFormStore;
