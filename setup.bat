@echo off
REM 🥔 Script de configuration du système de classification des maladies de la pomme de terre pour Windows
REM Nécessite Python 3.8+ et Node.js 14+ installés

echo 🥔 Configuration du système de classification des maladies de la pomme de terre
echo =============================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Python 3.8+ à partir de https://python.org
    pause
    exit /b 1
)

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js 14+ à partir de https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Version de Python :
python --version

REM Configuration du backend Python
echo [INFO] Configuration du backend Python...

if not exist "myenv" (
    echo [INFO] Création de l'environnement virtuel Python...
    python -m venv myenv
    echo [SUCCÈS] Environnement virtuel créé !
) else (
    echo [AVERTISSEMENT] L'environnement virtuel existe déjà
)

echo [INFO] Installation des dépendances Python...
myenv\Scripts\pip install --upgrade pip
myenv\Scripts\pip install -r requirements.txt

echo [INFO] Version de Node.js :
node --version

@REM echo [INFO] Version de npm :
@REM npm --version
@REM echo.

echo [SUCCÈS] Configuration du backend Python terminée !
echo.

REM Configuration du frontend React
echo [INFO] Configuration du frontend React...
cd frontend

if not exist "node_modules" (
    echo [INFO] Installation des dépendances Node.js...
    npm install
    echo [SUCCÈS] Dépendances du frontend installées !
) else (
    echo [AVERTISSEMENT] Les dépendances Node.js sont déjà installées
)
echo [SUCCÈS] Configuration du frontend React terminée !
echo.

pause
