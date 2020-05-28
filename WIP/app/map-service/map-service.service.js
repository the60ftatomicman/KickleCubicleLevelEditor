'use strict';
angular.module('MapService',[]);
angular.module('MapService', [])
	.service('MapService', function() {
	//
	//
	//Lvl1
	//80060144800C810244800B42C301468007810A448002810C44800142C30B468001810C44800142810A41468002422C0103810203012C4146800442810641468006428104414680084281024146800A42014146800C42468006
	//Lvl2
	//80060344800B810444800942C30346800907440744074480060344004246424642460003448002034103448104440341034400034146428106414642034403450081084400034542032C81082C0341460042038108034146800242810841468004428106414680064281044146800842C303468004
	//Lvl3
	//80060144800C01410144800A074107410744800807410741074107448006074107410741074107448005424642464246424642468004810A4480032C81082C458003428108414680044281064146800642C3010141C30146800A0145800B0581020544800942C303468004
	//Lvl4
	//8002810144000144008101448005424301440145014143468007420141014146800A4246424680088102870281024480048104078104448003810A4580032C81082C4580034281084146800442810641468006428104414680084281024146800A42054146800C42468006
	//Lvl5
	//8005810244800A810444800881012C012C81014480078106458007428101038101414680033181022081044581023044318102208104458102304542C30381044542C302468004810445800942C30346800981012581014480094281024146800A42014146800C42468006
	var self = this;
	self.mapData = {
		name:'',
		tile:{
			original:'80060344800B810444800942C30346800907440744074480060344004246424642460003448002034103448104440341034400034146428106414642034403450081084400034542032C81082C0341460042038108034146800242810841468004428106414680064281044146800842C303468004',
			current :'80060344800B810444800942C30346800907440744074480060344004246424642460003448002034103448104440341034400034146428106414642034403450081084400034542032C81082C0341460042038108034146800242810841468004428106414680064281044146800842C303468004'
		},
		//Lvl1
		//0BC00A05007383FF017B8BFF03EFFF17161801A7
		//Lvl2
		//0BC00A0500848200018A8C0003EF0D080E0D0217FF0000EFFF15671901A7
		//Lvl5
		//0BC00A0500EFFF52625C016726012801
		character:{
			original:'0BC00A0500848200018A8C0003EF0D080E0D0217FF0000EFFF15671901A7',
			current :'0BC00A0500848200018A8C0003EF0D080E0D0217FF0000EFFF15671901A7'
		},
		spawn:{
			kickle:{row:-1,col:-1},
			bag   :[
				{row:-1,col:-1},
				{row:-1,col:-1},
				{row:-1,col:-1}
			],
			enemy:[]
		},
		sprite:[
			'00','01','03','05','07',
			'20','25','2C',
			'30','31',
			'41','42','43','44','45','46',
			'80','81','83','85','87',
			'A0','A5','AC',
			'B0','B1',
			'C1','C2','C3','C4','C5','C6'
		]
	};
	//
	// Generic Functions
	//
	self.getMapData = function(mapData){
		self.name = mapData.name || '??????';
		self.initTileData(hexData.tile) 
		self.setCharacterData(hexData.character)
	};
	//
	// Tile Data
	//
	self.tileData = function() {
		return self.mapData.tile.current;
	};
	self.initTileData = function(hexData) {
		self.mapData.tile.original = hexData;
		self.resetTileData();
	};
	self.setTileData = function(hexData) {
		self.mapData.tile.current = hexData;
	};
	self.resetTileData = function(hexData) {
		self.mapData.tile.current  = self.mapData.tile.original;
	};
	self.getTileDataOriginalSize = function(){
		return self.mapData.tile.original.match(/[\s\S]{1,2}/g).length
	};
	self.getTileDataCurrentSize = function(){
		return self.mapData.tile.current.match(/[\s\S]{1,2}/g).length
	};
	//
	// Character Data
	//
	self.characterData = function() {
		return self.mapData.character.current;
	};
	self.initCharacterData = function(hexData) {
		self.mapData.character.original = hexData;
		self.resetTileData();
	};
	self.setCharacterData = function(hexData) {
		self.mapData.character.current = hexData;
		self.setKickleSpawn();
		self.setBagSpawns();
		self.setEnemySpawns();
	};	
	self.resetCharacterData = function(hexData) {
		self.mapData.character.current  = self.mapData.character.original;
		self.setKickleSpawn();
		self.setBagSpawns();
		self.setEnemySpawns();
	};
	self.getCharacterDataOriginalSize = function(){
		return self.mapData.character.original.match(/[\s\S]{1,2}/g).length
	};
	self.getCharacterDataCurrentSize = function(){
		return self.mapData.character.current.match(/[\s\S]{1,2}/g).length
	};
	//
	// Kickle Functions
	//
	self.getKickleSpawn = function(){
		return self.mapData.spawn.kickle;
	};
	self.setKickleSpawn = function(){
		self.mapData.spawn.kickle = {row:-1,col:-1};
		let hexValues   = self.mapData.character.current.match(/[\s\S]{1,2}/g);
		let atKickle    = false;
		for(let i=hexValues.lastIndexOf('FF');i<hexValues.length;i++){
			atKickle = hexValues[i-1] === '01'
			if(atKickle && self.mapData.spawn.kickle.row == -1){ 
				self.mapData.spawn.kickle = {row:parseInt(hexValues[i].charAt(0),16),col:parseInt(hexValues[i].charAt(1),16)};
			}
		}
	};
	self.isKickleSpawn = function(row,col){
		return self.mapData.spawn.kickle.row == row && self.mapData.spawn.kickle.col == col;
	};
	//
	// Dream Bag Functions
	//
	self.getBagSpawns = function(){
		return self.mapData.spawn.bag;
	};
	self.setBagSpawns = function(){
		let hexValues      = self.mapData.character.current.match(/[\s\S]{1,2}/g);
		let lastEnemyIndex = hexValues.lastIndexOf('FF');
		for(var j=0;j<3;j++){
			self.mapData.spawn.bag[j] = {
				row:parseInt(hexValues[lastEnemyIndex+j+1].charAt(0),16),
				col:parseInt(hexValues[lastEnemyIndex+j+1].charAt(1),16)
			};
		}
	};
	self.isBagSpawn = function(row,col){
		let isSpawn = false
		for(var i=0;i<self.mapData.spawn.bag.length;i++){
			let bag = self.mapData.spawn.bag[i];
			isSpawn = bag.row == row && bag.col == col || isSpawn;
		}
		return isSpawn;
	};
	//
	// Enemy Functions
	//
	self.getEnemySpawns = function(){
		return self.mapData.spawn.enemy;
	};
	self.setEnemySpawns = function(){
		self.mapData.spawn.enemy = [];
		let hexValues = self.mapData.character.current.match(/[\s\S]{1,2}/g);
		let enemyIdx  = hexValues.lastIndexOf('EF');
		for(let i=0;i<enemyIdx;i=i){
			let identifier = hexValues.slice(i,i+5).toString().replace(/,/g, '');
			let idxMoved   = 1;
			if(identifier === '0BC00A0500'){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'noggle');
			}else if(identifier === '0D080E0D02' || identifier === '0D080E0D03' ){
				idxMoved = populateSpawnEntry(hexValues,i,enemyIdx,'hoople');
			}
			i+=idxMoved;
		}
	};
	function populateSpawnEntry(hexValues,currHexIdx,enemyIdx,enemyName){
		let groupSlice = hexValues.slice(currHexIdx+5,enemyIdx);
		    groupSlice = groupSlice.slice(0,groupSlice.indexOf('EF'));
		for(var j=0;j<groupSlice.length;j+=4){
		self.mapData.spawn.enemy.push({
			row       : parseInt(groupSlice[j].charAt(0),16),
			col       : parseInt(groupSlice[j].charAt(1),16),
			direction : parseInt(groupSlice[j+3]        ,16),
			name      : enemyName});
		self.mapData.spawn.enemy.push({
			row       : parseInt(groupSlice[j+1].charAt(0),16),
			col       : parseInt(groupSlice[j+1].charAt(1),16),
			direction : '',
			name      : 'baserock'});
		}
		return groupSlice.length+5;
	};
	self.isEnemySpawn = function(row,col){
		let retEnemy = undefined;
		for(var i=0;i<self.mapData.spawn.enemy.length;i++){
			let enemy = self.mapData.spawn.enemy[i];
			if(enemy.row == row && enemy.col == col){
				retEnemy = enemy;
			}
		}
		return retEnemy;
	};
	//
	// Constructor 
	//
	self.setKickleSpawn();
	self.setBagSpawns();
	self.setEnemySpawns();
});