import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Input,
    Button,
    IconButton,
    ButtonGroup,
    Grid,
    Wrap,
    VStack,
    HStack,
    Center,
    Text,
    useDisclosure,
    useBoolean
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SmallCloseIcon, AddIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function CustomGraph(props) {
    const {isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose} = useDisclosure();
    const {isOpen: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose} = useDisclosure();
    const [prevId, setPrevId] = React.useState("");
    const [title, setTitle] = React.useState(props.title);
    let [currentDatasets, setDatasets] = React.useState([]);//props.datasets);
    let [currentColors, setColors] = React.useState([]);
    let [currentDatasetButtons, setDatasetButtons] = React.useState([]);//props.buttons);

    // -------- Update component when switching to another custom graph ----------

    useEffect(() => {
        initializeGraph();
    }, [props.id]);

    // ----------------------- Initialize a saved graph --------------------------

    const initializeGraph = () => {
        const datasets = [];
        const datasetButtons = [];
        let i=0;

        setPrevId(props.id);
        setTitle(props.title);

        for(const key in props.data) {
            if(key !== "timestamps") {
                if(props.datasets.includes(key)) {
                    datasets.push(key);
                    datasetButtons.push(DatasetButton(key, () => removeDataset(key), currentColors[i]));
                }
            }

            i++;
        }

        // Update datasets and buttons
        currentDatasets = datasets;
        currentDatasetButtons = datasetButtons;
        setDatasets(datasets);
        setDatasetButtons(datasetButtons);
    };

    // ------------------------- Change/Validate title ---------------------------

    const changeTitle = (event) => {
        setTitle(event.target.value);
    };

    const isInvalidTitle = ((title === "") || (title.toLowerCase() === "custom"));

    // ---------------- Cancel adding selected datasets -----------------

    const cancelAddDatasets = () => {
        for(const key in props.data) {
            // Don't add timestamps as a dataset
            if(key !== "timestamps") {
                // Check which DataButtons are on and not hidden (indicating that they were just turned on)
                if(!document.getElementById(key + "Btn")?.hidden
                    && (document.getElementById(key + "Btn")?.getAttribute("adddata") === "true")) {
                    // Reset the button so that it is false next time the user opens the Modal
                    document.getElementById(key + "Btn").click();
                }
            }
        }

        // Close the Modal
        onAddClose();
    };

    // --------------------- Add selected datasets ---------------------

    const addDatasets = () => {
        const datasets = [];
        const datasetButtons = [];
        let i=0;

        for(const key in props.data) {
            if(key !== "timestamps") {
                if(document.getElementById(key + "Btn")?.getAttribute("adddata") === "true") {
                    datasets.push(key);
                    datasetButtons.push(DatasetButton(key, () => removeDataset(key), currentColors[i]));

                    // Check if the DataButton was just selected
                    if(!document.getElementById(key + "Btn")?.hidden) {
                        // Make sure the corresponding DataButton is false if shown after its dataset is removed
                        document.getElementById(key + "Btn").click();
                    }
                }
            }

            i++;
        }

        // Close the Modal
        onAddClose();

        // Update datasets and buttons
        currentDatasets = datasets;
        currentDatasetButtons = datasetButtons;
        setDatasets(datasets);
        setDatasetButtons(datasetButtons);
    };

    // ------------ Remove dataset (when attached close icon button is clicked) ----------------

    const removeDataset = (datasetLabel) => {
        // Find the index of the element to be removed
        const datasetIndex = currentDatasets.indexOf(datasetLabel);
        // Copy currentDatasets and currentDatasetButtons without the element at datasetIndex
        const newDatasets = currentDatasets.filter((dataset, idx) => { return (idx !== datasetIndex) });
        const newDatasetButtons = currentDatasetButtons.filter((button, idx) => { return (idx !== datasetIndex) });

        // Update datasets and buttons
        currentDatasets = newDatasets;
        currentDatasetButtons = newDatasetButtons;
        setDatasets(newDatasets);
        setDatasetButtons(newDatasetButtons);
    };

    // ------------ Generate buttons for Modal -----------------

    const populateDataButtons = () => {
        const dataButtons = [];
        let i = 0;
        if(currentColors.length === 0) {
            const rgbStrings = generateColors();
            currentColors = rgbStrings;
            setColors(rgbStrings);
        }

        for(const key in props.data) {
            if(key !== "timestamps") {
                dataButtons.push(DataButton(key, currentDatasets.includes(key), currentColors[i]));
            }
            i++;
        }

        return (
            <>
                {dataButtons}
            </>
        );
    };

    // ------------- Datermine colors for the datasets ----------------

    const generateColors = () => {
        const maxRGB = 225;
        const minRGB = 100;
        var r, g, b;
        const rgbIncrement = Math.floor((maxRGB - minRGB) / Math.floor(Math.cbrt(Object.keys(props.data ?? {"": null}).length)));
        let rgbStrings = [];

        for (r = minRGB; r <= maxRGB; r+= rgbIncrement) {
            for (g = minRGB; g <= maxRGB; g+= rgbIncrement) {
                for (b = minRGB; b <= maxRGB; b+= rgbIncrement) {
                    rgbStrings.push(r + "," + g + "," + b);
                }
            }
        }

        return rgbStrings;
    };

    // ------------- Graph options and data ------------------

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            y: {
                suggestedMin: 0
            }
        },
        plugins: {
            legend: {
                display: false,
            }
        },
    };

    const generateData = (data) => {
        let datasets = [];
        const labels = data?.timestamps ?? [10,9,8,7,6,5,4,3,2,1];

        // Add all datasets in currentDatasets
        for(let i=0; i < currentDatasets.length; i++) {
            const rgb = currentColors[Object.keys(data).indexOf(currentDatasets[i])];

            datasets.push(
                {
                    label: currentDatasets[i],
                    // NOTE Remove faker from package.json when actual data is put in
                    data: data[currentDatasets[i]] ?? labels.map(() => faker.datatype.number({min: 0, max: 100})),
                    borderColor: "rgb(" + rgb + ")",
                    backgroundColor: "rgba(" + rgb + ", 0.5)",
                }
            );
        }

        return {
            labels,
            datasets,
        };
    };

    const saveGraph = () => {
        props.save({
            "datasets": currentDatasets,
            "buttons": currentDatasetButtons,
            "title": title
        });

        onSaveClose();
    };

    return (
        <>
            <HStack h="100%" align="stretch" >
                    <Text
                        css={{
                            writingMode: "vertical-rl",
                            wordBreak: "normal",
                            inlineSize: "100%"
                        }}
                        transform="rotate(180deg)"
                        borderLeftColor="grey.300"
                        borderLeftWidth={1}
                        textAlign="center"
                        maxH="29.5vh"
                        flex={0}
                    >
                        { (title === "") ? "Custom" : title }
                    </Text>
                <VStack
                    pt={1}
                    pr={0.5}
                    align="stretch"
                    spacing={0}
                    flex={1}
                >
                    <Grid templateColumns="1fr 1.35fr 15fr" gap={2} >
                        <Button onClick={ onSaveOpen } colorScheme="blue" >
                            Save
                        </Button>
                        <Button rightIcon={ <AddIcon /> } onClick={ onAddOpen } colorScheme="blue" >
                            Add
                        </Button>
                        <HStack align="stretch" spacing={1} overflowX="scroll" >
                            { currentDatasetButtons }
                        </HStack>
                    </Grid>
                    <Center flex={1}>
                        <Line options={ options } data={ generateData(props.data) } />
                    </Center>
                </VStack>
            </HStack>

            <Modal size="xl" onClose={ cancelAddDatasets } isOpen={ isAddOpen } >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Add Datasets
                    </ModalHeader>
                    <ModalBody>
                        <Wrap spacing={3} justify="center" >
                            { populateDataButtons() }
                        </Wrap>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={2} onClick={ cancelAddDatasets } >
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={ addDatasets } >
                            Add Datasets
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal onClose={ onSaveClose } size="md" isOpen={ isSaveOpen } >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Name Custom Graph
                    </ModalHeader>
                    <ModalBody>
                        <FormControl isRequired isInvalid={ isInvalidTitle } >
                            <FormLabel>Title</FormLabel>
                            <Input
                                value={ title }
                                onChange={ changeTitle }
                                placeholder="Enter graph title"
                            />
                            {!isInvalidTitle ? (
                                <FormHelperText>
                                    Enter a title for this custom graph
                                </FormHelperText>
                            ) : (
                                (title === "") ? (
                                    <FormErrorMessage>
                                        Title is required
                                    </FormErrorMessage>
                                ) : (
                                    <FormErrorMessage>
                                        Invalid title
                                    </FormErrorMessage>
                                )
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={2} onClick={ onSaveClose } >
                            Cancel
                        </Button>
                        <Button disabled={ isInvalidTitle } colorScheme="blue" onClick={ saveGraph } >
                            Save Graph
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

function DataButton(dataLabel, alreadyAdded, rgb) {
    const [flag, setFlag] = useBoolean(false);

    return (
        <Button
            id={dataLabel + "Btn"}
            key={dataLabel + "Btn"}
            hidden={alreadyAdded}
            onClick={setFlag.toggle}
            adddata={(flag || alreadyAdded).toString()}
            size="sm"
            bgColor={flag ? "rgba(" + rgb + ", 0.8)" : "rgba(" + rgb + ", 0.25)"}
            border={"2px"}
            borderColor={"rgb(" + rgb + ")"}
        >
            {dataLabel}
        </Button>
    );
}

function DatasetButton(datasetLabel, removeDataset, rgb) {

    return (
        <ButtonGroup
            id={datasetLabel + "BtnGrp"}
            key={datasetLabel + "BtnGrp"}
            size="xs"
            isAttached
        >
            <Button
                id={datasetLabel + "Btn2"}
                key={datasetLabel + "Btn2"}
                bgColor={"rgba(" + rgb + ", 0.7)"}
                border="1px"
                borderColor={"rgb(" + rgb + ")"}
            >
                {datasetLabel}
            </Button>
            <IconButton
                id={datasetLabel + "IcnBtn"}
                key={datasetLabel + "IcnBtn"}
                value={ datasetLabel }
                onClick={ removeDataset }
                bgColor={"rgba(" + rgb + ", 0.7)"}
                border="1px"
                borderColor={"rgb(" + rgb + ")"}
                icon={<SmallCloseIcon />}
            />
        </ButtonGroup>
    );
}
