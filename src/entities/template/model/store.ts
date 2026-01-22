import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FieldTemplate } from './types';

interface TemplateState {
  templates: Record<string, FieldTemplate>;
}

interface TemplateActions {
  createTemplate: (данные: Omit<FieldTemplate, 'id' | 'createdAt'>) => string;
  updateTemplate: (templateId: string, данные: Partial<Omit<FieldTemplate, 'id' | 'createdAt'>>) => void;
  deleteTemplate: (templateId: string) => void;
  setTemplates: (templates: Record<string, FieldTemplate>) => void;
}

export type TemplateStore = TemplateState & TemplateActions;

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: {},

  setTemplates: (templates) => set({ templates }),

  createTemplate: (данные) => {
    const id = uuidv4();
    const createdAt = Date.now();

    set((state) => {
      // Проверка уникальности названия
      const existingTemplate = Object.values(state.templates).find(
        (t) => t.названиеШаблона === данные.названиеШаблона
      );

      if (existingTemplate) {
        console.error(`Шаблон с названием "${данные.названиеШаблона}" уже существует`);
        return state;
      }

      return {
        templates: {
          ...state.templates,
          [id]: {
            id,
            ...данные,
            createdAt,
          },
        },
      };
    });

    return id;
  },

  updateTemplate: (templateId, данные) => set((state) => {
    // Если меняется название - проверить уникальность
    if (данные.названиеШаблона) {
      const existingTemplate = Object.values(state.templates).find(
        (t) => t.id !== templateId && t.названиеШаблона === данные.названиеШаблона
      );

      if (existingTemplate) {
        console.error(`Шаблон с названием "${данные.названиеШаблона}" уже существует`);
        return state;
      }
    }

    return {
      templates: {
        ...state.templates,
        [templateId]: {
          ...state.templates[templateId],
          ...данные,
        },
      },
    };
  }),

  deleteTemplate: (templateId) => set((state) => {
    const newTemplates = { ...state.templates };
    delete newTemplates[templateId];

    return { templates: newTemplates };
  }),
}));
