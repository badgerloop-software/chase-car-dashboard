import QtQuick 2.4

Item {
    width: 150
    height: 104

    Image {
        id: blinker
        x: 0
        y: 0
        width: 150
        height: 104
        source: "Images/Blinker.png"
        sourceSize.height: 104
        sourceSize.width: 150
        fillMode: Image.PreserveAspectFit
    }

}

/*function getColor(bool){
    if(bool)
        return "#40C321"
    else
        return "#000000"
}

width: 800
height: 400
Item {
    id: r_arrow
    x: 400
    y: 0
    Rectangle {
        id: background
        x: 0
        y: 0
        width: 400
        height: 400
        color: "#000000"
        border.color: "#000000"
        z: -1
    }

    Image {
        id: image
        x: 50
        y: 50
        width: 300
        height: 300
        source: "Images/Blinker.png"
        z: 1
        fillMode: Image.PreserveAspectFit
    }

    Rectangle {
        id: rectangle
        x: 50
        y: 96
        width: 300
        height: 207
        color: getColor(backEnd.right_turn)
    }


    Timer{
        interval: 500
        running: true
        repeat: true
        onTriggered: rectangle.opacity  = rectangle.opacity == 0 ? 1 : 0
    }
}

Item {
    id: l_arrow
    x: 400
    y: 400

    scale: -1
    Rectangle {
        id: background1
        x: 0
        y: 0
        width: 400
        height: 400
        color: "#000000"
        border.color: "#000000"
        z: -1
    }

    Image {
        id: image1
        x: 50
        y: 50
        width: 300
        height: 300
        source: "Images/Blinker.png"
        z: 1
        fillMode: Image.PreserveAspectFit
    }

    Rectangle {
        id: rectangle1
        x: 50
        y: 96
        width: 300
        height: 207
        color: getColor(backEnd.left_turn)
    }


    Timer{
        interval: 500
        running: true
        repeat: true
        onTriggered: rectangle1.opacity  = rectangle1.opacity == 0 ? 1 : 0
    }
}*/

/*##^##
Designer {
    D{i:0;formeditorZoom:3}D{i:1}
}
##^##*/
