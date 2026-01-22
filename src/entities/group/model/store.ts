import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Group } from './types';

interface GroupState {
  groups: Record<string, Group>;
}

interface GroupActions {
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
  addFieldToGroup: (groupId: string, fieldId: string) => void;
  removeFieldFromGroup: (groupId: string, fieldId: string) => void;
  moveFieldUp: (groupId: string, fieldId: string) => void;
  moveFieldDown: (groupId: string, fieldId: string) => void;
  setGroups: (groups: Record<string, Group>) => void;
}

export type GroupStore = GroupState & GroupActions;

export const useGroupStore = create<GroupStore>((set) => ({
  groups: {},

  setGroups: (groups) => set({ groups }),

  createGroup: (formId, название, системноеНазвание, опубликовано) => {
    const id = uuidv4();
    set((state) => ({
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
    const newGroups = { ...state.groups };
    delete newGroups[groupId];
    return { groups: newGroups };
  }),

  moveGroupUp: (_formId, _groupId) => {
    // Эта логика будет обрабатываться в form store
  },

  moveGroupDown: (_formId, _groupId) => {
    // Эта логика будет обрабатываться в form store
  },

  copyGroup: (sourceGroupId, targetFormId) => {
    const newGroupId = uuidv4();
    const timestamp = Date.now();

    set((state) => {
      const sourceGroup = state.groups[sourceGroupId];

      if (!sourceGroup) {
        console.error(`Группа с ID ${sourceGroupId} не найдена`);
        return state;
      }

      // Создаем новую группу с timestamp в системном названии
      const newGroup: Group = {
        ...sourceGroup,
        id: newGroupId,
        системноеНазвание: `${sourceGroup.системноеНазвание}_${timestamp}`,
        formId: targetFormId,
        fieldIds: [], // Поля будут добавлены отдельно
      };

      return {
        groups: {
          ...state.groups,
          [newGroupId]: newGroup,
        },
      };
    });

    return newGroupId;
  },

  addFieldToGroup: (groupId, fieldId) => set((state) => ({
    groups: {
      ...state.groups,
      [groupId]: {
        ...state.groups[groupId],
        fieldIds: [...state.groups[groupId].fieldIds, fieldId],
      },
    },
  })),

  removeFieldFromGroup: (groupId, fieldId) => set((state) => {
    const group = state.groups[groupId];
    return {
      groups: {
        ...state.groups,
        [groupId]: {
          ...group,
          fieldIds: group.fieldIds.filter((id) => id !== fieldId),
        },
      },
    };
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
}));
