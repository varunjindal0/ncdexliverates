// ToastModule.java

package com.ncdexliverates;

import android.widget.Toast;



import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

import android.content.res.AssetManager;
import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

// import javax.naming.Context;
import android.content.Context;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import com.facebook.react.bridge.Callback;

public class MissingCaModule extends ReactContextBaseJavaModule {

//   private static final String DURATION_SHORT_KEY = "SHORT";
//   private static final String DURATION_LONG_KEY = "LONG";

  public MissingCaModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "MissingCaFetch";
  }

//   @Override
//   public Map<String, Object> getConstants() {
//     final Map<String, Object> constants = new HashMap<>();
//     constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
//     constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
//     return constants;
//   }

@ReactMethod
  public void fetch(Callback successCallback) {
    // Toast.makeText(getReactApplicationContext(), message, duration).show();
    new MyAsyncTask(getReactApplicationContext(), successCallback).execute();
  }

  class MyAsyncTask extends AsyncTask<Void, Void, String> {

    Context mApplicationContext;
   //     MyAsyncTask(Context context) {
   //         mApplicationContext = context;
   //     }

   Callback mSuccessCallback;
   MyAsyncTask(Context context, Callback successCallback) {
       mApplicationContext = context;
       mSuccessCallback = successCallback;
       
   }
   HttpsURLConnection urlConnection;
   StringBuilder builder = new StringBuilder();
   @Override
   protected String doInBackground(Void... voids) {
       try {
           //URL url = new URL("http://www.android.com/");
           CertificateFactory cf = CertificateFactory.getInstance("X.509");
// From https://www.washington.edu/itconnect/security/ca/load-der.crt
           String currdir = System.getProperty("user.dir");
           Log.d("Yog curr dir", currdir);
        //   Context ctx = new InitialContext();
           AssetManager manager = mApplicationContext.getApplicationContext().getAssets();
          InputStream caInput = manager.open("mycerti.crt");
       //    InputStream caInput = manager.open("../../../../../../../assets/mycerti.crt");
           //InputStream caInput = new BufferedInputStream(new FileInputStream("mycerti.crt"));
           Certificate ca;
           try {
               ca = cf.generateCertificate(caInput);
               System.out.println("ca=" + ((X509Certificate) ca).getSubjectDN());
           } finally {
               caInput.close();
           }

// Create a KeyStore containing our trusted CAs
           String keyStoreType = KeyStore.getDefaultType();
           KeyStore keyStore = KeyStore.getInstance(keyStoreType);
           keyStore.load(null, null);
           keyStore.setCertificateEntry("ca", ca);

// Create a TrustManager that trusts the CAs in our KeyStore
           String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
           TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
           tmf.init(keyStore);

// Create an SSLContext that uses our TrustManager
           SSLContext context = SSLContext.getInstance("TLS");
           context.init(null, tmf.getTrustManagers(), null);


           URL url = new URL("https://www.ncdex.com/MarketData/LiveFuturesQuotes.aspx");

        //   URL url = new URL("https://www.google.com");
           urlConnection = (HttpsURLConnection) url.openConnection();
           urlConnection.setSSLSocketFactory(context.getSocketFactory());
           InputStream in = new BufferedInputStream(urlConnection.getInputStream());
           BufferedReader br = new BufferedReader(new InputStreamReader(in));
           String line;
           while ((line = br.readLine()) != null) {
               Log.d("buffer: ", line);
               builder.append(line);
               builder.append("\n");


           }
           Log.d("bufferLength:", builder.length()+"");
       }
       catch (CertificateException | KeyStoreException | NoSuchAlgorithmException | KeyManagementException e) {
           Log.d("YogeshException Certi: ", e.getMessage());
       }
       catch (IOException e) {
           Log.d("YogeshException: ", e.getMessage());// URl error ...
       }
       finally {
           if (urlConnection != null)
               urlConnection.disconnect();
       }

       return builder.toString();
   }

   @Override
   protected void onPostExecute(String result) {
       super.onPostExecute(result);
       Log.d("resultLength", result.length()+"");
       Log.d("YogeshTU Result", result);
       mSuccessCallback.invoke(result);
   }
}

}
