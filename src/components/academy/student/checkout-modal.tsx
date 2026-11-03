import React, { useEffect, useMemo, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Alert, Input, Modal, Radio, Select, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import {
  ACADEMY_COURSE_PAYMENT_QUOTE_QUERY,
  BANKS_QUERY,
  COUNTRY_BY_CODE_QUERY,
  PROFILE_FISCAL_ADDRESS_QUERY,
} from "@/lib/sektor-api/queries";
import {
  CONFIRM_ACADEMY_COURSE_IMMEDIATE_DEBIT,
  CONFIRM_ACADEMY_COURSE_MOBILE_PAYMENT,
  INITIATE_ACADEMY_COURSE_IMMEDIATE_DEBIT,
  UPDATE_MY_FISCAL_ADDRESS,
} from "@/lib/sektor-api/mutations";
import {
  AcademyCoursePaymentQuote,
  Mutation,
  PaymentStatus,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import {
  SEKTOR_MOBILE_PAYMENT_ACCOUNT,
  formatUsd,
  formatVes,
  friendlyError,
} from "../constants";

type Method = "mobile" | "debit";
type Stage = "loading" | "fiscal" | "method" | "otp" | "processing" | "done";

const DOC_PREFIXES = ["V", "E", "J", "G", "P"];
const PHONE_RE = /^04\d{9}$/;
const FINAL_STATUSES = [
  PaymentStatus.Completed,
  PaymentStatus.Failed,
  PaymentStatus.Expired,
] as string[];

interface CheckoutModalProps {
  open: boolean;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  /** Called after the enrollment is confirmed so the page can refetch. */
  onPaid: () => void;
}

const CopyValue = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 py-1">
    <span className="text-gray-500 text-sm">{label}</span>
    <button
      type="button"
      className="font-bold flex items-center gap-2 hover:text-blue-400"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => toast.success(`${label} copiado`),
          () => undefined
        );
      }}
    >
      {value} <FontAwesomeIcon icon={faCopy} className="text-xs" />
    </button>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-bold uppercase tracking-wide">{children}</span>
);

const CheckoutModal = ({
  open,
  courseId,
  courseTitle,
  onClose,
  onPaid,
}: CheckoutModalProps) => {
  const client = useApolloClient();
  const user = useAuthStore(useShallow((s) => s.user));

  const [stage, setStage] = useState<Stage>("loading");
  const [quote, setQuote] = useState<AcademyCoursePaymentQuote | null>(null);
  const [method, setMethod] = useState<Method>("mobile");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Payer data shared by both methods.
  const [bankCode, setBankCode] = useState<string>();
  const [docPrefix, setDocPrefix] = useState("V");
  const [docNumber, setDocNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [holderName, setHolderName] = useState(user?.name ?? "");
  const [reference, setReference] = useState("");
  const [otp, setOtp] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Fiscal address form.
  const [street, setStreet] = useState("");
  const [addressRef, setAddressRef] = useState("");
  const [stateId, setStateId] = useState<number>();
  const [cityId, setCityId] = useState<number>();

  const { data: banksData } = useQuery<Query>(BANKS_QUERY, { skip: !open });
  const { data: countryData } = useQuery<Query>(COUNTRY_BY_CODE_QUERY, {
    variables: { code: "VE" },
    skip: stage !== "fiscal",
  });
  const [initiateDebit] = useMutation<Mutation>(INITIATE_ACADEMY_COURSE_IMMEDIATE_DEBIT);
  const [confirmDebit] = useMutation<Mutation>(CONFIRM_ACADEMY_COURSE_IMMEDIATE_DEBIT);
  const [confirmMobile] = useMutation<Mutation>(CONFIRM_ACADEMY_COURSE_MOBILE_PAYMENT);
  const [updateMyFiscalAddress] = useMutation(UPDATE_MY_FISCAL_ADDRESS);

  const payerDocument = `${docPrefix}${docNumber.replace(/\D/g, "")}`;

  /** Always ask for a fresh quote: the VES amount must match the rate. */
  const refreshQuote = async () => {
    const { data } = await client.query<Query>({
      query: ACADEMY_COURSE_PAYMENT_QUOTE_QUERY,
      variables: { courseId },
      fetchPolicy: "network-only",
    });
    setQuote(data.academyCoursePaymentQuote);
    return data.academyCoursePaymentQuote;
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStage("loading");
    setError(null);
    (async () => {
      try {
        const [, profile] = await Promise.all([
          refreshQuote(),
          client.query<Query>({
            query: PROFILE_FISCAL_ADDRESS_QUERY,
            fetchPolicy: "network-only",
          }),
        ]);
        if (cancelled) return;
        const fiscal = profile.data.profile?.fiscalAddress;
        if (fiscal) {
          setStage("method");
        } else {
          setStage("fiscal");
        }
      } catch (e) {
        if (cancelled) return;
        // Old records can hold location ids that no longer exist; the backend
        // then fails the whole profile query. Ask for the address again.
        if (/Fiscal address location not found|Forbidden resource/i.test((e as Error).message)) {
          setStage("fiscal");
          return;
        }
        setError(friendlyError(e));
        setStage("method");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, courseId]);

  const states = useMemo(
    () => countryData?.getCountryByCode?.states ?? [],
    [countryData]
  );
  const cities = states.find((s) => s.id === stateId)?.cities ?? [];

  const saveFiscalAddress = async () => {
    const countryId = countryData?.getCountryByCode?.id;
    if (!street.trim() || !stateId || !cityId || !countryId) {
      setError("Completa calle, estado y ciudad");
      return;
    }
    setBusy(true);
    setError(null);
    const fiscalAddress = {
      street: street.trim(),
      countryId,
      stateId,
      cityId,
      reference: addressRef.trim() || undefined,
    };
    try {
      await updateMyFiscalAddress({ variables: { input: fiscalAddress } });
      setStage("method");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const validatePayer = () => {
    if (!bankCode) return "Selecciona tu banco";
    if (!/^\d{5,9}$/.test(docNumber.replace(/\D/g, "")))
      return "Ingresa una cédula o RIF válido";
    if (!PHONE_RE.test(phone)) return "El teléfono debe tener el formato 04XXXXXXXXX";
    if (method === "debit" && !holderName.trim()) return "Ingresa el nombre del titular";
    if (method === "mobile" && !reference.trim()) return "Ingresa la referencia del pago";
    return null;
  };

  const finish = () => {
    setStage("done");
    onPaid();
  };

  const payMobile = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await confirmMobile({
        variables: {
          input: {
            courseId,
            reference: reference.trim(),
            bankCode,
            payerDocument,
            payerPhone: phone,
            amountVes: quote?.amountVes,
          },
        },
      });
      const result = res.data?.confirmAcademyCourseMobilePayment;
      if (result?.matched || result?.payment.status === PaymentStatus.Completed) {
        finish();
      } else {
        setError(
          result?.message ||
            "Aún no vemos tu pago. Verifica la referencia o intenta en unos minutos."
        );
      }
    } catch (e) {
      const message = friendlyError(e);
      setError(message);
      // The VES amount depends on the exchange rate: refresh it so the user
      // sees the amount that will actually be accepted.
      if (/monto/i.test(message)) refreshQuote().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  };

  const startDebit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await initiateDebit({
        variables: {
          input: {
            courseId,
            billingData: {
              phone,
              cedula: payerDocument,
              bankCode,
              holderName: holderName.trim(),
            },
          },
        },
      });
      const r = res.data?.initiateAcademyCourseImmediateDebit;
      if (!r?.payment?.id) throw new Error(r?.message || "No se pudo iniciar el débito");
      setPaymentId(r.payment.id);
      setStage("otp");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const confirmOtp = async () => {
    if (!paymentId || otp.trim().length < 4) {
      setError("Ingresa el código que te llegó por SMS");
      return;
    }
    setBusy(true);
    setError(null);
    setStage("processing");
    try {
      const variables = {
        input: { paymentId, otp: otp.trim(), holderName: holderName.trim() },
      };
      // Same polling as the app: the bank can take a few seconds to settle.
      let attempts = 0;
      let result = (await confirmDebit({ variables })).data
        ?.confirmAcademyCourseImmediateDebit;
      while (
        result &&
        !FINAL_STATUSES.includes(result.payment.status) &&
        attempts < 6
      ) {
        await new Promise((r) => setTimeout(r, 5000));
        attempts++;
        result = (await confirmDebit({ variables })).data
          ?.confirmAcademyCourseImmediateDebit;
      }
      if (result?.payment.status === PaymentStatus.Completed) {
        finish();
        return;
      }
      setStage("otp");
      setError(
        result?.payment.errorMessage ||
          result?.message ||
          "El banco no confirmó el pago. Intenta de nuevo."
      );
    } catch (e) {
      setStage("otp");
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    const invalid = validatePayer();
    if (invalid) {
      setError(invalid);
      return;
    }
    if (method === "mobile") payMobile();
    else startDebit();
  };

  const banks = banksData?.banks ?? [];
  const bankOptions = banks.map((b) => ({ value: b.code, label: `${b.code} · ${b.name}` }));

  const payerFields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label className="flex flex-col gap-1 sm:col-span-2">
        <Label>{method === "mobile" ? "Banco desde el que pagaste" : "Tu banco"}</Label>
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="Selecciona"
          value={bankCode}
          onChange={setBankCode}
          options={bankOptions}
        />
      </label>
      <label className="flex flex-col gap-1">
        <Label>Cédula / RIF del titular</Label>
        <Input
          addonBefore={
            <Select
              value={docPrefix}
              onChange={setDocPrefix}
              options={DOC_PREFIXES.map((p) => ({ value: p, label: p }))}
              className="!w-16"
            />
          }
          inputMode="numeric"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="12345678"
        />
      </label>
      <label className="flex flex-col gap-1">
        <Label>Teléfono</Label>
        <Input
          inputMode="tel"
          value={phone}
          maxLength={11}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="04121234567"
        />
      </label>
      {method === "debit" && (
        <label className="flex flex-col gap-1 sm:col-span-2">
          <Label>Nombre del titular de la cuenta</Label>
          <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} />
        </label>
      )}
      {method === "mobile" && (
        <label className="flex flex-col gap-1 sm:col-span-2">
          <Label>Número de referencia</Label>
          <Input
            value={reference}
            inputMode="numeric"
            onChange={(e) => setReference(e.target.value.trim())}
          />
        </label>
      )}
    </div>
  );

  const body = () => {
    if (stage === "loading")
      return (
        <div className="py-16 flex justify-center">
          <Spin />
        </div>
      );

    if (stage === "done")
      return (
        <div className="py-10 flex flex-col items-center gap-3 text-center">
          <FontAwesomeIcon icon={faCircleCheck} size="3x" className="text-[#3EA574]" />
          <h3 className="text-lg font-bold">¡Listo! Ya estás inscrito</h3>
          <p className="text-gray-500 text-sm">
            Te enviaremos la factura a tu correo.
          </p>
          <Button variant="solid-blue" onClick={onClose}>
            Ir al curso
          </Button>
        </div>
      );

    if (stage === "fiscal")
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Para emitir tu factura necesitamos tu dirección fiscal. Solo te la
            pediremos una vez.
          </p>
          <label className="flex flex-col gap-1">
            <Label>Estado</Label>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Selecciona"
              value={stateId}
              onChange={(v) => {
                setStateId(v);
                setCityId(undefined);
              }}
              options={states.map((s) => ({ value: s.id, label: s.name }))}
              loading={!countryData}
            />
          </label>
          <label className="flex flex-col gap-1">
            <Label>Ciudad</Label>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Selecciona"
              disabled={!stateId}
              value={cityId}
              onChange={setCityId}
              options={cities.map((c) => ({ value: c.id, label: c.name }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <Label>Dirección (calle, edificio, local)</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <Label>Punto de referencia (opcional)</Label>
            <Input value={addressRef} onChange={(e) => setAddressRef(e.target.value)} />
          </label>
          <Button variant="solid-blue" disabled={busy} onClick={saveFiscalAddress}>
            {busy ? "Guardando…" : "Continuar"}
          </Button>
        </div>
      );

    if (stage === "otp" || stage === "processing")
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Tu banco te envió un código por SMS. Ingrésalo para autorizar el débito de{" "}
            <b>{formatVes(quote?.amountVes)}</b>.
          </p>
          <Input
            size="large"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Código"
            disabled={stage === "processing"}
          />
          <Button variant="solid-blue" disabled={busy} onClick={confirmOtp}>
            {stage === "processing" ? "Confirmando con el banco…" : "Confirmar pago"}
          </Button>
          <button
            type="button"
            className="text-sm underline self-center"
            disabled={busy}
            onClick={() => {
              setStage("method");
              setOtp("");
              setPaymentId(null);
              setError(null);
            }}
          >
            Cambiar datos
          </button>
        </div>
      );

    // stage === "method"
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-right">
            <span className="block text-xl font-bold">{formatVes(quote?.amountVes)}</span>
            <span className="block text-xs text-gray-500">
              {formatUsd(quote?.amountUsd)} · tasa {quote?.exchangeRate?.toFixed(2)}
            </span>
          </span>
        </div>

        <Radio.Group
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setError(null);
          }}
          optionType="button"
          buttonStyle="solid"
          className="flex"
          options={[
            { value: "mobile", label: "Pago Móvil" },
            { value: "debit", label: "Débito Inmediato" },
          ]}
        />

        {method === "mobile" && (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm mb-2">
              1. Haz un Pago Móvil por el monto exacto a:
            </p>
            <CopyValue label="Banco" value={SEKTOR_MOBILE_PAYMENT_ACCOUNT.bank} />
            <CopyValue label="RIF" value={SEKTOR_MOBILE_PAYMENT_ACCOUNT.rif} />
            <CopyValue label="Teléfono" value={SEKTOR_MOBILE_PAYMENT_ACCOUNT.phone} />
            <CopyValue
              label="Monto"
              value={(quote?.amountVes ?? 0).toFixed(2)}
            />
            <p className="text-sm mt-3">2. Reporta los datos del pago:</p>
          </div>
        )}

        {payerFields}

        <Button variant="solid-blue" disabled={busy || !quote} onClick={submit}>
          {busy
            ? "Procesando…"
            : method === "mobile"
            ? "Reportar pago"
            : "Solicitar código"}
        </Button>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={busy ? undefined : onClose}
      closable={!busy}
      maskClosable={false}
      footer={null}
      title={stage === "done" ? null : `Comprar: ${courseTitle}`}
      destroyOnClose
    >
      {error && (
        <Alert type="error" showIcon message={error} className="!mb-4" />
      )}
      {body()}
    </Modal>
  );
};

export default CheckoutModal;
