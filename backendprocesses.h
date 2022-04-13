#ifndef BACKENDPROCESSES_H
#define BACKENDPROCESSES_H

#include <QObject>
#include <QTcpServer>
#include <QTcpSocket>
#include <chrono>
#include <sys/time.h>
#include <ctime>
#include <vector>
#include <unistd.h>
#include "DataProcessor/DataGen.h"

struct timestampOffsets {
    int hr;
    int mn;
    int sc;
    int ms;
};

class BackendProcesses : public QObject
{
    Q_OBJECT

public:
    explicit BackendProcesses(QByteArray &bytes, std::vector<std::string> &names, std::vector<std::string> &types, timestampOffsets timeDataOffsets, QObject *parent = nullptr);
    //~BackendProcesses();
public slots:
    void onNewConnection();
    void onSocketStateChanged(QAbstractSocket::SocketState socketState);
    //void onReadyRead();

    void threadProcedure();
    void startThread();
signals:
    void dataReady();
    void eng_dash_connected();
    void eng_dash_disconnected();
private:
    QTcpServer _server;
    QList<QTcpSocket*> _sockets;

    timestampOffsets tstampOffsets;

    QByteArray &bytes;
    std::vector<std::string> &names;
    std::vector<std::string> &types;
};

#endif // BACKENDPROCESSES_H
