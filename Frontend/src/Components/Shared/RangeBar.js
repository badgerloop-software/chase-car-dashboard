import { Box } from "@chakra-ui/react";

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

  const lerpColor = (startCol, endCol, pct) =>
    Array.from(Array(3), (_, i) => (startCol[i] + pct * (endCol[i] - startCol[i])));

  let valp = toPercentage(props.val, props.min, props.max);

  const green = [0x52, 0xFF, 0x00];
  const yellow = green; // I think this looks better than: [0xF6, 0xFF, 0x00];
  const red = [0xFF, 0x01, 0x01];

  let color;
  let lb = 25, ub = 75;
  if (valp < lb) {
    color = HSVtoRGB(lerpColor(RGBtoHSV(red), RGBtoHSV(yellow), valp / lb));
  } else if (valp > ub) {
    color = HSVtoRGB(lerpColor(RGBtoHSV(yellow), RGBtoHSV(red), (valp - ub) / (100 - ub)));
  } else {
    color = green;
  }

  const colorStr = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

  return (
    <Box
      border="2px"
      w={props.w}
      h="1.25vh"
      css={{ background: "linear-gradient(to right, " + colorStr + valp + "%, #FFFFFF " + valp + "% 100%)" }}
      />
  );
}
