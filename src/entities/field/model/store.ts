import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Field } from './types';

interface FieldState {
  fields: Record<string, Field>;
}

interface FieldActions {
  createField: (groupId: string, данные: Omit<Field, 'id' | 'groupId'>) => string;
  updateField: (fieldId: string, данные: Partial<Omit<Field, 'id' | 'groupId'>>) => void;
  deleteField: (fieldId: string) => void;
  moveFieldUp: (groupId: string, fieldId: string) => void;
  moveFieldDown: (groupId: string, fieldId: string) => void;
  setFields: (fields: Record<string, Field>) => void;
}

export type FieldStore = FieldState & FieldActions;

export const useFieldStore = create<FieldStore>((set) => ({
  fields: {},

  setFields: (fields) => set({ fields }),

  createField: (groupId, данные) => {
    const id = uuidv4();
    set((state) => ({
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
    const newFields = { ...state.fields };
    delete newFields[fieldId];
    return { fields: newFields };
  }),

  moveFieldUp: (_groupId, _fieldId) => {
    // Эта логика будет обрабатываться в group store
  },

  moveFieldDown: (_groupId, _fieldId) => {
    // Эта логика будет обрабатываться в group store
  },
}));
