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
	this.mapData = {
		name:'',
		tile:{
			original:'80060144800C810244800B42C301468007810A448002810C44800142C30B468001810C44800142810A41468002422C0103810203012C4146800442810641468006428104414680084281024146800A42014146800C42468006',
			current :'80060144800C810244800B42C301468007810A448002810C44800142C30B468001810C44800142810A41468002422C0103810203012C4146800442810641468006428104414680084281024146800A42014146800C42468006'
		},
		//Lvl1
		//0BC00A05007383FF017B8BFF03EFFF17161801A7
		//Lvl5
		//0BC00A0500EFFF52625C016726012801
		character:{
			original:'0BC00A05007383FF017B8BFF03EFFF17161801A7',
			current :'0BC00A05007383FF017B8BFF03EFFF17161801A7'
		},
		spawn:{
			kickle:{row:-1,col:-1},
			bag   :[
				{row:-1,col:-1},
				{row:-1,col:-1},
				{row:-1,col:-1}
			],
			enemies:[]
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
	this.getMapData = function(mapData){
		this.name = mapData.name || '??????';
		this.initTileData(hexData.tile) 
		this.setCharacterData(hexData.character)
	};
	//
	// Tile Data
	//
	this.tileData = function() {
		return this.mapData.tile.current;
	};
	this.initTileData = function(hexData) {
		this.mapData.tile.original = hexData;
		this.resetTileData();
	};
	this.setTileData = function(hexData) {
		this.mapData.tile.current = hexData;
	};
	this.resetTileData = function(hexData) {
		this.mapData.tile.current  = this.mapData.tile.original;
	};
	this.getTileDataOriginalSize = function(){
		return this.mapData.tile.original.match(/[\s\S]{1,2}/g).length
	};
	this.getTileDataCurrentSize = function(){
		return this.mapData.tile.current.match(/[\s\S]{1,2}/g).length
	};
	//
	// Character Data
	//
	this.characterData = function() {
		return this.mapData.character.current;
	};
	this.initCharacterData = function(hexData) {
		this.mapData.character.original = hexData;
		this.resetTileData();
	};
	this.setCharacterData = function(hexData) {
		this.mapData.character.current = hexData;
		this.setKickleSpawn();
		this.setBagSpawns();
	};	
	this.resetCharacterData = function(hexData) {
		this.mapData.character.current  = this.mapData.character.original;
		this.setKickleSpawn();
		this.setBagSpawns();
	};
	this.getCharacterDataOriginalSize = function(){
		return this.mapData.character.original.match(/[\s\S]{1,2}/g).length
	};
	this.getCharacterDataCurrentSize = function(){
		return this.mapData.character.current.match(/[\s\S]{1,2}/g).length
	};
	//
	// Kickle Functions
	//
	this.getKickleSpawn = function(){
		return this.mapData.spawn.kickle;
	};
	this.setKickleSpawn = function(){
		this.mapData.spawn.kickle = {row:-1,col:-1};
		let hexValues   = this.mapData.character.current.match(/[\s\S]{1,2}/g);
		let pastEnemies = false;
		let atKickle    = false;
		for(let i=0;i<hexValues.length;i++){
			pastEnemies = hexValues[i] === 'EF' || pastEnemies;
			atKickle    = pastEnemies && hexValues[i-1] === '01'
			if(atKickle && this.mapData.spawn.kickle.row == -1){ 
				this.mapData.spawn.kickle = {row:parseInt(hexValues[i].charAt(0),16),col:parseInt(hexValues[i].charAt(1),16)};
			}
		}
	};
	this.isKickleSpawn = function(row,col){
		return this.mapData.spawn.kickle.row == row && this.mapData.spawn.kickle.col == col;
	};
	//
	// Dream Bag Functions
	//
	this.getBagSpawns = function(){
		return this.mapData.spawn.bag;
	};
	this.setBagSpawns = function(){
		let hexValues             = this.mapData.character.current.match(/[\s\S]{1,2}/g);
		let lastEnemyIndex        = 0;
		this.mapData.spawn.bag[0] = {row:-1,col:-1};
		this.mapData.spawn.bag[1] = {row:-1,col:-1};
		this.mapData.spawn.bag[2] = {row:-1,col:-1};
		for(let i=0;i<hexValues.length;i++){
			if (hexValues[i] === 'EF'){
				for(var j=0;j<3;j++){
					this.mapData.spawn.bag[j] = {row:parseInt(hexValues[i+j+2].charAt(0),16),col:parseInt(hexValues[i+j+2].charAt(1),16)};
				}
				i=hexValues.length;
			};
				
		}
	};
	this.isBagSpawn = function(row,col){
		let isSpawn = false
		for(var i=0;i<this.mapData.spawn.bag.length;i++){
			let bag = this.mapData.spawn.bag;
			isSpawn = bag[i].row == row && bag[i].col == col || isSpawn;
		}
		return isSpawn;
	};
	//
	// Constructor 
	//
	this.setKickleSpawn();
	this.setBagSpawns();
});