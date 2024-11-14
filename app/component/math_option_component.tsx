import { OptionType } from "~/type/question_type"
import 'katex/dist/katex.min.css';
import Latex from "react-latex-next";
import { useQuestionInputStore } from "~/zustand/question_store";

export const Math_Option_Component = function({option, index}: {option: OptionType, index: number}) {
    let set_option_index = useQuestionInputStore(x=>x.set_selected_index)
    let reveal_answer = useQuestionInputStore(x=>x.reveal_answer)
    let correct_answer_indices = useQuestionInputStore(x=>x.correct_answer_indices)

    let label_style = "text-neutral-950"
    if (reveal_answer) {
        label_style = (correct_answer_indices == index) ? "text-emerald-600" : "text-red-600";
    }

    let explanation_style = "text-red-600 hidden"
    if (reveal_answer) {
        explanation_style = "text-red-600 block"
    }

    // style={{display: question_store.options.length > 0 ? 'block' : 'none'}}

    return <div>
        <label className="flex gap-2">
            <input name='quiz_option' type='radio' onClick={() => {
                set_option_index(index);
            }} disabled={reveal_answer} ></input>
            <p className={label_style}><Latex>{option.option}</Latex></p>
        </label>
        <p className={explanation_style}>{option.explanation}</p>
    </div>;
}

export const Math_Options_Component = function({options}: {options: OptionType[]}) {

    return (
        <fieldset className="flex gap-2 flex-col" >            
            {
                options.map( (x, index) => <Math_Option_Component key={index} option={x} index={index}></Math_Option_Component>)
            }
        </fieldset>
    )
}