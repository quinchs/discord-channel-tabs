export default class ColorConverter {
    static getDarkness(color: any): number;
    static hex2int(color: any): number;
    static hex2rgb(color: any): string;
    static int2hex(color: any): string;
    static int2rgba(color: any, alpha: any): string;
    static isValidHex(color: any): boolean;
    /**
     * Will get the red green and blue values of any color string.
     * @param {string} color - the color to obtain the red, green and blue values of. Can be in any of these formats: #fff, #ffffff, rgb, rgba
     * @returns {Array<number>} - array containing the red, green, and blue values
     */
    static getRGB(color: string): Array<number>;
    /**
     * Will get the darken the color by a certain percent
     * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
     * @param {number} percent - percent to darken the color by (0-100)
     * @returns {string} - new color in rgb format
     */
    static darkenColor(color: string, percent: number): string;
    /**
     * Will get the lighten the color by a certain percent
     * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
     * @param {number} percent - percent to lighten the color by (0-100)
     * @returns {string} - new color in rgb format
     */
    static lightenColor(color: string, percent: number): string;
    /**
     * Converts a color to rgba format string
     * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
     * @param {number} alpha - alpha level for the new color
     * @returns {string} - new color in rgb format
     */
    static rgbToAlpha(color: string, alpha: number): string;
}
