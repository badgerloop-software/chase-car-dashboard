const colors = {
    light: {
        background: "#ffffff",
        header: "#DDDDDD",
        border: "#000000",
        selectBg: "#494949",
        selectTxt: "#ffffff",
        selectTxtFocus: "#000000",
        optionTxt: "#000000",
        grid: "#E5E5E5",
        gridBorder: "#CECECE",
        ticks: "#666666",
        redBg: "#FF010140",
        txtRedBg: "#000000",
        greenBg: "#05FF00",
        txtGreenBg: "#000000",
        errorBg: "#ff000055",
        contentBg: '#f7fafc'
    },
    dark: {
        background: "#1A202C",
        header: "#2D3748",
        border: "#A0AEC0",
        selectBg: "#718096",
        selectTxt: "#ffffff",
        selectTxtFocus: "#ffffff",
        optionTxt: "#ffffff",
        grid: "#646464",
        gridBorder: "#4D4D4D",
        ticks: "#FFFFFF",
        redBg: "#FF010140",
        txtRedBg: "#ffffff",
        greenBg: "#05FF00",
        txtGreenBg: "#282828",
        errorBg: "#ff000055",
        contentBg: "#4a5568"
    }
};

/**
 * Returns a hexadecimal color string corresponding to the provided key and color mode. Returns null if that pair does
 * not exist.
 *
 * @param key The description of the color you want to retrieve (e.g. "border" and "selectTxt")
 * @param colorMode The color mode, "light" or "dark"
 * @returns {null|*} The color corresponding to the provided key and color mode or null if that key does not exist for
 *                   the given color mode.
 */
export default function getColor(key, colorMode) {
    // Return color depending on color mode and key. If the key does not exist for the given color mode, return null
    if(colors[`${colorMode}`].hasOwnProperty(key)) {
        return colors[`${colorMode}`][key];
    } else {
        console.warn(`There is no ${colorMode} mode value of ${key}`);
        return null;
    }
}
