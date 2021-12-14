//
// Created by Mingcan Li on 11/16/21.
//

#include "DataUnpacker.h"

double speedFunc(double t){
    return t*t;
}

double solarFunc(double t){
    return t*t*t;
}

double batteryFunc(double t){
    return pow(2.71828,-t)*100;
}

double bytesToDouble(std::vector<byte> data, int start_pos) {
    double number;
    memcpy(&number, &data.at(start_pos), sizeof(double));
    return number;
}

template <typename E>
void bytesToSomethingNotDouble(std::vector<byte> data, int startPos, int endPos, E &var){
    int byteNum=endPos-startPos;
    for(int i = startPos ; i<=endPos ; i++) {
        var=var+data[i]<<byteNum*8;
        byteNum--;
    }
}



//int 4 bytes double 8 bytes char 1 bytes
DataUnpacker::DataUnpacker(QObject *parent) : QObject(parent)
{
    std::vector<unsigned char> bytes;
    DataGen data(&speedFunc,&solarFunc,&batteryFunc,100);
    data.getData(bytes,3);
    //bytes.clear();
    //data.getData(bytes,2);
    unpack(bytes);
    startThread();
}

void DataUnpacker::unpack(std::vector<byte> rawData) {
    bytesToSomethingNotDouble(rawData, 0, 3, speed);
    power=bytesToDouble(rawData,4);
    bytesToSomethingNotDouble(rawData, 12, 15, charge);
    solarP=bytesToDouble(rawData,16);
    netP= bytesToDouble(rawData,24);
    motorP= bytesToDouble(rawData,32);
    bytesToSomethingNotDouble(rawData,40,40,state);
    batteryT= bytesToDouble(rawData,41);
    motorT= bytesToDouble(rawData,49);
    motorControllerT= bytesToDouble(rawData,57);
    bytesToSomethingNotDouble(rawData,65,65,bpsFault);
    bytesToSomethingNotDouble(rawData,66,66,eStop);
    bytesToSomethingNotDouble(rawData,67,67,cruise);
    bytesToSomethingNotDouble(rawData,68,68,lt);
    bytesToSomethingNotDouble(rawData,69,69,rt);
    bytesToSomethingNotDouble(rawData,70,73,flTp);
    bytesToSomethingNotDouble(rawData,74,77,frTp);
    bytesToSomethingNotDouble(rawData,78,81,rlTp);
    bytesToSomethingNotDouble(rawData,82,85,rrTp);
}


void DataUnpacker::startThread() {
    t = std::thread(&DataUnpacker::threadProcedure,this);
    t.detach();
}

void DataUnpacker::threadProcedure() {
    DataGen data(&speedFunc,&solarFunc,&batteryFunc,100);
    for( ; ; ) {
        std::vector<unsigned char> bytes;
        data.getData(bytes,3);
        unpack(bytes);
        emit motorTChanged();
        usleep(1000000 );
    }
}
