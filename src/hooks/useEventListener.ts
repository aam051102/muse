import { useEffect, useRef } from "react";

/**
 * Listen for KeyBoard events with handler function
 * @param handler function to call on event trigger
 * @param eventTypes type of event to listen for (e.g. "resize")
 * @param el HTML element on which to bind event listener
 * @param removeListener setting to true will remove the eventListener
 */
export default function useEventListener(
    handler: (event: Event) => void,
    eventTypes: string[],
    el: HTMLElement | null | Document = null,
    removeListener = false,
    listenerOptions?: AddEventListenerOptions
): void {
    // Create a ref that stores handler
    const savedHandler = useRef<(event: Event) => void>();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        if (removeListener) return;

        const eventListener = (event: Event) => {
            savedHandler.current && savedHandler.current(event);
        };

        for (const evt of eventTypes) {
            // Bind the event listener
            (el || window).addEventListener(
                evt,
                eventListener,
                listenerOptions
            );
        }

        return () => {
            for (const evt of eventTypes) {
                // Unbind the event listener on clean up
                (el || window).removeEventListener(
                    evt,
                    eventListener,
                    listenerOptions
                );
            }
        };
    }, [eventTypes, el, removeListener, listenerOptions]);
}
