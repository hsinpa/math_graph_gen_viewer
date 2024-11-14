export let clamp = function(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
};

export function format_string(string: string, params: any[]) {
    return string.replace(/{(\d|\w+)}/g, (match, index) => {
        return typeof params[index] !== 'undefined' ? params[index] : match;
    });
}

export function sleep(timestamp: number){ 
    return new Promise(r => setTimeout(r, timestamp));
}
