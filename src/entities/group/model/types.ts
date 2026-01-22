import type { RuleGroup } from '../../rule';

export interface Group {
  id: string;
  название: string;
  системноеНазвание: string;
  опубликовано: boolean;
  formId: string;
  fieldIds: string[];
  видимость?: RuleGroup | null;
}
