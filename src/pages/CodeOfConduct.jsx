function CodeOfConduct() {
    return (
        <div className="max-sm:mx-4">
            <h1 className="main-heading py-1 text-2xl font-black">Official Code of Conduct & Compliance</h1>
            <h1>Rules for System Access, Deactivation, and Suspension</h1>
            <h2 className="sub-heading font-bold mt-3 mb-1">Student Rules (Code: STU-00)</h2>
            <p className="text-sm pl-2">
                • STU-01: Attendance Compliance: Failure to maintain a minimum of 75% attendance without a valid medical excuse. <br/>
                • STU-02: Academic Integrity: Engaging in plagiarism, cheating, or unauthorized sharing of examination materials. <br/>
                • STU-03: Behavioural Misconduct: Use of profanity, bullying, or physical aggression toward peers or staff. <br/>
                • STU-04: Fee Default: Failure to clear fees within the designated grace period. <br/>
                • STU-05: Digital Misuse: Attempting to bypass school firewalls or accessing restricted content on school devices.
            </p>
            <h2 className="sub-heading font-bold mt-3 mb-1">Teacher & Staff Rules (Code: TEA-00)</h2>
            <p className="text-sm pl-2">
                • TEA-01: Curriculum Neglect: Consistent failure to upload lesson plans and study materials to the ERP by the weekly deadline.<br/>
                • TEA-02: Professional Boundary: Maintaining unauthorized private communication with students outside of official school channels.<br/>
                • TEA-03: Grading Discrepancy: Intentional manipulation of student marks or delay in publishing results beyond the 7-day window.<br/>
                • TEA-04: Confidentiality Breach: Sharing student PII (Personally Identifiable Information) or Aadhaar data with third parties.<br/>
                • TEA-05: Unprofessional Conduct: Frequent unexcused tardiness or public disparagement of school policies.
            </p>
            <h2 className="sub-heading font-bold mt-3 mb-1">Parent Rules (Code: PAR-00)</h2>
            <p className="text-sm pl-2">
                • PAR-01: False Documentation: Providing fraudulent income certificates or address proofs during the admission process.<br/>
                • PAR-02: Harassment: Using the website's messaging system to harass teachers or administrative staff.<br/>
                • PAR-03: Non-Cooperation: Repeated failure to attend mandatory Parent-Teacher Meetings (PTMs) regarding a student’s disciplinary issues.
            </p>
            <h2 className="sub-heading font-bold mt-3 mb-1">Backoffice & Admin Rules (Code: ADM-00)</h2>
            <p className="text-sm pl-2">
                • ADM-01: Data Integrity: Unauthorized modification of financial records, fee structures, or audit logs.<br/>
                • ADM-02: Access Abuse: Using administrative privileges to view private employee files or payroll data without authorization.<br/>
                • ADM-03: Financial Malpractice: Mismanagement of collected cash or failure to issue digital receipts via the ERP system.<br/>
                • ADM-04: System Sabotage: Sharing master admin credentials or leaving terminal sessions active and unattended.
            </p>
            <h1 className="main-heading py-1 text-lg font-black">Academic Integrity & Professional Ethics</h1>
            <h1>Rules regarding Cheating, Collusion, and Data Breaches</h1>
            <h2 className="sub-heading font-bold mt-3 mb-1">Malpractice & Cheating (Code: MAL-00)</h2>
            <p className="text-sm pl-2">
                • MAL-01: [Student] Active Cheating: Caught using unauthorized materials, mobile devices, or "cheat sheets" during a live examination.<br/>
                • MAL-02: [Student] Plagiarism: Submitting assignments, projects, or thesis work copied directly from the internet or another student without attribution.<br/>
                • MAL-03: [Student/Teacher] Identity Fraud: Impersonating another user to take an online assessment or modifying the "User ID" in the ERP to access someone else's test.<br/>
                • MAL-04: [Teacher] Exam Leakage: Sharing question papers, answer keys, or "hints" with specific students prior to the official examination time.<br/>
                • MAL-05: [Teacher] Grade Manipulation: Changing marks in the ERP after the final submission deadline without a logged and approved "Correction Request."
            </p>
            <h2 className="sub-heading font-bold mt-3 mb-1">Data Breach & System Misuse (Code: SEC-00)</h2>
            <p className="text-sm pl-2">
                • SEC-01: Credential Sharing: A teacher or admin sharing their ERP login/password with a student or an external individual.<br/>
                • SEC-02: Bulk Data Export: Downloading student contact lists, Aadhaar numbers, or parent financial data for personal or commercial use.<br/>
                • SEC-03: Evidence Tampering: Attempting to delete logs, "Attendance Records," or "Suspension History" to hide a previous violation.<br/>
                • SEC-04: Unauthorized Scripting: Using automated scripts or "Bots" to flood the ERP messaging system or manipulate "Nearest Free User" scheduling logic.
            </p>
            <table className="table-auto border-collapse text-left border border-slate-400 text-[14px] my-4">
                <thead>
                    <tr className="align-top">
                        <th className="border border-slate-300 px-1">Action</th>
                        <th className="border border-slate-300 px-1">Criteria</th>
                        <th className="border border-slate-300 px-1">Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="align-top">
                        <td className="border border-slate-300 px-1">Warning</td>
                        <td className="border border-slate-300 px-1">First minor violation (e.g., TEA-01, STU-01)</td>
                        <td className="border border-slate-300 px-1">Temporary lock (24 hours)</td>
                    </tr>
                    <tr className="align-top">
                        <td className="border border-slate-300 px-1">Suspension</td>
                        <td className="border border-slate-300 px-1">Second violation or major behavioural issue</td>
                        <td className="border border-slate-300 px-1">Account locked; 7-day investigation</td>
                    </tr>
                    <tr className="align-top">
                        <td className="border border-slate-300 px-1">Deactivation</td>
                        <td className="border border-slate-300 px-1">Severe breach (e.g., ADM-01, TEA-04, PAR-01)</td>
                        <td className="border border-slate-300 px-1">Permanent removal of access; Data archived</td>
                    </tr>
                </tbody>
            </table>

            <h2 className="sub-heading font-bold mt-3 mb-1">Official Disclaimer: Notice of Disciplinary Consequences</h2>
            <p className="text-sm">
                All Users (Students, Parents, Faculty, and Administrative Staff) <br/> Subject: Mandatory Disclosure of Disciplinary Actions on Official Certification.
            </p>

            <h2 className="sub-heading font-bold mt-3 mb-1">Clause for Students & Parents (Impact on Transfer Certificate)</h2>
            <p className="text-sm">
                In the event of a suspension or deactivation due to a breach of school rules (including but not limited to MAL-01: Cheating or PAR-01: Fraudulent Documentation):
            </p>
            <p className="text-sm pl-2 mt-2">
                • Permanent Record: The specific Rule Code and nature of the violation will be explicitly recorded in the "Conduct and Character" column of the Transfer Certificate (TC) and School Leaving Certificate.<br/>
                • Admission Denials: Parents are hereby advised that such remarks may adversely affect the student's eligibility for admission into future educational institutions.<br/>
                • Parental Liability: Actions by a parent that lead to system deactivation (e.g., PAR-02: Harassment) will be noted as "Administrative Withdrawal due to Parental Non-Compliance" on the student's final exit documents.
            </p>

            <h2 className="sub-heading font-bold mt-3 mb-1">Clause for Teachers & Backoffice Staff (Impact on Career)</h2>
            <p className="text-sm">
                For all professional employees, any deactivation resulting from ethical breaches (including but not limited to MAL-04: Exam Leakage or SEC-02: Data Breach) will carry the following consequences:
            </p>

            <p className="text-sm pl-2 mt-2">
                • Service Certificate: The Relieving Letter and Work Experience Certificate will contain a formal "Adverse Remark" detailing the cause of termination or suspension.<br/>
                • Background Verification: The school reserves the right to disclose these specific Rule Violations during any future Third-Party Background Verification (BGV) requested by prospective employers.<br/>
                • Professional Barring: Serious breaches of security (SEC-00 series) may result in the school reporting the individual to relevant educational regulatory bodies, potentially impacting future career prospects in the sector.

            </p>

            <h2 className="sub-heading font-bold mt-3 mb-1">Finality of Electronic Records</h2>
            <p className="text-sm">
                The data stored within the [School Name] ERP serves as the Primary Source of Truth. Once a suspension is finalized and the "Reason Code" is assigned, it cannot be modified or deleted without a formal board-level appeal.
            </p>
            <div className="mx-4 text-center my-8 text-2xl">END</div>
        </div>
    )
}

export default CodeOfConduct