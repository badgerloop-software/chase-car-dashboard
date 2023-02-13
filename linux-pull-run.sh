#!/bin/bash
while getopts 'o' OPTION; do
    case "$OPTION" in
        o)
            no_open=true
            ;;
        ?)
            echo "script usage: ./linux-pull-run.sh [-o]" >&2
            echo $'\t-o: disables automatic opening of the browser'
            exit 1
            ;;
    esac
done
docker pull ghcr.io/badgerloop-software/chase-car-dashboard-image:latest
if [[ ! $no_open ]]; then
    [[ $OSTYPE != 'darwin'* ]] && cmd=xdg-open
    [[ $OSTYPE == 'darwin'* ]] && cmd=open
    if [[ -n $($cmd 2>/dev/null) ]]; then
        $cmd http://localhost:3000
    else
        echo -e "\nCould not run \`$cmd\`, please open 'http://localhost:3000' on your browser\n"
    fi
fi
docker run -p 3000:3000 ghcr.io/badgerloop-software/chase-car-dashboard-image:latest

#The server will be run at http://localhost:3000, it will take one to two minutes to start up
#if this window does not automatically pop up then please enter the URL manually
