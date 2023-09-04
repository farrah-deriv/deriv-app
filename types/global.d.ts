declare global {
    interface Window {
        LiveChatWidget: {
            init: () => void;
            on: (key: string, callback: (e: { greeting?: { id: number } }) => void) => void;
            get: (key: string) => any;
            call: (key: string, value?: any) => void;
        };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
            hide_chat_window: VoidFunction;
        };
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
    }
}

export {};
