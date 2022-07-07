import BPSFaultImage from "./BPS Fault.png";
import EStopImage from "./E-Stop.png";
import MPPTContactorImageLight from "./MPPT Contactor.png";
import LowContactorImageLight from "./Low Contactor.png";
import MotorControllerContactorImageLight from "./Motor Controller Contactor.png";
import DoorImageLight from "./Door.png";
import BatteryFailsafeImageLight from "./Battery Failsafe.png";
import IMDStatusImageLight from "./IMD Status.png";
import CrashImageLight from "./Crash.png";
import HighCurrentImageLight from "./High Current.png";
import HighVoltageImageLight from "./High Voltage.png";
import LowCurrentImageLight from "./Low Current.png";
import LowVoltageImageLight from "./Low Voltage.png";
import LowBatteryImageLight from "./Low Battery.png";
import MCUCheckImageLight from "./MCU Check.png";
import MPPTCurrentImageLight from "./MPPT Current.png";
import BMSInputVoltageImageLight from "./BMS Input Voltage.png";
import PhysicalConnectionImageLight from "./Physical Connection Lost.png";
import WirelessCommsLostImageLight from "./Wireless Comms Lost.png";
import HighTemperatureImageLight from "./High Temperature.png";
import MPPTContactorImageDark from "./MPPT Contactor Dark.png";
import LowContactorImageDark from "./Low Contactor Dark.png";
import MotorControllerContactorImageDark from "./Motor Controller Contactor Dark.png";
import DoorImageDark from "./Door Dark.png";
import BatteryFailsafeImageDark from "./Battery Failsafe Dark.png";
import IMDStatusImageDark from "./IMD Status Dark.png";
import CrashImageDark from "./Crash Dark.png";
import HighCurrentImageDark from "./High Current Dark.png";
import HighVoltageImageDark from "./High Voltage Dark.png";
import LowCurrentImageDark from "./Low Current Dark.png";
import LowVoltageImageDark from "./Low Voltage Dark.png";
import LowBatteryImageDark from "./Low Battery Dark.png";
import MCUCheckImageDark from "./MCU Check Dark.png";
import MPPTCurrentImageDark from "./MPPT Current Dark.png";
import BMSInputVoltageImageDark from "./BMS Input Voltage Dark.png";
import PhysicalConnectionImageDark from "./Physical Connection Lost Dark.png";
import WirelessCommsLostImageDark from "./Wireless Comms Lost Dark.png";
import HighTemperatureImageDark from "./High Temperature Dark.png";

const FaultsViewImages = {
    "light": {
        "BPSFault": BPSFaultImage,
        "EStop": EStopImage,
        "MPPTContactor": MPPTContactorImageLight,
        "LowContactor": LowContactorImageLight,
        "MotorControllerContactor": MotorControllerContactorImageLight,
        "Door": DoorImageLight,
        "BatteryFailsafe": BatteryFailsafeImageLight,
        "IMDStatus": IMDStatusImageLight,
        "Crash": CrashImageLight,
        "HighCurrent": HighCurrentImageLight,
        "HighVoltage": HighVoltageImageLight,
        "LowCurrent": LowCurrentImageLight,
        "LowVoltage": LowVoltageImageLight,
        "LowBattery": LowBatteryImageLight,
        "MCUCheck": MCUCheckImageLight,
        "MPPTCurrent": MPPTCurrentImageLight,
        "BMSInputVoltage": BMSInputVoltageImageLight,
        "PhysicalConnection": PhysicalConnectionImageLight,
        "WirelessCommsLost": WirelessCommsLostImageLight,
        "HighTemperature": HighTemperatureImageLight
    },
    "dark": {
        "BPSFault": BPSFaultImage,
        "EStop": EStopImage,
        "MPPTContactor": MPPTContactorImageDark,
        "LowContactor": LowContactorImageDark,
        "MotorControllerContactor": MotorControllerContactorImageDark,
        "Door": DoorImageDark,
        "BatteryFailsafe": BatteryFailsafeImageDark,
        "IMDStatus": IMDStatusImageDark,
        "Crash": CrashImageDark,
        "HighCurrent": HighCurrentImageDark,
        "HighVoltage": HighVoltageImageDark,
        "LowCurrent": LowCurrentImageDark,
        "LowVoltage": LowVoltageImageDark,
        "LowBattery": LowBatteryImageDark,
        "MCUCheck": MCUCheckImageDark,
        "MPPTCurrent": MPPTCurrentImageDark,
        "BMSInputVoltage": BMSInputVoltageImageDark,
        "PhysicalConnection": PhysicalConnectionImageDark,
        "WirelessCommsLost": WirelessCommsLostImageDark,
        "HighTemperature": HighTemperatureImageDark
    }
}

export { FaultsViewImages };
