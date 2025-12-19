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
import IconSelector from "./icon-selector";

interface CreateSubfolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  parentId: string;
  isSubmodule?: boolean;
}

const CreateSubfolderModal: React.FC<CreateSubfolderModalProps> = ({
  open,
  onClose,
  onCreate,
  parentId,
  isSubmodule = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(SubscriptionPlan.Free);
  const [applicablePlans, setApplicablePlans] = useState<SubscriptionPlan[]>([SubscriptionPlan.Free]);

  const [createModule, { loading }] = useMutation<Mutation>(CREATE_MODULE);

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

  const [icon, setIcon] = useState(iconOptions[0].value);

  const planOptions = [
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
    setSelectedPlan(value as SubscriptionPlan);
    setApplicablePlans([value as SubscriptionPlan]);
  };

  const handleSubmit = async () => {


    if (!title || !icon || applicablePlans.length === 0 || !order) {

      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const orderNumber = order ? parseInt(order, 10) : undefined;

    const input = {
      title,
      description: description || undefined,
      icon: icon || undefined,
      order: orderNumber,
      latest: isFinal,
      parentId: parentId,
      applicablePlans,
    };


    try {

      const result = await createModule({
        variables: {
          input,
        },
      });
      console.log("Subfolder created successfully:", result);
      toast.success("Subcarpeta creada correctamente");

      setTitle("");
      setDescription("");
      setIcon(iconOptions[0].value);
      setOrder("");
      setIsFinal(false);
      setSelectedPlan(SubscriptionPlan.Free);
      setApplicablePlans([SubscriptionPlan.Free]);
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
        <h2 className="text-2xl font-bold">{isSubmodule ? "Crear submódulo" : "Crear subcarpeta"}</h2>

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
            <IconSelector
              value={icon}
              onChange={setIcon}
              options={iconOptions}
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
