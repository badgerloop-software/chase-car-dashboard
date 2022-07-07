import sys
import time
import json

print('#Hello from python#')
print('First param:'+sys.argv[1]+'#')
print('Second param:'+sys.argv[2])
#f = open('./Data/demo2.bin', mode='rb')
#f = open(sys.argv[1], mode='rb')
f2 = open("Data/demofile2.txt", "a")
f3 = open(sys.argv[2])
format = json.load(f3)
#print(format.keys())

f2.write('d\n')
#f2.write(str(format))

print(format.keys())
#keys = format.keys()

j=0
for key in format.keys():
    if(j <= 3):
        f2.write(key + '\n')
        j += 1
        time.sleep(1)
'''
for i in range(5):
    fp = f.read(i)
    for j in range(i):
        print('d ' + str(fp[j]))
        f2.write(str(fp[j]) + ' | ')
    print('\n')
    f2.write('\n')
    time.sleep(1)'''
#print(f.readline())

f3.close()
f2.close()
#f.close()

