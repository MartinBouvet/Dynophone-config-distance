# Dynovate Config

Micro-service minimal pour stocker la config Dynophone. Permet à Dynovate Unified (local) d’envoyer la config et à Dynophone (Railway) de la récupérer.

## Déploiement sur Vercel

### 1. Créer le projet sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi
2. **Add New** → **Project**
3. Importe le dossier `dynovate-config` (ou ce repo)
4. **Root Directory** : `dynovate-config` (si c’est un sous-dossier)
5. **Deploy**

### 2. Activer Vercel KV (stockage)

1. Dans le projet Vercel → **Storage** → **Create Database**
2. Choisis **KV**
3. Nomme-le (ex. `dynovate-config-kv`)
4. Crée et **Connect** au projet
5. Vercel ajoute automatiquement les variables d’environnement

### 3. Générer et configurer la clé API

1. Génère une clé secrète (ex. `openssl rand -hex 32` ou un générateur en ligne)
2. Dans Vercel → **Settings** → **Environment Variables**
3. Ajoute :
   - **Name** : `DYNOVATE_CONFIG_API_KEY`
   - **Value** : ta clé (ex. `a1b2c3d4e5f6...`)

### 4. Redéploie

Un nouveau déploiement sera lancé automatiquement après l’ajout de KV et des variables. Sinon, **Redeploy** manuellement.

### 5. URL finale

Exemple : `https://dynovate-config-xxx.vercel.app/api/config`

---

## Variables à configurer

| Variable | Obligatoire | Rôle |
|----------|-------------|------|
| `DYNOVATE_CONFIG_API_KEY` | Recommandé | Clé partagée pour sécuriser GET/POST |
| Vercel KV | Oui | Créé via Storage → KV |

---

## API

- **GET** `/api/config`  
  Récupère la config.  
  Headers : `X-Api-Key: <ta-clé>` ou `?apiKey=<ta-clé>`

- **POST** `/api/config`  
  Enregistre la config.  
  Body JSON : `{ systemPrompt, voicePreset, greeting, transcriptionEnabled }`  
  Headers : `X-Api-Key: <ta-clé>`
