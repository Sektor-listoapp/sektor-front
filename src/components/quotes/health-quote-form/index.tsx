import React, { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { Mutation } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { useQuoteStore } from "@/store/quotes";
import { ROUTES } from "@/constants/router";
import { Input } from "antd";
import { REQUEST_HEALTH_QUOTE } from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import SwitchInput from "@/components/ui/switch-input";
import {
  faCross,
  faEye,
  faMoneyCheckDollar,
  faPersonPregnant,
  faStethoscope,
  faTooth,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "@/components/ui/date-picker";
import Select from "@/components/ui/select";
import dayjs from "dayjs";
import { UP_TO_INSURANCE_AMOUNT_OPTIONS } from "./constants";

const { TextArea } = Input;

const HealthQuoteForm = () => {
  const router = useRouter();
  const organizationQuery = (router?.query?.organization || "") as string;
  const organizationId = organizationQuery.split("-")[1];
  const resetQuoteStore = useQuoteStore((state) => state?.resetQuoteStore);
  const quoteRequestCustomer = useQuoteStore(
    (state) => state?.request?.customer
  );

  const [input, setInput] = useState({
    comments: "",
    upToInsuranceAmount: "",
    dateOfBirth: "",
    maternity: false,
    dental: false,
    vision: false,
    funeral: false,
    primaryCare: false,
  });

  const [requestQuote, { loading }] =
    useMutation<Mutation>(REQUEST_HEALTH_QUOTE);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name = "", phone = "", location = 0 } = quoteRequestCustomer || {};
    const {
      comments,
      dateOfBirth,
      dental,
      funeral,
      maternity,
      primaryCare,
      upToInsuranceAmount,
      vision,
    } = input;

    requestQuote({
      variables: {
        input: {
          dental,
          vision,
          funeral,
          comments,
          maternity,
          primaryCare,
          dateOfBirth,
          organizationId,
          cityId: Number(location),
          customer: { name, phone },
          upToInsuranceAmount: Number(upToInsuranceAmount),
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
      className="w-full flex flex-col items-center gap-8 bg-blue-200 rounded-3xl px-2 p-8 max-w-4xl md:px-8 md:gap-12"
    >
      <header className="w-11/12 border-b border-b-blue-500 pb-4">
        <h2 className="text-xl">Salud</h2>
      </header>

      <div className="w-11/12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
        <DatePicker
          name="dateOfBirth"
          wrapperClassName="w-full"
          placeholder="Fecha de nacimiento"
          disabled={loading}
          required
          onChange={(_, dateString) => {
            setInput((prev) => ({
              ...prev,
              dateOfBirth: dateString as string,
            }));
          }}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
        />
        <Select
          name="upToInsuranceAmount"
          wrapperClassName="w-full"
          icon={faMoneyCheckDollar}
          value={input.upToInsuranceAmount}
          options={UP_TO_INSURANCE_AMOUNT_OPTIONS}
          disabled={loading}
          required
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              upToInsuranceAmount: e.target.value,
            }))
          }
        />
        <SwitchInput
          label="Maternidad"
          disabled={loading}
          icon={faPersonPregnant}
          switchProps={{
            disabled: loading,
            checked: input.maternity,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, maternity: checked })),
          }}
        />
        <SwitchInput
          label="Servicio funerario"
          icon={faCross}
          disabled={loading}
          switchProps={{
            disabled: loading,
            checked: input.funeral,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, funeral: checked })),
          }}
        />
        <SwitchInput
          label="Odontología"
          icon={faTooth}
          disabled={loading}
          switchProps={{
            disabled: loading,
            checked: input.dental,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, dental: checked })),
          }}
        />
        <SwitchInput
          label="Oftalmología"
          icon={faEye}
          disabled={loading}
          switchProps={{
            disabled: loading,
            checked: input.vision,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, vision: checked })),
          }}
        />
        <SwitchInput
          label="Atención medica primaría"
          icon={faStethoscope}
          disabled={loading}
          switchProps={{
            disabled: loading,
            checked: input.primaryCare,
            onChange: (checked) =>
              setInput((prev) => ({ ...prev, primaryCare: checked })),
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

export default HealthQuoteForm;
