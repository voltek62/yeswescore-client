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
import android.text.Html;
import android.util.Log;
 
public class Social extends CordovaPlugin {
 
 private void doSendIntent(String subject, String text, String url) {

  Intent sendIntent = new Intent(android.content.Intent.ACTION_SEND);
  sendIntent.setType("text/plain");
  sendIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject);
  sendIntent.putExtra(android.content.Intent.EXTRA_TEXT, text + " " + url);

  this.cordova.startActivityForResult(this, sendIntent, 0);
  
 }
 
 @Override
 public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
  try {
   JSONObject jo = args.getJSONObject(0);
   doSendIntent(jo.getString("subject"), jo.getString("text"), jo.getString("url"));
   callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
   return true;
  } catch (JSONException e) {
   Log.e("PhoneGapLog", "Social Plugin: Error: " + PluginResult.Status.JSON_EXCEPTION);
   e.printStackTrace();
   callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
   return false;
  }
 }
}