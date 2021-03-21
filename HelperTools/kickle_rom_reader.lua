local originalMAP  = '80060144800C810244800B42C301468007810A448002810C44800142C30B468001810C44800142810A41468002422C0103810203012C4146800442810641468006428104414680084281024146800A42014146800C42468006'
local originalCHR  = '0BC00A05007383FF017B8BFF03EFFF17161801A7'
local newMAP       = ''
local newCHR       = ''
local dataAsHex    = ''
local newDataAsHex = ''
--
local WAIT = "wait"
local FILE_STATE = 'state.txt'
local FILE_DATA = 'data.txt'
local ROM_DATA = {}
--
--
--
--
--
--
function printStatus (txt)
	gui.text(1,9,txt);
end
function reload ()
	emu.unpause()
	emu.softreset() -- maybe make this load a savestate to not suck....
end
function writeWaitStatus()
	io.open(FILE_STATE,"w"):close() -- clear first
	stateF = io.open(FILE_STATE,"w")  -- now add content
	stateF:write(WAIT)
	stateF:close()
end
function hexStringToInt(txt)
	b1=string.byte(string.sub(txt, 1))
	b2=string.byte(string.sub(txt,-1))
	result = 0 
	if (b1 >= string.byte('A')) then
		 result = 16*result + b1 - string.byte('A') +10
	else
		 result = 16*result + b1 - string.byte('0')
	end

	if (b2 >= string.byte('A')) then
		 result = 16*result  + b2 - string.byte('A') +10
	else
		 result = 16* result + b2 - string.byte('0')
	end
	return result
end
function setNewROMData()
	printStatus("Reading in New Data")
	local dataF = io.open(FILE_DATA, "r")
	newMAP = ''
	newCHR = ''
	-- Line 1: level data Line 2: dots, Line 3: enemy Data
	newMAP  = dataF:read("*line")
	dataF:read("*line") -- this should just be a dash
	newCHR  = dataF:read("*line")
	dataF:close()
end
function createNewROMFile()
	printStatus("Writing new ROM File")
	--
	dataAsHex    = ''
	newDataAsHex = ''
	--
	local fileName  = '.\\Kickle Cubicle (USA).nes'
	local fileROM   = assert(io.open(fileName, 'rb'))
	local dataROM   = fileROM:read("*all")
	local byteIndex = 1
	-- convert data from binary to hex
	repeat
		local str = string.byte(dataROM,byteIndex)
		if str then
			dataAsHex = dataAsHex .. string.format('%02X',str)
			byteIndex = byteIndex + 1
		end
	until not str
	-- seek and replace MAP data
	local indexOfMapData = string.find(dataAsHex, originalMAP, 1,true)
	if indexOfMapData then
		print("Found MAP Location at ["..tostring(indexOfMapData).."]")
		print("Replacing ORIGINAL LEVEL DATA with NEW LEVEL DATA")
		newDataAsHex = dataAsHex:gsub(originalMAP,newMAP)
	end
	-- seek and replace CHARACTER data
	indexOfChrData = string.find(newDataAsHex, originalCHR, 1,true)
	if indexOfChrData then
		print("Found ENEMY Location at ["..tostring(indexOfChrData).."]")
		print("Replacing ORIGINAL ENEMY DATA with NEW ENEMY DATA")
		newDataAsHex = newDataAsHex:gsub(originalCHR,newCHR)
	end
	-- write to ROM file
	-- now write
	local writeFile = io.open( "KickleCubicle_mod.nes", "wb" )
		byteIndex = 1
		newDataAsHex:gsub("..", function(cc)
		writeFile:write(string.char(tonumber(cc, 16)))
	end)
end
--
--
--
--
--
emu.speedmode("normal")
while true do
   local stateF = io.open(FILE_STATE, "r")
   if stateF then
	local stateT = stateF:read("*all")
	stateF:close()
	if stateT == WAIT then
		printStatus("Waiting for new Level");
	else
		emu.pause()
		printStatus("New ROM created: ["..stateT.."]");
		----
		setNewROMData()
		createNewROMFile()
		----
		writeWaitStatus()
		reload()
	end
   else
	printStatus("Did not find Status File");
   end
   emu.frameadvance() -- This essentially tells FCEUX to keep running
end
