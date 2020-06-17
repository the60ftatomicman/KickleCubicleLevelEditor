cls
$enemyDataFile  = ".\Just_Level_Data.txt"
$enemyData      = [System.Collections.ArrayList]@()
$currentData    = @{
	name = $null
	data = $null
}
$prevLine      = ""
$atEnemyData   = $false
$onLine        = 0
Get-Content -Path $enemyDataFile | ForEach-Object{
	$onLine++
	#Get Name
	if($_ -match '^(Level)' -and !($_ -match '(Data)')){
		Write-Host $_" Line"$onLine
		$currentData.name = $_
		$currentData.data = $null
		$atEnemyData = $false
	}
	#Match Blank
	if($_ -match '^$'){
		if($atEnemyData){
			$atEnemyData = $false
			Write-Host "Capturing OFF Line"$onLine
		}
		if($prevLine -match '^(Enemy Data)'){
			$atEnemyData = $true
			Write-Host "Capturing ON Line"$onLine
		}
	}
	#If on enemy Data Line
	if($atEnemyData){
		$currentData.data += $_.replace(" ","").replace("\r\n","")
		Write-Host $currentData.data" Line"$onLine
		pause
	}
	if(!$atEnemyData -and $currentData.name -ne $null -and $currentData.data -ne $null){
		$enemyData.Add($currentData)
		$currentData    = @{
			name = $null
			data = $null
		}
	}
	$prevLine = $_
}
$currentObj = 1
$enemyData | forEach-Object{
	$outputFile = ".\level_"+$currentObj+"_enemy.json"
	$fileData = '''
	{
		"meta":{
			"world" : "$name",
			"index" : "$idxName"
		},
		"rawHexData": {
			"tile"     : "",
			"character": "$hexData",
			"palette"  : ""
		}
	}
	'''
	$nameArray  = $_.name.split(" ")
	$fileData   = $fileData.replace('$name'    ,$($nameArray[3]+" "+$nameArray[4]))
	$fileData   = $fileData.replace('$idxName' ,$nameArray[5])
	Write-Host $_.data
	$fileData   = $fileData.replace('$hexData' ,$_.data)
	$fileData   = $fileData.replace("'"        , "")
	$prettyData = $fileData | ConvertFrom-Json | ConvertTo-Json 
	Write-Host $fileData
	Set-Content -Path $outputFile -Value $prettyData
	$currentObj++
}
