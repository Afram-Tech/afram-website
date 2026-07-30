export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Any: { input: any; output: any };
  Date: { input: string; output: string };
  DateTime: { input: any; output: any };
  Int64: { input: any; output: any };
  JSON: { input: Record<string, any>; output: Record<string, any> };
  JSONObject: { input: any; output: any };
  Money: { input: any; output: any };
  Token: { input: any; output: any };
};

export type AcceptOfferRequestInput = {
  loanId?: InputMaybe<Scalars["String"]["input"]>;
  termSheetType: TermSheetType;
  transactionRefNo?: InputMaybe<Scalars["String"]["input"]>;
};

export type AddParticipantInput = {
  conversationId: Scalars["ID"]["input"];
  participant: ParticipantInput;
  userId: Scalars["ID"]["input"];
};

export type AddUserForPushInput = {
  pushToken?: InputMaybe<Scalars["String"]["input"]>;
  userId: Scalars["String"]["input"];
};

export type AdminDashboardSummary = {
  __typename?: "AdminDashboardSummary";
  activeCount: Scalars["Int"]["output"];
  completedCount: Scalars["Int"]["output"];
  overdueCount: Scalars["Int"]["output"];
  paidCount: Scalars["Int"]["output"];
  totalAmount: Scalars["Float"]["output"];
  totalTransactions: Scalars["Int"]["output"];
};

export type ApprovalStatus = "approved" | "declined" | "pending";

export type Assessment = {
  __typename?: "Assessment";
  activatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  alerts?: Maybe<Array<AssessmentAlertSnapshot>>;
  applicantUserId: Scalars["ID"]["output"];
  applicationId: Scalars["String"]["output"];
  categoryScores?: Maybe<Scalars["JSONObject"]["output"]>;
  compositeScore?: Maybe<Scalars["Float"]["output"]>;
  consentGivenAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  declarationGivenAt?: Maybe<Scalars["DateTime"]["output"]>;
  documents: Array<AssessmentDocument>;
  financierShareGrants: Array<AssessmentFinancierShareGrant>;
  id: Scalars["ID"]["output"];
  officerId?: Maybe<Scalars["ID"]["output"]>;
  officerNotes?: Maybe<Scalars["String"]["output"]>;
  readinessBandCode?: Maybe<Scalars["String"]["output"]>;
  responses: Array<AssessmentResponse>;
  scoredAt?: Maybe<Scalars["DateTime"]["output"]>;
  status: AssessmentStatus;
  subjectEntity?: Maybe<Entity>;
  subjectEntityId?: Maybe<Scalars["ID"]["output"]>;
  submittedAt?: Maybe<Scalars["DateTime"]["output"]>;
  template?: Maybe<AssessmentTemplate>;
  templateId: Scalars["ID"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type AssessmentAlertOperator = "eq" | "gt" | "gte" | "in" | "lt" | "lte" | "neq";

export type AssessmentAlertRule = {
  __typename?: "AssessmentAlertRule";
  code: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  message: Scalars["String"]["output"];
  operator: AssessmentAlertOperator;
  severity: AssessmentAlertSeverity;
  templateId: Scalars["ID"]["output"];
  threshold: Scalars["JSONObject"]["output"];
  triggerQuestionCode: Scalars["String"]["output"];
};

export type AssessmentAlertRuleFilter = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentAlertSeverity = "critical" | "info" | "ok" | "warn";

export type AssessmentAlertSnapshot = {
  __typename?: "AssessmentAlertSnapshot";
  code: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
  severity: AssessmentAlertSeverity;
};

export type AssessmentAnswerType =
  | "boolean"
  | "currency_ghs"
  | "date"
  | "multi_select"
  | "number"
  | "percentage"
  | "single_select"
  | "text"
  | "years";

export type AssessmentCategory = {
  __typename?: "AssessmentCategory";
  code: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  displayOrder: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  label: Scalars["String"]["output"];
  questions: Array<AssessmentQuestion>;
  templateId: Scalars["ID"]["output"];
  weight: Scalars["Float"]["output"];
};

export type AssessmentCategoryFilter = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentDocument = {
  __typename?: "AssessmentDocument";
  assessmentId: Scalars["ID"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentCode: Scalars["String"]["output"];
  /** @deprecated Renamed to fileUrl — this holds the document's storage URL, not a UUID. */
  fileId?: Maybe<Scalars["ID"]["output"]>;
  /** Storage (e.g. Firebase) download URL of the uploaded document. */
  fileUrl?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  notes?: Maybe<Scalars["String"]["output"]>;
  requirement: AssessmentDocumentRequirement;
  status: AssessmentDocumentStatus;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  uploadedAt?: Maybe<Scalars["DateTime"]["output"]>;
  verifiedAt?: Maybe<Scalars["DateTime"]["output"]>;
  verifiedBy?: Maybe<Scalars["ID"]["output"]>;
};

export type AssessmentDocumentFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  documentCode?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  status?: InputMaybe<AssessmentDocumentStatusOperator>;
};

export type AssessmentDocumentRequirement =
  "advisory" | "financier" | "if_applicable" | "mandatory";

export type AssessmentDocumentStatus =
  "not_applicable" | "pending" | "rejected" | "uploaded" | "verified";

export type AssessmentDocumentStatusOperator = {
  eq?: InputMaybe<AssessmentDocumentStatus>;
  in?: InputMaybe<Array<AssessmentDocumentStatus>>;
};

export type AssessmentEntryState = {
  __typename?: "AssessmentEntryState";
  activeAssessment?: Maybe<Assessment>;
  inProgressAssessment?: Maybe<Assessment>;
  latestTemplate?: Maybe<AssessmentTemplate>;
};

export type AssessmentFilter = {
  applicantUserId?: InputMaybe<IdOperator>;
  applicationId?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  officerId?: InputMaybe<IdOperator>;
  status?: InputMaybe<AssessmentStatusOperator>;
  subjectEntityId?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentFinancierShareGrant = {
  __typename?: "AssessmentFinancierShareGrant";
  assessmentId: Scalars["ID"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  expiresAt?: Maybe<Scalars["DateTime"]["output"]>;
  financierEntityId: Scalars["ID"]["output"];
  grantedAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  revokedAt?: Maybe<Scalars["DateTime"]["output"]>;
  scope: AssessmentFinancierShareScope;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type AssessmentFinancierShareGrantFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  financierEntityId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
};

export type AssessmentFinancierShareScope = "financing_request" | "profile_only";

export type AssessmentPlatformRole = "agent" | "buyer" | "financier" | "issuer";

export type AssessmentPlatformRoleOperator = {
  eq?: InputMaybe<AssessmentPlatformRole>;
  in?: InputMaybe<Array<AssessmentPlatformRole>>;
};

export type AssessmentQuestion = {
  __typename?: "AssessmentQuestion";
  answerType: AssessmentAnswerType;
  categoryId?: Maybe<Scalars["ID"]["output"]>;
  code: Scalars["String"]["output"];
  displayOrder: Scalars["Int"]["output"];
  guidance?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isKycAutofill: Scalars["Boolean"]["output"];
  isRequired: Scalars["Boolean"]["output"];
  isScored: Scalars["Boolean"]["output"];
  kycSourceField?: Maybe<Scalars["String"]["output"]>;
  options: Array<AssessmentQuestionOption>;
  prompt: Scalars["String"]["output"];
  retiredAt?: Maybe<Scalars["DateTime"]["output"]>;
  scoringBands: Array<AssessmentScoringBand>;
  scoringLogicText?: Maybe<Scalars["String"]["output"]>;
  templateId: Scalars["ID"]["output"];
  unit?: Maybe<Scalars["String"]["output"]>;
  verification?: Maybe<Scalars["String"]["output"]>;
  weight: Scalars["Float"]["output"];
};

export type AssessmentQuestionFilter = {
  categoryId?: InputMaybe<IdOperator>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentQuestionOption = {
  __typename?: "AssessmentQuestionOption";
  code: Scalars["String"]["output"];
  displayOrder: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  label: Scalars["String"]["output"];
  questionId: Scalars["ID"]["output"];
  score: Scalars["Int"]["output"];
};

export type AssessmentQuestionOptionFilter = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  questionId?: InputMaybe<IdOperator>;
};

export type AssessmentReadinessBand = {
  __typename?: "AssessmentReadinessBand";
  action?: Maybe<Scalars["String"]["output"]>;
  code: Scalars["String"]["output"];
  displayOrder: Scalars["Int"]["output"];
  guidance?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  label: Scalars["String"]["output"];
  maxScore: Scalars["Int"]["output"];
  minScore: Scalars["Int"]["output"];
  templateId: Scalars["ID"]["output"];
};

export type AssessmentReadinessBandFilter = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentResponse = {
  __typename?: "AssessmentResponse";
  assessmentId: Scalars["ID"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  questionCode: Scalars["String"]["output"];
  questionId: Scalars["ID"]["output"];
  score?: Maybe<Scalars["Int"]["output"]>;
  scoredByRuleId?: Maybe<Scalars["ID"]["output"]>;
  selectedOptionIds?: Maybe<Array<Scalars["ID"]["output"]>>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  valueBoolean?: Maybe<Scalars["Boolean"]["output"]>;
  valueDate?: Maybe<Scalars["Date"]["output"]>;
  valueNumber?: Maybe<Scalars["Float"]["output"]>;
  valueText?: Maybe<Scalars["String"]["output"]>;
  weightedScore?: Maybe<Scalars["Float"]["output"]>;
};

export type AssessmentResponseFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  questionCode?: InputMaybe<Scalars["String"]["input"]>;
  questionId?: InputMaybe<IdOperator>;
};

export type AssessmentScoreResult = {
  __typename?: "AssessmentScoreResult";
  alerts: Array<AssessmentAlertSnapshot>;
  categoryScores: Scalars["JSONObject"]["output"];
  compositeScore: Scalars["Float"]["output"];
  readinessBandCode?: Maybe<Scalars["String"]["output"]>;
};

export type AssessmentScoringBand = {
  __typename?: "AssessmentScoringBand";
  displayOrder: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  maxValue?: Maybe<Scalars["Float"]["output"]>;
  minValue?: Maybe<Scalars["Float"]["output"]>;
  questionId: Scalars["ID"]["output"];
  score: Scalars["Int"]["output"];
};

export type AssessmentScoringBandFilter = {
  id?: InputMaybe<IdOperator>;
  questionId?: InputMaybe<IdOperator>;
};

export type AssessmentStatus =
  "activated" | "archived" | "draft" | "officer_review" | "returned" | "submitted";

export type AssessmentStatusOperator = {
  eq?: InputMaybe<AssessmentStatus>;
  in?: InputMaybe<Array<AssessmentStatus>>;
};

export type AssessmentSubjectType = "entity" | "user";

export type AssessmentSubjectTypeOperator = {
  eq?: InputMaybe<AssessmentSubjectType>;
  in?: InputMaybe<Array<AssessmentSubjectType>>;
};

export type AssessmentTemplate = {
  __typename?: "AssessmentTemplate";
  alertRules: Array<AssessmentAlertRule>;
  categories: Array<AssessmentCategory>;
  code: Scalars["String"]["output"];
  consentText?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  declarationText?: Maybe<Scalars["String"]["output"]>;
  history: Array<AssessmentTemplateHistory>;
  id: Scalars["ID"]["output"];
  legalNotice?: Maybe<Scalars["String"]["output"]>;
  maxScorePerParameter: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  platformRole: AssessmentPlatformRole;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  questions: Array<AssessmentQuestion>;
  readinessBands: Array<AssessmentReadinessBand>;
  status: AssessmentTemplateStatus;
  subjectType: AssessmentSubjectType;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  version: Scalars["String"]["output"];
};

export type AssessmentTemplateFilter = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<IdOperator>;
  platformRole?: InputMaybe<AssessmentPlatformRoleOperator>;
  status?: InputMaybe<AssessmentTemplateStatusOperator>;
  subjectType?: InputMaybe<AssessmentSubjectTypeOperator>;
  version?: InputMaybe<Scalars["String"]["input"]>;
};

export type AssessmentTemplateHistory = {
  __typename?: "AssessmentTemplateHistory";
  action: AssessmentTemplateHistoryAction;
  actorEmail?: Maybe<Scalars["String"]["output"]>;
  actorId?: Maybe<Scalars["String"]["output"]>;
  actorType?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  fromStatus?: Maybe<AssessmentTemplateStatus>;
  id: Scalars["ID"]["output"];
  templateId: Scalars["ID"]["output"];
  toStatus: AssessmentTemplateStatus;
};

export type AssessmentTemplateHistoryAction =
  "created" | "published" | "reactivated" | "retired" | "updated";

export type AssessmentTemplateStatus = "active" | "draft" | "retired";

export type AssessmentTemplateStatusOperator = {
  eq?: InputMaybe<AssessmentTemplateStatus>;
  in?: InputMaybe<Array<AssessmentTemplateStatus>>;
};

export type AssetValueSnapshot = {
  __typename?: "AssetValueSnapshot";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  ownerId: Scalars["ID"]["output"];
  properties?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  timestamp: Scalars["DateTime"]["output"];
  totalValue: Scalars["Float"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  valueByPropertyType?: Maybe<Scalars["JSONObject"]["output"]>;
  valueByRegion?: Maybe<Scalars["JSONObject"]["output"]>;
  valueByStatus?: Maybe<Scalars["JSONObject"]["output"]>;
};

export type AssetValueSnapshotFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type AuditLog = {
  __typename?: "AuditLog";
  action: Scalars["String"]["output"];
  actorEmail?: Maybe<Scalars["String"]["output"]>;
  actorId?: Maybe<Scalars["ID"]["output"]>;
  actorType?: Maybe<Scalars["String"]["output"]>;
  changes?: Maybe<Scalars["JSONObject"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  entity: Scalars["String"]["output"];
  entityId?: Maybe<Scalars["String"]["output"]>;
  errorMessage?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  status: AuditLogStatus;
};

export type AuditLogFilter = {
  action?: InputMaybe<StringOperator>;
  actorEmail?: InputMaybe<StringOperator>;
  actorId?: InputMaybe<IdOperator>;
  actorType?: InputMaybe<StringOperator>;
  createdAt?: InputMaybe<DateOperator>;
  entity?: InputMaybe<StringOperator>;
  entityId?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  status?: InputMaybe<AuditLogStatus>;
};

export type AuditLogStatus = "FAILURE" | "SUCCESS";

/**
 * Tokens are absent when `mfaRequired` is true: the caller must exchange the
 * emailed OTP via `verifyLoginOtp` to obtain a session.
 */
export type AuthPayload = {
  __typename?: "AuthPayload";
  accessToken?: Maybe<Scalars["String"]["output"]>;
  /** Masked address the OTP was sent to, e.g. `jo***@example.com`. */
  email?: Maybe<Scalars["String"]["output"]>;
  message?: Maybe<Scalars["String"]["output"]>;
  /** True when the account has 2FA enabled and an OTP has been emailed. */
  mfaRequired?: Maybe<Scalars["Boolean"]["output"]>;
  refreshToken?: Maybe<Scalars["String"]["output"]>;
  user?: Maybe<User>;
  /** Present only on an MFA challenge; pass back to `verifyLoginOtp`. */
  userId?: Maybe<Scalars["ID"]["output"]>;
};

export type BankDetailInput = {
  accountName: Scalars["String"]["input"];
  accountNumber: Scalars["String"]["input"];
  accountType?: InputMaybe<Scalars["String"]["input"]>;
  bankBranch?: InputMaybe<Scalars["String"]["input"]>;
  bankName: Scalars["String"]["input"];
  swiftCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type BondSubType = "FLOATING_RATE" | "PLAIN_VANILLA" | "ZERO_COUPON";

export type BooleanOperator = {
  eq?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** A borrower-raised request against a loan (review-window banner + lender alerts panel). */
export type BorrowerLoanRequest = {
  __typename?: "BorrowerLoanRequest";
  borrowerName: Scalars["String"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  /** The StatusDeclaration being queried, when kind = declaration_review. */
  declarationId?: Maybe<Scalars["ID"]["output"]>;
  /** Optional supporting-file URL. */
  doc?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  kind: LoanRequestKind;
  loanId?: Maybe<Scalars["ID"]["output"]>;
  offerRequestId: Scalars["ID"]["output"];
  reason?: Maybe<Scalars["String"]["output"]>;
  status: LoanRequestStatus;
};

export type BulkCreatePreTokenizedUnitsResponse = {
  __typename?: "BulkCreatePreTokenizedUnitsResponse";
  created: Scalars["Int"]["output"];
  success: Scalars["Boolean"]["output"];
  units: Array<PreTokenizedUnit>;
};

export type BulkUpdatePreTokenizedUnitsResponse = {
  __typename?: "BulkUpdatePreTokenizedUnitsResponse";
  success: Scalars["Boolean"]["output"];
  updated: Scalars["Int"]["output"];
};

export type BuyerProject = {
  __typename?: "BuyerProject";
  buyerId: Scalars["ID"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  depositAmount?: Maybe<Scalars["Float"]["output"]>;
  id: Scalars["ID"]["output"];
  isArchived?: Maybe<Scalars["Boolean"]["output"]>;
  propertyId: Scalars["ID"]["output"];
  status: Scalars["String"]["output"];
  tokensOwned?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type BuyerProjectFilter = {
  buyerId?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

/**
 * The caller's own property holdings as a buyer, split into two sections:
 * `inProgress` (a loan taken for the property is still being disbursed/repaid)
 * and `owned` (financing discharged/closed, or paid outright in cash).
 */
export type BuyerPropertyHoldings = {
  __typename?: "BuyerPropertyHoldings";
  inProgress: Array<Property>;
  owned: Array<Property>;
};

/** The 6-stage cash-purchase lifecycle. Values match the frontend's cash-purchase-stages.ts. */
export type CashPurchaseStage =
  | "closed"
  | "deposit_verified"
  | "request_submitted"
  | "sale_agreement_pending"
  | "sale_agreement_signed"
  | "settlement_pending";

export type CashPurchaseTxn = {
  __typename?: "CashPurchaseTxn";
  balanceDue: Scalars["Float"]["output"];
  /** The buyer paying with personal funds. */
  buyer?: Maybe<User>;
  /** The buyer's signature. Recorded first; does not execute the agreement. */
  buyerSignature?: Maybe<SpaSignature>;
  createdAt: Scalars["String"]["output"];
  currency: Scalars["String"]["output"];
  depositAmount: Scalars["Float"]["output"];
  /** The reference the buyer quotes when transferring the 10% deposit. */
  depositReference: Scalars["String"]["output"];
  events: Array<CashStageEvent>;
  id: Scalars["ID"]["output"];
  /** The issuer selling the unit — the counterparty on the issuer tracker. */
  issuer?: Maybe<Entity>;
  /** The issuer's countersignature — the final, executing signature. */
  issuerSignature?: Maybe<SpaSignature>;
  /**
   * The PERSONAL_FUNDS offer request this purchase realizes. Use it to reach the
   * offer-request-anchored surfaces (documents, holdings) for this deal.
   */
  offerRequestId?: Maybe<Scalars["ID"]["output"]>;
  /**
   * The parent portfolio's display name. Kept on the transaction because
   * Property.portfolio is only populated by the listing brokers.
   */
  projectName?: Maybe<Scalars["String"]["output"]>;
  /** The unit being bought. Read live off the properties table, never a snapshot. */
  property?: Maybe<Property>;
  /** Human-facing code, e.g. AFR-CASH-2026-1234 — display this, route on `id`. */
  reference: Scalars["String"]["output"];
  /** When the agreement was sent to the buyer for signature. */
  saleAgreementSentAt?: Maybe<Scalars["String"]["output"]>;
  /** Null until the issuer uploads an agreement. */
  saleAgreementStatus?: Maybe<SaleAgreementStatus>;
  /**
   * The unsigned SPA the issuer uploaded. Null for the buyer while
   * `saleAgreementStatus` is `draft` — the draft is issuer-only until it is sent.
   */
  saleAgreementUrl?: Maybe<Scalars["String"]["output"]>;
  /** Counts reissues — 1 for the first round, incremented on every reissue. */
  saleAgreementVersion: Scalars["Int"]["output"];
  /** Only present once the balance payment has been confirmed by the bank. */
  settlement?: Maybe<CashSettlement>;
  /** The deadline the issuer set at send time, if any. */
  signingDeadline?: Maybe<Scalars["String"]["output"]>;
  stage: CashPurchaseStage;
  status: Scalars["String"]["output"];
  /** Set at settlement; 1 token = GHS 1.00 at issuance. */
  tokensTransferred?: Maybe<Scalars["Float"]["output"]>;
  unitPrice: Scalars["Float"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type CashSettlement = {
  __typename?: "CashSettlement";
  amount: Scalars["Float"]["output"];
  method: Scalars["String"]["output"];
  paidAt: Scalars["String"]["output"];
  reference: Scalars["String"]["output"];
};

export type CashStageEvent = {
  __typename?: "CashStageEvent";
  actor: Scalars["String"]["output"];
  /** Null on the initial event. */
  fromStage?: Maybe<CashPurchaseStage>;
  id: Scalars["ID"]["output"];
  note: Scalars["String"]["output"];
  timestamp: Scalars["String"]["output"];
  toStage: CashPurchaseStage;
};

export type CheckLandInput = {
  boundary: Scalars["JSONObject"]["input"];
};

export type CompleteOnboardingInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  bankDetails?: InputMaybe<Array<BankDetailInput>>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  countryCode?: InputMaybe<Scalars["String"]["input"]>;
  defaultRole?: InputMaybe<Scalars["String"]["input"]>;
  digitalSignature?: InputMaybe<Scalars["String"]["input"]>;
  employer?: InputMaybe<Scalars["String"]["input"]>;
  entity?: InputMaybe<EntityProfileInput>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  gender?: InputMaybe<Scalars["String"]["input"]>;
  ghanaCard?: InputMaybe<IdentityDocumentInput>;
  gpsAddress?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  momoNumber?: InputMaybe<Scalars["String"]["input"]>;
  monthlyNetIncome?: InputMaybe<Scalars["Float"]["input"]>;
  occupation?: InputMaybe<Scalars["String"]["input"]>;
  passport?: InputMaybe<IdentityDocumentInput>;
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  profileImage?: InputMaybe<Scalars["String"]["input"]>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  streetAddress?: InputMaybe<Scalars["String"]["input"]>;
};

export type CompleteOnboardingPayload = {
  __typename?: "CompleteOnboardingPayload";
  accessToken?: Maybe<Scalars["String"]["output"]>;
  entity?: Maybe<Entity>;
  user: User;
};

export type ComplianceAdminSectionResponse = {
  __typename?: "ComplianceAdminSectionResponse";
  section?: Maybe<ComplianceSection>;
  success: Scalars["Boolean"]["output"];
};

export type ComplianceAdminSubmissionResponse = {
  __typename?: "ComplianceAdminSubmissionResponse";
  submission?: Maybe<ComplianceSubmission>;
  success: Scalars["Boolean"]["output"];
};

export type ComplianceAdminTemplateResponse = {
  __typename?: "ComplianceAdminTemplateResponse";
  success: Scalars["Boolean"]["output"];
  template?: Maybe<ComplianceDocumentTemplate>;
};

/**
 * A single entry in the compliance-specific audit trail. Distinct from the
 * platform-wide AuditLog: captures domain detail (submission status transitions,
 * reviewer/note diffs, who reviewed what). Append-only.
 */
export type ComplianceAuditEvent = {
  __typename?: "ComplianceAuditEvent";
  action: Scalars["String"]["output"];
  actorEmail?: Maybe<Scalars["String"]["output"]>;
  actorId?: Maybe<Scalars["String"]["output"]>;
  actorType?: Maybe<Scalars["String"]["output"]>;
  changes?: Maybe<Scalars["JSONObject"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  entity: Scalars["String"]["output"];
  entityId: Scalars["ID"]["output"];
  fromStatus?: Maybe<DocStatus>;
  id: Scalars["ID"]["output"];
  roleType?: Maybe<ComplianceRoleType>;
  subjectUserId?: Maybe<Scalars["ID"]["output"]>;
  submissionId?: Maybe<Scalars["ID"]["output"]>;
  toStatus?: Maybe<DocStatus>;
};

export type ComplianceAuditEventFilter = {
  action?: InputMaybe<StringOperator>;
  actorId?: InputMaybe<StringOperator>;
  actorType?: InputMaybe<StringOperator>;
  createdAt?: InputMaybe<DateOperator>;
  entity?: InputMaybe<StringOperator>;
  entityId?: InputMaybe<IdOperator>;
  fromStatus?: InputMaybe<DocStatusOperator>;
  id?: InputMaybe<IdOperator>;
  roleType?: InputMaybe<ComplianceRoleTypeOperator>;
  subjectUserId?: InputMaybe<IdOperator>;
  submissionId?: InputMaybe<IdOperator>;
  toStatus?: InputMaybe<DocStatusOperator>;
};

export type ComplianceDeleteResponse = {
  __typename?: "ComplianceDeleteResponse";
  message?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type ComplianceDismissResponse = {
  __typename?: "ComplianceDismissResponse";
  dismissed: Scalars["Boolean"]["output"];
  notificationId: Scalars["ID"]["output"];
  success: Scalars["Boolean"]["output"];
};

export type ComplianceDocItem = {
  __typename?: "ComplianceDocItem";
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastUpdated?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  note?: Maybe<Scalars["String"]["output"]>;
  required: Scalars["Boolean"]["output"];
  reviewer?: Maybe<Scalars["String"]["output"]>;
  status: DocStatus;
  templateId: Scalars["ID"]["output"];
};

export type ComplianceDocumentFilter = {
  required?: InputMaybe<BooleanOperator>;
  sectionKey?: InputMaybe<ComplianceSectionKeyOperator>;
  status?: InputMaybe<DocStatusOperator>;
};

export type ComplianceDocumentTemplate = {
  __typename?: "ComplianceDocumentTemplate";
  description: Scalars["String"]["output"];
  documentCode?: Maybe<Scalars["String"]["output"]>;
  gatedActions: Array<GatedAction>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  required: Scalars["Boolean"]["output"];
};

export type ComplianceDocumentsResponse = {
  __typename?: "ComplianceDocumentsResponse";
  sections: Array<ComplianceSection>;
  stats: ComplianceStats;
};

export type ComplianceFile = {
  __typename?: "ComplianceFile";
  fileName: Scalars["String"]["output"];
  fileSizeBytes: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  mimeType: Scalars["String"]["output"];
  storagePath: Scalars["String"]["output"];
  uploadedAt: Scalars["String"]["output"];
};

export type ComplianceNotification = {
  __typename?: "ComplianceNotification";
  action?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  message: Scalars["String"]["output"];
  type: ComplianceNotificationType;
};

export type ComplianceNotificationFilter = {
  dismissed?: InputMaybe<BooleanOperator>;
  id?: InputMaybe<IdOperator>;
  type?: InputMaybe<ComplianceNotificationType>;
};

export type ComplianceNotificationType = "info" | "success" | "warning";

export type ComplianceRoleType = "agent" | "buyer" | "financier" | "issuer";

export type ComplianceRoleTypeOperator = {
  eq?: InputMaybe<ComplianceRoleType>;
  in?: InputMaybe<Array<ComplianceRoleType>>;
};

export type ComplianceSection = {
  __typename?: "ComplianceSection";
  bg: Scalars["String"]["output"];
  color: Scalars["String"]["output"];
  docs: Array<ComplianceDocItem>;
  id: Scalars["ID"]["output"];
  key: ComplianceSectionKey;
  roleType: ComplianceRoleType;
  templates: Array<ComplianceDocumentTemplate>;
  title: Scalars["String"]["output"];
};

export type ComplianceSectionKey =
  | "agreements"
  | "company_reg"
  | "esg"
  | "financials"
  | "identity"
  | "legal_risk"
  | "ownership"
  | "property_insurance";

export type ComplianceSectionKeyOperator = {
  eq?: InputMaybe<ComplianceSectionKey>;
  in?: InputMaybe<Array<ComplianceSectionKey>>;
};

export type ComplianceStats = {
  __typename?: "ComplianceStats";
  missing: Scalars["Int"]["output"];
  overallPct: Scalars["Int"]["output"];
  requiredMissing: Scalars["Int"]["output"];
  submitted: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
  under_review: Scalars["Int"]["output"];
  verified: Scalars["Int"]["output"];
};

export type ComplianceSubmission = {
  __typename?: "ComplianceSubmission";
  createdAt: Scalars["String"]["output"];
  files: Array<ComplianceFile>;
  history: Array<ComplianceAuditEvent>;
  id: Scalars["ID"]["output"];
  lastUpdated?: Maybe<Scalars["String"]["output"]>;
  note?: Maybe<Scalars["String"]["output"]>;
  reviewer?: Maybe<Scalars["String"]["output"]>;
  roleType: ComplianceRoleType;
  status: DocStatus;
  template?: Maybe<ComplianceDocumentTemplate>;
  templateId: Scalars["ID"]["output"];
  updatedAt: Scalars["String"]["output"];
  user?: Maybe<ComplianceSubmissionUser>;
  userId: Scalars["ID"]["output"];
};

export type ComplianceSubmissionFilter = {
  id?: InputMaybe<IdOperator>;
  roleType?: InputMaybe<ComplianceRoleTypeOperator>;
  status?: InputMaybe<DocStatusOperator>;
  templateId?: InputMaybe<IdOperator>;
  userId?: InputMaybe<IdOperator>;
};

export type ComplianceSubmissionUser = {
  __typename?: "ComplianceSubmissionUser";
  email: Scalars["String"]["output"];
  firstName?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lastName?: Maybe<Scalars["String"]["output"]>;
  phoneNumber?: Maybe<Scalars["String"]["output"]>;
  profileImage?: Maybe<Scalars["String"]["output"]>;
};

export type ComplianceUploadResponse = {
  __typename?: "ComplianceUploadResponse";
  document?: Maybe<ComplianceUploadedDoc>;
  success: Scalars["Boolean"]["output"];
};

export type ComplianceUploadedDoc = {
  __typename?: "ComplianceUploadedDoc";
  fileName: Scalars["String"]["output"];
  fileSizeBytes: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  lastUpdated: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  status: DocStatus;
};

/**
 * A single condition-precedent line item (Act 9). Items are ad hoc — extracted from
 * the loan agreement — and recorded on the request's metadata. Disbursement is
 * blocked until every item is CONFIRMED or WAIVED.
 */
export type ConditionPrecedent = {
  __typename?: "ConditionPrecedent";
  /** Stable list ordering. */
  createdAt: Scalars["DateTime"]["output"];
  /** Optional sub-text under the title. */
  description?: Maybe<Scalars["String"]["output"]>;
  /** True if AI-extracted from the uploaded agreement / CP schedule. */
  extracted: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  /** The condition text (frontend title). */
  label: Scalars["String"]["output"];
  /** Which loan (offer request) this CP belongs to. */
  offerRequestId: Scalars["ID"]["output"];
  /** Waiver reason (present when WAIVED). */
  reason?: Maybe<Scalars["String"]["output"]>;
  /** When confirmed/waived — audit line. */
  resolvedAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** Borrower | Financier — gates who uploads evidence. */
  responsibleParty: ResponsibleParty;
  /** Who confirmed/waived (name or id) — audit line. */
  signedOffBy?: Maybe<Scalars["String"]["output"]>;
  status: ConditionPrecedentStatus;
  /** Display name for the supporting document. */
  supportingDocumentName?: Maybe<Scalars["String"]["output"]>;
  /** Evidence/attachment (borrower SUBMITTED, or financier CONFIRMED). */
  supportingDocumentUrl?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ConditionPrecedentStatus =
  /** Financier signed it off as satisfied. */
  | "CONFIRMED"
  /** Created, no action yet. */
  | "PENDING"
  /** Responsible party uploaded evidence, awaiting financier sign-off. */
  | "SUBMITTED"
  /** Financier elected to proceed without it (reason required). */
  | "WAIVED";

export type ConditionPrecedentStatusInput = {
  /** Optional sub-text under the title. */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** True if AI-extracted from the uploaded agreement / CP schedule. */
  extracted?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Existing item id, if updating one already recorded. */
  id?: InputMaybe<Scalars["ID"]["input"]>;
  /** Label to upsert by when no id is given (e.g. the CP text from the agreement). */
  label?: InputMaybe<Scalars["String"]["input"]>;
  /** Required when status is WAIVED. */
  reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Which party is responsible for satisfying this item. Required when creating a new item. */
  responsibleParty?: InputMaybe<ResponsibleParty>;
  status: ConditionPrecedentStatus;
  /** Display name for the supporting document. */
  supportingDocumentName?: InputMaybe<Scalars["String"]["input"]>;
  /** Supporting/evidence document for this item. */
  supportingDocumentUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type Construction = {
  __typename?: "Construction";
  civilContractor?: Maybe<Scalars["String"]["output"]>;
  insurance?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  leadArchitect?: Maybe<Scalars["String"]["output"]>;
  otherConsultants?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  procurementType?: Maybe<Scalars["String"]["output"]>;
  timelines?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  warranties?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
};

export type ConstructionInput = {
  civilContractor?: InputMaybe<Scalars["String"]["input"]>;
  insurance?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  leadArchitect?: InputMaybe<Scalars["String"]["input"]>;
  otherConsultants?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  procurementType?: InputMaybe<Scalars["String"]["input"]>;
  timelines?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  warranties?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ContactUsInput = {
  email: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  subject?: InputMaybe<Scalars["String"]["input"]>;
};

export type ContactUsResponse = {
  __typename?: "ContactUsResponse";
  message?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type Conversation = {
  __typename?: "Conversation";
  conversationKey?: Maybe<Scalars["String"]["output"]>;
  convoType?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  initialDeposit?: Maybe<Scalars["Float"]["output"]>;
  kind?: Maybe<ConversationKind>;
  lastMessageId?: Maybe<Scalars["ID"]["output"]>;
  offerRequestId?: Maybe<Scalars["ID"]["output"]>;
  parentConversation?: Maybe<Conversation>;
  parentConversationId?: Maybe<Scalars["ID"]["output"]>;
  participants?: Maybe<Scalars["JSONObject"]["output"]>;
  paymentStatus?: Maybe<ConversationPaymentStatus>;
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars["ID"]["output"]>;
  /** @deprecated Stale snapshot taken when the conversation was created. Use `property` (live) or `propertyId`. */
  propertyInfo?: Maybe<Scalars["JSONObject"]["output"]>;
  propertyValue?: Maybe<Scalars["Float"]["output"]>;
  referenceNumber?: Maybe<Scalars["String"]["output"]>;
  totalMessageCount?: Maybe<Scalars["Int"]["output"]>;
  transactionId?: Maybe<Scalars["String"]["output"]>;
  transferDocument?: Maybe<Scalars["String"]["output"]>;
  unreadCount?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ConversationFilter = {
  convoType?: InputMaybe<StringOperator>;
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  kind?: InputMaybe<ConversationKindOperator>;
  offerRequestId?: InputMaybe<IdOperator>;
  parentConversationId?: InputMaybe<IdOperator>;
  paymentStatus?: InputMaybe<ConversationPaymentStatusOperator>;
  referenceNumber?: InputMaybe<StringOperator>;
  transactionId?: InputMaybe<StringOperator>;
  updatedAt?: InputMaybe<DateOperator>;
};

export type ConversationKind = "DIRECT_CHAT" | "GROUP_CHAT";

export type ConversationKindOperator = {
  eq?: InputMaybe<ConversationKind>;
  in?: InputMaybe<Array<ConversationKind>>;
};

export type ConversationPaymentStatus = "failed" | "paid" | "pending" | "verifying";

export type ConversationPaymentStatusOperator = {
  eq?: InputMaybe<ConversationPaymentStatus>;
  in?: InputMaybe<Array<ConversationPaymentStatus>>;
};

export type Coordinates = {
  __typename?: "Coordinates";
  X?: Maybe<Scalars["Float"]["output"]>;
  Y?: Maybe<Scalars["Float"]["output"]>;
  bearing?: Maybe<Scalars["String"]["output"]>;
  distance?: Maybe<Scalars["Int"]["output"]>;
  from?: Maybe<Scalars["Int"]["output"]>;
  fromPt?: Maybe<Scalars["Int"]["output"]>;
  lat?: Maybe<Scalars["Float"]["output"]>;
  lng?: Maybe<Scalars["Float"]["output"]>;
  to?: Maybe<Scalars["Int"]["output"]>;
  toPt?: Maybe<Scalars["Int"]["output"]>;
};

export type CountryCode = "FR" | "GB" | "GH" | "NG" | "US" | "ZA";

export type CreateAdminConversationInput = {
  initialDeposit?: InputMaybe<Scalars["Float"]["input"]>;
  participants: Scalars["JSONObject"]["input"];
  referenceNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateAssessmentAlertRuleInput = {
  code: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  operator: AssessmentAlertOperator;
  severity?: InputMaybe<AssessmentAlertSeverity>;
  templateId: Scalars["ID"]["input"];
  threshold: Scalars["JSONObject"]["input"];
  triggerQuestionCode: Scalars["String"]["input"];
};

export type CreateAssessmentCategoryInput = {
  code: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  label: Scalars["String"]["input"];
  templateId: Scalars["ID"]["input"];
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type CreateAssessmentDocumentInput = {
  assessmentId: Scalars["ID"]["input"];
  documentCode: Scalars["String"]["input"];
  fileUrl?: InputMaybe<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  requirement?: InputMaybe<AssessmentDocumentRequirement>;
  status?: InputMaybe<AssessmentDocumentStatus>;
};

export type CreateAssessmentInput = {
  applicantUserId?: InputMaybe<Scalars["ID"]["input"]>;
  consentGivenAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  declarationGivenAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  subjectEntityId?: InputMaybe<Scalars["ID"]["input"]>;
  templateId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateAssessmentQuestionInput = {
  answerType: AssessmentAnswerType;
  categoryId?: InputMaybe<Scalars["ID"]["input"]>;
  code: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  guidance?: InputMaybe<Scalars["String"]["input"]>;
  isKycAutofill?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRequired?: InputMaybe<Scalars["Boolean"]["input"]>;
  isScored?: InputMaybe<Scalars["Boolean"]["input"]>;
  kycSourceField?: InputMaybe<Scalars["String"]["input"]>;
  prompt: Scalars["String"]["input"];
  scoringLogicText?: InputMaybe<Scalars["String"]["input"]>;
  templateId: Scalars["ID"]["input"];
  unit?: InputMaybe<Scalars["String"]["input"]>;
  verification?: InputMaybe<Scalars["String"]["input"]>;
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type CreateAssessmentQuestionOptionInput = {
  code: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  label: Scalars["String"]["input"];
  questionId: Scalars["ID"]["input"];
  score?: InputMaybe<Scalars["Int"]["input"]>;
};

export type CreateAssessmentReadinessBandInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  code: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  guidance?: InputMaybe<Scalars["String"]["input"]>;
  label: Scalars["String"]["input"];
  maxScore: Scalars["Int"]["input"];
  minScore: Scalars["Int"]["input"];
  templateId: Scalars["ID"]["input"];
};

export type CreateAssessmentScoringBandInput = {
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  maxValue?: InputMaybe<Scalars["Float"]["input"]>;
  minValue?: InputMaybe<Scalars["Float"]["input"]>;
  questionId: Scalars["ID"]["input"];
  score: Scalars["Int"]["input"];
};

export type CreateAssessmentTemplateInput = {
  code: Scalars["String"]["input"];
  consentText?: InputMaybe<Scalars["String"]["input"]>;
  declarationText?: InputMaybe<Scalars["String"]["input"]>;
  legalNotice?: InputMaybe<Scalars["String"]["input"]>;
  maxScorePerParameter?: InputMaybe<Scalars["Int"]["input"]>;
  name: Scalars["String"]["input"];
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  status?: InputMaybe<AssessmentTemplateStatus>;
  subjectType?: InputMaybe<AssessmentSubjectType>;
  version: Scalars["String"]["input"];
};

export type CreateAssetValueSnapshotInput = {
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  ownerId: Scalars["ID"]["input"];
  properties?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  timestamp: Scalars["DateTime"]["input"];
  totalValue: Scalars["Float"]["input"];
  valueByPropertyType?: InputMaybe<Scalars["JSONObject"]["input"]>;
  valueByRegion?: InputMaybe<Scalars["JSONObject"]["input"]>;
  valueByStatus?: InputMaybe<Scalars["JSONObject"]["input"]>;
};

export type CreateBareLandProjectInput = {
  additionalFiles?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  construction?: InputMaybe<Scalars["JSONObject"]["input"]>;
  gpsAddress?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  projectCost?: InputMaybe<Scalars["JSONObject"]["input"]>;
  projectDescription?: InputMaybe<Scalars["String"]["input"]>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  projectName: Scalars["String"]["input"];
  projectStatus?: InputMaybe<Scalars["String"]["input"]>;
  propertyTypes?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  readiness?: InputMaybe<Scalars["Int"]["input"]>;
  sharedAmenities?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  squareFeet?: InputMaybe<Scalars["Float"]["input"]>;
  streetAddress?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateBuyerProjectInput = {
  buyerId: Scalars["ID"]["input"];
  depositAmount?: InputMaybe<Scalars["Float"]["input"]>;
  isArchived?: InputMaybe<Scalars["Boolean"]["input"]>;
  propertyId: Scalars["ID"]["input"];
  status: Scalars["String"]["input"];
  tokensOwned?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateComplianceSectionInput = {
  bg: Scalars["String"]["input"];
  color: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  key: ComplianceSectionKey;
  roleType: ComplianceRoleType;
  title: Scalars["String"]["input"];
};

export type CreateComplianceTemplateInput = {
  description: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  documentCode?: InputMaybe<Scalars["String"]["input"]>;
  gatedActions?: InputMaybe<Array<GatedAction>>;
  name: Scalars["String"]["input"];
  required: Scalars["Boolean"]["input"];
  sectionId: Scalars["ID"]["input"];
};

export type CreateConversationInput = {
  convoType?: InputMaybe<Scalars["String"]["input"]>;
  initialDeposit?: InputMaybe<Scalars["Float"]["input"]>;
  kind?: InputMaybe<ConversationKind>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  parentConversationId?: InputMaybe<Scalars["ID"]["input"]>;
  participants: Scalars["JSONObject"]["input"];
  paymentStatus?: InputMaybe<ConversationPaymentStatus>;
  propertyInfo?: InputMaybe<Scalars["JSONObject"]["input"]>;
  propertyValue?: InputMaybe<Scalars["Float"]["input"]>;
  referenceNumber?: InputMaybe<Scalars["String"]["input"]>;
  shouldCreateInitialMessage?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type CreateDueDiligenceInput = {
  dueDiligenceInitiatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  dueDiligenceReportDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  dueDiligenceReportImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  dueDiligenceReportMessage?: InputMaybe<Scalars["String"]["input"]>;
  dueDiligenceStatus?: InputMaybe<DueDiligenceStatus>;
  legalDocuments?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyId: Scalars["ID"]["input"];
  updatedBy?: InputMaybe<Scalars["JSONObject"]["input"]>;
};

export type CreateEntityRoleInput = {
  badgeColor?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  permissions: Array<Scalars["String"]["input"]>;
};

export type CreateLandInput = {
  boundary: Scalars["JSONObject"]["input"];
};

export type CreateOfferInput = {
  acceptedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  availabilityPeriodDays?: InputMaybe<Scalars["Int"]["input"]>;
  bondSubType?: InputMaybe<BondSubType>;
  commitmentFeeRate?: InputMaybe<Scalars["Float"]["input"]>;
  conditions?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  covenants?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  depositPercentage?: InputMaybe<Scalars["Float"]["input"]>;
  drawdownSchedule?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  dsraMonths?: InputMaybe<Scalars["Int"]["input"]>;
  financierId: Scalars["ID"]["input"];
  interestRate?: InputMaybe<Scalars["JSONObject"]["input"]>;
  issuedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lenderName?: InputMaybe<Scalars["String"]["input"]>;
  loanSubType?: InputMaybe<LoanSubType>;
  loanTenor?: InputMaybe<Scalars["JSONObject"]["input"]>;
  loanType?: InputMaybe<LoanType>;
  ltv?: InputMaybe<Scalars["Float"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  moratorium?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  offerExpiryDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  offerStatus?: InputMaybe<OfferStatus>;
  otherFees?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  processingTimeline?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyName?: InputMaybe<Scalars["String"]["input"]>;
  rateType?: InputMaybe<RateType>;
  recipientId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<RepaymentFrequency>;
  repaymentType?: InputMaybe<RepaymentType>;
  revokedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  schedule?: InputMaybe<Scalars["JSONObject"]["input"]>;
  security?: InputMaybe<Scalars["JSONObject"]["input"]>;
  sources?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type CreateOfferRequestInput = {
  agreedAmount?: InputMaybe<Scalars["Float"]["input"]>;
  buyerId?: InputMaybe<Scalars["ID"]["input"]>;
  convoType?: InputMaybe<Scalars["String"]["input"]>;
  financierId?: InputMaybe<Scalars["ID"]["input"]>;
  initialDeposit?: InputMaybe<Scalars["Float"]["input"]>;
  issuerId?: InputMaybe<Scalars["ID"]["input"]>;
  modeOfFinancing: ModeOfFinancing;
  offer?: InputMaybe<Scalars["JSONObject"]["input"]>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  refNo?: InputMaybe<Scalars["String"]["input"]>;
  requestedAmount: Scalars["Float"]["input"];
  type?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePaymentScheduleInput = {
  conversationId: Scalars["ID"]["input"];
  createdForId?: InputMaybe<Scalars["ID"]["input"]>;
  interestRate?: InputMaybe<Scalars["Float"]["input"]>;
  loanId?: InputMaybe<Scalars["ID"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<Scalars["String"]["input"]>;
  repaymentTerms?: InputMaybe<Scalars["JSONObject"]["input"]>;
  totalInterest?: InputMaybe<Scalars["String"]["input"]>;
  totalRepayment?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePortfolioInput = {
  additionalFiles?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  construction?: InputMaybe<ConstructionInput>;
  constructionCommencementDate?: InputMaybe<Scalars["String"]["input"]>;
  epaPermitNumber?: InputMaybe<Scalars["String"]["input"]>;
  gpsAddress: Scalars["String"]["input"];
  grossDevelopmentValue?: InputMaybe<Scalars["Float"]["input"]>;
  landValuationAmount?: InputMaybe<Scalars["Float"]["input"]>;
  landValuer?: InputMaybe<Scalars["String"]["input"]>;
  listingObjective?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  planningPermitNumber?: InputMaybe<Scalars["String"]["input"]>;
  portfolioType: Scalars["String"]["input"];
  practicalCompletionDate?: InputMaybe<Scalars["String"]["input"]>;
  projectCost?: InputMaybe<ProjectCostInput>;
  projectDescription: Scalars["String"]["input"];
  projectImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  projectName?: InputMaybe<Scalars["String"]["input"]>;
  projectStatus?: InputMaybe<Scalars["String"]["input"]>;
  projectType?: InputMaybe<Scalars["String"]["input"]>;
  properties?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  propertyTypes?: InputMaybe<Array<InputMaybe<PropertyTypesInput>>>;
  readiness?: InputMaybe<Scalars["Int"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  sharedAmenities?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  squareFeet: Scalars["Int"]["input"];
  streetAddress: Scalars["String"]["input"];
  titleNumber?: InputMaybe<Scalars["String"]["input"]>;
  totalDevelopmentCost?: InputMaybe<Scalars["Float"]["input"]>;
  yearBuilt?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePortfolioProjectWithUnitsInput = {
  listingType?: InputMaybe<Scalars["String"]["input"]>;
  portfolio: Scalars["JSONObject"]["input"];
  units: Array<PortfolioProjectUnitInput>;
};

export type CreateRepaymentInput = {
  conversationId?: InputMaybe<Scalars["ID"]["input"]>;
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  createdForId?: InputMaybe<Scalars["ID"]["input"]>;
  interestRate?: InputMaybe<Scalars["Float"]["input"]>;
  isSubscribedToReferenceRate?: InputMaybe<Scalars["Boolean"]["input"]>;
  loanId?: InputMaybe<Scalars["ID"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<Scalars["String"]["input"]>;
  repaymentTerms?: InputMaybe<Scalars["JSONObject"]["input"]>;
  scheduleType?: InputMaybe<Scalars["String"]["input"]>;
  totalInterest?: InputMaybe<Scalars["String"]["input"]>;
  totalRepayment?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateReviewInput = {
  comment: Scalars["String"]["input"];
  conversationId?: InputMaybe<Scalars["String"]["input"]>;
  propertyId: Scalars["ID"]["input"];
  rating: Scalars["Int"]["input"];
  replies?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  user: Scalars["ID"]["input"];
  userAvatar?: InputMaybe<Scalars["String"]["input"]>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateSimpleConversationInput = {
  participants: Scalars["JSONObject"]["input"];
};

export type CreateSupportRoleInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  permissions: Array<Scalars["String"]["input"]>;
};

export type CreateSupportUserInput = {
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  supportRoleId: Scalars["ID"]["input"];
};

export type CreateTailoringRuleInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  documentCodes: Array<Scalars["String"]["input"]>;
  entityType?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  name: Scalars["String"]["input"];
  platformRole?: InputMaybe<Scalars["String"]["input"]>;
  requirement?: InputMaybe<RequirementLevel>;
};

export type CreateTempProjectInput = {
  payload: Scalars["JSONObject"]["input"];
  sessionId: Scalars["ID"]["input"];
};

export type CreateTermSheetInput = {
  buyerId?: InputMaybe<Scalars["ID"]["input"]>;
  conversationId?: InputMaybe<Scalars["ID"]["input"]>;
  financierId?: InputMaybe<Scalars["ID"]["input"]>;
  initialDeposit?: InputMaybe<Scalars["Float"]["input"]>;
  issuerId?: InputMaybe<Scalars["ID"]["input"]>;
  loanTenor?: InputMaybe<Scalars["JSONObject"]["input"]>;
  modeOfFinancing?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  parentTermSheetId?: InputMaybe<Scalars["ID"]["input"]>;
  projectId: Scalars["ID"]["input"];
  requestedAmount?: InputMaybe<Scalars["Float"]["input"]>;
  transactionRefNo?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<TermSheetType>;
};

export type CreateTransactionInput = {
  amount?: InputMaybe<Scalars["JSONObject"]["input"]>;
  description: Scalars["String"]["input"];
  from?: InputMaybe<Scalars["JSONObject"]["input"]>;
  propertyId: Scalars["ID"]["input"];
  quantity: Scalars["Int"]["input"];
  referenceNo: Scalars["String"]["input"];
  state: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
  to?: InputMaybe<Scalars["JSONObject"]["input"]>;
  tokens: Scalars["Int"]["input"];
  transactionId: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type CurrencyCode = "EUR" | "GBP" | "GHS" | "NGN" | "USD" | "ZAR";

export type CurrencyType = "base" | "fiat" | "points";

export type CurrencyTypeOperator = {
  eq?: InputMaybe<CurrencyType>;
};

export type DashboardKpi = {
  __typename?: "DashboardKpi";
  currency?: Maybe<Scalars["String"]["output"]>;
  deltaAbsolute?: Maybe<Scalars["Float"]["output"]>;
  deltaPercent?: Maybe<Scalars["Float"]["output"]>;
  hint?: Maybe<Scalars["String"]["output"]>;
  previousValue: Scalars["Float"]["output"];
  trend: Trend;
  value: Scalars["Float"]["output"];
};

export type DashboardRange = "NINETY_DAYS" | "SEVEN_DAYS" | "THIRTY_DAYS" | "YTD";

export type DashboardSummary = {
  __typename?: "DashboardSummary";
  activeProperties: DashboardKpi;
  openTickets: DashboardKpi;
  totalVolume: DashboardKpi;
  verifiedUsers: DashboardKpi;
};

export type DateOperator = {
  after?: InputMaybe<Scalars["DateTime"]["input"]>;
  before?: InputMaybe<Scalars["DateTime"]["input"]>;
  between?: InputMaybe<DateRange>;
  eq?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type DateRange = {
  end: Scalars["DateTime"]["input"];
  start: Scalars["DateTime"]["input"];
};

/** Nature of a servicing amendment reported alongside a declaration. */
export type DeclarationAmendmentType =
  | "FacilityIncrease"
  | "None"
  | "Other"
  | "PartialSecurityRelease"
  | "PaymentHoliday"
  | "RateChange"
  | "Restructure"
  | "TenorExtension";

/** Declared lifecycle state of the loan for the period (mirrors the loan master's status). */
export type DeclarationLoanStatus =
  | "Active"
  | "Defaulted"
  | "Draft"
  | "FullyRepaid"
  | "InArrears"
  | "PaymentHoliday"
  | "Restructured"
  | "WrittenOff";

/** Period payment posture reported by the financier (distinct from the loan's declared lifecycle state). */
export type DeclarationPaymentStatus = "Late" | "NotReceived" | "OnTime" | "Partial";

export type DefaultFee = {
  __typename?: "DefaultFee";
  amount: Scalars["Float"]["output"];
  feeType: PrepaymentFeeType;
  percentage: Scalars["Float"]["output"];
};

export type DefaultFeeInput = {
  amount?: InputMaybe<Scalars["Float"]["input"]>;
  feeType?: InputMaybe<PrepaymentFeeType>;
  percentage?: InputMaybe<Scalars["Float"]["input"]>;
};

export type DeleteAllNotificationsResponse = {
  __typename?: "DeleteAllNotificationsResponse";
  deleted: Scalars["Int"]["output"];
};

export type DisburseFacilityInput = {
  amount: Scalars["Float"]["input"];
  /** e.g. lump-sum, tranche, GhIPSS — free text. */
  method?: InputMaybe<Scalars["String"]["input"]>;
  note?: InputMaybe<Scalars["String"]["input"]>;
  reference?: InputMaybe<Scalars["String"]["input"]>;
};

/**
 * A self-reported disbursement (Act 10). Starts PENDING verification; an
 * admin/reviewer later flips it to VERIFIED or UNVERIFIABLE.
 */
export type DisbursementRecord = {
  __typename?: "DisbursementRecord";
  amount: Scalars["Float"]["output"];
  disbursedAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  method?: Maybe<Scalars["String"]["output"]>;
  note?: Maybe<Scalars["String"]["output"]>;
  reference?: Maybe<Scalars["String"]["output"]>;
  verificationStatus: DisbursementVerificationStatus;
  verifiedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/**
 * Verification state for a self-reported disbursement. Disbursements are declared
 * by the financier and independently verified afterward — Afram does not move or
 * confirm funds itself. UNVERIFIABLE is a visible risk flag, not a silent state.
 */
export type DisbursementVerificationStatus = "PENDING" | "UNVERIFIABLE" | "VERIFIED";

export type DocStatus = "missing" | "submitted" | "under_review" | "verified";

export type DocStatusOperator = {
  eq?: InputMaybe<DocStatus>;
  in?: InputMaybe<Array<DocStatus>>;
};

export type DocumentRequestItem = {
  acceptedFileTypes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  count?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  documentCode?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  required?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * The two-party signature state of a document (offer letter or loan agreement).
 * `bothSigned` is true only once each side has a signature on record.
 */
export type DocumentSignatures = {
  __typename?: "DocumentSignatures";
  borrower?: Maybe<SignatureRecord>;
  bothSigned: Scalars["Boolean"]["output"];
  financier?: Maybe<SignatureRecord>;
};

export type DueDiligence = {
  __typename?: "DueDiligence";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  dueDiligenceInitiatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  dueDiligenceReportDate?: Maybe<Scalars["DateTime"]["output"]>;
  dueDiligenceReportImages?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  dueDiligenceReportMessage?: Maybe<Scalars["String"]["output"]>;
  dueDiligenceStatus?: Maybe<DueDiligenceStatus>;
  id: Scalars["ID"]["output"];
  legalDocuments?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  ownerId?: Maybe<Scalars["ID"]["output"]>;
  propertyId: Scalars["ID"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedBy?: Maybe<Scalars["JSONObject"]["output"]>;
};

export type DueDiligenceFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type DueDiligenceStatus = "completed" | "issue" | "pending";

export type EmailRecipientInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  payload?: InputMaybe<Scalars["JSON"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  pushToken?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type Entity = {
  __typename?: "Entity";
  address?: Maybe<Scalars["String"]["output"]>;
  companyRegNumber?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  entityType: EntityType;
  id: Scalars["ID"]["output"];
  licenceNumber?: Maybe<Scalars["String"]["output"]>;
  loanTerm?: Maybe<Scalars["JSON"]["output"]>;
  members?: Maybe<Array<Maybe<EntityMember>>>;
  owner?: Maybe<User>;
  ownerId?: Maybe<Scalars["ID"]["output"]>;
  platformRoles?: Maybe<Array<Scalars["String"]["output"]>>;
  /**
   * Entity-owned policies (issuer/financier settings) for this entity.
   * Only returned to members of the entity or platform admins; empty otherwise.
   */
  policies?: Maybe<Array<UserPolicy>>;
  position?: Maybe<Scalars["String"]["output"]>;
  profileImage?: Maybe<Scalars["String"]["output"]>;
  projectsFinanced?: Maybe<Scalars["Int"]["output"]>;
  proofOfAffiliation?: Maybe<Scalars["String"]["output"]>;
  taxIdNumber?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  verificationStatus: EntityVerificationStatus;
  walletAddress?: Maybe<Scalars["String"]["output"]>;
};

/**
 * A single tailored document requirement, decorated with its current satisfaction
 * status (resolved from the entity owner's compliance submission).
 */
export type EntityDocumentRequirement = {
  __typename?: "EntityDocumentRequirement";
  documentCode: Scalars["String"]["output"];
  gatedActions: Array<GatedAction>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  requirement: RequirementLevel;
  satisfied: Scalars["Boolean"]["output"];
  status: DocStatus;
  templateId?: Maybe<Scalars["ID"]["output"]>;
};

export type EntityGate = {
  __typename?: "EntityGate";
  action: GatedAction;
  allowed: Scalars["Boolean"]["output"];
  blockingDocuments: Array<EntityDocumentRequirement>;
};

export type EntityMember = {
  __typename?: "EntityMember";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  entity?: Maybe<Entity>;
  entityId: Scalars["ID"]["output"];
  entityRoleId?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  invitedAt?: Maybe<Scalars["DateTime"]["output"]>;
  invitedBy?: Maybe<User>;
  invitedById?: Maybe<Scalars["ID"]["output"]>;
  joinedAt?: Maybe<Scalars["DateTime"]["output"]>;
  memberRole: EntityMemberRole;
  role?: Maybe<EntityRole>;
  status: EntityMemberStatus;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars["ID"]["output"]>;
};

export type EntityMemberFilter = {
  entityId?: InputMaybe<Scalars["ID"]["input"]>;
  entityRoleId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<EntityMemberStatus>;
};

export type EntityMemberRole = "admin" | "member" | "viewer";

export type EntityMemberStatus = "ACTIVE" | "PENDING" | "REMOVED" | "SUSPENDED";

export type EntityProfileInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  companyRegNumber?: InputMaybe<Scalars["String"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  entityType?: InputMaybe<EntityType>;
  licenceNumber?: InputMaybe<Scalars["String"]["input"]>;
  position?: InputMaybe<Scalars["String"]["input"]>;
  profileImage?: InputMaybe<Scalars["String"]["input"]>;
  proofOfAffiliation?: InputMaybe<Scalars["String"]["input"]>;
  taxIdNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type EntityRequirementsResponse = {
  __typename?: "EntityRequirementsResponse";
  entityId: Scalars["ID"]["output"];
  gates: Array<EntityGate>;
  requirements: Array<EntityDocumentRequirement>;
};

export type EntityRole = {
  __typename?: "EntityRole";
  badgeColor?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  entityId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  isSystem: Scalars["Boolean"]["output"];
  members?: Maybe<Array<Maybe<EntityMember>>>;
  name: Scalars["String"]["output"];
  permissions: Array<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type EntityRoleFilter = {
  entityId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type EntityType = "individual" | "organization";

export type EntityVerificationStatus = "pending" | "rejected" | "verified";

export type FavoriteOffer = {
  __typename?: "FavoriteOffer";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  entityId?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  property?: Maybe<Scalars["JSONObject"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  userId: Scalars["ID"]["output"];
};

export type FavoriteOfferFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

/** An AFRAM / lender fee record for a loan. */
export type FeeRecord = {
  __typename?: "FeeRecord";
  amount: Scalars["Float"]["output"];
  currency: Scalars["String"]["output"];
  feeType: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  loanId?: Maybe<Scalars["ID"]["output"]>;
  offerRequestId: Scalars["ID"]["output"];
  recordedAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** "AFRAM" | "Lender". */
  revenueOwner: Scalars["String"]["output"];
  /** "deductedFromProceeds" | "invoiced". */
  settlement: Scalars["String"]["output"];
  whoPays: Scalars["String"]["output"];
};

export type FileDeclarationInput = {
  /** Required when amendmentType is not None. */
  amendmentDetails?: InputMaybe<Scalars["String"]["input"]>;
  amendmentDoc?: InputMaybe<Scalars["String"]["input"]>;
  amendmentType?: InputMaybe<DeclarationAmendmentType>;
  amountCollectedThisMonth?: InputMaybe<Scalars["Float"]["input"]>;
  amountDisbursedThisPeriod?: InputMaybe<Scalars["Float"]["input"]>;
  coversReportingGap?: InputMaybe<Scalars["Boolean"]["input"]>;
  currentPeriodInterestRate?: InputMaybe<Scalars["Float"]["input"]>;
  /** Required when loanStatus is FullyRepaid or WrittenOff. */
  dischargeDoc?: InputMaybe<Scalars["String"]["input"]>;
  loanBook?: InputMaybe<Scalars["String"]["input"]>;
  /** Optional — resolved from the term sheet / financier repayment when omitted. */
  loanId?: InputMaybe<Scalars["ID"]["input"]>;
  loanStatus: DeclarationLoanStatus;
  nextPaymentAmount?: InputMaybe<Scalars["Float"]["input"]>;
  nextPaymentDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId: Scalars["ID"]["input"];
  outstandingInterest: Scalars["Float"]["input"];
  outstandingPenalties?: InputMaybe<Scalars["Float"]["input"]>;
  outstandingPrincipal: Scalars["Float"]["input"];
  paymentStatus: DeclarationPaymentStatus;
  prepaymentFlag?: InputMaybe<Scalars["Boolean"]["input"]>;
  prepaymentPenaltyAmount?: InputMaybe<Scalars["Float"]["input"]>;
  reportingDate: Scalars["DateTime"]["input"];
};

export type FinancierFilter = {
  displayName?: InputMaybe<StringOperator>;
  entityType?: InputMaybe<EntityType>;
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
  verificationStatus?: InputMaybe<EntityVerificationStatus>;
};

/**
 * The caller's financed property book as a financier, split into two sections:
 * `inProgress` (the loan is still being disbursed/repaid) and `settled`
 * (financing discharged/closed). A financier never holds the property outright,
 * so there is no `owned` section.
 */
export type FinancierPropertyHoldings = {
  __typename?: "FinancierPropertyHoldings";
  inProgress: Array<Property>;
  settled: Array<Property>;
};

export type FloorArea = {
  __typename?: "FloorArea";
  unit?: Maybe<Scalars["String"]["output"]>;
  value?: Maybe<Scalars["Int"]["output"]>;
};

export type FloorAreaInput = {
  unit?: InputMaybe<Scalars["String"]["input"]>;
  value?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GatedAction = "drawdown" | "listing" | "transaction";

export type GrantAssessmentFinancierShareInput = {
  assessmentId: Scalars["ID"]["input"];
  expiresAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  financierEntityId: Scalars["ID"]["input"];
  scope?: InputMaybe<AssessmentFinancierShareScope>;
};

export type GrantOfferRequestInput = {
  availabilityPeriodDays?: InputMaybe<Scalars["Int"]["input"]>;
  bondSubType?: InputMaybe<BondSubType>;
  commitmentFeeRate?: InputMaybe<Scalars["Float"]["input"]>;
  conditions?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  covenants?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  depositPercentage?: InputMaybe<Scalars["Float"]["input"]>;
  drawdownSchedule?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  dsraMonths?: InputMaybe<Scalars["Int"]["input"]>;
  interestRate?: InputMaybe<Scalars["JSONObject"]["input"]>;
  lenderName?: InputMaybe<Scalars["String"]["input"]>;
  loanSubType?: InputMaybe<LoanSubType>;
  loanTenor?: InputMaybe<Scalars["JSONObject"]["input"]>;
  loanType?: InputMaybe<LoanType>;
  ltv?: InputMaybe<Scalars["Float"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  moratorium?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  offerExpiryDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  otherFees?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  paymentTermsAndSchedule?: InputMaybe<PaymentTermsAndScheduleInput>;
  processingTimeline?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  rateType?: InputMaybe<RateType>;
  repaymentFrequency?: InputMaybe<RepaymentFrequency>;
  repaymentType?: InputMaybe<RepaymentType>;
  schedule?: InputMaybe<Scalars["JSONObject"]["input"]>;
  security?: InputMaybe<Scalars["JSONObject"]["input"]>;
  sources?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type IdOperator = {
  eq?: InputMaybe<Scalars["ID"]["input"]>;
  in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  notIn?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type IdentityDocumentInput = {
  country?: InputMaybe<Scalars["String"]["input"]>;
  dateOfBirth?: InputMaybe<Scalars["String"]["input"]>;
  expiryDate?: InputMaybe<Scalars["String"]["input"]>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  idNumber: Scalars["String"]["input"];
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  issueDate?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
};

export type ImportAssessmentAlertRuleInput = {
  code: Scalars["String"]["input"];
  message: Scalars["String"]["input"];
  operator: AssessmentAlertOperator;
  severity: AssessmentAlertSeverity;
  threshold: Scalars["JSON"]["input"];
  triggerQuestionCode: Scalars["String"]["input"];
};

export type ImportAssessmentCategoryInput = {
  code: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  label: Scalars["String"]["input"];
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type ImportAssessmentQuestionInput = {
  answerType: AssessmentAnswerType;
  categoryCode?: InputMaybe<Scalars["String"]["input"]>;
  code: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  guidance?: InputMaybe<Scalars["String"]["input"]>;
  isKycAutofill?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRequired?: InputMaybe<Scalars["Boolean"]["input"]>;
  isScored?: InputMaybe<Scalars["Boolean"]["input"]>;
  kycSourceField?: InputMaybe<Scalars["String"]["input"]>;
  prompt: Scalars["String"]["input"];
  scoringLogicText?: InputMaybe<Scalars["String"]["input"]>;
  unit?: InputMaybe<Scalars["String"]["input"]>;
  verification?: InputMaybe<Scalars["String"]["input"]>;
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type ImportAssessmentQuestionOptionInput = {
  code: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  label: Scalars["String"]["input"];
  questionCode: Scalars["String"]["input"];
  score: Scalars["Int"]["input"];
};

export type ImportAssessmentReadinessBandInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  code: Scalars["String"]["input"];
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  guidance?: InputMaybe<Scalars["String"]["input"]>;
  label: Scalars["String"]["input"];
  maxScore: Scalars["Int"]["input"];
  minScore: Scalars["Int"]["input"];
};

export type ImportAssessmentScoringBandInput = {
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  maxValue?: InputMaybe<Scalars["Float"]["input"]>;
  minValue?: InputMaybe<Scalars["Float"]["input"]>;
  questionCode: Scalars["String"]["input"];
  score: Scalars["Int"]["input"];
};

export type ImportAssessmentTemplateBaseInput = {
  code: Scalars["String"]["input"];
  consentText?: InputMaybe<Scalars["String"]["input"]>;
  declarationText?: InputMaybe<Scalars["String"]["input"]>;
  legalNotice?: InputMaybe<Scalars["String"]["input"]>;
  maxScorePerParameter?: InputMaybe<Scalars["Int"]["input"]>;
  name: Scalars["String"]["input"];
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  subjectType?: InputMaybe<AssessmentSubjectType>;
  version: Scalars["String"]["input"];
};

export type ImportAssessmentTemplateInput = {
  alertRules?: InputMaybe<Array<ImportAssessmentAlertRuleInput>>;
  categories: Array<ImportAssessmentCategoryInput>;
  options?: InputMaybe<Array<ImportAssessmentQuestionOptionInput>>;
  questions: Array<ImportAssessmentQuestionInput>;
  readinessBands?: InputMaybe<Array<ImportAssessmentReadinessBandInput>>;
  scoringBands?: InputMaybe<Array<ImportAssessmentScoringBandInput>>;
  template: ImportAssessmentTemplateBaseInput;
};

export type InitiateDepositResult = {
  __typename?: "InitiateDepositResult";
  id: Scalars["ID"]["output"];
  reference: Scalars["String"]["output"];
};

export type InstallmentFilter = {
  currency?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  refNo?: InputMaybe<Scalars["String"]["input"]>;
  repaymentId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type InterestRate = {
  __typename?: "InterestRate";
  kind: Scalars["String"]["output"];
  rate: Scalars["Float"]["output"];
};

export type InterestRateInput = {
  kind?: InputMaybe<Scalars["String"]["input"]>;
  rate?: InputMaybe<Scalars["Float"]["input"]>;
};

export type InviteCompanyMemberInput = {
  email: Scalars["String"]["input"];
  entityRoleId: Scalars["ID"]["input"];
  fullName?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
};

export type IssuerFilter = {
  displayName?: InputMaybe<StringOperator>;
  entityType?: InputMaybe<EntityType>;
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
  verificationStatus?: InputMaybe<EntityVerificationStatus>;
};

export type Land = {
  __typename?: "Land";
  boundary?: Maybe<Scalars["JSONObject"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  ownerId?: Maybe<Scalars["ID"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type LandCheckResult = {
  __typename?: "LandCheckResult";
  message?: Maybe<Scalars["String"]["output"]>;
  ok: Scalars["Boolean"]["output"];
};

export type LandFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type LedgerLoan = {
  __typename?: "LedgerLoan";
  borrowerName?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Facility amount — the disbursable principal (OfferRequest.agreedAmount). */
  facilityAmount?: Maybe<Scalars["Float"]["output"]>;
  /** False when no active declaration exists yet (portfolio row tone = RED). */
  hasDeclaration: Scalars["Boolean"]["output"];
  /** Loan row key — equals the anchoring offerRequestId. */
  id: Scalars["ID"]["output"];
  interestRate?: Maybe<Scalars["JSONObject"]["output"]>;
  /** reportingDate of the latest active declaration (drives staleness). */
  lastDeclarationDate?: Maybe<Scalars["DateTime"]["output"]>;
  latestDeclaration?: Maybe<StatusDeclaration>;
  lenderName?: Maybe<Scalars["String"]["output"]>;
  /** Human-readable loan reference (OfferRequest.refNo). */
  loanRef?: Maybe<Scalars["String"]["output"]>;
  /** Declared loan status from the latest active declaration. */
  loanStatus?: Maybe<DeclarationLoanStatus>;
  modeOfFinancing?: Maybe<Scalars["String"]["output"]>;
  offerRequest: OfferRequest;
  offerRequestId: Scalars["ID"]["output"];
  /** Origination reference (OfferRequest.approvedAt). */
  originationDate?: Maybe<Scalars["DateTime"]["output"]>;
  propertyName?: Maybe<Scalars["String"]["output"]>;
  requestStatus?: Maybe<OfferRequestStatus>;
  /** Total outstanding from the latest active declaration; null when none filed yet. */
  totalOutstanding?: Maybe<Scalars["Float"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type LedgerLoanFilter = {
  /** Filter to a single loan by its anchoring offer request (id and offerRequestId are equivalent). */
  id?: InputMaybe<Scalars["ID"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  /** Narrow to one servicing status (must be a status the loan book already surfaces). */
  requestStatus?: InputMaybe<OfferRequestStatus>;
};

export type LegalDocs = {
  __typename?: "LegalDocs";
  name?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type LegalDocsInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  url?: InputMaybe<Scalars["String"]["input"]>;
};

export type Loan = {
  __typename?: "Loan";
  conversationId: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  interestRate?: Maybe<Scalars["JSONObject"]["output"]>;
  loanAmount: Scalars["Float"]["output"];
  loanStatus?: Maybe<Scalars["String"]["output"]>;
  loanTenor?: Maybe<Scalars["JSONObject"]["output"]>;
  repaymentFrequency?: Maybe<Scalars["String"]["output"]>;
  totalInterest?: Maybe<Scalars["Float"]["output"]>;
  totalRepayment?: Maybe<Scalars["Float"]["output"]>;
  transactionId?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  userId?: Maybe<Scalars["ID"]["output"]>;
};

export type LoanDocument = {
  __typename?: "LoanDocument";
  fileName: Scalars["String"]["output"];
  fileSize?: Maybe<Scalars["Float"]["output"]>;
  fileType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  loanId?: Maybe<Scalars["ID"]["output"]>;
  name: Scalars["String"]["output"];
  offerRequestId: Scalars["ID"]["output"];
  source: LoanDocumentSource;
  tag?: Maybe<Scalars["String"]["output"]>;
  uploadedAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** Vault download / preview target. */
  url?: Maybe<Scalars["String"]["output"]>;
};

export type LoanDocumentSource = "borrower" | "financier";

export type LoanFilter = {
  conversationId?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
};

export type LoanRequestKind = "declaration_review" | "formal_request";

export type LoanRequestStatus = "acknowledged" | "open";

export type LoanScheduleType = "ANNUITY" | "BALLOON" | "BULLET" | "EQUAL_PRINCIPAL";

export type LoanSubType = "FLAT" | "REDUCING";

export type LoanType =
  "BRIDGE_LOAN" | "COMMERCIAL" | "CONSTRUCTION_LOAN" | "EQUITY_RELEASE" | "MEZZANINE" | "MORTGAGE";

export type MarkAllAsReadResponse = {
  __typename?: "MarkAllAsReadResponse";
  updated: Scalars["Int"]["output"];
};

export type Message = {
  __typename?: "Message";
  attachmentComment?: Maybe<Scalars["String"]["output"]>;
  attachmentComments?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  content: Scalars["JSONObject"]["output"];
  conversationId: Scalars["ID"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  deletedAt?: Maybe<Scalars["DateTime"]["output"]>;
  deletedBy?: Maybe<Scalars["String"]["output"]>;
  deletedForEveryone?: Maybe<Scalars["Boolean"]["output"]>;
  deletedForUsers?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  editedAt?: Maybe<Scalars["DateTime"]["output"]>;
  fileUrl?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isDeleted?: Maybe<Scalars["Boolean"]["output"]>;
  isEdited?: Maybe<Scalars["Boolean"]["output"]>;
  isRead?: Maybe<Scalars["Boolean"]["output"]>;
  messageType: Scalars["String"]["output"];
  pollData?: Maybe<Scalars["JSONObject"]["output"]>;
  reactions?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  replies?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  replyTo?: Maybe<Scalars["JSONObject"]["output"]>;
  senderId: Scalars["String"]["output"];
  senderPicture?: Maybe<Scalars["String"]["output"]>;
  transactionId?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type MessageFilter = {
  conversationId?: InputMaybe<IdOperator>;
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  isRead?: InputMaybe<BooleanOperator>;
  messageType?: InputMaybe<StringOperator>;
  senderId?: InputMaybe<IdOperator>;
};

export type MfaOtpPayload = {
  __typename?: "MfaOtpPayload";
  email?: Maybe<Scalars["String"]["output"]>;
  message: Scalars["String"]["output"];
  phoneNumber?: Maybe<Scalars["String"]["output"]>;
};

export type MfaSetupPayload = {
  __typename?: "MfaSetupPayload";
  message: Scalars["String"]["output"];
  user: User;
};

export type MfaVerifyPayload = {
  __typename?: "MfaVerifyPayload";
  message: Scalars["String"]["output"];
  verified: Scalars["Boolean"]["output"];
};

export type ModeOfFinancing =
  "FINANCIER_OFFER" | "ISSUER_LOAN_FINANCING" | "PERSONAL_FUNDS" | "SELLER_FINANCING";

export type MoneyOperator = {
  between?: InputMaybe<MoneyRange>;
  eq?: InputMaybe<Scalars["Money"]["input"]>;
  gt?: InputMaybe<Scalars["Money"]["input"]>;
  gte?: InputMaybe<Scalars["Money"]["input"]>;
  lt?: InputMaybe<Scalars["Money"]["input"]>;
  lte?: InputMaybe<Scalars["Money"]["input"]>;
};

export type MoneyRange = {
  end: Scalars["Money"]["input"];
  start: Scalars["Money"]["input"];
};

export type MonthlyPayment = {
  __typename?: "MonthlyPayment";
  amount: Scalars["Float"]["output"];
  date: Scalars["DateTime"]["output"];
  interestComponent: Scalars["Float"]["output"];
  principalComponent: Scalars["Float"]["output"];
  refNo: Scalars["String"]["output"];
  remainingPrincipal: Scalars["Float"]["output"];
  status: PaymentStatus;
};

export type Mutation = {
  __typename?: "Mutation";
  acceptCompanyInvite: EntityMember;
  /** Borrower signs the offer letter (→ OFFER_LETTER_BORROWER_SIGNED). */
  acceptOfferLetter: OfferRequest;
  acceptOfferRequest: Scalars["Boolean"]["output"];
  acceptTermsSheet: OfferRequest;
  /** Financier marks a borrower request acknowledged (open → acknowledged), lender-scoped. */
  acknowledgeBorrowerLoanRequest: BorrowerLoanRequest;
  activateAssessment: Scalars["Boolean"]["output"];
  addAttachmentComment: Message;
  addParticipant: Conversation;
  addReaction: Message;
  addReply: Message;
  addTicketComment: TicketComment;
  addUserForPush: NotificationSuccessResponse;
  approveOfferRequest: OfferRequest;
  approveUserVerification: User;
  archiveAssessment: Scalars["Boolean"]["output"];
  assignSupportRole: SupportRoleMember;
  assignTicket: Ticket;
  attachAssessmentDocumentFile: Scalars["Boolean"]["output"];
  beginLoanDeclaration: OfferRequest;
  beginOfficerReview: Scalars["Boolean"]["output"];
  beginRequestReview: OfferRequest;
  bulkCreatePreTokenizedUnits: BulkCreatePreTokenizedUnitsResponse;
  bulkUpdatePreTokenizedUnitsByType: BulkUpdatePreTokenizedUnitsResponse;
  /** Cancel a declaration within its 7-day cancellable window. */
  cancelDeclaration: StatusDeclaration;
  checkLand: LandCheckResult;
  completeFinancingAssessment: OfferRequest;
  completeOnboarding: CompleteOnboardingPayload;
  computeAssessmentScore: AssessmentScoreResult;
  /**
   * Admin only — closes a purchase when the balance was verified out of band and
   * the statement matcher never saw it. The normal path is bank reconciliation.
   *
   * In non-production environments with CASH_SETTLEMENT_SELF_CONFIRM=true either
   * party to the transaction may call it, so a demo can walk the buyer to stage 6
   * without a real bank feed. Never relaxed in production.
   */
  confirmCashSettlement: CashPurchaseTxn;
  /** Advance to CONDITIONS_PRECEDENT_CONFIRMED. Fails unless every CP item is resolved. */
  confirmConditionsPrecedent: OfferRequest;
  contactUs: ContactUsResponse;
  /** Lender countersigns the offer letter to finalise it (→ OFFER_LETTER_ACCEPTED). */
  countersignOfferLetter: OfferRequest;
  /**
   * Issuer — the FINAL signature. Executes the agreement →
   * sale_agreement_signed. Rejected until the buyer has signed.
   */
  countersignSaleAgreement: CashPurchaseTxn;
  createAdminConversation: Conversation;
  createAssessment: Assessment;
  createAssessmentAlertRule: AssessmentAlertRule;
  createAssessmentCategory: AssessmentCategory;
  createAssessmentDocument: AssessmentDocument;
  createAssessmentQuestion: AssessmentQuestion;
  createAssessmentQuestionOption: AssessmentQuestionOption;
  createAssessmentReadinessBand: AssessmentReadinessBand;
  createAssessmentScoringBand: AssessmentScoringBand;
  createAssessmentTemplate: AssessmentTemplate;
  createAssetValueSnapshot: Scalars["Boolean"]["output"];
  createBareLandProject: PortfolioProjectWithUnitsResult;
  createBuyerProject: Scalars["Boolean"]["output"];
  createCompanyRole: EntityRole;
  /** Admin: create a compliance section for a role type */
  createComplianceSection: ComplianceAdminSectionResponse;
  /** Admin: add a document template to a section */
  createComplianceTemplate: ComplianceAdminTemplateResponse;
  createConversation: Conversation;
  createDueDiligence: Scalars["Boolean"]["output"];
  createLand: Scalars["Boolean"]["output"];
  createOffer: Scalars["Boolean"]["output"];
  createOfferRequest: OfferRequest;
  createPaymentSchedule: Scalars["Boolean"]["output"];
  createPortfolio: Scalars["Boolean"]["output"];
  createPortfolioProjectWithUnits: PortfolioProjectWithUnitsResult;
  createPreTokenizedUnit: PreTokenizedUnit;
  createProject: Scalars["Boolean"]["output"];
  createProperty: Scalars["Boolean"]["output"];
  createRepayment: Scalars["Boolean"]["output"];
  createReview: Scalars["Boolean"]["output"];
  createSimpleConversation: Conversation;
  createSupportRole: SupportRole;
  createSupportUser: SupportUser;
  createTailoringRule: TailoringRuleResponse;
  createTempProject: Scalars["Boolean"]["output"];
  createTermSheet: TermSheet;
  createTransaction: Scalars["Boolean"]["output"];
  declineOfferLetter: OfferRequest;
  /**
   * Decrypt every value of a metadata object previously produced by
   * encryptMetadata, restoring each original value (with its JSON type intact).
   */
  decryptMetadata: Scalars["JSON"]["output"];
  deleteAllNotifications: DeleteAllNotificationsResponse;
  deleteCompanyRole: Scalars["Boolean"]["output"];
  /** Admin: delete a compliance section and all its templates */
  deleteComplianceSection: ComplianceDeleteResponse;
  /** Admin: delete a document template */
  deleteComplianceTemplate: ComplianceDeleteResponse;
  deleteConversation: Scalars["Boolean"]["output"];
  deleteMessage: Scalars["Boolean"]["output"];
  deleteNotification: NotificationSuccessResponse;
  deleteSupportRole: Scalars["Boolean"]["output"];
  deleteTailoringRule: ComplianceDeleteResponse;
  deleteTicket: Scalars["Boolean"]["output"];
  disburseFacility: OfferRequest;
  dismissComplianceNotification: ComplianceDismissResponse;
  editMessage: Message;
  /**
   * Encrypt every value of the given metadata object individually. Returns an
   * object with the same keys whose values are base64-encoded AES-GCM ciphertext.
   * Reverse the operation with decryptMetadata.
   */
  encryptMetadata: Scalars["JSON"]["output"];
  /** Lender extends the offer letter's acceptance deadline. */
  extendOfferLetterDeadline: OfferRequest;
  /** Issuer — pushes the signing deadline out while signatures are outstanding. */
  extendSigningDeadline: CashPurchaseTxn;
  /** File a monthly Status Declaration. Computes totalOutstanding, supersedes the prior active filing for the period, and opens a 7-day cancellation window. */
  fileDeclaration: StatusDeclaration;
  generateToken: Scalars["String"]["output"];
  grantAssessmentFinancierShare: Scalars["ID"]["output"];
  grantOfferRequest: OfferRequest;
  importAssessmentTemplate: AssessmentTemplate;
  /** Spec §5.1 — creates the advisory pending deposit txn. Does NOT move money. */
  initiateWalletDeposit: InitiateDepositResult;
  inviteCompanyMember: EntityMember;
  issueDischarge: OfferRequest;
  /** Lender prepares and issues the loan agreement (→ LOAN_AGREEMENT_ISSUED), setting the signing deadline. */
  issueLoanAgreement: OfferRequest;
  /** Lender issues the offer letter and sets the acceptance deadline. */
  issueOfferLetter: OfferRequest;
  /**
   * Issuer — DEPRECATED: upload + send in one call, kept for clients that have
   * not adopted the two-step ceremony. `typedSignature` is ignored — the issuer's
   * signature is now the countersignature, applied by
   * `countersignSaleAgreement`. → sale_agreement_pending, awaiting_signatures.
   * @deprecated Use uploadSaleAgreement + sendSaleAgreementToBuyer
   */
  issueSaleAgreement: CashPurchaseTxn;
  login: AuthPayload;
  loginAframSearch: AuthPayload;
  loginSupportUser: SupportAuthPayload;
  markAllNotificationsAsRead: MarkAllAsReadResponse;
  markAsPaid: Scalars["Boolean"]["output"];
  markNotificationAsRead: Notification;
  nudgeFinancier: Scalars["Boolean"]["output"];
  /** Buyer — idempotent per (buyer, property) while active. */
  placeCashPurchase: CashPurchaseTxn;
  /** Buyer — sale_agreement_signed → settlement_pending. */
  proceedToSettlement: CashPurchaseTxn;
  publishAssessmentTemplate: Scalars["Boolean"]["output"];
  publishPortfolioUnits: Scalars["Boolean"]["output"];
  reGenerateAccessToken: AuthPayload;
  reactivateAssessmentTemplate: Scalars["Boolean"]["output"];
  reactivateCompanyMember: EntityMember;
  reissueLoanAgreement: OfferRequest;
  /**
   * Issuer — voids the current document and both signatures and returns the
   * agreement to `draft` at sale_agreement_pending, so a corrected copy can be
   * uploaded and re-signed. The reason is kept permanently in the audit trail.
   * Rejected once settlement has begun (settlement_pending / closed).
   */
  reissueSaleAgreement: CashPurchaseTxn;
  rejectAssessmentDocument: Scalars["Boolean"]["output"];
  rejectOfferRequest: Scalars["Boolean"]["output"];
  /**
   * Release tokens from escrow to the buyer — writes a released_from_escrow token
   * event for the given amount (default: the remaining escrowed balance). Does not
   * itself close the loan; when fully released the client prompts issueDischarge.
   */
  releaseTokensToBuyer: TokenEvent;
  removeAssessmentAlertRule: Scalars["Boolean"]["output"];
  removeAssessmentCategory: Scalars["Boolean"]["output"];
  removeAssessmentDocument: Scalars["Boolean"]["output"];
  removeAssessmentQuestionOption: Scalars["Boolean"]["output"];
  removeAssessmentReadinessBand: Scalars["Boolean"]["output"];
  removeAssessmentScoringBand: Scalars["Boolean"]["output"];
  removeCompanyMember: Scalars["Boolean"]["output"];
  removeDueDiligence: Scalars["Boolean"]["output"];
  removeLand: Scalars["Boolean"]["output"];
  removeLoan: Scalars["Boolean"]["output"];
  removeOffer: Scalars["Boolean"]["output"];
  /** Financier: remove a document request that has not yet been submitted */
  removeOfferDocumentRequest: Scalars["Boolean"]["output"];
  removeOfferRequest: Scalars["Boolean"]["output"];
  removePaymentSchedule: Scalars["Boolean"]["output"];
  removePortfolio: Scalars["Boolean"]["output"];
  removeProject: Scalars["Boolean"]["output"];
  removeProperty: Scalars["Boolean"]["output"];
  removeReaction: Message;
  removeRepayment: Scalars["Boolean"]["output"];
  removeReview: Scalars["Boolean"]["output"];
  removeTempProject: Scalars["Boolean"]["output"];
  removeTermSheet: Scalars["Boolean"]["output"];
  removeTicketComment: Scalars["Boolean"]["output"];
  removeTransaction: Scalars["Boolean"]["output"];
  /**
   * Platform admin — catch-up pass for parties on deals past offer acceptance or
   * SPA execution who have no wallet, because `wallet.provision` is
   * fire-and-forget and nothing downstream retries it.
   *
   * Defaults to a dry run: the live path opens real bank accounts, so look at the
   * list first. `ownerIds` narrows it to specific parties — use it to retry one
   * whose profile has since been completed.
   */
  replayWalletProvisioning: WalletProvisioningReplayResult;
  requestLoanAgreementChanges: OfferRequest;
  /** Financier: attach one or more document requests to an offer request */
  requestOfferDocuments: Array<OfferRequestDocument>;
  requestPasswordReset: Scalars["Boolean"]["output"];
  requestPaymentVerification: Conversation;
  /** Borrower asks the financier to revise the issued term sheet, with a message. */
  requestTermSheetChanges: OfferRequest;
  /** Spec §5.2 — holds payout balance + creates the pending withdrawal txn. Destination is always the caller's verified bank account. */
  requestWalletWithdrawal: WalletTxn;
  resetPassword: Scalars["Boolean"]["output"];
  retireAssessmentQuestion: Scalars["Boolean"]["output"];
  retireAssessmentTemplate: Scalars["Boolean"]["output"];
  returnAssessment: Scalars["Boolean"]["output"];
  /** Financier: approve or reject submitted documents on an offer request */
  reviewOfferDocuments: Array<OfferRequestDocument>;
  revokeAssessmentFinancierShare: Scalars["Boolean"]["output"];
  revokeOffer: Scalars["Boolean"]["output"];
  revokeOfferRequest: Scalars["Boolean"]["output"];
  saveUserPolicy: UserPolicy;
  sendDuePaymentSubscriptionEmail: NotificationSuccessResponse;
  sendMessage: Message;
  sendMfaOtp: MfaOtpPayload;
  sendMfaOtpEmail: MfaOtpPayload;
  sendNotification: NotificationSuccessResponse;
  sendOtp: Scalars["Boolean"]["output"];
  sendPaymentReminderEmail: NotificationSuccessResponse;
  sendPaymentSubscriptionEmail: NotificationSuccessResponse;
  sendPaymentTermsAcceptanceEmail: NotificationSuccessResponse;
  sendPaymentTermsConfirmationEmail: NotificationSuccessResponse;
  sendPaymentVerificationEmail: NotificationSuccessResponse;
  sendRoleVerificationEmail: NotificationSuccessResponse;
  /**
   * Issuer — grants the buyer read + signature access, records the deadline and
   * notifies them. draft → awaiting_signatures.
   */
  sendSaleAgreementToBuyer: CashPurchaseTxn;
  sendWelcomeEmail: NotificationSuccessResponse;
  /** Financier upserts a CP item / signs it off (CONFIRMED / WAIVED / PENDING). */
  setConditionPrecedentStatus: OfferRequest;
  setSupportUserInitialPassword: SetSupportUserInitialPasswordPayload;
  /**
   * Buyer — records the chosen payment method and returns the settlement
   * reference to quote. Does NOT close the transaction: closing happens when the
   * bank confirms the balance landed.
   */
  settleCashPurchase: CashPurchaseTxn;
  setupMFA: MfaSetupPayload;
  /** Borrower signs the loan agreement (→ LOAN_AGREEMENT_BORROWER_SIGNED), attaching their signed copy. */
  signAsBorrower: OfferRequest;
  /** Lender countersigns to execute the loan agreement (→ LOAN_AGREEMENT_SIGNED), attaching the executed copy. */
  signAsLender: OfferRequest;
  /**
   * Buyer — signs first. Records the signature and the signed copy; it does NOT
   * execute the agreement. The stage stays `sale_agreement_pending` until the
   * issuer countersigns.
   *
   * `signedCopyUrl` is optional only so a client that has not yet wired the
   * upload keeps working; send it whenever you have it.
   */
  signSaleAgreement: CashPurchaseTxn;
  signup: AuthPayload;
  submitAssessment: Scalars["Boolean"]["output"];
  /** Borrower raises a declaration-review / formal request to the financier. */
  submitBorrowerLoanRequest: BorrowerLoanRequest;
  /** Responsible party uploads evidence for a CP item (→ SUBMITTED). */
  submitConditionPrecedentEvidence: OfferRequest;
  /** Buyer: upload documents in response to the requests on an offer request */
  submitOfferDocuments: Array<OfferRequestDocument>;
  subscribeToPushNotification: NotificationSuccessResponse;
  suspendCompanyMember: EntityMember;
  /**
   * Run the tailoring process for an entity: re-evaluates active rules and
   * rewrites the entity's required document set.
   */
  tailorEntity: EntityRequirementsResponse;
  toggleOfferFavorite: Scalars["Boolean"]["output"];
  togglePropertyFavorite: ToggleFavoriteResult;
  toggleSuspendUser: ToggleSuspendPayload;
  tokenizeProperty: Scalars["Boolean"]["output"];
  unassignTicket: Ticket;
  updateAssessment: Scalars["Boolean"]["output"];
  updateAssessmentAlertRule: Scalars["Boolean"]["output"];
  updateAssessmentCategory: Scalars["Boolean"]["output"];
  updateAssessmentDocument: Scalars["Boolean"]["output"];
  updateAssessmentQuestion: Scalars["Boolean"]["output"];
  updateAssessmentQuestionOption: Scalars["Boolean"]["output"];
  updateAssessmentReadinessBand: Scalars["Boolean"]["output"];
  updateAssessmentScoringBand: Scalars["Boolean"]["output"];
  updateAssessmentTemplate: Scalars["Boolean"]["output"];
  updateCompanyRole: EntityRole;
  /** Admin: update a compliance section */
  updateComplianceSection: ComplianceAdminSectionResponse;
  /**
   * Admin: update a submission's status, reviewer, or note.
   * Status changes auto-create a notification for the submitter.
   */
  updateComplianceSubmission: ComplianceAdminSubmissionResponse;
  /** Admin: update a document template */
  updateComplianceTemplate: ComplianceAdminTemplateResponse;
  updateConversation: Conversation;
  updateConversationPayment: Scalars["Boolean"]["output"];
  updateDueDiligence: Scalars["Boolean"]["output"];
  updateMemberRole: EntityMember;
  updateOffer: Scalars["Boolean"]["output"];
  /** Financier: edit a pending document request (name / description / deadline) */
  updateOfferDocumentRequest: OfferRequestDocument;
  updateOfferRequest: Scalars["Boolean"]["output"];
  updatePaymentSchedule: Scalars["Boolean"]["output"];
  updatePortfolio: Scalars["Boolean"]["output"];
  updateProject: Scalars["Boolean"]["output"];
  updateProperty: Scalars["Boolean"]["output"];
  updateRepayment: Scalars["Boolean"]["output"];
  updateRepaymentScheduleStatus: Scalars["Boolean"]["output"];
  updateReview: Scalars["Boolean"]["output"];
  updateSupportLastSeen: Scalars["Boolean"]["output"];
  updateSupportRole: SupportRole;
  updateTailoringRule: TailoringRuleResponse;
  updateTempProject: Scalars["Boolean"]["output"];
  updateTempProjectPaymentStatus: Scalars["Boolean"]["output"];
  updateTermSheet: TermSheet;
  updateTicketStatus: Ticket;
  updateTransaction: Scalars["Boolean"]["output"];
  /** User: upload a compliance document against a template */
  uploadComplianceDocument: ComplianceUploadResponse;
  /**
   * Issuer — uploads or replaces the unsigned SPA. Issuer-only visibility: the
   * document stays `draft` until `sendSaleAgreementToBuyer`. The first upload
   * advances deposit_verified → sale_agreement_pending; a replacement is allowed
   * while the status is still `draft`.
   */
  uploadSaleAgreement: CashPurchaseTxn;
  uploadTransferDocument: Message;
  upsertAssessmentResponse: Scalars["ID"]["output"];
  verifyAssessmentDocument: Scalars["Boolean"]["output"];
  /** Issuer — confirms the 10% deposit landed in escrow. → deposit_verified */
  verifyCashDeposit: CashPurchaseTxn;
  /** Independent review flips a disbursement to VERIFIED or UNVERIFIABLE. */
  verifyDisbursement: OfferRequest;
  verifyEmail: Scalars["Boolean"]["output"];
  /** Second leg of an MFA login: exchange the emailed OTP for a session. */
  verifyLoginOtp: AuthPayload;
  verifyMfaOtp: MfaVerifyPayload;
  verifyRequestedRole: RoleVerifiedPayload;
  verifyUser: Scalars["Boolean"]["output"];
  votePoll: Message;
  waiveDocumentRequest: OfferRequest;
};

export type MutationAcceptCompanyInviteArgs = {
  token: Scalars["String"]["input"];
};

export type MutationAcceptOfferLetterArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationAcceptOfferRequestArgs = {
  input: AcceptOfferRequestInput;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationAcceptTermsSheetArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationAcknowledgeBorrowerLoanRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationActivateAssessmentArgs = {
  id: Scalars["ID"]["input"];
  officerId: Scalars["ID"]["input"];
  officerNotes?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationAddAttachmentCommentArgs = {
  attachmentId: Scalars["String"]["input"];
  content: Scalars["String"]["input"];
  messageId: Scalars["ID"]["input"];
};

export type MutationAddParticipantArgs = {
  input: AddParticipantInput;
};

export type MutationAddReactionArgs = {
  emoji: Scalars["String"]["input"];
  messageId: Scalars["ID"]["input"];
};

export type MutationAddReplyArgs = {
  content: Scalars["String"]["input"];
  messageId: Scalars["ID"]["input"];
};

export type MutationAddTicketCommentArgs = {
  body: Scalars["String"]["input"];
  ticketId: Scalars["ID"]["input"];
};

export type MutationAddUserForPushArgs = {
  input: AddUserForPushInput;
};

export type MutationApproveOfferRequestArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationApproveUserVerificationArgs = {
  role: Scalars["String"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MutationArchiveAssessmentArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationAssignSupportRoleArgs = {
  supportRoleId: Scalars["ID"]["input"];
  supportUserId: Scalars["Int"]["input"];
};

export type MutationAssignTicketArgs = {
  supportUserId: Scalars["Int"]["input"];
  ticketId: Scalars["ID"]["input"];
};

export type MutationAttachAssessmentDocumentFileArgs = {
  fileUrl?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
};

export type MutationBeginLoanDeclarationArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationBeginOfficerReviewArgs = {
  id: Scalars["ID"]["input"];
  officerId: Scalars["ID"]["input"];
};

export type MutationBeginRequestReviewArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationBulkCreatePreTokenizedUnitsArgs = {
  pretokenizedUnits: Array<PreTokenizedUnitInput>;
};

export type MutationBulkUpdatePreTokenizedUnitsByTypeArgs = {
  portfolioId: Scalars["ID"]["input"];
  pretokenizedUnits: Array<PreTokenizedUnitUpdateInput>;
  unitType: Scalars["String"]["input"];
};

export type MutationCancelDeclarationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationCheckLandArgs = {
  input: CheckLandInput;
};

export type MutationCompleteFinancingAssessmentArgs = {
  notes: Scalars["String"]["input"];
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationCompleteOnboardingArgs = {
  input?: InputMaybe<CompleteOnboardingInput>;
};

export type MutationComputeAssessmentScoreArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationConfirmCashSettlementArgs = {
  reference?: InputMaybe<Scalars["String"]["input"]>;
  transactionId: Scalars["ID"]["input"];
};

export type MutationConfirmConditionsPrecedentArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationContactUsArgs = {
  input: ContactUsInput;
};

export type MutationCountersignOfferLetterArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationCountersignSaleAgreementArgs = {
  signedCopyUrl?: InputMaybe<Scalars["String"]["input"]>;
  transactionId: Scalars["ID"]["input"];
};

export type MutationCreateAdminConversationArgs = {
  input: CreateAdminConversationInput;
};

export type MutationCreateAssessmentArgs = {
  input: CreateAssessmentInput;
};

export type MutationCreateAssessmentAlertRuleArgs = {
  input: CreateAssessmentAlertRuleInput;
};

export type MutationCreateAssessmentCategoryArgs = {
  input: CreateAssessmentCategoryInput;
};

export type MutationCreateAssessmentDocumentArgs = {
  input: CreateAssessmentDocumentInput;
};

export type MutationCreateAssessmentQuestionArgs = {
  input: CreateAssessmentQuestionInput;
};

export type MutationCreateAssessmentQuestionOptionArgs = {
  input: CreateAssessmentQuestionOptionInput;
};

export type MutationCreateAssessmentReadinessBandArgs = {
  input: CreateAssessmentReadinessBandInput;
};

export type MutationCreateAssessmentScoringBandArgs = {
  input: CreateAssessmentScoringBandInput;
};

export type MutationCreateAssessmentTemplateArgs = {
  input: CreateAssessmentTemplateInput;
};

export type MutationCreateAssetValueSnapshotArgs = {
  input: CreateAssetValueSnapshotInput;
};

export type MutationCreateBareLandProjectArgs = {
  input: CreateBareLandProjectInput;
};

export type MutationCreateBuyerProjectArgs = {
  input: CreateBuyerProjectInput;
};

export type MutationCreateCompanyRoleArgs = {
  entityId: Scalars["ID"]["input"];
  input: CreateEntityRoleInput;
};

export type MutationCreateComplianceSectionArgs = {
  input: CreateComplianceSectionInput;
};

export type MutationCreateComplianceTemplateArgs = {
  input: CreateComplianceTemplateInput;
};

export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};

export type MutationCreateDueDiligenceArgs = {
  input: CreateDueDiligenceInput;
};

export type MutationCreateLandArgs = {
  input: CreateLandInput;
};

export type MutationCreateOfferArgs = {
  input: CreateOfferInput;
};

export type MutationCreateOfferRequestArgs = {
  input: CreateOfferRequestInput;
};

export type MutationCreatePaymentScheduleArgs = {
  input: CreatePaymentScheduleInput;
};

export type MutationCreatePortfolioArgs = {
  input: CreatePortfolioInput;
};

export type MutationCreatePortfolioProjectWithUnitsArgs = {
  input: CreatePortfolioProjectWithUnitsInput;
};

export type MutationCreatePreTokenizedUnitArgs = {
  input: PreTokenizedUnitInput;
};

export type MutationCreateProjectArgs = {
  input: ProjectInput;
};

export type MutationCreatePropertyArgs = {
  input: PropertyInput;
  listingType: Scalars["String"]["input"];
  projectType: Scalars["String"]["input"];
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationCreateRepaymentArgs = {
  input: CreateRepaymentInput;
};

export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};

export type MutationCreateSimpleConversationArgs = {
  input: CreateSimpleConversationInput;
};

export type MutationCreateSupportRoleArgs = {
  input: CreateSupportRoleInput;
};

export type MutationCreateSupportUserArgs = {
  input: CreateSupportUserInput;
};

export type MutationCreateTailoringRuleArgs = {
  input: CreateTailoringRuleInput;
};

export type MutationCreateTempProjectArgs = {
  input: CreateTempProjectInput;
};

export type MutationCreateTermSheetArgs = {
  input: CreateTermSheetInput;
};

export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};

export type MutationDeclineOfferLetterArgs = {
  offerRequestId: Scalars["ID"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationDecryptMetadataArgs = {
  metadata: Scalars["JSON"]["input"];
};

export type MutationDeleteCompanyRoleArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteComplianceSectionArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteComplianceTemplateArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteConversationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteMessageArgs = {
  forEveryone?: InputMaybe<Scalars["Boolean"]["input"]>;
  messageId: Scalars["ID"]["input"];
};

export type MutationDeleteNotificationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteSupportRoleArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteTailoringRuleArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteTicketArgs = {
  ticketId: Scalars["ID"]["input"];
};

export type MutationDisburseFacilityArgs = {
  input: DisburseFacilityInput;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationDismissComplianceNotificationArgs = {
  id: Scalars["ID"]["input"];
  roleType: ComplianceRoleType;
};

export type MutationEditMessageArgs = {
  content: Scalars["JSONObject"]["input"];
  messageId: Scalars["ID"]["input"];
};

export type MutationEncryptMetadataArgs = {
  metadata: Scalars["JSON"]["input"];
};

export type MutationExtendOfferLetterDeadlineArgs = {
  newDeadline: Scalars["DateTime"]["input"];
  offerRequestId: Scalars["ID"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationExtendSigningDeadlineArgs = {
  newDeadline: Scalars["String"]["input"];
  transactionId: Scalars["ID"]["input"];
};

export type MutationFileDeclarationArgs = {
  input: FileDeclarationInput;
};

export type MutationGenerateTokenArgs = {
  email: Scalars["String"]["input"];
};

export type MutationGrantAssessmentFinancierShareArgs = {
  input: GrantAssessmentFinancierShareInput;
};

export type MutationGrantOfferRequestArgs = {
  input: GrantOfferRequestInput;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationImportAssessmentTemplateArgs = {
  input: ImportAssessmentTemplateInput;
};

export type MutationInitiateWalletDepositArgs = {
  amount: Scalars["Float"]["input"];
};

export type MutationInviteCompanyMemberArgs = {
  entityId: Scalars["ID"]["input"];
  input: InviteCompanyMemberInput;
};

export type MutationIssueDischargeArgs = {
  dischargeLetterUrl: Scalars["String"]["input"];
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationIssueLoanAgreementArgs = {
  loanDocumentUrl: Scalars["String"]["input"];
  offerRequestId: Scalars["ID"]["input"];
  signingDeadline?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type MutationIssueOfferLetterArgs = {
  acceptanceDeadline?: InputMaybe<Scalars["DateTime"]["input"]>;
  offerLetterUrl?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationIssueSaleAgreementArgs = {
  documentUrl: Scalars["String"]["input"];
  transactionId: Scalars["ID"]["input"];
  typedSignature?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationLoginAframSearchArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationLoginSupportUserArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationMarkAsPaidArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationMarkNotificationAsReadArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationNudgeFinancierArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationPlaceCashPurchaseArgs = {
  propertyId: Scalars["ID"]["input"];
};

export type MutationProceedToSettlementArgs = {
  transactionId: Scalars["ID"]["input"];
};

export type MutationPublishAssessmentTemplateArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationPublishPortfolioUnitsArgs = {
  portfolioId: Scalars["ID"]["input"];
  unitIds: Array<Scalars["ID"]["input"]>;
};

export type MutationReGenerateAccessTokenArgs = {
  refreshToken: Scalars["String"]["input"];
};

export type MutationReactivateAssessmentTemplateArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationReactivateCompanyMemberArgs = {
  memberId: Scalars["ID"]["input"];
};

export type MutationReissueLoanAgreementArgs = {
  offerRequestId: Scalars["ID"]["input"];
  reason: Scalars["String"]["input"];
};

export type MutationReissueSaleAgreementArgs = {
  reason: Scalars["String"]["input"];
  transactionId: Scalars["ID"]["input"];
};

export type MutationRejectAssessmentDocumentArgs = {
  id: Scalars["ID"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
  verifiedBy: Scalars["ID"]["input"];
};

export type MutationRejectOfferRequestArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationReleaseTokensToBuyerArgs = {
  input: ReleaseTokensToBuyerInput;
};

export type MutationRemoveAssessmentAlertRuleArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveAssessmentCategoryArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveAssessmentDocumentArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveAssessmentQuestionOptionArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveAssessmentReadinessBandArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveAssessmentScoringBandArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveCompanyMemberArgs = {
  memberId: Scalars["ID"]["input"];
};

export type MutationRemoveDueDiligenceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveLandArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveLoanArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveOfferArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveOfferDocumentRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveOfferRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemovePaymentScheduleArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemovePortfolioArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveProjectArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemovePropertyArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveReactionArgs = {
  messageId: Scalars["ID"]["input"];
};

export type MutationRemoveRepaymentArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveReviewArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveTempProjectArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveTermSheetArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRemoveTicketCommentArgs = {
  commentId: Scalars["ID"]["input"];
};

export type MutationRemoveTransactionArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationReplayWalletProvisioningArgs = {
  currency?: InputMaybe<Scalars["String"]["input"]>;
  dryRun?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  ownerIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type MutationRequestLoanAgreementChangesArgs = {
  offerRequestId: Scalars["ID"]["input"];
  reason: Scalars["String"]["input"];
};

export type MutationRequestOfferDocumentsArgs = {
  documents: Array<DocumentRequestItem>;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationRequestPasswordResetArgs = {
  email: Scalars["String"]["input"];
};

export type MutationRequestPaymentVerificationArgs = {
  conversationId: Scalars["ID"]["input"];
};

export type MutationRequestTermSheetChangesArgs = {
  message: Scalars["String"]["input"];
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationRequestWalletWithdrawalArgs = {
  amount: Scalars["Float"]["input"];
};

export type MutationResetPasswordArgs = {
  newPassword: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type MutationRetireAssessmentQuestionArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRetireAssessmentTemplateArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationReturnAssessmentArgs = {
  id: Scalars["ID"]["input"];
  officerId: Scalars["ID"]["input"];
  officerNotes?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationReviewOfferDocumentsArgs = {
  documents: Array<ReviewOfferDocumentItem>;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationRevokeAssessmentFinancierShareArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRevokeOfferArgs = {
  financierId: Scalars["ID"]["input"];
  offerId: Scalars["ID"]["input"];
};

export type MutationRevokeOfferRequestArgs = {
  financierId: Scalars["ID"]["input"];
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationSaveUserPolicyArgs = {
  input: SaveUserPolicyInput;
};

export type MutationSendDuePaymentSubscriptionEmailArgs = {
  input: EmailRecipientInput;
};

export type MutationSendMessageArgs = {
  input: SendMessageInput;
};

export type MutationSendMfaOtpArgs = {
  userId: Scalars["ID"]["input"];
};

export type MutationSendMfaOtpEmailArgs = {
  userId: Scalars["ID"]["input"];
};

export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
};

export type MutationSendOtpArgs = {
  email: Scalars["String"]["input"];
};

export type MutationSendPaymentReminderEmailArgs = {
  input: EmailRecipientInput;
};

export type MutationSendPaymentSubscriptionEmailArgs = {
  input: EmailRecipientInput;
};

export type MutationSendPaymentTermsAcceptanceEmailArgs = {
  input: PaymentTermsEmailInput;
};

export type MutationSendPaymentTermsConfirmationEmailArgs = {
  input: PaymentTermsEmailInput;
};

export type MutationSendPaymentVerificationEmailArgs = {
  input: EmailRecipientInput;
};

export type MutationSendRoleVerificationEmailArgs = {
  input: EmailRecipientInput;
};

export type MutationSendSaleAgreementToBuyerArgs = {
  signingDeadline?: InputMaybe<Scalars["String"]["input"]>;
  transactionId: Scalars["ID"]["input"];
};

export type MutationSendWelcomeEmailArgs = {
  input: EmailRecipientInput;
};

export type MutationSetConditionPrecedentStatusArgs = {
  input: ConditionPrecedentStatusInput;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationSetSupportUserInitialPasswordArgs = {
  input: SetSupportUserInitialPasswordInput;
};

export type MutationSettleCashPurchaseArgs = {
  method: Scalars["String"]["input"];
  transactionId: Scalars["ID"]["input"];
};

export type MutationSetupMfaArgs = {
  enabled: Scalars["Boolean"]["input"];
};

export type MutationSignAsBorrowerArgs = {
  loanDocumentUrl?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationSignAsLenderArgs = {
  loanDocumentUrl?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationSignSaleAgreementArgs = {
  acknowledgedTerms: Scalars["Boolean"]["input"];
  signedCopyUrl?: InputMaybe<Scalars["String"]["input"]>;
  transactionId: Scalars["ID"]["input"];
  typedSignature: Scalars["String"]["input"];
};

export type MutationSignupArgs = {
  input: SignupInput;
};

export type MutationSubmitAssessmentArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationSubmitBorrowerLoanRequestArgs = {
  input: SubmitBorrowerLoanRequestInput;
};

export type MutationSubmitConditionPrecedentEvidenceArgs = {
  conditionId: Scalars["ID"]["input"];
  offerRequestId: Scalars["ID"]["input"];
  supportingDocumentName?: InputMaybe<Scalars["String"]["input"]>;
  supportingDocumentUrl: Scalars["String"]["input"];
};

export type MutationSubmitOfferDocumentsArgs = {
  documents: Array<SubmitOfferDocumentItem>;
  offerRequestId: Scalars["ID"]["input"];
};

export type MutationSubscribeToPushNotificationArgs = {
  input: SubscribeToPushInput;
};

export type MutationSuspendCompanyMemberArgs = {
  memberId: Scalars["ID"]["input"];
};

export type MutationTailorEntityArgs = {
  entityId: Scalars["ID"]["input"];
};

export type MutationToggleOfferFavoriteArgs = {
  entityId: Scalars["ID"]["input"];
};

export type MutationTogglePropertyFavoriteArgs = {
  propertyId: Scalars["ID"]["input"];
};

export type MutationToggleSuspendUserArgs = {
  userId: Scalars["ID"]["input"];
};

export type MutationTokenizePropertyArgs = {
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  to: Scalars["ID"]["input"];
  uri: Scalars["String"]["input"];
};

export type MutationUnassignTicketArgs = {
  ticketId: Scalars["ID"]["input"];
};

export type MutationUpdateAssessmentArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentInput;
};

export type MutationUpdateAssessmentAlertRuleArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentAlertRuleInput;
};

export type MutationUpdateAssessmentCategoryArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentCategoryInput;
};

export type MutationUpdateAssessmentDocumentArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentDocumentInput;
};

export type MutationUpdateAssessmentQuestionArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentQuestionInput;
};

export type MutationUpdateAssessmentQuestionOptionArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentQuestionOptionInput;
};

export type MutationUpdateAssessmentReadinessBandArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentReadinessBandInput;
};

export type MutationUpdateAssessmentScoringBandArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentScoringBandInput;
};

export type MutationUpdateAssessmentTemplateArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateAssessmentTemplateInput;
};

export type MutationUpdateCompanyRoleArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateEntityRoleInput;
};

export type MutationUpdateComplianceSectionArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateComplianceSectionInput;
};

export type MutationUpdateComplianceSubmissionArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateComplianceSubmissionInput;
};

export type MutationUpdateComplianceTemplateArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateComplianceTemplateInput;
};

export type MutationUpdateConversationArgs = {
  input: UpdateConversationInput;
};

export type MutationUpdateConversationPaymentArgs = {
  conversationId: Scalars["ID"]["input"];
  paymentStatus: ConversationPaymentStatus;
};

export type MutationUpdateDueDiligenceArgs = {
  input: UpdateDueDiligenceInput;
};

export type MutationUpdateMemberRoleArgs = {
  entityRoleId: Scalars["ID"]["input"];
  memberId: Scalars["ID"]["input"];
};

export type MutationUpdateOfferArgs = {
  input: UpdateOfferInput;
};

export type MutationUpdateOfferDocumentRequestArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateDocumentRequestInput;
};

export type MutationUpdateOfferRequestArgs = {
  input: UpdateOfferRequestInput;
};

export type MutationUpdatePaymentScheduleArgs = {
  input: UpdatePaymentScheduleInput;
};

export type MutationUpdatePortfolioArgs = {
  input: UpdatePortfolioInput;
};

export type MutationUpdateProjectArgs = {
  id: Scalars["ID"]["input"];
  input: ProjectInput;
};

export type MutationUpdatePropertyArgs = {
  id: Scalars["ID"]["input"];
  input: PropertyInput;
};

export type MutationUpdateRepaymentArgs = {
  input: UpdateRepaymentInput;
};

export type MutationUpdateRepaymentScheduleStatusArgs = {
  id: Scalars["ID"]["input"];
  refNo: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};

export type MutationUpdateSupportRoleArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateSupportRoleInput;
};

export type MutationUpdateTailoringRuleArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateTailoringRuleInput;
};

export type MutationUpdateTempProjectArgs = {
  input: UpdateTempProjectInput;
};

export type MutationUpdateTempProjectPaymentStatusArgs = {
  id: Scalars["ID"]["input"];
  paymentStatus: Scalars["String"]["input"];
};

export type MutationUpdateTermSheetArgs = {
  id: Scalars["ID"]["input"];
  input: UpdateTermSheetInput;
};

export type MutationUpdateTicketStatusArgs = {
  status: TicketStatus;
  ticketId: Scalars["ID"]["input"];
};

export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};

export type MutationUploadComplianceDocumentArgs = {
  input: UploadComplianceDocumentInput;
};

export type MutationUploadSaleAgreementArgs = {
  documentUrl: Scalars["String"]["input"];
  transactionId: Scalars["ID"]["input"];
};

export type MutationUploadTransferDocumentArgs = {
  conversationId: Scalars["ID"]["input"];
  transferDoc: Scalars["String"]["input"];
};

export type MutationUpsertAssessmentResponseArgs = {
  input: UpsertAssessmentResponseInput;
};

export type MutationVerifyAssessmentDocumentArgs = {
  id: Scalars["ID"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
  verifiedBy: Scalars["ID"]["input"];
};

export type MutationVerifyCashDepositArgs = {
  transactionId: Scalars["ID"]["input"];
};

export type MutationVerifyDisbursementArgs = {
  disbursementId: Scalars["ID"]["input"];
  note?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId: Scalars["ID"]["input"];
  status: DisbursementVerificationStatus;
};

export type MutationVerifyEmailArgs = {
  email: Scalars["String"]["input"];
  otp: Scalars["String"]["input"];
};

export type MutationVerifyLoginOtpArgs = {
  otp: Scalars["String"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MutationVerifyMfaOtpArgs = {
  otp: Scalars["String"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MutationVerifyRequestedRoleArgs = {
  role: Scalars["String"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MutationVerifyUserArgs = {
  userId: Scalars["ID"]["input"];
};

export type MutationVotePollArgs = {
  messageId: Scalars["ID"]["input"];
  optionIndex: Scalars["Int"]["input"];
};

export type MutationWaiveDocumentRequestArgs = {
  offerRequestId: Scalars["ID"]["input"];
  reason: Scalars["String"]["input"];
};

export type Notification = {
  __typename?: "Notification";
  archivedAt?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  isArchived: Scalars["Boolean"]["output"];
  isRead: Scalars["Boolean"]["output"];
  message: Scalars["String"]["output"];
  metadata?: Maybe<Scalars["JSON"]["output"]>;
  readAt?: Maybe<Scalars["String"]["output"]>;
  recipientId: Scalars["String"]["output"];
  references?: Maybe<NotificationReferences>;
  senderId?: Maybe<Scalars["String"]["output"]>;
  senderName?: Maybe<Scalars["String"]["output"]>;
  senderType?: Maybe<SenderType>;
  templateType?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  type?: Maybe<NotificationType>;
  updatedAt: Scalars["String"]["output"];
};

export type NotificationFilter = {
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  isArchived?: InputMaybe<BooleanOperator>;
  isRead?: InputMaybe<BooleanOperator>;
  recipientId?: InputMaybe<IdOperator>;
  templateType?: InputMaybe<StringOperator>;
  type?: InputMaybe<NotificationTypeOperator>;
};

export type NotificationRecipientInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  pushToken?: InputMaybe<Scalars["String"]["input"]>;
};

export type NotificationReferences = {
  __typename?: "NotificationReferences";
  projectId?: Maybe<Scalars["String"]["output"]>;
  propertyId?: Maybe<Scalars["String"]["output"]>;
  roomId?: Maybe<Scalars["String"]["output"]>;
  transactionId?: Maybe<Scalars["String"]["output"]>;
};

export type NotificationSuccessResponse = {
  __typename?: "NotificationSuccessResponse";
  message?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type NotificationType =
  | "asset_division"
  | "interest"
  | "message"
  | "nft"
  | "offer"
  | "payment_confirmation"
  | "project_update"
  | "repayment_terms_acceptance"
  | "repayment_terms_update"
  | "system"
  | "transaction";

export type NotificationTypeOperator = {
  eq?: InputMaybe<NotificationType>;
  in?: InputMaybe<Array<NotificationType>>;
};

export type NumberOperator = {
  between?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  eq?: InputMaybe<Scalars["Float"]["input"]>;
  gt?: InputMaybe<Scalars["Float"]["input"]>;
  gte?: InputMaybe<Scalars["Float"]["input"]>;
  lt?: InputMaybe<Scalars["Float"]["input"]>;
  lte?: InputMaybe<Scalars["Float"]["input"]>;
};

export type NumberRange = {
  end: Scalars["Float"]["input"];
  start: Scalars["Float"]["input"];
};

export type Offer = {
  __typename?: "Offer";
  acceptedAt?: Maybe<Scalars["DateTime"]["output"]>;
  availabilityPeriodDays?: Maybe<Scalars["Int"]["output"]>;
  bondSubType?: Maybe<BondSubType>;
  commitmentFeeRate?: Maybe<Scalars["Float"]["output"]>;
  conditions?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  covenants?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
  depositPercentage?: Maybe<Scalars["Float"]["output"]>;
  drawdownSchedule?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  dsraMonths?: Maybe<Scalars["Int"]["output"]>;
  financier?: Maybe<Entity>;
  financierId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  interestRate?: Maybe<Scalars["JSONObject"]["output"]>;
  issuedAt?: Maybe<Scalars["DateTime"]["output"]>;
  lenderName?: Maybe<Scalars["String"]["output"]>;
  loanAgreementUrl?: Maybe<Scalars["String"]["output"]>;
  loanSubType?: Maybe<LoanSubType>;
  loanTenor?: Maybe<Scalars["JSONObject"]["output"]>;
  loanType?: Maybe<LoanType>;
  ltv?: Maybe<Scalars["Float"]["output"]>;
  maxLoanAmount?: Maybe<Scalars["Float"]["output"]>;
  moratorium?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  offerExpiryDate?: Maybe<Scalars["DateTime"]["output"]>;
  offerLetterUrl?: Maybe<Scalars["String"]["output"]>;
  offerRequest?: Maybe<OfferRequest>;
  offerRequestId?: Maybe<Scalars["ID"]["output"]>;
  offerStatus?: Maybe<OfferStatus>;
  otherFees?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  processingTimeline?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars["ID"]["output"]>;
  propertyName?: Maybe<Scalars["String"]["output"]>;
  rateType?: Maybe<RateType>;
  recipient?: Maybe<User>;
  recipientId?: Maybe<Scalars["ID"]["output"]>;
  repaymentFrequency?: Maybe<RepaymentFrequency>;
  repaymentType?: Maybe<RepaymentType>;
  revokedAt?: Maybe<Scalars["DateTime"]["output"]>;
  schedule?: Maybe<Scalars["JSONObject"]["output"]>;
  security?: Maybe<Scalars["JSONObject"]["output"]>;
  sources?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type OfferFilter = {
  financierId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  lenderName?: InputMaybe<StringOperator>;
  offerStatus?: InputMaybe<OfferStatus>;
  propertyId?: InputMaybe<IdOperator>;
  propertyName?: InputMaybe<StringOperator>;
  recipientId?: InputMaybe<IdOperator>;
};

/**
 * A borrower-facing projection of the issued Offer Letter, built from the snapshot
 * fields already on the granted Offer (no re-computation). Populated only once the
 * offer letter has been issued; null before then. Powers the Act 7 "In plain
 * English" summary — every figure here must already appear on the offer letter.
 */
export type OfferLetter = {
  __typename?: "OfferLetter";
  /** Acceptance deadline the lender set when issuing (see extendOfferLetterDeadline). */
  expiresAt?: Maybe<Scalars["DateTime"]["output"]>;
  fileName?: Maybe<Scalars["String"]["output"]>;
  fileUrl?: Maybe<Scalars["String"]["output"]>;
  interestRatePct?: Maybe<Scalars["Float"]["output"]>;
  /** When the lender issued the offer letter. */
  issuedAt?: Maybe<Scalars["DateTime"]["output"]>;
  loanAmount?: Maybe<Scalars["Float"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  tenorMonths?: Maybe<Scalars["Int"]["output"]>;
};

export type OfferRequest = {
  __typename?: "OfferRequest";
  agreedAmount?: Maybe<Scalars["Float"]["output"]>;
  approvedAt?: Maybe<Scalars["DateTime"]["output"]>;
  buyer?: Maybe<User>;
  buyerId?: Maybe<Scalars["ID"]["output"]>;
  conditionsPrecedent: Array<ConditionPrecedent>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  disbursements: Array<DisbursementRecord>;
  /** Document requests raised on this offer request, in request order. Lets the /offers list show per-request document progress in one query. */
  documents: Array<OfferRequestDocument>;
  financier?: Maybe<Entity>;
  financierId?: Maybe<Scalars["ID"]["output"]>;
  financingAssessmentNotes?: Maybe<Scalars["String"]["output"]>;
  grantedOffer?: Maybe<Offer>;
  id: Scalars["ID"]["output"];
  initialDeposit?: Maybe<Scalars["Float"]["output"]>;
  issuer?: Maybe<Entity>;
  issuerId?: Maybe<Scalars["ID"]["output"]>;
  /** Both parties' signatures on the loan agreement (borrower signs, lender countersigns). */
  loanAgreementSignatures: DocumentSignatures;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  modeOfFinancing?: Maybe<ModeOfFinancing>;
  offer?: Maybe<Scalars["JSONObject"]["output"]>;
  offerLetter?: Maybe<OfferLetter>;
  /** Both parties' signatures on the offer letter (borrower signs, lender countersigns). */
  offerLetterSignatures: DocumentSignatures;
  paymentStatus?: Maybe<OfferRequestPaymentStatus>;
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars["ID"]["output"]>;
  refNo?: Maybe<Scalars["String"]["output"]>;
  requestStatus?: Maybe<OfferRequestStatus>;
  requestedAmount: Scalars["Float"]["output"];
  /**
   * The borrower's outstanding request to revise the term sheet, or null if there
   * isn't one. Non-null means a term sheet was already issued and bounced back, so
   * the financier should revise the existing sheet (updateTermSheet) rather than
   * draft a new one (createTermSheet) — requestStatus can't tell you this, since
   * TERMSHEET_GENERATION covers both "never issued" and "changes requested".
   * Clears once the term sheet is reissued.
   */
  termSheetChangeRequest?: Maybe<TermSheetChangeRequest>;
  /** Every revision the borrower has asked for, oldest first. */
  termSheetChangeRequests: Array<TermSheetChangeRequest>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type OfferRequestDocument = {
  __typename?: "OfferRequestDocument";
  acceptedFileTypes: Array<Scalars["String"]["output"]>;
  count?: Maybe<Scalars["Int"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  documentCode?: Maybe<Scalars["String"]["output"]>;
  /** @deprecated First file only — use files. */
  documentUrl?: Maybe<Scalars["String"]["output"]>;
  dueDate?: Maybe<Scalars["String"]["output"]>;
  /** @deprecated First file only — use files. */
  fileName?: Maybe<Scalars["String"]["output"]>;
  /** Every file uploaded for this request. Always populated for reads (a legacy single-file row yields one element). */
  files: Array<OfferRequestDocumentFile>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  offerRequest?: Maybe<OfferRequest>;
  offerRequestId: Scalars["ID"]["output"];
  requestedBy?: Maybe<Entity>;
  requestedByEntityId: Scalars["ID"]["output"];
  required: Scalars["Boolean"]["output"];
  reviewedAt?: Maybe<Scalars["DateTime"]["output"]>;
  reviewerNotes?: Maybe<Scalars["String"]["output"]>;
  status: OfferRequestDocumentStatus;
  submittedAt?: Maybe<Scalars["DateTime"]["output"]>;
  submitterNotes?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

/** One uploaded file for a document request (a single front/back/month slot). */
export type OfferRequestDocumentFile = {
  __typename?: "OfferRequestDocumentFile";
  documentUrl: Scalars["String"]["output"];
  fileName?: Maybe<Scalars["String"]["output"]>;
  /** Human label for the slot this file fills — "Front", "Back", "Month 1"… */
  slotLabel?: Maybe<Scalars["String"]["output"]>;
};

export type OfferRequestDocumentFilter = {
  id?: InputMaybe<IdOperator>;
  offerRequestId?: InputMaybe<IdOperator>;
  requestedByEntityId?: InputMaybe<IdOperator>;
  status?: InputMaybe<OfferRequestDocumentStatus>;
};

export type OfferRequestDocumentStatus = "APPROVED" | "PENDING" | "REJECTED" | "SUBMITTED";

export type OfferRequestFilter = {
  buyerId?: InputMaybe<IdOperator>;
  createdAt?: InputMaybe<DateOperator>;
  financierId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  issuerId?: InputMaybe<IdOperator>;
  modeOfFinancing?: InputMaybe<ModeOfFinancing>;
  refNo?: InputMaybe<StringOperator>;
  requestStatus?: InputMaybe<OfferRequestStatus>;
  updatedAt?: InputMaybe<DateOperator>;
};

export type OfferRequestPaymentStatus = "PAID" | "PENDING";

export type OfferRequestStatus =
  | "ACCEPTED"
  | "APPROVED"
  | "CLOSED"
  | "CONDITIONS_PRECEDENT_CONFIRMED"
  | "CREDIT_ASSESSMENT"
  | "DISBURSED"
  | "DISCHARGE_ISSUED"
  | "DOCUMENTS_REQUESTED"
  | "DOCUMENTS_SUBMITTED"
  | "GRANTED"
  | "LOAN_AGREEMENT_BORROWER_SIGNED"
  | "LOAN_AGREEMENT_ISSUED"
  | "LOAN_AGREEMENT_SIGNED"
  | "OFFER_LETTER_ACCEPTED"
  | "OFFER_LETTER_BORROWER_SIGNED"
  | "OFFER_LETTER_DECLINED"
  | "OFFER_LETTER_ISSUED"
  | "PENDING"
  | "REJECTED"
  | "REPAYING"
  | "REVOKED"
  | "TERMSHEET_ACCEPTED"
  | "TERMSHEET_GENERATION"
  | "TERMSHEET_ISSUED"
  | "UNDER_REVIEW";

export type OfferStatus = "ACTIVE" | "COMPLETED" | "REVOKED";

export type Pagination = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type ParticipantInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  pic: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  walletAddress?: InputMaybe<Scalars["String"]["input"]>;
};

export type Payment = {
  __typename?: "Payment";
  amount: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency: Scalars["String"]["output"];
  externalRefNo?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  ledgerTransactionId?: Maybe<Scalars["ID"]["output"]>;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  receivedAt: Scalars["DateTime"]["output"];
  source: Scalars["String"]["output"];
};

export type PaymentApplication = {
  __typename?: "PaymentApplication";
  amountFees: Scalars["String"]["output"];
  amountInterest: Scalars["String"]["output"];
  amountPrincipal: Scalars["String"]["output"];
  appliedAt: Scalars["DateTime"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  direction: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  installmentId: Scalars["ID"]["output"];
  paymentId: Scalars["ID"]["output"];
  reversedByApplicationId?: Maybe<Scalars["ID"]["output"]>;
  reversesApplicationId?: Maybe<Scalars["ID"]["output"]>;
};

/** Stream 2 — an actual PSP payment against a loan (never merged with declarations). */
export type PaymentEvent = {
  __typename?: "PaymentEvent";
  amount: Scalars["Float"]["output"];
  currency: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  loanId?: Maybe<Scalars["ID"]["output"]>;
  offerRequestId: Scalars["ID"]["output"];
  paymentDate: Scalars["DateTime"]["output"];
  paymentStatus: PaymentEventStatus;
  pspName: Scalars["String"]["output"];
  pspReference: Scalars["String"]["output"];
  railType: PaymentRail;
  recordedAt: Scalars["DateTime"]["output"];
  /** Set on a reversal — the id of the payment event it reverses. */
  reversalOf?: Maybe<Scalars["ID"]["output"]>;
};

export type PaymentEventStatus = "Confirmed" | "Failed" | "PendingSettlement" | "Reversed";

export type PaymentRail = "BankTransfer" | "Manual" | "MobileMoney";

export type PaymentSchedule = {
  __typename?: "PaymentSchedule";
  conversationId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["ID"]["output"]>;
  createdForId?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  interestRate?: Maybe<Scalars["Float"]["output"]>;
  interestRateBps?: Maybe<Scalars["Int"]["output"]>;
  interestRateKind?: Maybe<Scalars["String"]["output"]>;
  loanId?: Maybe<Scalars["ID"]["output"]>;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  offerRequestId?: Maybe<Scalars["ID"]["output"]>;
  principalMinor?: Maybe<Scalars["String"]["output"]>;
  repaymentFrequency?: Maybe<Scalars["String"]["output"]>;
  repaymentTerms?: Maybe<Scalars["JSONObject"]["output"]>;
  scheduleType?: Maybe<Scalars["String"]["output"]>;
  totalInterestMinor?: Maybe<Scalars["String"]["output"]>;
  totalRepaymentMinor?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type PaymentScheduleFilter = {
  conversationId?: InputMaybe<IdOperator>;
  createdById?: InputMaybe<IdOperator>;
  createdForId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  loanId?: InputMaybe<IdOperator>;
  offerRequestId?: InputMaybe<IdOperator>;
};

export type PaymentStatus = "OVERDUE" | "PAID" | "PENDING";

export type PaymentTermsAndSchedule = {
  __typename?: "PaymentTermsAndSchedule";
  baseRefNo: Scalars["String"]["output"];
  conversationId: Scalars["ID"]["output"];
  createdBy: UserReference;
  createdFor: UserReference;
  interestRate: InterestRate;
  loanScheduleType: LoanScheduleType;
  loanSubType: LoanSubType;
  maxAmount: Scalars["Float"]["output"];
  offerRequestId: Scalars["ID"]["output"];
  propertyId: Scalars["ID"]["output"];
  propertyName: Scalars["String"]["output"];
  repaymentFrequency: RepaymentFrequency;
  repaymentTerms: RepaymentTerms;
  scheduleType: ScheduleType;
  tenor: Tenor;
  termSchedule: Array<YearlyTermSchedule>;
  totalInterest: Scalars["Float"]["output"];
  totalRepayment: Scalars["Float"]["output"];
  transactionId?: Maybe<Scalars["ID"]["output"]>;
  userId: Scalars["ID"]["output"];
};

export type PaymentTermsAndScheduleInput = {
  additionalInterest?: InputMaybe<Scalars["Float"]["input"]>;
  baseRefNo?: InputMaybe<Scalars["String"]["input"]>;
  createdBy?: InputMaybe<UserReferenceInput>;
  createdFor?: InputMaybe<UserReferenceInput>;
  interestRate?: InputMaybe<InterestRateInput>;
  isSubscribedToReferenceRate?: InputMaybe<Scalars["Boolean"]["input"]>;
  loanScheduleType?: InputMaybe<LoanScheduleType>;
  loanSubType?: InputMaybe<LoanSubType>;
  maxAmount?: InputMaybe<Scalars["Float"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<Scalars["String"]["input"]>;
  repaymentTerms?: InputMaybe<RepaymentTermsInput>;
  tenor?: InputMaybe<TenorInput>;
  termSchedule?: InputMaybe<Array<YearlyTermScheduleInput>>;
  totalInterest?: InputMaybe<Scalars["Float"]["input"]>;
  totalRepayment?: InputMaybe<Scalars["Float"]["input"]>;
};

export type PaymentTermsEmailInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  payload?: InputMaybe<Scalars["JSON"]["input"]>;
  repaymentId?: InputMaybe<Scalars["String"]["input"]>;
  scheduleId?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type PenaltyType = "FLAT" | "NONE" | "PERCENTAGE";

export type PendingVerificationsPayload = {
  __typename?: "PendingVerificationsPayload";
  limit: Scalars["Int"]["output"];
  page: Scalars["Int"]["output"];
  requests: Array<RoleRequest>;
  total: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type Portfolio = {
  __typename?: "Portfolio";
  additionalFiles?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  construction?: Maybe<Construction>;
  constructionCommencementDate?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["String"]["output"]>;
  epaPermitNumber?: Maybe<Scalars["String"]["output"]>;
  gpsAddress?: Maybe<Scalars["String"]["output"]>;
  grossDevelopmentValue?: Maybe<Scalars["Float"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  isCompleted?: Maybe<Scalars["Boolean"]["output"]>;
  landValuationAmount?: Maybe<Scalars["Float"]["output"]>;
  landValuer?: Maybe<Scalars["String"]["output"]>;
  listingObjective?: Maybe<Scalars["String"]["output"]>;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  ownerId?: Maybe<Scalars["String"]["output"]>;
  planningPermitNumber?: Maybe<Scalars["String"]["output"]>;
  portfolioType?: Maybe<Scalars["String"]["output"]>;
  practicalCompletionDate?: Maybe<Scalars["String"]["output"]>;
  projectCost?: Maybe<ProjectCost>;
  projectDescription?: Maybe<Scalars["String"]["output"]>;
  projectImages?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  projectName?: Maybe<Scalars["String"]["output"]>;
  projectStatus?: Maybe<Scalars["String"]["output"]>;
  projectType?: Maybe<Scalars["String"]["output"]>;
  properties?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  propertyTypes?: Maybe<Array<Maybe<PropertyTypes>>>;
  readiness?: Maybe<Scalars["Int"]["output"]>;
  sessionId?: Maybe<Scalars["String"]["output"]>;
  sharedAmenities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  squareFeet?: Maybe<Scalars["Int"]["output"]>;
  streetAddress?: Maybe<Scalars["String"]["output"]>;
  titleNumber?: Maybe<Scalars["String"]["output"]>;
  totalDevelopmentCost?: Maybe<Scalars["Float"]["output"]>;
  updatedAt?: Maybe<Scalars["String"]["output"]>;
  views?: Maybe<Scalars["Int"]["output"]>;
  yearBuilt?: Maybe<Scalars["String"]["output"]>;
};

export type PortfolioContext = {
  __typename?: "PortfolioContext";
  portfolioId: Scalars["ID"]["output"];
  portfolioType: Scalars["String"]["output"];
  projectName?: Maybe<Scalars["String"]["output"]>;
  sharedAmenities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  totalUnits: Scalars["Int"]["output"];
};

export type PortfolioFilter = {
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
};

export type PortfolioProjectUnitInput = {
  backyard?: InputMaybe<Scalars["Int"]["input"]>;
  bedroom?: InputMaybe<Scalars["Int"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  diningArea?: InputMaybe<Scalars["Int"]["input"]>;
  fullBathroom?: InputMaybe<Scalars["Int"]["input"]>;
  fullKitchen?: InputMaybe<Scalars["Int"]["input"]>;
  halfBathroom?: InputMaybe<Scalars["Int"]["input"]>;
  kitchenette?: InputMaybe<Scalars["Int"]["input"]>;
  livingRoom?: InputMaybe<Scalars["Int"]["input"]>;
  office?: InputMaybe<Scalars["Int"]["input"]>;
  patio?: InputMaybe<Scalars["Int"]["input"]>;
  price: Scalars["Float"]["input"];
  projectImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  propertyAmenities?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  propertyCardDesc?: InputMaybe<Scalars["String"]["input"]>;
  propertyDescription?: InputMaybe<Scalars["String"]["input"]>;
  propertyNameOrNumber?: InputMaybe<Scalars["String"]["input"]>;
  propertyType?: InputMaybe<Scalars["String"]["input"]>;
  squareFeet?: InputMaybe<Scalars["Int"]["input"]>;
  thumbnail?: InputMaybe<Scalars["String"]["input"]>;
};

export type PortfolioProjectWithUnitsResult = {
  __typename?: "PortfolioProjectWithUnitsResult";
  portfolioId?: Maybe<Scalars["ID"]["output"]>;
  projectId?: Maybe<Scalars["ID"]["output"]>;
  success: Scalars["Boolean"]["output"];
  unitIds?: Maybe<Array<Maybe<Scalars["ID"]["output"]>>>;
};

export type PreTokenizedUnit = {
  __typename?: "PreTokenizedUnit";
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  metaData?: Maybe<PreTokenizedUnitMetadata>;
  numberOfUnits: Scalars["Int"]["output"];
  ownerId: Scalars["ID"]["output"];
  paymentStatus: Scalars["String"]["output"];
  portfolioId: Scalars["ID"]["output"];
  status: Scalars["String"]["output"];
  unitCoverImage?: Maybe<Scalars["String"]["output"]>;
  unitId: Scalars["String"]["output"];
  unitType: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type PreTokenizedUnitFilter = {
  id?: InputMaybe<IdOperator>;
  paymentStatus?: InputMaybe<StringOperator>;
  portfolioId?: InputMaybe<IdOperator>;
  status?: InputMaybe<StringOperator>;
  unitType?: InputMaybe<StringOperator>;
};

export type PreTokenizedUnitInput = {
  metaData?: InputMaybe<PreTokenizedUnitMetadataInput>;
  numberOfUnits?: InputMaybe<Scalars["Int"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  portfolioId: Scalars["ID"]["input"];
  status?: InputMaybe<Scalars["String"]["input"]>;
  unitCoverImage?: InputMaybe<Scalars["String"]["input"]>;
  unitId: Scalars["String"]["input"];
  unitType: Scalars["String"]["input"];
};

export type PreTokenizedUnitMetadata = {
  __typename?: "PreTokenizedUnitMetadata";
  area?: Maybe<Scalars["String"]["output"]>;
  availableFrom?: Maybe<Scalars["String"]["output"]>;
  bedroom?: Maybe<Scalars["Int"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  district?: Maybe<Scalars["String"]["output"]>;
  floor?: Maybe<Scalars["String"]["output"]>;
  floorPlanUrl?: Maybe<Scalars["String"]["output"]>;
  fullBathroom?: Maybe<Scalars["Int"]["output"]>;
  hasUnitDeed?: Maybe<Scalars["Boolean"]["output"]>;
  headline?: Maybe<Scalars["String"]["output"]>;
  houseNumber?: Maybe<Scalars["String"]["output"]>;
  latA?: Maybe<Scalars["String"]["output"]>;
  latB?: Maybe<Scalars["String"]["output"]>;
  legalDescOfProperty?: Maybe<Scalars["String"]["output"]>;
  listingType?: Maybe<Scalars["String"]["output"]>;
  lngA?: Maybe<Scalars["String"]["output"]>;
  lngB?: Maybe<Scalars["String"]["output"]>;
  municipality?: Maybe<Scalars["String"]["output"]>;
  price?: Maybe<Scalars["Float"]["output"]>;
  projectAmenities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  projectImages?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  projectNameOrNumber?: Maybe<Scalars["String"]["output"]>;
  projectStatus?: Maybe<Scalars["String"]["output"]>;
  projectType?: Maybe<Scalars["String"]["output"]>;
  propertyDescription?: Maybe<Scalars["String"]["output"]>;
  propertyUse?: Maybe<Scalars["String"]["output"]>;
  region?: Maybe<Scalars["String"]["output"]>;
  squareFeet?: Maybe<Scalars["Float"]["output"]>;
  unitDeedUrl?: Maybe<Scalars["String"]["output"]>;
};

export type PreTokenizedUnitMetadataInput = {
  area?: InputMaybe<Scalars["String"]["input"]>;
  availableFrom?: InputMaybe<Scalars["String"]["input"]>;
  bedroom?: InputMaybe<Scalars["Int"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  district?: InputMaybe<Scalars["String"]["input"]>;
  floor?: InputMaybe<Scalars["String"]["input"]>;
  floorPlanUrl?: InputMaybe<Scalars["String"]["input"]>;
  fullBathroom?: InputMaybe<Scalars["Int"]["input"]>;
  hasUnitDeed?: InputMaybe<Scalars["Boolean"]["input"]>;
  headline?: InputMaybe<Scalars["String"]["input"]>;
  houseNumber?: InputMaybe<Scalars["String"]["input"]>;
  latA?: InputMaybe<Scalars["String"]["input"]>;
  latB?: InputMaybe<Scalars["String"]["input"]>;
  legalDescOfProperty?: InputMaybe<Scalars["String"]["input"]>;
  listingType?: InputMaybe<Scalars["String"]["input"]>;
  lngA?: InputMaybe<Scalars["String"]["input"]>;
  lngB?: InputMaybe<Scalars["String"]["input"]>;
  municipality?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["Float"]["input"]>;
  projectAmenities?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  projectNameOrNumber?: InputMaybe<Scalars["String"]["input"]>;
  projectStatus?: InputMaybe<Scalars["String"]["input"]>;
  projectType?: InputMaybe<Scalars["String"]["input"]>;
  propertyDescription?: InputMaybe<Scalars["String"]["input"]>;
  propertyUse?: InputMaybe<Scalars["String"]["input"]>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  squareFeet?: InputMaybe<Scalars["Float"]["input"]>;
  unitDeedUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type PreTokenizedUnitUpdateInput = {
  metaData?: InputMaybe<PreTokenizedUnitMetadataInput>;
  numberOfUnits?: InputMaybe<Scalars["Int"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  unitCoverImage?: InputMaybe<Scalars["String"]["input"]>;
  unitId?: InputMaybe<Scalars["String"]["input"]>;
  unitType?: InputMaybe<Scalars["String"]["input"]>;
};

export type PrepaymentFeeType = "FLAT" | "NONE" | "PERCENTAGE";

export type PrepaymentTerms = {
  __typename?: "PrepaymentTerms";
  allowed: Scalars["Boolean"]["output"];
  days: Scalars["Int"]["output"];
  feeAmount: Scalars["Float"]["output"];
  feePercentage: Scalars["Float"]["output"];
  feeType: PrepaymentFeeType;
};

export type PrepaymentTermsInput = {
  allowed?: InputMaybe<Scalars["Boolean"]["input"]>;
  days?: InputMaybe<Scalars["Int"]["input"]>;
  feeAmount?: InputMaybe<Scalars["Float"]["input"]>;
  feePercentage?: InputMaybe<Scalars["Float"]["input"]>;
  feeType?: InputMaybe<PrepaymentFeeType>;
};

export type Project = {
  __typename?: "Project";
  createdAt?: Maybe<Scalars["String"]["output"]>;
  divisionDate?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  isDivided?: Maybe<Scalars["Boolean"]["output"]>;
  isTokenized?: Maybe<Scalars["Boolean"]["output"]>;
  listingType?: Maybe<Scalars["String"]["output"]>;
  nftAddress?: Maybe<Scalars["String"]["output"]>;
  nftTokenId?: Maybe<Scalars["String"]["output"]>;
  nftTokenUri?: Maybe<Scalars["String"]["output"]>;
  ownerId?: Maybe<Scalars["String"]["output"]>;
  ownerWalletAddress?: Maybe<Scalars["String"]["output"]>;
  owners?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  portfolio?: Maybe<Portfolio>;
  projectId?: Maybe<Scalars["String"]["output"]>;
  projectType?: Maybe<Scalars["String"]["output"]>;
  property?: Maybe<Property>;
  shareToken?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  tokenizationTimestamp?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["String"]["output"]>;
};

export type ProjectCost = {
  __typename?: "ProjectCost";
  adminAndOther?: Maybe<Scalars["Int"]["output"]>;
  construction?: Maybe<Scalars["Int"]["output"]>;
  contingency?: Maybe<Scalars["Int"]["output"]>;
  depositRequired?: Maybe<Scalars["Int"]["output"]>;
  designAndEng?: Maybe<Scalars["Int"]["output"]>;
  financingAvailable?: Maybe<Scalars["Boolean"]["output"]>;
  land?: Maybe<Scalars["Int"]["output"]>;
  marketingOrSales?: Maybe<Scalars["Int"]["output"]>;
  maxAmountAvailable?: Maybe<Scalars["Int"]["output"]>;
  paymentTerms?: Maybe<Scalars["String"]["output"]>;
  paymentType?: Maybe<Scalars["String"]["output"]>;
  price?: Maybe<Scalars["Int"]["output"]>;
  serviceFee?: Maybe<Scalars["Int"]["output"]>;
};

export type ProjectCostInput = {
  adminAndOther?: InputMaybe<Scalars["Int"]["input"]>;
  construction?: InputMaybe<Scalars["Int"]["input"]>;
  contingency?: InputMaybe<Scalars["Int"]["input"]>;
  depositRequired?: InputMaybe<Scalars["Int"]["input"]>;
  designAndEng?: InputMaybe<Scalars["Int"]["input"]>;
  financingAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  land?: InputMaybe<Scalars["Int"]["input"]>;
  marketingOrSales?: InputMaybe<Scalars["Int"]["input"]>;
  maxAmountAvailable?: InputMaybe<Scalars["Int"]["input"]>;
  paymentTerms?: InputMaybe<Scalars["String"]["input"]>;
  paymentType?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["Int"]["input"]>;
  serviceFee?: InputMaybe<Scalars["Int"]["input"]>;
};

export type ProjectFilter = {
  id?: InputMaybe<IdOperator>;
  isDivided?: InputMaybe<BooleanOperator>;
  isTokenized?: InputMaybe<BooleanOperator>;
  listingType?: InputMaybe<StringOperator>;
  ownerId?: InputMaybe<IdOperator>;
  projectId?: InputMaybe<IdOperator>;
  projectType?: InputMaybe<StringOperator>;
  status?: InputMaybe<StringOperator>;
};

export type ProjectInput = {
  isDivided?: InputMaybe<Scalars["Boolean"]["input"]>;
  isTokenized?: InputMaybe<Scalars["Boolean"]["input"]>;
  listingType?: InputMaybe<Scalars["String"]["input"]>;
  nftAddress?: InputMaybe<Scalars["String"]["input"]>;
  nftTokenId?: InputMaybe<Scalars["String"]["input"]>;
  nftTokenUri?: InputMaybe<Scalars["String"]["input"]>;
  ownerWalletAddress?: InputMaybe<Scalars["String"]["input"]>;
  owners?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  projectId?: InputMaybe<Scalars["ID"]["input"]>;
  projectType?: InputMaybe<Scalars["String"]["input"]>;
  shareToken?: InputMaybe<Scalars["Int"]["input"]>;
  tokenizationTimestamp?: InputMaybe<Scalars["String"]["input"]>;
};

export type Property = {
  __typename?: "Property";
  adminAndOther?: Maybe<Scalars["Float"]["output"]>;
  area?: Maybe<Scalars["String"]["output"]>;
  backyard?: Maybe<Scalars["Int"]["output"]>;
  barcodeTitlePlan?: Maybe<Scalars["String"]["output"]>;
  barcodedSitePlan?: Maybe<Scalars["String"]["output"]>;
  bedroom?: Maybe<Scalars["Int"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  consentData?: Maybe<Scalars["String"]["output"]>;
  construction?: Maybe<Scalars["Float"]["output"]>;
  contingency?: Maybe<Scalars["Float"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
  dateOfIssue?: Maybe<Scalars["String"]["output"]>;
  dateOfStamping?: Maybe<Scalars["String"]["output"]>;
  dateOfTransfer?: Maybe<Scalars["String"]["output"]>;
  depositRequired?: Maybe<Scalars["Float"]["output"]>;
  designAndEng?: Maybe<Scalars["Float"]["output"]>;
  diningArea?: Maybe<Scalars["Int"]["output"]>;
  dividedUnits?: Maybe<Array<Maybe<Scalars["ID"]["output"]>>>;
  divisionDate?: Maybe<Scalars["DateTime"]["output"]>;
  dueDiligenceId?: Maybe<Scalars["ID"]["output"]>;
  estimatedPrice?: Maybe<Scalars["Float"]["output"]>;
  financingAvailable?: Maybe<Scalars["Boolean"]["output"]>;
  floorAreaSqm?: Maybe<Scalars["Float"]["output"]>;
  fullBathroom?: Maybe<Scalars["Int"]["output"]>;
  fullKitchen?: Maybe<Scalars["Int"]["output"]>;
  gpsAddress?: Maybe<Scalars["String"]["output"]>;
  halfBathroom?: Maybe<Scalars["Int"]["output"]>;
  houseNumber?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  independentValuer?: Maybe<Scalars["String"]["output"]>;
  interestHeld?: Maybe<Scalars["String"]["output"]>;
  isDivided?: Maybe<Scalars["Boolean"]["output"]>;
  isFavorited?: Maybe<Scalars["Boolean"]["output"]>;
  isTokenized?: Maybe<Scalars["Boolean"]["output"]>;
  kitchenette?: Maybe<Scalars["Int"]["output"]>;
  land?: Maybe<Scalars["Float"]["output"]>;
  landCertificateNumber?: Maybe<Scalars["String"]["output"]>;
  landTitleUrl?: Maybe<Scalars["String"]["output"]>;
  legalDescOfProperty?: Maybe<Scalars["String"]["output"]>;
  legalDocs?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  listingObjective?: Maybe<Scalars["String"]["output"]>;
  livingRoom?: Maybe<Scalars["Int"]["output"]>;
  marketingOrSales?: Maybe<Scalars["Float"]["output"]>;
  maxAmountAvailable?: Maybe<Scalars["Float"]["output"]>;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  numberOfUnits?: Maybe<Scalars["Int"]["output"]>;
  office?: Maybe<Scalars["Int"]["output"]>;
  owner?: Maybe<Entity>;
  ownerId: Scalars["ID"]["output"];
  ownersGrantor?: Maybe<Scalars["String"]["output"]>;
  parcelId?: Maybe<Scalars["String"]["output"]>;
  parentNftAddress?: Maybe<Scalars["String"]["output"]>;
  parentNftTokenId?: Maybe<Scalars["String"]["output"]>;
  parentPropertyId?: Maybe<Scalars["ID"]["output"]>;
  patio?: Maybe<Scalars["Int"]["output"]>;
  paymentTerms?: Maybe<Scalars["String"]["output"]>;
  paymentType?: Maybe<Scalars["String"]["output"]>;
  portfolio?: Maybe<PortfolioContext>;
  portfolioId?: Maybe<Scalars["ID"]["output"]>;
  price: Scalars["Float"]["output"];
  projectImages?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  projectStatus?: Maybe<Scalars["String"]["output"]>;
  propertyAmenities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  propertyCardDesc?: Maybe<Scalars["String"]["output"]>;
  propertyDescription?: Maybe<Scalars["String"]["output"]>;
  propertyNameOrNumber?: Maybe<Scalars["String"]["output"]>;
  propertyType?: Maybe<Scalars["String"]["output"]>;
  propertyUse?: Maybe<Scalars["String"]["output"]>;
  readiness?: Maybe<Scalars["Int"]["output"]>;
  region?: Maybe<Scalars["String"]["output"]>;
  serviceFee?: Maybe<Scalars["Float"]["output"]>;
  siteCoordinates?: Maybe<Scalars["JSONObject"]["output"]>;
  squareFeet?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<PropertyStatus>;
  streetAddress?: Maybe<Scalars["String"]["output"]>;
  streetName?: Maybe<Scalars["String"]["output"]>;
  termHeld?: Maybe<Scalars["String"]["output"]>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  titleHolder?: Maybe<Scalars["String"]["output"]>;
  titleType?: Maybe<Scalars["String"]["output"]>;
  transactionId?: Maybe<Scalars["ID"]["output"]>;
  transferDeedNumber?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  valuationAmount?: Maybe<Scalars["Float"]["output"]>;
  valuationDate?: Maybe<Scalars["String"]["output"]>;
  views?: Maybe<Scalars["Int"]["output"]>;
  yearBuilt?: Maybe<Scalars["Int"]["output"]>;
};

export type PropertyFilter = {
  excludeOwnerId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  isTokenized?: InputMaybe<BooleanOperator>;
  ownerId?: InputMaybe<IdOperator>;
  portfolioId?: InputMaybe<IdOperator>;
  status?: InputMaybe<PropertyStatus>;
};

export type PropertyInput = {
  adminAndOther?: InputMaybe<Scalars["Float"]["input"]>;
  area?: InputMaybe<Scalars["String"]["input"]>;
  backyard?: InputMaybe<Scalars["Int"]["input"]>;
  barcodeTitlePlan?: InputMaybe<Scalars["String"]["input"]>;
  barcodedSitePlan?: InputMaybe<Scalars["String"]["input"]>;
  bedroom?: InputMaybe<Scalars["Int"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  consentData?: InputMaybe<Scalars["String"]["input"]>;
  construction?: InputMaybe<Scalars["Float"]["input"]>;
  contingency?: InputMaybe<Scalars["Float"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  dateOfIssue?: InputMaybe<Scalars["String"]["input"]>;
  dateOfStamping?: InputMaybe<Scalars["String"]["input"]>;
  dateOfTransfer?: InputMaybe<Scalars["String"]["input"]>;
  depositRequired?: InputMaybe<Scalars["Float"]["input"]>;
  designAndEng?: InputMaybe<Scalars["Float"]["input"]>;
  diningArea?: InputMaybe<Scalars["Int"]["input"]>;
  dividedUnits?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  divisionDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  dueDiligenceId?: InputMaybe<Scalars["ID"]["input"]>;
  estimatedPrice?: InputMaybe<Scalars["Float"]["input"]>;
  financingAvailable?: InputMaybe<Scalars["Boolean"]["input"]>;
  floorAreaSqm?: InputMaybe<Scalars["Float"]["input"]>;
  fullBathroom?: InputMaybe<Scalars["Int"]["input"]>;
  fullKitchen?: InputMaybe<Scalars["Int"]["input"]>;
  gpsAddress?: InputMaybe<Scalars["String"]["input"]>;
  halfBathroom?: InputMaybe<Scalars["Int"]["input"]>;
  houseNumber?: InputMaybe<Scalars["String"]["input"]>;
  independentValuer?: InputMaybe<Scalars["String"]["input"]>;
  interestHeld?: InputMaybe<Scalars["String"]["input"]>;
  isDivided?: InputMaybe<Scalars["Boolean"]["input"]>;
  kitchenette?: InputMaybe<Scalars["Int"]["input"]>;
  land?: InputMaybe<Scalars["Float"]["input"]>;
  landCertificateNumber?: InputMaybe<Scalars["String"]["input"]>;
  landTitleUrl?: InputMaybe<Scalars["String"]["input"]>;
  legalDescOfProperty?: InputMaybe<Scalars["String"]["input"]>;
  legalDocs?: InputMaybe<Array<InputMaybe<LegalDocsInput>>>;
  listingObjective?: InputMaybe<Scalars["String"]["input"]>;
  livingRoom?: InputMaybe<Scalars["Int"]["input"]>;
  marketingOrSales?: InputMaybe<Scalars["Float"]["input"]>;
  maxAmountAvailable?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  numberOfUnits?: InputMaybe<Scalars["Int"]["input"]>;
  office?: InputMaybe<Scalars["Int"]["input"]>;
  ownersGrantor?: InputMaybe<Scalars["String"]["input"]>;
  parcelId?: InputMaybe<Scalars["String"]["input"]>;
  parentNftAddress?: InputMaybe<Scalars["String"]["input"]>;
  parentNftTokenId?: InputMaybe<Scalars["String"]["input"]>;
  parentPropertyId?: InputMaybe<Scalars["ID"]["input"]>;
  patio?: InputMaybe<Scalars["Int"]["input"]>;
  paymentTerms?: InputMaybe<Scalars["String"]["input"]>;
  paymentType?: InputMaybe<Scalars["String"]["input"]>;
  portfolioId?: InputMaybe<Scalars["ID"]["input"]>;
  price?: InputMaybe<Scalars["Float"]["input"]>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  projectStatus?: InputMaybe<Scalars["String"]["input"]>;
  propertyAmenities?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  propertyCardDesc?: InputMaybe<Scalars["String"]["input"]>;
  propertyDescription?: InputMaybe<Scalars["String"]["input"]>;
  propertyNameOrNumber?: InputMaybe<Scalars["String"]["input"]>;
  propertyType?: InputMaybe<Scalars["String"]["input"]>;
  propertyUse?: InputMaybe<Scalars["String"]["input"]>;
  readiness?: InputMaybe<Scalars["Int"]["input"]>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  serviceFee?: InputMaybe<Scalars["Float"]["input"]>;
  siteCoordinates?: InputMaybe<Scalars["JSONObject"]["input"]>;
  squareFeet?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<PropertyStatus>;
  streetAddress?: InputMaybe<Scalars["String"]["input"]>;
  streetName?: InputMaybe<Scalars["String"]["input"]>;
  termHeld?: InputMaybe<Scalars["String"]["input"]>;
  thumbnail?: InputMaybe<Scalars["String"]["input"]>;
  titleHolder?: InputMaybe<Scalars["String"]["input"]>;
  titleType?: InputMaybe<Scalars["String"]["input"]>;
  transactionId?: InputMaybe<Scalars["ID"]["input"]>;
  transferDeedNumber?: InputMaybe<Scalars["String"]["input"]>;
  valuationAmount?: InputMaybe<Scalars["Float"]["input"]>;
  valuationDate?: InputMaybe<Scalars["String"]["input"]>;
  yearBuilt?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PropertyPipelineBucket = {
  __typename?: "PropertyPipelineBucket";
  count: Scalars["Int"]["output"];
  label: Scalars["String"]["output"];
  stage: PropertyPipelineStage;
  total: Scalars["Int"]["output"];
};

export type PropertyPipelineStage = "ACTIVE" | "CLOSED" | "DRAFT" | "IN_REVIEW" | "TOKENIZED";

export type PropertyStatus =
  "delisted" | "divided" | "listed" | "pending" | "sold" | "subdivision" | "unlisted";

export type PropertyTypes = {
  __typename?: "PropertyTypes";
  currency?: Maybe<Scalars["String"]["output"]>;
  estimatedPrice?: Maybe<Scalars["Int"]["output"]>;
  floorArea?: Maybe<FloorArea>;
  maxPrice?: Maybe<Scalars["Int"]["output"]>;
  minPrice?: Maybe<Scalars["Int"]["output"]>;
  numOfUnits?: Maybe<Scalars["Int"]["output"]>;
  propertyDescription?: Maybe<Scalars["String"]["output"]>;
  propertyImages?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  propertyType?: Maybe<Scalars["String"]["output"]>;
};

export type PropertyTypesInput = {
  currency?: InputMaybe<Scalars["String"]["input"]>;
  estimatedPrice?: InputMaybe<Scalars["Int"]["input"]>;
  floorArea?: InputMaybe<FloorAreaInput>;
  maxPrice?: InputMaybe<Scalars["Int"]["input"]>;
  minPrice?: InputMaybe<Scalars["Int"]["input"]>;
  numOfUnits?: InputMaybe<Scalars["Int"]["input"]>;
  propertyDescription?: InputMaybe<Scalars["String"]["input"]>;
  propertyImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  propertyType?: InputMaybe<Scalars["String"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  /** Whether an entity may perform a gated action, and what is blocking it. */
  evaluateEntityGate: EntityGate;
  getAdminDashboardSummary: AdminDashboardSummary;
  getAssessment?: Maybe<Assessment>;
  getAssessmentAlertRule?: Maybe<AssessmentAlertRule>;
  getAssessmentAlertRules: Array<AssessmentAlertRule>;
  getAssessmentAlertRulesLength: Scalars["Int"]["output"];
  getAssessmentCategories: Array<AssessmentCategory>;
  getAssessmentCategoriesLength: Scalars["Int"]["output"];
  getAssessmentCategory?: Maybe<AssessmentCategory>;
  getAssessmentDocument?: Maybe<AssessmentDocument>;
  getAssessmentDocuments: Array<AssessmentDocument>;
  getAssessmentDocumentsLength: Scalars["Int"]["output"];
  getAssessmentFinancierShareGrant?: Maybe<AssessmentFinancierShareGrant>;
  getAssessmentFinancierShareGrants: Array<AssessmentFinancierShareGrant>;
  getAssessmentFinancierShareGrantsLength: Scalars["Int"]["output"];
  getAssessmentQuestion?: Maybe<AssessmentQuestion>;
  getAssessmentQuestionOption?: Maybe<AssessmentQuestionOption>;
  getAssessmentQuestionOptions: Array<AssessmentQuestionOption>;
  getAssessmentQuestionOptionsLength: Scalars["Int"]["output"];
  getAssessmentQuestions: Array<AssessmentQuestion>;
  getAssessmentQuestionsLength: Scalars["Int"]["output"];
  getAssessmentReadinessBand?: Maybe<AssessmentReadinessBand>;
  getAssessmentReadinessBands: Array<AssessmentReadinessBand>;
  getAssessmentReadinessBandsLength: Scalars["Int"]["output"];
  getAssessmentResponse?: Maybe<AssessmentResponse>;
  getAssessmentResponses: Array<AssessmentResponse>;
  getAssessmentResponsesLength: Scalars["Int"]["output"];
  getAssessmentScoringBand?: Maybe<AssessmentScoringBand>;
  getAssessmentScoringBands: Array<AssessmentScoringBand>;
  getAssessmentScoringBandsLength: Scalars["Int"]["output"];
  getAssessmentTemplate?: Maybe<AssessmentTemplate>;
  getAssessmentTemplates: Array<AssessmentTemplate>;
  getAssessmentTemplatesLength: Scalars["Int"]["output"];
  getAssessments: Array<Assessment>;
  getAssessmentsLength: Scalars["Int"]["output"];
  getAssetValueSnapshot?: Maybe<AssetValueSnapshot>;
  getAssetValueSnapshots: Array<AssetValueSnapshot>;
  getAssetValueSnapshotsLength: Scalars["Int"]["output"];
  getAuditLog?: Maybe<AuditLog>;
  getAuditLogs: Array<AuditLog>;
  getAuditLogsLength: Scalars["Int"]["output"];
  getAvailableAdminPermissions: Array<Scalars["String"]["output"]>;
  getAvailablePermissions: Array<Scalars["String"]["output"]>;
  /** Borrower-raised requests for a loan (party-scoped: borrower or financier), newest first. */
  getBorrowerLoanRequests: Array<BorrowerLoanRequest>;
  getBuyerProject?: Maybe<BuyerProject>;
  getBuyerProjects: Array<BuyerProject>;
  getBuyerProjectsLength: Scalars["Int"]["output"];
  /** The authenticated buyer's own properties, grouped into in-progress vs owned. */
  getBuyerPropertyHoldings: BuyerPropertyHoldings;
  getCashPurchase?: Maybe<CashPurchaseTxn>;
  /** The issuer's list — the 'Unit Purchases' section at the top of /issuer/offers. */
  getCashPurchasesForMyUnits: Array<CashPurchaseTxn>;
  getCompanyMember?: Maybe<EntityMember>;
  getCompanyMembers: Array<EntityMember>;
  getCompanyRole?: Maybe<EntityRole>;
  getCompanyRoles: Array<EntityRole>;
  getComplianceAuditEvent?: Maybe<ComplianceAuditEvent>;
  /**
   * Admin: query the dedicated compliance audit trail across all entities.
   * Filter by submissionId, entity, action, actor, role, status or date.
   */
  getComplianceAuditEvents: Array<ComplianceAuditEvent>;
  getComplianceAuditEventsLength: Scalars["Int"]["output"];
  /** Fetch all compliance sections, templates, and the user's submission statuses for a given role */
  getComplianceDocuments: ComplianceDocumentsResponse;
  getComplianceNotifications: Array<ComplianceNotification>;
  getComplianceNotificationsLength: Scalars["Int"]["output"];
  /** Admin: list all sections for a role type */
  getComplianceSections: Array<ComplianceSection>;
  /** Admin: fetch a single compliance submission (with template, user, files) */
  getComplianceSubmission?: Maybe<ComplianceSubmission>;
  /** Admin: list compliance submissions across users for review */
  getComplianceSubmissions: Array<ComplianceSubmission>;
  getComplianceSubmissionsLength: Scalars["Int"]["output"];
  /** The condition-precedent checklist for a request (Act 9). Any party may view it. */
  getConditionsPrecedent: Array<ConditionPrecedent>;
  getConversation?: Maybe<Conversation>;
  getConversationByReferenceNumber?: Maybe<Conversation>;
  getConversationByUsers?: Maybe<Conversation>;
  getConversations: Array<Conversation>;
  getConversationsLength: Scalars["Int"]["output"];
  getDashboardSummary: DashboardSummary;
  /** Full declaration history for a loan (via its offer request), newest first. */
  getDeclarationsByOfferRequest: Array<StatusDeclaration>;
  /** Tranche / drawdown records for a loan (from the offer request's servicing metadata). */
  getDisbursements: Array<DisbursementRecord>;
  getDueDiligence?: Maybe<DueDiligence>;
  getDueDiligences: Array<DueDiligence>;
  getDueDiligencesLength: Scalars["Int"]["output"];
  /** The entity's tailored document requirements plus a per-action gate summary. */
  getEntityDocumentRequirements: EntityRequirementsResponse;
  getFavoriteOffer?: Maybe<FavoriteOffer>;
  getFavoriteOffers: Array<FavoriteOffer>;
  getFavoriteOffersLength: Scalars["Int"]["output"];
  getFavoriteProperties: Array<Property>;
  getFavoritePropertiesLength: Scalars["Int"]["output"];
  /** AFRAM platform / lender fee records for a loan. */
  getFeeRecords: Array<FeeRecord>;
  getFinancier?: Maybe<Entity>;
  /** The authenticated financier's financed properties, grouped into in-progress vs settled. */
  getFinancierPropertyHoldings: FinancierPropertyHoldings;
  getFinanciers?: Maybe<Array<Maybe<Entity>>>;
  getFinanciersLength: Scalars["Int"]["output"];
  getInstallment?: Maybe<RepaymentInstallment>;
  getInstallments: Array<RepaymentInstallment>;
  getInstallmentsLength: Scalars["Int"]["output"];
  getIssuer?: Maybe<Entity>;
  getIssuers?: Maybe<Array<Maybe<Entity>>>;
  getIssuersLength: Scalars["Int"]["output"];
  getLand?: Maybe<Land>;
  getLands: Array<Land>;
  getLandsLength: Scalars["Int"]["output"];
  /** The latest active (non-cancelled) declaration for a loan — drives Outstanding/Status. */
  getLatestActiveDeclaration?: Maybe<StatusDeclaration>;
  /**
   * The latest active declaration for every loan the borrower is servicing — one row
   * per loan. Drives the My Loans list balances / next-due. Scoped to the caller's own
   * borrower identity (buyer or issuer); the borrowerId argument is accepted for API
   * shape but not trusted.
   */
  getLatestActiveDeclarationsByBorrower: Array<StatusDeclaration>;
  /**
   * The latest active (non-cancelled, non-superseded) declaration for every loan
   * the authenticated lender is servicing — one row per loan. Drives the loan-book
   * list's Outstanding / Status / Coverage columns and the portfolio KPIs, replacing
   * the per-loan getLatestActiveDeclaration fan-out. Each row carries offerRequestId so
   * the client joins to loans by that. The financierId argument is accepted for API
   * shape but the query is always scoped to the caller's own entity.
   */
  getLatestActiveDeclarationsByLender: Array<StatusDeclaration>;
  /** A single loan row by its anchoring offer request (lender-scoped). */
  getLedgerLoan?: Maybe<LedgerLoan>;
  /** The authenticated lender's Loan Book — funded offer requests projected as loan rows. */
  getLedgerLoans: Array<LedgerLoan>;
  /** Count of loans in the authenticated lender's Loan Book (for the same filter). */
  getLedgerLoansLength: Scalars["Int"]["output"];
  getLoan?: Maybe<Loan>;
  /** All documents attached to a loan (borrower-uploaded + financier-shared), newest first. */
  getLoanDocuments: Array<LoanDocument>;
  getLoans: Array<Loan>;
  getLoansLength: Scalars["Int"]["output"];
  getMessage?: Maybe<Message>;
  getMessages: Array<Message>;
  getMessagesLength: Scalars["Int"]["output"];
  getMyActiveAssessment?: Maybe<Assessment>;
  getMyAssessmentEntryState: AssessmentEntryState;
  /** The buyer's list — the 'Purchases' section at the top of /buyer/offers. */
  getMyCashPurchases: Array<CashPurchaseTxn>;
  getNotification?: Maybe<Notification>;
  getNotifications: Array<Notification>;
  getNotificationsLength: Scalars["Int"]["output"];
  getOffer?: Maybe<Offer>;
  getOfferRequest?: Maybe<OfferRequest>;
  getOfferRequestDocuments: Array<OfferRequestDocument>;
  getOfferRequestDocumentsLength: Scalars["Int"]["output"];
  getOfferRequests: Array<OfferRequest>;
  getOfferRequestsLength: Scalars["Int"]["output"];
  getOffers: Array<Offer>;
  getOffersLength: Scalars["Int"]["output"];
  /** Confirmed PSP payments for a loan (Stream 2 — never merged with declarations). */
  getPaymentEvents: Array<PaymentEvent>;
  getPaymentSchedule?: Maybe<PaymentSchedule>;
  getPaymentSchedules: Array<PaymentSchedule>;
  getPaymentSchedulesLength: Scalars["Int"]["output"];
  getPendingTermChange?: Maybe<RepaymentTermChange>;
  getPendingTermChanges: Array<RepaymentTermChange>;
  getPendingTermChangesLength: Scalars["Int"]["output"];
  getPendingVerifications: PendingVerificationsPayload;
  getPortfolio?: Maybe<Portfolio>;
  getPortfolios: Array<Portfolio>;
  getPortfoliosLength: Scalars["Int"]["output"];
  getPreTokenizedUnits: Array<PreTokenizedUnit>;
  getPreTokenizedUnitsLength: Scalars["Int"]["output"];
  getProject?: Maybe<Project>;
  getProjects: Array<Project>;
  getProjectsLength: Scalars["Int"]["output"];
  getProperties: Array<Property>;
  getPropertiesInPortfolio: Array<Property>;
  getPropertiesLength: Scalars["Int"]["output"];
  getProperty?: Maybe<Property>;
  getPropertyPipeline: Array<PropertyPipelineBucket>;
  getPublicPortfolioUnits: Array<Property>;
  getPublicProjects: Array<Project>;
  getPublicProjectsLength: Scalars["Int"]["output"];
  getRecentActivities: Array<RecentActivity>;
  getRecentActivitiesLength: Scalars["Int"]["output"];
  getRepayment?: Maybe<Repayment>;
  getRepaymentTerm?: Maybe<Repayment>;
  getRepaymentTerms: Array<Repayment>;
  getRepaymentTermsLength: Scalars["Int"]["output"];
  getRepayments: Array<Repayment>;
  getRepaymentsLength: Scalars["Int"]["output"];
  getReview?: Maybe<Review>;
  getReviews: Array<Review>;
  getReviewsLength: Scalars["Int"]["output"];
  getRoleRequests: Array<RoleRequest>;
  getSupportRole?: Maybe<SupportRole>;
  getSupportRoles: Array<SupportRole>;
  getSupportRolesLength: Scalars["Int"]["output"];
  getSupportUser?: Maybe<SupportUser>;
  getSupportUserStats: UserStats;
  getSupportUsers: Array<SupportUser>;
  getSupportUsersLength: Scalars["Int"]["output"];
  getTailoringRule?: Maybe<TailoringRule>;
  getTailoringRules: Array<TailoringRule>;
  getTailoringRulesLength: Scalars["Int"]["output"];
  getTempProject?: Maybe<TempProject>;
  getTempProjects: Array<TempProject>;
  getTempProjectsLength: Scalars["Int"]["output"];
  getTermSheet?: Maybe<TermSheet>;
  getTermSheets: Array<TermSheet>;
  getTermSheetsLength: Scalars["Int"]["output"];
  getTicket?: Maybe<Ticket>;
  getTicketComments: Array<TicketComment>;
  getTickets: Array<Ticket>;
  getTicketsLength: Scalars["Int"]["output"];
  /** Token escrow lifecycle events for a loan. */
  getTokenEvents: Array<TokenEvent>;
  /**
   * Token escrow events for every loan the borrower is servicing — drives the token
   * wallet (escrowed vs released per loan). Scoped to the caller's own borrower
   * identity; the borrowerId argument is accepted for API shape but not trusted.
   */
  getTokenEventsByBorrower: Array<TokenEvent>;
  getTransaction?: Maybe<Transaction>;
  getTransactionVolumeSeries: Array<TransactionVolumePoint>;
  getTransactions: Array<Transaction>;
  getTransactionsLength: Scalars["Int"]["output"];
  getUser?: Maybe<User>;
  getUserPolicy?: Maybe<UserPolicy>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  getUsersLength: Scalars["Int"]["output"];
  /** The authenticated user's wallet, if they've ever started participating in a transaction (e.g. a deposit) — null otherwise. Never auto-provisioned by this query. */
  getWalletAccount?: Maybe<WalletAccount>;
  /** The authenticated user's wallet activity, newest first. Empty if they don't have a wallet yet. */
  getWalletTransactions: Array<WalletTxn>;
  vapidPublicKey: VapidPublicKeyResponse;
};

export type QueryEvaluateEntityGateArgs = {
  action: GatedAction;
  entityId: Scalars["ID"]["input"];
};

export type QueryGetAssessmentArgs = {
  filter?: InputMaybe<AssessmentFilter>;
};

export type QueryGetAssessmentAlertRuleArgs = {
  filter?: InputMaybe<AssessmentAlertRuleFilter>;
};

export type QueryGetAssessmentAlertRulesArgs = {
  filter?: InputMaybe<AssessmentAlertRuleFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentAlertRulesLengthArgs = {
  filter?: InputMaybe<AssessmentAlertRuleFilter>;
};

export type QueryGetAssessmentCategoriesArgs = {
  filter?: InputMaybe<AssessmentCategoryFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentCategoriesLengthArgs = {
  filter?: InputMaybe<AssessmentCategoryFilter>;
};

export type QueryGetAssessmentCategoryArgs = {
  filter?: InputMaybe<AssessmentCategoryFilter>;
};

export type QueryGetAssessmentDocumentArgs = {
  filter?: InputMaybe<AssessmentDocumentFilter>;
};

export type QueryGetAssessmentDocumentsArgs = {
  filter?: InputMaybe<AssessmentDocumentFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentDocumentsLengthArgs = {
  filter?: InputMaybe<AssessmentDocumentFilter>;
};

export type QueryGetAssessmentFinancierShareGrantArgs = {
  filter?: InputMaybe<AssessmentFinancierShareGrantFilter>;
};

export type QueryGetAssessmentFinancierShareGrantsArgs = {
  filter?: InputMaybe<AssessmentFinancierShareGrantFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentFinancierShareGrantsLengthArgs = {
  filter?: InputMaybe<AssessmentFinancierShareGrantFilter>;
};

export type QueryGetAssessmentQuestionArgs = {
  filter?: InputMaybe<AssessmentQuestionFilter>;
};

export type QueryGetAssessmentQuestionOptionArgs = {
  filter?: InputMaybe<AssessmentQuestionOptionFilter>;
};

export type QueryGetAssessmentQuestionOptionsArgs = {
  filter?: InputMaybe<AssessmentQuestionOptionFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentQuestionOptionsLengthArgs = {
  filter?: InputMaybe<AssessmentQuestionOptionFilter>;
};

export type QueryGetAssessmentQuestionsArgs = {
  filter?: InputMaybe<AssessmentQuestionFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentQuestionsLengthArgs = {
  filter?: InputMaybe<AssessmentQuestionFilter>;
};

export type QueryGetAssessmentReadinessBandArgs = {
  filter?: InputMaybe<AssessmentReadinessBandFilter>;
};

export type QueryGetAssessmentReadinessBandsArgs = {
  filter?: InputMaybe<AssessmentReadinessBandFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentReadinessBandsLengthArgs = {
  filter?: InputMaybe<AssessmentReadinessBandFilter>;
};

export type QueryGetAssessmentResponseArgs = {
  filter?: InputMaybe<AssessmentResponseFilter>;
};

export type QueryGetAssessmentResponsesArgs = {
  filter?: InputMaybe<AssessmentResponseFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentResponsesLengthArgs = {
  filter?: InputMaybe<AssessmentResponseFilter>;
};

export type QueryGetAssessmentScoringBandArgs = {
  filter?: InputMaybe<AssessmentScoringBandFilter>;
};

export type QueryGetAssessmentScoringBandsArgs = {
  filter?: InputMaybe<AssessmentScoringBandFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentScoringBandsLengthArgs = {
  filter?: InputMaybe<AssessmentScoringBandFilter>;
};

export type QueryGetAssessmentTemplateArgs = {
  filter?: InputMaybe<AssessmentTemplateFilter>;
};

export type QueryGetAssessmentTemplatesArgs = {
  filter?: InputMaybe<AssessmentTemplateFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentTemplatesLengthArgs = {
  filter?: InputMaybe<AssessmentTemplateFilter>;
};

export type QueryGetAssessmentsArgs = {
  filter?: InputMaybe<AssessmentFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssessmentsLengthArgs = {
  filter?: InputMaybe<AssessmentFilter>;
};

export type QueryGetAssetValueSnapshotArgs = {
  filter?: InputMaybe<AssetValueSnapshotFilter>;
};

export type QueryGetAssetValueSnapshotsArgs = {
  filter?: InputMaybe<AssetValueSnapshotFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAssetValueSnapshotsLengthArgs = {
  filter?: InputMaybe<AssetValueSnapshotFilter>;
};

export type QueryGetAuditLogArgs = {
  filter?: InputMaybe<AuditLogFilter>;
};

export type QueryGetAuditLogsArgs = {
  filter?: InputMaybe<AuditLogFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetAuditLogsLengthArgs = {
  filter?: InputMaybe<AuditLogFilter>;
};

export type QueryGetBorrowerLoanRequestsArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetBuyerProjectArgs = {
  filter?: InputMaybe<BuyerProjectFilter>;
};

export type QueryGetBuyerProjectsArgs = {
  filter?: InputMaybe<BuyerProjectFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetBuyerProjectsLengthArgs = {
  filter?: InputMaybe<BuyerProjectFilter>;
};

export type QueryGetCashPurchaseArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetCompanyMemberArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetCompanyMembersArgs = {
  filter?: InputMaybe<EntityMemberFilter>;
};

export type QueryGetCompanyRoleArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetCompanyRolesArgs = {
  filter?: InputMaybe<EntityRoleFilter>;
};

export type QueryGetComplianceAuditEventArgs = {
  filter?: InputMaybe<ComplianceAuditEventFilter>;
};

export type QueryGetComplianceAuditEventsArgs = {
  filter?: InputMaybe<ComplianceAuditEventFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetComplianceAuditEventsLengthArgs = {
  filter?: InputMaybe<ComplianceAuditEventFilter>;
};

export type QueryGetComplianceDocumentsArgs = {
  filter?: InputMaybe<ComplianceDocumentFilter>;
  pagination?: InputMaybe<Pagination>;
  roleType: ComplianceRoleType;
};

export type QueryGetComplianceNotificationsArgs = {
  filter?: InputMaybe<ComplianceNotificationFilter>;
  pagination?: InputMaybe<Pagination>;
  roleType: ComplianceRoleType;
};

export type QueryGetComplianceNotificationsLengthArgs = {
  filter?: InputMaybe<ComplianceNotificationFilter>;
  roleType: ComplianceRoleType;
};

export type QueryGetComplianceSectionsArgs = {
  roleType: ComplianceRoleType;
};

export type QueryGetComplianceSubmissionArgs = {
  filter?: InputMaybe<ComplianceSubmissionFilter>;
};

export type QueryGetComplianceSubmissionsArgs = {
  filter?: InputMaybe<ComplianceSubmissionFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetComplianceSubmissionsLengthArgs = {
  filter?: InputMaybe<ComplianceSubmissionFilter>;
};

export type QueryGetConditionsPrecedentArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetConversationArgs = {
  filter?: InputMaybe<ConversationFilter>;
};

export type QueryGetConversationByReferenceNumberArgs = {
  referenceNumber: Scalars["String"]["input"];
};

export type QueryGetConversationByUsersArgs = {
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  userId1: Scalars["ID"]["input"];
  userId2: Scalars["ID"]["input"];
  withParent?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type QueryGetConversationsArgs = {
  filter?: InputMaybe<ConversationFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetConversationsLengthArgs = {
  filter?: InputMaybe<ConversationFilter>;
};

export type QueryGetDashboardSummaryArgs = {
  range: DashboardRange;
};

export type QueryGetDeclarationsByOfferRequestArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetDisbursementsArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetDueDiligenceArgs = {
  filter?: InputMaybe<DueDiligenceFilter>;
};

export type QueryGetDueDiligencesArgs = {
  filter?: InputMaybe<DueDiligenceFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetDueDiligencesLengthArgs = {
  filter?: InputMaybe<DueDiligenceFilter>;
};

export type QueryGetEntityDocumentRequirementsArgs = {
  entityId: Scalars["ID"]["input"];
};

export type QueryGetFavoriteOfferArgs = {
  filter?: InputMaybe<FavoriteOfferFilter>;
};

export type QueryGetFavoriteOffersArgs = {
  filter?: InputMaybe<FavoriteOfferFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetFavoriteOffersLengthArgs = {
  filter?: InputMaybe<FavoriteOfferFilter>;
};

export type QueryGetFavoritePropertiesArgs = {
  filter?: InputMaybe<PropertyFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetFavoritePropertiesLengthArgs = {
  filter?: InputMaybe<PropertyFilter>;
};

export type QueryGetFeeRecordsArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetFinancierArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetFinanciersArgs = {
  filter?: InputMaybe<FinancierFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetFinanciersLengthArgs = {
  filter?: InputMaybe<FinancierFilter>;
};

export type QueryGetInstallmentArgs = {
  filter?: InputMaybe<InstallmentFilter>;
};

export type QueryGetInstallmentsArgs = {
  filter?: InputMaybe<InstallmentFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetInstallmentsLengthArgs = {
  filter?: InputMaybe<InstallmentFilter>;
};

export type QueryGetIssuerArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetIssuersArgs = {
  filter?: InputMaybe<IssuerFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetIssuersLengthArgs = {
  filter?: InputMaybe<IssuerFilter>;
};

export type QueryGetLandArgs = {
  filter?: InputMaybe<LandFilter>;
};

export type QueryGetLandsArgs = {
  filter?: InputMaybe<LandFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetLandsLengthArgs = {
  filter?: InputMaybe<LandFilter>;
};

export type QueryGetLatestActiveDeclarationArgs = {
  loanId?: InputMaybe<Scalars["ID"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryGetLatestActiveDeclarationsByBorrowerArgs = {
  borrowerId: Scalars["ID"]["input"];
};

export type QueryGetLatestActiveDeclarationsByLenderArgs = {
  financierId: Scalars["ID"]["input"];
};

export type QueryGetLedgerLoanArgs = {
  filter?: InputMaybe<LedgerLoanFilter>;
};

export type QueryGetLedgerLoansArgs = {
  filter?: InputMaybe<LedgerLoanFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetLedgerLoansLengthArgs = {
  filter?: InputMaybe<LedgerLoanFilter>;
};

export type QueryGetLoanArgs = {
  filter?: InputMaybe<LoanFilter>;
};

export type QueryGetLoanDocumentsArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetLoansArgs = {
  filter?: InputMaybe<LoanFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetLoansLengthArgs = {
  filter?: InputMaybe<LoanFilter>;
};

export type QueryGetMessageArgs = {
  filter?: InputMaybe<MessageFilter>;
};

export type QueryGetMessagesArgs = {
  filter?: InputMaybe<MessageFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetMessagesLengthArgs = {
  filter?: InputMaybe<MessageFilter>;
};

export type QueryGetMyAssessmentEntryStateArgs = {
  applicantUserId?: InputMaybe<Scalars["ID"]["input"]>;
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  subjectEntityId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryGetNotificationArgs = {
  filter: NotificationFilter;
};

export type QueryGetNotificationsArgs = {
  filter?: InputMaybe<NotificationFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetNotificationsLengthArgs = {
  filter?: InputMaybe<NotificationFilter>;
};

export type QueryGetOfferArgs = {
  filter?: InputMaybe<OfferFilter>;
};

export type QueryGetOfferRequestArgs = {
  filter?: InputMaybe<OfferRequestFilter>;
};

export type QueryGetOfferRequestDocumentsArgs = {
  filter?: InputMaybe<OfferRequestDocumentFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetOfferRequestDocumentsLengthArgs = {
  filter?: InputMaybe<OfferRequestDocumentFilter>;
};

export type QueryGetOfferRequestsArgs = {
  filter?: InputMaybe<OfferRequestFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetOfferRequestsLengthArgs = {
  filter?: InputMaybe<OfferRequestFilter>;
};

export type QueryGetOffersArgs = {
  filter?: InputMaybe<OfferFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetOffersLengthArgs = {
  filter?: InputMaybe<OfferFilter>;
};

export type QueryGetPaymentEventsArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetPaymentScheduleArgs = {
  filter?: InputMaybe<PaymentScheduleFilter>;
};

export type QueryGetPaymentSchedulesArgs = {
  filter?: InputMaybe<PaymentScheduleFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetPaymentSchedulesLengthArgs = {
  filter?: InputMaybe<PaymentScheduleFilter>;
};

export type QueryGetPendingTermChangeArgs = {
  filter?: InputMaybe<TermChangeFilter>;
};

export type QueryGetPendingTermChangesArgs = {
  filter?: InputMaybe<TermChangeFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetPendingTermChangesLengthArgs = {
  filter?: InputMaybe<TermChangeFilter>;
};

export type QueryGetPendingVerificationsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryGetPortfolioArgs = {
  filter?: InputMaybe<PortfolioFilter>;
};

export type QueryGetPortfoliosArgs = {
  filter?: InputMaybe<PortfolioFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetPortfoliosLengthArgs = {
  filter?: InputMaybe<PortfolioFilter>;
};

export type QueryGetPreTokenizedUnitsArgs = {
  filter?: InputMaybe<PreTokenizedUnitFilter>;
  ownerId: Scalars["ID"]["input"];
  pagination?: InputMaybe<Pagination>;
  portfolioId: Scalars["ID"]["input"];
};

export type QueryGetPreTokenizedUnitsLengthArgs = {
  filter?: InputMaybe<PreTokenizedUnitFilter>;
  ownerId: Scalars["ID"]["input"];
  portfolioId: Scalars["ID"]["input"];
};

export type QueryGetProjectArgs = {
  filter?: InputMaybe<ProjectFilter>;
};

export type QueryGetProjectsArgs = {
  filter?: InputMaybe<ProjectFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetProjectsLengthArgs = {
  filter?: InputMaybe<ProjectFilter>;
};

export type QueryGetPropertiesArgs = {
  filter?: InputMaybe<PropertyFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetPropertiesInPortfolioArgs = {
  portfolioId: Scalars["ID"]["input"];
};

export type QueryGetPropertiesLengthArgs = {
  filter?: InputMaybe<PropertyFilter>;
};

export type QueryGetPropertyArgs = {
  filter: PropertyFilter;
};

export type QueryGetPropertyPipelineArgs = {
  range?: InputMaybe<DashboardRange>;
};

export type QueryGetPublicPortfolioUnitsArgs = {
  portfolioId: Scalars["ID"]["input"];
};

export type QueryGetPublicProjectsArgs = {
  filter?: InputMaybe<ProjectFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetPublicProjectsLengthArgs = {
  filter?: InputMaybe<ProjectFilter>;
};

export type QueryGetRecentActivitiesArgs = {
  filter?: InputMaybe<RecentActivityFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetRecentActivitiesLengthArgs = {
  filter?: InputMaybe<RecentActivityFilter>;
};

export type QueryGetRepaymentArgs = {
  filter?: InputMaybe<RepaymentFilter>;
};

export type QueryGetRepaymentTermArgs = {
  filter?: InputMaybe<RepaymentFilter>;
};

export type QueryGetRepaymentTermsArgs = {
  filter?: InputMaybe<RepaymentFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetRepaymentTermsLengthArgs = {
  filter?: InputMaybe<RepaymentFilter>;
};

export type QueryGetRepaymentsArgs = {
  filter?: InputMaybe<RepaymentFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetRepaymentsLengthArgs = {
  filter?: InputMaybe<RepaymentFilter>;
};

export type QueryGetReviewArgs = {
  filter?: InputMaybe<ReviewFilter>;
};

export type QueryGetReviewsArgs = {
  filter?: InputMaybe<ReviewFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetReviewsLengthArgs = {
  filter?: InputMaybe<ReviewFilter>;
};

export type QueryGetRoleRequestsArgs = {
  type: RoleFetchType;
};

export type QueryGetSupportRoleArgs = {
  filter?: InputMaybe<SupportRoleFilter>;
};

export type QueryGetSupportRolesArgs = {
  filter?: InputMaybe<SupportRoleFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetSupportRolesLengthArgs = {
  filter?: InputMaybe<SupportRoleFilter>;
};

export type QueryGetSupportUserArgs = {
  filter?: InputMaybe<SupportUserFilter>;
};

export type QueryGetSupportUsersArgs = {
  filter?: InputMaybe<SupportUserFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetSupportUsersLengthArgs = {
  filter?: InputMaybe<SupportUserFilter>;
};

export type QueryGetTailoringRuleArgs = {
  filter?: InputMaybe<TailoringRuleFilter>;
};

export type QueryGetTailoringRulesArgs = {
  filter?: InputMaybe<TailoringRuleFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetTailoringRulesLengthArgs = {
  filter?: InputMaybe<TailoringRuleFilter>;
};

export type QueryGetTempProjectArgs = {
  filter?: InputMaybe<TempProjectFilter>;
};

export type QueryGetTempProjectsArgs = {
  filter?: InputMaybe<TempProjectFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetTempProjectsLengthArgs = {
  filter?: InputMaybe<TempProjectFilter>;
};

export type QueryGetTermSheetArgs = {
  filter?: InputMaybe<TermSheetFilter>;
};

export type QueryGetTermSheetsArgs = {
  filter?: InputMaybe<TermSheetFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetTermSheetsLengthArgs = {
  filter?: InputMaybe<TermSheetFilter>;
};

export type QueryGetTicketArgs = {
  filter?: InputMaybe<TicketFilter>;
};

export type QueryGetTicketCommentsArgs = {
  pagination?: InputMaybe<Pagination>;
  ticketId: Scalars["ID"]["input"];
};

export type QueryGetTicketsArgs = {
  filter?: InputMaybe<TicketFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetTicketsLengthArgs = {
  filter?: InputMaybe<TicketFilter>;
};

export type QueryGetTokenEventsArgs = {
  offerRequestId: Scalars["ID"]["input"];
};

export type QueryGetTokenEventsByBorrowerArgs = {
  borrowerId: Scalars["ID"]["input"];
};

export type QueryGetTransactionArgs = {
  filter?: InputMaybe<TransactionFilter>;
};

export type QueryGetTransactionVolumeSeriesArgs = {
  range: DashboardRange;
};

export type QueryGetTransactionsArgs = {
  filter?: InputMaybe<TransactionFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetTransactionsLengthArgs = {
  filter?: InputMaybe<TransactionFilter>;
};

export type QueryGetUserArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetUserPolicyArgs = {
  role: UserPolicyRole;
};

export type QueryGetUsersArgs = {
  filter?: InputMaybe<UserFilter>;
  pagination?: InputMaybe<Pagination>;
};

export type QueryGetUsersLengthArgs = {
  filter?: InputMaybe<UserFilter>;
};

export type QueryGetWalletTransactionsArgs = {
  kind?: InputMaybe<WalletTxnKind>;
  pagination?: InputMaybe<Pagination>;
};

export type RateType = "FIXED" | "FLOATING" | "VARIABLE";

export type RecentActivity = {
  __typename?: "RecentActivity";
  actorId?: Maybe<Scalars["ID"]["output"]>;
  actorName?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  entityId?: Maybe<Scalars["ID"]["output"]>;
  entityType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  subtitle: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  type: RecentActivityType;
};

export type RecentActivityFilter = {
  actorId?: InputMaybe<IdOperator>;
  createdAt?: InputMaybe<DateOperator>;
  type?: InputMaybe<RecentActivityType>;
  types?: InputMaybe<Array<RecentActivityType>>;
};

export type RecentActivityType = "LEGAL" | "PROPERTY" | "TICKET" | "TRANSACTION" | "VERIFICATION";

export type ReleaseTokensToBuyerInput = {
  /** Amount to release; defaults to the loan's remaining escrowed token balance. */
  amount?: InputMaybe<Scalars["Float"]["input"]>;
  note?: InputMaybe<Scalars["String"]["input"]>;
  offerRequestId: Scalars["ID"]["input"];
};

export type Repayment = {
  __typename?: "Repayment";
  conversationId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  createdById?: Maybe<Scalars["ID"]["output"]>;
  createdForId?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  interestRate?: Maybe<Scalars["Float"]["output"]>;
  interestRateBps?: Maybe<Scalars["Int"]["output"]>;
  interestRateKind?: Maybe<Scalars["String"]["output"]>;
  isSubscribedToReferenceRate?: Maybe<Scalars["Boolean"]["output"]>;
  loanId?: Maybe<Scalars["ID"]["output"]>;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  offerRequestId?: Maybe<Scalars["ID"]["output"]>;
  principalMinor?: Maybe<Scalars["String"]["output"]>;
  propertyId?: Maybe<Scalars["ID"]["output"]>;
  repaymentFrequency?: Maybe<Scalars["String"]["output"]>;
  repaymentTerms?: Maybe<Scalars["JSONObject"]["output"]>;
  scheduleType?: Maybe<Scalars["String"]["output"]>;
  totalInterestMinor?: Maybe<Scalars["String"]["output"]>;
  totalRepaymentMinor?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type RepaymentFilter = {
  conversationId?: InputMaybe<Scalars["ID"]["input"]>;
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  scheduleType?: InputMaybe<Scalars["String"]["input"]>;
};

export type RepaymentFrequency =
  "ANNUALLY" | "BI_WEEKLY" | "MONTHLY" | "QUARTERLY" | "SEMI_ANNUALLY" | "WEEKLY";

export type RepaymentInstallment = {
  __typename?: "RepaymentInstallment";
  amountFees: Scalars["String"]["output"];
  amountInterest: Scalars["String"]["output"];
  amountPaidToDate: Scalars["String"]["output"];
  amountPrincipal: Scalars["String"]["output"];
  amountTotal: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency: Scalars["String"]["output"];
  dueDate: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  paidAt?: Maybe<Scalars["DateTime"]["output"]>;
  refNo: Scalars["String"]["output"];
  repaymentId: Scalars["ID"]["output"];
  sequenceNo: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type RepaymentTermChange = {
  __typename?: "RepaymentTermChange";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  decidedAt?: Maybe<Scalars["DateTime"]["output"]>;
  decidedBy?: Maybe<Scalars["JSONObject"]["output"]>;
  decisionComment?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  proposedAt?: Maybe<Scalars["DateTime"]["output"]>;
  proposedBy?: Maybe<Scalars["JSONObject"]["output"]>;
  repaymentId: Scalars["ID"]["output"];
  status: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updates: Scalars["JSONObject"]["output"];
};

export type RepaymentTerms = {
  __typename?: "RepaymentTerms";
  defaultFee: DefaultFee;
  defaultFeeDays: Scalars["Int"]["output"];
  defaultPenalty: Scalars["Float"]["output"];
  defaultRemedyFeeAmount: Scalars["Float"]["output"];
  hasDefaultingPenalties: Scalars["Boolean"]["output"];
  penaltyAmount: Scalars["Float"]["output"];
  penaltyPercentage: Scalars["Float"]["output"];
  penaltyType: PenaltyType;
  prepaymentAllowed: Scalars["Boolean"]["output"];
  prepaymentDays: Scalars["Int"]["output"];
  prepaymentFeeAmount: Scalars["Float"]["output"];
  prepaymentFeePercentage: Scalars["Float"]["output"];
  prepaymentFeeType: PrepaymentFeeType;
  prepaymentTerms: PrepaymentTerms;
  remedyDefaultingDays: Scalars["Int"]["output"];
};

export type RepaymentTermsInput = {
  defaultFee?: InputMaybe<DefaultFeeInput>;
  defaultFeeDays?: InputMaybe<Scalars["Int"]["input"]>;
  defaultPenalty?: InputMaybe<Scalars["Float"]["input"]>;
  defaultRemedyFeeAmount?: InputMaybe<Scalars["Float"]["input"]>;
  hasDefaultingPenalties?: InputMaybe<Scalars["Boolean"]["input"]>;
  penaltyAmount?: InputMaybe<Scalars["Float"]["input"]>;
  penaltyPercentage?: InputMaybe<Scalars["Float"]["input"]>;
  penaltyType?: InputMaybe<PenaltyType>;
  prepaymentAllowed?: InputMaybe<Scalars["Boolean"]["input"]>;
  prepaymentDays?: InputMaybe<Scalars["Int"]["input"]>;
  prepaymentFeeAmount?: InputMaybe<Scalars["Float"]["input"]>;
  prepaymentFeePercentage?: InputMaybe<Scalars["Float"]["input"]>;
  prepaymentFeeType?: InputMaybe<PrepaymentFeeType>;
  prepaymentTerms?: InputMaybe<PrepaymentTermsInput>;
  remedyDefaultingDays?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RepaymentType = "BOND" | "FIXED_DEPOSIT" | "TRADITIONAL_LOAN";

export type RequestedRole = "admin" | "agent" | "buyer" | "financier" | "issuer" | "seller";

export type RequirementLevel = "advisory" | "if_applicable" | "mandatory";

/** The party responsible for satisfying a condition precedent. */
export type ResponsibleParty = "BORROWER" | "FINANCIER";

export type Review = {
  __typename?: "Review";
  comment: Scalars["String"]["output"];
  conversationId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  propertyId: Scalars["ID"]["output"];
  rating: Scalars["Int"]["output"];
  replies?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  user: Scalars["ID"]["output"];
  userAvatar?: Maybe<Scalars["String"]["output"]>;
  userName?: Maybe<Scalars["String"]["output"]>;
};

export type ReviewFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  user?: InputMaybe<Scalars["ID"]["input"]>;
};

export type ReviewOfferDocumentItem = {
  id: Scalars["ID"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status: OfferRequestDocumentStatus;
};

export type RoleFetchType = "dev_buyer" | "financier";

export type RoleRequest = {
  __typename?: "RoleRequest";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documents?: Maybe<Scalars["JSON"]["output"]>;
  id: Scalars["ID"]["output"];
  requestedAt?: Maybe<Scalars["DateTime"]["output"]>;
  role: RequestedRole;
  status?: Maybe<RoleRequestStatus>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  user?: Maybe<User>;
  userId: Scalars["ID"]["output"];
  verifiedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type RoleRequestStatus = "approved" | "pending" | "rejected";

export type RoleVerifiedPayload = {
  __typename?: "RoleVerifiedPayload";
  userType: Scalars["String"]["output"];
  verified: Scalars["Boolean"]["output"];
};

/**
 * The Sale & Purchase Agreement's own lifecycle, independent of `stage`. A draft
 * and a sent-but-unsigned agreement both sit at stage `sale_agreement_pending`;
 * this is what tells them apart, and what gates the buyer's access to the
 * document — a `draft` is issuer-only.
 *
 * "Buyer signed, awaiting the issuer" is `awaiting_signatures` with
 * `buyerSignature` set. There is no extra stage for it: the six stage values are
 * shared verbatim with the frontend's cash-purchase-stages.ts.
 */
export type SaleAgreementStatus =
  /** Sent to the buyer. Either or both signatures may already be recorded. */
  | "awaiting_signatures"
  /** Uploaded, issuer-only. The buyer cannot see it or its URL. */
  | "draft"
  /** Countersigned by the issuer — the agreement is executed. */
  | "executed"
  /**
   * Withdrawn with no replacement pending. Reserved: `reissueSaleAgreement` voids
   * the round and goes straight back to `draft`, since the issuer is on their way
   * to uploading a corrected copy. Read it, do not expect to see it.
   */
  | "voided";

export type SaveUserPolicyInput = {
  data: Scalars["JSON"]["input"];
  role: UserPolicyRole;
  schemaVersion: Scalars["Int"]["input"];
};

export type ScheduleType = "FINANCIER" | "ISSUER";

export type SendMessageInput = {
  attachmentComment?: InputMaybe<Scalars["String"]["input"]>;
  content: Scalars["JSONObject"]["input"];
  conversationId: Scalars["ID"]["input"];
  fileUrl?: InputMaybe<Scalars["String"]["input"]>;
  messageType: Scalars["String"]["input"];
  pollData?: InputMaybe<Scalars["JSONObject"]["input"]>;
  replyTo?: InputMaybe<Scalars["JSONObject"]["input"]>;
  senderPicture?: InputMaybe<Scalars["String"]["input"]>;
  transactionId?: InputMaybe<Scalars["String"]["input"]>;
};

export type SendNotificationInput = {
  body: Scalars["String"]["input"];
  brand?: InputMaybe<Scalars["String"]["input"]>;
  kind?: InputMaybe<Array<Scalars["String"]["input"]>>;
  payload?: InputMaybe<Scalars["JSON"]["input"]>;
  recipient?: InputMaybe<NotificationRecipientInput>;
  recipients?: InputMaybe<Array<NotificationRecipientInput>>;
  title: Scalars["String"]["input"];
  type?: InputMaybe<Scalars["String"]["input"]>;
};

export type SenderType = "automated" | "system" | "user";

export type SetSupportUserInitialPasswordInput = {
  password: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type SetSupportUserInitialPasswordPayload = {
  __typename?: "SetSupportUserInitialPasswordPayload";
  email: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
};

/**
 * A single party's signature on a document, with the audit context captured at the
 * moment of signing. Party is BORROWER or FINANCIER.
 */
export type SignatureRecord = {
  __typename?: "SignatureRecord";
  actorId?: Maybe<Scalars["ID"]["output"]>;
  /** The signed copy of the document this party uploaded when signing, if any. */
  documentUrl?: Maybe<Scalars["String"]["output"]>;
  ip?: Maybe<Scalars["String"]["output"]>;
  party: Scalars["String"]["output"];
  signedAt: Scalars["DateTime"]["output"];
  userAgent?: Maybe<Scalars["String"]["output"]>;
};

export type SignupInput = {
  confirmPassword: Scalars["String"]["input"];
  countryCode: Scalars["String"]["input"];
  defaultRole: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  password: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
  profileImage?: InputMaybe<Scalars["String"]["input"]>;
  walletId?: InputMaybe<Scalars["String"]["input"]>;
};

export type SiteCoordinates = {
  __typename?: "SiteCoordinates";
  coordinates?: Maybe<Array<Maybe<Coordinates>>>;
};

export type SortOrder = "ascending" | "descending";

/** One party's signature on the SPA, with the counterpart copy they uploaded. */
export type SpaSignature = {
  __typename?: "SpaSignature";
  /** Signer display name — the buyer's typed signature, the issuer's profile name. */
  name: Scalars["String"]["output"];
  signedAt: Scalars["String"]["output"];
  /**
   * The signed / counter-signed document. Null only for a signature recorded
   * before the client uploaded a copy.
   */
  signedCopyUrl?: Maybe<Scalars["String"]["output"]>;
};

export type Status = "failed" | "pending" | "success";

export type StatusDeclaration = {
  __typename?: "StatusDeclaration";
  amendmentDetails?: Maybe<Scalars["String"]["output"]>;
  amendmentDoc?: Maybe<Scalars["String"]["output"]>;
  amendmentType: DeclarationAmendmentType;
  amountCollectedThisMonth?: Maybe<Scalars["Float"]["output"]>;
  amountDisbursedThisPeriod?: Maybe<Scalars["Float"]["output"]>;
  /** Filings may be cancelled up to this instant (7 days after submission). */
  cancellableUntil?: Maybe<Scalars["DateTime"]["output"]>;
  cancelled: Scalars["Boolean"]["output"];
  coversReportingGap: Scalars["Boolean"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
  currentPeriodInterestRate?: Maybe<Scalars["Float"]["output"]>;
  dischargeDoc?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  /** False once superseded by a later filing for the same period, or when cancelled. */
  isActive: Scalars["Boolean"]["output"];
  loanBook?: Maybe<Scalars["String"]["output"]>;
  loanId?: Maybe<Scalars["ID"]["output"]>;
  loanStatus: DeclarationLoanStatus;
  nextPaymentAmount?: Maybe<Scalars["Float"]["output"]>;
  nextPaymentDate?: Maybe<Scalars["DateTime"]["output"]>;
  notes?: Maybe<Scalars["String"]["output"]>;
  offerRequestId: Scalars["ID"]["output"];
  outstandingInterest: Scalars["Float"]["output"];
  outstandingPenalties?: Maybe<Scalars["Float"]["output"]>;
  outstandingPrincipal: Scalars["Float"]["output"];
  paymentStatus: DeclarationPaymentStatus;
  prepaymentFlag: Scalars["Boolean"]["output"];
  prepaymentPenaltyAmount?: Maybe<Scalars["Float"]["output"]>;
  reportingDate: Scalars["DateTime"]["output"];
  submittedAt: Scalars["DateTime"]["output"];
  submittedByRole: Scalars["String"]["output"];
  /** Id of the declaration that superseded this one, if any. */
  supersededBy?: Maybe<Scalars["ID"]["output"]>;
  /** Computed server-side: principal + interest + penalties. */
  totalOutstanding: Scalars["Float"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type StringOperator = {
  eq?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  like?: InputMaybe<Scalars["String"]["input"]>;
  notContains?: InputMaybe<Scalars["String"]["input"]>;
  notEq?: InputMaybe<Scalars["String"]["input"]>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  regex?: InputMaybe<Scalars["String"]["input"]>;
};

export type SubmitBorrowerLoanRequestInput = {
  declarationId?: InputMaybe<Scalars["ID"]["input"]>;
  /** Supporting-file URL (upload to the vault first). */
  doc?: InputMaybe<Scalars["String"]["input"]>;
  kind: LoanRequestKind;
  offerRequestId: Scalars["ID"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
};

export type SubmitOfferDocumentFile = {
  documentUrl: Scalars["String"]["input"];
  fileName?: InputMaybe<Scalars["String"]["input"]>;
  /** Human label for the slot this file fills — "Front", "Back", "Month 1"… */
  slotLabel?: InputMaybe<Scalars["String"]["input"]>;
};

export type SubmitOfferDocumentItem = {
  /** Every file the borrower uploaded for this request (front/back, multiple payslips). */
  files?: InputMaybe<Array<SubmitOfferDocumentFile>>;
  id: Scalars["ID"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
};

export type SubscribeToPushInput = {
  pushToken?: InputMaybe<Scalars["String"]["input"]>;
  subscription?: InputMaybe<Scalars["JSON"]["input"]>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type SupportAuthPayload = {
  __typename?: "SupportAuthPayload";
  accessToken: Scalars["String"]["output"];
  user: SupportUser;
};

export type SupportRole = {
  __typename?: "SupportRole";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isSystem: Scalars["Boolean"]["output"];
  members?: Maybe<Array<SupportRoleMember>>;
  name: Scalars["String"]["output"];
  permissions: Array<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type SupportRoleFilter = {
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  isSystem?: InputMaybe<BooleanOperator>;
  name?: InputMaybe<StringOperator>;
};

export type SupportRoleMember = {
  __typename?: "SupportRoleMember";
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  lastName: Scalars["String"]["output"];
  supportRoleId: Scalars["ID"]["output"];
};

export type SupportUser = {
  __typename?: "SupportUser";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastName: Scalars["String"]["output"];
  supportRole?: Maybe<SupportRole>;
  supportRoleId: Scalars["ID"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type SupportUserFilter = {
  createdAt?: InputMaybe<DateOperator>;
  email?: InputMaybe<StringOperator>;
  firstName?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  lastName?: InputMaybe<StringOperator>;
  supportRoleId?: InputMaybe<IdOperator>;
};

export type TailoringRule = {
  __typename?: "TailoringRule";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  documentCodes: Array<Scalars["String"]["output"]>;
  entityType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isActive: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  platformRole?: Maybe<Scalars["String"]["output"]>;
  requirement?: Maybe<RequirementLevel>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TailoringRuleFilter = {
  entityType?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  isActive?: InputMaybe<BooleanOperator>;
  platformRole?: InputMaybe<StringOperator>;
};

export type TailoringRuleResponse = {
  __typename?: "TailoringRuleResponse";
  rule?: Maybe<TailoringRule>;
  success: Scalars["Boolean"]["output"];
};

export type TempProject = {
  __typename?: "TempProject";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  ownerId?: Maybe<Scalars["ID"]["output"]>;
  payload?: Maybe<Scalars["JSONObject"]["output"]>;
  paymentStatus?: Maybe<Scalars["String"]["output"]>;
  sessionId: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TempProjectFilter = {
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
  sessionId?: InputMaybe<IdOperator>;
};

export type Tenor = {
  __typename?: "Tenor";
  count: Scalars["Int"]["output"];
  period: Scalars["String"]["output"];
};

export type TenorInput = {
  count?: InputMaybe<Scalars["Int"]["input"]>;
  period?: InputMaybe<Scalars["String"]["input"]>;
};

export type TermChangeFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type TermSheet = {
  __typename?: "TermSheet";
  /** Deadline by which the borrower must accept (defaults to the term-sheet expiry). */
  acceptByDate?: Maybe<Scalars["DateTime"]["output"]>;
  availableTokens?: Maybe<Scalars["Int"]["output"]>;
  blockNumber?: Maybe<Scalars["Int"]["output"]>;
  buyer?: Maybe<User>;
  buyerId?: Maybe<Scalars["ID"]["output"]>;
  completionDate?: Maybe<Scalars["DateTime"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
  documentUrl?: Maybe<Scalars["String"]["output"]>;
  downPayment?: Maybe<Scalars["Float"]["output"]>;
  dsraAmount?: Maybe<Scalars["Float"]["output"]>;
  /** First scheduled instalment amount (major units), from the repayment schedule. */
  estimatedMonthlyInstalment?: Maybe<Scalars["Float"]["output"]>;
  executionDate?: Maybe<Scalars["DateTime"]["output"]>;
  financedAmount?: Maybe<Scalars["Float"]["output"]>;
  financier?: Maybe<Entity>;
  financierId?: Maybe<Scalars["ID"]["output"]>;
  financierLoanId?: Maybe<Scalars["ID"]["output"]>;
  guarantorId?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  initialDeposit?: Maybe<Scalars["Float"]["output"]>;
  interestRate?: Maybe<Scalars["JSONObject"]["output"]>;
  isFractionalised?: Maybe<Scalars["Boolean"]["output"]>;
  issuer?: Maybe<Entity>;
  issuerId?: Maybe<Scalars["ID"]["output"]>;
  loanTenor?: Maybe<Scalars["JSONObject"]["output"]>;
  longstopDate?: Maybe<Scalars["DateTime"]["output"]>;
  ltv?: Maybe<Scalars["Float"]["output"]>;
  metadata?: Maybe<Scalars["JSONObject"]["output"]>;
  modeOfFinancing?: Maybe<Scalars["String"]["output"]>;
  offerRequestId?: Maybe<Scalars["ID"]["output"]>;
  ownerShares?: Maybe<Array<Maybe<Scalars["JSONObject"]["output"]>>>;
  parentTermSheetId?: Maybe<Scalars["ID"]["output"]>;
  /** Upfront processing fee (major units), from the granted Offer's fee schedule. */
  processingFee?: Maybe<Scalars["Float"]["output"]>;
  projectId: Scalars["ID"]["output"];
  property?: Maybe<Property>;
  purchasePrice?: Maybe<Scalars["Float"]["output"]>;
  repaymentFrequency?: Maybe<Scalars["String"]["output"]>;
  shareToken?: Maybe<Scalars["String"]["output"]>;
  signatures?: Maybe<Array<Maybe<TermSheetSignature>>>;
  status?: Maybe<TermSheetStatus>;
  termScheduleId?: Maybe<Scalars["ID"]["output"]>;
  termSheetExpiryDate?: Maybe<Scalars["DateTime"]["output"]>;
  totalAmount?: Maybe<Scalars["JSONObject"]["output"]>;
  /** Total repayable over the life of the loan (major units). */
  totalRepayable?: Maybe<Scalars["Float"]["output"]>;
  transactionHash?: Maybe<Scalars["String"]["output"]>;
  transactionRefNo?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<TermSheetType>;
  unitToken?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

/**
 * A borrower's request that the financier revise the issued term sheet, recorded
 * when they decline to accept it as drafted.
 */
export type TermSheetChangeRequest = {
  __typename?: "TermSheetChangeRequest";
  /** The borrower's description of the changes they want. */
  message: Scalars["String"]["output"];
  requestedAt: Scalars["DateTime"]["output"];
};

export type TermSheetFilter = {
  buyerId?: InputMaybe<IdOperator>;
  financierId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  issuerId?: InputMaybe<IdOperator>;
  offerRequestId?: InputMaybe<IdOperator>;
  parentTermSheetId?: InputMaybe<IdOperator>;
  projectId?: InputMaybe<IdOperator>;
  status?: InputMaybe<TermSheetStatus>;
};

export type TermSheetSignature = {
  __typename?: "TermSheetSignature";
  digitalSignature?: Maybe<Scalars["String"]["output"]>;
  entityId?: Maybe<Scalars["ID"]["output"]>;
  memberRole?: Maybe<Scalars["String"]["output"]>;
  userId?: Maybe<Scalars["ID"]["output"]>;
};

export type TermSheetStatus = "COMPLETED" | "DRAFT" | "EXECUTED" | "LAPSED" | "TERMINATED";

export type TermSheetType = "BUYER_FINANCIER" | "ISSUER_FINANCIER";

export type Ticket = {
  __typename?: "Ticket";
  amountPaid?: Maybe<Scalars["String"]["output"]>;
  assignedTo?: Maybe<Scalars["Int"]["output"]>;
  assignee?: Maybe<TicketAssignee>;
  comments?: Maybe<Array<TicketComment>>;
  conversationId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  referenceNo?: Maybe<Scalars["String"]["output"]>;
  status: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  userId: Scalars["String"]["output"];
};

export type TicketAssignee = {
  __typename?: "TicketAssignee";
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  lastName: Scalars["String"]["output"];
};

export type TicketComment = {
  __typename?: "TicketComment";
  author?: Maybe<TicketAssignee>;
  authorId: Scalars["Int"]["output"];
  body: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  ticketId: Scalars["ID"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TicketFilter = {
  assignedTo?: InputMaybe<NumberOperator>;
  conversationId?: InputMaybe<StringOperator>;
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  referenceNo?: InputMaybe<StringOperator>;
  status?: InputMaybe<StringOperator>;
  type?: InputMaybe<StringOperator>;
  userId?: InputMaybe<StringOperator>;
};

export type TicketStatus = "closed" | "in_progress" | "open" | "resolved";

export type ToggleFavoriteResult = {
  __typename?: "ToggleFavoriteResult";
  added: Scalars["Boolean"]["output"];
};

export type ToggleSuspendPayload = {
  __typename?: "ToggleSuspendPayload";
  isSuspended: Scalars["Boolean"]["output"];
  message: Scalars["String"]["output"];
  userId: Scalars["ID"]["output"];
};

/** A token escrow lifecycle event for a loan. */
export type TokenEvent = {
  __typename?: "TokenEvent";
  amount?: Maybe<Scalars["Float"]["output"]>;
  id: Scalars["ID"]["output"];
  loanId?: Maybe<Scalars["ID"]["output"]>;
  note: Scalars["String"]["output"];
  offerRequestId: Scalars["ID"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  type: TokenEventType;
};

export type TokenEventType =
  "locked_in_escrow" | "minted" | "released_from_escrow" | "title_transferred";

export type Transaction = {
  __typename?: "Transaction";
  amount?: Maybe<Scalars["JSONObject"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  from?: Maybe<Scalars["JSONObject"]["output"]>;
  id: Scalars["ID"]["output"];
  propertyId: Scalars["ID"]["output"];
  quantity: Scalars["Int"]["output"];
  referenceNo: Scalars["String"]["output"];
  state: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  to?: Maybe<Scalars["JSONObject"]["output"]>;
  tokens: Scalars["Int"]["output"];
  transactionId: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TransactionFilter = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type TransactionVolumePoint = {
  __typename?: "TransactionVolumePoint";
  bucket: Scalars["DateTime"]["output"];
  count: Scalars["Int"]["output"];
  currency: Scalars["String"]["output"];
  label: Scalars["String"]["output"];
  value: Scalars["Float"]["output"];
};

export type Trend = "DOWN" | "FLAT" | "UP";

export type UpdateAssessmentAlertRuleInput = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  operator?: InputMaybe<AssessmentAlertOperator>;
  severity?: InputMaybe<AssessmentAlertSeverity>;
  threshold?: InputMaybe<Scalars["JSONObject"]["input"]>;
  triggerQuestionCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateAssessmentCategoryInput = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  label?: InputMaybe<Scalars["String"]["input"]>;
  templateId?: InputMaybe<Scalars["ID"]["input"]>;
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type UpdateAssessmentDocumentInput = {
  fileUrl?: InputMaybe<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  requirement?: InputMaybe<AssessmentDocumentRequirement>;
  status?: InputMaybe<AssessmentDocumentStatus>;
};

export type UpdateAssessmentInput = {
  consentGivenAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  declarationGivenAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  officerNotes?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateAssessmentQuestionInput = {
  answerType?: InputMaybe<AssessmentAnswerType>;
  categoryId?: InputMaybe<Scalars["ID"]["input"]>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  guidance?: InputMaybe<Scalars["String"]["input"]>;
  isKycAutofill?: InputMaybe<Scalars["Boolean"]["input"]>;
  isRequired?: InputMaybe<Scalars["Boolean"]["input"]>;
  isScored?: InputMaybe<Scalars["Boolean"]["input"]>;
  kycSourceField?: InputMaybe<Scalars["String"]["input"]>;
  prompt?: InputMaybe<Scalars["String"]["input"]>;
  scoringLogicText?: InputMaybe<Scalars["String"]["input"]>;
  templateId?: InputMaybe<Scalars["ID"]["input"]>;
  unit?: InputMaybe<Scalars["String"]["input"]>;
  verification?: InputMaybe<Scalars["String"]["input"]>;
  weight?: InputMaybe<Scalars["Float"]["input"]>;
};

export type UpdateAssessmentQuestionOptionInput = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  label?: InputMaybe<Scalars["String"]["input"]>;
  score?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateAssessmentReadinessBandInput = {
  action?: InputMaybe<Scalars["String"]["input"]>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  guidance?: InputMaybe<Scalars["String"]["input"]>;
  label?: InputMaybe<Scalars["String"]["input"]>;
  maxScore?: InputMaybe<Scalars["Int"]["input"]>;
  minScore?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateAssessmentScoringBandInput = {
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  maxValue?: InputMaybe<Scalars["Float"]["input"]>;
  minValue?: InputMaybe<Scalars["Float"]["input"]>;
  score?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateAssessmentTemplateInput = {
  code?: InputMaybe<Scalars["String"]["input"]>;
  consentText?: InputMaybe<Scalars["String"]["input"]>;
  declarationText?: InputMaybe<Scalars["String"]["input"]>;
  legalNotice?: InputMaybe<Scalars["String"]["input"]>;
  maxScorePerParameter?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  status?: InputMaybe<AssessmentTemplateStatus>;
  subjectType?: InputMaybe<AssessmentSubjectType>;
  version?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateComplianceSectionInput = {
  bg?: InputMaybe<Scalars["String"]["input"]>;
  color?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateComplianceSubmissionInput = {
  note?: InputMaybe<Scalars["String"]["input"]>;
  reviewer?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<DocStatus>;
};

export type UpdateComplianceTemplateInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  documentCode?: InputMaybe<Scalars["String"]["input"]>;
  gatedActions?: InputMaybe<Array<GatedAction>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  required?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UpdateConversationInput = {
  id: Scalars["ID"]["input"];
  kind?: InputMaybe<ConversationKind>;
  lastMessageId?: InputMaybe<Scalars["ID"]["input"]>;
  paymentStatus?: InputMaybe<ConversationPaymentStatus>;
  referenceNumber?: InputMaybe<Scalars["String"]["input"]>;
  transactionId?: InputMaybe<Scalars["String"]["input"]>;
  transferDocument?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateDocumentRequestInput = {
  acceptedFileTypes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  count?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  documentCode?: InputMaybe<Scalars["String"]["input"]>;
  dueDate?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  required?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UpdateDueDiligenceInput = {
  dueDiligenceInitiatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  dueDiligenceReportDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  dueDiligenceReportImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  dueDiligenceReportMessage?: InputMaybe<Scalars["String"]["input"]>;
  dueDiligenceStatus?: InputMaybe<DueDiligenceStatus>;
  id: Scalars["ID"]["input"];
  legalDocuments?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  updatedBy?: InputMaybe<Scalars["JSONObject"]["input"]>;
};

export type UpdateEntityRoleInput = {
  badgeColor?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  permissions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UpdateOfferInput = {
  acceptedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  availabilityPeriodDays?: InputMaybe<Scalars["Int"]["input"]>;
  bondSubType?: InputMaybe<BondSubType>;
  commitmentFeeRate?: InputMaybe<Scalars["Float"]["input"]>;
  conditions?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  covenants?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  depositPercentage?: InputMaybe<Scalars["Float"]["input"]>;
  drawdownSchedule?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  dsraMonths?: InputMaybe<Scalars["Int"]["input"]>;
  financierId?: InputMaybe<Scalars["ID"]["input"]>;
  id: Scalars["ID"]["input"];
  interestRate?: InputMaybe<Scalars["JSONObject"]["input"]>;
  issuedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lenderName?: InputMaybe<Scalars["String"]["input"]>;
  loanSubType?: InputMaybe<LoanSubType>;
  loanTenor?: InputMaybe<Scalars["JSONObject"]["input"]>;
  loanType?: InputMaybe<LoanType>;
  ltv?: InputMaybe<Scalars["Float"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  moratorium?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  offerExpiryDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  offerStatus?: InputMaybe<OfferStatus>;
  otherFees?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  processingTimeline?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyName?: InputMaybe<Scalars["String"]["input"]>;
  rateType?: InputMaybe<RateType>;
  recipientId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<RepaymentFrequency>;
  repaymentType?: InputMaybe<RepaymentType>;
  revokedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  schedule?: InputMaybe<Scalars["JSONObject"]["input"]>;
  security?: InputMaybe<Scalars["JSONObject"]["input"]>;
  sources?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type UpdateOfferRequestInput = {
  agreedAmount?: InputMaybe<Scalars["Float"]["input"]>;
  approvedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  buyerId?: InputMaybe<Scalars["ID"]["input"]>;
  financierId?: InputMaybe<Scalars["ID"]["input"]>;
  id: Scalars["ID"]["input"];
  initialDeposit?: InputMaybe<Scalars["Float"]["input"]>;
  issuerId?: InputMaybe<Scalars["ID"]["input"]>;
  modeOfFinancing?: InputMaybe<ModeOfFinancing>;
  offer?: InputMaybe<Scalars["JSONObject"]["input"]>;
  paymentStatus?: InputMaybe<OfferRequestPaymentStatus>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  refNo?: InputMaybe<Scalars["String"]["input"]>;
  requestStatus?: InputMaybe<OfferRequestStatus>;
  requestedAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type UpdatePaymentScheduleInput = {
  createdForId?: InputMaybe<Scalars["ID"]["input"]>;
  id: Scalars["ID"]["input"];
  interestRate?: InputMaybe<Scalars["Float"]["input"]>;
  loanId?: InputMaybe<Scalars["ID"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<Scalars["String"]["input"]>;
  repaymentTerms?: InputMaybe<Scalars["JSONObject"]["input"]>;
  totalInterest?: InputMaybe<Scalars["String"]["input"]>;
  totalRepayment?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdatePortfolioInput = {
  additionalFiles?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  construction?: InputMaybe<ConstructionInput>;
  constructionCommencementDate?: InputMaybe<Scalars["String"]["input"]>;
  epaPermitNumber?: InputMaybe<Scalars["String"]["input"]>;
  gpsAddress?: InputMaybe<Scalars["String"]["input"]>;
  grossDevelopmentValue?: InputMaybe<Scalars["Float"]["input"]>;
  id: Scalars["ID"]["input"];
  landValuationAmount?: InputMaybe<Scalars["Float"]["input"]>;
  landValuer?: InputMaybe<Scalars["String"]["input"]>;
  listingObjective?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  planningPermitNumber?: InputMaybe<Scalars["String"]["input"]>;
  portfolioType?: InputMaybe<Scalars["String"]["input"]>;
  practicalCompletionDate?: InputMaybe<Scalars["String"]["input"]>;
  projectCost?: InputMaybe<ProjectCostInput>;
  projectDescription?: InputMaybe<Scalars["String"]["input"]>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  projectName?: InputMaybe<Scalars["String"]["input"]>;
  projectStatus?: InputMaybe<Scalars["String"]["input"]>;
  projectType?: InputMaybe<Scalars["String"]["input"]>;
  properties?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  propertyTypes?: InputMaybe<Array<InputMaybe<PropertyTypesInput>>>;
  readiness?: InputMaybe<Scalars["Int"]["input"]>;
  sessionId?: InputMaybe<Scalars["String"]["input"]>;
  sharedAmenities?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  squareFeet?: InputMaybe<Scalars["Int"]["input"]>;
  streetAddress?: InputMaybe<Scalars["String"]["input"]>;
  titleNumber?: InputMaybe<Scalars["String"]["input"]>;
  totalDevelopmentCost?: InputMaybe<Scalars["Float"]["input"]>;
  yearBuilt?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateRepaymentInput = {
  conversationId?: InputMaybe<Scalars["ID"]["input"]>;
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  createdForId?: InputMaybe<Scalars["ID"]["input"]>;
  id: Scalars["ID"]["input"];
  interestRate?: InputMaybe<Scalars["Float"]["input"]>;
  isSubscribedToReferenceRate?: InputMaybe<Scalars["Boolean"]["input"]>;
  loanId?: InputMaybe<Scalars["ID"]["input"]>;
  maxLoanAmount?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  offerRequestId?: InputMaybe<Scalars["ID"]["input"]>;
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  repaymentFrequency?: InputMaybe<Scalars["String"]["input"]>;
  repaymentTerms?: InputMaybe<Scalars["JSONObject"]["input"]>;
  scheduleType?: InputMaybe<Scalars["String"]["input"]>;
  totalInterest?: InputMaybe<Scalars["String"]["input"]>;
  totalRepayment?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  conversationId?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  rating?: InputMaybe<Scalars["Int"]["input"]>;
  replies?: InputMaybe<Array<InputMaybe<Scalars["JSONObject"]["input"]>>>;
  userAvatar?: InputMaybe<Scalars["String"]["input"]>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateSupportRoleInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  permissions?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UpdateTailoringRuleInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  documentCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  entityType?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  platformRole?: InputMaybe<Scalars["String"]["input"]>;
  requirement?: InputMaybe<RequirementLevel>;
};

export type UpdateTempProjectInput = {
  id: Scalars["ID"]["input"];
  result?: InputMaybe<Scalars["JSONObject"]["input"]>;
};

export type UpdateTermSheetInput = {
  buyerId?: InputMaybe<Scalars["ID"]["input"]>;
  completionDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  currency?: InputMaybe<Scalars["String"]["input"]>;
  documentUrl?: InputMaybe<Scalars["String"]["input"]>;
  downPayment?: InputMaybe<Scalars["Float"]["input"]>;
  dsraAmount?: InputMaybe<Scalars["Float"]["input"]>;
  executionDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  financedAmount?: InputMaybe<Scalars["Float"]["input"]>;
  financierId?: InputMaybe<Scalars["ID"]["input"]>;
  initialDeposit?: InputMaybe<Scalars["Float"]["input"]>;
  interestRate?: InputMaybe<Scalars["JSONObject"]["input"]>;
  issuerId?: InputMaybe<Scalars["ID"]["input"]>;
  loanTenor?: InputMaybe<Scalars["JSONObject"]["input"]>;
  longstopDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  ltv?: InputMaybe<Scalars["Float"]["input"]>;
  metadata?: InputMaybe<Scalars["JSONObject"]["input"]>;
  modeOfFinancing?: InputMaybe<Scalars["String"]["input"]>;
  purchasePrice?: InputMaybe<Scalars["Float"]["input"]>;
  repaymentFrequency?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<TermSheetStatus>;
  termSheetExpiryDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  transactionRefNo?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateTransactionInput = {
  amount?: InputMaybe<Scalars["JSONObject"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  from?: InputMaybe<Scalars["JSONObject"]["input"]>;
  id: Scalars["ID"]["input"];
  propertyId?: InputMaybe<Scalars["ID"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  referenceNo?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  to?: InputMaybe<Scalars["JSONObject"]["input"]>;
  tokens?: InputMaybe<Scalars["Int"]["input"]>;
  transactionId?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

export type UploadComplianceDocumentInput = {
  fileName: Scalars["String"]["input"];
  fileSizeBytes: Scalars["Int"]["input"];
  fileUrl: Scalars["String"]["input"];
  mimeType: Scalars["String"]["input"];
  note?: InputMaybe<Scalars["String"]["input"]>;
  roleType: ComplianceRoleType;
  templateId: Scalars["ID"]["input"];
};

export type UpsertAssessmentResponseInput = {
  assessmentId: Scalars["ID"]["input"];
  questionCode: Scalars["String"]["input"];
  questionId: Scalars["ID"]["input"];
  selectedOptionIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  valueBoolean?: InputMaybe<Scalars["Boolean"]["input"]>;
  valueDate?: InputMaybe<Scalars["Date"]["input"]>;
  valueNumber?: InputMaybe<Scalars["Float"]["input"]>;
  valueText?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  __typename?: "User";
  address?: Maybe<Scalars["String"]["output"]>;
  bankDetails?: Maybe<Scalars["JSON"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  completedWalkthroughs?: Maybe<Array<Scalars["String"]["output"]>>;
  countryCode: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  deactivatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  defaultRole?: Maybe<Scalars["String"]["output"]>;
  deletionDate?: Maybe<Scalars["DateTime"]["output"]>;
  deletionReason?: Maybe<Scalars["String"]["output"]>;
  digitalSignature?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  employer?: Maybe<Scalars["String"]["output"]>;
  entities?: Maybe<Array<Maybe<Entity>>>;
  entityMemberships?: Maybe<Array<Maybe<EntityMember>>>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  /** "MALE" | "FEMALE". Part of the KYC set a bank account needs. */
  gender?: Maybe<Scalars["String"]["output"]>;
  ghanaCard?: Maybe<Scalars["JSON"]["output"]>;
  googleId?: Maybe<Scalars["String"]["output"]>;
  gpsAddress?: Maybe<Scalars["String"]["output"]>;
  hasCompletedWalkthrough?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  isDeactivated?: Maybe<Scalars["Boolean"]["output"]>;
  isOnboarded?: Maybe<Scalars["Boolean"]["output"]>;
  isSuspended?: Maybe<Scalars["Boolean"]["output"]>;
  isVerified?: Maybe<Scalars["Boolean"]["output"]>;
  lastName?: Maybe<Scalars["String"]["output"]>;
  mfa?: Maybe<Scalars["Boolean"]["output"]>;
  momoNumber?: Maybe<Scalars["String"]["output"]>;
  monthlyNetIncome?: Maybe<Scalars["Float"]["output"]>;
  occupation?: Maybe<Scalars["String"]["output"]>;
  otp?: Maybe<Scalars["String"]["output"]>;
  passport?: Maybe<Scalars["JSON"]["output"]>;
  phoneNumber: Scalars["String"]["output"];
  profileImage?: Maybe<Scalars["String"]["output"]>;
  region?: Maybe<Scalars["String"]["output"]>;
  roles?: Maybe<Array<Maybe<RoleRequest>>>;
  /** Decomposed address — bank KYC needs street/city/region separately from `address`. */
  streetAddress?: Maybe<Scalars["String"]["output"]>;
  subscriptionId?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  walletId?: Maybe<Scalars["String"]["output"]>;
};

export type UserFilter = {
  email?: InputMaybe<StringOperator>;
  firstName?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  lastName?: InputMaybe<StringOperator>;
  phoneNumber?: InputMaybe<StringOperator>;
};

export type UserPolicy = {
  __typename?: "UserPolicy";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  data: Scalars["JSON"]["output"];
  id: Scalars["ID"]["output"];
  /** users.id when ownerType is user, entities.id when ownerType is entity */
  ownerId: Scalars["ID"]["output"];
  /** 'user' for buyer policies, 'entity' for shared issuer/financier policies */
  ownerType: UserPolicyOwnerType;
  role: UserPolicyRole;
  /** The user who last saved this policy (audit) */
  savedByUserId?: Maybe<Scalars["ID"]["output"]>;
  schemaVersion: Scalars["Int"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type UserPolicyOwnerType = "entity" | "user";

export type UserPolicyRole = "buyer" | "financier" | "issuer";

export type UserReference = {
  __typename?: "UserReference";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type UserReferenceInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserStats = {
  __typename?: "UserStats";
  activeUsers: Scalars["Int"]["output"];
  deactivatedUsers: Scalars["Int"]["output"];
  onboardedUsers: Scalars["Int"]["output"];
  roles: Scalars["JSON"]["output"];
  suspendedUsers: Scalars["Int"]["output"];
  totalUsers: Scalars["Int"]["output"];
};

export type VapidPublicKeyResponse = {
  __typename?: "VapidPublicKeyResponse";
  publicKey?: Maybe<Scalars["String"]["output"]>;
};

export type WalletAccount = {
  __typename?: "WalletAccount";
  accountName?: Maybe<Scalars["String"]["output"]>;
  /** The owner's own dedicated account number at the partner bank. */
  accountNumber?: Maybe<Scalars["String"]["output"]>;
  bankName?: Maybe<Scalars["String"]["output"]>;
  /** Not always known immediately — some facilitators only surface it via a balance/info call. */
  branchCode?: Maybe<Scalars["String"]["output"]>;
  /** Funding money for use on Afram. Never withdrawable. */
  cashBalance: Scalars["Float"]["output"];
  /** Reconciliation key for deposits (currently == accountNumber). */
  depositReference?: Maybe<Scalars["String"]["output"]>;
  /** Proceeds owned by the user. Withdrawable to verifiedBankAccount only. */
  payoutBalance: Scalars["Float"]["output"];
  /** Null until a verified bank account exists — no self-service flow to set one yet. */
  verifiedBankAccount?: Maybe<WalletVerifiedBank>;
};

/**
 * Outcome of one party in a provisioning replay.
 *
 * `existing` parties are counted but not listed — a backfill report is about the
 * gap, not the population.
 */
export type WalletProvisioningOutcome =
  | "created"
  | "existing"
  /** The bank or the KYC check refused; see `reason`. */
  | "failed"
  /** Would be attempted — a dry run, or past this run's limit. */
  | "pending"
  /** The id matches neither a user nor an entity. */
  | "unknown_owner";

export type WalletProvisioningReplayEntry = {
  __typename?: "WalletProvisioningReplayEntry";
  outcome: WalletProvisioningOutcome;
  ownerId: Scalars["ID"]["output"];
  /** "user" | "entity", or null when the id resolves to neither. */
  ownerType?: Maybe<Scalars["String"]["output"]>;
  /** Why it failed — usually the exact profile fields the bank still needs. */
  reason?: Maybe<Scalars["String"]["output"]>;
  /** Which lifecycle points obliged this party to have a wallet. */
  sources: Array<Scalars["String"]["output"]>;
  walletId?: Maybe<Scalars["ID"]["output"]>;
};

export type WalletProvisioningReplayResult = {
  __typename?: "WalletProvisioningReplayResult";
  created: Scalars["Int"]["output"];
  currency: Scalars["String"]["output"];
  dryRun: Scalars["Boolean"]["output"];
  entries: Array<WalletProvisioningReplayEntry>;
  existing: Scalars["Int"]["output"];
  failed: Scalars["Int"]["output"];
  pending: Scalars["Int"]["output"];
  /** Distinct parties a wallet.provision was, or should have been, emitted for. */
  scanned: Scalars["Int"]["output"];
  unknownOwner: Scalars["Int"]["output"];
};

export type WalletTxn = {
  __typename?: "WalletTxn";
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["DateTime"]["output"];
  /** deposit/payout = in, payment/withdrawal = out — derived from kind, not stored. */
  direction: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  kind: WalletTxnKind;
  note?: Maybe<Scalars["String"]["output"]>;
  reference?: Maybe<Scalars["String"]["output"]>;
  status: WalletTxnStatus;
};

export type WalletTxnKind = "deposit" | "payment" | "payout" | "withdrawal";

export type WalletTxnStatus = "cleared" | "failed" | "pending";

export type WalletVerifiedBank = {
  __typename?: "WalletVerifiedBank";
  accountName: Scalars["String"]["output"];
  accountNumberMasked: Scalars["String"]["output"];
  bankName: Scalars["String"]["output"];
};

export type YearlyTermSchedule = {
  __typename?: "YearlyTermSchedule";
  months: Array<MonthlyPayment>;
  year: Scalars["Int"]["output"];
};

export type YearlyTermScheduleInput = {
  months?: InputMaybe<Array<Scalars["JSONObject"]["input"]>>;
  year?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GetPublicPropertiesQueryVariables = Exact<{
  pagination?: InputMaybe<Pagination>;
}>;

export type GetPublicPropertiesQuery = {
  __typename?: "Query";
  getPublicProjects: Array<{
    __typename?: "Project";
    id?: string | null;
    projectType?: string | null;
    property?: {
      __typename?: "Property";
      id: string;
      price: number;
      currency?: string | null;
      propertyType?: string | null;
      status?: PropertyStatus | null;
      bedroom?: number | null;
      fullBathroom?: number | null;
      halfBathroom?: number | null;
      squareFeet?: number | null;
      city?: string | null;
      region?: string | null;
      propertyNameOrNumber?: string | null;
      propertyDescription?: string | null;
      propertyCardDesc?: string | null;
      propertyAmenities?: Array<string | null> | null;
      titleType?: string | null;
      landCertificateNumber?: string | null;
      projectImages?: Array<string | null> | null;
      thumbnail?: string | null;
      streetAddress?: string | null;
      gpsAddress?: string | null;
    } | null;
  }>;
};
