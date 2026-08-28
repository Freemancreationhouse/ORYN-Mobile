package house.freeman.orynmobile;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.DhcpInfo;
import android.net.wifi.WifiManager;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

public class MainActivity extends Activity {
    private WebView web;
    private Bridge bridge;

    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        bridge = new Bridge(this, web);
        web.addJavascriptInterface(bridge, "ORYNNative");
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.loadUrl("file:///android_asset/app/index.html");
    }

    @Override public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    public static class Bridge {
        private final Context ctx;
        private final WebView web;
        private final SharedPreferences prefs;
        private final ExecutorService pool = Executors.newFixedThreadPool(20);
        private final Handler main = new Handler(Looper.getMainLooper());
        private volatile String host;

        Bridge(Context c, WebView w) {
            ctx=c; web=w; prefs=c.getSharedPreferences("oryn_mobile", MODE_PRIVATE);
            host=prefs.getString("host", "");
        }

        @JavascriptInterface public String getSavedHost() { return host == null ? "" : host; }
        @JavascriptInterface public void setSavedHost(String h) {
            host=normalize(h); prefs.edit().putString("host",host).apply();
        }
        @JavascriptInterface public String getPref(String k) { return prefs.getString(k, ""); }
        @JavascriptInterface public void setPref(String k,String v) { prefs.edit().putString(k,v).apply(); }

        private String normalize(String h) {
            if (h==null) return ""; h=h.trim();
            if (h.startsWith("http://")) h=h.substring(7);
            if (h.startsWith("https://")) h=h.substring(8);
            while (h.endsWith("/")) h=h.substring(0,h.length()-1);
            return h;
        }

        @JavascriptInterface public void request(String method, String path, String body, String callbackId) {
            final String h=host;
            if (h==null || h.isEmpty()) { callback(callbackId,false,"{\"error\":\"No ORYN table connected\"}"); return; }
            pool.submit(() -> {
                HttpURLConnection con=null;
                try {
                    URL u=new URL("http://"+h+(path.startsWith("/")?path:"/"+path));
                    con=(HttpURLConnection)u.openConnection();
                    con.setConnectTimeout(2200); con.setReadTimeout(8000);
                    con.setRequestMethod(method.toUpperCase(Locale.US));
                    con.setRequestProperty("Accept","application/json");
                    if (body!=null && !body.isEmpty() && !method.equalsIgnoreCase("GET")) {
                        con.setDoOutput(true); con.setRequestProperty("Content-Type","application/json");
                        try(OutputStream os=con.getOutputStream()){ os.write(body.getBytes(StandardCharsets.UTF_8)); }
                    }
                    int code=con.getResponseCode();
                    InputStream is=(code>=200&&code<400)?con.getInputStream():con.getErrorStream();
                    String text=readAll(is);
                    callback(callbackId,code>=200&&code<300,text==null?"{}":text);
                } catch(Exception e){ callback(callbackId,false,"{\"error\":"+JSONObject.quote(e.getMessage()==null?"Connection failed":e.getMessage())+"}"); }
                finally { if(con!=null) con.disconnect(); }
            });
        }

        @JavascriptInterface public void discover(String callbackId) {
            pool.submit(() -> {
                LinkedHashSet<String> candidates=new LinkedHashSet<>();
                candidates.add("oryn.local");
                try {
                    WifiManager wm=(WifiManager)ctx.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
                    DhcpInfo d=wm.getDhcpInfo();
                    int ip=d.ipAddress;
                    if(ip!=0){ String base=(ip&255)+"."+((ip>>8)&255)+"."+((ip>>16)&255)+"."; for(int i=1;i<255;i++) candidates.add(base+i); }
                } catch(Exception ignored){}
                CompletionService<String> cs=new ExecutorCompletionService<>(pool);
                int submitted=0;
                for(String c:candidates){ submitted++; cs.submit(() -> probe(c)?c:null); }
                long end=System.currentTimeMillis()+6500;
                String found=null;
                for(int i=0;i<submitted && System.currentTimeMillis()<end;i++){
                    try { Future<String> f=cs.poll(Math.max(20,end-System.currentTimeMillis()),TimeUnit.MILLISECONDS); if(f==null) break; String r=f.get(); if(r!=null){found=r;break;} } catch(Exception ignored){}
                }
                if(found!=null){ host=found; prefs.edit().putString("host",found).apply(); callback(callbackId,true,"{\"host\":"+JSONObject.quote(found)+"}"); }
                else callback(callbackId,false,"{\"error\":\"No ORYN table found on this Wi-Fi network\"}");
            });
        }

        private boolean probe(String h){
            HttpURLConnection c=null;
            try { c=(HttpURLConnection)new URL("http://"+h+"/api/settings").openConnection(); c.setConnectTimeout(350); c.setReadTimeout(700); c.setRequestMethod("GET"); int code=c.getResponseCode(); return code>=200&&code<500; }
            catch(Exception e){ return false; } finally { if(c!=null)c.disconnect(); }
        }

        private String readAll(InputStream is)throws IOException{
            if(is==null)return ""; ByteArrayOutputStream b=new ByteArrayOutputStream(); byte[] buf=new byte[4096]; int n; while((n=is.read(buf))!=-1)b.write(buf,0,n); return b.toString("UTF-8");
        }
        private void callback(String id, boolean ok, String payload){
            final String js="window.__orynNativeCallback("+JSONObject.quote(id)+","+(ok?"true":"false")+","+JSONObject.quote(payload)+")";
            main.post(() -> web.evaluateJavascript(js,null));
        }
    }
}
