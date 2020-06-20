
# KickleCubicleLevelEditor
This is a NodeJS application which will run a web server to allow you to edit Kickle Cubicle Levels

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
		 - I have the wrong enemy data input! I pulled the enemy data via powershell scripts from parsing the CurlyNotes_AKA_almostEverything.txt file. This knowing led to a few levels with wierd (or in some cases NO) data.
		 -  If you are ambitious enough you can find and pull the enemy data yourself and update the files under <root of this repo>/WIP/app/json/maps/level_<# of level>.json. Just putting the hex data (no spaces) in the value for rawHexData.character will fix this!    
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
