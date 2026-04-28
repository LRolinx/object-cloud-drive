import { Input } from 'antd';
import { memo } from 'react';

import { VerificationCodeInputProps } from './type';

type Props = VerificationCodeInputProps & {
  onChange?: (value: string) => void;
};

export const VerificationCodeInput = memo((props: Props) => {
  return (
    <Input
      value={props.value}
      maxLength={props.maxLength}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange?.(event.target.value)}
    />
  );
});
