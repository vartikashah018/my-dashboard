// RuleEditor.tsx
import { Box, TextField, IconButton, MenuItem, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

const OPERATORS = ['<', '<=', '=', '>=', '>'];

export type ThresholdRule = {
  operator: string;
  value: number;
  color: string;
};

type RuleEditorProps = {
  rules: ThresholdRule[];
  setRules: (rules: ThresholdRule[]) => void;
};

const RuleEditor = ({ rules, setRules }: RuleEditorProps) => {
  const handleAddRule = () => {
    setRules([...rules, { operator: '<', value: 0, color: '#ff0000' }]);
  };

  const handleUpdateRule = (index: number, updatedRule: Partial<ThresholdRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updatedRule };
    setRules(newRules);
  };

  const handleDeleteRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  return (
    <Box>
      {rules.map((rule, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
          <input
            type="color"
            value={rule.color}
            onChange={(e) => handleUpdateRule(index, { color: e.target.value })}
            style={{ width: 36, height: 36, border: 'none', background: 'transparent' }}
          />
          <TextField
            select
            value={rule.operator}
            onChange={(e) => handleUpdateRule(index, { operator: e.target.value })}
            size="small"
            sx={{ width: 80 }}
          >
            {OPERATORS.map(op => (
              <MenuItem key={op} value={op}>{op}</MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            value={rule.value}
            onChange={(e) => handleUpdateRule(index, { value: parseFloat(e.target.value) })}
            size="small"
            sx={{ width: 80 }}
          />
          <IconButton size="small" onClick={() => handleDeleteRule(index)}>
            <DeleteIcon sx={{ color: '#f87171' }} />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={handleAddRule} variant="outlined" size="small">
        Add Rule
      </Button>
    </Box>
  );
};

export default RuleEditor;
