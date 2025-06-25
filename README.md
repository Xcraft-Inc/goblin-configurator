# 📘 goblin-configurator

## Aperçu

Le module `goblin-configurator` est un acteur Goblin qui fournit une interface de configuration et de gestion des sessions pour les applications Xcraft. Il permet aux utilisateurs de sélectionner des profils d'application, de gérer des sessions actives, et d'accéder à des outils de développement avancés. Le configurateur sert de point d'entrée principal pour lancer et organiser différentes instances d'applications dans l'écosystème Xcraft.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Configuration avancée](#configuration-avancée)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module est organisé autour de plusieurs composants principaux :

- **Acteur principal** : `configurator` (service Goblin)
- **Acteur shell** : Service de démarrage et d'orchestration
- **Interface utilisateur** : Collection de widgets React pour l'interface de configuration
- **Outils de développement** : Intégration avec le workshop et générateurs de code

## Fonctionnement global

Le configurateur fonctionne selon un modèle de gestion de sessions multi-profils :

1. **Initialisation** : Au démarrage, le configurateur charge les profils disponibles depuis la configuration
2. **Sélection de profil** : L'utilisateur choisit un profil d'application parmi ceux disponibles
3. **Gestion des sessions** : Création, ouverture et fermeture de sessions utilisateur
4. **Outils avancés** : Accès aux fonctionnalités de développement (workshop, générateurs)

Le système supporte deux modes d'affichage :

- **Mode classique** : Interface en grille avec détails des sessions
- **Mode launcher** : Interface moderne avec des "rockets" représentant les sessions

## Exemples d'utilisation

### Création d'une session utilisateur

```javascript
// Ouverture d'une nouvelle session avec un profil spécifique
const configurator = await this.quest.create('configurator', {
  labId: 'main-lab',
  clientSessionId: 'client-123',
  username: 'john.doe',
  useLogin: false,
});

// Configuration d'un bureau avec un profil
await configurator.openSession({
  profileKey: 'production-profile',
  feed: null,
});
```

### Gestion des sessions actives

```javascript
// Fermeture d'une session spécifique
await configurator.closeSession({
  name: 'desktop@mandate@user-session-uuid',
});

// Mise à jour des feeds disponibles
await configurator.updateFeeds({
  feeds: ['desktop@mandate1@session1', 'desktop@mandate2@session2'],
});
```

## Interactions avec d'autres modules

Le configurateur interagit avec plusieurs modules de l'écosystème Xcraft :

- **[xcraft-core-etc]** : Chargement de la configuration des profils
- **[goblin-client]** : Gestion des sessions client et authentification
- **[goblin-warehouse]** : Gestion des feeds et stockage des données
- **[goblin-desktop]** : Création et fermeture des bureaux
- **[goblin-workshop]** : Outils de développement et génération de code

## Configuration avancée

| Option       | Description                   | Type   | Valeur par défaut |
| ------------ | ----------------------------- | ------ | ----------------- |
| `mainWidget` | Widget principal à monter     | string | `'configurator'`  |
| `profiles`   | Liste des profils disponibles | array  | `[]`              |
| `buildInfo`  | Information de build affichée | string | `''`              |

### Variables d'environnement

Aucune variable d'environnement spécifique n'est utilisée par ce module.

## Détails des sources

### `configurator.js`

Point d'entrée principal qui expose les commandes Xcraft du service configurator via le système de découverte automatique.

### `shell.js`

Service de démarrage qui orchestre l'initialisation des différents composants :

#### État et modèle de données

L'acteur shell maintient un état minimal pour la coordination des services.

#### Méthodes publiques

- **`boot()`** — Initialise le client et démarre tous les profils configurés, incluant l'intégration optionnelle avec cresus-launcher.
- **`configureDesktop(clientSessionId, labId, desktopId, session, username, locale, configuration)`** — Configure un bureau avec les paramètres utilisateur spécifiés.
- **`afterConfigureDesktop(labId, desktopId)`** — Exécute les actions post-configuration du bureau.

### `widgets/configurator/service.js`

Service principal de l'acteur configurator qui gère l'état global et les interactions utilisateur.

#### État et modèle de données

L'état du configurateur comprend :

```javascript
const logicState = {
  form: {}, // Données du formulaire utilisateur
  available: {}, // Profils disponibles
  profiles: {}, // Configuration des profils
  advanced: false, // Mode avancé activé
  selectedEntity: null, // Entité sélectionnée pour génération
  ripley: {
    // Système de replay d'actions
    profileKey: null,
    db: {},
    selected: {from: null, to: null},
  },
  relaunch: {
    // Gestion du redémarrage
    reason: null,
    desktops: [],
  },
};
```

#### Méthodes publiques

- **`create(labId, clientSessionId, username, appArgs, useLogin, next)`** — Initialise le configurateur avec les paramètres de session et charge les profils disponibles.
- **`openSession(profileKey, feed)`** — Ouvre une nouvelle session utilisateur avec le profil spécifié ou reconnecte à une session existante.
- **`closeSession(name)`** — Ferme une session utilisateur existante via le desktop-manager.
- **`toggleAdvanced()`** — Bascule entre le mode normal et avancé pour afficher les profils de développement.
- **`change(path, newValue)`** — Met à jour une valeur dans l'état du configurateur.
- **`select(type, selectedId)`** — Sélectionne un élément dans l'interface (pour Ripley).
- **`createNewEntity()`** — Génère une nouvelle entité via le workshop.
- **`generateWorkitemsTemplates()`** — Génère des templates de workitems pour une entité sélectionnée.
- **`clearWorkitemsTemplates()`** — Efface la sélection d'entité pour les templates.
- **`replayActionStore()`** — Rejoue des actions depuis un store sauvegardé via le système Ripley.
- **`logout()`** — Déconnecte l'utilisateur et redémarre l'interface.
- **`getRelaunchDesktops()`** — Récupère la liste des bureaux à relancer après un redémarrage.
- **`resetRelaunchDesktops()`** — Remet à zéro la liste des bureaux à relancer.
- **`updateCurrentUser(username)`** — Met à jour le nom d'utilisateur actuel.
- **`updateFeeds(feeds)`** — Met à jour la liste des feeds disponibles suite aux changements du warehouse.

### `widgets/configurator/widget.js`

Interface utilisateur principale du configurateur avec gestion des sessions et profils. Le composant gère l'affichage en mode classique ou launcher et intègre plusieurs popups pour les fonctionnalités avancées. Il utilise MouseTrap pour la gestion des raccourcis clavier (Ctrl+K pour le mode avancé).

### `widgets/configurator/styles.js`

Styles CSS pour l'interface du configurateur avec support des modes classique et launcher.

### `widgets/app-icon/widget.js`

Composant représentant une application ou session avec support des détails configurables et actions de fermeture. Affiche les informations de configuration en mode détaillé pour les sessions.

### `widgets/app-icon/styles.js`

Styles pour les icônes d'applications avec effets visuels, états actifs et animations de survol.

### `widgets/configurator-navigator/widget.js`

Navigateur principal gérant l'affichage des sessions sous forme de grille ou de launcher moderne avec des "rockets". Supporte le redimensionnement dynamique et la gestion des passagers. Le composant utilise un debounce pour optimiser les performances lors du redimensionnement de la fenêtre.

### `widgets/configurator-navigator/styles.js`

Styles pour le navigateur avec support des deux modes d'affichage et animations.

### `widgets/configurator-popup/widget.js`

Composant popup générique pour les dialogues de configuration avec animations, gestion des touches (Escape) et fermeture par clic extérieur.

### `widgets/configurator-popup/styles.js`

Styles pour les popups avec animations d'entrée/sortie et positionnement centré.

### `widgets/configurator-confirm-popup/widget.js`

Popup de confirmation pour les actions destructives comme la réinitialisation de mandats.

### `widgets/configurator-build-popup/widget.js`

Interface pour les outils de génération de code, permettant de créer des entités ou des templates de workitems.

### `widgets/configurator-build-entity-popup/widget.js`

Formulaire de création d'entités avec champs configurables pour les propriétés.

### `widgets/configurator-build-workitem-popup/widget.js`

Interface de sélection d'entités pour la génération de templates de workitems.

### `widgets/configurator-action-store-popup/widget.js`

Interface du système Ripley pour le replay d'actions et le voyage dans le temps entre états de base de données.

### `widgets/main-layout/widget.js`

Layout principal de l'application avec header, footer et zone de contenu. Inclut les boutons d'outils de développement et la gestion de l'authentification. Le composant détecte automatiquement le mode développeur basé sur la présence de "ctrl+k" dans le buildInfo.

### `widgets/clock/widget.js`

Horloge temps réel affichée dans le footer de l'application avec mise à jour automatique toutes les secondes.

### `widgets/ripley/widget.js`

Interface de gestion du système de replay d'actions permettant de sélectionner des bases de données source et destination pour le voyage temporel. Utilise un système d'arbre pour afficher les branches de base de données avec timestamps formatés.

### `widgets/ripley/styles.js`

Styles pour l'interface Ripley avec dégradé visuel et layout en colonnes.

### Fichiers spéciaux (workers, backends, etc.)

Le module utilise le système de découverte automatique de commandes Xcraft via les exports `xcraftCommands` dans les fichiers racine, permettant au framework de charger dynamiquement les services au démarrage. Le système supporte également l'intégration avec des modules externes comme `goblin-cresus` (non public) et `goblin-workshop` pour étendre les fonctionnalités.

Le configurateur intègre également un système de gestion des branches de base de données via le module `cryo`, permettant le voyage temporel entre différents états de données.

---

_Documentation mise à jour_

[xcraft-core-etc]: https://github.com/Xcraft-Inc/xcraft-core-etc
[goblin-client]: https://github.com/Xcraft-Inc/goblin-client
[goblin-warehouse]: https://github.com/Xcraft-Inc/goblin-warehouse
[goblin-desktop]: https://github.com/Xcraft-Inc/goblin-desktop
[goblin-workshop]: https://github.com/Xcraft-Inc/goblin-workshop