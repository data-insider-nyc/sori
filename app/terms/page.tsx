import Link from "next/link";

export const metadata = {
  title: "Terms of Service — SORI",
  description: "SORI Terms of Service. Rules and guidelines for using the platform.",
};

const sections = [
  {
    title: "Acceptance",
    body: "By using SORI, you agree to these Terms. If you don't agree, please don't use the Service. We may update these Terms; continued use means you accept the changes.",
  },
  {
    title: "Who Can Use SORI",
    body: "You must be at least 13 years old to use SORI. By using the Service, you confirm that you meet this requirement and that the information you provide is accurate.",
  },
  {
    title: "Your Account",
    body: "You are responsible for your account and all activity under it. Keep your login access (email or social login) secure. Notify us immediately at hello@oursori.com if you suspect unauthorized access.",
  },
  {
    title: "Acceptable Use",
    items: [
      "Post content that is false, misleading, or defamatory",
      "Harass, threaten, or harm other users",
      "Spam, solicit, or advertise without permission",
      "Violate any applicable laws or third-party rights",
      "Attempt to access or disrupt systems you're not authorized to use",
    ],
    prefix: "You agree not to:",
  },
  {
    title: "Your Content",
    body: "You own the content you post. By posting, you grant SORI a non-exclusive, royalty-free license to display and distribute that content within the Service. You are solely responsible for ensuring your content doesn't infringe any third-party rights.",
  },
  {
    title: "Termination",
    body: "We may suspend or terminate your account at any time if you violate these Terms or if we discontinue the Service. You may delete your account at any time from your profile settings.",
  },
  {
    title: "Disclaimers",
    body: 'SORI is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or that the Service will be error-free. Community content is user-generated and does not reflect the views of SORI.',
  },
  {
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by law, SORI is not liable for indirect, incidental, or consequential damages arising from your use of the Service.",
  },
  {
    title: "Governing Law",
    body: "These Terms are governed by the laws of the State of New Jersey, United States, without regard to conflict of law principles.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="text-sm text-gray-400 hover:text-[#FF5C5C] transition-colors mb-6 inline-block">
          ← Back to SORI
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0F1B2D] mb-2">Terms of Service</h1>
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
              <>
                {"prefix" in s && (
                  <p className="text-sm text-gray-600 mb-2">{s.prefix}</p>
                )}
                <ul className="space-y-1.5 list-disc list-inside">
                  {s.items!.map((item, j) => (
                    <li key={j} className="text-sm text-gray-600 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
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
