cls

$enemyData      = [System.Collections.ArrayList]@()
$mapData        = [System.Collections.ArrayList]@()
for($e=1;$e -lt 97;$e++){
	$enemyDataFile  = ".\enemyData\level_"+$e+"_enemy.json"
	$eData = Get-Content $enemyDataFile | ConvertFrom-Json
	$enemyData.Add($eData)
}
for($m=1;$m -lt 97;$m++){
	$mapDataFile  = ".\maps\level_"+$m+".json"
	$mData = Get-Content $mapDataFile | ConvertFrom-Json
	$mapData.Add($mData)
}
Write-Host "We have ["$enemyData.Count"] enemy list to add"
for($e=0;$e -lt $enemyData.Count;$e++){
	$mergedData = $false
	$eData = $enemyData[$e]
	$enemyName = $eData.meta.world+" "+$eData.meta.index
	#Write-Host "Working on  ["$e"] ["$enemyName"]"
	for($m=0;$m -lt $mapData.Count;$m++){
		$mData = $mapData[$m]
		$mapName = $mData.meta.world+" "+$mData.meta.index
		if($mData.meta.world -eq $eData.meta.world -and $mData.meta.index -eq $eData.meta.index){
			$iput = ".\maps\level_"+($m+1)+".json"
			$oput = ".\level_"+($m+1)+".json"
			#Write-Host "Adding enemy: ["$e"]["$enemyName"] to map: ["$m"]["$mapName"]"
			#Write-Host "Input: ["$iput"] Output: ["$oput"]"
			$fData = Get-Content $iput | ConvertFrom-Json
			if($fData.rawHexData.character -eq ""){
				$fData.rawHexData.character = $eData.rawHexData.character
			}
			$pData = $fData | ConvertTo-Json 
			Set-Content -Path $oput -Value $pData
			$mergedData = $true
			break;
		}else{
			#Write-Host "Mismatch enemy: ["$e"]["$enemyName"] to map: ["$m"]["$mapName"]"
		}
	}
	if(!$mergedData){
		Write-Host "Could not find Data for: "$enemyName
	}
}
Pause
exit
#Could not find Data for:  Garden Land I
#Could not find Data for:  Garden Land J
#Could not find Data for:  Garden Land H
#Could not find Data for:  Special Game 30
#Could not find Data for:  Garden Land K