export interface PrivacySection {
  heading: string;
  body: string;
}

export const PRIVACY_LAST_UPDATED = "July 2026";

export const PRIVACY_POLICY: PrivacySection[] = [
  {
    heading: "1. Who We Are",
    body: "Jimbu is an app to track you everyday finances. Jimbu is operated by solo developer, based in Australia. This policy explains what personal information we collect, how we use it, and the choices you have. If you have any questions, contact us at admin@jimbu.app.",
  },
  {
    heading: "2. Information We Collect",
    body: "We collect only the information needed to run the app: account information (your name and email address — your password is stored only in a hashed, irreversible form; we never see it in plain text), financial data you enter (the accounts, transactions, and categories you create, including amounts, labels, and dates), device information (a device identifier and device name, used to secure your sign-in sessions and detect unauthorized access to your account), and diagnostic data (basic technical information and crash reports that help us keep the app stable).",
  },
  {
    heading: "3. How We Use Your Information",
    body: "We use your information to provide the app and sync your data across your devices, to authenticate you and keep your account secure, to diagnose problems and improve reliability, and to respond to your support requests. We do not use your financial data for advertising, and we do not sell it.",
  },
  {
    heading: "4. Crash Reporting",
    body: "We use Sentry to collect crash and error reports so we can fix problems. These reports may include technical details about the error and your device. Our Sentry data is processed on servers located in the European Union.",
  },
  {
    heading: "5. How We Share Information",
    body: "We do not sell your personal information. We share it only with service providers who help us operate the app (such as our hosting provider, Railway, and Sentry for crash reporting), under agreements that require them to protect your data, or if required by law, or to protect the rights, safety, or property of our users or Jimbu.",
  },
  {
    heading: "6. Data Storage & Security",
    body: "Your account and financial data is stored on servers operated by our hosting provider, Railway, in the Singapore region. Data is transmitted over encrypted connections (HTTPS), and authentication tokens are stored in your device’s secure storage. While no system is completely secure, we take reasonable measures to protect your information against unauthorized access.",
  },
  {
    heading: "7. Data Retention",
    body: "We keep your information for as long as your account is active. When you delete your account, we remove your personal data, except where we are required to retain certain records to comply with legal obligations.",
  },
  {
    heading: "8. Your Rights",
    body: "You can access, correct, or delete your information at any time from within the app or by contacting us at admin@jimbu.app. Depending on where you live (for example, in the EU/UK under GDPR), you may also have the right to object to or restrict certain processing, and to request a copy of your data.",
  },
  {
    heading: "9. Deleting Your Account",
    body: "You can delete your account, and the personal data associated with it, from within the app or by emailing admin@jimbu.app. Account deletion is permanent.",
  },
  {
    heading: "10. Children’s Privacy",
    body: "Jimbu is intended for users aged 13 and over. It is not directed at children below 13, and we do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will delete it.",
  },
  {
    heading: "11. International Data Transfers",
    body: "Jimbu is operated from Australia, but your information is stored and processed on servers outside Australia. Your account and financial data is hosted by our infrastructure provider, Railway, in the Singapore region, and crash and error reports are processed by Sentry in the European Union. This means your information may be transferred to, and stored in, countries whose data-protection laws differ from those where you live. Whenever we transfer personal information internationally, we require our service providers to protect it and take reasonable steps to ensure it remains protected in accordance with this policy and applicable law.",
  },
  {
    heading: "12. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. When we do, we will revise the “Last updated” date above. Continued use of the app after changes are published constitutes acceptance of the updated policy.",
  },
  {
    heading: "13. Contact",
    body: "If you have questions or requests regarding this Privacy Policy or your data, contact us at admin@jimbu.app.",
  },
];
