export const SSE_DOMAIN = "http://localhost:8080/sse/{0}";

export const API = Object.freeze({
    GenerateMathQuestion: 'api/v1/nyquiz/agenerate_math_quiz'
});

export const StreamingEvent = Object.freeze({
    question: 'question',
    svg: 'svg',
    option: 'option',
});

export const StreamingType = Object.freeze({
    Chunk: 'chunk',
    Complete: 'complete'
});

export const GetDomain = function(url: string) {
    return import.meta.env.VITE_API_DOMAIN + url;
}