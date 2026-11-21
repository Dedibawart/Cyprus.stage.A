# Le guide du projet — le bor là, version Wikipédia 🔥

## C’est quoi le deal ?

Tu balances un sujet dans la recherche, l’application va demander à Wikipédia ce qu’elle a sous le capot et te ramène jusqu’à cinq fiches. Tu repères celle qui t’intéresse, tu cliques sur **Lire plus**, et c’est parti.

## Qui fait quoi dans le bor là ?

- `src/main.tsx` — Le démarreur : il met l’application en route.
- `src/App.tsx` — Le chef d’orchestre : il branche le bandeau et la page de recherche.
- `src/composants/Header.tsx` — Le bandeau du haut : il garde le titre sous les yeux.
- `src/composants/Home.tsx` — Le moteur du truc : il prend ta recherche, appelle Wikipédia et affiche les fiches.
- `src/styles/global.css` — La base du look sombre.
- `src/styles/header.css` — Le style du bandeau fixé en haut.
- `src/styles/home.css` — La disposition du champ, du bouton et des fiches, sur PC comme sur mobile.

## Le trajet du mot, étape par étape

1. Tu écris ton sujet dans le champ.
2. Tu cliques sur **Chercher** ou tu appuies sur **Entrée**.
3. `Home.tsx` demande à Wikipédia jusqu’à cinq pages qui collent à ta recherche.
4. L’application récupère les résumés en parallèle et prépare une fiche par page : titre, description, image si dispo, extrait et lien.
5. Tu vois les résultats. S’il n’y en a pas, ou si Wikipédia ne répond pas, l’application te prévient.

Petit détail technique, sans prise de tête : l’application utilise les API de Wikipédia. Elle ne va pas aspirer le code HTML de ses pages.

## Pour lancer le bor là

Ouvre un terminal dans le dossier du projet et envoie :

```bash
npm install
npm run dev
```

Le terminal te donne une adresse locale. Tu l’ouvres dans ton navigateur, tu balances un sujet, et le bor là part au travail.

## Tu veux changer un truc ?

- Le titre du bandeau ? Direction `src/composants/Header.tsx`.
- Le nombre de résultats ? Dans `src/composants/Home.tsx`, change `srlimit: '5'`.
- Les couleurs ou la disposition ? Direction le dossier `src/styles/`.
- Le contenu des fiches ? Repère `infos?.map()` dans `src/composants/Home.tsx` : c’est lui qui répète la fiche pour chaque résultat.

## Les commandes qui sauvent

```bash
npm run dev    # lance le bor là en mode travail
npm run build  # vérifie le projet et prépare la version de production
npm run lint   # repère les soucis de style dans le code
```
