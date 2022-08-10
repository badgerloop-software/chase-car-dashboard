import sys
import time
import json
import csv
import numpy as np
import os # TODO Disregard: Just for getting the size of the binary file for debugging

print('#Hello from python#')
print('First param:'+sys.argv[1]+'#')
print('Second param:'+sys.argv[2])

#f = open('./Data/demo2.bin', mode='rb')
#f = open(sys.argv[1], mode='rb')
# TODO "./Data/demofile2.txt", "a" worked when spawned in backend

recordedDataPath = sys.argv[1]

f2 = open("./demofile2.txt", "a")
f3 = open(sys.argv[2])

f4 = open(recordedDataPath, "rb") # TODO Check the file name

# TODO f5 = open("src/routes/test.csv", "w")
f5 = open("./test.csv", "w", newline='')
f5writer = csv.writer(f5, dialect='excel', delimiter=',')

# Load data format JSON and get the keys in it
format = json.load(f3)
keys = format.keys()

f2.write('d\n')
#f2.write(str(format))

j=0
i=0
for key in keys:
	i += format[key][0]
	if(j <= 3):
		f2.write(key + '\n')
		j += 1
		# TODO time.sleep(1)

print("Bytes in data packet: " + str(i))
print("Bytes in binary file: " + str(os.path.getsize(recordedDataPath)))
print("Number of rows that should be loaded: " + str(os.path.getsize(recordedDataPath) / i))


# Remove timestamp components from headers. If any of them cannot be found in the data format, print a descriptive message so the user knows what happened
headers = list(keys)
for toRemove in ["tstamp_ms", "tstamp_sc", "tstamp_mn", "tstamp_hr"]:
	if(not toRemove in headers):
		print(f"'{toRemove}' was not found in '{sys.argv[2]}'")
	headers.remove(toRemove)

# Write headers to the file
# TODO Will also have to add solar_car_connection (to this and data recording)
f5writer.writerow(headers + ["timestamp"])


# TODO Showed the tstamp_ms value: print(np.fromfile(f4, np.dtype('>u2'), 1, "", 51))


# Get the size of the recorded data file
recordedDataSize = os.path.getsize(recordedDataPath)
while (f4.tell() < recordedDataSize):# TODO data: # Loop until there is no more data left in the file
	data = 0 # Data to add to the current row
	offset = 0 # Byte offset for the buffer array
	timestamp = "::."# TODO s = solarCarData["timestamps"] # The array of timestamps for each set of data added to solarCarData
	row = [] # Row to be added to the file
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
	
	for property in keys:
		# TODO dataArray = [] # Holds the array of data specified by property that will be put in solarCarData
		#dataType = "" # Data type specified in the data format
		
		#if (solarCarData.hasOwnProperty(property)):
		#	dataArray = solarCarData[property]
		
		dataType = format[property][1] # Get the data type of the next piece of data to read
		
		# Get the next piece of data from the file
		if (dataType == "uint8"):
			# TODO dataType = np.dtype('u1')
			data = np.fromfile(f4, np.dtype('u1'), 1, "", 0) #offset)
			
			# Add hours, minutes, or seconds to the timestamp if the current piece of data is tstamp_hr/mn/sc
			if (property == "tstamp_hr"):
				data = data[0]
				if (data < 10):
					timestamp = "0" + str(data) + timestamp
				else:
					timestamp = str(data) + timestamp
				#break
			elif (property == "tstamp_mn"):
				data = data[0]
				# TODO Update this: Ternary operator (and probably replace function) don't work the same in Python
				timestamp = timestamp.replace(
 					"::",
					":" + (("0" + str(data)) if (data < 10) else str(data)) + ":"
				)
				#break
			elif (property == "tstamp_sc"):
				data = data[0]
				timestamp = timestamp.replace(
					":.",
					":" + (("0" + str(data)) if (data < 10) else str(data)) + "."
				)
				#break
			
			#break
		elif (dataType == "float"):
			# TODO dataType = np.dtype('<f4') #TODO Remove the 4?
			data = np.fromfile(f4, np.dtype('<f4'), 1, "", 0) #offset) # TODO Remove the 4 in the data type?
			#break
		elif (dataType == "bool"):
			# TODO dataType = np.dtype('?')
			data = np.fromfile(f4, np.dtype('?'), 1, "", 0) #offset)
			#break
		elif (dataType == "char"):
			#dataType = np.dtype('U1') # TODO
			
			# TODO Try making this an 8-bit unsigned int and check what the ASCII/Unicode equivalent is. Then, keep trying stuff until it matches that character.
			# TODO Right now, I am just making it raw bytes that are zero-terminated and casting it to a string. This isn't recommended, and I'm convinced there's a better way too
			
			#data = np.fromfile(f4, np.dtype('u1'), 1, "", offset) # TODO Remove; just for testing
			
			# TODO Should be able to use i1 instead of u1 since the random number generator in DataGenerator and the actual values will never go above 100 (and will not have a msb of 1)
			data = np.fromfile(f4, np.dtype('u1'), 1, "", 0) #offset) # TODO Check data type
			data = chr(int(data))
			#break
		elif (dataType == "uint16"):
			# TODO dataType = np.dtype('u2')
			data = np.fromfile(f4, np.dtype('>u2'), 1, "", 0)[0] #offset)
			
			# Add milliseconds to the timestamp if the current piece of data is tstamp_ms
			if (property == "tstamp_ms"):
				milliStr = ""
				if (data >= 100):
					millisStr = str(data)
				elif (data >= 10):
					millisStr = "0" + str(data)
				else:
					millisStr = "00" + str(data)
				#if (typeof millisStr === "undefined"):
				#	console.warn(
				#		`Millis value of ${millis} caused undefined millis value`
				#	)
				timestamp += millisStr
				#break
			#break
		else:
			# If the data type does not match any of the previous values, default to a string with n characters, where n is the byte count listed in the data format
			data = np.fromfile(f4, np.dtype('U'+format[property][0]), 1, "", 0) #offset)
			print("WARNING: default case reached when unpacking recorded data") # TODO Elaborate if there are multiple unpacking scripts
			#break
		
		# TODO Check actual file types (might have to do a chain of if statements to convert data types in format.json to the data types numpy.fromfile() is expecting)
		
		# TODO data = np.fromfile(f4, dataType, 1, "", offset) 
		
		# TODO f4.read(format[property][0]) # Read the next n bytes, where n is the bytes specified in the data format JSON
		'''
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
		
		# Add the piece of data to the row, provided it is not part of the timestamp
		# TODO Use a more graceful/compact condition
		if (not property.startswith("tstamp")):# TODO (property != "tstamp_ms" and property != "tstamp_sc" and property != "tstamp_mn" and property != "tstamp_hr"):
			#print("\n----------\n" + "Offset: " + str(offset)) # TODO
			#print("----------\n" + "File location: " + str(f4.tell())) # TODO
			#print("----------\n" + property + ": " + str(data)) # TODO
			#print("----------\nFirst element of " + property + ": " + str(data[0])) # TODO
			row += [data[0]] # np.fromfile() returns an array, and the first element is the actual value, so add the first element to the row
			#print(row) # TODO
		
		# Increment offset by amount specified in data format
		offset += format[property][0]
	
	# Add the timestamp to the end of the row
	row += [timestamp]
	
	#TODO
	# TODO print(row)
	# Write the row to the csv file
	f5writer.writerow(row)
	
	# Update the timestamps array in solarCarData
	# TODO solarCarData["timestamps"] = timestamps
	
	# Update the data to be passed to the front-end
	#frontendData = solarCarData


#TODO
'''
for i in range(5):
	fp = f.read(i)
	for j in range(i):
		print('d ' + str(fp[j]))
		f2.write(str(fp[j]) + ' | ')
	print('\n')
	f2.write('\n')
	time.sleep(1)
'''
#print(f.readline())

f5.close()
f4.close()
f3.close()
f2.close()
#f.close()

