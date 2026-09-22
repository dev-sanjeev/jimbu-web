import { ReactNode } from 'react';

interface IAuthCard {
  children: ReactNode;
}

export const AuthCard = ({ children }: IAuthCard) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-5 shadow-auth">
      {children}
    </div>
  );
};
