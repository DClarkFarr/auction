import { ModalProps } from "flowbite-react";
import { FC } from "react";

export interface BaseModalProps<Accept extends object = object> {
    openModal: boolean;
    setOpenModal: (bool: boolean) => void;
    onAccept: (data: Accept) => Promise<void>;
    onClose: () => void;
    onCancel?: () => void;
    size: ModalProps["size"];
    dismissable: ModalProps["dismissible"];
}

export interface FormModalProps<Accept extends object = object>
    extends BaseModalProps<Accept> {
    form: FC<FormModalFormProps<Accept>>;
    initialState?: Accept;
}

export type FormModalFormProps<Data extends object = object> = {
    onSubmit: (data: Data) => Promise<void>;
    onCancel?: () => void;
    initialState?: Data;
};
