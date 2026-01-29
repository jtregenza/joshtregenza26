'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from './style/nav.module.css'
import Ticker from "./Ticker";

interface NavProps {
  cmsMessages: readonly string[];
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Portfolio' },
  { href: '/voice', label: 'Voice Acting' },
  { href: '/lab', label: 'Lab' },
  { href: '/musings', label: 'Musings' },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav({ cmsMessages }: NavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Find current page label
  const currentPage = navItems.find(item => {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        {navItems.map(item => (
          <Link 
            key={item.href} 
            href={item.href}
            className={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? styles.active : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className={styles.mobileNav}>
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.currentPage}>{currentPage?.label || 'Menu'}</span>
          <span className={`${styles.menuIcon} ${isMenuOpen ? styles.menuIconOpen : ''}`}>
            ▼
          </span>
        </button>

        <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          {navItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href}
              className={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <Ticker cmsMessages={cmsMessages}/>
    </header>
  );
}