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
- (8/0)8->F: Cannons
---- (9/1)
- (9/1)0: Purple Block Edged Top Left
- (9/1)1: Purple Block Edged Left
- (9/1)2: Purple Block Edged Bottom Left
- (9/1)3: Purple Block Edged Top
- (9/1)4: Purple Block Edged Bottom
- (9/1)5: Purple Block Edged Top Right
- (9/1)6: Purple Block Edged Right
- (9/1)7: Purple Block Edged Bottom Right
- (9/1)8: Hammer Head Piece Horizontal Centered
- (9/1)9: Hammer Head Piece Vertical
- (9/1)A: Hammer Head Piece Horizontal Bottom Edge
- (9/1)B: Hammer Head Piece Vertical Left Edge
- (9/1)C: Hammer Arm Piece Up
- (9/1)D: Hammer Arm Piece Right
- (9/1)E: Hammer Arm Piece Down
- (9/1)F: Hammer Arm Piece Left
---- (A/2)
- (A/2)0: Kickle Ice Block Solid
- (A/2)1->2: Kickle Ice Cylinder
- (A/2)3: Kickle Ice Block Melted
- (A/2)4: Normal Block (see solo in water?
- (A/2)5: 1 up!
- (A/2)6: Normal Block (see solo in water?)
- (A/2)7: Just blue (no ocean)
- (A/2)8: Block Breaker Arrow Up
- (A/2)9: Block Breaker Arrow Right
- (A/2)A: Block Breaker Arrow Down
- (A/2)B: Block Breaker Arrow Left
- (A/2)C: Monster Spawn Closed (nothing came out)
- (A/2)D: Monster Spawn Open Mid (nothing came out)
- (A/2)E: Monster Spawn Open Full (nothing came out)
- (A/2)F: Tiny Orange Blocks in a group of 4 (note: is walkable)
---- (B/3) -- play with springs sometime, they are uni directional!
- (B/3)0->1: Spring Expanded Horizontal
- (B/3)2->3: Spring Expanded Vertical
- (B/3)4->5: Spring Condensed Horizontal Left
- (B/3)6->7: Spring Condensed Horizontal Right
- (B/3)8->9: Spring Condensed Vertical Top
- (B/3)A->B: Spring Condensed Vertical Bottom
# FAQ
 - Why is my screen modified after I die?
 -- You have not accounted for the byte limit set per level. You need to have an assignment for exactly X amount of tiles. If information is not defined you'll start seeing funky stuff after kickle dies and the level is reloaded.
 ---- this is common if you miscalculate your compressed blocks
