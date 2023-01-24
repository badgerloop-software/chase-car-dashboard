import {
    Box,
    Button, FormControl, FormLabel,
    HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger, Select, useDisclosure,
    VStack
} from "@chakra-ui/react";
import Draggable, { DraggableCore } from 'react-draggable';
import {BsFillRecordCircleFill} from "react-icons/bs";
import {FaPause, FaPlay, FaStop} from "react-icons/fa";
import { useState, useLayoutEffect, useRef } from "react";

// Importing toastify module
import { toast } from 'react-toastify';

// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';

// toast-configuration method,
// it is compulsory method.
toast.configure()


export default function DataRecordingControl(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const initialModalRef = useRef();
    const finalModalRef = useRef();

    const initialPopoverRef = useRef();

    const [sessionsList, setSessionsList] = useState({ data: null });

    const [framePointer, setFramePointer] = useState(0);
    let [frameIntervalId, setframeIntervalId] = useState(null);
    const [playMode, setPlayMode] = useState(false);

    const [currentSession, setCurrentSession] = useState("");
    const [recordedData, setRecordedData] = useState({ data: null });
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingSessionCreated, setIsRecordingSessionCreated] = useState(false);
    const [sessionFileName, setSessionFileName] = useState("");

    const getSessionsList = async () => {
        const response = await fetch("/sessionsList");
        const body = await response.json();
        if (response.status !== 200) {
            console.error("sessionList: error");
            // throw Error(body.message);
            return
        }
        return body;
    };

    const getSessionData = (session) => {
        fetch('http://localhost:4001/get-recorded-data/x', {
            method: "POST",
            body: JSON.stringify({ fileName: session }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("session res::", data)

        }).catch((e) => {
            setIsRecording(false)
            console.log("Error:", e)
        })
    }




    /*useLayoutEffect(() => {
        //-------
        if (playMode) {
            if (framePointer >= recordedData.data.length) {
                clearInterval(frameIntervalId)
                setFramePointer(0)
                console.log("End of frames")
                toast("End of frames!!")

            } else {
                setState((prev) => prev.data = recordedData.data[framePointer])
            }
            console.log("frame:", framePointer)
        } else {
            callBackendAPI().then((res) => {
                setState({ data: res.response })
            }).catch((err) => console.log("/api error", err));
        }


    }, [state, framePointer]);

    useLayoutEffect(() => {
        //-------
        // console.log("Running once")
        getSessionsList().then((res) => {
            setSessionsList({ data: res.response });
        }).catch((err) => console.log("error", err));
    }, []);


    const playData = (speed = 1) => {
        let time = 1000 * speed // 1000 = 1000ms = 1sec
        // check if already an interval has been set up
        if (!recordedData.data || recordedData.data === null && recordedData.data?.length == 0) {
            console.log("No data")
            toast("No session data found.")
            return
        }

        console.log("paying...", recordedData.data)
        setPlayMode(true)
        if (!frameIntervalId) {
            setframeIntervalId(setInterval(() => {
                //What to do during the interval
                setFramePointer(prev => prev + 1)
            }, time))
        }
    };

    const pause = () => {
        console.log("stopping:", frameIntervalId)
        clearInterval(frameIntervalId)
        setframeIntervalId(null)
    }

    const stop = () => {
        console.log("stopping:", frameIntervalId)
        clearInterval(frameIntervalId)
        setframeIntervalId(null)
        setFramePointer(0)
    }*/

    // TODO Replace with something like "Convert Recorded Data" or "Process Recorded Data"
    const getRecordedData = async () => {
        const response = await fetch("/get-recorded-data");
        if (response.status === 200) {
            const body = await response.json();
            return body
        } else {
            console.log("Error getting Rec data")
        }
        return null;
    };

    const recordCarData = () => {
        fetch('http://localhost:4001/record-data', {
            method: "POST",
            body: JSON.stringify({ doRecord: !isRecording }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("rcd res::", data)
            if (data.response === "NoFile") {
                //ToDo
            }
            if (data.response === "Recording") {
                //Then Request is sent
                setIsRecording(!isRecording)
            } else {
                setIsRecording(false)
                // Handle the error
                alert("Something went wrong")
            }

        }).catch((e) => {
            setIsRecording(false)
            console.log("Error:", e)
        })
    }

    const setCurrentRecordingSession = (fileName) => {
        fetch('http://localhost:4001/current-recording-session', {
            method: "POST",
            body: JSON.stringify({ fileName: fileName }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("crs res::", data)
            if (data.response == -1) {
                toast("Empty name")
                return
            }
            if (data.response == 200) {
                setCurrentSession(fileName)
                toast("Current recording session is set !!")
            } else {
                // Handle the error
                toast("Something went wrong")
            }
        }).catch((e) => {
            console.log("Error:", e)
        });
    }

    const createRecordingSession = (fileName) => {
        fetch('http://localhost:4001/create-recording-session', {
            method: "POST",
            body: JSON.stringify({ fileName: fileName }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json()).then((data) => {
            console.log("crs res::", data)
            if (data.response === "Empty") {
                alert("Empty feild")
                return
            }
            if (data.response === "Created") {
                // Get the updated sessions list
                getSessionsList().then((res) => {
                    // console.log("Getting")
                    setSessionsList({ data: res.response });
                }).catch((err) => console.log("error", err));
                setCurrentSession(fileName)

                // alert("Session file has been created!!")
                toast("Session file has been created!!")
                //Then Request is sent
            } else {
                setIsRecordingSessionCreated(false)
                // Handle the error
                alert("Something went wrong")
            }

        }).catch((e) => {
            setIsRecordingSessionCreated(false)
            console.log("Error:", e)
        });
    }


    return (
        <>
            <Draggable bounds='parent'>
                <Box
                    zIndex='overlay'
                    position='absolute'
                    bottom='25px'
                    left='25px'
                >
                <Popover
                    placement='right'
                    initialFocusRef={initialPopoverRef}
                >
                    <PopoverTrigger>
                        <Button
                            ref={finalModalRef}
                            w={75}
                            h={75}
                            p={0}
                            borderWidth={10}
                            borderColor='#ff0000'
                            borderRadius='full'
                            boxShadow='md'
                            bgColor='#00000000'
                        >
                            <Box w={35} h={35} borderRadius='full' m={0} bgColor='#ff0000' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent pt={5} w='max-content'>
                        <PopoverCloseButton/>
                        <PopoverBody>
                            <VStack>

                                <HStack style={{marginBottom: "0.5em"}}>
                                    { /* TODO Add a refresh button to get (/set sessionsList to) the most recent list of sessions */ }
                                    <Select
                                        width={"15em"}
                                        placeholder={"Select session to view"}
                                        value={currentSession}

                                        onChange={(e) => {
                                            console.log('current value', e.target.value)
                                            setCurrentRecordingSession(e.target.value)
                                        }}>
                                        {sessionsList?.data?.map((name, i) => {
                                            return (<option key={i} value={name}>{name}</option>)
                                        })}

                                    </Select>
                                    <Button ref={initialPopoverRef} width={"auto"} colorScheme='blue' size='sm' onClick={onOpen}>+ Create</Button>
                                </HStack>
                                {
                                    currentSession ?
                                        <>

                                            <HStack>
                                                <Button width={"auto"} colorScheme='blue' size='sm' onClick={async () => {
                                                    if (currentSession) {
                                                        getRecordedData().then((res) => {
                                                            if (res.response) {
                                                                setRecordedData({data: res.response});
                                                                console.log("Rec Data::", res.response);
                                                                localStorage.setItem("recordeData", JSON.stringify(res.response))
                                                            }
                                                        }).catch((err) => console.log(err));
                                                    } else {
                                                        alert("Please select a session to get the data from")
                                                    }

                                                }}> Get session data</Button>

                                                <Button width={"auto"} colorScheme='blue' size='sm'
                                                        onClick={() => {
                                                            if (currentSession) {
                                                                recordCarData()
                                                            } else {
                                                                alert("No session created or selected")
                                                            }
                                                        }}>
                                                    <BsFillRecordCircleFill color={isRecording ? "red" : null}/>
                                                </Button>

                                            </HStack>

                                            {
                                                recordedData.data ?
                                                    <>
                                                        <HStack>
                                                            <Button width={"auto"} colorScheme='blue' size='sm'
                                                                    /*onClick={() => playData()}*/> <FaPlay/> </Button>
                                                            <Button width={"auto"} colorScheme='blue' size='sm'
                                                                    /*onClick={() => pause()}*/><FaPause/> </Button>
                                                            <Button width={"auto"} colorScheme='blue' size='sm'
                                                                    /*onClick={() => stop()}*/><FaStop/></Button>

                                                        </HStack>
                                                        <Box><span>Data Frames: {framePointer}/{recordedData.data?.length}</span></Box>
                                                    </>
                                                    : null
                                            }

                                        </>
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
                        <Input ref={initialModalRef} placeholder='File name' onChange={(e) => {
                            setSessionFileName(e.target.value)
                        }}/>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => {
                        if (sessionFileName === "") {
                            alert("Error: Empty feild")
                            return
                        }
                        createRecordingSession(sessionFileName);
                        onClose()
                    }}>
                        Create
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    );
}
