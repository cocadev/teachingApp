package com.yakvernac;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactlibrary.RNSketchViewPackage;
import com.reactlibrary.RNSketchViewPackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.wenkesj.voice.VoicePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativepayments.ReactNativePaymentsPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNI18nPackage(),
            new RNFetchBlobPackage(),
            new RNSketchViewPackage(),
            new RNSketchViewPackage(),
            new TextToSpeechPackage(),
            new VoicePackage(),
            new LinearGradientPackage(),
            new ReactNativePaymentsPackage(),
            new VectorIconsPackage(),
            new StripeReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
