import { useEffect, useRef } from "react";

export default function useTimeout(
    callback: () => void,
    delay: number | null,
    dependency: unknown[] = []
): void {
    const savedCallback = useRef<() => void | undefined>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) savedCallback.current();
        }

        if (delay !== null) {
            const id = setTimeout(tick, delay);
            return () => clearTimeout(id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay, ...dependency]);
}
