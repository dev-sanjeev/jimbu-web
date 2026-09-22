import React, { forwardRef } from 'react';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySm'
  | 'label'
  | 'caption';

type HtmlTag = 'p' | 'h1' | 'h2' | 'h3' | 'span';

const VARIANT_TAG: Record<TextVariant, HtmlTag> = {
  display: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  bodySm: 'p',
  label: 'span',
  caption: 'span',
};

const VARIANT_CLASS: Record<TextVariant, string> = {
  display: 'text-display font-bold',
  h1: 'text-h1 font-bold',
  h2: 'text-h2 font-semibold',
  h3: 'text-h3 font-semibold',
  body: 'text-body font-normal',
  bodySm: 'text-body-sm font-normal',
  label: 'text-label font-medium',
  caption: 'text-caption font-medium',
};

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant, className, children, onPress, onClick, ...rest },
  ref,
) {
  const Tag = variant ? VARIANT_TAG[variant] : ('span' as HtmlTag);
  const variantCls = variant ? VARIANT_CLASS[variant] : '';
  const cls = [variantCls, className].filter(Boolean).join(' ');

  return React.createElement(Tag, {
    ...rest,
    ref,
    className: cls || undefined,
    'data-text-variant': variant,
    onClick: onPress ?? onClick,
    style: {
      margin: 0,
      padding: 0,
      ...(rest.style as React.CSSProperties | undefined),
    },
  }, children);
});
