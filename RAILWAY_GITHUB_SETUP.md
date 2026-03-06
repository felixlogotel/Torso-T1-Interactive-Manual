# Connexion GitHub → Railway (déploiement automatique)

Pour que chaque push sur GitHub déclenche automatiquement un déploiement sur Railway :

## Étapes

1. **Ouvre le projet Railway**  
   https://railway.com/project/26a41749-0350-4779-aa1c-a1b2a3184ae6

2. **Clique sur le service** `torso-t1-manual`

3. **Va dans l’onglet Settings** (⚙️)

4. **Section "Source"** → clique sur **Connect Repo**

5. **Choisis le dépôt** `felixlogotel/Torso-T1-Interactive-Manual`

6. **Branche** : laisse `main` (ou celle que tu utilises)

7. Si demandé, **autorise l’app Railway** sur ton compte GitHub (ou sur l’organisation qui héberge le repo)

Une fois connecté, chaque push sur la branche configurée déclenchera un nouveau déploiement.
