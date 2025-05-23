import Navbar from "@/components/ui/navbar";
import TextInput from "@/components/ui/text-input";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const HeroBanner = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    if (Boolean(search)) {
      router.push({
        pathname: "/organizations",
        query: { search },
      });
    }
  };

  return (
    <header className="bg-blue-500 primary-gradient min-h-fit rounded-b-3xl px-7 w-full py-8 border-white sm:gap-8 sm:pb-12 xl:pb-28">
      <div className="max-w-screen-xl w-full flex flex-col items-start justify-start gap-5 xl:items-center md:gap-20 xl:gap-28 mx-auto">
        <Navbar />
        <div className="w-[80%] text-start flex flex-col items-start justify-start gap-2 lg:w-[70%] md:gap-6 xl:mr-auto 2xl:w-3/4 xl:gap-10">
          <h1 className="text-2xl text-balance md:text-4xl lg:text-7xl lg:w-11/12 2xl:text-[85px] 2xl:w-full">
            Encuentra al corredor de seguros ideal para ti
          </h1>
          <h2 className="text-base font-century-gothic text-pretty md:text-xl">
            <b className="lg:text-3xl">Seguro aquí lo encuentras </b>, compara y
            elige entre los mejores de nuestra red
          </h2>
        </div>
        <form onSubmit={handleSearch} className="w-full">
          <TextInput
            iconPosition="end"
            icon={faMagnifyingGlass}
            iconProps={{ className: "opacity-40" }}
            wrapperClassName="md:max-w-2xl xl:max-w-5xl relative mx-auto"
            className="rounded-3xl border-opacity-50 w-full md:text-lg"
            placeholder="Busca aquí el seguro de tu preferencia"
            name="search"
            defaultValue=""
          />
        </form>
      </div>
    </header>
  );
};

export default HeroBanner;
