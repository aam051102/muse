import React, { useMemo, useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { useButton } from "@react-aria/button";
import { FocusScope } from "@react-aria/focus";
import { useOverlay } from "@react-aria/overlays";
import { useListBox, useOption } from "@react-aria/listbox";
import { useListState } from "@react-stately/list";
import { Item } from "@react-stately/collections";
import { ListState } from "@react-stately/list";

type IOptionProps = {
    item: IMenuItem;
    isSelected?: boolean;
    addKey: (key: string) => void;
    removeKey: (key: string) => void;
    toggleKey: (key: string) => void;
    state: ListState<unknown>;
};

export const Option: React.FC<IOptionProps> = ({ item, state, toggleKey }) => {
    const ref = useRef<HTMLButtonElement>(null);

    const { isSelected, isFocused } = useOption(
        { key: item.value },
        state,
        ref
    );

    return (
        <li key={item.value}>
            <button
                type="button"
                className={`input-multiselect relative px-2.5 py-2.5 text-left w-full rounded-sm-card outline-none hover:text-primary ${
                    isSelected ? "text-primary" : ""
                } ${isFocused ? "focused text-primary" : ""}
				`}
                ref={ref}
                onClick={() => toggleKey(item.value)}
            >
                {item.label || <>&nbsp;</>}
            </button>
        </li>
    );
};

type IListBoxProps = {
    collection: IMenuItem[];
    selectedKeys: string[];
    addKey: (key: string) => void;
    removeKey: (key: string) => void;
    toggleKey: (key: string) => void;
};

export const ListBox: React.FC<IListBoxProps> = ({
    collection,
    selectedKeys,
    addKey,
    removeKey,
    toggleKey,
}) => {
    const ref = useRef<HTMLUListElement>(null);

    const menuItemElements = useMemo(
        () =>
            collection?.map((item) => (
                <Item key={item.value}>{item.label}</Item>
            )) ?? [],
        [collection]
    );
    const state = useListState({
        selectedKeys,
        selectionMode: "multiple",
        children: menuItemElements,
        items: collection,
    });

    const { listBoxProps } = useListBox({ selectedKeys }, state, ref);

    return (
        <ul
            className="dropdown-listbox w-full bg-back p-2.5 max-h-52 overflow-auto rounded-sm-card outline-none"
            {...listBoxProps}
            ref={ref}
        >
            {[...collection].map((item) => (
                <Option
                    state={state}
                    key={item.value}
                    item={item}
                    isSelected={selectedKeys.includes(item.value)}
                    addKey={addKey}
                    removeKey={removeKey}
                    toggleKey={toggleKey}
                />
            ))}
        </ul>
    );
};

type IMenuItem = {
    value: string;
    label: string;
};

type IProps = {
    menuItems?: IMenuItem[];
    disabled?: boolean;
    value?: string[];
    onChange?: (value: string[]) => void;
};

const Multiselect: React.FC<IProps> = ({
    menuItems,
    disabled,
    value,
    onChange,
}) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLButtonElement>(null);

    const addKey = (key: string) => {
        onChange && onChange([...(value ? value : []), key]);
    };

    const removeKey = (key: string) => {
        if ((value ?? []).indexOf(key) !== -1) {
            const newValue = [...(value ? value : [])];
            newValue.splice(newValue.indexOf(key), 1);
            onChange && onChange(newValue);
        }
    };

    const toggleKey = (key: string) => {
        if (value?.includes(key.toString())) {
            removeKey(key.toString());
        } else {
            addKey(key.toString());
        }
    };

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { buttonProps } = useButton(
        {
            onPress: () => {
                setIsOpen(!isOpen);
            },
        },
        ref
    );

    const { overlayProps } = useOverlay(
        {
            isOpen: isOpen,
            onClose: () => setIsOpen(false),
            shouldCloseOnBlur: true,
            isDismissable: true,
        },
        popoverRef
    );

    return (
        <div className="relative">
            <div className="relative">
                <div className="relative">
                    <button
                        type="button"
                        disabled={disabled}
                        className={`w-full outline-none rounded-sm-card pl-1 pr-4 h-10 flex flex-inline justify-end items-center border border-white hover:border-primary hover:shadow-glow`}
                        {...buttonProps}
                        ref={ref}
                    >
                        <FiChevronDown className="text-lg text-white flex-shrink-0 ml-3" />
                    </button>

                    <div className="absolute left-0 top-0 right-0 py-1 pl-1 mr-8 h-10 flex flex-nowrap items-center overflow-hidden flex-grow pointer-events-none">
                        {value?.length ? (
                            value.map((val) => (
                                <span
                                    key={val}
                                    className="inline-flex items-center gap-2 h-full px-4 border border-white text-white mr-1 rounded-sm-card flex-shrink-0"
                                >
                                    {
                                        menuItems?.find(
                                            (item) => val === item.value
                                        )?.label
                                    }

                                    <button
                                        type="button"
                                        className="transition duration-100 ease-in-out hover:text-primary pointer-events-auto"
                                        onClick={() => removeKey(val)}
                                    >
                                        <FiX className="text-xl stroke-2" />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <span className="text-white">
                                <span className="inline-block px-4">
                                    &nbsp;
                                </span>
                            </span>
                        )}

                        <div
                            className={`absolute top-0 bottom-0 right-0 my-1 w-4 bg-gradient-to-l`}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="absolute top-full left-0 w-full z-10">
                {isOpen && (
                    /* eslint-disable-next-line jsx-a11y/no-autofocus */
                    <FocusScope restoreFocus autoFocus>
                        <div {...overlayProps} ref={popoverRef}>
                            <ListBox
                                selectedKeys={value ?? []}
                                collection={menuItems ?? []}
                                addKey={addKey}
                                removeKey={removeKey}
                                toggleKey={toggleKey}
                            />
                        </div>
                    </FocusScope>
                )}
            </div>
        </div>
    );
};

export default Multiselect;
