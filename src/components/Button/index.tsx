import classNames from 'classnames';
import React, { ButtonHTMLAttributes, ImgHTMLAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import style from './style.module.scss';

interface ButtonProps {
  theme?: 'red' | 'yellow' | 'blue' | 'green';
  size?: 'small' | 'medium';
}

export const Button = React.forwardRef<
HTMLButtonElement, ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(({
  className, theme = 'blue', size = 'medium', ...props
}, ref) => (
  <button
    ref={ref}
    type="button"
    className={classNames(
      style.button,
      style[`button--${theme}`],
      style[`button--size-${size}`],
      className,
    )}
    {...props}
  />
));
Button.displayName = 'Button';

export const ButtonLink = ({
  className,
  theme = 'blue',
  size = 'medium',
  ...props
}: ButtonProps & LinkProps) : JSX.Element => (
  <Link
    className={classNames(
      style.button,
      style[`button--${theme}`],
      style[`button--size-${size}`],
      className,
    )}
    {...props}
  />
);

export const ImageButton = ({
  className,
  theme = 'blue',
  size = 'medium',
  src,
  alt,
  ...props
} : ButtonProps &
ButtonHTMLAttributes<HTMLButtonElement> &
ImgHTMLAttributes<HTMLImageElement>) : JSX.Element => (
  <button
    type="button"
    className={classNames(
      style.button,
      style[`button--${theme}`],
      style[`button--size-${size}`],
      className,
    )}
    {...props}
  >
    <img style={{ position: 'relative', width: 25, height: 25 }} src={src} alt={alt} />
  </button>
);
ImageButton.displayName = 'ImageButton';
