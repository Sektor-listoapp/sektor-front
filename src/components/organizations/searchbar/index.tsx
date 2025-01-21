import React, { useEffect } from "react";
import { cn } from "@/utils/class-name";
import { ORGANIZATION_TYPE_OPTIONS } from "./constants";
import OrganizationTypeButton from "./organization-type-button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/components/ui/text-input";
import { useRouter } from "next/router";
import { useIsClient } from "@uidotdev/usehooks";
import OrganizationFilters from "./filters";

interface SearchbarProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const Searchbar = ({ className, ...props }: SearchbarProps) => {
  const { replace, query, isReady } = useRouter();
  const hasQueries = Object.keys(query).length > 0;
  const isClient = useIsClient();

  useEffect(() => {
    if (isReady && hasQueries) {
      console.log("Trigger search", query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (query?.type) {
      console.log("Trigger search by org type change", query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.type]);

  const handleSearch = () => {
    console.log("Trigger search by inputs change", query);
  };

  return (
    <section
      className={cn(
        "w-full flex flex-col-reverse items-center justify-between gap-8 max-w-md mb-2 mx-auto md:flex-row md:max-w-full md:mb-4",
        className
      )}
      {...props}
    >
      <div className="flex gap-4 w-fit">
        {ORGANIZATION_TYPE_OPTIONS.map((option) => {
          return (
            <OrganizationTypeButton
              data={option}
              key={`organization-type-button-${option.id}`}
            />
          );
        })}
      </div>

      <div className="w-full flex items-center justify-between gap-4 lg:gap-8">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <TextInput
            iconPosition="end"
            icon={faMagnifyingGlass}
            iconProps={{ className: "opacity-40" }}
            wrapperClassName="w-full relative"
            className="rounded-3xl border-opacity-50 md:text-lg shadow-xl placeholder:text-gray-400"
            placeholder="Busca intermediario, seguros o ramos"
            value={(query?.search as string) || ""}
            onChange={(e) =>
              replace({ query: { ...query, search: e?.target?.value } })
            }
          />
        </form>
        {isClient && <OrganizationFilters />}
      </div>
    </section>
  );
};

export default Searchbar;
