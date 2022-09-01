import { SimpleGrid } from "@chakra-ui/react";
import CellGroup from "./CellGroup";

export default function BatteryCells(props) {
    const cellGroupsPerRow = 3; // Number of items/cell groups per row in the grid
    const cellGroupsPerCol = 10; // Number of items/cell groups per column in the grid
    // Array with the same number of elements as the SimpleGrid containing all the CellGroups
    const gridSizedArray = Array(cellGroupsPerRow * cellGroupsPerCol).fill(0);

    return (
        <SimpleGrid
            columns={cellGroupsPerRow}
            rows={cellGroupsPerCol}
            spacingX={'0.25vw'}
            spacingY={'0.25vh'}
            overflowY='scroll'
            borderTopColor='black'
            borderTopWidth={1}
        >
            { /* Map the CellGroups using gridSizedArray */
                gridSizedArray.map((val,idx) => {
                    return(
                        <CellGroup
                            key={idx + 1}
                            groupNum={idx + 1}
                            voltage={props.data ? props.data[`cell_group${idx + 1}_voltage`][0] : -1.0}
                        />
                    );
                })
            }
        </SimpleGrid>
    );
}
