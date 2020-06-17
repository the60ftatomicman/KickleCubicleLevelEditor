cls
$mapFile  = ".\romMap_LevelData_OrderByLevel.txt"
$maps     = [System.Collections.ArrayList]@()
Get-Content -Path $mapFile | ForEach-Object{
	$maps.Add(@{
		start = $_.substring(0 ,5)
		end   = $_.substring(9,5)
		name  = $_.substring(17)
	})
}
$romFile  = ".\Kickle Cubicle (USA).nes"
$currentMap = 0
$maps | forEach-Object{
	$objMap   = $_
	$currentMap++
	$idxStart = $objMap.start # '17AB2'
	$idxEnd   = $objMap.end   # '17B0A'
	$name     = $objMap.name  # 'Garden Land A'
	$count    = 0
	$hexData  = ""
	$record   = $false
	$outputFile = ".\level_$currentMap.json"
	Write-Host "Finding $name from $idxStart to $idxEnd Writing to $outputFile"
	Format-Hex -Path $romFile | ForEach-Object{
		$line = [string]$_
		$hexArray = $line.substring(10,49).replace(" ","") -split '([0-9A-F]{2})'
		$hexArray.Where({ "" -ne $_ }) | ForEach-Object{
			$hexAdd  = '{0:x2}' -f $count
			$hexPrev = '{0:x2}' -f ($count-1)
			if($hexAdd -eq $idxStart){
				$record=$true
				Write-Host $name
			}
			if($hexPrev -eq $idxEnd){
				$record=$false
				Write-Host $hexData
				Write-Host "----------"
				$fileData = '''
				{
					"meta":{
						"world" : "$name",
						"index" : "$idxName"
					},
					"rawHexData": {
						"tile"     : "$hexData",
						"character": "",
						"palette"  : ""
					},
					"hexAddresses": {
						"tile"     : {"start":"$idxStart","end":"$idxEnd"},
						"character": [],
						"palette"  : []
					}
				}
				'''
				$nameArray = $name.split(" ")
				$fileData = $fileData.replace('$name'    ,$($nameArray[0]+" "+$nameArray[1]))
				$fileData = $fileData.replace('$idxName' ,$nameArray[2])
				$fileData = $fileData.replace('$hexData' ,$hexData)
				$fileData = $fileData.replace('$idxStart',$idxStart)
				$fileData = $fileData.replace('$idxEnd'  ,$idxEnd)
				$fileData = $fileData.replace("'"        , "")
				$prettyData = $fileData | ConvertFrom-Json | ConvertTo-Json 
				Set-Content -Path $outputFile -Value $prettyData
				break;
				#exit;
			}			
			if($record){
				#Write-Host("$hexAdd = $_")
				$hexData=$hexData+"$_"
			}
			$count++
		}
	}
}
