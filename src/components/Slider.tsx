import { RefObject, useRef } from "react";
import { useSlider, useSliderThumb } from "@react-aria/slider";
import { SliderState, useSliderState } from "@react-stately/slider";
import { useNumberFormatter } from "@react-aria/i18n";
import { useFocusRing } from "@react-aria/focus";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { mergeProps } from "@react-aria/utils";

type IThumbProps = {
    index: number;
    state: SliderState;
    trackRef: RefObject<HTMLDivElement>;
};

const Thumb: React.FC<IThumbProps> = ({ state, trackRef, index }) => {
    const inputRef = useRef(null);
    const { thumbProps, inputProps } = useSliderThumb(
        {
            index,
            trackRef,
            inputRef,
        },
        state
    );

    const { focusProps, isFocusVisible } = useFocusRing();

    return (
        <div
            className="absolute"
            style={{
                left: `${state.getThumbPercent(index) * 100}%`,
            }}
        >
            <div
                {...thumbProps}
                className={`bg-primary h-5 w-5 rounded-full absolute -translate-x-1/2 hover:shadow-glow ${
                    isFocusVisible ? "shadow-glow" : ""
                }`}
            >
                <VisuallyHidden>
                    <input
                        ref={inputRef}
                        {...mergeProps(inputProps, focusProps)}
                    />
                </VisuallyHidden>
            </div>
        </div>
    );
};

type IProps = {
    value?: [number, number];
    min?: number;
    max?: number;
    className?: string;
    step?: number;
    onChange?: (value: [number, number]) => void;
    onAfterChange?: (value: [number, number]) => void;
    label?: string;
};

const Slider: React.FC<IProps> = ({
    value = [0, 100],
    min = 0,
    max = 100,
    onChange,
    onAfterChange,
    className = "",
    step = 1,
    label,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const numberFormatter = useNumberFormatter({});
    const state = useSliderState({
        numberFormatter,
        step,
        value,
        maxValue: max,
        minValue: min,
        orientation: "horizontal",
        onChange: (val) => onChange && onChange([val[0], val[1]]),
        onChangeEnd: (val) => onAfterChange && onAfterChange([val[0], val[1]]),
        label,
    });
    const { trackProps } = useSlider(
        { label, "aria-label": label },
        state,
        trackRef
    );

    const pointOne = state.getThumbPercent(0) * 100;
    const pointTwo = state.getThumbPercent(1) * 100;

    return (
        <div
            className={`flex relative items-center h-5 cursor-pointer select-none ${className}`}
            {...trackProps}
            ref={trackRef}
        >
            <div className="bg-white h-px w-full absolute"></div>
            <div
                className="bg-primary h-px absolute"
                style={{
                    left: `${pointOne}%`,
                    width: `${pointTwo - pointOne}%`,
                }}
            ></div>

            <Thumb index={0} state={state} trackRef={trackRef} />
            <Thumb index={1} state={state} trackRef={trackRef} />
        </div>
    );
};

export default Slider;
