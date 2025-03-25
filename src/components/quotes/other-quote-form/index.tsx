import React, { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { Mutation } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { useQuoteStore } from "@/store/quotes";
import { ROUTES } from "@/constants/router";
import { Input } from "antd";
import { REQUEST_OTHER_QUOTE } from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";

const { TextArea } = Input;

const OtherQuoteForm = () => {
  const router = useRouter();
  const organizationQuery = (router?.query?.organization || "") as string;
  const organizationId = organizationQuery.split("-")[1];
  const quoteRequestCustomer = useQuoteStore(
    (state) => state?.request?.customer
  );
  const resetQuoteStore = useQuoteStore((state) => state?.resetQuoteStore);

  const [comments, setComments] = useState("");
  const [requestOtherQuote, { loading }] =
    useMutation<Mutation>(REQUEST_OTHER_QUOTE);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      name = "",
      phone = "",
      location = 0,
      email = "",
    } = quoteRequestCustomer || {};

    requestOtherQuote({
      variables: {
        input: {
          organizationId,
          comments,
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
      className="w-full flex flex-col items-center gap-8 bg-blue-200 rounded-3xl px-2 p-8 max-w-4xl md:px-8"
    >
      <header className="w-11/12 border-b border-b-blue-500 pb-4">
        <h2 className="text-xl">Otros</h2>
      </header>

      <TextArea
        className="w-full max-w-xl rounded-3xl"
        placeholder="Comentanos los servicios que necesitas cotizar..."
        allowClear
        required
        disabled={loading}
        onChange={(e) => setComments(e.target.value)}
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

export default OtherQuoteForm;
