"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import SektorLogo from "@assets/images/sektor-blue-logo.webp";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();
  const goToHome = () => push("/");
  return (
    <div className="min-h-svh secondary-gradient w-full">
      <header className="text-blue-500 mx-auto flex justify-between items-center p-4 mb-5 w-11/12">
        <button onClick={goToHome} className="w-8">
          <FontAwesomeIcon size="xl" icon={faChevronLeft} />
        </button>
        <Image
          src={SektorLogo}
          alt="Sektor Logo"
          priority
          width={130}
          onClick={goToHome}
        />
        <button onClick={goToHome} className="w-8">
          <FontAwesomeIcon size="xl" icon={faBars} />
        </button>
      </header>

      {children}
    </div>
  );
}
