import classNames from 'classnames';
import { InputHTMLAttributes } from 'react';
import style from './style.module.scss';

export const Input = ({
  type = 'text',
  className,
  ...props
} : InputHTMLAttributes<HTMLInputElement>) : JSX.Element => (
  <input
    className={classNames(style.input, className)}
    type={type}
    {...props}
  />
);
