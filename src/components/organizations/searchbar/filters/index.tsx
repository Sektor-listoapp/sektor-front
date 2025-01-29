import React, { useState } from "react";
import { Drawer } from "antd";
import { useRouter } from "next/router";
import Range from "@/components/ui/range";
import useDevice from "@/hooks/use-device";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { checkAllowedFilter, getRangeQueries } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePublicOrganizations from "@/hooks/use-public-organizations";
import { faArrowLeft, faFilter } from "@fortawesome/free-solid-svg-icons";
import {
  SELECT_GENRE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  SELECT_LOCATION_OPTIONS,
  SELECT_SUPPLIER_SERVICE_OPTIONS,
} from "@/constants/forms";
import {
  ALLOWED_FILTERS_BY_USER_TYPE,
  ORGANIZATION_FILTER_FIELD_NAMES,
} from "./constants";

const { AGE_RANGE, EXPERIENCE_RANGE, GENRE, SEGMENT, SERVICE_TYPE } =
  ORGANIZATION_FILTER_FIELD_NAMES;

const OrganizationFilters = () => {
  const { isMobile } = useDevice();
  const { query, replace } = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleCloseDrawer = () => setOpenDrawer(false);

  const { handleGetPublicOrganizations, isLoadingPublicOrganizations } =
    usePublicOrganizations({});

  const {
    type,
    genre = "",
    segment = "",
    location = "",
    serviceType = "",
    minAge = 0,
    maxAge = 50,
    minExperience = 0,
    maxExperience = 50,
  } = query;

  const organizationType = type as keyof typeof ALLOWED_FILTERS_BY_USER_TYPE;
  const [ageRange, setAgeRange] = useState([Number(minAge), Number(maxAge)]);
  const [experienceRange, setExperienceRange] = useState([
    Number(minExperience),
    Number(maxExperience),
  ]);

  const handleFilterChange = (key: string, value: string) => {
    replace({ query: { ...query, [key]: value } }, undefined, {
      scroll: false,
    });
  };

  const handleShowDrawer = () => {
    const rangeQueries = getRangeQueries({
      ageRange,
      experienceRange,
      organizationType,
    });

    setOpenDrawer(true);

    replace({ query: { ...query, ...rangeQueries } }, undefined, {
      scroll: false,
    });
  };

  return (
    <>
      <Drawer
        title={null}
        onClose={handleCloseDrawer}
        open={openDrawer}
        closeIcon={null}
        width={isMobile ? 280 : 480}
        rootStyle={{ color: "#182F48" }}
        className="w-10"
        footer={null}
      >
        <section className="text-blue-500 flex flex-col gap-10 items-center justify-center font-arial-rounded md:px-5">
          <header className="w-full border-b border-blue-200 relative text-center px-4 pb-2">
            <Button
              variant="base"
              className=" p-0 shadow-none absolute -left-4 top-0"
              onClick={handleCloseDrawer}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h3 className="text-sm">
              Haz tu búsqueda mas fácil, utiliza nuestros filtros
            </h3>
          </header>

          <section className="w-full flex flex-col gap-6 items-center justify-center">
            <Select
              wrapperClassName="w-full"
              value={location || ""}
              options={SELECT_LOCATION_OPTIONS}
              onChange={(e) => handleFilterChange("location", e?.target?.value)}
              defaultValue={SELECT_LOCATION_OPTIONS[0].value}
            />

            {checkAllowedFilter(organizationType, SEGMENT) && (
              <Select
                wrapperClassName="w-full"
                value={segment || ""}
                options={SELECT_LINE_OF_BUSINESS_OPTIONS}
                onChange={(e) =>
                  handleFilterChange("segment", e?.target?.value)
                }
                defaultValue={SELECT_LINE_OF_BUSINESS_OPTIONS[0].value}
              />
            )}

            {checkAllowedFilter(organizationType, GENRE) && (
              <Select
                wrapperClassName="w-full"
                value={genre || ""}
                options={SELECT_GENRE_OPTIONS}
                onChange={(e) => handleFilterChange("genre", e?.target?.value)}
                defaultValue={SELECT_GENRE_OPTIONS[0].value}
              />
            )}

            {checkAllowedFilter(organizationType, SERVICE_TYPE) && (
              <Select
                wrapperClassName="w-full"
                options={SELECT_SUPPLIER_SERVICE_OPTIONS}
                value={serviceType || ""}
                onChange={(e) =>
                  handleFilterChange("serviceType", e?.target?.value)
                }
                defaultValue={SELECT_SUPPLIER_SERVICE_OPTIONS[0].value}
              />
            )}

            {checkAllowedFilter(organizationType, EXPERIENCE_RANGE) && (
              <Range
                label="Experiencia"
                min={0}
                max={50}
                value={experienceRange}
                minRangeLabel={`${experienceRange[0]} años`}
                maxRangeLabel={`${experienceRange[1]} años`}
                onChange={(value) => {
                  const [minExperience, maxExperience] = value;
                  setExperienceRange(value);
                  replace(
                    { query: { ...query, minExperience, maxExperience } },
                    undefined,
                    { scroll: false }
                  );
                }}
              />
            )}

            {checkAllowedFilter(organizationType, AGE_RANGE) && (
              <Range
                label="Edad"
                max={70}
                value={ageRange}
                minRangeLabel={`${ageRange[0]} años`}
                maxRangeLabel={`${ageRange[1]} años`}
                onChange={(value) => {
                  const [minAge, maxAge] = value;
                  setAgeRange(value);
                  replace({ query: { ...query, minAge, maxAge } }, undefined, {
                    scroll: false,
                  });
                }}
              />
            )}

            <Button
              variant="solid-blue"
              className="w-full"
              disabled={isLoadingPublicOrganizations}
              onClick={handleGetPublicOrganizations}
            >
              Aplicar filtros
            </Button>
          </section>
        </section>
      </Drawer>

      <Button
        variant="solid-blue"
        className="p-2 rounded-full"
        onClick={handleShowDrawer}
      >
        <FontAwesomeIcon icon={faFilter} size="xl" />
      </Button>
    </>
  );
};

export default OrganizationFilters;
