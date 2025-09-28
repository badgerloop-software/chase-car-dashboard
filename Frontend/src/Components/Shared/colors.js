export const colors = {
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
 * Returns a hexadecimal color string corresponding to the provided key and color mode.
 * If the color is not found, it defaults to a readable shade of gray.
 *
 * @param key The description of the color you want to retrieve (e.g. "border" and "selectTxt")
 * @param colorMode The color mode, "light" or "dark"
 * @returns {string} The corresponding color string.
 */
export default function getColor(key, colorMode) {
  // Safely check if the color exists.
  if (colors?.[colorMode]?.hasOwnProperty(key)) {
    // If it exists, return the correct color.
    return colors[colorMode][key];
  }

  // If the color doesn't exist, select a readable gray for the best contrast.
  const fallbackColor = colorMode === 'dark' ? '#CCCCCC' : '#4A5568';

  console.warn(`Color key "${key}" not found for mode "${colorMode}". Using fallback color ${fallbackColor}.`);
  return fallbackColor;
}