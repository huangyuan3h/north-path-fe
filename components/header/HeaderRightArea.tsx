'use client';

import { useEffect, useState } from 'react';
import { List, PlusSquare } from 'react-bootstrap-icons';

import styles from './header.module.scss';
import clsx from 'clsx';
import { useWindowWidth } from '@/utils/hooks/useWindowWidth';
import { breakpoints } from '@/utils/breakpoint';
import { Avatar } from '../avatar';
import Link from 'next/link';
import { routes } from '@/config/routes';
import dynamic from 'next/dynamic';

const MenuPanel = dynamic(
  () => import('../navigation/MenuPanel').then((mod) => mod.MenuPanel),
  {
    ssr: false,
  }
);

export interface IconListProps {
  onMenuClick: () => void;
}

const IconList: React.FC<IconListProps> = ({ onMenuClick }) => {
  return (
    <div className={clsx(styles.IconArea)}>
      <List className={clsx(styles.MenuIcon)} onClick={onMenuClick} />
    </div>
  );
};

export interface HeaderRightAreaProps {
  v2Header?: boolean;
}

export const HeaderRightArea: React.FC<HeaderRightAreaProps> = ({
  v2Header,
}) => {
  const [showMenuPanel, setMenuPanel] = useState(false);
  const windowWidth = useWindowWidth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onMenuClick = () => {
    setMenuPanel(true);
  };

  const handleMenuClose = () => {
    setMenuPanel(false);
  };

  if (!v2Header || windowWidth < breakpoints.md || !loaded) {
    return (
      <>
        <IconList onMenuClick={onMenuClick} />
        <MenuPanel showPanel={showMenuPanel} onMenuClose={handleMenuClose} />
      </>
    );
  }

  return (
    <div className="flex gap-x-6">
      <Link className={clsx(styles.rightTopButton)} href={routes.createPost}>
        <PlusSquare className={clsx(styles.rightTopIcon)} />
        <div className={clsx(styles.rightTopText)}>发帖</div>
      </Link>
      <Avatar />
    </div>
  );
};
