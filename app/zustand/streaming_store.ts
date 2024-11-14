import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { SSE_Service } from "~/service/sse_service";

type StreamingStoreState = {
    streaming: SSE_Service | undefined,
    set_streaming(p_streaming: SSE_Service): void,
}

export const useStreamingInputStore = create<StreamingStoreState>()(
    immer((set, get) => ({
        streaming: undefined,

        set_streaming(p_streaming: SSE_Service) {
            set(state => {
                state.streaming = p_streaming;
            })
        }
    })
    )
)