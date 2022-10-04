import { useState, useEffect } from "react";
import useTimeout from "../hooks/useTimeout";
import Multiselect from "./Multiselect";

type IProps = {
    name: string;
    value: string[];
    items: { label: string; value: string }[];
    onChange: (value: string[]) => void;
};

const ParameterMultiselect: React.FC<IProps> = ({
    name,
    value,
    items,
    onChange,
}) => {
    const [localValue, setLocalValue] = useState<string[]>([]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useTimeout(
        () => {
            let hasChanged = false;
            for (
                let i = 0;
                i < Math.max(localValue.length, value.length);
                i++
            ) {
                if (localValue[i] !== value[i]) {
                    hasChanged = true;
                }
            }

            if (hasChanged) {
                onChange(localValue);
            }
        },
        500,
        [localValue]
    );

    return (
        <div>
            <div className="flex gap-2.5 justify-between">
                <h3 className="flex-shrink-0">{name}</h3>
            </div>

            <div className="mt-5">
                <Multiselect
                    menuItems={items}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default ParameterMultiselect;
