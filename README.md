# KickleCubicleLevelEditor
Notes, eventually a program for editing Kickle Cubicle levels

# Intro
blah blah blah

# Notes on how a level is layed out
 xxx amount of bytes
 
# Values for block types
!!! <it'd be nice to insert pictures OF the block!>
How to Read: (Left of parenthesis is if group, right is if single, right of parenthesis is right nybble)
example: (8/0)0 == 80 OR 00, depending on group or single use.
---- (8/0)
- (8/0)0: Ocean
- (8/0)1: Normal Block 
- (8/0)2: Purple Block
- (8/0)3: Orange Blocker
- (8/0)4: Hole Block
- (8/0)5: Solid P Powerup
- (8/0)6: Broken P Powerup
- (8/0)7: Ice Cream
- (8/0)8->8F: Cannons
---- (9/1)
- (9/1)0: Purple Block Edged Top Left
- (9/1)1: Purple Block Edged Left
- (9/1)2: Purple Block Edged Bottom Left
- (9/1)3: Purple Block Edged Top
- (9/1)4: Purple Block Edged Bottom
- (9/1)4: Purple Block Edged Top Right

# FAQ
 - Why is my screen modified after I die?
 -- You have not accounted for the byte limit set per level. You need to have an assignment for exactly X amount of tiles. If information is not defined you'll start seeing funky stuff after kickle dies and the level is reloaded.
 ---- this is common if you miscalculate your compressed blocks
