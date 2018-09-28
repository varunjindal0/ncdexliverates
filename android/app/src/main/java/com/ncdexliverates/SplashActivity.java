package com.ncdexliverates;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

//import static android.R.attr.start;

/**
 * Created by varunjindal on 28/09/18.
 */

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent( this, MainActivity.class);
        startActivity(intent);
        finish();

    }
}
