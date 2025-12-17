import React, { useState } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { Mutation, SubscriptionPlan } from "@/lib/sektor-api/__generated__/types";
import { CREATE_MODULE } from "@/lib/sektor-api/mutations";
import TextInput from "@/components/ui/text-input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Switch from "@/components/ui/switch";
import { toast } from "react-toastify";

interface CreateSubfolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  parentId: string;
}

const CreateSubfolderModal: React.FC<CreateSubfolderModalProps> = ({
  open,
  onClose,
  onCreate,
  parentId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [applicablePlans, setApplicablePlans] = useState<SubscriptionPlan[]>([]);

  const [createModule, { loading }] = useMutation<Mutation>(CREATE_MODULE);

  const iconOptions = [
    { label: "Gráfico", value: "chart" },
    { label: "Documento", value: "document" },
    { label: "Carpeta", value: "folder" },
    { label: "Imagen", value: "image" },
  ];

  const planOptions = [
    { label: "Todos", value: "all" },
    { label: "Free", value: SubscriptionPlan.Free },
    { label: "Bronze", value: SubscriptionPlan.Bronze },
    { label: "Gold", value: SubscriptionPlan.Gold },
    { label: "Diamond", value: SubscriptionPlan.Diamond },
  ];

  const orderOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    if (value === "all") {
      setApplicablePlans([
        SubscriptionPlan.Free,
        SubscriptionPlan.Bronze,
        SubscriptionPlan.Gold,
        SubscriptionPlan.Diamond,
      ]);
    } else {
      setApplicablePlans([value as SubscriptionPlan]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !icon || applicablePlans.length === 0 || !order) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      await createModule({
        variables: {
          input: {
            title,
            description: description || undefined,
            icon: icon || undefined,
            order: order ? parseInt(order) : undefined,
            latest: isFinal,
            parentId: parentId,
            applicablePlans,
          },
        },
      });
      toast.success("Subcarpeta creada correctamente");

      setTitle("");
      setDescription("");
      setIcon("");
      setOrder("");
      setIsFinal(false);
      setSelectedPlan("");
      setApplicablePlans([]);
      onCreate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo crear la subcarpeta");
    }
  };

  return (
    <Modal
      footer={null}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      className="!w-11/12 md:!w-3/4 lg:!w-11/12 !max-w-2xl"
      centered
      closeIcon={
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-blue-500"
          size="lg"
        />
      }
    >
      <section className="flex flex-col gap-6 text-blue-500 p-5 font-century-gothic">
        <h2 className="text-2xl font-bold">Crear subcarpeta</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre de subcarpeta
            </label>
            <TextInput
              placeholder="Nombre de subcarpeta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Elige icono de la subcarpeta
            </label>
            <Select
              options={iconOptions}
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Asigna quien puede ver esta subcarpeta
            </label>
            <Select
              options={planOptions}
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Orden de la subcarpeta
            </label>
            <Select
              options={orderOptions}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-blue-500">¿Es carpeta final?</span>
            <Switch checked={isFinal} onChange={setIsFinal} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción de la subcarpeta
            </label>
            <textarea
              className="w-full py-3 px-5 border border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 font-century-gothic min-h-[100px] resize-y"
              placeholder="Descripción de la subcarpeta"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="solid-blue" onClick={handleSubmit} loading={loading}>
            Crear
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default CreateSubfolderModal;
