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
import { toast } from "react-toastify";

interface CreateModuleModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateModuleModal: React.FC<CreateModuleModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");

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
  };

  const getApplicablePlans = (): SubscriptionPlan[] => {
    if (selectedPlan === "all") {
      return [
        SubscriptionPlan.Free,
        SubscriptionPlan.Bronze,
        SubscriptionPlan.Gold,
        SubscriptionPlan.Diamond,
      ];
    }
    return selectedPlan ? [selectedPlan as SubscriptionPlan] : [];
  };

  const handleSubmit = async () => {
    if (!title || !icon || !selectedPlan || !order) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const applicablePlans = getApplicablePlans();

    try {
      await createModule({
        variables: {
          input: {
            title,
            icon: icon || undefined,
            description: description || undefined,
            order: order ? parseInt(order) : undefined,
            applicablePlans,
          },
        },
      });
      toast.success("Módulo creado correctamente");
      // Reset form
      setTitle("");
      setIcon("");
      setSelectedPlan("");
      setOrder("");
      setDescription("");
      onCreate();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo crear el módulo");
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
        <h2 className="text-2xl font-bold">Crear modulo</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre de modulo
            </label>
            <TextInput
              placeholder="Nombre de modulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Elige icono del modulo
            </label>
            <Select
              options={iconOptions}
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Asigna quien puede ver este módulo
            </label>
            <Select
              options={planOptions}
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Orden de la carpeta
            </label>
            <Select
              options={orderOptions}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción de la carpeta
            </label>
            <textarea
              className="w-full py-3 px-5 border border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 font-century-gothic min-h-[100px] resize-y"
              placeholder="Descripción de la carpeta"
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

export default CreateModuleModal;
