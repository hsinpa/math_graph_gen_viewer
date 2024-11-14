import { SSE_Service } from "~/service/sse_service";

export interface StreamingType {
    event: string,
    session_id: string,
    data: string,
    type: 'complete' | 'chunk'
}

export type CallbackFunction = ((session_id: string, content: string, complete: boolean) => void) | undefined;

export class StreamingUITool {
    private _streaming_dict: Map<string, string>;
    private _callback_dict: Map<string, CallbackFunction>;
    private _sse_service: SSE_Service;

    constructor(sse_service: SSE_Service ) {
        this._sse_service = sse_service;
        this._streaming_dict = new Map();
        this._callback_dict = new Map();
    }

    register_callback(event_name: string, callback: CallbackFunction) {
        this._callback_dict.set(event_name, callback);
        this._sse_service.ListenToEvent(event_name, this.on_socket_callback.bind(this));
    }

    dispose() {
        let self = this;
        this._callback_dict.forEach( (value, key) => {
            self._sse_service.Deregister(key);
        });
    }

    private on_socket_callback(event_name: string, socket_data: any) {
        if (!this._callback_dict.has(event_name)) return;

        let callback = this._callback_dict.get(event_name);

        if (callback == undefined) return;

        let streaming_data: StreamingType = socket_data;
        let final_text = '';

        if (socket_data.type == 'chunk') {
            let cache_content = this._streaming_dict.get(streaming_data.session_id);

            if (cache_content == undefined) cache_content = ''
            
            final_text = cache_content + streaming_data.data;
            
            this._streaming_dict.set(streaming_data.session_id, final_text);
        } else {
            // Complete
            final_text = streaming_data.data;

            localStorage.setItem(streaming_data.session_id, final_text);
            this._streaming_dict.delete(streaming_data.session_id);
        }

        callback(streaming_data.session_id, final_text, socket_data.type != 'chunk');
    }
}