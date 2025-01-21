import React, { useState } from "react";
import Button from "@/components/ui/button";
import { faArrowLeft, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer } from "antd";
import Range from "@/components/ui/range";
import Select from "@/components/ui/select";
import { useRouter } from "next/router";
import {
  SELECT_GENRE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  SELECT_LOCATION_OPTIONS,
  SELECT_SUPPLIER_SERVICE_OPTIONS,
} from "@/constants/forms";
import { USER_TYPES } from "@/constants/auth";
import useDevice from "@/hooks/use-device";

const {
  SUPPLIER,
  EXCLUSIVE_AGENT,
  INSURANCE_BROKER,
  BROKERAGE_SOCIETY,
  INSURANCE_COMPANY,
} = USER_TYPES;

const OrganizationFilters = () => {
  const { query, replace } = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleShowDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);
  const isMobile = useDevice().isMobile;

  const {
    type = "",
    genre = "",
    segment = "",
    location = "",
    supplierType = "",
    minAge = 25,
    maxAge = 50,
    minExperience = 0,
    maxExperience = 50,
  } = query;

  const ageRange = [Number(minAge), Number(maxAge)];
  const experienceRange = [Number(minExperience), Number(maxExperience)];

  const handleFilterChange = (key: string, value: string) => {
    replace({ query: { ...query, [key]: value } });
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

            {(
              [
                EXCLUSIVE_AGENT,
                INSURANCE_BROKER,
                BROKERAGE_SOCIETY,
                INSURANCE_COMPANY,
              ] as string[]
            ).includes(type as string) && (
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

            {([EXCLUSIVE_AGENT, INSURANCE_BROKER] as string[]).includes(
              type as string
            ) && (
              <Select
                wrapperClassName="w-full"
                value={genre || ""}
                options={SELECT_GENRE_OPTIONS}
                onChange={(e) => handleFilterChange("genre", e?.target?.value)}
                defaultValue={SELECT_GENRE_OPTIONS[0].value}
              />
            )}

            {([SUPPLIER] as string[]).includes(type as string) && (
              <Select
                wrapperClassName="w-full"
                options={SELECT_SUPPLIER_SERVICE_OPTIONS}
                value={supplierType || ""}
                onChange={(e) =>
                  handleFilterChange("supplierType", e?.target?.value)
                }
                defaultValue={SELECT_SUPPLIER_SERVICE_OPTIONS[0].value}
              />
            )}

            {(
              [
                EXCLUSIVE_AGENT,
                INSURANCE_BROKER,
                BROKERAGE_SOCIETY,
                INSURANCE_COMPANY,
              ] as string[]
            ).includes(type as string) && (
              <Range
                label="Experiencia"
                min={0}
                max={50}
                value={
                  minExperience && maxExperience ? experienceRange : undefined
                }
                onChange={(value) => {
                  const [min, max] = value;
                  handleFilterChange("minExperience", min.toString());
                  handleFilterChange("maxExperience", max.toString());
                }}
                minRangeLabel={`${experienceRange[0]} ${
                  experienceRange[0] === 1 ? "año" : "años"
                }`}
                maxRangeLabel={`${experienceRange[1]} años`}
              />
            )}

            {([EXCLUSIVE_AGENT, INSURANCE_BROKER] as string[]).includes(
              type as string
            ) && (
              <Range
                label="Edad"
                max={70}
                defaultValue={ageRange}
                value={minAge && maxAge ? ageRange : undefined}
                minRangeLabel={`${ageRange[0]} años`}
                maxRangeLabel={`${ageRange[1]} años`}
                onChange={(value) => {
                  const [min, max] = value;
                  handleFilterChange("minAge", min.toString());
                  handleFilterChange("maxAge", max.toString());
                }}
              />
            )}

            <Button variant="solid-blue" className="w-full">
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
