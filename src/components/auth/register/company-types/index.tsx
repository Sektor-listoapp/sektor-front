import { REGISTRATION_COMPANY_OPTIONS } from "@/constants/register/company-options";
import { useRegistrationStore } from "@/store/registration";
import Image from "next/image";
import { cn } from "@/utils/class-name";

const CompanyTypes = () => {
  const userType = useRegistrationStore((state) => state.userType);
  const setUserType = useRegistrationStore((state) => state.setUserType);
  const setInsuranceCompanySubtype = useRegistrationStore(
    (state) => state.setInsuranceCompanySubtype
  );

  const handleSelect = (
    selectedUserType: (typeof REGISTRATION_COMPANY_OPTIONS)[number]["userType"],
    insuranceCompanySubtype?: (typeof REGISTRATION_COMPANY_OPTIONS)[number]["insuranceCompanySubtype"]
  ) => {
    const isSameSelection = userType === selectedUserType;

    setUserType(isSameSelection ? null : selectedUserType);
    setInsuranceCompanySubtype(
      isSameSelection ? null : insuranceCompanySubtype ?? null
    );
  };

  return (
    <>
      <header className="text-center w-full flex flex-col items-center gap-4 mt-4 mb-6 lg:pt-6">
        <h1 className="text-2xl font-normal lg:text-5xl text-balance">
          Únete a nuestra comunidad aseguradora
        </h1>
        <h2 className="text-sm font-century-gothic lg:text-xl text-balance">
          Selecciona el tipo de compañía con la que te registrarás
        </h2>
      </header>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mx-auto px-1">
        {REGISTRATION_COMPANY_OPTIONS.map((option) => {
          const isSelected = userType === option.userType;

          return (
            <button
              key={option.userType}
              type="button"
              className="flex flex-col items-center gap-2 sm:gap-3"
              onClick={() =>
                handleSelect(
                  option.userType,
                  "insuranceCompanySubtype" in option
                    ? option.insuranceCompanySubtype
                    : undefined
                )
              }
            >
              <div
                className={cn(
                  "border-2 rounded-2xl flex items-center justify-center transition-all size-20 sm:size-24 lg:size-28 bg-white",
                  isSelected
                    ? "border-blue-500 scale-105"
                    : "border-gray-300"
                )}
              >
                <Image
                  src={option.imagePath}
                  alt={option.label}
                  width={56}
                  height={56}
                  className="object-contain w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                />
              </div>
              <span className="font-bold font-arial-rounded text-[10px] sm:text-xs lg:text-sm text-center text-balance leading-tight px-1">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CompanyTypes;
