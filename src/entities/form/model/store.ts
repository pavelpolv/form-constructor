import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Form } from './types';
import { useFieldStore } from '../../field';
import { useGroupStore } from '../../group';
import { useTemplateStore } from '../../template';
import { generateMockData } from './mockData';

interface FormState {
  forms: Record<string, Form>;
}

interface FormActions {
  createForm: (название: string, системноеНазвание: string) => string;
  updateForm: (formId: string, данные: Partial<Omit<Form, 'id' | 'groupIds'>>) => void;
  deleteForm: (formId: string) => void;
  createAndAddGroup: (formId: string, название: string, системноеНазвание: string, опубликовано: boolean) => string;
  addGroupToForm: (formId: string, groupId: string) => void;
  removeGroupFromForm: (formId: string, groupId: string) => void;
  moveGroupUp: (formId: string, groupId: string) => void;
  moveGroupDown: (formId: string, groupId: string) => void;
  initMockData: () => void;
  setForms: (forms: Record<string, Form>) => void;
}

export type FormStore = FormState & FormActions;

export const useFormStore = create<FormStore>((set, get) => ({
  forms: {},

  setForms: (forms) => set({ forms }),

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

  deleteForm: (formId) => {
    const form = get().forms[formId];
    const groupStore = useGroupStore.getState();
    const fieldStore = useFieldStore.getState();

    // Удаляем все группы и поля формы
    form.groupIds.forEach((groupId) => {
      const group = groupStore.groups[groupId];
      if (group) {
        // Удаляем все поля группы
        group.fieldIds.forEach((fieldId) => {
          fieldStore.deleteField(fieldId);
        });
        // Удаляем группу
        groupStore.deleteGroup(groupId);
      }
    });

    // Удаляем форму
    set((state) => {
      const newForms = { ...state.forms };
      delete newForms[formId];
      return { forms: newForms };
    });
  },

  createAndAddGroup: (formId, название, системноеНазвание, опубликовано) => {
    const groupStore = useGroupStore.getState();
    const groupId = groupStore.createGroup(formId, название, системноеНазвание, опубликовано);

    set((state) => ({
      forms: {
        ...state.forms,
        [formId]: {
          ...state.forms[formId],
          groupIds: [...state.forms[formId].groupIds, groupId],
        },
      },
    }));

    return groupId;
  },

  addGroupToForm: (formId, groupId) => set((state) => ({
    forms: {
      ...state.forms,
      [formId]: {
        ...state.forms[formId],
        groupIds: [...state.forms[formId].groupIds, groupId],
      },
    },
  })),

  removeGroupFromForm: (formId, groupId) => set((state) => {
    const form = state.forms[formId];
    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...form,
          groupIds: form.groupIds.filter((id) => id !== groupId),
        },
      },
    };
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

  initMockData: () => {
    const mockData = generateMockData();

    // Устанавливаем данные во все stores
    set({ forms: mockData.forms });
    useGroupStore.getState().setGroups(mockData.groups);
    useFieldStore.getState().setFields(mockData.fields);
    useTemplateStore.getState().setTemplates(mockData.templates);
  },
}));
