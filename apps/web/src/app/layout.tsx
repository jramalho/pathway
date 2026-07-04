import type { Metadata, Viewport } from 'next';
import { Inter, Epilogue } from 'next/font/google';
import * as stylex from '@stylexjs/stylex';
import { tokens } from '../styles/tokens.stylex';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const epilogue = Epilogue({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['700', '800'],
});

export const metadata: Metadata = {
  applicationName: 'Pathway',
  title: {
    default: 'Pathway',
    template: '%s | Pathway',
  },
  description:
    'Short, structured learning paths for mobile engineers, product builders, and modern technical teams.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${epilogue.variable}`}
      {...stylex.props(styles.html)}
    >
      <body {...stylex.props(styles.body)}>{children}</body>
    </html>
  );
}

const styles = stylex.create({
  html: {
    colorScheme: 'light',
  },
  body: {
    margin: 0,
    minHeight: '100vh',
    backgroundColor: tokens.surfacePage,
    color: tokens.textPrimary,
    fontFamily: tokens.fontFamilyBody,
  },
});
