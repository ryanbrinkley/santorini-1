import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { ReactComponent as GithubSvg } from '../../assets/svg/github.svg';
import './Wrapper.scss';

export const LobbyPage = ({
  className, children, ...props
} : HTMLAttributes<HTMLDivElement>) : JSX.Element => (
  <div className={classNames(className, 'lobby-page')} {...props}>
    <a
      className="github-link"
      href="https://github.com/mbrinkl/santorini"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GithubSvg />
    </a>
    {children}
  </div>
);
