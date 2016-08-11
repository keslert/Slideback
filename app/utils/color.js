import tinycolor from 'tinycolor2';

export function getColor(fillValue, fillColorValue, opacityValue, theme) {

    if(fillValue == 0) {
        // return null;
    }

    const hex = Array.isArray(fillColorValue) ? theme[fillColorValue[1] - 1] : fillColorValue;
    const color = tinycolor(hex);
    color.setAlpha(opacityValue);
    return color.toRgbString();
}