package com.zenodus.client.html5;

import android.os.Bundle;
import org.apache.cordova.*;
import com.zenodus.client.html5.R;
import com.urbanairship.AirshipConfigOptions;
import com.urbanairship.UAirship;
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
        AirshipConfigOptions options = AirshipConfigOptions.loadDefaultOptions(this);
        options.developmentAppKey = "Ua5gAbxKRxqh2YYJufhA3A";
        options.productionAppKey = "Ua5gAbxKRxqh2YYJufhA3A";
        options.inProduction = false; //determines which app key to use
        
        UAirship.takeOff(this.getApplication(), options);
        PushManager.enablePush();        
    }
    
    
    @Override
    public void onStart() {
        super.onStart();
        UAirship.shared().getAnalytics().activityStarted(this);
    }
    
    @Override
    public void onStop() {
        super.onStop();
        UAirship.shared().getAnalytics().activityStopped(this);
    }    
    
      
}
