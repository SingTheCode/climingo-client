import { useState, useEffect, useRef } from 'react';

interface ValidationRule {
  (value: string): true | string;
}

interface UseInputTextProps {
  initialValue?: string;
  rules?: ValidationRule[];
  serverValidation?: {
    isValid: boolean;
    text: string;
  };
  onValidChange?: (isValid: boolean) => void;
}

export const useInputText = ({
  initialValue = '',
  rules,
  serverValidation,
  onValidChange,
}: UseInputTextProps = {}) => {
  const [value, setValue] = useState(initialValue);
  const [validationText, setValidationText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showValidation, setShowValidation] = useState(false);

  const onValidAction = useRef(false);

  useEffect(() => {
    if ((!serverValidation || serverValidation.isValid) && value.length === 0) {
      onValidAction.current = false;
      setShowValidation(false);
      return;
    }
    onValidAction.current = true;
    setShowValidation(true);

    if (!rules) {
      setIsValid(true);
      setValidationText('');
      return;
    }

    const invalidRule = rules.find((rule) => typeof rule(value) === 'string');
    if (!invalidRule) {
      setIsValid(true);
      setValidationText('');
      return;
    }
    
    setIsValid(false);
    setValidationText(invalidRule(value) as string);
  }, [value, rules, serverValidation]);

  useEffect(() => {
    if (!serverValidation) {
      return;
    }

    if (!serverValidation.isValid) {
      onValidAction.current = true;
      setShowValidation(true);
      setIsValid(false);
      setValidationText(serverValidation.text);
    }
  }, [serverValidation]);

  useEffect(() => {
    if (onValidChange) {
      onValidChange((onValidAction.current && isValid) || !!serverValidation?.isValid);
    }
  }, [value, isValid, serverValidation?.isValid, onValidChange]);

  const reset = () => {
    setValue('');
    setValidationText('');
    setIsValid(true);
    setShowValidation(false);
    onValidAction.current = false;
  };

  return {
    value,
    setValue,
    validationText,
    isValid,
    showValidation,
    reset,
  };
};
