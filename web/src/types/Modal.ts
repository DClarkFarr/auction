import { ModalProps } from "flowbite-react";
import { FC, ReactNode } from "react";

export interface BaseModalProps<Accept> {
    openModal: boolean;
    setOpenModal: (bool: boolean) => void;
    onAccept: (data: Accept) => Promise<void>;
    onClose: () => void;
    onCancel?: () => void;
    size: ModalProps["size"];
    dismissable: ModalProps["dismissible"];
    heading?: ReactNode;
}

export interface FormModalProps<Accept> extends BaseModalProps<Accept> {
    form: FC<FormModalFormProps<Accept>>;
    initialState?: Accept;
}

export type FormModalFormProps<Data> = {
    onSubmit: (data: Data) => Promise<void>;
    onCancel?: () => void;
    initialState?: Data;
};
