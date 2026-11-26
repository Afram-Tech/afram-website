/**
 * Afram's Privacy Policy and Cookie Policy, as Legal supplied them
 * ("20250207 Privacy Policy for Afram.docx", "20250311 Afram Cookie Policy.docx").
 *
 * The wording is theirs, word for word. Only the layout is ours: sections,
 * sub-headings, lists and cards. To change a sentence, get a new version from
 * Legal and regenerate; don't edit it here. The Exchange carries the same file
 * (src/app/components/legal/legalDocuments.ts there).
 */

export type LegalIcon = "lock" | "gauge" | "sliders" | "chart" | "megaphone" | "puzzle";

export interface LegalItem {
  /** A lead-in shown in bold, e.g. "Payment Processors". */
  label?: string;
  text: string;
}

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "h3"; text: string; numbered?: boolean }
  /** A small lead-in such as "How to Exercise This Right:". */
  | { kind: "label"; text: string }
  | { kind: "list"; items: LegalItem[]; ordered?: boolean }
  | { kind: "cards"; items: { title: string; text: string; icon?: LegalIcon }[] }
  /** A boxed sub-section, e.g. one of your rights. */
  | { kind: "group"; title: string; blocks: LegalBlock[] }
  /** Afram's contact details (LEGAL_CONTACT). */
  | { kind: "contact" };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  slug: "privacy" | "cookie-policy";
  title: string;
  /** ISO date the document takes effect. */
  effective: string;
  sections: LegalSection[];
}

/**
 * Where to reach Afram about these policies. Legal's documents leave the email
 * and phone as placeholders ("[insert email]"), so they stay null, and hidden,
 * until Legal confirms them.
 */
export const LEGAL_CONTACT: { address: string; email: string | null; phone: string | null } = {
  address: "Afram Technologies, Junction House, 2nd Floor, 112 University Farm Road, Ashaley-Botwe, Adentan, Accra, Ghana",
  email: null,
  phone: null,
};

export const PRIVACY_POLICY: LegalDocument = {
  "slug": "privacy",
  "title": "Privacy Policy",
  "effective": "2025-01-27",
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "blocks": [
        {
          "kind": "p",
          "text": "Welcome to Afram, a pioneering software platform designed to revolutionize the transfer of real assets through blockchain technology and tokenization in Ghana. At Afram, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy is designed to provide you with a clear and comprehensive understanding of how we collect, use, disclose, and safeguard your data."
        },
        {
          "kind": "p",
          "text": "In an era where data is increasingly valuable and vulnerable, we recognize the paramount importance of privacy. As a company operating at the intersection of real estate, finance, and technology, we handle sensitive information daily. Our commitment to your privacy goes beyond mere compliance with laws; it is a core value that underpins every aspect of our operations."
        },
        {
          "kind": "p",
          "text": "This Privacy Policy has been crafted to align with the Data Protection Act of Ghana (Act 843) and other relevant regulations governing data protection and digital transactions in Ghana. We strive to uphold the highest standards of data protection, ensuring that your rights as a data subject are respected and protected at all times."
        }
      ]
    },
    {
      "id": "scope-of-this-policy",
      "title": "Scope of This Policy",
      "blocks": [
        {
          "kind": "p",
          "text": "This policy applies to all personal information collected through our website, mobile applications, and any other platforms or services offered by Afram. It covers data collected from users, clients, partners, and any individuals who interact with our services."
        },
        {
          "kind": "p",
          "text": "As a platform facilitating the tokenization and transfer of assets, we deal with complex and high-value transactions. This necessitates the collection and processing of detailed personal and financial information. We want you to understand that while we collect extensive data, it is always for specific, legitimate purposes related to our services. We believe in transparency. This policy aims to provide you with clear information about what data we collect, why we collect it, how we use it, and the control you have over your information. We encourage you to read this policy carefully and to reach out to us if you have any questions or concerns."
        },
        {
          "kind": "p",
          "text": "The digital landscape and regulatory environment are constantly evolving. As such, we regularly review and update our privacy practices. We encourage you to periodically review this policy to stay informed about how we protect your personal information. Your trust is the foundation of our business. We are committed to earning and maintaining that trust through responsible data practices, robust security measures, and unwavering respect for your privacy rights."
        }
      ]
    },
    {
      "id": "information-we-collect",
      "title": "Information We Collect",
      "blocks": [
        {
          "kind": "p",
          "text": "We may collect the following types of information:"
        },
        {
          "kind": "h3",
          "text": "Types of Information Collected by Afram"
        },
        {
          "kind": "cards",
          "items": [
            {
              "title": "Personal Identification Information",
              "text": "Full name, date of birth, gender, nationality, Ghana Card number or other national ID, Passport number (for non-Ghanaian residents, Photograph or biometric data, Signature"
            },
            {
              "title": "Contact Information",
              "text": "Residential address, mailing address (if different), email address, phone number(s), emergency contact details"
            },
            {
              "title": "Financial Information",
              "text": "Bank account details, Tax Identification Number (TIN), Source of funds, Income information, Credit history (where applicable)"
            },
            {
              "title": "Asset-Related Information",
              "text": "Details of real assets being transferred or tokenized, Property titles and deeds, Valuation reports, Historical ownership information, Liens or encumbrances on the asset"
            },
            {
              "title": "Transaction Data",
              "text": "Transaction history on the Afram platform, Dates and amounts of transfers, Recipient information for transfers, Token issuance and transfer detail, Smart contract interactions"
            },
            {
              "title": "Authentication Data",
              "text": "Username and password (encrypted), Two-factor authentication details, Security questions and answers, Login history and device information"
            },
            {
              "title": "Technical and Usage Data",
              "text": "IP address, Browser type and version, Operating system, Device information (type, model, unique identifiers), Pages visited on our platform, Time spent on each page, Clickstream data, Errors encountered"
            },
            {
              "title": "Location Data",
              "text": "GPS location (if permitted by user), Location derived from IP address"
            },
            {
              "title": "Communication Data",
              "text": "Records of correspondence with our customer service, Chat logs, Feedback and survey responses"
            },
            {
              "title": "Marketing and Preferences",
              "text": "Marketing preferences, Subscription status to newsletters, Responses to ads or promotions"
            },
            {
              "title": "Professional and Background Information",
              "text": "Business ownership information (if applicable), Employment status, Occupation, Employer details, Professional qualifications"
            },
            {
              "title": "Compliance and Verification Data",
              "text": "Results of KYC (Know Your Customer) checks, AML (Anti-Money Laundering) screening results, PEP (Politically Exposed Person) status, Sanctions list checking results, Copies of identification documents provided"
            },
            {
              "title": "Third-Party Data",
              "text": "Information obtained from credit bureaus, Public records information, Information from business partners or affiliates"
            },
            {
              "title": "Blockchain-Specific Data",
              "text": "Wallet addresses, Public keys, Transaction hashes, Smart contract interactions"
            },
            {
              "title": "Cookie and Tracking Data",
              "text": "Cookie identifiers, Web beacons, Pixel tags, Local storage data"
            }
          ]
        }
      ]
    },
    {
      "id": "how-we-use-your-information",
      "title": "How We Use Your Information",
      "blocks": [
        {
          "kind": "p",
          "text": "At Afram, we use the information we collect for several key purposes, all of which are designed to enhance your experience with our services and ensure compliance with legal and regulatory requirements in Ghana."
        },
        {
          "kind": "h3",
          "text": "Service Provision and Maintenance"
        },
        {
          "kind": "p",
          "text": "We use your information to provide and maintain our services related to the transfer of real assets through blockchain and tokenization. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We process transactions efficiently and securely, ensuring that all parties involved are verified and compliant with regulatory requirements."
            },
            {
              "text": "We manage and track the ownership and transfer of real assets, ensuring that all transactions are properly documented and recorded on the blockchain."
            },
            {
              "text": "Your information helps us provide personalized support and assistance with any queries or issues related to our services."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Compliance with Legal and Regulatory Obligations"
        },
        {
          "kind": "p",
          "text": "Afram is committed to complying with all relevant laws and regulations in Ghana, including those related to financial transactions, anti-money laundering (AML), and know-your-customer (KYC) requirements. We use your information to:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We verify your identity to prevent fraud and ensure compliance with KYC regulations."
            },
            {
              "text": "We perform AML checks to prevent illegal activities and comply with financial regulations."
            },
            {
              "text": "We maintain accurate and detailed records of all transactions and interactions to meet legal and regulatory requirements."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Improvement of Services"
        },
        {
          "kind": "p",
          "text": "We analyze usage patterns and feedback to improve our services continuously. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We analyze transaction data to identify trends and areas for improvement in our services."
            },
            {
              "text": "Your feedback and usage patterns help us refine our platform to better meet your needs."
            },
            {
              "text": "We use insights from user data to develop new features and functionalities that enhance the overall user experience."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Communication and Marketing"
        },
        {
          "kind": "p",
          "text": "We use your contact information to communicate with you about our services and any updates or promotions that might be of interest. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We notify you about changes to our services, new features, or any maintenance that might affect your use of our platform."
            },
            {
              "text": "With your consent, we may send you marketing communications about our services or related products that we believe might be of interest to you."
            },
            {
              "text": "We may contact you to gather feedback or participate in surveys to help us improve our services."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Security and Fraud Prevention"
        },
        {
          "kind": "p",
          "text": "Your information helps us maintain the security of our platform and prevent fraudulent activities. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We monitor transactions and user behavior to identify and prevent suspicious or fraudulent activities."
            },
            {
              "text": "We use data to improve our security protocols and protect against potential threats."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Business Operations and Development"
        },
        {
          "kind": "p",
          "text": "We use your information to manage our business operations effectively and to develop strategic plans for growth. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We analyze user data to inform business decisions and strategic planning."
            },
            {
              "text": "Your information may be shared with partners or collaborators to enhance our services or develop new opportunities."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Compliance with Data Protection Laws"
        },
        {
          "kind": "p",
          "text": "We ensure that all data processing activities comply with the Data Protection Act of Ghana and other relevant regulations. This includes ensuring that we have a lawful basis for processing your data and that we respect your rights as a data subject."
        }
      ]
    },
    {
      "id": "disclosure-of-your-information",
      "title": "Disclosure of Your Information",
      "blocks": [
        {
          "kind": "p",
          "text": "At Afram, we are committed to protecting your privacy while also ensuring compliance with legal and regulatory requirements. By inputting information on Afram, including but not limited to personal identification information, property details, addresses, and photographs, you acknowledge and agree that such information will be accessible to and shared with other users of the Afram platform. Please ensure that any information you share is accurate and that you have the right to share it."
        },
        {
          "kind": "p",
          "text": "We may disclose your information to third parties under specific circumstances, as outlined below."
        },
        {
          "kind": "h3",
          "text": "Service Providers"
        },
        {
          "kind": "p",
          "text": "We work with various service providers to ensure the smooth operation of our services. These include:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Payment Processors",
              "text": "Companies that handle financial transactions on our platform."
            },
            {
              "label": "Data Analytics Providers",
              "text": "Firms that help us analyze user behavior and improve our services."
            },
            {
              "label": "Cloud Storage Providers",
              "text": "Companies that store our data securely."
            },
            {
              "label": "Customer Support Tools",
              "text": "Platforms that assist us in managing customer inquiries."
            }
          ]
        },
        {
          "kind": "p",
          "text": "We only share the information necessary for these service providers to perform their tasks, and we ensure that they comply with our privacy standards."
        },
        {
          "kind": "h3",
          "text": "Regulatory Authorities"
        },
        {
          "kind": "p",
          "text": "We may disclose your information to regulatory authorities in Ghana as required by law. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Bank of Ghana",
              "text": "For compliance with financial regulations."
            },
            {
              "label": "Securities and Exchange Commission",
              "text": ""
            },
            {
              "label": "Financial Intelligence Centre",
              "text": "For anti-money laundering (AML) and combating the financing of terrorism (CFT) purposes."
            },
            {
              "label": "Other Government Agencies",
              "text": "As required for legal compliance or to respond to inquiries."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Compliance and Legal Obligations"
        },
        {
          "kind": "p",
          "text": "We may disclose your information when required by law or to protect our rights. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Court Orders",
              "text": "In response to a court order or subpoena."
            },
            {
              "label": "Legal Proceedings",
              "text": "To defend ourselves in legal proceedings."
            },
            {
              "label": "Investigations",
              "text": "In connection with investigations by law enforcement or regulatory bodies."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Business Transfers"
        },
        {
          "kind": "p",
          "text": "In the event of a merger, acquisition, or sale of assets, we may disclose your information to the parties involved. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Mergers and Acquisitions",
              "text": "If Afram merges with or is acquired by another company."
            },
            {
              "label": "Asset Sales",
              "text": "If we sell or transfer any of our assets."
            },
            {
              "label": "Business Restructuring",
              "text": "In cases of business restructuring or reorganization."
            }
          ]
        },
        {
          "kind": "p",
          "text": "We ensure that any such disclosure is subject to appropriate confidentiality agreements and that your data is protected in accordance with applicable laws."
        },
        {
          "kind": "h3",
          "text": "With Your Consent"
        },
        {
          "kind": "p",
          "text": "We may also disclose your information with your explicit consent. This includes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Marketing Partners",
              "text": "If you consent to receive marketing communications from our partners."
            },
            {
              "label": "Research and Development",
              "text": "If you agree to participate in research studies or pilot programs."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Publicly Available Information"
        },
        {
          "kind": "p",
          "text": "In some cases, certain information may be publicly available, such as blockchain transaction data. However, we do not disclose personal identifiable information without consent unless legally required to do so."
        },
        {
          "kind": "h3",
          "text": "Safeguards for Disclosure"
        },
        {
          "kind": "p",
          "text": "When disclosing your information, we ensure that Data Protection Agreements are in place with third parties to protect your data; all disclosures comply with Ghanaian laws and regulations and only the necessary information is shared."
        }
      ]
    },
    {
      "id": "data-security",
      "title": "Data Security",
      "blocks": [
        {
          "kind": "p",
          "text": "At Afram, the security of your personal data is a top priority. We are committed to implementing robust measures to protect your information from unauthorized access, loss, misuse, alteration, or disclosure. As a platform facilitating the transfer of real assets through blockchain and tokenization, we recognize the critical importance of safeguarding sensitive data and maintaining trust with our users."
        },
        {
          "kind": "p",
          "text": "We use advanced encryption technologies to protect your data both in transit and at rest:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "All data transmitted between your device and our servers is encrypted using Transport Layer Security (TLS), ensuring that it cannot be intercepted or accessed by unauthorized parties."
            },
            {
              "text": "Sensitive information stored on our servers is encrypted using industry-standard encryption algorithms, making it inaccessible even in the event of a breach."
            }
          ]
        },
        {
          "kind": "p",
          "text": "We implement strict access control measures to ensure that only authorized personnel can access your data:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Role-Based Access",
              "text": "Access to sensitive information is restricted based on job roles and responsibilities. Only employees who need access to your data to perform their duties are granted permission."
            },
            {
              "label": "Multi-Factor Authentication (MFA)",
              "text": "Our internal systems require multi-factor authentication to prevent unauthorized access."
            },
            {
              "label": "Audit Trails",
              "text": "We maintain detailed logs of all access and actions performed on user data to monitor for unauthorized activity."
            }
          ]
        },
        {
          "kind": "p",
          "text": "As a blockchain-based platform, Afram leverages the inherent security features of blockchain technology:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Immutability",
              "text": "Transactions recorded on the blockchain are immutable, meaning they cannot be altered or tampered with once confirmed."
            },
            {
              "label": "Decentralization",
              "text": "The decentralized nature of blockchain ensures that no single point of failure exists, reducing the risk of data breaches."
            },
            {
              "label": "Cryptographic Security",
              "text": "Blockchain transactions are secured using cryptographic algorithms, ensuring that only authorized parties can access transaction details."
            }
          ]
        },
        {
          "kind": "p",
          "text": "To ensure the ongoing security of our systems, we conduct regular security audits and assessments:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Internal Audits",
              "text": "Our in-house security team performs routine checks to identify and address potential vulnerabilities."
            },
            {
              "label": "Compliance Reviews",
              "text": "We regularly review our practices to ensure compliance with Ghanaian laws, such as the Data Protection Act (Act 843), and international standards."
            }
          ]
        },
        {
          "kind": "p",
          "text": "We adhere to the principle of data minimization by collecting only the information necessary for specific purposes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We avoid storing unnecessary data that could increase risk exposure."
            },
            {
              "text": "Personal data is anonymized or pseudonymized wherever possible to reduce its sensitivity."
            }
          ]
        },
        {
          "kind": "p",
          "text": "Our data storage infrastructure is designed with multiple layers of protection:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Firewalls",
              "text": "Our servers are protected by firewalls that prevent unauthorized access."
            },
            {
              "label": "Data Backup",
              "text": "We maintain regular backups of critical data in secure locations to ensure recovery in case of an incident."
            },
            {
              "label": "Data Segmentation",
              "text": "Sensitive information is stored separately from less critical data to limit exposure in case of a breach."
            }
          ]
        },
        {
          "kind": "p",
          "text": "We train our employees on best practices for data protection and cybersecurity:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "Employees undergo regular training on recognizing phishing attempts, handling sensitive information, and adhering to security protocols."
            },
            {
              "text": "All staff members are required to sign confidentiality agreements as part of their employment contracts."
            }
          ]
        },
        {
          "kind": "p",
          "text": "In the unlikely event of a security breach, Afram has a comprehensive incident response plan in place:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Immediate Containment",
              "text": "Steps are taken immediately to contain and mitigate the impact of the breach."
            },
            {
              "label": "Notification",
              "text": "Affected users will be promptly notified if their personal data has been compromised."
            },
            {
              "label": "Investigation",
              "text": "A thorough investigation will be conducted to determine the cause of the breach and prevent future occurrences."
            },
            {
              "label": "Reporting",
              "text": "Any incidents will be reported to relevant authorities in accordance with Ghanaian laws."
            }
          ]
        },
        {
          "kind": "p",
          "text": "While we take extensive measures to protect your data, users also play an important role in maintaining security:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "Keep your login credentials confidential and avoid sharing them with others."
            },
            {
              "text": "Use strong passwords and enable two-factor authentication (2FA) for added security."
            },
            {
              "text": "Be cautious about phishing scams or fraudulent communications claiming to be from Afram."
            }
          ]
        },
        {
          "kind": "p",
          "text": "Our data security practices comply with Ghana's Data Protection Act (Act 843) and other relevant regulations:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We ensure that all personal data is processed securely and in accordance with legal requirements."
            },
            {
              "text": "Regular compliance checks are conducted to align with evolving laws and standards."
            }
          ]
        },
        {
          "kind": "p",
          "text": "The cybersecurity landscape is constantly evolving, and so are our efforts to stay ahead of potential threats. We continuously monitor advancements in technology and update our security measures accordingly."
        }
      ]
    },
    {
      "id": "data-retention",
      "title": "Data Retention",
      "blocks": [
        {
          "kind": "p",
          "text": "At Afram, we are committed to ensuring that your personal data is retained only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by applicable laws and regulations in Ghana. This approach ensures that we comply with legal obligations while also respecting your privacy rights."
        },
        {
          "kind": "h3",
          "text": "Purposes for Data Retention"
        },
        {
          "kind": "p",
          "text": "We retain personal data for several key purposes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Service Provision",
              "text": "To provide and maintain our services related to the transfer of real assets through blockchain and tokenization."
            },
            {
              "label": "Compliance with Legal Obligations",
              "text": "To comply with Ghanaian laws, including those related to financial transactions, anti-money laundering (AML), and know-your-customer (KYC) regulations."
            },
            {
              "label": "Customer Support",
              "text": "To provide ongoing support and assistance with transactions and other inquiries."
            },
            {
              "label": "Improvement of Services",
              "text": "To analyze usage patterns and improve our services."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Criteria for Determining Retention Periods"
        },
        {
          "kind": "p",
          "text": "The retention period for your personal data is determined based on the following criteria:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "We comply with statutory retention periods as mandated by Ghanaian laws and regulations."
            },
            {
              "text": "Data is retained as long as it is necessary for the operational needs of our services."
            },
            {
              "text": "If you have entered into a contract with us, we may retain data for the duration of the contract and any applicable post-contractual obligations."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Specific Retention Periods"
        },
        {
          "kind": "p",
          "text": "Here are some specific examples of retention periods:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Transaction Data",
              "text": "Retained for at least five years after the transaction date to comply with financial regulations."
            },
            {
              "label": "Customer Information",
              "text": "Retained for as long as you maintain an active account with us, plus a reasonable period thereafter to handle any potential queries or legal obligations."
            },
            {
              "label": "Marketing Data",
              "text": "Retained until you opt-out or withdraw consent, unless there is another legal basis for processing."
            }
          ]
        },
        {
          "kind": "h3",
          "text": "Data Deletion"
        },
        {
          "kind": "p",
          "text": "Once the retention period expires, we ensure that your personal data is securely deleted or anonymized, unless there is a legal requirement to retain it for a longer period. We use secure methods to erase data, including encryption and secure deletion techniques."
        },
        {
          "kind": "h3",
          "text": "Compliance with Ghanaian Laws"
        },
        {
          "kind": "p",
          "text": "We adhere to the Data Protection Act of Ghana and other relevant laws that govern data retention. This includes ensuring that we comply with any specific requirements for data storage, security, and disposal."
        }
      ]
    },
    {
      "id": "your-rights",
      "title": "Your Rights",
      "blocks": [
        {
          "kind": "p",
          "text": "In accordance with the Data Protection Act of Ghana, you have certain rights regarding your personal data, including:"
        },
        {
          "kind": "group",
          "title": "The Right to Access and Receive a Copy of Your Personal Data",
          "blocks": [
            {
              "kind": "p",
              "text": "You have the right to request access to your personal data that we hold. This includes the right to know whether we are processing your personal data, what categories of data we have, the purposes of the processing, and who we share this data with. Upon request, we will provide you with a copy of your personal data in a structured, commonly used, and machine-readable format. This right allows you to understand how your data is being used and to verify that it is accurate."
            },
            {
              "kind": "label",
              "text": "How to Exercise This Right:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "Submit a request via email or through our website's contact form."
                },
                {
                  "text": "Provide identification to verify your identity."
                },
                {
                  "text": "Specify the data you wish to access."
                }
              ],
              "ordered": true
            }
          ]
        },
        {
          "kind": "group",
          "title": "The Right to Rectify Any Inaccurate or Incomplete Information",
          "blocks": [
            {
              "kind": "p",
              "text": "If you discover that any of the personal data we hold about you is incorrect or incomplete, you have the right to request that we correct or complete it. This ensures that your data remains accurate and up-to-date. We will make the necessary corrections as soon as possible after receiving your request."
            },
            {
              "kind": "label",
              "text": "How to Exercise This Right:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "Contact us via email or through our website."
                },
                {
                  "text": "Specify the data that needs correction or completion."
                },
                {
                  "text": "Provide evidence or documentation to support your request."
                }
              ],
              "ordered": true
            }
          ]
        },
        {
          "kind": "group",
          "title": "The Right to Request Deletion of Your Personal Data Under Certain Conditions",
          "blocks": [
            {
              "kind": "p",
              "text": "You have the right to request that we erase your personal data under specific circumstances. These include situations where:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "The data is no longer necessary for the purpose it was collected."
                },
                {
                  "text": "You withdraw your consent and there is no other legal basis for processing."
                },
                {
                  "text": "You object to the processing and there are no overriding legitimate grounds for the processing."
                },
                {
                  "text": "The data was processed unlawfully."
                },
                {
                  "text": "The data must be erased to comply with a legal obligation."
                }
              ]
            },
            {
              "kind": "label",
              "text": "How to Exercise This Right:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "Submit a request via email or through our website."
                },
                {
                  "text": "Specify the data you wish to have deleted."
                },
                {
                  "text": "Provide reasons for the deletion request."
                }
              ],
              "ordered": true
            }
          ]
        },
        {
          "kind": "group",
          "title": "The Right to Object to the Processing of Your Personal Data",
          "blocks": [
            {
              "kind": "p",
              "text": "You have the right to object to the processing of your personal data if it is based on our legitimate interests or those of a third party. This right also applies to profiling based on those interests. However, we may continue to process your data if we can demonstrate compelling legitimate grounds for the processing that override your interests, rights, and freedoms, or if the processing is for the establishment, exercise, or defense of legal claims."
            },
            {
              "kind": "label",
              "text": "How to Exercise This Right:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "Contact us via email or through our website."
                },
                {
                  "text": "Specify the processing activities you wish to object to."
                },
                {
                  "text": "Provide reasons for your objection."
                }
              ],
              "ordered": true
            }
          ]
        },
        {
          "kind": "group",
          "title": "The Right to Data Portability",
          "blocks": [
            {
              "kind": "p",
              "text": "You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller. This right applies when the processing is based on consent or a contract and is carried out by automated means. This allows you to move your data easily from one service provider to another."
            },
            {
              "kind": "label",
              "text": "How to Exercise This Right:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "Submit a request via email or through our website."
                },
                {
                  "text": "Specify the data you wish to transfer."
                },
                {
                  "text": "Provide details of the recipient (if applicable)."
                }
              ],
              "ordered": true
            }
          ]
        },
        {
          "kind": "group",
          "title": "The Right to Withdraw Consent Where Processing is Based on Consent",
          "blocks": [
            {
              "kind": "p",
              "text": "If we are processing your personal data based on your consent, you have the right to withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness of processing based on consent before its withdrawal. However, it means we will stop processing your data for the purposes for which consent was given unless there is another legal basis for the processing."
            },
            {
              "kind": "label",
              "text": "How to Exercise This Right:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "Contact us via email or through our website."
                },
                {
                  "text": "Specify the consent you wish to withdraw."
                },
                {
                  "text": "Confirm that you understand the implications of withdrawing consent."
                }
              ],
              "ordered": true
            }
          ]
        },
        {
          "kind": "p",
          "text": "For any of these rights, please contact us at:"
        },
        {
          "kind": "contact"
        },
        {
          "kind": "p",
          "text": "We will respond to your request within the timeframe required by law and provide any additional information needed to process your request."
        }
      ]
    },
    {
      "id": "changes-to-this-privacy-policy",
      "title": "Changes to This Privacy Policy",
      "blocks": [
        {
          "kind": "p",
          "text": "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and, where appropriate, through other communication channels. You are advised to review this Privacy Policy periodically for any changes."
        }
      ]
    },
    {
      "id": "contact-us",
      "title": "Contact Us",
      "blocks": [
        {
          "kind": "p",
          "text": "If you have any questions about this Privacy Policy or our data protection practices in Ghana, please contact us using the details provided above."
        }
      ]
    }
  ]
};

export const COOKIE_POLICY: LegalDocument = {
  "slug": "cookie-policy",
  "title": "Cookie Policy",
  "effective": "2025-01-27",
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "blocks": [
        {
          "kind": "p",
          "text": "At Afram, we use cookies and similar technologies to improve your experience on our platform, analyze usage patterns, and provide personalized services. This Cookie Policy explains what cookies are, how we use them, the types of cookies we employ, and how you can manage your cookie preferences. By using Afram’s services, you consent to the use of cookies as described in this policy."
        }
      ]
    },
    {
      "id": "what-are-cookies",
      "title": "What Are Cookies?",
      "blocks": [
        {
          "kind": "p",
          "text": "Cookies are small text files that are stored on your device (computer, tablet, or smartphone) when you visit a website. They help websites recognize your device and remember information about your visit, such as your preferences or login details. Cookies can be temporary (session cookies) or persistent (stored on your device until they expire or are deleted)."
        }
      ]
    },
    {
      "id": "why-we-use-cookies",
      "title": "Why We Use Cookies",
      "blocks": [
        {
          "kind": "p",
          "text": "Afram uses cookies for several purposes:"
        },
        {
          "kind": "list",
          "items": [
            {
              "label": "Enhancing User Experience",
              "text": "Cookies allow us to remember your preferences, such as language settings or previously visited pages, so you have a seamless experience."
            },
            {
              "label": "Functionality",
              "text": "Some cookies are essential for the operation of our platform, enabling features like secure logins and transaction processing."
            },
            {
              "label": "Performance Monitoring",
              "text": "Cookies help us understand how users interact with our platform by collecting data on page views, clicks, and other behaviors. This information allows us to optimize our services."
            },
            {
              "label": "Personalization",
              "text": "We use cookies to tailor content and recommendations based on your interests and previous activity on our platform."
            },
            {
              "label": "Security",
              "text": "Certain cookies are used to detect fraudulent activity and ensure the security of your account."
            },
            {
              "label": "Marketing and Advertising",
              "text": "Cookies help us deliver targeted advertisements that may be relevant to you."
            }
          ]
        }
      ]
    },
    {
      "id": "types-of-cookies-we-use",
      "title": "Types of Cookies We Use",
      "blocks": [
        {
          "kind": "p",
          "text": "Afram employs the following types of cookies:"
        },
        {
          "kind": "cards",
          "items": [
            {
              "title": "Essential Cookies",
              "text": "These cookies are necessary for the basic functionality of our platform. Without them, certain features—such as secure logins or tokenized asset transactions—may not work properly.",
              "icon": "lock"
            },
            {
              "title": "Performance Cookies",
              "text": "Performance cookies collect anonymous data about how users interact with our platform. This includes information like page load times, error messages, and navigation patterns. These cookies help us identify areas for improvement.",
              "icon": "gauge"
            },
            {
              "title": "Functional Cookies",
              "text": "Functional cookies enable us to remember your preferences and settings, such as language choices or login credentials (if you opt to save them). These cookies enhance usability and convenience.",
              "icon": "sliders"
            },
            {
              "title": "Analytics Cookies",
              "text": "Analytics cookies allow us to track user behavior on our platform using tools like Google Analytics or similar services. The data collected helps us understand usage trends and improve our services.",
              "icon": "chart"
            },
            {
              "title": "Advertising Cookies",
              "text": "Advertising cookies are used to deliver personalized ads based on your browsing history and interactions with our platform. These cookies may also track the effectiveness of advertising campaigns.",
              "icon": "megaphone"
            },
            {
              "title": "Third-Party Cookies",
              "text": "Some third-party services integrated into Afram’s platform—such as payment processors or social media plugins—may place cookies on your device. These cookies are governed by the privacy policies of the respective third parties.",
              "icon": "puzzle"
            }
          ]
        }
      ]
    },
    {
      "id": "how-we-manage-cookies",
      "title": "How We Manage Cookies",
      "blocks": [
        {
          "kind": "p",
          "text": "We believe in giving you control over how cookies are used on your device. You can manage your cookie preferences in several ways:"
        },
        {
          "kind": "group",
          "title": "Browser Settings",
          "blocks": [
            {
              "kind": "p",
              "text": "Most browsers allow you to block or delete cookies through their settings menu:"
            },
            {
              "kind": "list",
              "items": [
                {
                  "text": "You can choose to accept all cookies, reject all cookies, or customize cookie preferences."
                },
                {
                  "text": "Blocking certain types of cookies may impact the functionality of Afram’s platform."
                }
              ]
            }
          ]
        },
        {
          "kind": "group",
          "title": "Cookie Consent Banner",
          "blocks": [
            {
              "kind": "p",
              "text": "When you first visit Afram’s website or platform, you will see a cookie consent banner that allows you to accept or reject non-essential cookies."
            }
          ]
        },
        {
          "kind": "group",
          "title": "Third-Party Tools",
          "blocks": [
            {
              "kind": "p",
              "text": "Some third-party tools allow you to manage tracking technologies across multiple websites (e.g., opt-out tools provided by advertising networks)."
            }
          ]
        }
      ]
    },
    {
      "id": "your-rights-regarding-cookies",
      "title": "Your Rights Regarding Cookies",
      "blocks": [
        {
          "kind": "p",
          "text": "Under Ghana’s Data Protection Act (Act 843), you have certain rights regarding the use of tracking technologies:"
        },
        {
          "kind": "list",
          "items": [
            {
              "text": "You have the right to be informed about the use of cookies."
            },
            {
              "text": "You have the right to opt-out of non-essential cookies."
            },
            {
              "text": "You have the right to request information about how data collected via cookies is processed."
            }
          ]
        },
        {
          "kind": "p",
          "text": "To exercise these rights or for assistance managing cookie preferences, please contact us at:"
        },
        {
          "kind": "contact"
        }
      ]
    },
    {
      "id": "updates-to-this-cookie-policy",
      "title": "Updates to This Cookie Policy",
      "blocks": [
        {
          "kind": "p",
          "text": "We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices. Any updates will be posted on this page with an updated effective date."
        },
        {
          "kind": "p",
          "text": "We encourage you to review this policy periodically so that you remain informed about how we use cookies and other tracking technologies."
        },
        {
          "kind": "p",
          "text": "For further inquiries regarding our Cookie Policy or privacy practices in general, please contact us using the details provided above."
        }
      ]
    }
  ]
};

export const LEGAL_DOCUMENTS = { privacy: PRIVACY_POLICY, "cookie-policy": COOKIE_POLICY } as const;

/** Words in a document, for "n min read". */
export function readingMinutes(doc: LegalDocument): number {
  const words = (blocks: LegalBlock[]): number =>
    blocks.reduce((n, b) => {
      if (b.kind === "p" || b.kind === "h3" || b.kind === "label") return n + b.text.split(/\s+/).length;
      if (b.kind === "list") return n + b.items.reduce((m, i) => m + `${i.label ?? ""} ${i.text}`.split(/\s+/).length, 0);
      if (b.kind === "cards") return n + b.items.reduce((m, i) => m + `${i.title} ${i.text}`.split(/\s+/).length, 0);
      if (b.kind === "group") return n + words(b.blocks);
      return n;
    }, 0);
  const total = doc.sections.reduce((n, s) => n + words(s.blocks), 0);
  return Math.max(1, Math.round(total / 220));
}
