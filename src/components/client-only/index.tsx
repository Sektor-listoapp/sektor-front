import { useEffect, useState, Fragment } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

// Based on https://www.apollographql.com/blog/next-js-getting-started

const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export default ClientOnly;
