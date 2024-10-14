import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <hr className={styles.horizontalLine} />
      <div className={styles.linkContainer}>
        <Link href="/about" className={styles.linkItem}>
          关于我们
        </Link>
        <Link href="/contact" className={styles.linkItem}>
          联系我们
        </Link>
        <Link href="/privacy-policy" className={styles.linkItem}>
          隐私政策
        </Link>
      </div>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} IT and TEA. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
