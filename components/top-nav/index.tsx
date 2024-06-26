'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuConfig } from '../navigation/menuConfig';
import styles from './TopNav.module.scss';
import { useWindowWidth } from '@/utils/hooks/useWindowWidth';
import { breakpoints } from '@/utils/breakpoint';
import clsx from 'clsx';

const TopNav: React.FC = () => {
  const pathname = usePathname();
  const windowWidth = useWindowWidth();

  const [display, setdisplay] = useState(false);

  useEffect(() => {
    setdisplay(windowWidth > breakpoints.md);
  }, [windowWidth]);

  if (display) {
    return <></>;
  }

  const topNavMenu = menuConfig.filter((item) => item.showOnTopNav);

  return (
    <nav className={styles.topNav}>
      <ul>
        {topNavMenu.map((item) => (
          <li key={item.key} className={styles.liItem}>
            <Link
              href={item.url}
              className={clsx(
                styles.link,
                pathname === item.url ? styles.active : ''
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TopNav;
