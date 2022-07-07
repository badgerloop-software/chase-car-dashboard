import sys
print('#Hello from python#')
print('First param:'+sys.argv[1]+'#')
#f = open('./Data/demo2.bin', mode='rb')
f = open(sys.argv[1], mode='rb')
print(f.read())
f.close()
