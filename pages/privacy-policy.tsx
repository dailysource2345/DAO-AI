import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Last updated: July 14, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
          <div className="mb-6">
            <p className="text-slate-700 mb-4">
              <strong>Effective Date:</strong> July 14, 2025<br />
              <strong>Contact:</strong> <a href="mailto:ceo@daoagents.io" className="text-blue-600 hover:text-blue-800">ceo@daoagents.io</a>
            </p>
            <p className="text-slate-700">
              DAO AI ("we," "us," "our") values your privacy. This Privacy Policy explains how we collect, use, store, process, and protect personal data when you access or use the DAO AI platform ("Platform"). By using DAO AI, you consent to this policy in full.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Who We Are</h2>
            <p className="text-slate-700">
              DAO AI is a private Web3 governance platform that enables invite-only communities to engage in discussions, vote on ideas, and build governance reputation through AI-calculated scoring systems. The Platform is operated and controlled by us and based in Dubai, UAE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
            <p className="text-slate-700 mb-4">We collect the following types of data from users:</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">A. Personal Identifiable Information (PII)</h3>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  <li>Username, profile picture, and display name (from Twitter/X or Replit)</li>
                  <li>Email address (optional)</li>
                  <li>Wallet address (optional)</li>
                  <li>Referral relationships and invite codes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">B. Authentication & Security Data</h3>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  <li>Login provider (Twitter/X, email)</li>
                  <li>Session tokens and session metadata</li>
                  <li>Timestamps of login/logout</li>
                  <li>IP address and device/browser metadata</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">C. User-Generated Content</h3>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  <li>Forum threads and comments</li>
                  <li>Voting history and DAO participation</li>
                  <li>Profile bio and public activity data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">D. AI Reputation Data</h3>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  <li>Governance Reputation Score (GRS)</li>
                  <li>Participation patterns and behavioral clustering</li>
                  <li>Engagement metrics across DAOs and discussions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">E. Usage & Technical Data</h3>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  <li>Browsing behavior within the Platform</li>
                  <li>Clickstream data</li>
                  <li>Access logs and error reports</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. How We Use Your Data</h2>
            <p className="text-slate-700 mb-4">We may use your data to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Authenticate users and manage sessions</li>
              <li>Calculate Governance Reputation Scores (GRS) using AI algorithms</li>
              <li>Analyze user behavior to improve platform features</li>
              <li>Monitor forum participation, content quality, and voting dynamics</li>
              <li>Provide insights, leaderboards, and referral features</li>
              <li>Customize and recommend relevant content or DAOs</li>
              <li>Detect abuse, fraud, or suspicious activity</li>
              <li>Conduct internal research and machine learning model training</li>
              <li>Develop commercial insights and datasets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Ownership of Data and AI Output</h2>
            <p className="text-slate-700 mb-4">
              <strong>All data collected on DAO AI, including but not limited to user activity, GRS scores, forum content, metadata, referral data, and AI-generated insights, is the sole property of DAO AI.</strong>
            </p>
            <p className="text-slate-700 mb-4">You agree that:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>DAO AI owns and may use all data, including anonymized or aggregated datasets, for any commercial, analytical, operational, or research purposes.</li>
              <li>Users have no rights to the algorithms, content, models, or scores generated by DAO AI.</li>
              <li>Users may not reproduce, redistribute, reverse-engineer, or commercialize any part of the platform or its outputs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Data Sharing & Disclosure</h2>
            <p className="text-slate-700 mb-4">We do not sell your data. We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Authentication providers (e.g., Twitter/X) for login purposes</li>
              <li>Infrastructure partners under strict confidentiality (e.g., database hosting)</li>
              <li>Legal authorities if required by law or court order</li>
              <li>Third-party contractors helping us improve DAO AI under NDAs</li>
            </ul>
            <p className="text-slate-700 mt-4">
              We may also share anonymized or aggregated data (not identifiable to any user) with academic researchers, partners, or for public reports.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">6. AI, Profiling & Reputation Systems</h2>
            <p className="text-slate-700 mb-4">DAO AI uses artificial intelligence to generate Governance Reputation Scores based on:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Frequency and quality of governance participation</li>
              <li>Voting consistency and behavioral patterns</li>
              <li>DAO activity level and recency</li>
              <li>Historical engagement and influence metrics</li>
            </ul>
            <p className="text-slate-700 mb-4">
              This score may be used internally to rank or feature users but does not constitute a factual judgment, legal status, or formal credential.
            </p>
            <p className="text-slate-700 mb-4">You acknowledge:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Scores are based on probabilistic models, not human judgment</li>
              <li>We are not liable for how others interpret or respond to your score</li>
              <li>Attempts to manipulate, evade, or reverse-engineer scoring logic are prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Cookies & Tracking Technologies</h2>
            <p className="text-slate-700 mb-4">DAO AI uses cookies and local storage to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Maintain sessions and login states</li>
              <li>Track invite code usage</li>
              <li>Enhance performance and content recommendations</li>
            </ul>
            <p className="text-slate-700 mt-4">
              You can control cookie settings via your browser. Disabling them may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Data Retention</h2>
            <p className="text-slate-700 mb-4">We retain:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>User accounts indefinitely unless deleted by user request</li>
              <li>Session data until expiration</li>
              <li>Governance activity and reputation history permanently, for research and scoring purposes</li>
            </ul>
            <p className="text-slate-700 mt-4">
              You can request full account and data deletion by contacting <a href="mailto:ceo@daoagents.io" className="text-blue-600 hover:text-blue-800">ceo@daoagents.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">9. International Data Transfers</h2>
            <p className="text-slate-700 mb-4">DAO AI operates globally. By using our platform, you consent to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>The transfer and processing of your data in and outside the UAE</li>
              <li>The storage of data in secure cloud environments, subject to applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Data Security</h2>
            <p className="text-slate-700 mb-4">We implement best-practice security standards, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Password hashing (bcrypt)</li>
              <li>Session-based authentication</li>
              <li>Role-based access controls for administrators</li>
              <li>Encrypted database connections and backups</li>
            </ul>
            <p className="text-slate-700 mt-4">
              <strong>However, no method is 100% secure. By using the Platform, you accept this risk.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">11. Your Rights</h2>
            <p className="text-slate-700 mb-4">You may request to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Access and view your personal data</li>
              <li>Correct or update inaccurate information</li>
              <li>Export your reputation history</li>
              <li>Delete your account and all associated data</li>
            </ul>
            <p className="text-slate-700 mt-4">
              We reserve the right to verify your identity before processing any request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">12. Children's Privacy</h2>
            <p className="text-slate-700">
              DAO AI is not intended for individuals under 18. We do not knowingly collect data from minors. If we learn that we have collected data from a child, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">13. Legal Protections & Limitations</h2>
            <p className="text-slate-700 mb-4">You agree that:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>DAO AI is not liable for decisions, actions, or outcomes based on GRS or platform content</li>
              <li>DAO AI is not responsible for user-generated content or its interpretation</li>
              <li>You release us from liability related to AI outputs, score fluctuations, or public perception</li>
              <li>You will not attempt legal action against DAO AI for any use of anonymized or aggregate data</li>
              <li><strong>You use the Platform entirely at your own risk</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">14. Governing Law & Jurisdiction</h2>
            <p className="text-slate-700">
              This Privacy Policy is governed by the laws of the Dubai International Financial Centre (DIFC), United Arab Emirates. Any disputes shall be resolved exclusively in Dubai under DIFC arbitration rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">15. Changes to This Privacy Policy</h2>
            <p className="text-slate-700">
              DAO AI may revise this policy at any time. We will notify users of significant updates via email or in-app notifications. Continued use of the platform constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">16. Contact</h2>
            <p className="text-slate-700">
              For questions, data access, or legal concerns, contact:<br />
              📧 <a href="mailto:ceo@daoagents.io" className="text-blue-600 hover:text-blue-800">ceo@daoagents.io</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}