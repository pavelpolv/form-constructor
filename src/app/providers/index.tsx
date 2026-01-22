import { useEffect, type ReactNode } from 'react';
import { useFormStore } from '../../entities/form';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const initMockData = useFormStore((state) => state.initMockData);

  useEffect(() => {
    initMockData();
  }, [initMockData]);

  return <>{children}</>;
};
