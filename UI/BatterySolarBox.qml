import QtQuick 2.15

Item {
    width: 585
    height: 600
    visible: true

    Rectangle {
        id: battery
        x: 0
        y: 0
        width: 585
        height: 375
        color: "#000000"
        border.color: "#ffffff"

        Rectangle {
            x: 0
            y: 0
            width: 585
            height: 62
            color: "#40ffffff"
            border.width: 0

            Text {
                x: 0
                y: 0
                width: 585
                height: 62
                color: "#ffffff"
                text: qsTr("Battery")
                font.pixelSize: 48
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                font.styleName: "Medium"
                font.family: "Work Sans"
            }
        }

        Text {
            id: packPower
            x: 295
            y: 108
            width: 200
            height: 70
            color: "#ffffff"
            text: qsTr("683.6")
            font.pixelSize: 72
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Rectangle {
            id: rectangle
            x: 0
            y: 225
            width: 585
            height: 150
            color: "#000000"
            border.color: "#ffffff"
        }

        Text {
            id: packVoltage
            x: 25
            y: 69
            width: 160
            height: 70
            color: "#ffffff"
            text: qsTr("108.5")
            font.pixelSize: 64
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            id: packCurrent
            x: 25
            y: 147
            width: 160
            height: 70
            color: "#ffffff"
            text: qsTr("6.3")
            font.pixelSize: 64
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 510
            y: 118
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("W")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 200
            y: 79
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("V")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 200
            y: 157
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("A")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            id: packTemp
            x: 39
            y: 280
            width: 150
            height: 70
            color: "#ffffff"
            text: qsTr("50.5")
            font.pixelSize: 60
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 204
            y: 290
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("°C")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 62
            y: 230
            width: 170
            height: 50
            color: "#ffffff"
            text: qsTr("Pack Temp")
            font.pixelSize: 30
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 354
            y: 230
            width: 170
            height: 50
            color: "#ffffff"
            text: qsTr("Fan Speed")
            font.pixelSize: 30
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            id: fanSpeed
            x: 407
            y: 280
            width: 64
            height: 70
            color: "#ffffff"
            text: qsTr("5")
            font.pixelSize: 60
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

    }

    Rectangle {
        id: solar
        x: 0
        y: 375
        width: 585
        height: 225
        color: "#000000"
        border.color: "#ffffff"

        Rectangle {
            x: 0
            y: 0
            width: 585
            height: 62
            color: "#40ffffff"
            border.width: 0
            Text {
                x: 0
                y: 0
                width: 585
                height: 62
                color: "#ffffff"
                text: qsTr("Solar")
                font.pixelSize: 48
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                font.family: "Work Sans"
                font.styleName: "Medium"
            }
        }

        Text {
            id: solarPower
            x: 295
            y: 108
            width: 200
            height: 70
            color: "#ffffff"
            text: qsTr("564.2")
            font.pixelSize: 72
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            id: solarVoltage
            x: 25
            y: 69
            width: 160
            height: 70
            color: "#ffffff"
            text: qsTr("108.5")
            font.pixelSize: 64
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            id: solarCurrent
            x: 25
            y: 147
            width: 160
            height: 70
            color: "#ffffff"
            text: qsTr("5.2")
            font.pixelSize: 64
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 510
            y: 118
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("W")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 200
            y: 79
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("V")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }

        Text {
            x: 200
            y: 157
            width: 50
            height: 50
            color: "#ffffff"
            text: qsTr("A")
            font.pixelSize: 42
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "Work Sans"
            font.styleName: "Regular"
        }
    }
}

/*##^##
Designer {
    D{i:0;formeditorZoom:0.66}D{i:3}D{i:2}D{i:4}D{i:5}D{i:6}D{i:7}D{i:8}D{i:9}D{i:10}
D{i:11}D{i:12}D{i:13}D{i:14}D{i:15}D{i:1}D{i:18}D{i:17}D{i:19}D{i:20}D{i:21}D{i:22}
D{i:23}D{i:24}D{i:16}
}
##^##*/
