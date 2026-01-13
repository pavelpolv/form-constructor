export enum RuleOperator {
  EQUALS = 'EQUALS',           // ===
  NOT_EQUALS = 'NOT_EQUALS',   // !==
  GREATER_THAN = 'GREATER_THAN',             // >
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL', // >=
  LESS_THAN = 'LESS_THAN',                   // <
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL', // <=
  IS_EMPTY = 'IS_EMPTY',       // ∅
  IS_NOT_EMPTY = 'IS_NOT_EMPTY' // !∅
}

export type LogicOperator = 'AND' | 'OR';

export interface Rule {
  id: string;
  поле: string;
  оператор: RuleOperator;
  значение?: string | number;
}

export interface RuleGroup {
  id: string;
  логика: LogicOperator;
  группы: RuleGroup[];
  правила: Rule[];
}
