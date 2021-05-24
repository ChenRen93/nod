import { css, cx } from "@emotion/css";
import styled from "@emotion/styled";
import React, { ChangeEvent, FunctionComponent } from "react";

const base = css`
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid #848484;
`;

const InputStyle = styled.div`
  .valid {
    border-color: #22b43a;
  }

  .invalid {
    border-color: #ed7c7c;
  }
`;
interface ButtonProp {
  className?: string;
  custom?: string;
  placeHolder?: string;
  onChange: (value: any) => void;
  value?: string;
}

export const TextInput: FunctionComponent<ButtonProp> = ({
  className,
  custom,
  placeHolder,
  onChange,
  value,
}) => {
  const _onChange: (event: ChangeEvent<HTMLInputElement>) => void = ({
    target: { value },
  }) => {
    return onChange(value === "" ? "" : value);
  };

  return (
    <InputStyle>
      <input
        className={`${css(base, custom)} ${className} `}
        placeholder={placeHolder}
        onChange={_onChange}
        value={value}
      />
    </InputStyle>
  );
};
