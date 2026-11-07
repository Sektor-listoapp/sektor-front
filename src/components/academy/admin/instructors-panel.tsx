import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { Empty, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPen,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { BUTTON_VARIANTS } from "@/components/ui/button/constants";
import { cn } from "@/utils/class-name";
import {
  DELETE_ACADEMY_INSTRUCTOR,
  RESEND_ACADEMY_INSTRUCTOR_INVITE,
} from "@/lib/sektor-api/mutations";
import {
  ACADEMY_INSTRUCTORS_QUERY,
  MY_ACADEMY_INSTRUCTOR_QUERY,
} from "@/lib/sektor-api/queries";
import { AcademyInstructor, Query } from "@/lib/sektor-api/__generated__/types";
import { AcademyLoader } from "../academy-layout";
import { friendlyError } from "../constants";
import {
  InstructorAvatar,
  InstructorFormModal,
  instructorHref,
} from "../instructors";

type EditTarget = AcademyInstructor | null | undefined;

/** Admin: every instructor, with create / edit / resend invite / delete. */
export const InstructorsPanel = () => {
  const { data, loading, error, refetch } = useQuery<Query>(ACADEMY_INSTRUCTORS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [deleteInstructor] = useMutation(DELETE_ACADEMY_INSTRUCTOR);
  const [resendInvite] = useMutation(RESEND_ACADEMY_INSTRUCTOR_INVITE);
  const [modal, modalContextHolder] = Modal.useModal();
  const [search, setSearch] = useState("");
  // undefined = closed, null = new instructor, object = edit it.
  const [editing, setEditing] = useState<EditTarget>(undefined);

  const instructors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.academyInstructors ?? []).filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        (i.email ?? "").toLowerCase().includes(q) ||
        (i.headline ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const confirmDelete = (instructor: AcademyInstructor) =>
    modal.confirm({
      title: `¿Eliminar a ${instructor.name}?`,
      content:
        "Se borra su perfil de docente. Su usuario sigue existiendo. Solo se puede eliminar si no tiene cursos.",
      okText: "Eliminar",
      okButtonProps: { danger: true, style: { backgroundColor: "#ff4d4f" } },
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await deleteInstructor({ variables: { id: instructor.id } });
          toast.success("Docente eliminado");
          refetch();
        } catch (e) {
          toast.error(friendlyError(e));
        }
      },
    });

  const confirmResend = (instructor: AcademyInstructor) =>
    modal.confirm({
      title: "Reenviar invitación",
      content: `Le enviaremos a ${instructor.email} un nuevo enlace para crear su contraseña.`,
      okText: "Reenviar",
      // Tailwind's preflight blanks antd's primary background.
      okButtonProps: { style: { backgroundColor: "#182F48" } },
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await resendInvite({ variables: { id: instructor.id } });
          toast.success("Invitación reenviada");
        } catch (e) {
          toast.error(friendlyError(e));
        }
      },
    });

  return (
    <div className="flex flex-col gap-4">
      {modalContextHolder}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <TextInput
          placeholder="Buscar docente"
          icon={faSearch}
          iconPosition="end"
          wrapperClassName="md:max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="solid-blue"
          className="md:ml-auto flex items-center gap-2 justify-center"
          onClick={() => setEditing(null)}
        >
          <FontAwesomeIcon icon={faPlus} /> Nuevo docente / experto
        </Button>
      </div>

      {loading && !data ? (
        <AcademyLoader />
      ) : error && !data ? (
        <p className="text-red-500 py-10 text-center">{friendlyError(error)}</p>
      ) : instructors.length === 0 ? (
        <Empty description="No hay docentes" className="py-10" />
      ) : (
        <div className="flex flex-col gap-2">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-xl p-3 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <Link
                href={instructorHref(instructor)}
                className="flex items-center gap-3 flex-1 min-w-0 text-blue-500"
              >
                <InstructorAvatar instructor={instructor} className="w-12 h-12 text-sm" />
                <span className="flex flex-col min-w-0">
                  <span className="font-bold truncate">{instructor.name}</span>
                  {instructor.headline && (
                    <span className="text-sm text-gray-600 truncate">{instructor.headline}</span>
                  )}
                  {instructor.email && (
                    <span className="text-xs text-gray-500 truncate">{instructor.email}</span>
                  )}
                </span>
              </Link>
              <span className="text-sm text-gray-500 sm:w-24">
                {instructor.courseCount} {instructor.courseCount === 1 ? "curso" : "cursos"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center !py-1.5"
                  onClick={() => setEditing(instructor)}
                >
                  <FontAwesomeIcon icon={faPen} /> Editar
                </Button>
                <button
                  aria-label="Reenviar invitación"
                  title="Reenviar invitación"
                  className="px-3 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50"
                  onClick={() => confirmResend(instructor)}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
                <button
                  aria-label="Eliminar docente"
                  title="Eliminar docente"
                  className="px-3 rounded-lg border border-red-300 text-red-500 hover:bg-red-50"
                  onClick={() => confirmDelete(instructor)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InstructorFormModal
        open={editing !== undefined}
        instructor={editing}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};

/** AcademyAdmin: its own instructor profile, editable. */
export const MyInstructorPanel = () => {
  const { data, loading, error } = useQuery<Query>(MY_ACADEMY_INSTRUCTOR_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [editing, setEditing] = useState(false);
  const me = data?.myAcademyInstructor;

  if (loading && !me) return <AcademyLoader />;
  if (error && !me)
    return <p className="text-red-500 py-10 text-center">{friendlyError(error)}</p>;
  if (!me) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <InstructorAvatar instructor={me} className="w-28 h-28 text-3xl" />
      <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
        <h2 className="text-xl font-bold">{me.name}</h2>
        {me.headline && <p className="text-gray-600">{me.headline}</p>}
        {me.email && <p className="text-sm text-gray-500">{me.email}</p>}
        <p className="whitespace-pre-line text-gray-700">
          {me.bio || "Agrega una descripción para que los alumnos te conozcan."}
        </p>
        <div className="flex gap-2 justify-center sm:justify-start pt-2">
          <Button
            variant="solid-blue"
            className="flex items-center gap-2 justify-center"
            onClick={() => setEditing(true)}
          >
            <FontAwesomeIcon icon={faPen} /> Editar perfil
          </Button>
          <Link
            href={instructorHref(me)}
            className={cn(BUTTON_VARIANTS.base, BUTTON_VARIANTS.outline, "px-4 py-2")}
          >
            Ver perfil público
          </Link>
        </div>
      </div>
      <InstructorFormModal open={editing} instructor={me} onClose={() => setEditing(false)} />
    </div>
  );
};
