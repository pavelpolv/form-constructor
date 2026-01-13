import { Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import type { RuleGroup } from '../../types';
import RuleGroupEditor from './RuleGroupEditor';

interface RuleEditorProps {
  value?: RuleGroup | null;
  onChange: (value: RuleGroup | null) => void;
  label?: string;
}

const RuleEditor = ({ value, onChange, label }: RuleEditorProps) => {
  const handleAddRules = () => {
    const newRuleGroup: RuleGroup = {
      id: uuidv4(),
      логика: 'OR',
      группы: [],
      правила: [],
    };
    onChange(newRuleGroup);
  };

  const handleRemoveAllRules = () => {
    onChange(null);
  };

  const handleChange = (updatedGroup: RuleGroup) => {
    onChange(updatedGroup);
  };

  if (!value) {
    return (
      <Button type="dashed" onClick={handleAddRules} icon={<PlusOutlined />}>
        {label || 'Добавить правила'}
      </Button>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <RuleGroupEditor group={value} onChange={handleChange} />
      <Button type="dashed" danger onClick={handleRemoveAllRules} icon={<DeleteOutlined />}>
        Удалить все правила
      </Button>
    </Space>
  );
};

export default RuleEditor;
