
export interface OptionType {
    option: string,
    explanation: string
}

export interface OptionsType {
    options: OptionType[],
    correct_answer_indices: number,
}