import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { Input, Modal, Upload } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import {
  CREATE_ACADEMY_INSTRUCTOR,
  UPDATE_ACADEMY_INSTRUCTOR,
} from "@/lib/sektor-api/mutations";
import {
  ACADEMY_INSTRUCTORS_QUERY,
  MY_ACADEMY_INSTRUCTOR_QUERY,
} from "@/lib/sektor-api/queries";
import {
  AcademyCourseAssetType,
  AcademyInstructor,
  Mutation,
  PublicAcademyInstructor,
} from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import { friendlyError } from "./constants";
import { useAcademyAssetUpload } from "./use-academy-asset-upload";

type InstructorLike = Pick<PublicAcademyInstructor, "id" | "name"> & {
  headline?: string | null;
  photoUrl?: string | null;
  courseCount?: number;
};

export const instructorHref = (instructor: Pick<PublicAcademyInstructor, "id">) =>
  `${ROUTES.ACADEMY_INSTRUCTORS}/${instructor.id}`;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const InstructorAvatar = ({
  instructor,
  className,
}: {
  instructor: Pick<InstructorLike, "name" | "photoUrl">;
  className?: string;
}) =>
  instructor.photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={instructor.photoUrl}
      alt={instructor.name}
      className={cn("rounded-full object-cover shrink-0 bg-gray-100", className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        "rounded-full shrink-0 bg-blue-500 text-white font-bold flex items-center justify-center",
        className
      )}
    >
      {initials(instructor.name)}
    </span>
  );

/** Listing card: photo, name, specialty and number of courses. */
export const InstructorCard = ({
  instructor,
  extra,
}: {
  instructor: InstructorLike;
  extra?: React.ReactNode;
}) => (
  <article className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow h-full">
    <Link href={instructorHref(instructor)} className="flex flex-col items-center gap-2 text-blue-500">
      <InstructorAvatar instructor={instructor} className="w-24 h-24 text-2xl" />
      <h2 className="font-bold text-lg leading-snug">{instructor.name}</h2>
      {instructor.headline && (
        <p className="text-sm text-gray-600 line-clamp-2">{instructor.headline}</p>
      )}
      {instructor.courseCount !== undefined && (
        <p className="text-xs text-gray-500">
          {instructor.courseCount} {instructor.courseCount === 1 ? "curso" : "cursos"}
        </p>
      )}
    </Link>
    {extra}
  </article>
);

/* ------------------------- Create / edit instructor ------------------------ */

interface InstructorFormModalProps {
  open: boolean;
  /** Edit this profile; omit to create a new instructor (Admin only). */
  instructor?: Pick<
    AcademyInstructor,
    "id" | "name" | "email" | "headline" | "bio" | "photoUrl"
  > | null;
  onClose: () => void;
  onSaved?: (instructor: AcademyInstructor) => void;
}

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    {children}
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </label>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InstructorFormModal = ({
  open,
  instructor,
  onClose,
  onSaved,
}: InstructorFormModalProps) => {
  const isEdit = !!instructor;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File>();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const uploadAsset = useAcademyAssetUpload();
  const refetchQueries = [ACADEMY_INSTRUCTORS_QUERY, MY_ACADEMY_INSTRUCTOR_QUERY];
  const [createInstructor] = useMutation<Mutation>(CREATE_ACADEMY_INSTRUCTOR, { refetchQueries });
  const [updateInstructor] = useMutation<Mutation>(UPDATE_ACADEMY_INSTRUCTOR, { refetchQueries });

  useEffect(() => {
    if (!open) return;
    setName(instructor?.name ?? "");
    setEmail(instructor?.email ?? "");
    setHeadline(instructor?.headline ?? "");
    setBio(instructor?.bio ?? "");
    setPhotoFile(undefined);
    setErrors([]);
  }, [open, instructor]);

  const photoPreview = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : instructor?.photoUrl ?? undefined),
    [photoFile, instructor]
  );
  useEffect(
    () => () => {
      if (photoFile && photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoFile, photoPreview]
  );

  const save = async () => {
    const found: string[] = [];
    if (!name.trim()) found.push("El nombre es obligatorio");
    if (!isEdit && !EMAIL_RE.test(email.trim())) found.push("Ingresa un correo válido");
    setErrors(found);
    if (found.length) return;

    setSaving(true);
    try {
      const photoUrl = photoFile
        ? await uploadAsset(photoFile, AcademyCourseAssetType.CourseCover)
        : undefined;
      let saved: AcademyInstructor | undefined;
      if (isEdit) {
        const res = await updateInstructor({
          variables: {
            id: instructor!.id,
            // Empty strings clear the optional fields on the server.
            input: { name: name.trim(), headline: headline.trim(), bio: bio.trim(), photoUrl },
          },
        });
        saved = res.data?.updateAcademyInstructor;
        toast.success("Perfil actualizado");
      } else {
        const res = await createInstructor({
          variables: {
            input: {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              headline: headline.trim() || undefined,
              bio: bio.trim() || undefined,
              photoUrl,
            },
          },
        });
        saved = res.data?.createAcademyInstructor;
        toast.success("Docente creado. Le enviamos un correo para crear su contraseña.");
      }
      if (saved) onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Editar perfil de docente" : "Nuevo docente / experto"}
      onCancel={() => !saving && onClose()}
      // Tailwind's preflight blanks antd's primary button, so the footer uses
      // the app's own buttons like every other modal.
      footer={null}
      destroyOnClose
    >
      <div className="flex flex-col gap-4 text-blue-500 font-century-gothic py-2">
        {errors.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-red-500">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <Field label="Foto">
          <Upload.Dragger
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              setPhotoFile(file);
              return false;
            }}
            className="!p-0"
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Foto" className="w-28 h-28 rounded-full object-cover mx-auto" />
            ) : (
              <div className="py-6 text-gray-500 flex flex-col items-center gap-2">
                <FontAwesomeIcon icon={faImage} size="2x" />
                Arrastra una foto o haz clic para elegirla
              </div>
            )}
          </Upload.Dragger>
        </Field>
        <Field label="Nombre">
          <Input value={name} placeholder="Ej: Adriana Machaca" onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field
          label="Correo"
          hint={
            isEdit
              ? "El correo no se puede cambiar"
              : "Con este correo inicia sesión. Si es nuevo en Sektor, le llega un enlace para crear su contraseña."
          }
        >
          <Input
            type="email"
            value={email}
            disabled={isEdit}
            placeholder="docente@correo.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Especialidad (opcional)">
          <Input
            value={headline}
            placeholder="Ej: Corredora de seguros de vehículos"
            onChange={(e) => setHeadline(e.target.value)}
          />
        </Field>
        <Field label="Descripción (opcional)">
          <Input.TextArea
            rows={4}
            value={bio}
            placeholder="Experiencia, certificaciones y temas que enseña"
            onChange={(e) => setBio(e.target.value)}
          />
        </Field>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button variant="outline" disabled={saving} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="solid-blue" disabled={saving} onClick={save}>
            {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear docente"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
