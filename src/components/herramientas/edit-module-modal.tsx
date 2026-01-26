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
import { MODULE_ICON_OPTIONS } from "@/utils/module-icons";

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


      const plans = module.applicablePlans && module.applicablePlans.length > 0
        ? module.applicablePlans
        : [SubscriptionPlan.Free];
      setApplicablePlans(plans);


      if (plans.length === 4) {
        setSelectedPlan("all");
      } else if (plans.length > 0) {
        setSelectedPlan(plans[0]);
      } else {
        setSelectedPlan(SubscriptionPlan.Free);
      }
    }
  }, [module]);

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
    const finalApplicablePlans = applicablePlans.length > 0 ? applicablePlans : [SubscriptionPlan.Free];



    try {
      await updateModule({
        variables: {
          id: module._id,
          input: {
            title,
            icon: icon || undefined,
            description: description || undefined,
            order: order ? parseInt(order) : undefined,
            applicablePlans: finalApplicablePlans,
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
              options={MODULE_ICON_OPTIONS}
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
