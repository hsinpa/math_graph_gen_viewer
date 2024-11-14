import { useContext, useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { API, GetDomain, StreamingEvent, StreamingType } from "~/utility/api_static";
import { StreamingUITool } from "~/utility/streaming_ui_tool";
import { useStreamingInputStore } from "~/zustand/streaming_store";
import Latex from "react-latex-next";
import { json } from "@remix-run/react";
import { OptionsType, OptionType } from "~/type/question_type";
import { useQuestionInputStore } from "~/zustand/question_store";
import { Math_Options_Component } from "./math_option_component";
import 'katex/dist/katex.min.css';


export const MathQuizComponent = function() {
    const [session_id, set_session] = useState(uuidv4());
	const sse = useStreamingInputStore(x=>x.streaming);
    const question_store = useQuestionInputStore();

    const svgDomRef = useRef<HTMLDivElement>(null);

    const latex_delimiter = [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: true },
        { left: '$', right: '$', display: true },
        { left: '\\[', right: '\\]', display: true },
      ]

    const fetch_client_data = async function() {
        let url = GetDomain(API.GenerateMathQuestion);
        let data = {session_id: session_id, streaming_id: sse?._sse_id }
        let fetch_r = await fetch(url, {method:'post', body: JSON.stringify(data) , headers: {"Content-Type": "application/json", "accept": "application/json"} } )
        let json_r = await fetch_r.json();
    }

    const on_question_streaming = function(session_id: string, content: string, complete: boolean) {
        if (complete) {
            console.log(JSON.parse(content)['question']);
            question_store.set_q_title(JSON.parse(content)['question']);
        }
    }

    const on_svg_streaming = function(session_id: string, content: string, complete: boolean) {
        question_store.set_svg(content);

        if (svgDomRef.current != null) {
            svgDomRef.current.innerHTML = content;
        }
    }

    const on_option_streaming = function(session_id: string, content: string, complete: boolean) {
        if (complete) {
            console.log(content)

            let options_type: OptionsType = JSON.parse(content);
            question_store.set_options(options_type.options);
        }
    }

    const on_fetch_btn_click = function(e: React.MouseEvent<HTMLButtonElement>) {
        let btn_dom: HTMLButtonElement = e.target as HTMLButtonElement;

        fetch_client_data();
        btn_dom.style.display = 'none';
    }

    useEffect(()=> {
        if (sse == undefined) return;

        let streaming_tool = new StreamingUITool(sse);
        
        if (sse != undefined && session_id != undefined) {

            // fetch_client_data();

            streaming_tool.register_callback(StreamingEvent.question, on_question_streaming);
            streaming_tool.register_callback(StreamingEvent.svg, on_svg_streaming);
            streaming_tool.register_callback(StreamingEvent.option, on_option_streaming);
        }


        // let test_options = {
        //     "options": [
        //         {
        //             "option": "(x - 2)(x + 8)",
        //             "explanation": ""
        //         },
        //         {
        //             "option": "(x + 4)(x - 4)",
        //             "explanation": "This is a difference of squares and does not match the original expression."
        //         },
        //         {
        //             "option": "(x + 2)(x + 8)",
        //             "explanation": "This option incorrectly adds instead of subtracting, which does not match the original expression."
        //         },
        //         {
        //             "option": "(x - 8)(x + 2)",
        //             "explanation": "This option is a misplacement of signs and does not yield the correct product."
        //         }
        //     ],
        //     'correct_answer_indices': 1
        // }

        // question_store.set_options(test_options.options);

        return () => {
            streaming_tool.dispose();
        }
    }, [sse])

    return (
        <div>
            <button className="rounded-md border-solid border-2 border-slate-300 p-2 hover:border-sky-500" onClick={on_fetch_btn_click}>Fetch a new question</button>

            <div className="flex gap-2 flex-col">
                <div className="whitespace-pre-wrap"><Latex>{question_store.question_title}</Latex></div>
                <div ref={svgDomRef}></div>
                <Math_Options_Component options={question_store.options}></Math_Options_Component>
                <button className="rounded-md border-solid border-2 border-slate-400 p-1 w-24 hover:border-sky-500" onClick={(x) => {
                    x.currentTarget.style.display = 'none';
                    question_store.set_reveal_answer(true)
                }} 
                    style={{display: question_store.options.length > 0 ? 'block' : 'none'}}
                    >Submit</button>
            </div>

        </div>
    )
}