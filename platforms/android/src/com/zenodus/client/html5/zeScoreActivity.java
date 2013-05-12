package com.zenodus.client.html5;

import android.os.Bundle;
import org.apache.cordova.*;
import com.zenodus.client.html5.R;

import org.apache.cordova.api.CordovaInterface;
import android.content.Intent;
import android.net.Uri;

import android.webkit.ValueCallback;


public class zeScoreActivity extends DroidGap
{
	
    private ValueCallback<Uri> mUploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1;


	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        //super.setStringProperty("loadingDialog", "Starting your app...");
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        
        super.loadUrl(Config.getStartUrl(), 10000);

    }
    
    
 // openFileChooser is an overridable method in WebChromeClient which isn't
    // included in the SDK's Android stub code
    public class FileAttachmentChromeClient extends CordovaChromeClient {

        public FileAttachmentChromeClient(CordovaInterface ctx, CordovaWebView app) {
            super(ctx, app);

        }

        // For Android > 3.x
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
            mUploadMessage = uploadMsg;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("*/*");

            zeScoreActivity.this.startActivityForResult(Intent.createChooser(i, "Choose type of attachment"), FILECHOOSER_RESULTCODE);

        }

        // For Android < 3.x
        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            mUploadMessage = uploadMsg;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("*/*");
            zeScoreActivity.this.startActivityForResult(Intent.createChooser(i, "Choose type of attachment"), FILECHOOSER_RESULTCODE);
        }

    }
    
}
