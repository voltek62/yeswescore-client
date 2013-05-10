
On copie les nouvelles libs
/libs/ios/CordovaLib

A tester

When you update to a new Cordova version, you may need to update the CordovaLib reference in an existing project. Cordova comes with a script that will help you to do this. 

1. Launch **Terminal.app**
2. Go to the location where you installed Cordova, in the **bin** sub-folder
3. Run **"update_cordova_subproject [path/to/your/project/xcodeproj]"**  where the first parameter is the path to your project's .xcodeproj file
