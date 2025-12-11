import React, { useState } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries/public/country-by-code";
import { Query } from "@/lib/sektor-api/__generated__/graphql";
import Select from "@/components/ui/select";


interface LocationModalProps {
    open: boolean;
    setOpenLocationModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LocationModal = ({ open, setOpenLocationModal }: LocationModalProps) => {
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");


  const {query, replace } = useRouter();

  const { data: countryData, loading: isLoadingCountryData } = useQuery<Query>(
    COUNTRY_BY_CODE_QUERY,
    {
      variables: { code: "VE" }, 
    }
  );
  


  const countryStates = countryData?.getCountryByCode?.states || [];

  const stateOptions = [
    { label: "Estado", value: "", disabled: true },
    ...countryStates
      .map((state) => ({
        label: state?.name || "",
        value: state?.id || "",
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];


  const selectedState = countryStates.find((s) => s.id === Number(selectedStateId));
  const cityOptions = selectedState?.cities
    ? [
      { label: "Ciudad", value: "", disabled: true },
      ...selectedState.cities
        .map((city) => ({
          label: city?.name || "",
          value: city?.id || "",
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ]
    : [];




    const {
        state = selectedStateId,
        city = selectedCityId,
      } = query;


      const handleContinue = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type: _, ...cleanedQuery } = query || {};
      
        replace(
          {
            pathname: "/organizations",
            query: query,      
          },
          undefined,
          {
            scroll: false,
          }
        );
      
        setOpenLocationModal(false);
      };
      

  const handleFilterChange = (key: string, value: string) => {
    replace({ query: { ...query, [key]: value } }, undefined, {
      scroll: false,
    });
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={true}
      className="!w-11/12 md:!w-3/4 lg:!w-11/12 !max-w-[843px] rounded-[30px]"
      centered
      onCancel={() => setOpenLocationModal(false)}
      closeIcon={
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-blue-500"
          size="2xl"
        />
      }
    >
      <div className="px-4 py-6 ">
        <div className="mb-12">
          <h1 className="text-[#182F48] text-3xl font-arial-rounded font-normal">
            Dinos tu ubicación
          </h1>
          <h3 className="font-century-gothic font-normal text-lg">
            Esto nos ayuda a darte la información que necesitas
          </h3>
        </div>
        <div className="flex flex-col gap-4 mx-16">
        <Select
              wrapperClassName="w-full"
              value={state}
              disabled={isLoadingCountryData}
              options={stateOptions}
              onChange={(e) => {
                const stateId = e.target.value;
                setSelectedStateId(stateId);
                setSelectedCityId("");
                handleFilterChange("state", stateId);
              }}
            />

            {selectedStateId && (
              <Select
                wrapperClassName="w-full"
                value={city}
                disabled={isLoadingCountryData || !selectedState}
                options={cityOptions}
                onChange={(e) => {
                  const cityId = e.target.value;
                  setSelectedCityId(cityId);
                  handleFilterChange("city", cityId);
                }}
              />
            )}

          <div className="flex justify-center mt-8">
            <button
              className="bg-[#182F48] text-white hover:bg-[#101F34] disabled:bg-[#9AA7B8] font-arial-rounded px-20 py-3 text-xl rounded-[60px] transition-all"
              onClick={handleContinue}
              disabled={!selectedStateId || !selectedCityId}
            >
              Seguir
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;
