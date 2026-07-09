# DroidSec Forensics 

**Android Malware Analysis Lab Dashboard**

DroidSec Forensics is a professional cybersecurity dashboard designed for the deep-dive investigation of Android malware. This specific instance is configured to analyze **SMS-forwarding Trojans targeting UPI applications**.

It provides a rich, dark-themed, highly technical UI for security researchers, incident responders, and malware analysts.

## Features & Core Pages

The platform is organized into 7 distinct forensic views:

1. **Dashboard**
   High-level overview of the active case, including risk scores, APK metadata, suspicious SMS permissions, identified C2 network endpoints, obfuscation analysis, and a timeline of malicious behavior.
   ![Dashboard Preview](/dashboard.png)

2. **Static Analysis**
   Deep dive into the APK's static properties. Features an `AndroidManifest.xml` inspector, `BroadcastReceiver` detection, flagged permissions, decompiled code snippets (Java), YARA rule matches, and MobSF static analysis findings.
   ![Static Analysis](/static_analysis.png)

3. **Dynamic Analysis**
   Runtime behavior monitoring. Shows emulator status, a live-filter Logcat viewer, SMS interception events, outbound network activity charts, process trees, and a system call timeline.
   ![Dynamic Analysis](/dynamic_analysis.png)

4. **IOCs / Indicators**
   A consolidated view of all extracted Indicators of Compromise (IOCs). Tabbed interface for Domains, IPs, Package names, Hashes, Receivers, and suspicious API calls. Includes search, filter, and quick-copy functionality.
   ![IOCs](/iocs.png)

5. **Detection Rules**
   Documentation of the logic used to flag this malware. Includes YARA rules, Sigma-like behavioral rules, permission-based heuristics, and network exfiltration patterns.
   ![Detection Rules](/detection_rules.png)

6. **Forensic Report**
   An automatically generated, structured DFIR report summarizing the investigation. Includes an executive summary, evidence chain, methodology, key findings, and final verdict.
   ![Forensic Report](/forensic_report.png)

7. **Recommendations**
   Actionable remediation steps categorized by priority (Immediate, Short-term, Long-term) to help organizations defend against this specific malware family.
   ![Recommendations](/recommendations.png)

## Tech Stack

This project is built using modern web technologies:

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Language**: TypeScript

## Getting Started

First, make sure you have installed the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whichever port is assigned, e.g., 3001) with your browser to see the result.

## Architecture & Data

*   The UI is built as a **Single Page Application (SPA)** using Next.js client components. 
*   Navigation is managed via state within `src/app/page.tsx` to provide seamless, instant page transitions without reloads.
*   All data displayed in the dashboard is mock data driven by `src/lib/forensicData.ts`. In a real-world scenario, this layer would be replaced by API calls to actual backend analysis engines (like Cuckoo, MobSF, or custom sandboxes).
