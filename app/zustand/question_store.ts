import { create } from "zustand";
import { OptionType } from "~/type/question_type"
import { immer } from "zustand/middleware/immer";

type QuestionStoreState = {
    question_title: string,
    svg_code: string,
    options: OptionType[],
    correct_answer_indices: number,

    selected_index: number,
    reveal_answer: boolean,

    set_q_title: (t: string) => void,
    set_svg: (code: string) => void,
    set_options:  (options: OptionType[]) => void,
    set_correct_answer_indices:  (i: number) => void,

    set_selected_index: (i: number) => void,
    set_reveal_answer: (answer: boolean) => void,
}

export const useQuestionInputStore = create<QuestionStoreState>()(
    immer((set, get) => ({
        question_title: '',
        svg_code: '',
        options: [],

        correct_answer_indices: 0,
        selected_index: 0,
        reveal_answer: false,

        set_q_title(t: string) {
            set(state => {
                state.question_title = t;
            })
        },

        set_svg(code: string) {
            set(state => {
                state.svg_code = code;
            })
        },     
    
        set_options(options: OptionType[]) {
            set(state => {
                state.options = options;
            })
        },

        set_correct_answer_indices(i: number) {
            set(state => {
                state.correct_answer_indices = i;
            })
        },

        set_selected_index(i: number) {
            set(state => {
                state.selected_index = i;
            })
        },

        set_reveal_answer(answer: boolean) {
            set(state => {
                state.reveal_answer = answer;
            })
        },
    })
    )
)