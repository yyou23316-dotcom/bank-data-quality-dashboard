@echo off
setlocal

set "BASE_DIR=%~dp0"
set "WRAPPER_DIR=%BASE_DIR%.mvn\wrapper"
set "PROPERTIES_FILE=%WRAPPER_DIR%\maven-wrapper.properties"
set "MAVEN_DIST_DIR=%WRAPPER_DIR%\dists"
set "MAVEN_ZIP=%WRAPPER_DIR%\apache-maven.zip"
set "MAVEN_HOME=%MAVEN_DIST_DIR%\apache-maven-3.9.9"
set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

if not exist "%PROPERTIES_FILE%" (
  echo Cannot find %PROPERTIES_FILE%
  exit /b 1
)

if not exist "%MAVEN_CMD%" (
  echo Downloading Maven Wrapper distribution...
  if not exist "%MAVEN_DIST_DIR%" mkdir "%MAVEN_DIST_DIR%"
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$properties = Get-Content '%PROPERTIES_FILE%';" ^
    "$url = ($properties | Where-Object { $_ -like 'distributionUrl=*' }) -replace 'distributionUrl=', '';" ^
    "Invoke-WebRequest -UseBasicParsing $url -OutFile '%MAVEN_ZIP%';" ^
    "if (Test-Path '%MAVEN_HOME%') { Remove-Item -Recurse -Force '%MAVEN_HOME%' };" ^
    "Expand-Archive -Force '%MAVEN_ZIP%' '%MAVEN_DIST_DIR%';" ^
    "Remove-Item -Force '%MAVEN_ZIP%'"
)

if not exist "%MAVEN_CMD%" (
  echo Maven Wrapper failed to install Maven.
  exit /b 1
)

if "%~1"=="spring-boot:run" (
  call "%MAVEN_CMD%" -DskipTests package
  if errorlevel 1 exit /b %errorlevel%
  java -jar "%BASE_DIR%target\bank-it-demo-0.0.1-SNAPSHOT.jar"
  exit /b %errorlevel%
)

call "%MAVEN_CMD%" %*
endlocal
