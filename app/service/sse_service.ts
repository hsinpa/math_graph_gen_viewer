import { format_string } from "~/utility/utility_method";
import { v4 as uuidv4 } from 'uuid';
import EventSystem from "~/utility/event_system";

export class SSE_Service extends EventSystem {
    _sse_id: string = '';
    _event_source: EventSource | null = null;

    constructor() {
        super();
        this._sse_id = uuidv4();
    }

    connect(url: string, on_complete?: (status: boolean) => void) {
        let self = this;
        
        if (this._event_source != null)
            return;

        this._event_source = new EventSource( format_string(url, [this._sse_id]));

        this._event_source.onopen = (e) => {
            console.log('SSE Open');
            on_complete?.(true)
        }

        this._event_source.onmessage = (e) => {
            // console.log('Received:', e.data);
            try {
                let event_json = JSON.parse(e.data);
                
                if (! ('event' in event_json)) return;

                this.Notify(event_json['event'], event_json);
            } catch(e) {
                console.error('Socket message parse', e)
            }

        };
          
        this._event_source.onerror = (e) => {
            console.error('EventSource failed:', e);

            self._event_source?.close()
            self._event_source = null;
        };
    }
    
}