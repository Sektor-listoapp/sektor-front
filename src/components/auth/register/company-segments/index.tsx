import Select from "@/components/ui/select";
import { USER_TYPES } from "@/constants/shared";
import { useRegistrationStore } from "@/store/registration";
import { UserType } from "@/types/shared";

const { INSURANCE_BROKER, EXCLUSIVE_AGENT, BROKERAGE_SOCIETY, INTERMEDIARY } =
  USER_TYPES;

const companySegments = [
  {
    label: "Intermediario",
    disabled: true,
    hidden: true,
    value: INTERMEDIARY,
  },
  {
    label: "Corredor de seguros",
    value: INSURANCE_BROKER,
  },
  {
    label: "Sociedad de corretaje",
    value: BROKERAGE_SOCIETY,
  },
  {
    label: "Agente exclusivo",
    value: EXCLUSIVE_AGENT,
  },
];

const CompanySegments = () => {
  const userType = useRegistrationStore((state) => state.userType);
  const setUserType = useRegistrationStore((state) => state.setUserType);

  const handleSelectChange = (selectedUserType: UserType) => {
    if (userType === selectedUserType) {
      return;
    }
    setUserType(selectedUserType);
  };

  return (
    <div className="w-11/12 pt-10 pb-28 lg:w-full lg:pt-14 lg:pb-4">
      <header className="text-center flex flex-col items-center gap-2 mb-4 lg:gap-4 lg:mb-12">
        <h1 className="text-3xl font-normal text-balance lg:text-5xl">
          ¿Cuál es tu sector?
        </h1>
        <h2 className="text-sm font-century-gothic lg:text-xl">
          Elige entre nuestra opciones
        </h2>
      </header>

      <Select
        wrapperClassName="lg:max-w-xs lg:mx-auto"
        className="font-bold"
        options={companySegments}
        value={userType || ""}
        onChange={(e) => handleSelectChange(e.target.value as UserType)}
      />
    </div>
  );
};

export default CompanySegments;
