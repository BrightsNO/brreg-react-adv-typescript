import type { ReactNode } from "react";

type Props<T> = {
  items: T[];
  getKey: (item: T) => string;
  render: (item: T) => ReactNode;
  className?: string;
};

// Én komponent for alle slags lister.
// T utledes fra items, så getKey og render får riktig type automatisk.
export function List<T>({ items, getKey, render, className }: Props<T>) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={getKey(item)}>{render(item)}</li>
      ))}
    </ul>
  );
}
