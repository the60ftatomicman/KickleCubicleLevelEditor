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
- (B/3)C: Sinking Tile Mid Sink (unwalkable)
- (B/3)D: Sinking Tile Beginning Sink (unwalkable)
- (B/3)E: Tiny Orange Blocks in a group of 4 (note: is walkable)(Yes same as A/2F)
- (B/3)F: Purple Block  (Same as 8/02)
---- (C/4)
- (C/4)0: Cracked Ice (non-walkable)
- (C/4)1: Edge of Ice - top and left
- (C/4)2: Edge of Ice - top
- (C/4)3: Edge of Ice - top
- (C/4)4: Edge of Ice - left
- (C/4)5: Edge of Ice - left
- (C/4)6: Edge of Ice - Little top left corner
- (C/4)7: Tiny yellow/blue corners in a group of 4 (not walkable)
- (C/4)7: Tiny yellow/blue corners in a group of 4 (not walkable)
- (C/4)8: Crushed Ice
- (C/4)9: Crushed Ice (further deteriorated)
- (C/4)A: Crushed Ice top only
- (C/4)B: Crushed Ice top and Bottom
- (C/4)C: Crushed Ice left only
- (C/4)D: Crushed Ice (different than 8-9 but all over)
- (C/4)E: Crushed Ice top right only
- (C/4)F: Crushed Ice (different than 8,9 and D but all over)
---- (D/5) (looks like edging in boss battles and princess rooms)(note flower is "hammer shaft")
-- Note certain this isn't just sprite data at this point!
-- all of these go without palette. will turn back if cylinder placed on them
- (D/5)0: a lower case 'b' (walkable)
- (D/5)1: half a flower (walkable)
- (D/5)2: half flower and hammer
- (D/5)3: half hammer horizontal and vertical
- (D/5)4->5: half hammer vertical and horizontal
- (D/5)6: half hammer vertical and flower
- (D/5)7: more flower bits
- (D/5)8: more flower bits and two blank sqaures
- (D/5)9: Spring Horizontal (not working)
- (D/5)A: Spring Vertical (not working)
- (D/5)B: Spring collapsed (all)
- (D/5)C: Spring collapsed Vertical
- (D/5)D: Spring collapsed Horizontal
- (D/5)E: pure white block
- (D/5)F: Tiny Orange Blocks in a group of 4 (note: is walkable)(Yes same as A/2F)
---- (E/6) (Numbers act as wall)
- (E/6)0: Numeric, 4,5,6,7
- (E/6)1: Numeric, 8,9, lives icon
- (E/6)2: cool blue block (sprite data for block breakers)
- (E/6)3: half cool blue block and arrow (sprite data for block breakers)
- (E/6)4->F: Tiny Orange Blocks in a group of 4 (note: is walkable)(Yes same as A/2F)
---- (F/7) (Numbers act as wall)
- (F/7)0: Purple Edge Top Left
- (F/7)1: Purple Edge Left Right 
- (F/7)2: Purple Edge Bottom Left
- (F/7)3: Purple Edge Top
- (F/7)4: Purple Edge Bottom
- (F/7)5: Purple Edge Top Right
- (F/7)6: Purple Edge Right
- (F/7)7: Purple Edge Bottom Right
- (F/7)8: Odd blue and white pattern
- (F/7)9->E: Tiny Orange Blocks in a group of 4 (note: is walkable)(Yes same as A/2F)
- (F/7)F: Black Red Water
# FAQ
 - Why is my screen modified after I die?
 -- You have not accounted for the byte limit set per level. You need to have an assignment for exactly X amount of tiles. If information is not defined you'll start seeing funky stuff after kickle dies and the level is reloaded.
 ---- this is common if you miscalculate your compressed blocks
