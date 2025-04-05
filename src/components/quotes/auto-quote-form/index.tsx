import React, { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { Mutation } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { useQuoteStore } from "@/store/quotes";
import { ROUTES } from "@/constants/router";
import { Input } from "antd";
import { REQUEST_AUTO_QUOTE } from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import Select from "@/components/ui/select";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/components/ui/text-input";
import { AUTO_COVERAGE_OPTIONS, AUTO_USAGE_TYPE_OPTIONS } from "./constants";

const { TextArea } = Input;

const AutoQuoteForm = () => {
  const router = useRouter();
  const organizationQuery = (router?.query?.organization || "") as string;
  const organizationId = organizationQuery.split("-")[1];
  const resetQuoteStore = useQuoteStore((state) => state?.resetQuoteStore);
  const quoteRequestCustomer = useQuoteStore(
    (state) => state?.request?.customer
  );

  const [input, setInput] = useState({
    make: "",
    year: "",
    model: "",
    version: "",
    comments: "",
    coverage: "",
    usageType: "",
  });

  const [requestQuote, { loading }] = useMutation<Mutation>(REQUEST_AUTO_QUOTE);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      name = "",
      phone = "",
      location = 0,
      email = "",
    } = quoteRequestCustomer || {};
    const { comments, usageType, coverage, make, model, version, year } = input;

    requestQuote({
      variables: {
        input: {
          make,
          model,
          version,
          coverage,
          comments,
          usageType,
          organizationId,
          year: Number(year),
          cityId: Number(location),
          customer: { name, phone, email },
        },
      },
    })
      .then(() => {
        toast.success("Cotización solicitada con éxito");
        router.replace({
          pathname: `${ROUTES.ORGANIZATIONS}`,
          query: { details: organizationQuery },
        });
        resetQuoteStore();
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      });
  };

  return (
    <form
      spellCheck="false"
      autoComplete="off"
      onSubmit={handleFormSubmit}
      className="w-full flex flex-col items-center gap-5"
    >
      <div className="w-11/12 flex flex-col md:grid grid-cols-1 gap-5 md:grid-cols-2">
        <h2 className="text-xl col-span-2">Auto</h2>
        <Select
          name="usageType"
          wrapperClassName="w-full"
          icon={faCar}
          value={input.usageType}
          options={AUTO_USAGE_TYPE_OPTIONS}
          disabled={loading}
          required
          onChange={(e) =>
            setInput((prev) => ({ ...prev, usageType: e.target.value }))
          }
        />
        <Select
          name="coverage"
          wrapperClassName="w-full"
          icon={faCar}
          value={input.coverage}
          options={AUTO_COVERAGE_OPTIONS}
          disabled={loading}
          required
          onChange={(e) =>
            setInput((prev) => ({ ...prev, coverage: e.target.value }))
          }
        />
        <TextInput
          name="make"
          icon={faCar}
          required
          placeholder="Marca"
          onChange={(e) =>
            setInput((prev) => ({ ...prev, make: e.target.value }))
          }
          value={input.make}
        />
        <TextInput
          name="model"
          icon={faCar}
          required
          placeholder="Modelo"
          onChange={(e) =>
            setInput((prev) => ({ ...prev, model: e.target.value }))
          }
          value={input.model}
        />
        <TextInput
          name="version"
          required
          icon={faCar}
          placeholder="Versión"
          onChange={(e) =>
            setInput((prev) => ({ ...prev, version: e.target.value }))
          }
          value={input.version}
        />
        <TextInput
          name="year"
          required
          type="number"
          icon={faCar}
          placeholder="Año"
          onChange={(e) =>
            setInput((prev) => ({ ...prev, year: e.target.value }))
          }
          value={input.year}
        />
      </div>

      <TextArea
        className="w-11/12 max-w-xl rounded-3xl bg-gray-200"
        placeholder="Comentanos otros servicios que deseas cotizar..."
        allowClear
        disabled={loading}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, comments: e.target.value }))
        }
        styles={{
          textarea: {
            minHeight: "100px",
            padding: "1rem",
            fontFamily: "Century Gothic",
          },
        }}
      />

      <Button
        variant="solid-blue"
        className="w-full max-w-xs"
        type="submit"
        disabled={loading}
        loading={loading}
      >
        Solicitar cotización
      </Button>
    </form>
  );
};

export default AutoQuoteForm;
