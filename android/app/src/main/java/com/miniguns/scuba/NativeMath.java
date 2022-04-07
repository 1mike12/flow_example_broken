package com.miniguns.scuba;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.util.ArrayMap;
import com.facebook.react.bridge.*;

import java.io.*;
import java.util.Map;

public class NativeMath extends ReactContextBaseJavaModule {
   private final ReactApplicationContext context;

   NativeMath(ReactApplicationContext context) {
      super(context);
      this.context = context;
   }

   @ReactMethod
   public void getExampleObject(ReadableMap input, final Promise promise) {
      ReadableArray r = input.getArray("r");
      ReadableArray b = input.getArray("b");
      ReadableArray g = input.getArray("g");

      if (r == null || b == null || g == null) {
         promise.reject("rejection code", "missing r, g and or b values");
      } else if (r.size() != b.size() || r.size() != g.size()) {
         promise.reject("rejection code", "array sizes for r, g and b are not the same");
      } else {
         WritableMap outputMap = Arguments.createMap();
         WritableArray rOut = Arguments.createArray();
         WritableArray bOut = Arguments.createArray();
         WritableArray gOut = Arguments.createArray();

         for (int i = 0; i < r.size(); i++) {
            rOut.pushDouble(r.getDouble(i) * 2);
         }
         for (int i = 0; i < b.size(); i++) {
            bOut.pushDouble(b.getDouble(i) * 2);
         }
         for (int i = 0; i < g.size(); i++) {
            gOut.pushDouble((g.getDouble(i) * 2));
         }

         outputMap.putArray("r", rOut);
         outputMap.putArray("g", gOut);
         outputMap.putArray("b", bOut);
         promise.resolve(outputMap);
      }
   }

   @ReactMethod
   public void processImage(String uri, Promise promise) {
      Uri imageUri = Uri.parse(uri);
      Bitmap input = BitmapFactory.decodeFile(imageUri.getPath());
      Bitmap output = generateEqualizedBitmap(input);
      File f = this.context.getFilesDir();
      try {
         String randomFileName = "equalized_" + System.currentTimeMillis() + ".jpg"; //todo: this fucking sucks
         String outputPath = f.getAbsolutePath() + "/" + randomFileName;
         File potentialOutput = new File(outputPath);
         if (potentialOutput.exists()) {
            potentialOutput.delete();
         }
         OutputStream outputStream = new FileOutputStream(outputPath);
         output.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
         outputStream.flush();
         outputStream.close();
         promise.resolve(outputPath);
      } catch (FileNotFoundException e) {
         promise.reject(e);
      } catch (IOException e) {
         promise.reject(e);
      }
   }

   private int scaleValueWithCeiling(float scale, long base, int ceiling) {
      int value = (int) (scale * base);
      value = value > ceiling ? ceiling : value;
      return value;
   }

   public Bitmap generateEqualizedBitmap(Bitmap input) {
      Bitmap output = Bitmap.createBitmap(input.getWidth(), input.getHeight(), input.getConfig());
      Map<String, int[]> channels = getHistograms(input);
      final int MASS = input.getWidth() * input.getWidth();
      long sumRed = 0;
      long sumGreen = 0;
      long sumBlue = 0;
      final float SCALE = 255f / MASS;

      int[] redChannel = channels.get("r");
      int[] blueChannel = channels.get("b");
      int[] greenChannel = channels.get("g");

      // overwrite the histogram arrays with it's CDF values
      for (int x = 0; x < redChannel.length; x++) {
         sumRed += redChannel[x];
         sumGreen += greenChannel[x];
         sumBlue += blueChannel[x];
         redChannel[x] = scaleValueWithCeiling(SCALE, sumRed, 255);
         greenChannel[x] = scaleValueWithCeiling(SCALE, sumGreen, 255);
         blueChannel[x] = scaleValueWithCeiling(SCALE, sumBlue, 255);
      }

      // map component intensities via the normalized CDF curve
      for (int x = 0; x < input.getWidth(); x++) {
         for (int y = 0; y < input.getHeight(); y++) {
            int pixel = input.getPixel(x, y);
            int newRed = redChannel[Color.red(pixel)];
            int newGreen = greenChannel[Color.green(pixel)];
            int newBlue = blueChannel[Color.blue(pixel)];
            int rgb = Color.rgb(newRed, newGreen, newBlue);
            output.setPixel(x, y, rgb);
         }
      }
      return output;
   }

   /**
    * @param bitmap
    * @return a map with "r", "g", and "b" histogram arrays. Each histogram array contains a count of pixels with intensity of `i`
    */
   public Map<String, int[]> getHistograms(Bitmap bitmap) {
      final int CHANNEL_WIDTH = 256;
      int[] redBin = new int[CHANNEL_WIDTH];
      int[] blueBin = new int[CHANNEL_WIDTH];
      int[] greenBin = new int[CHANNEL_WIDTH];

      for (int i = 0; i < CHANNEL_WIDTH; i++) {
         redBin[i] = 0;
         blueBin[i] = 0;
         greenBin[i] = 0;
      }

      for (int x = 0; x < bitmap.getWidth(); x++) {
         for (int y = 0; y < bitmap.getHeight(); y++) {
            int pixel = bitmap.getPixel(x, y);
            redBin[Color.red(pixel)]++;
            blueBin[Color.blue(pixel)]++;
            greenBin[Color.green(pixel)]++;
         }
      }
      Map output = new ArrayMap();
      output.put("r", redBin);
      output.put("g", greenBin);
      output.put("b", blueBin);
      return output;
   }

   @Override
   public String getName() {
      return "NativeMath";
   }
}
