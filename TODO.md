# OverBrand — reste à faire

Suivi des points ouverts. Dernière mise à jour : 2026-07-18.

---

## 1. Hors code — à faire par OverBrand

Ce sont les plus gros leviers, et aucun ne se règle en modifiant le site.

- [ ] **Créer la fiche Google Business Profile.** C'est le point bloquant du référencement local : sans fiche, le balisage `LocalBusiness` déjà en place ne peut pas produire de résultat dans le pack local ni sur Maps. Une fiche par bureau (Douala, Yaoundé).
- [ ] **Corriger la page Facebook** (`web.facebook.com/OverBrandCm`) : elle indique **Dschang** comme localisation et **overbrand.io** comme domaine. Les deux contredisent le site (Douala/Yaoundé, overbrand.net). Une incohérence NAP — nom, adresse, téléphone — entre le site, Google et Facebook est ce qui pénalise le plus le référencement local.
- [ ] **Rediriger overbrand.io et overbrand.co en 301 vers overbrand.net**, au niveau du registrar ou de l'hébergeur.
- [ ] **Ajouter le code de vérification Google Search Console** dans `src/app/[locale]/layout.tsx` → `verification.google` (actuellement en commentaire), puis soumettre `https://overbrand.net/sitemap.xml`.
- [ ] Faire de même sur Bing Webmaster Tools.
- [ ] **Décider du sort des deux numéros de téléphone supplémentaires** listés sur Facebook (+237 6 545 12 450, +41 76 543 7021). Ils ne figurent pas sur le site. Soit on les ajoute, soit on les retire de Facebook — mais ils ne doivent pas diverger.

## 2. Coordonnées et données de marque

- [ ] **Remplacer les coordonnées GPS des bureaux** dans `src/lib/seo.ts` → `ORG.offices`. Ce sont actuellement des centroïdes de quartier (Akwa, Bastos), pas les adresses exactes. Le classement dans le pack local y est sensible. À reprendre depuis la fiche Google Business une fois créée.
- [ ] Vérifier que les URLs de `ORG.sameAs` sont toutes vivantes. Un profil mort dans `sameAs` affaiblit l'association d'entité au lieu de la renforcer.

## 3. Équipe

- [ ] **Fournir les photos des cinq co-fondateurs.** `photo_url` est à `null` pour tout le monde : la page affiche les initiales en attendant. Les anciennes entrées utilisaient des portraits Unsplash d'inconnus sous de vrais noms — à ne pas réintroduire.
- [ ] **Fournir les URLs des profils sociaux.** Seules les plateformes ont été indiquées, pas les adresses. À remplir dans `src/app/[locale]/equipe/page.tsx` (repères `TODO` en commentaire) :
  - Banfack Temena Brice Kisito — LinkedIn
  - Yvan KANA — LinkedIn, Twitter/X, GitHub
  - Franck DJOYA — LinkedIn, Twitter/X
  - Yannick NOUSSI — LinkedIn, Twitter/X
- [ ] **Confirmer deux intitulés de poste** repris tels quels et qui portent un accord féminin, probablement hérité du gabarit d'origine : « Directrice Marketing » (Franck DJOYA) et « Experte en gestion d'événements et en expérience client » (Yannick NOUSSI). À valider avec les personnes concernées.
- [ ] **Confirmer l'intitulé de Banfack Temena Brice Kisito.** Sa bio indique « Vice-président de Cœurs Braves » — une fonction dans une autre organisation. Il apparaît ici comme co-fondateur d'OverBrand avec le titre « Vice-président ». Vérifier que c'est bien le titre voulu chez OverBrand.
- [ ] Si l'équipe dépasse les cinq co-fondateurs, alimenter la table Supabase `team_members` : la grille « L'équipe complète » n'apparaît que s'il existe des membres dont le tag n'est pas `Co-fondateur`.
- [ ] `TeamMember` n'a pas de colonne `github_url`. Le GitHub d'Yvan devra passer par `website_url` (icône globe) ou nécessiter une migration Supabase.

## 4. Études de cas

- [ ] **Remplacer les valeurs marquées `// À CONFIRMER`** dans `src/lib/projects-data.ts` : durées des projets, découpage des phases, crédits d'équipe. Ce sont les seules données inventées — tout le reste vient des sites en ligne ou des dépôts.
- [ ] **Fournir de vraies citations client** si on en veut. Aucune n'a été inventée : le gabarit saute le bloc quand `quote` est absent.
- [ ] Cœurs Braves pointe vers `coeursbraves.vercel.app` (provisoire). À basculer sur `coeurs-braves.com` une fois le domaine actif.
- [ ] Les captures dans `public/projets/` datent du 2026-07-18. À refaire si les sites évoluent.

## 5. Internationalisation

- [ ] **Terminer la migration des métadonnées vers next-intl.** Les pages déjà migrées (`/services`, `/projets`) tirent leurs titres des namespaces. Les autres émettent encore des titres français en dur, y compris sur `/de` et `/en`.
- [ ] Traduire les contenus en allemand avant d'ouvrir `/de` à l'indexation. Le sitemap liste déjà les URLs allemandes.
- [ ] `llms.txt` est rédigé en français et lie l'arborescence `/fr/` uniquement. À dupliquer par langue si l'audience anglophone ou germanophone devient prioritaire.

## 6. Dette technique connue

- [ ] Le rideau de chargement (`Loader`) s'affiche à chaque navigation et retarde le premier rendu de plusieurs secondes en développement. À mesurer en production.
- [ ] L'animation `.reveal` utilise `animation-timeline: view()`, non supporté par Firefox : le contenu y apparaît sans fondu. Volontaire — la version JavaScript provoquait une erreur d'hydratation sur toutes les pages.
- [ ] Le fichier `next.config.ts` autorise `hostname: '**'` pour les images distantes. Pratique pour les URLs ajoutées via l'admin, mais permissif.
