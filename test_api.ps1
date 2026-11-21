$scratch = "C:\Users\zakar\.gemini\antigravity\scratch"
$env:DOTNET_CLI_HOME = "$scratch\.dotnet"
$env:NUGET_PACKAGES = "$scratch\.nuget"
$env:APPDATA = "$scratch\AppData\Roaming"

Write-Host "Starting College Lost & Found Backend API..."
$backendDir = "$scratch\college-lost-and-found\backend"
$process = Start-Process -FilePath "dotnet" -ArgumentList "run --no-build --urls http://localhost:5000" -WorkingDirectory $backendDir -PassThru -NoNewWindow

Start-Sleep -Seconds 8

try {
    Write-Host "`n1. Testing GET /api/categories..."
    $cats = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
    Write-Host "Categories Count: $($cats.Count)"
    $cats | ForEach-Object { Write-Host " - $($_.name) ($($_.reportsCount) items)" }

    Write-Host "`n2. Testing GET /api/locations..."
    $locs = Invoke-RestMethod -Uri "http://localhost:5000/api/locations" -Method Get
    Write-Host "Locations Count: $($locs.Count)"
    $locs | Select-Object -First 3 | ForEach-Object { Write-Host " - $($_.name)" }

    Write-Host "`n3. Testing GET /api/reports..."
    $reports = Invoke-RestMethod -Uri "http://localhost:5000/api/reports" -Method Get
    Write-Host "Reports Count: $($reports.Count)"
    $reports | ForEach-Object { Write-Host " - [ID $($_.reportID)] [$($_.type)] $($_.title) (Location: $($_.locationName))" }

    Write-Host "`n4. Testing POST /api/auth/login (Admin)..."
    $adminLogin = @{
        usernameOrEmail = "admin@college.edu"
        password = "Admin@123"
    } | ConvertTo-Json
    $adminRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $adminLogin -ContentType "application/json"
    Write-Host "Admin Login SUCCESS! User: $($adminRes.user.username), Role: $($adminRes.user.role)"
    $adminToken = $adminRes.token

    Write-Host "`n5. Testing GET /api/dashboard/admin (Authorized with JWT)..."
    $headers = @{ Authorization = "Bearer $adminToken" }
    $adminDash = Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/admin" -Method Get -Headers $headers
    Write-Host "Admin Dashboard Stats:"
    Write-Host " - Total Users: $($adminDash.totalUsers)"
    Write-Host " - Total Lost Reports: $($adminDash.totalLostReports)"
    Write-Host " - Total Found Reports: $($adminDash.totalFoundReports)"
    Write-Host " - Pending Claims: $($adminDash.pendingClaims)"
    Write-Host " - Returned/Claimed: $($adminDash.returnedItems)"
    Write-Host " - Unclaimed (>14d): $($adminDash.unclaimedItems)"

    Write-Host "`n6. Testing Smart Matching Engine: GET /api/reports/1/matches..."
    $matches = Invoke-RestMethod -Uri "http://localhost:5000/api/reports/1/matches" -Method Get
    Write-Host "Matches Found: $($matches.Count)"
    $matches | ForEach-Object {
        Write-Host " - Matched: $($_.matchedReport.title) [Confidence: $($_.similarityScore)%]"
        Write-Host "   Reasons: $($_.matchReasons -join ', ')"
    }

    Write-Host "`n7. Testing POST /api/auth/login (Student john_doe)..."
    $studentLogin = @{
        usernameOrEmail = "john.doe@college.edu"
        password = "Student@123"
    } | ConvertTo-Json
    $studentRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $studentLogin -ContentType "application/json"
    Write-Host "Student Login SUCCESS! User: $($studentRes.user.username)"
    $studentToken = $studentRes.token

    Write-Host "`n8. Testing GET /api/claims/user/my-claims (Student Claims)..."
    $studentClaims = Invoke-RestMethod -Uri "http://localhost:5000/api/claims/user/my-claims" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
    Write-Host "Student Claims Count: $($studentClaims.Count)"
    $studentClaims | ForEach-Object {
        Write-Host " - Claim #$($_.claimID): Item: $($_.reportTitle) | Status: $($_.status) | Proof: $($_.proof)"
    }

    Write-Host "`n9. Testing GET /api/notifications (Student Notifications)..."
    $notifs = Invoke-RestMethod -Uri "http://localhost:5000/api/notifications" -Method Get -Headers @{ Authorization = "Bearer $studentToken" }
    Write-Host "Student Notifications Count: $($notifs.Count)"
    $notifs | ForEach-Object {
        Write-Host " - [$($_.type)] $($_.message)"
    }

    Write-Host "`n=== ALL API TESTS PASSED WITH 100% SUCCESS ==="
}
catch {
    Write-Host "`n[TEST ERROR]: $_"
    Write-Host $_.Exception.ToString()
}
finally {
    Write-Host "`nStopping backend process..."
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
}
