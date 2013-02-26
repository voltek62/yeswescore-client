## Installation

### JavaScript Build

The JavaScript build phase depends on node.js and npm, to get these tools for your platform you can visit the node.js website: [http://nodejs.org](http://nodejs.org/).

Run the following commands in a command-line terminal in the projects root directory (where `grunt.js` is located):
	
	//Si déjà installé
	npm uninstall -g grunt
	//Install le client
	npm install -g grunt-cli
	//Install libs
	npm install
	//Install specifique module
	npm install grunt-contrib-uglify --save-dev
	

This will compile the LESS, JavaScript, and HTML components and copy them to the www folder located in both the Android and iOS projects.

### Android Build

The Android build phase depends on either ant or Eclipse and the Android SDK. To get ant installed for you platform, visit the ant website: [http://ant.apache.org](http://ant.apache.org/). Eclipse can be installed form the Eclipse website: [http://www.eclipse.org](http://www.eclipse.org/). Follow these directions on the Android Developer site to get up and running with the Android SDK: [http://developer.android.com/sdk](http://developer.android.com/sdk/).

You will need to complete the JavaScript Build phase before you continue with the Android Build phase.

Navigate to the `android` directory under the project root and run the following commands in a command-line terminal to build using ant:

    ant debug

To build using Eclipse you will first need to import the the Android project. Open Eclipse, go to File > Import. Select 'Existing Projects into Workspace'. Click the 'Browse' button next to the 'Select root directory' textbox. Navigate to the android directory under the project root. Make sure the PhotoMapper project is checked in the 'Projects' list and click the 'Finish' button. You can now select the PhotoMapper project in the 'Package Explorer' view and click either the 'Debug' or 'Run' button to build the project and run it in an Android Emualtor.

### iOS Build

The iOS build phase depends on xCode to be installed. To get a copy of xCode you can visit Apple's Developer site here: [https://developer.apple.com/xcode](https://developer.apple.com/xcode/).

You will need to complete the JavaScript Build phase before you continue with the iOS Build phase.

Navigate to the `ios` directory under the project root and double-click the `PhotoMapper.xcodeproj` file to open the project in xCode. Click the 'Run' button to build the project and open it in the iPhone Simulator.
