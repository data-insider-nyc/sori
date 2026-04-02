import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — SORI",
  description: "SORI Privacy Policy. How we collect, use, and protect your information.",
};

const sections = [
  {
    title: "Information We Collect",
    body: "We collect your email address, OAuth provider ID (Google or Kakao), display name, handle, and optional profile photo when you sign up. We also collect standard usage metadata such as login timestamps and IP addresses.",
  },
  {
    title: "How We Use It",
    body: "We use your information solely to operate the Service: authenticate your account, display your profile, and send transactional emails (magic link login). We do not sell your data.",
  },
  {
    title: "Third-Party Services",
    items: [
      { name: "Supabase", desc: "Authentication, database, and file storage." },
      { name: "Google / Kakao", desc: "Social login. We receive your email and basic profile based on the permissions you grant." },
      { name: "Resend", desc: "Transactional email delivery (magic link login)." },
      { name: "Vercel", desc: "Hosting and edge infrastructure." },
    ],
  },
  {
    title: "Data Retention",
    body: "We keep your data as long as your account exists. Deleting your account removes your personal data from our systems, except where retention is required by law.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time. Email us at hello@oursori.com and we'll respond within 30 days.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies for authentication sessions. We may use analytics tools (e.g., Vercel Analytics) that collect anonymized usage data. No advertising cookies are used.",
  },
  {
    title: "Changes",
    body: "We may update this policy and will post the revised version with an updated date. Continued use of the Service after changes constitutes acceptance.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="text-sm text-gray-400 hover:text-[#FF5C5C] transition-colors mb-6 inline-block">
          ← Back to SORI
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0F1B2D] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: April 2, 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-base font-bold text-[#0F1B2D] mb-3">
              {i + 1}. {s.title}
            </h2>
            {"body" in s && (
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            )}
            {"items" in s && (
              <ul className="space-y-2">
                {s.items!.map((item) => (
                  <li key={item.name} className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    {" — "}
                    {item.desc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Questions?{" "}
          <a href="mailto:hello@oursori.com" className="text-[#FF5C5C] hover:underline">
            hello@oursori.com
          </a>
        </p>
      </div>
    </div>
  );
}
