import { Button, Input, Radio, Select, Space, Typography, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import type { RuleGroup, Rule, RuleOperator, LogicOperator } from '../../../entities/rule';
import { RULE_OPERATORS, operatorRequiresValue } from '../../../shared/config';

const { Text } = Typography;

interface RuleGroupEditorProps {
  group: RuleGroup;
  onChange: (group: RuleGroup) => void;
  onRemove?: () => void;
  level?: number;
  maxLevel?: number;
}

const RuleGroupEditor = ({
  group,
  onChange,
  onRemove,
  level = 0,
  maxLevel = 3,
}: RuleGroupEditorProps) => {
  const handleLogicChange = (логика: LogicOperator) => {
    onChange({ ...group, логика });
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: uuidv4(),
      поле: '',
      оператор: '' as RuleOperator,
      значение: undefined,
    };
    onChange({ ...group, правила: [...group.правила, newRule] });
  };

  const handleUpdateRule = (index: number, updatedRule: Partial<Rule>) => {
    const newRules = [...group.правила];
    newRules[index] = { ...newRules[index], ...updatedRule };
    onChange({ ...group, правила: newRules });
  };

  const handleRemoveRule = (index: number) => {
    const newRules = group.правила.filter((_, i) => i !== index);
    onChange({ ...group, правила: newRules });
  };

  const handleAddGroup = () => {
    const newGroup: RuleGroup = {
      id: uuidv4(),
      логика: 'OR',
      группы: [],
      правила: [],
    };
    onChange({ ...group, группы: [...group.группы, newGroup] });
  };

  const handleUpdateGroup = (index: number, updatedGroup: RuleGroup) => {
    const newGroups = [...group.группы];
    newGroups[index] = updatedGroup;
    onChange({ ...group, группы: newGroups });
  };

  const handleRemoveGroup = (index: number) => {
    const newGroups = group.группы.filter((_, i) => i !== index);
    onChange({ ...group, группы: newGroups });
  };

  const canAddNestedGroup = level < maxLevel;

  // Цвета фона для разных уровней вложенности
  const backgroundColors = ['#ffffff', '#f9f9f9', '#f0f0f0', '#e8e8e8'];
  const backgroundColor = backgroundColors[level] || backgroundColors[backgroundColors.length - 1];

  // Заголовок карточки
  const cardTitle = (
    <Space>
      <Text strong>Логика группы:</Text>
      <Radio.Group value={group.логика} onChange={(e) => handleLogicChange(e.target.value)}>
        <Radio.Button value="AND">AND (И)</Radio.Button>
        <Radio.Button value="OR">OR (ИЛИ)</Radio.Button>
      </Radio.Group>
    </Space>
  );

  // Кнопка удаления группы (для вложенных групп)
  const cardExtra = onRemove ? (
    <Button type="text" danger onClick={onRemove} icon={<MinusCircleOutlined />} size="small">
      Удалить группу
    </Button>
  ) : undefined;

  return (
    <Card
      title={cardTitle}
      extra={cardExtra}
      bordered
      size={level > 0 ? 'small' : 'default'}
      style={{
        marginBottom: 16,
        backgroundColor,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Список правил */}
        {group.правила.map((rule, index) => (
          <Space key={rule.id} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Input
              placeholder="Зависимое поле (name)"
              value={rule.поле}
              onChange={(e) => handleUpdateRule(index, { поле: e.target.value })}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Тип правила"
              value={rule.оператор || undefined}
              onChange={(value) => handleUpdateRule(index, { оператор: value })}
              style={{ width: 200 }}
            >
              {Object.entries(RULE_OPERATORS).map(([key, config]) => (
                <Select.Option key={key} value={key}>
                  {config.label}
                </Select.Option>
              ))}
            </Select>
            {rule.оператор && operatorRequiresValue(rule.оператор) && (
              <Input
                placeholder="Значение"
                value={rule.значение}
                onChange={(e) => handleUpdateRule(index, { значение: e.target.value })}
                style={{ width: 200 }}
              />
            )}
            <MinusCircleOutlined
              style={{ color: '#ff4d4f', cursor: 'pointer' }}
              onClick={() => handleRemoveRule(index)}
            />
          </Space>
        ))}

        {/* Кнопка добавления правила */}
        <Button type="dashed" onClick={handleAddRule} icon={<PlusOutlined />} style={{ width: '100%' }}>
          Добавить правило
        </Button>

        {/* Вложенные группы (рекурсия) */}
        {group.группы.map((nestedGroup, index) => (
          <RuleGroupEditor
            key={nestedGroup.id}
            group={nestedGroup}
            onChange={(updatedGroup) => handleUpdateGroup(index, updatedGroup)}
            onRemove={() => handleRemoveGroup(index)}
            level={level + 1}
            maxLevel={maxLevel}
          />
        ))}

        {/* Кнопка добавления вложенной группы */}
        {canAddNestedGroup && (
          <Button
            type="dashed"
            onClick={handleAddGroup}
            icon={<PlusOutlined />}
            style={{ width: '100%' }}
          >
            Добавить вложенную группу
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default RuleGroupEditor;
