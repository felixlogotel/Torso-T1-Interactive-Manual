# Spécification i18n - Torso T-1 Interactive Manual

## 1. Objectif

Mettre en place une base multilingue robuste (FR/EN) pour traduire l'application progressivement, module par module, sans casser les interactions existantes (recherche, navigation par contrôles, overlays, liens internes).

## 2. État actuel (base posée)

Les fondations suivantes sont déjà en place :

- Initialisation i18n centralisée via `i18next` + `react-i18next`.
- Langues supportées: `fr`, `en`.
- Langue par défaut: `fr`.
- Persistance de langue en localStorage: `torso-t1-manual.language`.
- Sélecteur de langue ajouté dans le header, placé à droite du bouton de recherche.
- Première tranche UI connectée à i18n:
  - shell de l'app (tabs, sous-titre de marque, bouton recherche),
  - overlay de recherche (placeholder, empty state, suggestions),
  - labels génériques du panneau détail.
- Migration modulaire déjà effectuée:
  - `quickref` migré en données neutres + traductions FR/EN,
  - `structure` migré en namespace i18n FR/EN,
  - `changelog` migré en namespace i18n (UI + contenu FR/EN),
  - adaptateur de catalogue contrôles branché avec fallback (`src/i18n/localizeControls.js`),
  - catalogue `controls` EN complété (descriptions, shortcuts, notes, details),
  - `ExplanationPanel`: mode FR complet conservé, mode EN simplifié 100% localisé.

## 3. Principes de traduction

### 3.1 Terminologie technique non traduite

Ces termes restent stables dans toutes les langues:

- noms de contrôles hardware: `STEPS`, `PULSES`, `CYCLES`, `TEMPO`, `VBx`, etc.
- combinaisons d'actions: `CTRL + Turn + ...`, `Hold ...`, `Double-press ...`.
- noms de sections machine: `SHAPE`, `GROOVE`, `TONAL`, `SETUP`.

Raison: cohérence avec le device physique et compatibilité avec la détection de contrôles inline.

### 3.2 Séparation stricte "structure vs contenu"

- Structure UI (labels, titres, boutons, états): dans `src/i18n/locales/*`.
- Contenu métier volumineux (descriptions, workflows, changelog): migré progressivement dans des ressources i18n dédiées, pas en dur dans les composants.

### 3.3 Clés stables et extensibles

Convention de clés:

- `app.*` pour shell global.
- `searchOverlay.*`, `detailPanel.*` pour composants transverses.
- futurs namespaces par module:
  - `controls.*` (KNOBS/BUTTONS),
  - `quickref.*`,
  - `structure.*`,
  - `changelog.*`,
  - `explanation.*`.

## 4. Cartographie priorisée (ordre recommandé)

Volumes approximatifs détectés (littéraux, ordre de grandeur) :

- `src/components/ExplanationPanel.jsx`: ~1351 (plus gros bloc, mix FR/EN).
- `src/data/params.js`: ~413 (coeur fonctionnel des contrôles).
- `src/data/changelog.js`: ~113.
- `src/data/quickref.js`: ~107.
- `src/components/StructureGuide.jsx`: ~95.

Ordre de migration:

1. `quickref` + `structure` + `changelog` (faible risque fonctionnel).
2. `params` (impact recherche + panneaux détail + hotspots).
3. `ExplanationPanel` (plus gros chantier; à découper en sous-modules).

## 5. Architecture cible pour contenu métier

### 5.1 Modèle canonique

Conserver les IDs techniques actuels (`id`, `section`, `color`, etc.) comme source canonique.

Externaliser uniquement les textes localisables:

- `label`/`secondary` (si un jour nécessaires),
- `description`,
- `shortcuts[].action`,
- `details[]`,
- `notes`.

### 5.2 Schéma recommandé

Exemple de clé par contrôle:

- `controls.STEPS.description`
- `controls.STEPS.shortcuts.turn.action`
- `controls.STEPS.notes`

On garde dans `params.js`:

- ID, section, layout, couleurs, méta non textuelle.
- références de clés i18n (ou conventions déterministes par ID).

### 5.3 Adaptateur de données

Créer un adaptateur unique (ex: `src/i18n/localizeControls.js`) qui:

- lit le catalogue canonique des contrôles,
- injecte les textes traduits via `t(...)`,
- applique fallback FR si clé manquante,
- renvoie la structure finale attendue par les composants existants.

But: éviter de toucher tous les composants lors de la migration.

## 6. Recherche multilingue (point critique)

La recherche doit indexer:

- textes de la langue active,
- aliases techniques invariants (noms contrôles hardware),
- éventuellement alias secondaires (FR + EN) pour tolérance cross-langue.

Recommandation:

- rendre l'index dépendant de la langue active (rebuild memoized),
- ajouter un champ `searchTokens` explicite dans les ressources i18n pour les synonymes.

## 7. Plan d'exécution incrémental

### 7.1 Phase A (faite)

- base i18n et sélecteur de langue.
- tranche UI transversale traduite.

### 7.2 Phase B (faite)

- migrer `quickref`, `structure`, `changelog` vers namespaces dédiés.
- valider responsive + navigation + lisibilité.

### 7.3 Phase C (faite)

- migration `params` via adaptateur.
- recherche sensible à la langue active.
- tests de couverture i18n sur les catalogues.

### 7.4 Phase D

- découper `ExplanationPanel` en blocs i18n indépendants.
- traduire module par module (SHAPE, GROOVE, TONAL, SETUP) pour retrouver la richesse visuelle FR en EN.
- finaliser glossaire technique et revue terminologique.

## 8. Critères de qualité / non-régression

- aucun ID de contrôle modifié.
- `InlineControlText` continue de détecter les contrôles dans toutes les langues.
- raccourcis affichés sans ambiguïté entre termes traduits et termes hardware.
- recherche fonctionnelle et pertinente en FR puis EN.
- comportement mobile/desktop inchangé hors ajout du sélecteur.

## 9. Ajout futur d'une nouvelle langue

Checklist:

1. Ajouter `src/i18n/locales/<lang>/...`.
2. Enregistrer la langue dans `src/i18n/config.js`.
3. Ajouter l'option dans le sélecteur.
4. Fournir les clés de base (`app`, `searchOverlay`, `detailPanel`).
5. Compléter les namespaces métier module par module.
