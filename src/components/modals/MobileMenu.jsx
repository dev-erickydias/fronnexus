'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function MobileMenu({ isOpen, onClose, navItems }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    function onEscape(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className="fixed top-[68px] right-4 sm:right-7 z-40 p-2 rounded-2xl min-w-[220px]"
      style={{
        background: 'rgba(10, 14, 20, 0.92)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        border: '1px solid var(--border-soft)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.5), 0 0 32px rgba(94,234,212,0.06)',
      }}
    >
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="block py-2.5 px-4 text-sm font-medium rounded-xl transition-colors"
                style={{
                  color: item.isCta ? 'var(--teal-500)' : 'var(--mist-100)',
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
