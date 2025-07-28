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
    VStack
} from "@chakra-ui/react";
import Draggable from 'react-draggable';
import { useState, useLayoutEffect, useRef, useMemo, memo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsIcon } from 'react-icons/bs/index.esm.js';
import ConvertIcon from "./Convert Icon.png";
import getColor from "../Shared/colors.js";
import { ROUTES } from "../Shared/misc-constants.js";

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
    }

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
