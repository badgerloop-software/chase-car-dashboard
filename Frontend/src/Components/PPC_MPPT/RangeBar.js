import React from "react";
import { Box } from "@chakra-ui/react";


export default class RangeBar extends React.Component {
  clamp = (x, a, b) => Math.max(a, Math.min(x, b));

  toPercentage = (temp, minv, maxv) => 100 * this.clamp(temp / (maxv - minv), 0, 1);

  render() {
    let valp = this.toPercentage(this.props.val, this.props.min, this.props.max)
    return (
        <>
            <Box
                border="2px"
                w={this.props.w ?? "15vw"}
                h={this.props.h ?? "1.25vh"}
                css={{
                    background: "linear-gradient(to right, #52FF00 " + valp + "%, #FFFFFF " + valp + "% 100%)"
                }}
             />
        </>
      );
  }
}
