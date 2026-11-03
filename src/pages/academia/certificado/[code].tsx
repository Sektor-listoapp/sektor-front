import React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import AcademyLayout from "@/components/academy/academy-layout";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { VERIFY_ACADEMY_CERTIFICATE_QUERY } from "@/lib/sektor-api/queries";
import { getSiteUrl, serverQuery } from "@/lib/sektor-api/conflg/server-query";
import { AcademyCertificateVerification, Query } from "@/lib/sektor-api/__generated__/types";

interface Props {
  certificate: AcademyCertificateVerification;
  url: string;
}

const CertificatePage = ({ certificate, url }: Props) => {
  const share = async () => {
    const data = { title: `Certificado: ${certificate.courseTitle}`, url };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Enlace copiado");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <AcademyLayout title={`Certificado ${certificate.certificateCode}`} hideTabs>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 flex flex-col items-center text-center gap-4">
        <FontAwesomeIcon icon={faCircleCheck} size="3x" className="text-[#3EA574]" />
        <span className="text-sm uppercase tracking-widest text-gray-500">Certificado verificado</span>
        <p className="text-gray-600">Academia Sektor certifica que</p>
        <h1 className="text-3xl font-bold">{certificate.studentName}</h1>
        <p className="text-gray-600">aprobó el curso</p>
        <h2 className="text-xl font-bold">{certificate.courseTitle}</h2>
        <p className="text-sm text-gray-500">
          Emitido el {dayjs(certificate.issuedAt).format("DD [de] MMMM [de] YYYY")} · Código{" "}
          <b>{certificate.certificateCode}</b>
        </p>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          <Button variant="solid-blue" onClick={share}>
            <FontAwesomeIcon icon={faShareNodes} /> Compartir
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir
          </Button>
        </div>
        <Link href={ROUTES.ACADEMY} className="text-sm underline mt-2">
          Ver cursos de la Academia
        </Link>
      </div>
    </AcademyLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req }) => {
  const code = String(params?.code ?? "");
  try {
    const data = await serverQuery<Query>(VERIFY_ACADEMY_CERTIFICATE_QUERY, { code });
    const certificate = data.verifyAcademyCertificate;
    if (!certificate) return { notFound: true };
    const url = `${getSiteUrl(req.headers.host)}${ROUTES.ACADEMY}/certificado/${certificate.certificateCode}`;
    return { props: { certificate, url } };
  } catch {
    return { notFound: true };
  }
};

export default CertificatePage;
