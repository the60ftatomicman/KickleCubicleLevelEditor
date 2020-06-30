
# KickleCubicleLevelEditor
This is a NodeJS application which will run a web server to allow you to edit Kickle Cubicle Levels
Currently Version 0.02

# TL;DR - How do I run this
0) Install the latest version of **nodejs**
1) **Clone** the Repo
2) navigate to **WIP**
3) run **npm start**
4) In your web-browser goto: **localhost:8080/index.html**
-- Steps 5-6 exist since this thing is still VERY much in development to make the process for editing easier
5) Open the file "<root of this repo>/Docs/**breakdownOfCompression.txt**" to understand how the tile mapping works
6) Open the file "<root of this repo>/Docs/**CurlyNotes_AKA_almostEverything.txt**" to see tile assignments, enemy grouping assignments, and treat it as the definitive text guide on modifying this game
7) Open the file "<root of this repo>/Docs/**quick_tile_guide.txt**" for the abridged tile assignment info 
8) Edit and enjoy.

# Intro Summary
Kickle Cubicle released in 1990 for the NES (previously 1988 in arcades) is a puzzle push block game; similar to Adventures of Lolo (NES). It features 67 levels in the main game with 30 additional special levels. This simply isn't enough.
With the help of this tool I want to promote new level creation for this game.
The goal of this project is to build a simplified (eventually) editor so people can design more levels for all to share and enjoy.

# How do I use this thing
See steps under TL;DR above to understand how to launch the game.
AT the moment you'll need to use the hex editors at the bottom of the webpage to edit the tiles.
- The left-most editor controls the tiles.
-- Grouping tile hexes will be paired (ex: 80,02)
-- All hexes will be spaced (ex: 44 43 80,02 34)
- The right-most editor controls the enemies, their spawns, kickles landing location, and the dream bag locations.
-- Note that the editors modify the text automatically after a user inserts any text for appearance


# FAQ

 - Editor Questions 
	 - Why does the enemy data look awful?
		 - I have the wrong enemy data input (or didn't add the enemy data). I tried to automate pulling the enemy data via powershell scripts from parsing the CurlyNotes_AKA_almostEverything.txt file. This didn't always extract correctly and led to some iffy looking data.
		 -  If you are ambitious enough you can find and pull the enemy data yourself and update the files under <root of this repo>/WIP/app/json/maps/level_<# of level>.json. Just putting the hex data (no spaces) in the value for rawHexData.character will fix this!  
		 - You don't need a ROM to do this...just gotta pull it manually from CurlyNotes_AKA_almostEverything.txt and plop it (remove spaces as well) into the proper level_#.json file.
	 - I noticed a white box with just some hex value in it. What's that?
		 -  I haven't made an image for that tile yet. By default it just shows a white box with the hex value in it.
		 - If you are ambitious enough you can add the tile image under <root of this repo>/WIP/app/img/tiles ; than update <root of this repo>/WIP/app/json/meta_info.json sprites.tile with the tile hex value to indicate this sprite has been generated.
	 - Why are there so many small steps for updating things? Why!?
		 - I originally thought I'd put this out to the public and actually host the website myself...updating at a slow pace when I had time between work and family. Alot of the JSON data I thought I'd keep in a noSQL mongo database somewhere or just write AWS lambda functions to dump this data. I'll just shorten the answer to "I was architecting and coding simultaneously" which is a bad decision for all of you budding Computer Science majors.
	 - I want to suggest a feature, like maybe a nice border around the tile you are hovering over! How do I contact you? 
		 -  garb7477@gmail.com
		 - I am 100% also open to collaboration. If you want to make a change and pull request for this code I'd be thirlled.
 - Game Behavior Post Modification Questions
	 - Why is my screen modified after I die?
		 - You have not accounted for the byte limit set per level. You need to have an assignment for exactly X amount of tiles. If information is not defined you'll start seeing funky stuff after kickle dies and the level is reloaded
		 - this is common if you miscalculate your compressed blocks
		 
# Feature Timeline

 - v0.10 - finishing up images
	 - (DONE) Add all tiles under single Garden Land palette
	 - (DONE) Add all enemies in mini 16v16 view
	 - BUGS
		- (FIXED) Secondary enemies seem to be not showing now?
		- (FIXED) putting in lower case HEX causes unknown to appear
		- (FIXED) Bonkers not appearing
		- (FIXED) Spawn for Hoople not appearing
 - v0.20 - adding in Help guide / Better level selection
	 - Argueably the earliest this becomes usable by someone who hasn't read the docs
	 - (DONE) Visual guide to EACH tile value
	 - (DONE) Visual guide to enemy Group codes
	 - (DONE) Better map selection and navigation
 -  v0.30 - Support for enemy direction
	 - show which way they are facing
	 - Try to get full sprite support by this point!
 -  v0.40 - Iron out level data that is incorrect / Get Enemy Memory Adddresses
	 - This will undoubtably be the most boring thing I do.
	 - Redo the cursor on the map at this point? I hate the solution I have now.
 - v0.50 -> v0.80 ???
 - v0.90 - Hosting / Converting to Electron App
	  - There are benefits to both we'll see by this point what seems to make sense.
	  - For Hosting
	     - On the web, no need for people to download!
		 - Can update whenever
		 - I can put this on my resume
		 - Can access from anywhere
		 - Can dust off the ol' AWS tutorials I took for hosting a site in 2018
		 - Can build some sort of kickle cubicle map community to pull others maps
	  - For Electron
	     - It's a localized app
		 - Can add features to build .NES for user after they finish saving
		    - Reluctant to do that with a website as i'll be sharing a rom. If it's modifying one you have I think that's OK
		 - Does not require internet.
		 - System for saving work is as simple as storing files locally.
		
 - v 1.0
	 - Actually host online or turn into an Electron application
	 - Add in "drag and drop" block placement
		 - Allow users to "paint" on tiles
	 - Hex Correction
		 - If the user has too many hexes or too little, click a button that condenses or expands code to best of ability
			 - so automatically set 80,03 instead of 00 00 00 and vice versa
	 - Multi editor mode for character data
		 - Raw mode - what we have now.. just the hex code
		 - Simple Mode - make individual inputs per character
	 - Palette modification for level tiles
	 - Save / Export Feature
		 - not saving the ROM image out, but just saving out the hex blobs
		 - I don't want to get in trouble for providing a full workable rom.

