import { useState, useEffect } from "react";

type IProps = {
    name: string;
    min?: number;
    max?: number;
    step?: number;
    value: {
        min: number;
        max: number;
    };
    onChange: (value: { min: number; max: number }) => void;
};

const ParameterRange: React.FC<IProps> = ({
    name,
    min = 0,
    max = 1,
    value,
    step = 0.01,
    onChange,
}) => {
    const [localValue, setLocalValue] = useState<{ min: number; max: number }>({
        min: value.min,
        max: value.max,
    });

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div>
            <div className="flex gap-2.5 justify-between mb-2.5">
                <h3 className="flex-shrink-0">{name}</h3>

                <div className="flex gap-2.5 flex-grow-0">
                    <input
                        type="number"
                        onChange={(e) =>
                            setLocalValue({
                                max: localValue.max,
                                min: Number(e.target.value),
                            })
                        }
                        min={min}
                        max={localValue.max}
                        value={localValue.min}
                        step={step}
                        className="bg-[#444444] text-[14px] text-[#B5B5B5] py-1 px-2.5 rounded-sm w-20"
                    />

                    <input
                        type="number"
                        onChange={(e) =>
                            setLocalValue({
                                min: localValue.min,
                                max: Number(e.target.value),
                            })
                        }
                        max={max}
                        min={localValue.min}
                        value={localValue.max}
                        step={step}
                        className="bg-[#444444] text-[14px] text-[#B5B5B5] py-1 px-2.5 rounded-sm w-20"
                    />
                </div>
            </div>

            <div className="relative h-px bg-white w-full my-2">
                <div
                    style={{
                        left: `${
                            ((localValue.min - min) * 100) / (max - min)
                        }%`,
                        right: `${
                            100 - ((localValue.max - min) * 100) / (max - min)
                        }%`,
                    }}
                    className="absolute h-full bg-primary"
                ></div>

                <div
                    style={{
                        left: `${
                            ((localValue.min - min) * 100) / (max - min)
                        }%`,
                    }}
                    className="absolute bg-primary rounded-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:shadow-glow"
                ></div>

                <div
                    style={{
                        left: `${
                            ((localValue.max - min) * 100) / (max - min)
                        }%`,
                    }}
                    className="absolute bg-primary rounded-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:shadow-glow"
                ></div>
            </div>
        </div>
    );
};

export default ParameterRange;
