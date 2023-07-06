import React from 'react';
import { useStores } from 'Stores/index';
import { ModalManagerContext } from './modal-manager-context';
import { isDesktop } from '@deriv/shared';
import type { TModalKeys, TModalProps } from 'Constants/modals';

/**
 * TModal type represents a specific modal type, with its prop typing constrained to that specific modal based on its key.
 */
export type TModal<T extends TModalKeys> = {
    key: T;
    props: TModalProps[T];
};

/**
 * TModalVariants type represents the union of all possible modal keys and prop types.
 * This type is necessary for typing a function or generic argument that could accept any type of modal.
 */
type TModalVariants = {
    key: TModalKeys;
    props: TModalProps[TModalKeys];
};

export type TModalManagerContext = {
    hideModal: (options?: THideModalOptions) => void;
    is_modal_open: boolean;
    isCurrentModal: (...keys: TModalKeys[]) => boolean;
    modal_props: Map<TModalKeys, TModalProps[TModalKeys]>;
    modal: TModalVariants | null;
    previous_modal: TModalVariants | null;
    showModal: <T extends TModalKeys>(modal: TModal<T>, options?: TShowModalOptions) => void;
    stacked_modal: TModalVariants | null;
    useRegisterModalProps: <T extends TModalKeys>(modals: TModal<T> | TModalVariants[]) => void;
};

type TShowModalOptions = {
    should_stack_modal?: boolean;
};

type THideModalOptions = {
    should_save_form_history?: boolean;
    should_hide_all_modals?: boolean;
};

const ModalManagerContextProvider = (props: React.PropsWithChildren<{mock?: TModalManagerContext}>) => {
    const [active_modal, setActiveModal] = React.useState<TModalVariants | null>(null);
    const [previous_modal, setPreviousModal] = React.useState<TModalVariants | null>(null);
    // for mobile, modals are stacked and not shown alternatingly one by one
    const [stacked_modal, setStackedModal] = React.useState<TModalVariants | null>(null);
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [modal_props, setModalProps] = React.useState<Map<TModalKeys, TModalProps[TModalKeys]>>(new Map());
    const { general_store } = useStores();

    /**
     * Sets the specified modals' props on mount or when the props passed to the hook has changed.
     *
     * Use this hook to declare the modals' props beforehand for cases when the props can't be passed/declared in stores.
     *
     * For instance, calling `showModal({key: ..., props: ... })` in a store action where the props can't be passed to the action, use this hook to pass the props beforehand
     * and simply call `showModal({key: ...})` without the need to specify the props, since its already passed using this hook to the modal manager.
     *
     * @param {TModal<T>|TModalVariants[]} modals - list of object modals to set props, each modal object must contain a 'key' attribute and 'props' attribute
     */
    const useRegisterModalProps = <T extends TModalKeys>(modals: TModal<T> | TModalVariants[]) => {
        const registered_modals = React.useRef<TModalVariants[]>([]);

        const registerModals = React.useCallback(() => {
            if (Array.isArray(modals)) {
                modals.forEach(modal => {
                    registered_modals.current.push(modal);
                    setModalProps(modal_props.set(modal.key, modal.props));
                });
            } else {
                registered_modals.current.push(modals);
                setModalProps(modal_props.set(modals.key, modals.props));
            }
        }, [modals]);

        React.useEffect(() => {
            registerModals();
            return () => {
                registered_modals.current.forEach(registered_modal => {
                    modal_props.delete(registered_modal.key);
                });
                registered_modals.current = [];
            };
        }, [modals]);
    };

    /**
     * Checks if the current visible modal matches the specified modal key passed to the argument.
     * Can also be used to check for multiple modal keys.
     *
     * @param {...string} keys - the modal keys to check if the current visible modal matches it
     */
    const isCurrentModal = (...keys: TModalKeys[]) => (active_modal ? keys.includes(active_modal.key) : false);

    const showModal = <T extends TModalKeys>(modal: TModal<T>, options?: TShowModalOptions) => {
        // eslint-disable-next-line no-param-reassign
        if (!options) options = { should_stack_modal: false };

        console.log(isDesktop(), isDesktop)
        if (isDesktop() || options.should_stack_modal) {
            setPreviousModal(active_modal);
            setActiveModal(modal);
        } else if (!active_modal) {
            console.log("HERE")
            setActiveModal(modal);
        } else {
            setStackedModal(modal);
        }
        setIsModalOpen(true);
    };

    /**
     * Hides the current shown modal.
     * If a previous modal was present, by default the previous modal will be shown in-place of the current closed modal.
     * This option can be overriden by setting `should_hide_all_modals` to `true` in the `options` argument to close all modals instead.
     *
     * @param {Object} options - list of supported settings to tweak how modals should be hidden:
     * - **should_hide_all_modals**: `false` by default. If set to `true`, previous modal will not be shown and all modals are hidden.
     * - **should_save_form_history**: `false` by default. If set to `true`, form values in modals that has a form with `ModalForm` component
     * will be saved when the modal is hidden and restored when modal is shown again.
     */
    const hideModal = (options?: THideModalOptions) => {
        // eslint-disable-next-line no-param-reassign
        if (!options) options = { should_save_form_history: false, should_hide_all_modals: false };

        const { should_save_form_history, should_hide_all_modals } = options;

        if (should_save_form_history) {
            general_store.saveFormState();
        } else {
            general_store.setSavedFormState(null);
            general_store.setFormikRef(null);
        }

        if (isDesktop()) {
            if (should_hide_all_modals) {
                setPreviousModal(null);
                setActiveModal(null);
                setIsModalOpen(false);
            } else if (previous_modal) {
                setActiveModal(previous_modal);
                setPreviousModal(null);
            } else {
                setActiveModal(null);
                setIsModalOpen(false);
            }
        } else if (stacked_modal && Object.keys(stacked_modal).length !== 0) {
            if (should_hide_all_modals) {
                setActiveModal(null);
                setIsModalOpen(false);
            }
            setStackedModal(null);
        } else {
            setActiveModal(null);
            setIsModalOpen(false);
        }
    };

    general_store.hideModal = hideModal;
    general_store.isCurrentModal = isCurrentModal;
    general_store.modal = active_modal;
    general_store.showModal = showModal;

    const state: TModalManagerContext = {
        hideModal,
        is_modal_open,
        isCurrentModal,
        modal: active_modal,
        modal_props,
        previous_modal,
        stacked_modal,
        showModal,
        useRegisterModalProps,
    };


    return <ModalManagerContext.Provider value={props.mock ? props.mock : state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
