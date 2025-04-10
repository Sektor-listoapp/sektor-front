import React from "react";
import { AUTO_QUOTE_BY_ID } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { AutoQuoteType, Query } from "@/lib/sektor-api/__generated__/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/ui/button";
import {
  faCar,
  faLocationDot,
  faPerson,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  AUTO_COVERAGE_OPTIONS,
  AUTO_USAGE_TYPE_OPTIONS,
} from "@/components/quotes/auto-quote-form/constants";

const AutoQuoteDetails = () => {
  const router = useRouter();
  const quoteQuery = router?.query?.quote as string;
  const quoteId = quoteQuery?.split("-")?.[1] || "";

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<Query>(AUTO_QUOTE_BY_ID, {
    variables: { id: quoteId },
    fetchPolicy: "no-cache",
  });

  const quoteData = data?.autoQuoteById as AutoQuoteType;

  const {
    city,
    customer,
    comments = "",
    make = "",
    model = "",
    usageType = "",
    coverage = "",
    version = "",
    year = "",
  } = quoteData || {};

  const { name = "", email = "", phone = "" } = customer || {};

  const contactData = [
    {
      id: `${quoteId}-customer-name`,
      icon: faPerson,
      value: name || "No especificado",
    },
    {
      id: `${quoteId}-customer-email`,
      icon: faUser,
      value: email || "No especificado",
    },
    {
      id: `${quoteId}-customer-address`,
      icon: faLocationDot,
      value: city?.name || "No especificada",
    },
    {
      id: `${quoteId}-customer-phone`,
      icon: faPhone,
      value: phone || "No especificado",
    },
  ];

  const autoCoverageLabel = AUTO_COVERAGE_OPTIONS?.find(
    (option) => option?.value === coverage
  )?.label;

  const autoUsageTypeLabel = AUTO_USAGE_TYPE_OPTIONS?.find(
    (option) => option?.value === usageType
  )?.label;

  const handleModalClose = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { quote: _, ...query } = router?.query || {};
    router.replace({ pathname: router.pathname, query }, undefined, {
      scroll: false,
    });
  };

  if (error) {
    toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
    handleModalClose();
  }

  if (isLoading) {
    return (
      <div className="my-60 flex items-center justify-center text-blue-500">
        <SektorFullHorizontalLogo className="w-11/12 max-w-40 animate-pulse" />
      </div>
    );
  }

  return (
    <section className="w-full p-5 pb-10 lg:pb-16 flex flex-col items-center justify-center gap-5 lg:gap-10 text-blue-500 lg:px-10">
      <header className="w-full text-center py-5">
        <h3 className="text-3xl font-bold text-blue-500 font-arial-rounded">
          ¡Cotización solicitada por {name}!
        </h3>
      </header>

      <section className="w-full flex flex-col items-center justify-center gap-10">
        <div className="w-full flex flex-col items-center justify-center gap-5 ">
          <h3 className="w-full text-lg font-bold font-arial-rounded">Auto</h3>
          <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2 !cursor-default hover:!cursor-default">
            <div className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl">
              <FontAwesomeIcon
                icon={faCar}
                className="text-blue-500 text-2xl"
              />
              <span className="truncate">
                {autoUsageTypeLabel?.length ? (
                  autoUsageTypeLabel
                ) : (
                  <span className="text-gray-500">No especificado</span>
                )}
              </span>
            </div>
            <div className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl">
              <FontAwesomeIcon
                icon={faCar}
                className="text-blue-500 text-2xl"
              />
              <span className="truncate">
                {autoCoverageLabel?.length ? (
                  autoCoverageLabel
                ) : (
                  <span className="text-gray-500">No especificado</span>
                )}
              </span>
            </div>

            <div className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl">
              <FontAwesomeIcon
                icon={faCar}
                className="text-blue-500 text-2xl"
              />
              <span className="truncate">
                {make ? (
                  make
                ) : (
                  <span className="text-gray-500">No especificado</span>
                )}
              </span>
            </div>
            <div className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl">
              <FontAwesomeIcon
                icon={faCar}
                className="text-blue-500 text-2xl"
              />
              <span className="truncate">
                {model ? (
                  model
                ) : (
                  <span className="text-gray-500">No especificado</span>
                )}
              </span>
            </div>

            <div className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl">
              <FontAwesomeIcon
                icon={faCar}
                className="text-blue-500 text-2xl"
              />
              <span className="truncate">
                {version ? (
                  version
                ) : (
                  <span className="text-gray-500">No especificado</span>
                )}
              </span>
            </div>

            <div className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl">
              <FontAwesomeIcon
                icon={faCar}
                className="text-blue-500 text-2xl"
              />
              <span className="truncate">
                {year ? (
                  year
                ) : (
                  <span className="text-gray-500">No especificado</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {Boolean(comments?.trim()?.length) && (
          <div className="w-full font-century-gothic bg-gray-300 p-6 rounded-xl whitespace-pre-line">
            {comments}
          </div>
        )}

        <div className="w-full flex flex-col items-center justify-center gap-5 ">
          <h3 className="w-full text-lg font-bold font-arial-rounded">
            Datos de contacto
          </h3>
          <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2">
            {contactData.map(({ icon, id, value }, index) => {
              return (
                <div
                  key={`${id}-${index}`}
                  className="w-full flex justify-start items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl"
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className="text-blue-500 text-2xl"
                  />
                  <span className="truncate">
                    {value?.length ? (
                      value
                    ) : (
                      <span className="text-gray-500">No especificado</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="w-full flex justify-center items-center">
          <Button
            className="px-10"
            variant="solid-blue"
            onClick={handleModalClose}
          >
            Cerrar
          </Button>
        </footer>
      </section>
    </section>
  );
};

export default AutoQuoteDetails;
