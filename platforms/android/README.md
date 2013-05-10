Android Install / Update
=================

Install Android :
http://docs.phonegap.com/en/2.7.0/guide_getting-started_android_index.md.html#Getting%20Started%20with%20Android

Mise à Jour Android avec Eclipse 

On récupére le jar ( lib/android/cordova-2.7.0.jar ) que l'on met à jour dans repertoire 
yeswescore-client\platforms\android\libs
Ensuite Propriété -> Java Build -> Add External Jar

Il ne faut pas oublier de mettre à jour le js associé ( lib/android/cordova-2.7.0.js )
yeswescore-client\platforms\android\cordova

Dans grunt, on modifie la version
[ "android", "2.7.0" ]

