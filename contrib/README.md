# MemoProut Pad - contributions

Vous avez une super idée pour un nouveau mode de jeu  à mettre sur votre MemoProut Pad ? Ce guide vous donne la marche à suivre.



##  Créer de nouveaux sons

Les sons du MemoProut Pad sont encodés en PCM (8bits), et enregistrés dans des fichiers _.wav_.

La méthode la plus simple est d'utiliser [Audacity](https://www.audacityteam.org/) qui est gratuit, open-source et multi-plateforme.

Il y plusieurs étapes à effectuer avec Audacity afin d'encoder chaque dans un format valide pour votre MemoProut Pad.

1. Ouvrez votre fichier sonore avec Audacity.

2. Sélectionnez tout (dans le menu, cliquez sur _Sélectionner/Tout_)

3. Si le son est en stéréo, le passer en mono (dans le menu, cliquez sur _Pistes/Mix/Mix stéréo vers mono_)

4. Normaliser le volume (dans le menu, cliquez sur _Effets/Normaliser..._) avec les paramètres par défaut (-1.0 dB d'amplitude de crête)

5. Changer la fréquence pour 11025 Hz (sélectionnez 11025 dans la liste déroulante _"Taux du projet"_ en bas à gauche)

6. Mixer le rendu (dans le menu, cliquez sur _Pistes/Mix/Mixage et rendu_)

7. Exporter le son au bon format (dans le menu, cliquez sur _Fichier/Exporter/Exporter l'audio..._) puis sélectionnez ces options :

   + **Type de filtre** : _Autres formats non-compressés_
   + **Entête** : _WAV (Microsoft)_
   + **Encodage** : _Unsigned 8-bits PCM_

   

## Créer un nouveau mode de jeu

Il existe 2 styles de jeux différents : _basic_ où les sons joués forment des phrases, et _simple_ où les sons joués s'enchainent sans ordre particulier.

#### Style _basic_

Pour créér un mode de jeu basé sur des phrases, il faut préparer un dossier avec un nom court (6 lettres max.) en majuscules, contenant :

+ 8 sons de _sujets_ (ex. "Donald Trump", "La mouche qui pète", ...) nommés SUBJECT1.wav, SUBJECT2.wav, ... etc jusque SUBJECT8.wav (les majuscules sont importantes).
+ 8 sons d'actions (ex. "se prend pour", "a mangé", ...) nommés VERB1.wav, VERB2.wav, ...etc.
+ 8 sons de _complément_ (ex. "une banane", "une crotte de chien", ...) nommés COMP1.wav, COMP2.wav, ...etc.
+ 4 sons de liaison (ex. "et après", "ensuite", ...) nommés INTER1.wav, INTER2.wav, ...etc.
+ 1 son pour le nom du mode de jeu nommé GAME.wav
+ 1 son pour le _game-over_ nommé LOOSE.wav

#### Style _simple_

Pour créér un mode de jeu basé sur des sons simples, il faut préparer un dossier avec un nom court (6 lettres max.) en majuscules, contenant :

+ 28 sons nommés M1.wav, M2.wav, ...etc. jusque M28.wav (les majuscules sont importantes).

+ 1 son pour le nom du mode de jeu nommé GAME.wav
+ 1 son pour le _game-over_ nommé LOOSE.wav



## Ajouter un mode de jeu sur mon MemoProut Pad

Afin que votre nouveau mode de jeu puisse fonctionner sur votre MemoProut Pad, il faut :

+ copier le dossier précedemment créé sur la racine de la carte SD.

+ dans le dossier _GAMES_ de la carte SD, dupliquer le fichier BASIC.PRT (pour le style _basic_) ou MUSIC.PRT (pour le style _simple_), et le renommer comme le dossier précédemment créé.

+ à l'aide d'un éditeur de texte, ouvrir le fichier GAMES.PRT se trouvant à la racine de la carte SD et ajouter une ligne contenant le nom de dossier, un espace et un 1 (pour le style _basic) ou un 2 (pour le style _simple_).

  >  Par exemple, pour un style de jeu _basic_ et un dossier nommé MACHIN_, ajouter cette ligne :

  ```
  MACHIN 1
  ```

  >  Pour un style de jeu _simple_ et un dossier nommé MACHIN_, ajouter cette ligne :

  ```
  MACHIN 2
  ```

  ⚠️ **Ce fichier doit finir par une (et une seule) ligne vide !**

Et voilà ! Vous pouvez maintenant profiter de votre nouveau mode de jeu personnalisé.



## Comment partager mon mode jeu ?

Pour partager un nouveau mode de jeu, vous pouvez ouvrir une pull-request sur le GitHub du projet en plaçant votre mode de jeu dans le dossier _"contrib"_ de la branche _master_.

Si vous ne savez pas comment faire, le plus simple est encore de m'envoyer un mail sur memoproutpad@gmail.com, et je m'occuperai du reste.