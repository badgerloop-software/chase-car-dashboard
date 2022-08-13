import sys
import time
import json
#import csv TODO
import numpy as np
import os
import xlsxwriter


print('#Hello from python#')
print('First param: '+sys.argv[1])
print('Second param: '+sys.argv[2])

recordedDataPath = sys.argv[1]

f3 = open(sys.argv[2])
f4 = open(recordedDataPath, "rb") # TODO Check the file name

# TODO f5 = open("src/routes/test.csv", "w")
#f5 = open(sys.argv[3], "w", newline='')
#f5writer = csv.writer(f5, dialect='excel', delimiter=',')

# Open Excel file and create first sheet (same name as the file)
workbook = xlsxwriter.Workbook(sys.argv[3])
worksheet = workbook.add_worksheet(sys.argv[3][(sys.argv[3].rfind("/")+1):sys.argv[3].rfind(".")])

# Load data format JSON and get the keys in it
format = json.load(f3)
keys = format.keys()


# TODO Remove this miscellaneous stuff
i=0
for key in keys:
	i += format[key][0]

print("Bytes in data packet: " + str(i))
print("Bytes in binary file: " + str(os.path.getsize(recordedDataPath)))
print("Number of rows that should be loaded: " + str(os.path.getsize(recordedDataPath) / i))


# Remove timestamp components from headers. If any of them cannot be found in the data format, print a descriptive message so the user knows what happened
headers = list(keys)
for toRemove in ["tstamp_ms", "tstamp_sc", "tstamp_mn", "tstamp_hr"]:
	if(not toRemove in headers):
		print(f"'{toRemove}' was not found in '{sys.argv[2]}'")
	headers.remove(toRemove)

# Add timestamp to headers
# TODO Will also have to add solar_car_connection (to this and data recording)
headers = ["timestamp"] + headers

# Write headers, set conditional formats for the nominal range of each column, and set number formats for columns with floats and timestamps
outofbounds_format = workbook.add_format({'bg_color': '#ff5858'})
c=0
for header in headers:
	column_format = workbook.add_format({'align': 'center', 'bottom_color': '#b0b0b0', 'bottom': 1, 'left': 1, 'right': 1})
	header_format = workbook.add_format({'align': 'center', 'bottom': 2, 'left': 1, 'right': 1, 'bold': True})
	
	if(header != "state" and header != "timestamp"):
		if(format[header][1] == "float"):
			column_format.set_num_format('0.00')
		
		worksheet.conditional_format(1, c, 1048575, c, {'type': 'blanks',
								'format': None,
								'stop_if_true': True})
		worksheet.conditional_format(1, c, 1048575, c, {'type': 'cell',
								'criteria': '<',
								'value': format[header][3],
								'format': outofbounds_format})
		worksheet.conditional_format(1, c, 1048575, c, {'type': 'cell',
								'criteria': '>',
								'value': format[header][4],
								'format': outofbounds_format})
		
		if(format[header][2] != ""):
			header += " (" + format[header][2] + ")"
	elif(header == "timestamp"):
		column_format.set_num_format('hh:mm:ss.000')
		column_format.set_right(2)
		header_format.set_right(2)
	
	if((c%2) == 0):
		column_format.set_bg_color('#dddddd')
		header_format.set_bg_color('#dddddd')
	
	worksheet.set_column(c, c, 8.43, column_format)
	worksheet.write(0, c, header, header_format)
	c += 1

# Freeze headers and timestamps
worksheet.freeze_panes(1,1)

# TODO Showed the tstamp_ms value: print(np.fromfile(f4, np.dtype('>u2'), 1, "", 51))

# Get the size of the recorded data file
recordedDataSize = os.path.getsize(recordedDataPath)
rownum = 2
while (f4.tell() < recordedDataSize):# TODO data: # Loop until there is no more data left in the file
	data = 0 # Data to add to the current row
	#TODO offset = 0 # Byte offset for the buffer array
	timestamp = "::." # The timestamp string for the current set of data
	row = [] # Row to be added to the file
	
	# Array values indicate the status of the connection to the solar car. These will always be true when unpacking data
	# TODO This will have to be accounted for eventually
	# solar_car_connection = solarCarData["solar_car_connection"]
	
	for property in keys:
		dataType = format[property][1] # Get the data type of the next piece of data to read
		
		# Get the next piece of data from the file
		if (dataType == "uint8"):
			data = np.fromfile(f4, np.dtype('u1'), 1, "", 0)
			
			# Add hours, minutes, or seconds to the timestamp if the current piece of data is tstamp_hr/mn/sc
			if (property == "tstamp_hr"):
				data = data[0]
				if (data < 10):
					timestamp = "0" + str(data) + timestamp
				else:
					timestamp = str(data) + timestamp
			elif (property == "tstamp_mn"):
				data = data[0]
				timestamp = timestamp.replace(
 					"::",
					":" + (("0" + str(data)) if (data < 10) else str(data)) + ":"
				)
			elif (property == "tstamp_sc"):
				data = data[0]
				timestamp = timestamp.replace(
					":.",
					":" + (("0" + str(data)) if (data < 10) else str(data)) + "."
				)
		elif (dataType == "float"):
			data = np.fromfile(f4, np.dtype('<f4'), 1, "", 0) # TODO Remove the 4 in the data type?
		elif (dataType == "bool"):
			data = np.fromfile(f4, np.dtype('?'), 1, "", 0)
		elif (dataType == "char"):
			# TODO Should be able to use i1 instead of u1 since the random number generator in DataGenerator and the actual values will never go above 100 (and will not have a msb of 1)
			data = np.fromfile(f4, np.dtype('u1'), 1, "", 0) # TODO Check data type
			data = chr(int(data))
		elif (dataType == "uint16"):
			data = np.fromfile(f4, np.dtype('>u2'), 1, "", 0)[0]
			
			# Add milliseconds to the timestamp if the current piece of data is tstamp_ms
			if (property == "tstamp_ms"):
				milliStr = ""
				if (data >= 100):
					millisStr = str(data)
				elif (data >= 10):
					millisStr = "0" + str(data)
				else:
					millisStr = "00" + str(data)
				timestamp += millisStr
		else:
			# If the data type does not match any of the previous values, default to an unsigned int of n bytes, as specified in the data format
			data = np.fromfile(f4, np.dtype('u'+format[property][0]), 1, "", 0)
			# Make the data written to the file "unknown type" to indicate that it is invalid
			data = "unknown type"
			# Print a warning to the console
			print("WARNING: default case reached when unpacking recorded data") # TODO Elaborate if there are multiple unpacking scripts
		
				
		# Add the piece of data to the row, provided it is not part of the timestamp
		if (not property.startswith("tstamp")):
			#print("\n----------\n" + "Offset: " + str(offset)) # TODO
			#print("----------\n" + "File location: " + str(f4.tell())) # TODO
			#print("----------\n" + property + ": " + str(data)) # TODO
			#print("----------\nFirst element of " + property + ": " + str(data[0])) # TODO
			row += [data[0]] # np.fromfile() returns an array, and the first element is the actual value, so add the first element to the row
			#print(row) # TODO
		
		# Increment offset by amount specified in data format
		# TODO offset += format[property][0]
	
	# Add the timestamp to the beginning of the row
	row = [timestamp] + row
	
	# Write the row to the csv file
	worksheet.write_row('A'+str(rownum),row)
	rownum += 1
	#f5writer.writerow(row)


#f5.close()
f4.close()
f3.close()
workbook.close()

print("From python script: I'm done")
