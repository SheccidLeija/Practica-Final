# Remove existing zip if it exists
if (Test-Path backend.zip) {
    Remove-Item backend.zip
}

# Create new zip file excluding node_modules, .env, and tests
Compress-Archive -Path * -DestinationPath backend.zip -Force -Exclude "node_modules/*", ".env", "tests/*"

# Deploy to Azure using the Zip Deploy profile credentials
$credentials = "$Sapitos:S7kvBs0G52Ym8QwWykrk0q3xEdnXnhuvoWhw8LSeeszvGZdyBmnEKGTp4NWB"
$encodedCredentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))

$headers = @{
    "Authorization" = "Basic $encodedCredentials"
}

# Deploy the zip file
$deployUrl = "https://sapitos.scm.azurewebsites.net:443/api/zipdeploy"
Invoke-RestMethod -Uri $deployUrl -Method Post -InFile "backend.zip" -Headers $headers -ContentType "application/zip" 