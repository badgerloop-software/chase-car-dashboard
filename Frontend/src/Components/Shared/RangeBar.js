import { Box, useColorModeValue } from "@chakra-ui/react";
import colors from "./colors";

export default function RangeBar(props) {
  const clamp = (x, a, b) => Math.max(a, Math.min(x, b));

  const toPercentage = (temp, minv, maxv) => 100 * clamp((temp - minv) / (maxv - minv), 0, 1);

  // https://stackoverflow.com/a/17243070
  const HSVtoRGB = (hsv) => {
    const [h, s, v] = [hsv[0], hsv[1], hsv[2]];
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  };

  // https://stackoverflow.com/a/17243070
  const RGBtoHSV = (rgb) => {
    const [r, g, b] = [rgb[0], rgb[1], rgb[2]];
    let max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

    switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [h, s, v]
  }

  // Function that interpolates color (3-element array) from startCol to endCol by pct (0 <= pct <= 1)
  const lerpColor = (startCol, endCol, pct) =>
    Array.from(Array(3), (_, i) => (startCol[i] + pct * (endCol[i] - startCol[i])));

  let valp = toPercentage(props.val, props.min, props.max);

  const green = [0x52, 0xFF, 0x00];
  const red = [0xFF, 0x01, 0x01];

  let color;
  const lb = 35, ub = 65;
  if (valp < lb) {
    // Color is interpolated btw red and green depending on distance from lower bound (lb)
    color = HSVtoRGB(lerpColor(RGBtoHSV(red), RGBtoHSV(green), valp / lb));
  } else if (valp > ub) {
    // Color is interpolated btw red and green depending on distance from upper bound (ub)
    color = HSVtoRGB(lerpColor(RGBtoHSV(green), RGBtoHSV(red), (valp - ub) / (100 - ub)));
  } else {
    color = green;
  }

  const colorStr = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

  const bgColorStr = useColorModeValue(colors.light.background, colors.dark.background);

  return (
    <Box
      border={props.border ?? "2px"}
      borderRadius={props.borderRadius}
      w={props.w}
      h={props.h ?? "1.25vh"}
      css={{ background: "linear-gradient(to right, " + colorStr + valp + "%, " + bgColorStr + " " + valp + "% 100%)" }}
      />
  );
}
