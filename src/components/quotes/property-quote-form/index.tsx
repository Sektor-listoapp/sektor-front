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
    const {
      name = "",
      phone = "",
      location = 0,
      email = "",
    } = quoteRequestCustomer || {};
    const { comments, industryAndCommerce, residentialComplex } = input;

    requestQuote({
      variables: {
        input: {
          comments,
          organizationId,
          residentialComplex,
          industryAndCommerce,
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
        <h2 className="text-xl col-span-2">Patrimoniales</h2>
        <SwitchInput
          label="Industrial y comercio"
          disabled={loading}
          icon={faPeopleRoof}
          switchProps={{
            disabled: loading,
            checked: input.industryAndCommerce,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, industryAndCommerce: checked })),
          }}
        />
        <SwitchInput
          label="Combinando residencial"
          disabled={loading}
          icon={faPeopleRoof}
          switchProps={{
            disabled: loading,
            checked: input.residentialComplex,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, residentialComplex: checked })),
          }}
        />
      </div>

      <TextArea
        className="w-11/12 max-w-xl rounded-3xl bg-gray-200"
        placeholder="Comentanos otros servicios que deseas cotizar..."
        allowClear
        required
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

export default PropertyQuoteForm;
