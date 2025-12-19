import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { Mutation, ModuleType, SubscriptionPlan } from "@/lib/sektor-api/__generated__/types";
import { UPDATE_MODULE } from "@/lib/sektor-api/mutations";
import TextInput from "@/components/ui/text-input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import IconSelector from "./icon-selector";
import { toast } from "react-toastify";

interface EditModuleModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  module: ModuleType;
}

const EditModuleModal: React.FC<EditModuleModalProps> = ({
  open,
  onClose,
  onEdit,
  module,
}) => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [applicablePlans, setApplicablePlans] = useState<SubscriptionPlan[]>([]);
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");

  const [updateModule, { loading }] = useMutation<Mutation>(UPDATE_MODULE);

  useEffect(() => {
    if (module) {
      setTitle(module.title || "");
      setIcon(module.icon || "icon1");
      setOrder(module.order?.toString() || "");
      setDescription(module.description || "");


      const plans = module.applicablePlans || [];
      setApplicablePlans(plans);


      if (plans.length === 4) {
        setSelectedPlan("all");
      } else if (plans.length > 0) {
        setSelectedPlan(plans[0]);
      } else {
        setSelectedPlan("");
      }
    }
  }, [module]);

  const iconOptions = [
    { label: "Icono 1", value: "icon1", imagePath: "/images/modules-icons/icon1.webp" },
    { label: "Icono 2", value: "icon2", imagePath: "/images/modules-icons/icon2.webp" },
    { label: "Icono 3", value: "icon3", imagePath: "/images/modules-icons/icon3.webp" },
    { label: "Icono 4", value: "icon4", imagePath: "/images/modules-icons/icon4.webp" },
    { label: "Icono 5", value: "icon5", imagePath: "/images/modules-icons/icon5.webp" },
    { label: "Icono 6", value: "icon6", imagePath: "/images/modules-icons/icon6.webp" },
    { label: "Icono 7", value: "icon7", imagePath: "/images/modules-icons/icon7.webp" },
    { label: "Icono 8", value: "icon8", imagePath: "/images/modules-icons/icon8.webp" },
    { label: "Icono 9", value: "icon9", imagePath: "/images/modules-icons/icon9.webp" },
    { label: "Icono 10", value: "icon10", imagePath: "/images/modules-icons/icon10.webp" },
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
      await updateModule({
        variables: {
          id: module._id,
          input: {
            title,
            icon: icon || undefined,
            description: description || undefined,
            order: order ? parseInt(order) : undefined,
            applicablePlans,
          },
        },
      });
      toast.success("Módulo actualizado correctamente");
      onEdit();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el módulo");
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
        <h2 className="text-2xl font-bold">Editar modulo</h2>

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
            <IconSelector
              value={icon}
              onChange={setIcon}
              options={iconOptions}
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
            Guardar cambios
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default EditModuleModal;
