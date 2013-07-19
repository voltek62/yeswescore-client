package com.zenodus.client.html5;

import android.os.Bundle;
import org.apache.cordova.*;
import com.zenodus.client.html5.R;
import com.urbanairship.AirshipConfigOptions;
import com.urbanairship.UAirship;
import com.urbanairship.phonegap.plugins.PushNotificationPluginIntentReceiver;
import com.urbanairship.push.PushManager;

public class zeScoreActivity extends DroidGap
{
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);        
        super.loadUrl(Config.getStartUrl(), 2000);

        //Notification
        UAirship.takeOff(this.getApplication());
        if (UAirship.shared().getAirshipConfigOptions().pushServiceEnabled) {
            PushManager.enablePush();
            PushManager.shared().setIntentReceiver(PushNotificationPluginIntentReceiver.class);
        }        
        
        //String apid = PushManager.shared().getAPID();
        //System.out.println("My Application onCreate - App APID: " + apid);
    }
    
    @Override
    public void onStart() {
        super.onStart();
        //UAirship.shared().getAnalytics().activityStarted(this);
    }
    @Override    
    public void onStop() {
      super.onStop();
      //UAirship.shared().getAnalytics().activityStopped(this);
      UAirship.land();
    }
      
}
