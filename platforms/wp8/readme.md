# Nouvelle version de cordova :
installer le templatephonegap-2.6.0\phonegap-2.6.0\lib\windows-phone-8*.zip dans C:\Users\marc\Documents\Visual Studio 2012\Templates\ProjectTemplates\

# supprimer l’ancien projet :
C:\Users\marc\Documents\Visual Studio 2012\Projects\yeswescore-client\platforms\wp8\vs

# sous visual studio, créer un nouveau projet a partir du template
# l’appeler yeswescore

# supprimer le repertoire www 
C:\Users\marc\Documents\Visual Studio 2012\Projects\yeswescore-client\platforms\wp8\yeswescore

# renommer yeswescore en “vs”

# creation lien symbolique
# dans un shell en root :

$> cd “C:\Users\marc\Documents\Visual Studio 2012\Projects\yeswescore-wp8\yeswescore-wp
8”
$> C:\Users\marc\Documents\Visual Studio 2012\Projects\yeswescore-wp8\yeswescore-wp
8>mklink /d www "C:\Users\marc\Documents\Visual Studio 2012\Projects\yeswescore-
client\platforms\wp8\build"

# copier le bon cordova
C:\Users\marc\Documents\Phonegap\phonegap-2.6.0\phonegap-2.6.0\lib\windows-phone-8\templates\full\www\cordova-x.x.x.js dans C:\Users\marc\Documents\Visual Studio 2012\Projects\yeswescore-client\platforms\wp8\cordova