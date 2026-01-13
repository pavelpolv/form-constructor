import { RuleOperator } from '../types';

export const RULE_OPERATORS = {
  [RuleOperator.EQUALS]: {
    label: '=== (равно)',
    symbol: '===',
    requiresValue: true,
  },
  [RuleOperator.NOT_EQUALS]: {
    label: '!== (не равно)',
    symbol: '!==',
    requiresValue: true,
  },
  [RuleOperator.GREATER_THAN]: {
    label: '> (больше)',
    symbol: '>',
    requiresValue: true,
  },
  [RuleOperator.GREATER_THAN_OR_EQUAL]: {
    label: '>= (больше или равно)',
    symbol: '>=',
    requiresValue: true,
  },
  [RuleOperator.LESS_THAN]: {
    label: '< (меньше)',
    symbol: '<',
    requiresValue: true,
  },
  [RuleOperator.LESS_THAN_OR_EQUAL]: {
    label: '<= (меньше или равно)',
    symbol: '<=',
    requiresValue: true,
  },
  [RuleOperator.IS_EMPTY]: {
    label: '∅ (пустое)',
    symbol: '∅',
    requiresValue: false,
  },
  [RuleOperator.IS_NOT_EMPTY]: {
    label: '!∅ (не пустое)',
    symbol: '!∅',
    requiresValue: false,
  },
};

export const operatorRequiresValue = (operator: RuleOperator): boolean => {
  return RULE_OPERATORS[operator]?.requiresValue ?? false;
};
