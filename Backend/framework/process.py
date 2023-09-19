import threading
from core import comms

def start_processes():
    t = threading.Thread(target=comms.start_comms)  # instantiating without any argument
    t.daemon = True
    t.start()