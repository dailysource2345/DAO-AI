import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Terms of Use</h1>
          <p className="text-slate-600">Last updated: July 14, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
          <div className="mb-6">
            <p className="text-slate-700 mb-4">
              <strong>Effective Date:</strong> July 14, 2025<br />
              <strong>Contact:</strong> <a href="mailto:ceo@daoagents.io" className="text-blue-600 hover:text-blue-800">ceo@daoagents.io</a>
            </p>
            <p className="text-slate-700">
              Welcome to DAO AI, a private invite-only platform for governance discussions and AI-driven reputation scoring. By accessing or using DAO AI ("Platform"), you agree to the following Terms of Use. If you do not agree, do not use the Platform.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You must be at least 18 years old to use DAO AI.</li>
              <li>Access is granted exclusively by invite code and may be revoked at any time.</li>
              <li>You represent that all information you provide is truthful and accurate.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Account Responsibilities</h2>
            <p className="text-slate-700 mb-4">By registering:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You agree to maintain the confidentiality of your login credentials.</li>
              <li>You accept full responsibility for activity under your account.</li>
              <li>You will not impersonate anyone or create multiple identities to manipulate the system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Platform Conduct</h2>
            <p className="text-slate-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Upload or share defamatory, illegal, or harmful content</li>
              <li>Attempt to reverse-engineer, copy, or misuse any part of the platform</li>
              <li>Disrupt the platform or tamper with AI scoring mechanisms</li>
              <li>Exploit bugs or vulnerabilities for unfair advantage</li>
            </ul>
            <p className="text-slate-700 mt-4">
              <strong>Violation may result in account suspension or termination.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. User Content & Licensing</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You retain ownership of your content.</li>
              <li>By posting, you grant DAO AI a royalty-free, worldwide license to use, display, process, and analyze your content for governance reputation calculations and community engagement features.</li>
              <li>We may aggregate and anonymize data for platform improvement and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. AI-Driven Reputation Scoring (GRS)</h2>
            <p className="text-slate-700 mb-4">
              The Governance Reputation Score (GRS) is calculated using proprietary AI models based on your activity and engagement. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Scores may affect how others perceive your governance contributions.</li>
              <li>You will not manipulate or attempt to reverse-engineer the scoring system.</li>
              <li>GRS is an informational tool and carries no guarantees, warranties, or legal implications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Intellectual Property</h2>
            <p className="text-slate-700 mb-4">
              DAO AI and all related software, models, data, designs, logos, and trademarks are the exclusive property of DAO AI or its affiliates. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Copy, distribute, or modify any DAO AI intellectual property</li>
              <li>Use our branding or materials without express written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Platform Availability & Changes</h2>
            <p className="text-slate-700 mb-4">DAO AI reserves the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Modify, suspend, or terminate the platform at any time</li>
              <li>Add or remove features without notice</li>
              <li>Revoke or restrict access at its sole discretion</li>
            </ul>
            <p className="text-slate-700 mt-4">
              DAO AI is not liable for any data loss, downtime, or impact resulting from such changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">8. No Warranty (As-Is Use)</h2>
            <p className="text-slate-700 mb-4">
              <strong>DAO AI is provided "AS IS" and "AS AVAILABLE."</strong><br />
              We make no warranties, express or implied, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Accuracy or reliability of any Governance Reputation Score (GRS)</li>
              <li>Uninterrupted or error-free service</li>
              <li>Compatibility with your devices or systems</li>
              <li>Fitness for any particular purpose</li>
            </ul>
            <p className="text-slate-700 mt-4">
              <strong>You use the platform entirely at your own risk.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-700 mb-4">
              To the fullest extent permitted by law, DAO AI, its founders, affiliates, developers, employees, and agents will not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Any loss of profits, data, business opportunities, or reputational harm</li>
              <li>Any claim relating to platform usage, AI scoring, or third-party integrations</li>
            </ul>
            <p className="text-slate-700 mt-4">
              <strong>This limitation applies even if DAO AI was advised of potential damages.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Indemnity & Hold Harmless</h2>
            <p className="text-slate-700 mb-4">
              You agree to indemnify, defend, and hold harmless DAO AI, its founders, officers, affiliates, partners, and agents from any and all claims, liabilities, damages, losses, and expenses (including legal fees) arising out of:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Any content you submit or actions you take on the platform</li>
              <li>Any third-party claim related to your use of DAO AI</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">11. Dispute Resolution & Arbitration</h2>
            <p className="text-slate-700 mb-4">
              Any dispute, controversy, or claim arising out of or in connection with these Terms or your use of the platform shall be exclusively resolved by final and binding arbitration under the rules of the Dubai International Arbitration Centre (DIAC).
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Location:</strong> Dubai, United Arab Emirates</li>
              <li><strong>Language:</strong> English</li>
              <li><strong>Number of Arbitrators:</strong> One</li>
            </ul>
            <p className="text-slate-700 mt-4">
              <strong>You waive any right to litigation in court.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">12. No Class Actions</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You agree to waive your right to participate in any class action, consolidated, or representative proceeding.</li>
              <li>Disputes must be brought in your individual capacity only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">13. Termination</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>DAO AI may suspend or terminate your account at any time for any reason, including violation of these Terms.</li>
              <li>You may request deletion of your account and associated data by contacting <a href="mailto:ceo@daoagents.io" className="text-blue-600 hover:text-blue-800">ceo@daoagents.io</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">14. Governing Law</h2>
            <p className="text-slate-700">
              These Terms and any dispute arising under them are governed by the laws of the Dubai International Financial Centre (DIFC), Dubai, United Arab Emirates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">15. Changes to Terms</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>DAO AI may modify these Terms at any time. We will notify you of material changes via email or in-app notification.</li>
              <li>Continued use of the platform after changes constitutes your acceptance of the new Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">16. Contact</h2>
            <p className="text-slate-700">
              For legal notices, user rights inquiries, or account-related questions, contact us at:<br />
              📧 <a href="mailto:ceo@daoagents.io" className="text-blue-600 hover:text-blue-800">ceo@daoagents.io</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}