package com.zenodus.client.html5;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;

import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.arellomobile.android.push.BasePushMessageReceiver;
import com.arellomobile.android.push.PushManager;
import com.arellomobile.android.push.utils.RegisterBroadcastReceiver;

public class zeScoreActivity extends DroidGap
{
    //pushwoosh.com
	private static final String APP_ID = "E68B5-6C0FA";
	//GOOGLE
	private static final String SENDER_ID = "321581564302";


	private TextView mGeneralStatus;

	boolean broadcastPush = true;

	/**
	 * Called when the activity is first created.
	 */
	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

		//setContentView(R.layout.main);

		//NetworkUtils.useSSL = true;

		//Register receivers for push notifications
		registerReceivers();

		//Create and start push manager
		PushManager pushManager = new PushManager(this, APP_ID, SENDER_ID);
		pushManager.onStartup(this);
		
		checkMessage(getIntent());

		//The commented code below shows how to use local notifications
		//PushManager.clearLocalNotifications(this);

		//easy way
		//PushManager.scheduleLocalNotification(this, "Les cookies sont cuits", 10);

		//expert mode
		//Bundle extras = new Bundle();
		//extras.putString("b", "https://cp.pushwoosh.com/img/arello-logo.png");
		//extras.putString("u", "50");
		//PushManager.scheduleLocalNotification(this, "Your pumpkins are ready!", extras, 30);


        super.setIntegerProperty("splashscreen", R.drawable.splash);
        

        super.loadUrl(Config.getStartUrl(), 4000);
	}

	/**
	 * Called when the activity receives a new intent.
	 */
	public void onNewIntent(Intent intent)
	{
		super.onNewIntent(intent);

		//have to check if we've got new intent as a part of push notification
		checkMessage(intent);
	}

	//Registration receiver
	BroadcastReceiver mBroadcastReceiver = new RegisterBroadcastReceiver()
	{
		@Override
		public void onRegisterActionReceive(Context context, Intent intent)
		{
			checkMessage(intent);
		}
	};

	//Push message receiver
	private BroadcastReceiver mReceiver = new BasePushMessageReceiver()
	{
		@Override
		protected void onMessageReceive(Intent intent)
		{
			//JSON_DATA_KEY contains JSON payload of push notification.
			//doOnMessageReceive(intent.getExtras().getString(JSON_DATA_KEY));
			showMessage("push message is " + intent.getExtras().getString(JSON_DATA_KEY));
		}
	};

	//Registration of the receivers
	public void registerReceivers()
	{
		IntentFilter intentFilter = new IntentFilter(getPackageName() + ".action.PUSH_MESSAGE_RECEIVE");

		//if(broadcastPush)
			registerReceiver(mReceiver, intentFilter);

		registerReceiver(mBroadcastReceiver, new IntentFilter(getPackageName() + "." + PushManager.REGISTER_BROAD_CAST_ACTION));		
	}

	public void unregisterReceivers()
	{
		//Unregister receivers on pause
		try
		{
			unregisterReceiver(mReceiver);
		}
		catch (Exception e)
		{
			// pass.
		}

		try
		{
			unregisterReceiver(mBroadcastReceiver);
		}
		catch (Exception e)
		{
			//pass through
		}
	}

	@Override
	public void onResume()
	{
		super.onResume();

		//Re-register receivers on resume
		registerReceivers();
	}

	@Override
	public void onPause()
	{
		super.onPause();

		//Unregister receivers on pause
		unregisterReceivers();
	}


	/**
	 * Will check PushWoosh extras in this intent, and fire actual method
	 *
	 * @param intent activity intent
	 */
	private void checkMessage(Intent intent)
	{
	    if (null != intent)
	    {
	        if (intent.hasExtra(PushManager.PUSH_RECEIVE_EVENT))
	        {
	            showMessage("push message is " + intent.getExtras().getString(PushManager.PUSH_RECEIVE_EVENT));
	        }
	        else if (intent.hasExtra(PushManager.REGISTER_EVENT))
	        {
	            showMessage("register");
	        }
	        else if (intent.hasExtra(PushManager.UNREGISTER_EVENT))
	        {
	            showMessage("unregister");
	        }
	        else if (intent.hasExtra(PushManager.REGISTER_ERROR_EVENT))
	        {
	            showMessage("register error");
	        }
	        else if (intent.hasExtra(PushManager.UNREGISTER_ERROR_EVENT))
	        {
	            showMessage("unregister error");
	        }
	 
	        resetIntentValues();
	    }
	}

	/**
	 * Will check main Activity intent and if it contains any PushWoosh data, will clear it
	 */
	private void resetIntentValues()
	{
		Intent mainAppIntent = getIntent();

		if (mainAppIntent.hasExtra(PushManager.PUSH_RECEIVE_EVENT))
		{
			mainAppIntent.removeExtra(PushManager.PUSH_RECEIVE_EVENT);
		}
		else if (mainAppIntent.hasExtra(PushManager.REGISTER_EVENT))
		{
			mainAppIntent.removeExtra(PushManager.REGISTER_EVENT);
		}
		else if (mainAppIntent.hasExtra(PushManager.UNREGISTER_EVENT))
		{
			mainAppIntent.removeExtra(PushManager.UNREGISTER_EVENT);
		}
		else if (mainAppIntent.hasExtra(PushManager.REGISTER_ERROR_EVENT))
		{
			mainAppIntent.removeExtra(PushManager.REGISTER_ERROR_EVENT);
		}
		else if (mainAppIntent.hasExtra(PushManager.UNREGISTER_ERROR_EVENT))
		{
			mainAppIntent.removeExtra(PushManager.UNREGISTER_ERROR_EVENT);
		}

		setIntent(mainAppIntent);
	}

	private void showMessage(String message)
	{
	    //Toast.makeText(this, message, Toast.LENGTH_LONG).show();
	}
	

	@Override
	public void onDestroy()
	{
		super.onDestroy();

	}
}



