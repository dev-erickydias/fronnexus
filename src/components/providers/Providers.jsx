'use client';
import { I18nProvider } from '../../i18n/I18nContext';
import LenisProvider from './LenisProvider';

export default function Providers({ children }) {
  return (
    <I18nProvider>
      <LenisProvider>{children}</LenisProvider>
    </I18nProvider>
  );
}
