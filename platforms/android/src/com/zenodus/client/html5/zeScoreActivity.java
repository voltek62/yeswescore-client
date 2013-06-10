package com.zenodus.client.html5;

import android.os.Bundle;
import org.apache.cordova.*;
import com.zenodus.client.html5.R;


public class zeScoreActivity extends DroidGap
{
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        //super.setStringProperty("loadingDialog", "Starting your app...");
        System.out.println("java forever");
        
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        
        super.loadUrl(Config.getStartUrl(), 4000);
        
    }
    
    
   
}
