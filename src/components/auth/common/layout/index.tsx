import { useEffect, useState } from "react";
import Header from "../header";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/router";
import FullScreenLoader from "@/components/ui/full-screen-loader";
import { ROUTES } from "@/constants/router";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isLoading, setIsLoading] = useState(true);
  const { replace, isReady } = useRouter();
  const isAuthenticated = useAuthStore((state) => state.getIsAuthenticated)();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      replace(ROUTES.HOME);
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, isReady, replace]);

  return (
    <div className="min-h-svh secondary-gradient w-full flex flex-col justify-between items-start gap-8 lg:block lg:relative lg:overflow-hidden">
      <FullScreenLoader className={isLoading ? "opacity-100" : "opacity-0"} />
      <Header />
      <div className="hidden lg:block absolute bg-blue-500 right-[50%] inset-y-0 -top-[20%] w-[125vw] h-[125vw] rounded-full xl:right-2/4 xl:-top-[25%] 2xl:w-[100vw] 2xl:h-[100vw] 2xl:-top-[50%] " />

      {children}
    </div>
  );
};

export default AuthLayout;
