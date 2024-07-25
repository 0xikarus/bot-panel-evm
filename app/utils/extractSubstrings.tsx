export const extractSubstrings = (input: string, length: number): string | null => {
    let firstSix = input.substr(0, length);
    let lastSix = input.substr(-length);

    return firstSix + "..." + lastSix;
}