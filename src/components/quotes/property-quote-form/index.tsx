import React, { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { Mutation } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { useQuoteStore } from "@/store/quotes";
import { ROUTES } from "@/constants/router";
import { Input } from "antd";
import { REQUEST_PROPERTY_QUOTE } from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";
import SwitchInput from "@/components/ui/switch-input";

const { TextArea } = Input;

const PropertyQuoteForm = () => {
  const router = useRouter();
  const organizationQuery = (router?.query?.organization || "") as string;
  const organizationId = organizationQuery.split("-")[1];
  const resetQuoteStore = useQuoteStore((state) => state?.resetQuoteStore);
  const quoteRequestCustomer = useQuoteStore(
    (state) => state?.request?.customer
  );

  const [input, setInput] = useState({
    comments: "",
    industryAndCommerce: false,
    residentialComplex: false,
  });

  const [requestQuote, { loading }] = useMutation<Mutation>(
    REQUEST_PROPERTY_QUOTE
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name = "", phone = "", location = 0 } = quoteRequestCustomer || {};
    const { comments, industryAndCommerce, residentialComplex } = input;

    requestQuote({
      variables: {
        input: {
          comments,
          organizationId,
          residentialComplex,
          industryAndCommerce,
          cityId: Number(location),
          customer: { name, phone },
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
      className="w-full flex flex-col items-center gap-8 bg-blue-200 rounded-3xl px-2 p-8 max-w-4xl md:px-8"
    >
      <header className="w-11/12 border-b border-b-blue-500 pb-4">
        <h2 className="text-xl">Patrimoniales</h2>
      </header>

      <div className="w-11/12 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SwitchInput
          label="Industrial y comercio"
          icon={faPeopleRoof}
          switchProps={{
            checked: input.industryAndCommerce,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, industryAndCommerce: checked })),
          }}
        />
        <SwitchInput
          label="Combinando residencial"
          icon={faPeopleRoof}
          switchProps={{
            checked: input.residentialComplex,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, residentialComplex: checked })),
          }}
        />
      </div>

      <TextArea
        className="w-full max-w-xl rounded-3xl"
        placeholder="Comentanos otros servicios que deseas cotizar..."
        allowClear
        disabled={loading}
        onChange={(e) =>
          setInput((prev) => ({ ...prev, comments: e.target.value }))
        }
        styles={{
          textarea: {
            minHeight: "250px",
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

export default PropertyQuoteForm;
