import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught in boundary:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError, {
      signal: controller.signal,
    });
    return () => controller.abort();
  }, []);

  if (hasError) {
    return null; // or a fallback UI
  }

  return <Html>{children}</Html>;
};

export default ErrorBoundary;
