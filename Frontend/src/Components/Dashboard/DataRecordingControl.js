import {
    Box,
    Image, Tooltip,
    Button, FormControl, FormLabel,
    HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger, Select, useColorMode, useDisclosure, 
    VStack, Checkbox, CheckboxGroup, Text,
} from "@chakra-ui/react";
import Draggable from 'react-draggable';
import { useState, useEffect, useLayoutEffect, useRef, useMemo, memo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsFillRecordCircleFill } from "react-icons/bs";
import ConvertIcon from "./Convert Icon.png";
import getColor from "../Shared/colors";
import { ROUTES } from "../Shared/misc-constants";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";

// Compulsory toast-configuration method
toast.configure();


function DataRecordingControl(props) {
    // ------------------------------------------ Color mode --------------------------------------------
    // Get system color mode
    const {colorMode} = useColorMode();
    // Get colors depending on color mode
    const selectTxtCol = useMemo(()=> getColor("selectTxt", colorMode),[colorMode]);
    const selectTxtFocusCol = useMemo(() => getColor("selectTxtFocus", colorMode), [colorMode]);
    const selectBgCol = useMemo(() => getColor("selectBg", colorMode), [colorMode]);

    const [createButtonColor, setCreateButtonColor] = useState(selectTxtCol);
    const [processButtonColor, setProcessButtonColor] = useState(selectTxtCol);
    const [recordButtonColor, setRecordButtonColor] = useState(selectTxtCol);

    const changeButtonColor = (event) => {
        switch(event.target.id) {
            case 'create':
                setCreateButtonColor(selectTxtFocusCol);
                break;
            case 'process':
                setProcessButtonColor(selectTxtFocusCol);
                break;
            case 'record':
                setRecordButtonColor(selectTxtFocusCol);
                break;
        }
    }

    const changeButtonColorBack = (event) => {
        switch(event.target.id) {
            case 'create':
                setCreateButtonColor(selectTxtCol);
                break;
            case 'process':
                setProcessButtonColor(selectTxtCol);
                break;
            case 'record':
                setRecordButtonColor(selectTxtCol);
                break;
        }
    }

    // ------------------------------------------ Data recording controls --------------------------------------------

    const MIN_REFRESH_RATE = 100;
    const MAX_REFRESH_RATE = 3000;

    const [selectedElements, setSelectedElements] = useState({
        Errors: false,
        GraphData1: false,
        GraphData2: false,
        GraphData3: false,
        DataClusters: false
    });

    // State for refresh rate (default: 300ms)
    const [refreshRates, setRefreshRates] = useState({});
    const [refreshRate, setRefreshRate] = useState(300);

    useEffect(() => {
        // Initialize refresh rates to 300ms for each element
        setRefreshRates((prev) => {
            const newRates = { ...prev };
            Object.keys(selectedElements).forEach((key) => {
                if (!(key in newRates)) {
                    newRates[key] = 300;
                }
            });
            return newRates;
        });
    }, [selectedElements]);

    const [savedSettings, setSavedSettings] = useState({
        refreshRate: 300,
        selectedElements: { ...selectedElements }
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedElements((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleRefreshRateChange = (key, value) => {
        const numericValue = Number(value);
        if (value === "" || (numericValue >= MIN_REFRESH_RATE && numericValue <= MAX_REFRESH_RATE)) {
            setRefreshRates((prev) => ({
                ...prev,
                [key]: value === "" ? "" : numericValue,
            }));
        } else {
            toast.error(`Refresh rate must be between ${MIN_REFRESH_RATE} and ${MAX_REFRESH_RATE} ms.`);
        }
    };

    const handleSaveSettings = () => {
        let hasError = false;
    
        if (refreshRate < MIN_REFRESH_RATE || refreshRate > MAX_REFRESH_RATE) {
            toast.error(`Setting saving failed: Refresh rate must be between ${MIN_REFRESH_RATE} and ${MAX_REFRESH_RATE} ms.`);
            hasError = true;
        }
    
        // Validate individual refresh rates
        Object.entries(refreshRates).forEach(([key, rate]) => {
            if (rate < MIN_REFRESH_RATE || rate > MAX_REFRESH_RATE) {
                toast.error(`Setting saving failed: ${key} refresh rate must be between ${MIN_REFRESH_RATE} and ${MAX_REFRESH_RATE} ms.`);
                hasError = true;
            }
        });
    
        if (hasError) return;
    
        setRefreshRates((prev) => {
            const updatedRates = { ...prev };
            Object.keys(selectedElements).forEach((key) => {
                if (selectedElements[key]) {
                    updatedRates[key] = refreshRate;
                }
            });
            return updatedRates;
        });
    
        setSavedSettings({
            refreshRate: refreshRate,
            selectedElements: { ...selectedElements }
        });
    
        setSelectedElements((prevElements) => {
            const updatedElements = {};
            Object.keys(prevElements).forEach((key) => {
                updatedElements[key] = false;
            });
            return updatedElements;
        });
    
        setRefreshRate("");
    
        toast.success("Settings saved successfully!");
    };

    const finalModalRef = useRef();
    const createRef = useRef();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const startTimeChanged = (event) => setStartTime(event.target.value);
    const endTimeChanged = (event) => setEndTime(event.target.value);

    const triggerDownload = () => {
        const startTimeUnix = Math.round(new Date(startTime).getTime());
        const endTimeUnix = Math.round(new Date(endTime).getTime());

        window.open('http://localhost:4001/'
            + ROUTES.GET_PROCESSED_DATA
            + '?start_time=' + startTimeUnix
            + '&end_time=' + endTimeUnix);
    };

    return (
        <>
            <Draggable bounds='parent'>
                <Box
                    zIndex='overlay'
                    position='absolute'
                    bottom='50px'
                    left='50px'
                >
                    <Popover
                        placement='right'
                        initialFocusRef={createRef}
                    >
                        <PopoverTrigger>
                            <Button
                                ref={finalModalRef}
                                w='46px'
                                h='46px'
                                p={0}
                                borderWidth='5px'
                                borderColor='#ff0000'
                                borderRadius='full'
                                boxShadow='md'
                                bgColor='#00000000'
                            >
                                <Box w='20px' h='20px' borderRadius='full' m={0} bgColor='#ff0000' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent pt={5} w='max-content'>
                            <PopoverCloseButton/>
                            <PopoverBody>
                                <VStack>
                                    <HStack style={{marginBottom: "0.5em"}}>
                                        <Tooltip label='Beginning date/time'>
                                            <Input
                                                placeholder="Beginning date/time"
                                                size='sm'
                                                onChange={startTimeChanged}
                                                type='datetime-local'
                                            />
                                        </Tooltip>
                                        <Tooltip label='Ending date/time'>
                                            <Input
                                                placeholder="Ending date/time"
                                                size='sm'
                                                onChange={endTimeChanged}
                                                type='datetime-local'
                                            />
                                        </Tooltip>
                                        <Tooltip label='Download recorded data in an Excel file'>
                                            <Button
                                                id='create'
                                                width={"12em"}
                                                bgColor={selectBgCol}
                                                color={createButtonColor}
                                                size='sm'
                                                onClick={triggerDownload}
                                                onMouseEnter={changeButtonColor}
                                                onMouseLeave={changeButtonColorBack}
                                            >
                                                Download
                                            </Button>
                                        </Tooltip>
                                    </HStack>
                                    <FormControl>
                                        <HStack spacing={1}>
                                            <FormLabel mb={0}>Refresh Rate (ms):</FormLabel>
                                            <Input
                                                type="number"
                                                value={refreshRate === "" ? "" : refreshRate}
                                                min={100}
                                                max={5000}
                                                step={1}
                                                onChange={(e) => {
                                                    const value = e.target.value.trim(); 
                                                    if (value === "") {
                                                        setRefreshRate(""); 
                                                        return;
                                                    }
                                                    const numValue = Number(value);
                                                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10000) {
                                                        setRefreshRate(numValue);
                                                    }
                                                }}
                                                height="3vh"
                                                width={"5vw"}
                                            />
                                        </HStack>
                                    </FormControl>
                                    <CheckboxGroup>
                                        <HStack align="start" spacing={3}>
                                            {Object.keys(selectedElements).map((key) => (
                                                <Box key={key}>
                                                    <Checkbox
                                                        name={key}
                                                        isChecked={selectedElements[key]}
                                                        onChange={handleCheckboxChange}
                                                    >
                                                        {key}
                                                    </Checkbox>
                                                    <Text fontSize="xs" color="gray.500">
                                                        Current: {refreshRates[key] || refreshRate}ms
                                                    </Text>
                                                </Box>
                                            ))}
                                        </HStack>
                                    </CheckboxGroup>
                                    <Button
                                        width={"12em"}
                                        bgColor={selectBgCol}
                                        color={selectTxtCol}
                                        size='sm'
                                        onClick={handleSaveSettings} 
                                    >
                                        Save Settings
                                    </Button>
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
            </Draggable>
        </>
    );
}

export default memo(DataRecordingControl);