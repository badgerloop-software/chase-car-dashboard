import { Box } from "@chakra-ui/react";

export default function RangeBar(props) {
  const clamp = (x, a, b) => Math.max(a, Math.min(x, b));

  const toPercentage = (temp, minv, maxv) => 100 * clamp((temp - minv) / (maxv - minv), 0, 1);

  let valp = toPercentage(props.val, props.min, props.max)

  return (
    <Box
      border="2px"
      w={props.w}
      h={props.h ?? "1.25vh"}
      css={{ background: "linear-gradient(to right, #52FF00 " + valp + "%, #FFFFFF " + valp + "% 100%)" }}
      />
  );
}
