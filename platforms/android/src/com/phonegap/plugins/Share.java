package com.phonegap.plugins;
 
import java.util.List;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
 
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.util.Log;
 
public class Share extends CordovaPlugin {
 
 private void doSendIntent(String subject, String text) {
  /*
  Intent sendIntent = new Intent(android.content.Intent.ACTION_SEND);
  sendIntent.setType("text/plain");
  sendIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject);
  sendIntent.putExtra(android.content.Intent.EXTRA_TEXT, text);
  this.cordova.startActivityForResult(this, sendIntent, 0);
  */

  Intent shareIntent = new Intent(android.content.Intent.ACTION_SEND);
  shareIntent.setType("text/plain");
  shareIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject);  
  shareIntent.putExtra(android.content.Intent.EXTRA_TEXT, text);
  
  PackageManager pm = cordova.getActivity().getPackageManager();
  List<ResolveInfo> activityList = pm.queryIntentActivities(shareIntent, 0);
  for (final ResolveInfo app : activityList) {
      if ((app.activityInfo.name).contains("facebook")) {
          System.out.println("detect facebook");
          final ActivityInfo activity = app.activityInfo;
          final ComponentName name = new ComponentName(activity.applicationInfo.packageName, activity.name);
          shareIntent.addCategory(Intent.CATEGORY_LAUNCHER);
          shareIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
          shareIntent.setComponent(name);
          this.cordova.startActivityForResult(this, shareIntent, 0);
          break;
     }
     else if ("com.twitter.android.PostActivity".equals(app.activityInfo.name)) {
        final ActivityInfo activity = app.activityInfo;
        final ComponentName name = new ComponentName(activity.applicationInfo.packageName, activity.name);
        shareIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        shareIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        shareIntent.setComponent(name);
        this.cordova.startActivityForResult(this, shareIntent, 0);
        break;
    }      
  }  
  
 }
 
 @Override
 public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
  try {
   JSONObject jo = args.getJSONObject(0);
   doSendIntent(jo.getString("subject"), jo.getString("text"));
   callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
   return true;
  } catch (JSONException e) {
   Log.e("PhoneGapLog", "Share Plugin: Error: " + PluginResult.Status.JSON_EXCEPTION);
   e.printStackTrace();
   callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
   return false;
  }
 }
}