# Système de Classification des Maladies de la Pomme de Terre

Système d'intelligence artificielle utilisant un réseau de neurones convolutifs (CNN) pour détecter et classifier les maladies des pommes de terre à partir d'images de feuilles.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre système :

### Pour Windows :
- **Python 3.8+** : Téléchargez depuis https://python.org
- **Node.js 14+** : Téléchargez depuis https://nodejs.org

### Pour Linux/WSL :
- **Python 3.8+** : `sudo apt install python3 python3-pip python3-venv`
- **Node.js 14+** : `sudo apt install nodejs npm`

## Installation et Configuration automatique

#### Windows
1. Ouvrez PowerShell ou l'invite de commandes en tant qu'administrateur
2. Naviguez vers le répertoire du projet :
   ```powershell
   cd C:\chemin\vers\le\projet
   ```
3. Exécutez le script de configuration de l'environement virtuel de python et telechargement des modules pour javascript:
   ```powershell
   .\setup.bat
   ```

### Installation Manuelle (au cas ou le setup.bat ne marche pas comme il faut)

#### 1. Configuration du Backend (FastAPI)

**Windows :**
```powershell
# Créer l'environnement virtuel Python
python -m venv myenv
# Activer l'environnement virtuel
myenv\Scripts\activate
# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2. Configuration du Frontend (React)

**Tous les systèmes :**
```bash
# Naviguer vers le dossier frontend
cd frontend
# Installer les dépendances Node.js
npm install
# Retourner à la racine du projet
cd ..
```

## Démarrage de l'Application

### 2 terminaux requis

#### Terminal 1 - Backend (API FastAPI)

**Windows :**
```powershell
# Depuis la racine du projet
cd api
..\myenv\Scripts\activate
python main.py
```

**Linux/WSL :**
```bash
# Depuis la racine du projet
cd api
source ../myenv/bin/activate
python main.py
```

#### Terminal 2 - Frontend (React)

**Tous les systèmes :**
```
# Depuis la racine du projet
cd frontend
npm start
```

### Utilisation de Make (Linux/WSL/Git Bash) pour le demarage des services

```bash
# Démarrer le backend dans un terminal
make start-backend
# Démarrer le frontend dans un autre terminal
make start-frontend
# Ou afficher les instructions complètes
make start
```


Une fois l'application démarrée, vous pouvez accéder aux services suivants :

- **Interface Utilisateur (Frontend)** : http://localhost:3000
- **API Backend** : http://localhost:8000

## Commandes Utiles
### Avec Make (Linux/WSL/Git Bash)
```bash
make help           # Afficher toutes les commandes disponibles
make check          # Vérifier la configuration du projet
make stop           # Arrêter tous les services
make clean          # Nettoyer les fichiers cache
make clean-all      # Suppression complète (venv + node_modules)
```

### Arrêt des Services

**Windows :**
- Utilisez `Ctrl+C` dans chaque terminal pour arrêter les services
- et supprimer le dossier frontend/node_modules et myenv/ et le fichier package-lock.json

**Linux/WSL :**
```bash
# Arrêter tous les processus liés au projet
make stop
make clean-all

1. Accédez à l'interface web : http://localhost:3000
2. Téléchargez une image de feuille de pomme de terre
3. Cliquez sur "Analyser" pour obtenir le diagnostic
4. Consultez les résultats de classification et les recommandations