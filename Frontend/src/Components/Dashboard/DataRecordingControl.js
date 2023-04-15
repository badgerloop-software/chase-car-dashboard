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
import { useState, useLayoutEffect, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsFillRecordCircleFill } from "react-icons/bs";
import ConvertIcon from "./Convert Icon.png";
import getColor from "../Shared/colors";
import { ROUTES } from "../Shared/misc-constants";

// Compulsory toast-configuration method
toast.configure();


export default function DataRecordingControl(props) {
    // ------------------------------------------ Color mode --------------------------------------------
    // Get system color mode
    const {colorMode} = useColorMode();
    // Get colors depending on color mode
    const selectTxtCol = getColor("selectTxt", colorMode);
    const selectTxtFocusCol = getColor("selectTxtFocus", colorMode);
    const selectBgCol = getColor("selectBg", colorMode);

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

    const { isOpen, onOpen, onClose } = useDisclosure();

    const initialModalRef = useRef();
    const finalModalRef = useRef();

    const createRef = useRef();
    const recordRef = useRef();

    const [sessionsList, setSessionsList] = useState({ data: null });

    const [currentSession, setCurrentSession] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [sessionFileName, setSessionFileName] = useState("");

    // Get the list of available sessions from the backend
    const getSessionsList = async () => {
        const response = await fetch(ROUTES.GET_SESSION_LIST);
        if (response.status === 200) {
            const body = await response.json();
            return body;
        }
        console.error("Error retrieving sessionsList");
        return;
    };

    // Get the initial list of sessions
    useLayoutEffect(() => {
        getSessionsList().then((res) => {
            setSessionsList({ data: res.response });
        }).catch((err) => console.error("error", err));
    }, []);

    // Convert recorded raw binary data to a formatted Excel csv
    const processRecordedData = async () => {
        const response = await fetch(ROUTES.PROCESS_RECORDED_DATA);
        if (response.status === 200) {
            const body = await response.json();
            return body;
        }
        console.error("Error processing recorded data");
        return;
    };

    // Toggle isRecording and send it to the backend to toggle its recording state
    const recordCarData = () => {
        fetch('http://localhost:4001' + ROUTES.SET_RECORD, {
            method: "POST",
            body: JSON.stringify({ doRecord: !isRecording }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("rcd res::", data);
            if (data.response === "NoFile") {
                console.warn("Attempted to record data with an empty file name");
            }
            if (data.response === "Recording") {
                //Then Request is sent
                setIsRecording(!isRecording);
            } else {
                setIsRecording(false);
                // Handle the error
                alert("Something went wrong");
            }
        }).catch((e) => {
            setIsRecording(false);
            console.error("Error:", e);
        });
    }

    // Set the current recording session according to the file name selected
    const setCurrentRecordingSession = (fileName) => {
        fetch('http://localhost:4001' + ROUTES.SET_RECORDING_SESSION, {
            method: "POST",
            body: JSON.stringify({ fileName: fileName }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("crs res::", data);
            if (data.response === -1) {
                toast("Empty name");
                return;
            }
            if (data.response === 200) {
                setCurrentSession(fileName);
                toast("Current recording session is set");
            } else {
                // Handle the error
                toast("Something went wrong");
            }
        }).catch((e) => {
            console.error("Error:", e);
        });
    }

    // Create a new recording session with the specified file name
    const createRecordingSession = (fileName) => {
        fetch('http://localhost:4001' + ROUTES.CREATE_RECORDING_SESSION, {
            method: "POST",
            body: JSON.stringify({ fileName: fileName }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("crs res::", data);
            if (data.response === "Empty") {
                alert("Empty feild");
                return;
            }
            if (data.response === "Created") {
                // Get the updated sessions list
                getSessionsList().then((res) => {
                    setSessionsList({ data: res.response });
                }).catch((err) => console.log("error", err));
                setCurrentSession(fileName);

                toast("Session file has been created!!");
                //Then Request is sent
            } else {
                // Handle the error
                alert("Something went wrong");
            }

        }).catch((e) => {
            console.error("Error:", e);
        });
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
                        initialFocusRef={currentSession ? recordRef : createRef}
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
                                        <Select
                                            disabled={isRecording}
                                            width={"15em"}
                                            placeholder={"Select session to view"}
                                            value={currentSession}

                                            onChange={(e) => {
                                                console.log('current value', e.target.value)
                                                setCurrentRecordingSession(e.target.value)
                                            }}
                                        >
                                            {sessionsList?.data?.map((name, i) => {
                                                return (<option key={i} value={name}>{name}</option>)
                                            })}
                                        </Select>
                                        <Tooltip label='Create new recording session'>
                                            <Button
                                                id='create'
                                                disabled={isRecording}
                                                ref={createRef}
                                                width={"auto"}
                                                bgColor={selectBgCol}
                                                color={createButtonColor}
                                                size='sm'
                                                onClick={onOpen}
                                                onMouseEnter={changeButtonColor}
                                                onMouseLeave={changeButtonColorBack}
                                            >
                                                + Create
                                            </Button>
                                        </Tooltip>
                                    </HStack>
                                    {
                                        currentSession ?
                                            <HStack>
                                                <Tooltip label='Export to Excel'>
                                                    <Button
                                                        id='process'
                                                        disabled={isRecording}
                                                        width={"auto"}
                                                        bgColor={selectBgCol}
                                                        color={processButtonColor}
                                                        size='sm'
                                                        onMouseEnter={changeButtonColor}
                                                        onMouseLeave={changeButtonColorBack}
                                                        onClick={async () => {
                                                            processRecordedData()
                                                        }}
                                                    >
                                                        <Image src={ConvertIcon} fit='scale-down' boxSize='2.75vh'/>
                                                    </Button>
                                                </Tooltip>

                                                <Tooltip label={isRecording ? 'Stop recording' : 'Start recording'}>
                                                    <Button
                                                        id='record'
                                                        ref={recordRef}
                                                        width={"auto"}
                                                        bgColor={selectBgCol}
                                                        color={recordButtonColor}
                                                        size='sm'
                                                        onMouseEnter={changeButtonColor}
                                                        onMouseLeave={changeButtonColorBack}
                                                        onClick={() => {
                                                            if (currentSession) {
                                                                recordCarData()
                                                            } else {
                                                                alert("No session created or selected")
                                                            }
                                                        }}
                                                    >
                                                        <BsFillRecordCircleFill color={isRecording ? "red" : null}/>
                                                    </Button>
                                                </Tooltip>
                                            </HStack>
                                            : null
                                    }
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
            </Draggable>
            {/* Create new session popup */}
            <Modal
                initialFocusRef={initialModalRef}
                finalFocusRef={finalModalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create recording session</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>File name</FormLabel>
                            <Input
                                ref={initialModalRef}
                                placeholder='File name'
                                onChange={(e) => {
                                    setSessionFileName(e.target.value)
                                }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            bg="#008640"
                            mr={3}
                            onClick={() => {
                                if (sessionFileName === "") {
                                    alert("Error: Empty feild")
                                    return
                                }
                                createRecordingSession(sessionFileName);
                                onClose()
                            }}
                        >
                            Create
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
