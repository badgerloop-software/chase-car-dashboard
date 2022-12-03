import sys
import time
import json
# TODO import csv
# TODO import nupmy as np

print('#Hello from python#')
print('First param:'+sys.argv[1]+'#')
print('Second param:'+sys.argv[2])
#f = open('./Data/demo2.bin', mode='rb')
#f = open(sys.argv[1], mode='rb')
f2 = open("./Data/demofile2.txt", "a")
f3 = open(sys.argv[2])
#TODO f4 = open("src/routes/demo2.bin", "rb") # TODO Check the file name
#TODO f5 = open("src/routes/test.csv", "w")
#TODO f5writer = csv.writer(f5, delimeter=',', dialect='excel', newline='')
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
        # TODO time.sleep(1)

# Write headers to the file
# TODO f5writer.writerow(format.keys() + ["timestamp"])
# TODO
'''
data = 1 # Initialize data to true
#fun unpackData(data):
while data: # Loop until there is no more data left in the file
	offset = 0 # Byte offset for the buffer array
	timestamp = "::."# TODO s = solarCarData["timestamps"] # The array of timestamps for each set of data added to solarCarData
	# Array values indicate the status of the connection to the solar car. These will always be true when unpacking data
	# TODO This will have to be accounted for eventually: solar_car_connection = solarCarData["solar_car_connection"]
	
	# Add the current timestamp to timestamps, limit its length, and update the array in solarCarData
	# timestamps.unshift(DateTime.now().toString())
	
	# Add separators for timestamp to timestamps and limit arrays length
	#timestamps.unshift("::.")
	#if (timestamps.length > X_AXIS_CAP):
	#	timestamps.pop()
	#
	
	# Repeat with solar_car_connection
	#solar_car_connection.unshift(true)
	#if (solar_car_connection.length > X_AXIS_CAP) solar_car_connection.pop()
	#solarCarData["solar_car_connection"] = solar_car_connection
	
	for property in format.keys():
		# TODO dataArray = [] # Holds the array of data specified by property that will be put in solarCarData
		#dataType = "" # Data type specified in the data format
		
		#if (solarCarData.hasOwnProperty(property)):
		#	dataArray = solarCarData[property]
		
		dataType = format[property][1] # Get the data type of the next piece of data to read
		
		# TODO Check actual file types (might have to do a chain of if statements to convert data types in format.json to the data types numpy.fromfile() is expecting)
		data = np.fromfile(f4, dataType, 1, "", offset) 
		# TODO f4.read(format[property][0]) # Read the next n bytes, where n is the bytes specified in the data format JSON
		
		switch (property):
			case "tstamp_hr":
				#hours = data.readUInt8(offset)
				#if (hours < 10) timestamps[0] = "0" + hours + timestamps[0]
				#else timestamps[0] = hours + timestamps[0]
				if (data < 10):
					timestamp = "0" + data + timestamp
				else:
					timestamp = data + timestamp
				break
			case "tstamp_mn":
				#mins = data.readUInt8(offset)
 				#timestamps[0] = timestamps[0].replace(
 				#	"::",
				#	":" + (mins < 10 ? "0" + mins : mins) + ":"
				#)
				
				# TODO Update this: Ternary operator (and probably replace function) don't work the same in Python
				timestamp = timestamp.replace(
 					"::",
					":" + (data < 10 ? "0" + data : data) + ":"
				)
				break
			case "tstamp_sc":
				#secs = data.readUInt8(offset)
				#timestamps[0] = timestamps[0].replace(
				#	":.",
				#	":" + (secs < 10 ? "0" + secs : secs) + "."
				#)
				timestamp = timestamp.replace(
					":.",
					":" + (data < 10 ? "0" + data : data) + "."
				)
				break
			case "tstamp_ms":
				#millis = data.readUInt16BE(offset)
				#millisStr
				#if (millis >= 100):
				#	millisStr = millis
				#elif (millis >= 10):
				#	millisStr = "0" + millis
				#else:
				#	millisStr = "00" + millis
				#if (typeof millisStr === "undefined"):
				#	console.warn(
				#		`Millis value of ${millis caused undefined millis value`
				#	)
				#
				#timestamps[0] += millisStr
				milliStr = ""
				if (data >= 100):
					millisStr = data
				elif (data >= 10):
					millisStr = "0" + data
				else:
					millisStr = "00" + data
				#if (typeof millisStr === "undefined"):
				#	console.warn(
				#		`Millis value of ${millis caused undefined millis value`
				#	)
				timestamp += millisStr
				break


'''
# TODO
'''

		# Add the data from the buffer to solarCarData
		switch (dataType):
			case "float":
				# Add the data to the front of dataArray
				#dataArray.unshift(data.readFloatLE(offset))
				break
			case "char":
				# Add char to the front of dataArray
				#dataArray.unshift(String.fromCharCode(data.readUInt8(offset)))
				break
			case "bool":
				# Add bool to the front of dataArray
				#dataArray.unshift(Boolean(data.readUInt8(offset)))
				break
			case "uint8":
				switch (property):
					case "tstamp_hr":
						#hours = data.readUInt8(offset)
						#if (hours < 10) timestamps[0] = "0" + hours + timestamps[0]
						#else timestamps[0] = hours + timestamps[0]
						break

					case "tstamp_mn":
						#mins = data.readUInt8(offset)
 						#timestamps[0] = timestamps[0].replace(
 						#	"::",
						#	":" + (mins < 10 ? "0" + mins : mins) + ":"
						#)
						break
					case "tstamp_sc":
						secs = data.readUInt8(offset)
						timestamps[0] = timestamps[0].replace(
							":.",
							":" + (secs < 10 ? "0" + secs : secs) + "."
						)
						break
					default:
						# Add the data to the front of dataArray
						
						dataArray.unshift(data.readUInt8(offset))
						break
				
				break
			case "uint16":
				if (property == "tstamp_ms"):
					#millis = data.readUInt16BE(offset)
					#millisStr
					#if (millis >= 100):
					#	millisStr = millis
					#elif (millis >= 10):
					#	millisStr = "0" + millis
					#else:
					#	millisStr = "00" + millis
					#if (typeof millisStr === "undefined"):
					#	console.warn(
					#		`Millis value of ${millis caused undefined millis value`
					#	)
					#

					#timestamps[0] += millisStr
					break
				
				# Add the data to the front of dataArray
				dataArray.unshift(data.readUInt16BE(offset))
				break
			default:
				# Log if an unexpected type is specified in the data format
				print("No case for unpacking type ${dataType} (type specified for ${property} in format.json)")
				break
'''
'''
		if (!property.startsWith("tstamp")):
			# If property is not used for timestamps
			# Limit dataArray to a length specified by X_AXIS_CAP
			if (dataArray.length > X_AXIS_CAP):
				dataArray.pop()
			
			# Write dataArray to solarCarData at the correct key
			solarCarData[proper,ty] = dataArray
'''
# TODO
'''
		
		# Increment offset by amount specified in data format
		offset += DATA_FORMAT[property][0]
	
	
	# Update the timestamps array in solarCarData
	#solarCarData["timestamps"] = timestamps
	
	# Update the data to be passed to the front-end
	frontendData = solarCarData


'''
#TODO
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

# TODO f5.close()
# TODO f4.close()
f3.close()
f2.close()
#f.close()
