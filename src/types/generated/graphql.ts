import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  Date: { input: string; output: string; }
  DateTime: { input: any; output: any; }
  Int64: { input: any; output: any; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
  JSONObject: { input: any; output: any; }
  Money: { input: any; output: any; }
  Token: { input: any; output: any; }
};

/** Who an invite link is for. Never carries the temporary password. */
export type AccessInvite = {
  __typename?: 'AccessInvite';
  email: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  firstName: Scalars['String']['output'];
  role: AccessRole;
  status: AccessInviteStatus;
};

/**
 * An invite is looked up by its token's exact value only (`token: { eq }`); any
 * other operator is refused.
 */
export type AccessInviteFilter = {
  token: StringOperator;
};

/** Where an approved invite stands. */
export type AccessInviteStatus =
  /** Redeemed — the account exists. */
  | 'activated'
  /** Past its 72 hours, or too many wrong temporary passwords. */
  | 'expired'
  /** Usable. */
  | 'pending';

export type AccessRequest = {
  __typename?: 'AccessRequest';
  createdAt: Scalars['DateTime']['output'];
  decidedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  phone: Scalars['String']['output'];
  role: AccessRole;
  status: AccessRequestStatus;
};

export type AccessRequestFilter = {
  createdAt?: InputMaybe<DateOperator>;
  decidedAt?: InputMaybe<DateOperator>;
  email?: InputMaybe<StringOperator>;
  fullName?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  role?: InputMaybe<AccessRoleOperator>;
  status?: InputMaybe<AccessRequestStatusOperator>;
};

export type AccessRequestStatus =
  | 'approved'
  | 'declined'
  | 'pending';

export type AccessRequestStatusOperator = {
  eq?: InputMaybe<AccessRequestStatus>;
  in?: InputMaybe<Array<AccessRequestStatus>>;
  notIn?: InputMaybe<Array<AccessRequestStatus>>;
};

/** Wire values; the website labels them Member, Vendor, Financier. */
export type AccessRole =
  | 'buyer'
  | 'financier'
  | 'issuer';

export type AccessRoleOperator = {
  eq?: InputMaybe<AccessRole>;
  in?: InputMaybe<Array<AccessRole>>;
  notIn?: InputMaybe<Array<AccessRole>>;
};

export type AddParticipantInput = {
  conversationId: Scalars['ID']['input'];
  participant: ParticipantInput;
  userId: Scalars['ID']['input'];
};

export type AddSupportMessageInput = {
  attachments?: InputMaybe<Array<SupportAttachmentInput>>;
  /** Up to 4,000 characters. May be empty when files are attached. */
  body?: InputMaybe<Scalars['String']['input']>;
  idempotencyKey: Scalars['String']['input'];
  reference: Scalars['String']['input'];
};

export type AddUserForPushInput = {
  pushToken?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type AdminDashboardSummary = {
  __typename?: 'AdminDashboardSummary';
  activeCount: Scalars['Int']['output'];
  completedCount: Scalars['Int']['output'];
  overdueCount: Scalars['Int']['output'];
  paidCount: Scalars['Int']['output'];
  totalAmount: Scalars['Float']['output'];
  totalTransactions: Scalars['Int']['output'];
};

/**
 * One category in the approach's document exchange.
 *
 * The same machine as the cash-purchase exchange — a requester asks, a responder
 * supplies, the requester accepts or waives — with one addition: a category may
 * sit at `not_requested`. The pre-approval phase opens nothing by default except
 * the property pack, because a phase whose purpose is to ask the seller first must
 * not begin by demanding seven documents from a buyer nobody has said yes to.
 *
 * ⚠ `direction` names the REQUEST, not the documents. `issuer_to_buyer` is the
 * SELLER asking the buyer: the seller requests and receives, the buyer responds
 * and supplies.
 */
export type ApproachDiligenceItem = {
  __typename?: 'ApproachDiligenceItem';
  approachId: Scalars['ID']['output'];
  categoryId: Scalars['String']['output'];
  /** issuer_to_buyer (seller asks) | buyer_to_issuer (buyer asks) */
  direction: Scalars['String']['output'];
  documents: Array<DiligenceDocument>;
  hint: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  /**
   * The buyer's own documents already on file that answer this ask — verified in
   * their readiness assessment, or accepted by a seller on an earlier deal. Offer
   * them on the buyer's rail; submitting one goes through the ordinary submit
   * mutation and is recorded with that provenance.
   *
   * Buyer only: always empty for the seller. Also empty on a request the buyer
   * makes, on a category not yet opened, once the item is accepted or waived, and
   * for any file already submitted here.
   */
  onFile: Array<HeldDocument>;
  /** What the requester said needs addressing. Set while status is `queried`. */
  query?: Maybe<Scalars['String']['output']>;
  /** not_requested | requested | submitted | queried | accepted | waived */
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  /** Why the requester let this go. Set when status is `waived`. */
  waiverReason?: Maybe<Scalars['String']['output']>;
};

/**
 * A document handed over on the approach itself, outside the exchange (D93).
 *
 * The exchange models an ASK — a requester opens a category, a responder supplies,
 * the requester accepts or waives. This is not one: nobody requested the SPA, and
 * there is no status to settle. It is here because the buyer is about to walk into
 * a bank and the lender wants to see what is being bought.
 *
 * ONE LIVE FILE PER KIND. Replacing overwrites, where the exchange accumulates —
 * a buyer handed two versions of the sale agreement and left to choose is worse
 * off than one handed none.
 */
export type ApproachDocument = {
  __typename?: 'ApproachDocument';
  documentUrl: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** `spa` for now — the sale and purchase agreement. */
  kind: Scalars['String']['output'];
  uploadedAt: Scalars['String']['output'];
};

export type ApproachDocumentInput = {
  documentUrl: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
};

export type ApprovalStatus =
  | 'approved'
  | 'declined'
  | 'pending';

export type Assessment = {
  __typename?: 'Assessment';
  activatedAt?: Maybe<Scalars['DateTime']['output']>;
  alerts?: Maybe<Array<AssessmentAlertSnapshot>>;
  applicantUserId: Scalars['ID']['output'];
  applicationId: Scalars['String']['output'];
  categoryScores?: Maybe<Scalars['JSONObject']['output']>;
  compositeScore?: Maybe<Scalars['Float']['output']>;
  consentGivenAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  declarationGivenAt?: Maybe<Scalars['DateTime']['output']>;
  documents: Array<AssessmentDocument>;
  /** @deprecated Use shareGrants, which carries counterpartyKind. This field lists only the financier ones. */
  financierShareGrants: Array<AssessmentFinancierShareGrant>;
  id: Scalars['ID']['output'];
  officerId?: Maybe<Scalars['ID']['output']>;
  officerNotes?: Maybe<Scalars['String']['output']>;
  readinessBandCode?: Maybe<Scalars['String']['output']>;
  responses: Array<AssessmentResponse>;
  scoredAt?: Maybe<Scalars['DateTime']['output']>;
  /** Every share the subject has granted on this assessment, of any kind. */
  shareGrants: Array<AssessmentShareGrant>;
  status: AssessmentStatus;
  subjectEntity?: Maybe<Entity>;
  subjectEntityId?: Maybe<Scalars['ID']['output']>;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
  template?: Maybe<AssessmentTemplate>;
  templateId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AssessmentAlertOperator =
  | 'eq'
  | 'gt'
  | 'gte'
  | 'in'
  | 'lt'
  | 'lte'
  | 'neq';

export type AssessmentAlertRule = {
  __typename?: 'AssessmentAlertRule';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  operator: AssessmentAlertOperator;
  severity: AssessmentAlertSeverity;
  templateId: Scalars['ID']['output'];
  threshold: Scalars['JSONObject']['output'];
  triggerQuestionCode: Scalars['String']['output'];
};

export type AssessmentAlertRuleFilter = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentAlertSeverity =
  | 'critical'
  | 'info'
  | 'ok'
  | 'warn';

export type AssessmentAlertSnapshot = {
  __typename?: 'AssessmentAlertSnapshot';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
  severity: AssessmentAlertSeverity;
};

export type AssessmentAnswerType =
  | 'boolean'
  | 'currency_ghs'
  | 'date'
  | 'multi_select'
  | 'number'
  | 'percentage'
  | 'single_select'
  | 'text'
  | 'years';

export type AssessmentCategory = {
  __typename?: 'AssessmentCategory';
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  questions: Array<AssessmentQuestion>;
  templateId: Scalars['ID']['output'];
  weight: Scalars['Float']['output'];
};

export type AssessmentCategoryFilter = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

/**
 * Which kind of counterparty an assessment is shared with. The values are platform
 * roles, and the counterparty entity must actually hold the one it is granted
 * under — the kind is a fact about them, not a label the sharer picks.
 */
export type AssessmentCounterpartyKind =
  | 'financier'
  | 'issuer';

export type AssessmentDocument = {
  __typename?: 'AssessmentDocument';
  assessmentId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documentCode: Scalars['String']['output'];
  /** @deprecated Renamed to fileUrl — this holds the document's storage URL, not a UUID. */
  fileId?: Maybe<Scalars['ID']['output']>;
  /** Storage (e.g. Firebase) download URL of the uploaded document. */
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  requirement: AssessmentDocumentRequirement;
  status: AssessmentDocumentStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uploadedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<Scalars['ID']['output']>;
};

export type AssessmentDocumentFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  documentCode?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  status?: InputMaybe<AssessmentDocumentStatusOperator>;
};

export type AssessmentDocumentRequirement =
  | 'advisory'
  | 'financier'
  | 'if_applicable'
  | 'mandatory';

export type AssessmentDocumentStatus =
  | 'not_applicable'
  | 'pending'
  | 'rejected'
  | 'uploaded'
  | 'verified';

export type AssessmentDocumentStatusOperator = {
  eq?: InputMaybe<AssessmentDocumentStatus>;
  in?: InputMaybe<Array<AssessmentDocumentStatus>>;
};

export type AssessmentEntryState = {
  __typename?: 'AssessmentEntryState';
  activeAssessment?: Maybe<Assessment>;
  inProgressAssessment?: Maybe<Assessment>;
  latestTemplate?: Maybe<AssessmentTemplate>;
};

export type AssessmentFilter = {
  applicantUserId?: InputMaybe<IdOperator>;
  applicationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  officerId?: InputMaybe<IdOperator>;
  status?: InputMaybe<AssessmentStatusOperator>;
  subjectEntityId?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentFinancierShareGrant = {
  __typename?: 'AssessmentFinancierShareGrant';
  assessmentId: Scalars['ID']['output'];
  counterpartyEntityId: Scalars['ID']['output'];
  counterpartyKind: AssessmentCounterpartyKind;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  /** @deprecated Renamed to counterpartyEntityId on AssessmentShareGrant. */
  financierEntityId: Scalars['ID']['output'];
  grantedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  scope: AssessmentShareScope;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AssessmentFinancierShareGrantFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  financierEntityId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
};

/**
 * Renamed to AssessmentShareScope when sharing stopped being financier-only
 * (AFR-230). Same two values, same column — kept so no client has to move.
 */
export type AssessmentFinancierShareScope =
  | 'financing_request'
  | 'profile_only';

/**
 * The conclusion of an assessment, as shown to a counterparty it was shared with
 * (AFR-230, contract §3, feedback items 6 and 7).
 *
 * ⚠ This is the ONLY thing a share grant confers. Everything a counterparty does
 * not need in order to decide whether to transact is deliberately absent:
 *
 *   responses / documents  the subject's financial file
 *   categoryScores         where the score came from, category by category
 *   officerNotes           an internal review artefact
 *   guidance / action      the band's coaching text, written TO the subject
 *
 * An issuer deciding whether to sell to this buyer needs to know whether they are
 * good for it, not to read their full financial file. Say so if you need more and
 * we will widen it — the reverse is not available.
 */
export type AssessmentOutput = {
  __typename?: 'AssessmentOutput';
  alerts: Array<AssessmentAlertSnapshot>;
  assessmentId: Scalars['ID']['output'];
  compositeScore?: Maybe<Scalars['Float']['output']>;
  counterpartyKind: AssessmentCounterpartyKind;
  readinessBandCode?: Maybe<Scalars['String']['output']>;
  /** The band's human label, resolved from the template. */
  readinessBandLabel?: Maybe<Scalars['String']['output']>;
  scope: AssessmentShareScope;
  scoredAt?: Maybe<Scalars['DateTime']['output']>;
  /** When the subject shared it with you. */
  sharedAt: Scalars['DateTime']['output'];
  /** Where the assessment itself has got to. Null scores until it is `activated`. */
  status: AssessmentStatus;
  /** Set instead when it is scored against an entity. */
  subjectEntityId?: Maybe<Scalars['ID']['output']>;
  /** Display name of whichever of the two the assessment is about. */
  subjectName?: Maybe<Scalars['String']['output']>;
  /** Set when the assessment is scored against a person. */
  subjectUserId?: Maybe<Scalars['ID']['output']>;
};

export type AssessmentPlatformRole =
  | 'agent'
  | 'buyer'
  | 'financier'
  | 'issuer';

export type AssessmentPlatformRoleOperator = {
  eq?: InputMaybe<AssessmentPlatformRole>;
  in?: InputMaybe<Array<AssessmentPlatformRole>>;
};

export type AssessmentQuestion = {
  __typename?: 'AssessmentQuestion';
  answerType: AssessmentAnswerType;
  categoryId?: Maybe<Scalars['ID']['output']>;
  code: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  guidance?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isKycAutofill: Scalars['Boolean']['output'];
  isRequired: Scalars['Boolean']['output'];
  isScored: Scalars['Boolean']['output'];
  kycSourceField?: Maybe<Scalars['String']['output']>;
  options: Array<AssessmentQuestionOption>;
  prompt: Scalars['String']['output'];
  retiredAt?: Maybe<Scalars['DateTime']['output']>;
  scoringBands: Array<AssessmentScoringBand>;
  scoringLogicText?: Maybe<Scalars['String']['output']>;
  templateId: Scalars['ID']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  verification?: Maybe<Scalars['String']['output']>;
  weight: Scalars['Float']['output'];
};

export type AssessmentQuestionFilter = {
  categoryId?: InputMaybe<IdOperator>;
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentQuestionOption = {
  __typename?: 'AssessmentQuestionOption';
  code: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  questionId: Scalars['ID']['output'];
  score: Scalars['Int']['output'];
};

export type AssessmentQuestionOptionFilter = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  questionId?: InputMaybe<IdOperator>;
};

export type AssessmentReadinessBand = {
  __typename?: 'AssessmentReadinessBand';
  action?: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  guidance?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  maxScore: Scalars['Int']['output'];
  minScore: Scalars['Int']['output'];
  templateId: Scalars['ID']['output'];
};

export type AssessmentReadinessBandFilter = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  templateId?: InputMaybe<IdOperator>;
};

export type AssessmentResponse = {
  __typename?: 'AssessmentResponse';
  assessmentId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  questionCode: Scalars['String']['output'];
  questionId: Scalars['ID']['output'];
  score?: Maybe<Scalars['Int']['output']>;
  scoredByRuleId?: Maybe<Scalars['ID']['output']>;
  selectedOptionIds?: Maybe<Array<Scalars['ID']['output']>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  valueBoolean?: Maybe<Scalars['Boolean']['output']>;
  valueDate?: Maybe<Scalars['Date']['output']>;
  valueNumber?: Maybe<Scalars['Float']['output']>;
  valueText?: Maybe<Scalars['String']['output']>;
  weightedScore?: Maybe<Scalars['Float']['output']>;
};

export type AssessmentResponseFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  questionCode?: InputMaybe<Scalars['String']['input']>;
  questionId?: InputMaybe<IdOperator>;
};

export type AssessmentScoreResult = {
  __typename?: 'AssessmentScoreResult';
  alerts: Array<AssessmentAlertSnapshot>;
  categoryScores: Scalars['JSONObject']['output'];
  compositeScore: Scalars['Float']['output'];
  readinessBandCode?: Maybe<Scalars['String']['output']>;
};

export type AssessmentScoringBand = {
  __typename?: 'AssessmentScoringBand';
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  questionId: Scalars['ID']['output'];
  score: Scalars['Int']['output'];
};

export type AssessmentScoringBandFilter = {
  id?: InputMaybe<IdOperator>;
  questionId?: InputMaybe<IdOperator>;
};

/**
 * One subject's decision to show their assessment to one counterparty.
 *
 * Was `AssessmentFinancierShareGrant`; generalized by AFR-230. The old type name
 * and its `financierEntityId` field are kept as deprecated aliases over the same
 * row.
 */
export type AssessmentShareGrant = {
  __typename?: 'AssessmentShareGrant';
  assessmentId: Scalars['ID']['output'];
  counterpartyEntityId: Scalars['ID']['output'];
  counterpartyKind: AssessmentCounterpartyKind;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  grantedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  scope: AssessmentShareScope;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AssessmentShareGrantFilter = {
  assessmentId?: InputMaybe<IdOperator>;
  counterpartyEntityId?: InputMaybe<IdOperator>;
  counterpartyKind?: InputMaybe<AssessmentCounterpartyKind>;
  id?: InputMaybe<IdOperator>;
};

export type AssessmentShareScope =
  /** For the transaction in hand rather than the standing profile. */
  | 'financing_request'
  | 'profile_only';

export type AssessmentStatus =
  | 'activated'
  | 'archived'
  | 'draft'
  | 'officer_review'
  | 'returned'
  | 'submitted';

export type AssessmentStatusOperator = {
  eq?: InputMaybe<AssessmentStatus>;
  in?: InputMaybe<Array<AssessmentStatus>>;
};

export type AssessmentSubjectType =
  | 'entity'
  | 'user';

export type AssessmentSubjectTypeOperator = {
  eq?: InputMaybe<AssessmentSubjectType>;
  in?: InputMaybe<Array<AssessmentSubjectType>>;
};

export type AssessmentTemplate = {
  __typename?: 'AssessmentTemplate';
  alertRules: Array<AssessmentAlertRule>;
  categories: Array<AssessmentCategory>;
  code: Scalars['String']['output'];
  consentText?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  declarationText?: Maybe<Scalars['String']['output']>;
  history: Array<AssessmentTemplateHistory>;
  id: Scalars['ID']['output'];
  legalNotice?: Maybe<Scalars['String']['output']>;
  maxScorePerParameter: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  platformRole: AssessmentPlatformRole;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  questions: Array<AssessmentQuestion>;
  readinessBands: Array<AssessmentReadinessBand>;
  status: AssessmentTemplateStatus;
  subjectType: AssessmentSubjectType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['String']['output'];
};

export type AssessmentTemplateFilter = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<IdOperator>;
  platformRole?: InputMaybe<AssessmentPlatformRoleOperator>;
  status?: InputMaybe<AssessmentTemplateStatusOperator>;
  subjectType?: InputMaybe<AssessmentSubjectTypeOperator>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type AssessmentTemplateHistory = {
  __typename?: 'AssessmentTemplateHistory';
  action: AssessmentTemplateHistoryAction;
  actorEmail?: Maybe<Scalars['String']['output']>;
  actorId?: Maybe<Scalars['String']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fromStatus?: Maybe<AssessmentTemplateStatus>;
  id: Scalars['ID']['output'];
  templateId: Scalars['ID']['output'];
  toStatus: AssessmentTemplateStatus;
};

export type AssessmentTemplateHistoryAction =
  | 'created'
  | 'published'
  | 'reactivated'
  | 'retired'
  | 'updated';

export type AssessmentTemplateStatus =
  | 'active'
  | 'draft'
  | 'retired';

export type AssessmentTemplateStatusOperator = {
  eq?: InputMaybe<AssessmentTemplateStatus>;
  in?: InputMaybe<Array<AssessmentTemplateStatus>>;
};

export type AssetValueSnapshot = {
  __typename?: 'AssetValueSnapshot';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  ownerId: Scalars['ID']['output'];
  properties?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  timestamp: Scalars['DateTime']['output'];
  totalValue: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  valueByPropertyType?: Maybe<Scalars['JSONObject']['output']>;
  valueByRegion?: Maybe<Scalars['JSONObject']['output']>;
  valueByStatus?: Maybe<Scalars['JSONObject']['output']>;
};

export type AssetValueSnapshotFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
};

export type AssignSupportRequestInput = {
  reference: Scalars['String']['input'];
  /** The support user who owns it. Null unassigns. */
  supportUserId?: InputMaybe<Scalars['Int']['input']>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  actorEmail?: Maybe<Scalars['String']['output']>;
  actorId?: Maybe<Scalars['ID']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  changes?: Maybe<Scalars['JSONObject']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  entity: Scalars['String']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSONObject']['output']>;
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

export type AuditLogStatus =
  | 'FAILURE'
  | 'SUCCESS';

/** One period end on the loan-book value chart. */
export type AumPoint = {
  __typename?: 'AumPoint';
  /**
   * What `value` is denominated in.
   *
   * One currency per point. A book denominated in more than one reports the
   * currency most of it is in rather than silently adding cedis to dollars; a
   * genuinely mixed book wants a series per currency, which is a different shape.
   */
  currency: Scalars['String']['output'];
  /** Period end, so the client can label it in the viewer's locale. */
  periodEnd: Scalars['DateTime']['output'];
  /** Total outstanding across the lender's loans that were live at that date. */
  value: Scalars['Float']['output'];
};

/**
 * Tokens are absent when `mfaRequired` is true: the caller must exchange the
 * emailed OTP via `verifyLoginOtp` to obtain a session.
 */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  /** Masked address the OTP was sent to, e.g. `jo***@example.com`. */
  email?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** True when the account has 2FA enabled and an OTP has been emailed. */
  mfaRequired?: Maybe<Scalars['Boolean']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  /** Present only on an MFA challenge; pass back to `verifyLoginOtp`. */
  userId?: Maybe<Scalars['ID']['output']>;
};

export type BankDetailInput = {
  accountName: Scalars['String']['input'];
  accountNumber: Scalars['String']['input'];
  accountType?: InputMaybe<Scalars['String']['input']>;
  bankBranch?: InputMaybe<Scalars['String']['input']>;
  bankName: Scalars['String']['input'];
  swiftCode?: InputMaybe<Scalars['String']['input']>;
};

export type BondSubType =
  | 'FLOATING_RATE'
  | 'PLAIN_VANILLA'
  | 'ZERO_COUPON';

export type BooleanOperator = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A borrower-raised request against a loan (review-window banner + lender alerts panel). */
export type BorrowerLoanRequest = {
  __typename?: 'BorrowerLoanRequest';
  borrowerName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** The StatusDeclaration being queried, when kind = declaration_review. */
  declarationId?: Maybe<Scalars['ID']['output']>;
  /** Optional supporting-file URL. */
  doc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: LoanRequestKind;
  loanId?: Maybe<Scalars['ID']['output']>;
  offerRequestId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  status: LoanRequestStatus;
};

export type BulkCreatePreTokenizedUnitsResponse = {
  __typename?: 'BulkCreatePreTokenizedUnitsResponse';
  /** Units inserted for the first time. */
  created: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  units: Array<PreTokenizedUnit>;
  /** Units that already existed on the portfolio and were overwritten. */
  updated: Scalars['Int']['output'];
};

export type BulkUpdatePreTokenizedUnitsResponse = {
  __typename?: 'BulkUpdatePreTokenizedUnitsResponse';
  success: Scalars['Boolean']['output'];
  updated: Scalars['Int']['output'];
};

export type BuyerProject = {
  __typename?: 'BuyerProject';
  buyerId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  depositAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  propertyId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  tokensOwned?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type BuyerProjectFilter = {
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/**
 * The caller's own property holdings as a buyer, split into two sections:
 * `inProgress` (a loan taken for the property is still being disbursed/repaid)
 * and `owned` (financing discharged/closed, or paid outright in cash).
 */
export type BuyerPropertyHoldings = {
  __typename?: 'BuyerPropertyHoldings';
  inProgress: Array<Property>;
  owned: Array<Property>;
};

/**
 * The 13-stage cash-purchase lifecycle. Values match the frontend's
 * cash-purchase-stages.ts, which already ships against this contract.
 *
 * Supersedes the 6-stage spine. `deposit_verified` is now
 * `commitment_deposit_paid`; `settlement_pending` is gone entirely — the balance
 * is paid from the buyer's wallet at `sale_agreement_signed`, which moves the deal
 * to `escrow_funded`.
 */
export type CashPurchaseStage =
  /** Terminal — tokens minted, title transferred. */
  | 'closed'
  /** The deposit is paid. The issuer responds next. */
  | 'commitment_deposit_paid'
  /** The issuer confirmed every completion condition. */
  | 'completion_conditions_confirmed'
  /** Every request accepted or waived, both directions. */
  | 'diligence_complete'
  /** The outstanding balance is paid into escrow. */
  | 'escrow_funded'
  /** The escrowed funds reached the issuer. */
  | 'funds_released'
  /** The buyer signed off inspection and valuation. */
  | 'inspection_complete'
  /** The issuer accepted the offer. */
  | 'offer_responded'
  /** Placed. The buyer pays the 10% commitment deposit from their wallet here. */
  | 'request_submitted'
  /** An agreement exists. Draft or out for signature — see saleAgreementStatus. */
  | 'sale_agreement_pending'
  /** Executed by the issuer's countersignature. The balance is paid next. */
  | 'sale_agreement_signed'
  /** Price, structure and completion date agreed — the diligence exchange opens. */
  | 'terms_agreed'
  /** The buyer let the withdrawal window close. Past here they cannot walk away. */
  | 'withdrawal_window_closed';

export type CashPurchaseTxn = {
  __typename?: 'CashPurchaseTxn';
  /**
   * What is still to be paid: max(0, unitPrice − confirmed escrow in).
   *
   * The commitment deposit is already in the same pot and nets off, so this falls
   * as money clears. Returned and reversed legs do not count as confirmed.
   */
  balanceDue: Scalars['Float']['output'];
  /** The buyer paying with personal funds. */
  buyer?: Maybe<User>;
  /** The buyer's signature. Recorded first; does not execute the agreement. */
  buyerSignature?: Maybe<SpaSignature>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  depositAmount: Scalars['Float']['output'];
  /** The reference the buyer quotes when transferring the 10% deposit. */
  depositReference: Scalars['String']['output'];
  /**
   * The §4 exchange, both directions. Seeded at `agreeTerms` — before terms are
   * agreed there is no deal to run diligence on, so this is empty rather than
   * dormant.
   */
  diligenceItems?: Maybe<Array<DiligenceItem>>;
  /** Issuer uploads: annexes, the invoice, and their own receipt files. */
  documents?: Maybe<Array<CashTransactionDocument>>;
  /** Every money leg on the deal, oldest first. */
  escrowEvents?: Maybe<Array<EscrowEvent>>;
  events: Array<CashStageEvent>;
  /** The issuer's closing document. `completeTitleTransfer` is gated on it. */
  finalDisclosure?: Maybe<FinalDisclosure>;
  id: Scalars['ID']['output'];
  /** §2.1-2.3. Null on deals placed before the inspection contract shipped. */
  inspection?: Maybe<TransactionInspection>;
  /** The issuer selling the unit — the counterparty on the issuer tracker. */
  issuer?: Maybe<Entity>;
  /** The issuer's countersignature — the final, executing signature. */
  issuerSignature?: Maybe<SpaSignature>;
  /**
   * The PERSONAL_FUNDS offer request this purchase realizes. Use it to reach the
   * offer-request-anchored surfaces (documents, holdings) for this deal.
   */
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  /**
   * The parent portfolio's display name. Kept on the transaction because
   * Property.portfolio is only populated by the listing brokers.
   */
  projectName?: Maybe<Scalars['String']['output']>;
  /** The unit being bought. Read live off the properties table, never a snapshot. */
  property?: Maybe<Property>;
  /**
   * Receipts AFRAM built and stands behind, oldest first. Immutable once issued.
   *
   * Deliberately the `SellerReceipt` shape: it is the same document with the same
   * arithmetic, and the frontend renders both flows through one component.
   */
  receipts?: Maybe<Array<SellerReceipt>>;
  /** Human-facing code, e.g. AFR-CASH-2026-1234 — display this, route on `id`. */
  reference: Scalars['String']['output'];
  /** When the agreement was sent to the buyer for signature. */
  saleAgreementSentAt?: Maybe<Scalars['String']['output']>;
  /** Null until the issuer uploads an agreement. */
  saleAgreementStatus?: Maybe<SaleAgreementStatus>;
  /**
   * The unsigned SPA the issuer uploaded. Null for the buyer while
   * `saleAgreementStatus` is `draft` — the draft is issuer-only until it is sent.
   */
  saleAgreementUrl?: Maybe<Scalars['String']['output']>;
  /** Counts reissues — 1 for the first round, incremented on every reissue. */
  saleAgreementVersion: Scalars['Int']['output'];
  /** Only present once the balance has been paid. */
  settlement?: Maybe<CashSettlement>;
  /** The deadline the issuer set at send time, if any. */
  signingDeadline?: Maybe<Scalars['String']['output']>;
  stage: CashPurchaseStage;
  /**
   * The same history as `events`, in the flow-agnostic `StageEvent` shape (§6).
   *
   * Both are served from one set of rows — this is a projection, not a second log.
   * `events` stays for existing callers; new work should read `stageEvents`, which
   * is identical across all three flows so one stepper component serves them all.
   */
  stageEvents: Array<StageEvent>;
  /** active | withdrawn | closed */
  status: Scalars['String']['output'];
  /** Set at settlement; 1 token = GHS 1.00 at issuance. */
  tokensTransferred?: Maybe<Scalars['Float']['output']>;
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  /** Set when either party walked away inside the withdrawal window. */
  withdrawal?: Maybe<CashWithdrawal>;
};

export type CashSettlement = {
  __typename?: 'CashSettlement';
  amount: Scalars['Float']['output'];
  method: Scalars['String']['output'];
  paidAt: Scalars['String']['output'];
  reference: Scalars['String']['output'];
};

export type CashStageEvent = {
  __typename?: 'CashStageEvent';
  actor: Scalars['String']['output'];
  /** Null on the initial event. */
  fromStage?: Maybe<CashPurchaseStage>;
  id: Scalars['ID']['output'];
  note: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  toStage: CashPurchaseStage;
};

/**
 * An issuer-uploaded record attached to the deal.
 *
 * `receipt` here is the issuer's OWN receipt file — their letterhead, their
 * numbering — and is never merged with `receipts`. Those are the receipts AFRAM
 * builds from the payments actually on record and stands behind; this is a file
 * that is stored and shown, never read: the server does not total or reconcile
 * what is printed on it.
 */
export type CashTransactionDocument = {
  __typename?: 'CashTransactionDocument';
  documentUrl: Scalars['String']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** spa_annex | invoice | receipt */
  kind: Scalars['String']['output'];
  /** Required on an annex, optional on a receipt, null on the invoice. */
  label?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['String']['output'];
  /** Issuer */
  uploadedBy: Scalars['String']['output'];
};

/**
 * The outcome of one money leg paid from — or, on the release, out to — a wallet.
 *
 * Three things move together and are returned together, because a client that
 * has to re-query for any of them can render a state where two of the three are
 * true. `transaction` carries the stage the leg advanced, `escrowEvent` carries
 * the figure charged (there is no `amount` argument to echo back), and
 * `walletTxn` is the row the payer will see on their wallet activity list.
 */
export type CashWalletPaymentResult = {
  __typename?: 'CashWalletPaymentResult';
  escrowEvent: EscrowEvent;
  transaction: CashPurchaseTxn;
  /**
   * The debit written against the payer's wallet. Null on the release leg, which
   * moves money OUT to the issuer and debits nobody's wallet.
   */
  walletTxn?: Maybe<WalletTxn>;
};

/** Who walked away, when, and why. The reason is kept permanently. */
export type CashWithdrawal = {
  __typename?: 'CashWithdrawal';
  /** Buyer | Issuer */
  by: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  withdrawnAt: Scalars['String']['output'];
};

export type CheckLandInput = {
  boundary: Scalars['JSONObject']['input'];
};

export type CompleteOnboardingInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  bankDetails?: InputMaybe<Array<BankDetailInput>>;
  city?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  countryOfResidence?: InputMaybe<Scalars['String']['input']>;
  defaultRole?: InputMaybe<Scalars['String']['input']>;
  digitalSignature?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  employer?: InputMaybe<Scalars['String']['input']>;
  entity?: InputMaybe<EntityProfileInput>;
  faceImageUrl?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  ghanaCard?: InputMaybe<IdentityDocumentInput>;
  gpsAddress?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  momoNumber?: InputMaybe<Scalars['String']['input']>;
  monthlyNetIncome?: InputMaybe<Scalars['Float']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  occupation?: InputMaybe<Scalars['String']['input']>;
  passport?: InputMaybe<IdentityDocumentInput>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  profileImage?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
};

export type CompleteOnboardingPayload = {
  __typename?: 'CompleteOnboardingPayload';
  accessToken?: Maybe<Scalars['String']['output']>;
  entity?: Maybe<Entity>;
  user: User;
};

export type ComplianceAdminSectionResponse = {
  __typename?: 'ComplianceAdminSectionResponse';
  section?: Maybe<ComplianceSection>;
  success: Scalars['Boolean']['output'];
};

export type ComplianceAdminSubmissionResponse = {
  __typename?: 'ComplianceAdminSubmissionResponse';
  submission?: Maybe<ComplianceSubmission>;
  success: Scalars['Boolean']['output'];
};

export type ComplianceAdminTemplateResponse = {
  __typename?: 'ComplianceAdminTemplateResponse';
  success: Scalars['Boolean']['output'];
  template?: Maybe<ComplianceDocumentTemplate>;
};

/**
 * A single entry in the compliance-specific audit trail. Distinct from the
 * platform-wide AuditLog: captures domain detail (submission status transitions,
 * reviewer/note diffs, who reviewed what). Append-only.
 */
export type ComplianceAuditEvent = {
  __typename?: 'ComplianceAuditEvent';
  action: Scalars['String']['output'];
  actorEmail?: Maybe<Scalars['String']['output']>;
  actorId?: Maybe<Scalars['String']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  changes?: Maybe<Scalars['JSONObject']['output']>;
  createdAt: Scalars['DateTime']['output'];
  entity: Scalars['String']['output'];
  entityId: Scalars['ID']['output'];
  fromStatus?: Maybe<DocStatus>;
  id: Scalars['ID']['output'];
  roleType?: Maybe<ComplianceRoleType>;
  subjectUserId?: Maybe<Scalars['ID']['output']>;
  submissionId?: Maybe<Scalars['ID']['output']>;
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
  __typename?: 'ComplianceDeleteResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ComplianceDismissResponse = {
  __typename?: 'ComplianceDismissResponse';
  dismissed: Scalars['Boolean']['output'];
  notificationId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type ComplianceDocItem = {
  __typename?: 'ComplianceDocItem';
  description: Scalars['String']['output'];
  /** URL of the most recently uploaded file; null while the document is missing */
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastUpdated?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  reviewer?: Maybe<Scalars['String']['output']>;
  status: DocStatus;
  templateId: Scalars['ID']['output'];
};

export type ComplianceDocumentFilter = {
  required?: InputMaybe<BooleanOperator>;
  sectionKey?: InputMaybe<ComplianceSectionKeyOperator>;
  status?: InputMaybe<DocStatusOperator>;
};

export type ComplianceDocumentTemplate = {
  __typename?: 'ComplianceDocumentTemplate';
  description: Scalars['String']['output'];
  documentCode?: Maybe<Scalars['String']['output']>;
  gatedActions: Array<GatedAction>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
};

export type ComplianceDocumentsResponse = {
  __typename?: 'ComplianceDocumentsResponse';
  sections: Array<ComplianceSection>;
  stats: ComplianceStats;
};

export type ComplianceFile = {
  __typename?: 'ComplianceFile';
  fileName: Scalars['String']['output'];
  fileSizeBytes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  storagePath: Scalars['String']['output'];
  uploadedAt: Scalars['String']['output'];
};

export type ComplianceNotification = {
  __typename?: 'ComplianceNotification';
  action?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  type: ComplianceNotificationType;
};

export type ComplianceNotificationFilter = {
  dismissed?: InputMaybe<BooleanOperator>;
  id?: InputMaybe<IdOperator>;
  type?: InputMaybe<ComplianceNotificationType>;
};

export type ComplianceNotificationType =
  | 'info'
  | 'success'
  | 'warning';

export type ComplianceRoleType =
  | 'agent'
  | 'buyer'
  | 'financier'
  | 'issuer';

export type ComplianceRoleTypeOperator = {
  eq?: InputMaybe<ComplianceRoleType>;
  in?: InputMaybe<Array<ComplianceRoleType>>;
};

export type ComplianceSection = {
  __typename?: 'ComplianceSection';
  bg: Scalars['String']['output'];
  color: Scalars['String']['output'];
  docs: Array<ComplianceDocItem>;
  /**
   * Which entity type this section's requirements apply to. Null means "every
   * entity type" — the value for roles that are not entity-scoped.
   */
  entityType?: Maybe<EntityType>;
  id: Scalars['ID']['output'];
  key: ComplianceSectionKey;
  roleType: ComplianceRoleType;
  templates: Array<ComplianceDocumentTemplate>;
  title: Scalars['String']['output'];
};

export type ComplianceSectionKey =
  | 'agreements'
  | 'company_reg'
  | 'esg'
  | 'financials'
  | 'identity'
  | 'legal_risk'
  | 'ownership'
  | 'property_insurance';

export type ComplianceSectionKeyOperator = {
  eq?: InputMaybe<ComplianceSectionKey>;
  in?: InputMaybe<Array<ComplianceSectionKey>>;
};

export type ComplianceStats = {
  __typename?: 'ComplianceStats';
  missing: Scalars['Int']['output'];
  overallPct: Scalars['Int']['output'];
  requiredMissing: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  under_review: Scalars['Int']['output'];
  verified: Scalars['Int']['output'];
};

export type ComplianceSubmission = {
  __typename?: 'ComplianceSubmission';
  createdAt: Scalars['String']['output'];
  files: Array<ComplianceFile>;
  history: Array<ComplianceAuditEvent>;
  id: Scalars['ID']['output'];
  lastUpdated?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<Scalars['String']['output']>;
  roleType: ComplianceRoleType;
  status: DocStatus;
  template?: Maybe<ComplianceDocumentTemplate>;
  templateId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<ComplianceSubmissionUser>;
  userId: Scalars['ID']['output'];
};

export type ComplianceSubmissionFilter = {
  id?: InputMaybe<IdOperator>;
  roleType?: InputMaybe<ComplianceRoleTypeOperator>;
  status?: InputMaybe<DocStatusOperator>;
  templateId?: InputMaybe<IdOperator>;
  userId?: InputMaybe<IdOperator>;
};

export type ComplianceSubmissionUser = {
  __typename?: 'ComplianceSubmissionUser';
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
};

export type ComplianceUploadResponse = {
  __typename?: 'ComplianceUploadResponse';
  document?: Maybe<ComplianceUploadedDoc>;
  success: Scalars['Boolean']['output'];
};

export type ComplianceUploadedDoc = {
  __typename?: 'ComplianceUploadedDoc';
  fileName: Scalars['String']['output'];
  fileSizeBytes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lastUpdated: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: DocStatus;
};

/**
 * Which side of closing a condition sits on.
 *
 * One item shape and one set of operations, discriminated — rather than a second
 * near-identical model with its own resolve/waive pair that would drift out of
 * step with this one.
 *
 * The distinction is load-bearing in exactly one place: DISBURSEMENT BLOCKS ON
 * PRECEDENT ITEMS ONLY. A condition subsequent is by definition one that survives
 * closing, so it must never hold up a drawdown, and `confirmConditionsPrecedent`
 * reads the precedent list alone.
 */
export type ConditionPhase =
  /** Must be satisfied before the facility can be drawn. Gates disbursement. */
  | 'PRECEDENT'
  /** Survives closing — tracked through servicing, and never gates disbursement. */
  | 'SUBSEQUENT';

/**
 * A single condition-precedent line item (Act 9). Items are ad hoc — extracted from
 * the loan agreement — and recorded on the request's metadata. Disbursement is
 * blocked until every item is CONFIRMED or WAIVED.
 */
export type ConditionPrecedent = {
  __typename?: 'ConditionPrecedent';
  /** Stable list ordering. */
  createdAt: Scalars['DateTime']['output'];
  /** Optional sub-text under the title. */
  description?: Maybe<Scalars['String']['output']>;
  /** True if AI-extracted from the uploaded agreement / CP schedule. */
  extracted: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** The condition text (frontend title). */
  label: Scalars['String']['output'];
  /** Which loan (offer request) this CP belongs to. */
  offerRequestId: Scalars['ID']['output'];
  /** Which side of closing this condition sits on. Rows predating the split are PRECEDENT. */
  phase: ConditionPhase;
  /** Waiver reason (present when WAIVED). */
  reason?: Maybe<Scalars['String']['output']>;
  /** When confirmed/waived — audit line. */
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Borrower | Financier — gates who uploads evidence. */
  responsibleParty: ResponsibleParty;
  /** Who confirmed/waived (name or id) — audit line. */
  signedOffBy?: Maybe<Scalars['String']['output']>;
  status: ConditionPrecedentStatus;
  /** Display name for the supporting document. */
  supportingDocumentName?: Maybe<Scalars['String']['output']>;
  /** Evidence/attachment (borrower SUBMITTED, or financier CONFIRMED). */
  supportingDocumentUrl?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ConditionPrecedentStatus =
  /** Financier signed it off as satisfied. */
  | 'CONFIRMED'
  /** Created, no action yet. */
  | 'PENDING'
  /** Responsible party uploaded evidence, awaiting financier sign-off. */
  | 'SUBMITTED'
  /** Financier elected to proceed without it (reason required). */
  | 'WAIVED';

export type ConditionPrecedentStatusInput = {
  /** Optional sub-text under the title. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** True if AI-extracted from the uploaded agreement / CP schedule. */
  extracted?: InputMaybe<Scalars['Boolean']['input']>;
  /** Existing item id, if updating one already recorded. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Label to upsert by when no id is given (e.g. the CP text from the agreement). */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Required when status is WAIVED. */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** Which party is responsible for satisfying this item. Required when creating a new item. */
  responsibleParty?: InputMaybe<ResponsibleParty>;
  status: ConditionPrecedentStatus;
  /** Display name for the supporting document. */
  supportingDocumentName?: InputMaybe<Scalars['String']['input']>;
  /** Supporting/evidence document for this item. */
  supportingDocumentUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ConfirmSupportResolutionInput = {
  reference: Scalars['String']['input'];
  resolved: Scalars['Boolean']['input'];
  /** 1 (not good) to 3 (good). Optional. */
  satisfaction?: InputMaybe<Scalars['Int']['input']>;
};

export type Construction = {
  __typename?: 'Construction';
  civilContractor?: Maybe<Scalars['String']['output']>;
  insurance?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  leadArchitect?: Maybe<Scalars['String']['output']>;
  otherConsultants?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  procurementType?: Maybe<Scalars['String']['output']>;
  timelines?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  warranties?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ConstructionInput = {
  civilContractor?: InputMaybe<Scalars['String']['input']>;
  insurance?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leadArchitect?: InputMaybe<Scalars['String']['input']>;
  otherConsultants?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  procurementType?: InputMaybe<Scalars['String']['input']>;
  timelines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  warranties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ContactUsInput = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type ContactUsResponse = {
  __typename?: 'ContactUsResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  conversationKey?: Maybe<Scalars['String']['output']>;
  convoType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  initialDeposit?: Maybe<Scalars['Float']['output']>;
  kind?: Maybe<ConversationKind>;
  lastMessageId?: Maybe<Scalars['ID']['output']>;
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  parentConversation?: Maybe<Conversation>;
  parentConversationId?: Maybe<Scalars['ID']['output']>;
  participants?: Maybe<Scalars['JSONObject']['output']>;
  paymentStatus?: Maybe<ConversationPaymentStatus>;
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  /** @deprecated Stale snapshot taken when the conversation was created. Use `property` (live) or `propertyId`. */
  propertyInfo?: Maybe<Scalars['JSONObject']['output']>;
  propertyValue?: Maybe<Scalars['Float']['output']>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  totalMessageCount?: Maybe<Scalars['Int']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
  transferDocument?: Maybe<Scalars['String']['output']>;
  unreadCount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type ConversationKind =
  | 'DIRECT_CHAT'
  | 'GROUP_CHAT';

export type ConversationKindOperator = {
  eq?: InputMaybe<ConversationKind>;
  in?: InputMaybe<Array<ConversationKind>>;
};

export type ConversationPaymentStatus =
  | 'failed'
  | 'paid'
  | 'pending'
  | 'verifying';

export type ConversationPaymentStatusOperator = {
  eq?: InputMaybe<ConversationPaymentStatus>;
  in?: InputMaybe<Array<ConversationPaymentStatus>>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  X?: Maybe<Scalars['Float']['output']>;
  Y?: Maybe<Scalars['Float']['output']>;
  bearing?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['Int']['output']>;
  from?: Maybe<Scalars['Int']['output']>;
  fromPt?: Maybe<Scalars['Int']['output']>;
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
  to?: Maybe<Scalars['Int']['output']>;
  toPt?: Maybe<Scalars['Int']['output']>;
};

export type CountryCode =
  | 'FR'
  | 'GB'
  | 'GH'
  | 'NG'
  | 'US'
  | 'ZA';

export type CreateAdminConversationInput = {
  initialDeposit?: InputMaybe<Scalars['Float']['input']>;
  participants: Scalars['JSONObject']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAssessmentAlertRuleInput = {
  code: Scalars['String']['input'];
  message: Scalars['String']['input'];
  operator: AssessmentAlertOperator;
  severity?: InputMaybe<AssessmentAlertSeverity>;
  templateId: Scalars['ID']['input'];
  threshold: Scalars['JSONObject']['input'];
  triggerQuestionCode: Scalars['String']['input'];
};

export type CreateAssessmentCategoryInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  templateId: Scalars['ID']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateAssessmentDocumentInput = {
  assessmentId: Scalars['ID']['input'];
  documentCode: Scalars['String']['input'];
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  requirement?: InputMaybe<AssessmentDocumentRequirement>;
};

export type CreateAssessmentInput = {
  applicantUserId?: InputMaybe<Scalars['ID']['input']>;
  consentGivenAt?: InputMaybe<Scalars['DateTime']['input']>;
  declarationGivenAt?: InputMaybe<Scalars['DateTime']['input']>;
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  subjectEntityId?: InputMaybe<Scalars['ID']['input']>;
  templateId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateAssessmentQuestionInput = {
  answerType: AssessmentAnswerType;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  code: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  guidance?: InputMaybe<Scalars['String']['input']>;
  isKycAutofill?: InputMaybe<Scalars['Boolean']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isScored?: InputMaybe<Scalars['Boolean']['input']>;
  kycSourceField?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
  scoringLogicText?: InputMaybe<Scalars['String']['input']>;
  templateId: Scalars['ID']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
  verification?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateAssessmentQuestionOptionInput = {
  code: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  questionId: Scalars['ID']['input'];
  score?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateAssessmentReadinessBandInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  guidance?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  maxScore: Scalars['Int']['input'];
  minScore: Scalars['Int']['input'];
  templateId: Scalars['ID']['input'];
};

export type CreateAssessmentScoringBandInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  questionId: Scalars['ID']['input'];
  score: Scalars['Int']['input'];
};

export type CreateAssessmentTemplateInput = {
  code: Scalars['String']['input'];
  consentText?: InputMaybe<Scalars['String']['input']>;
  declarationText?: InputMaybe<Scalars['String']['input']>;
  legalNotice?: InputMaybe<Scalars['String']['input']>;
  maxScorePerParameter?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  status?: InputMaybe<AssessmentTemplateStatus>;
  subjectType?: InputMaybe<AssessmentSubjectType>;
  version: Scalars['String']['input'];
};

export type CreateAssetValueSnapshotInput = {
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  ownerId: Scalars['ID']['input'];
  properties?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  timestamp: Scalars['DateTime']['input'];
  totalValue: Scalars['Float']['input'];
  valueByPropertyType?: InputMaybe<Scalars['JSONObject']['input']>;
  valueByRegion?: InputMaybe<Scalars['JSONObject']['input']>;
  valueByStatus?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CreateBareLandProjectInput = {
  additionalFiles?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  construction?: InputMaybe<Scalars['JSONObject']['input']>;
  gpsAddress?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  projectCost?: InputMaybe<Scalars['JSONObject']['input']>;
  projectDescription?: InputMaybe<Scalars['String']['input']>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectName: Scalars['String']['input'];
  projectStatus?: InputMaybe<Scalars['String']['input']>;
  propertyTypes?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  readiness?: InputMaybe<Scalars['Int']['input']>;
  sharedAmenities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  squareFeet?: InputMaybe<Scalars['Float']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBuyerProjectInput = {
  buyerId: Scalars['ID']['input'];
  depositAmount?: InputMaybe<Scalars['Float']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  propertyId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  tokensOwned?: InputMaybe<Scalars['String']['input']>;
};

export type CreateComplianceSectionInput = {
  bg: Scalars['String']['input'];
  color: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Required for entity-scoped roles (issuer), refused for every other role.
   * Fixed once set: to move a section, delete it and create it on the other side.
   */
  entityType?: InputMaybe<EntityType>;
  key: ComplianceSectionKey;
  roleType: ComplianceRoleType;
  title: Scalars['String']['input'];
};

export type CreateComplianceTemplateInput = {
  description: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  documentCode?: InputMaybe<Scalars['String']['input']>;
  gatedActions?: InputMaybe<Array<GatedAction>>;
  name: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  sectionId: Scalars['ID']['input'];
};

export type CreateConversationInput = {
  convoType?: InputMaybe<Scalars['String']['input']>;
  initialDeposit?: InputMaybe<Scalars['Float']['input']>;
  kind?: InputMaybe<ConversationKind>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  parentConversationId?: InputMaybe<Scalars['ID']['input']>;
  participants: Scalars['JSONObject']['input'];
  paymentStatus?: InputMaybe<ConversationPaymentStatus>;
  propertyInfo?: InputMaybe<Scalars['JSONObject']['input']>;
  propertyValue?: InputMaybe<Scalars['Float']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  shouldCreateInitialMessage?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateDueDiligenceInput = {
  dueDiligenceInitiatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  dueDiligenceReportDate?: InputMaybe<Scalars['DateTime']['input']>;
  dueDiligenceReportImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  dueDiligenceReportMessage?: InputMaybe<Scalars['String']['input']>;
  dueDiligenceStatus?: InputMaybe<DueDiligenceStatus>;
  legalDocuments?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  propertyId: Scalars['ID']['input'];
  updatedBy?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CreateEntityRoleInput = {
  badgeColor?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissions: Array<Scalars['String']['input']>;
};

export type CreateLandInput = {
  boundary: Scalars['JSONObject']['input'];
};

export type CreateOfferInput = {
  acceptedAt?: InputMaybe<Scalars['DateTime']['input']>;
  availabilityPeriodDays?: InputMaybe<Scalars['Int']['input']>;
  bondSubType?: InputMaybe<BondSubType>;
  commitmentFeeRate?: InputMaybe<Scalars['Float']['input']>;
  conditions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  covenants?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  currency?: InputMaybe<Scalars['String']['input']>;
  depositPercentage?: InputMaybe<Scalars['Float']['input']>;
  drawdownSchedule?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  dsraMonths?: InputMaybe<Scalars['Int']['input']>;
  financierId: Scalars['ID']['input'];
  interestRate?: InputMaybe<Scalars['JSONObject']['input']>;
  issuedAt?: InputMaybe<Scalars['DateTime']['input']>;
  lenderName?: InputMaybe<Scalars['String']['input']>;
  loanSubType?: InputMaybe<LoanSubType>;
  loanTenor?: InputMaybe<Scalars['JSONObject']['input']>;
  loanType?: InputMaybe<LoanType>;
  ltv?: InputMaybe<Scalars['Float']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  moratorium?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  offerExpiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  offerStatus?: InputMaybe<OfferStatus>;
  otherFees?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  processingTimeline?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  propertyName?: InputMaybe<Scalars['String']['input']>;
  rateType?: InputMaybe<RateType>;
  recipientId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<RepaymentFrequency>;
  repaymentType?: InputMaybe<RepaymentType>;
  revokedAt?: InputMaybe<Scalars['DateTime']['input']>;
  schedule?: InputMaybe<Scalars['JSONObject']['input']>;
  security?: InputMaybe<Scalars['JSONObject']['input']>;
  sources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CreateOfferRequestInput = {
  agreedAmount?: InputMaybe<Scalars['Float']['input']>;
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  convoType?: InputMaybe<Scalars['String']['input']>;
  financierId?: InputMaybe<Scalars['ID']['input']>;
  initialDeposit?: InputMaybe<Scalars['Float']['input']>;
  issuerId?: InputMaybe<Scalars['ID']['input']>;
  modeOfFinancing: ModeOfFinancing;
  offer?: InputMaybe<Scalars['JSONObject']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  refNo?: InputMaybe<Scalars['String']['input']>;
  requestedAmount: Scalars['Float']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePaymentScheduleInput = {
  conversationId: Scalars['ID']['input'];
  createdForId?: InputMaybe<Scalars['ID']['input']>;
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  loanId?: InputMaybe<Scalars['ID']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<Scalars['String']['input']>;
  repaymentTerms?: InputMaybe<Scalars['JSONObject']['input']>;
  totalInterest?: InputMaybe<Scalars['String']['input']>;
  totalRepayment?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePortfolioInput = {
  additionalFiles?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  construction?: InputMaybe<ConstructionInput>;
  constructionCommencementDate?: InputMaybe<Scalars['String']['input']>;
  epaPermitNumber?: InputMaybe<Scalars['String']['input']>;
  gpsAddress: Scalars['String']['input'];
  grossDevelopmentValue?: InputMaybe<Scalars['Float']['input']>;
  landValuationAmount?: InputMaybe<Scalars['Float']['input']>;
  landValuer?: InputMaybe<Scalars['String']['input']>;
  listingObjective?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  planningPermitNumber?: InputMaybe<Scalars['String']['input']>;
  portfolioType: Scalars['String']['input'];
  practicalCompletionDate?: InputMaybe<Scalars['String']['input']>;
  projectCost?: InputMaybe<ProjectCostInput>;
  projectDescription: Scalars['String']['input'];
  projectImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectName?: InputMaybe<Scalars['String']['input']>;
  projectStatus?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propertyTypes?: InputMaybe<Array<InputMaybe<PropertyTypesInput>>>;
  readiness?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  sharedAmenities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  squareFeet: Scalars['Int']['input'];
  streetAddress: Scalars['String']['input'];
  titleNumber?: InputMaybe<Scalars['String']['input']>;
  totalDevelopmentCost?: InputMaybe<Scalars['Float']['input']>;
  yearBuilt?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePortfolioProjectWithUnitsInput = {
  listingType?: InputMaybe<Scalars['String']['input']>;
  portfolio: Scalars['JSONObject']['input'];
  units: Array<PortfolioProjectUnitInput>;
};

export type CreateRepaymentInput = {
  conversationId?: InputMaybe<Scalars['ID']['input']>;
  createdById?: InputMaybe<Scalars['ID']['input']>;
  createdForId?: InputMaybe<Scalars['ID']['input']>;
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  isSubscribedToReferenceRate?: InputMaybe<Scalars['Boolean']['input']>;
  loanId?: InputMaybe<Scalars['ID']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<Scalars['String']['input']>;
  repaymentTerms?: InputMaybe<Scalars['JSONObject']['input']>;
  scheduleType?: InputMaybe<Scalars['String']['input']>;
  totalInterest?: InputMaybe<Scalars['String']['input']>;
  totalRepayment?: InputMaybe<Scalars['String']['input']>;
};

export type CreateReviewInput = {
  comment: Scalars['String']['input'];
  conversationId?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
  replies?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  user: Scalars['ID']['input'];
  userAvatar?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSimpleConversationInput = {
  participants: Scalars['JSONObject']['input'];
};

export type CreateSupportRequestInput = {
  area: SupportArea;
  attachments?: InputMaybe<Array<SupportAttachmentInput>>;
  /** 10 to 4,000 characters. */
  body: Scalars['String']['input'];
  context: SupportContextInput;
  /** Any unique string per send attempt (a UUID). Reused on a retry, so repeats return the first result. */
  idempotencyKey: Scalars['String']['input'];
  kind: SupportKind;
  subject?: InputMaybe<SupportSubjectInput>;
  /** 5 to 120 characters. */
  title: Scalars['String']['input'];
};

export type CreateSupportRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissions: Array<Scalars['String']['input']>;
};

export type CreateSupportUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  supportRoleId: Scalars['ID']['input'];
};

export type CreateTailoringRuleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  documentCodes: Array<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  platformRole?: InputMaybe<Scalars['String']['input']>;
  requirement?: InputMaybe<RequirementLevel>;
};

export type CreateTempProjectInput = {
  payload: Scalars['JSONObject']['input'];
  sessionId: Scalars['ID']['input'];
};

export type CreateTermSheetInput = {
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  conversationId?: InputMaybe<Scalars['ID']['input']>;
  financierId?: InputMaybe<Scalars['ID']['input']>;
  initialDeposit?: InputMaybe<Scalars['Float']['input']>;
  issuerId?: InputMaybe<Scalars['ID']['input']>;
  loanTenor?: InputMaybe<Scalars['JSONObject']['input']>;
  modeOfFinancing?: InputMaybe<Scalars['String']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  parentTermSheetId?: InputMaybe<Scalars['ID']['input']>;
  projectId: Scalars['ID']['input'];
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  transactionRefNo?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TermSheetType>;
};

export type CreateTransactionInput = {
  amount?: InputMaybe<Scalars['JSONObject']['input']>;
  description: Scalars['String']['input'];
  from?: InputMaybe<Scalars['JSONObject']['input']>;
  propertyId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
  referenceNo: Scalars['String']['input'];
  state: Scalars['String']['input'];
  status: Scalars['String']['input'];
  to?: InputMaybe<Scalars['JSONObject']['input']>;
  tokens: Scalars['Int']['input'];
  transactionId: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CurrencyCode =
  | 'EUR'
  | 'GBP'
  | 'GHS'
  | 'NGN'
  | 'USD'
  | 'ZAR';

export type CurrencyType =
  | 'base'
  | 'fiat'
  | 'points';

export type CurrencyTypeOperator = {
  eq?: InputMaybe<CurrencyType>;
};

export type DashboardKpi = {
  __typename?: 'DashboardKpi';
  currency?: Maybe<Scalars['String']['output']>;
  deltaAbsolute?: Maybe<Scalars['Float']['output']>;
  deltaPercent?: Maybe<Scalars['Float']['output']>;
  hint?: Maybe<Scalars['String']['output']>;
  previousValue: Scalars['Float']['output'];
  trend: Trend;
  value: Scalars['Float']['output'];
};

export type DashboardRange =
  | 'NINETY_DAYS'
  | 'SEVEN_DAYS'
  | 'THIRTY_DAYS'
  | 'YTD';

export type DashboardSummary = {
  __typename?: 'DashboardSummary';
  activeProperties: DashboardKpi;
  openTickets: DashboardKpi;
  totalVolume: DashboardKpi;
  verifiedUsers: DashboardKpi;
};

export type DateOperator = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  between?: InputMaybe<DateRange>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateRange = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};

/** Nature of a servicing amendment reported alongside a declaration. */
export type DeclarationAmendmentType =
  | 'FacilityIncrease'
  | 'None'
  | 'Other'
  | 'PartialSecurityRelease'
  | 'PaymentHoliday'
  | 'RateChange'
  | 'Restructure'
  | 'TenorExtension';

/**
 * Where a schedule-generated declaration's approval stands. The financier may
 * approve it until `approvalDueAt`; after that silence is consent and it becomes
 * `deemed_approved`. Both approved states release it for collection from the
 * borrower. A financier who disagrees amends the schedule, which retires the
 * declaration — there is no rejection. Hand-filed declarations are `not_required`.
 */
export type DeclarationApprovalStatus =
  | 'approved'
  | 'deemed_approved'
  | 'not_required'
  | 'pending';

/** Declared lifecycle state of the loan for the period (mirrors the loan master's status). */
export type DeclarationLoanStatus =
  | 'Active'
  | 'Defaulted'
  | 'Draft'
  | 'FullyRepaid'
  | 'InArrears'
  | 'PaymentHoliday'
  | 'Restructured'
  | 'WrittenOff';

/** Period payment posture reported by the financier (distinct from the loan's declared lifecycle state). */
export type DeclarationPaymentStatus =
  | 'Late'
  | 'NotReceived'
  | 'OnTime'
  | 'Partial';

/**
 * Whether the borrower has paid a filing. Afram's own observation, derived from
 * the payments recorded against it — never the lender's word, and never written
 * back onto the lender's declared figures.
 */
export type DeclarationSettlementStatus =
  | 'PartiallyPaid'
  | 'Settled'
  | 'Unpaid';

/**
 * Who produced a declaration (AFR-310). `financier` — filed by hand by the lender.
 * `schedule` — generated by the platform from an installment of the loan's
 * repayment schedule.
 */
export type DeclarationSource =
  | 'financier'
  | 'schedule';

export type DefaultFee = {
  __typename?: 'DefaultFee';
  amount: Scalars['Float']['output'];
  feeType: PrepaymentFeeType;
  percentage: Scalars['Float']['output'];
};

export type DefaultFeeInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  feeType?: InputMaybe<PrepaymentFeeType>;
  percentage?: InputMaybe<Scalars['Float']['input']>;
};

export type DeleteAllNotificationsResponse = {
  __typename?: 'DeleteAllNotificationsResponse';
  deleted: Scalars['Int']['output'];
};

/**
 * One document supplied against a due-diligence request.
 *
 * Responses accumulate: a partial submission adds to what is already there rather
 * than replacing it, and answering a query leaves the earlier files in place.
 */
export type DiligenceDocument = {
  __typename?: 'DiligenceDocument';
  fileName: Scalars['String']['output'];
  /** Bytes, as reported by the client. Display only. */
  fileSize?: Maybe<Scalars['Int']['output']>;
  /** MIME type, as reported by the client. Display only. */
  fileType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /**
   * Where the file came from: `upload` when someone supplied it against this
   * request, or `listing` / `portfolio` / `approach` / `compliance` when the
   * platform attached
   * one it already held so the issuer was not asked twice. `readiness` or
   * `diligence` when the buyer submitted a file of theirs Afram already held —
   * verified in their readiness assessment, or accepted on an earlier deal.
   *
   * Show it. A requester deciding whether to accept is entitled to know whether
   * they are looking at a document produced for them or one carried over.
   */
  source: Scalars['String']['output'];
  /** One line saying where a carried-over file came from. Null on an upload. */
  sourceNote?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['String']['output'];
  /** Buyer | Issuer */
  uploadedBy: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type DiligenceDocumentInput = {
  documentUrl: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
};

export type DiligenceDocumentUpload = {
  documentUrl: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  fileType?: InputMaybe<Scalars['String']['input']>;
};

/**
 * One due-diligence category on the deal.
 *
 * ⚠ `direction` names the REQUEST, not the documents. `issuer_to_buyer` is the
 * issuer asking the buyer: the issuer requests and receives, the buyer responds
 * and supplies. Every rule below turns on that — the requester accepts, queries
 * and waives; the responder submits.
 *
 * `label` and `hint` are derived from the server's catalogue rather than stored,
 * so a copy edit reaches every existing deal.
 */
export type DiligenceItem = {
  __typename?: 'DiligenceItem';
  categoryId: Scalars['String']['output'];
  /** issuer_to_buyer | buyer_to_issuer */
  direction: Scalars['String']['output'];
  documents: Array<DiligenceDocument>;
  hint: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  /**
   * The buyer's own documents already on file that answer this ask — verified in
   * their readiness assessment, or accepted by a seller on an earlier deal. Offer
   * them on the buyer's rail; submitting one goes through the ordinary submit
   * mutation and is recorded with that provenance.
   *
   * Buyer only: always empty for the seller. Also empty on a request the buyer
   * makes, on a category not yet opened, once the item is accepted or waived, and
   * for any file already submitted here.
   */
  onFile: Array<HeldDocument>;
  /** What the requester said needs addressing. Set while status is `queried`. */
  query?: Maybe<Scalars['String']['output']>;
  /** requested | submitted | queried | accepted | waived */
  status: Scalars['String']['output'];
  transactionId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  /** Why the requester let this go. Set when status is `waived`. */
  waiverReason?: Maybe<Scalars['String']['output']>;
};

export type DisburseFacilityInput = {
  amount: Scalars['Float']['input'];
  /** e.g. lump-sum, tranche, GhIPSS — free text. */
  method?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A self-reported disbursement (Act 10). Starts PENDING verification; an
 * admin/reviewer later flips it to VERIFIED or UNVERIFIABLE.
 */
export type DisbursementRecord = {
  __typename?: 'DisbursementRecord';
  amount: Scalars['Float']['output'];
  disbursedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  method?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  verificationStatus: DisbursementVerificationStatus;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

/**
 * Verification state for a self-reported disbursement. Disbursements are declared
 * by the financier and independently verified afterward — Afram does not move or
 * confirm funds itself. UNVERIFIABLE is a visible risk flag, not a silent state.
 */
export type DisbursementVerificationStatus =
  | 'PENDING'
  | 'UNVERIFIABLE'
  | 'VERIFIED';

export type DocStatus =
  | 'missing'
  | 'submitted'
  | 'under_review'
  | 'verified';

export type DocStatusOperator = {
  eq?: InputMaybe<DocStatus>;
  in?: InputMaybe<Array<DocStatus>>;
};

export type DocumentRequestItem = {
  acceptedFileTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /**
   * Stable code for this request. Unique per offer request.
   *
   * Use a due-diligence catalogue id — `title_documents`, `planning_permission`,
   * `encumbrances`, `company_registration`, `tax_status`, `site_plan`,
   * `valuation_report`, `insurance_certificate` — and the platform answers the
   * request from what the ISSUER already gave us, rather than sending the borrower
   * to chase the seller for a file we are holding (AFR-155). The row comes back
   * `SUBMITTED` with `source` set to say where it came from.
   *
   * Any other code is an ordinary request the borrower fills in. Nothing about the
   * borrower's own identity, income or funds is ever pre-filled, whatever it is
   * coded as.
   */
  documentCode?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * The two-party signature state of a document (offer letter or loan agreement).
 * `bothSigned` is true only once each side has a signature on record.
 */
export type DocumentSignatures = {
  __typename?: 'DocumentSignatures';
  borrower?: Maybe<SignatureRecord>;
  bothSigned: Scalars['Boolean']['output'];
  financier?: Maybe<SignatureRecord>;
};

export type DueDiligence = {
  __typename?: 'DueDiligence';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dueDiligenceInitiatedAt?: Maybe<Scalars['DateTime']['output']>;
  dueDiligenceReportDate?: Maybe<Scalars['DateTime']['output']>;
  dueDiligenceReportImages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  dueDiligenceReportMessage?: Maybe<Scalars['String']['output']>;
  dueDiligenceStatus?: Maybe<DueDiligenceStatus>;
  id: Scalars['ID']['output'];
  legalDocuments?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  ownerId?: Maybe<Scalars['ID']['output']>;
  propertyId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['JSONObject']['output']>;
};

export type DueDiligenceFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
};

export type DueDiligenceStatus =
  | 'completed'
  | 'issue'
  | 'pending';

export type EmailRecipientInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  payload?: InputMaybe<Scalars['JSON']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  pushToken?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Entity = {
  __typename?: 'Entity';
  address?: Maybe<Scalars['String']['output']>;
  companyRegNumber?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  entityType: EntityType;
  id: Scalars['ID']['output'];
  licenceNumber?: Maybe<Scalars['String']['output']>;
  loanTerm?: Maybe<Scalars['JSON']['output']>;
  members?: Maybe<Array<Maybe<EntityMember>>>;
  owner?: Maybe<User>;
  ownerId?: Maybe<Scalars['ID']['output']>;
  platformRoles?: Maybe<Array<Scalars['String']['output']>>;
  /**
   * Entity-owned policies (issuer/financier settings) for this entity.
   * Only returned to members of the entity or platform admins; empty otherwise.
   */
  policies?: Maybe<Array<UserPolicy>>;
  position?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  projectsFinanced?: Maybe<Scalars['Int']['output']>;
  proofOfAffiliation?: Maybe<Scalars['String']['output']>;
  /**
   * Where a borrower reaches this lender's loan-servicing desk.
   *
   * Null means the lender has not supplied one. Show the channel as absent rather
   * than substituting anything: a fabricated servicing address is worse than none,
   * because a borrower who writes to it believes they have reached their lender
   * about their loan.
   *
   * Business contact details for the lending entity, not personal contact data for
   * whoever owns the record.
   */
  servicingEmail?: Maybe<Scalars['String']['output']>;
  /** The servicing desk's phone number. Null on the same terms as `servicingEmail`. */
  servicingPhone?: Maybe<Scalars['String']['output']>;
  taxIdNumber?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  verificationStatus: EntityVerificationStatus;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

/**
 * A single tailored document requirement, decorated with its current satisfaction
 * status (resolved from the entity owner's compliance submission).
 */
export type EntityDocumentRequirement = {
  __typename?: 'EntityDocumentRequirement';
  documentCode: Scalars['String']['output'];
  gatedActions: Array<GatedAction>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  requirement: RequirementLevel;
  satisfied: Scalars['Boolean']['output'];
  status: DocStatus;
  templateId?: Maybe<Scalars['ID']['output']>;
};

export type EntityGate = {
  __typename?: 'EntityGate';
  action: GatedAction;
  allowed: Scalars['Boolean']['output'];
  blockingDocuments: Array<EntityDocumentRequirement>;
};

export type EntityMember = {
  __typename?: 'EntityMember';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  entity?: Maybe<Entity>;
  entityId: Scalars['ID']['output'];
  entityRoleId?: Maybe<Scalars['ID']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invitedAt?: Maybe<Scalars['DateTime']['output']>;
  invitedBy?: Maybe<User>;
  invitedById?: Maybe<Scalars['ID']['output']>;
  joinedAt?: Maybe<Scalars['DateTime']['output']>;
  memberRole: EntityMemberRole;
  phone?: Maybe<Scalars['String']['output']>;
  role?: Maybe<EntityRole>;
  status: EntityMemberStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type EntityMemberFilter = {
  createdAt?: InputMaybe<DateOperator>;
  email?: InputMaybe<StringOperator>;
  entityId?: InputMaybe<IdOperator>;
  entityRoleId?: InputMaybe<IdOperator>;
  fullName?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  invitedAt?: InputMaybe<DateOperator>;
  invitedById?: InputMaybe<IdOperator>;
  joinedAt?: InputMaybe<DateOperator>;
  memberRole?: InputMaybe<EntityMemberRoleOperator>;
  status?: InputMaybe<EntityMemberStatusOperator>;
  userId?: InputMaybe<IdOperator>;
};

export type EntityMemberRole =
  | 'admin'
  | 'member'
  | 'viewer';

export type EntityMemberRoleOperator = {
  eq?: InputMaybe<EntityMemberRole>;
  in?: InputMaybe<Array<EntityMemberRole>>;
};

export type EntityMemberStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'REMOVED'
  | 'SUSPENDED';

export type EntityMemberStatusOperator = {
  eq?: InputMaybe<EntityMemberStatus>;
  in?: InputMaybe<Array<EntityMemberStatus>>;
  notIn?: InputMaybe<Array<EntityMemberStatus>>;
};

export type EntityProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyRegNumber?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<EntityType>;
  licenceNumber?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
  profileImage?: InputMaybe<Scalars['String']['input']>;
  proofOfAffiliation?: InputMaybe<Scalars['String']['input']>;
  /**
   * The lender's real servicing contact channels. Omit to leave unchanged; send an
   * empty string to clear one back to null.
   */
  servicingEmail?: InputMaybe<Scalars['String']['input']>;
  servicingPhone?: InputMaybe<Scalars['String']['input']>;
  taxIdNumber?: InputMaybe<Scalars['String']['input']>;
};

export type EntityRequirementsResponse = {
  __typename?: 'EntityRequirementsResponse';
  entityId: Scalars['ID']['output'];
  gates: Array<EntityGate>;
  requirements: Array<EntityDocumentRequirement>;
};

export type EntityRole = {
  __typename?: 'EntityRole';
  badgeColor?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  members?: Maybe<Array<Maybe<EntityMember>>>;
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityRoleFilter = {
  createdAt?: InputMaybe<DateOperator>;
  entityId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  isSystem?: InputMaybe<BooleanOperator>;
  name?: InputMaybe<StringOperator>;
};

export type EntityType =
  | 'individual'
  | 'organization';

export type EntityVerificationStatus =
  | 'pending'
  | 'rejected'
  | 'verified';

/**
 * A leg of money through escrow.
 *
 * The deposit leg carries `commitment_deposit` and the stage-9 leg carries
 * `purchase_price`. Receipts read this field for their line label, so a deposit
 * leg carrying the balance's purpose would print the buyer's deposit as "Purchase
 * price" on their proof of payment.
 *
 * Netting is unaffected by the split: it sums CONFIRMED IN-LEGS, not one purpose.
 * Returned and reversed legs never count.
 */
export type EscrowEvent = {
  __typename?: 'EscrowEvent';
  amount: Scalars['Float']['output'];
  confirmedAt?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
  /** in (buyer → escrow) | out (escrow → issuer) */
  direction: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instructedAt: Scalars['String']['output'];
  /** Commitment deposit | Purchase price balance | Release to issuer */
  label: Scalars['String']['output'];
  providerReference?: Maybe<Scalars['String']['output']>;
  /** commitment_deposit | purchase_price | release_to_issuer */
  purpose: Scalars['String']['output'];
  /**
   * Why this leg ended where it did. Always set on failed / returned / reversed —
   * a refunded deposit that cannot say why is one the payer has to ring someone
   * about. Null on the ordinary path.
   */
  reason?: Maybe<Scalars['String']['output']>;
  /** pending | received | settled | failed | returned | reversed */
  status: Scalars['String']['output'];
  transactionId: Scalars['ID']['output'];
};

export type FavoriteOffer = {
  __typename?: 'FavoriteOffer';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  entityId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  property?: Maybe<Scalars['JSONObject']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['ID']['output'];
};

export type FavoriteOfferFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

/** An AFRAM / lender fee record for a loan. */
export type FeeRecord = {
  __typename?: 'FeeRecord';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  feeType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  loanId?: Maybe<Scalars['ID']['output']>;
  offerRequestId: Scalars['ID']['output'];
  recordedAt?: Maybe<Scalars['DateTime']['output']>;
  /** "AFRAM" | "Lender". */
  revenueOwner: Scalars['String']['output'];
  /** "deductedFromProceeds" | "invoiced". */
  settlement: Scalars['String']['output'];
  whoPays: Scalars['String']['output'];
};

export type FileDeclarationInput = {
  /** Required when amendmentType is not None. */
  amendmentDetails?: InputMaybe<Scalars['String']['input']>;
  amendmentDoc?: InputMaybe<Scalars['String']['input']>;
  amendmentType?: InputMaybe<DeclarationAmendmentType>;
  amountCollectedThisMonth?: InputMaybe<Scalars['Float']['input']>;
  amountDisbursedThisPeriod?: InputMaybe<Scalars['Float']['input']>;
  coversReportingGap?: InputMaybe<Scalars['Boolean']['input']>;
  currentPeriodInterestRate?: InputMaybe<Scalars['Float']['input']>;
  /** Required when loanStatus is FullyRepaid or WrittenOff. */
  dischargeDoc?: InputMaybe<Scalars['String']['input']>;
  loanBook?: InputMaybe<Scalars['String']['input']>;
  /** Optional — resolved from the term sheet / financier repayment when omitted. */
  loanId?: InputMaybe<Scalars['ID']['input']>;
  loanStatus: DeclarationLoanStatus;
  nextPaymentAmount?: InputMaybe<Scalars['Float']['input']>;
  nextPaymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  outstandingInterest: Scalars['Float']['input'];
  outstandingPenalties?: InputMaybe<Scalars['Float']['input']>;
  outstandingPrincipal: Scalars['Float']['input'];
  paymentStatus: DeclarationPaymentStatus;
  prepaymentFlag?: InputMaybe<Scalars['Boolean']['input']>;
  prepaymentPenaltyAmount?: InputMaybe<Scalars['Float']['input']>;
  reportingDate: Scalars['DateTime']['input'];
};

/** The issuer's final disclosure — the document that gates closing. */
export type FinalDisclosure = {
  __typename?: 'FinalDisclosure';
  fileName: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type FinancierFilter = {
  displayName?: InputMaybe<StringOperator>;
  entityType?: InputMaybe<EntityType>;
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
  verificationStatus?: InputMaybe<EntityVerificationStatus>;
};

/** The five cards across the top of the financier dashboard. */
export type FinancierPipelineCounts = {
  __typename?: 'FinancierPipelineCounts';
  /** Live loans — DISBURSED or REPAYING. */
  approved: Scalars['Int']['output'];
  closed: Scalars['Int']['output'];
  /**
   * Past PENDING, before CLOSED.
   *
   * The remainder — total minus new, approved and closed — rather than its own
   * status list. The stages between PENDING and CLOSED change as the flow grows,
   * and an enumerated list here would drift out of step with them silently,
   * leaving requests counted in `total` and shown on no card.
   */
  inProgress: Scalars['Int']['output'];
  /** requestStatus PENDING. */
  new: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/**
 * The caller's financed property book as a financier, split into two sections:
 * `inProgress` (the loan is still being disbursed/repaid) and `settled`
 * (financing discharged/closed). A financier never holds the property outright,
 * so there is no `owned` section.
 */
export type FinancierPropertyHoldings = {
  __typename?: 'FinancierPropertyHoldings';
  inProgress: Array<Property>;
  settled: Array<Property>;
};

export type FloorArea = {
  __typename?: 'FloorArea';
  unit?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type FloorAreaInput = {
  unit?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type GatedAction =
  | 'drawdown'
  | 'listing'
  | 'transaction';

export type GrantAssessmentFinancierShareInput = {
  assessmentId: Scalars['ID']['input'];
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  financierEntityId: Scalars['ID']['input'];
  scope?: InputMaybe<AssessmentFinancierShareScope>;
};

export type GrantAssessmentShareInput = {
  assessmentId: Scalars['ID']['input'];
  counterpartyEntityId: Scalars['ID']['input'];
  /** The entity must actually hold this platform role. */
  counterpartyKind: AssessmentCounterpartyKind;
  /** Null means the share stands until it is revoked. */
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  scope?: InputMaybe<AssessmentShareScope>;
};

export type GrantOfferRequestInput = {
  availabilityPeriodDays?: InputMaybe<Scalars['Int']['input']>;
  bondSubType?: InputMaybe<BondSubType>;
  commitmentFeeRate?: InputMaybe<Scalars['Float']['input']>;
  conditions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  covenants?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  currency?: InputMaybe<Scalars['String']['input']>;
  depositPercentage?: InputMaybe<Scalars['Float']['input']>;
  drawdownSchedule?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  dsraMonths?: InputMaybe<Scalars['Int']['input']>;
  interestRate?: InputMaybe<Scalars['JSONObject']['input']>;
  lenderName?: InputMaybe<Scalars['String']['input']>;
  loanSubType?: InputMaybe<LoanSubType>;
  loanTenor?: InputMaybe<Scalars['JSONObject']['input']>;
  loanType?: InputMaybe<LoanType>;
  ltv?: InputMaybe<Scalars['Float']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  moratorium?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  offerExpiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  otherFees?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  paymentTermsAndSchedule?: InputMaybe<PaymentTermsAndScheduleInput>;
  processingTimeline?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  rateType?: InputMaybe<RateType>;
  repaymentFrequency?: InputMaybe<RepaymentFrequency>;
  repaymentType?: InputMaybe<RepaymentType>;
  schedule?: InputMaybe<Scalars['JSONObject']['input']>;
  security?: InputMaybe<Scalars['JSONObject']['input']>;
  sources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/**
 * A document the platform already holds that satisfies a diligence category.
 *
 * `source` is where it came from, and it is the reason this type is worth having:
 * a title certificate lifted from a listing made eight months ago and one the
 * issuer produced this morning are different evidence, and the vendor deciding
 * whether to grant access to it should be able to tell.
 */
export type HeldDocument = {
  __typename?: 'HeldDocument';
  /**
   * The canonical category this satisfies. Aliases are resolved — ask for
   * `site_plan` and you are answered about `land_documents`, because they are the
   * same document under two catalogues' names.
   */
  categoryId: Scalars['String']['output'];
  documentUrl: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  /** When we came by it, so the age shown is the real age. Null where unknown. */
  heldSince?: Maybe<Scalars['DateTime']['output']>;
  /**
   * listing | portfolio | approach | compliance on a property; readiness |
   * diligence on a person (`getMyHeldDocuments`). `portfolio` is a document filed
   * on the development the unit belongs to (its master title, say) rather than one
   * belonging to this unit alone. A development's document is never offered for a
   * category the unit answers with its own.
   */
  source: Scalars['String']['output'];
  /** One line saying where it came from, for whoever is deciding whether to use it. */
  sourceNote: Scalars['String']['output'];
};

export type IdOperator = {
  eq?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type IdentityAttestation = {
  __typename?: 'IdentityAttestation';
  status: IdentityAttestationStatus;
  /** When the NIA confirmed it. Set only on VERIFIED. */
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

/**
 * What a counterparty may know about an identity check: the outcome, never the
 * record. NONE is no check at all — every account predating NIA verification,
 * which is not gated — and must read as "not checked", not as a failure.
 */
export type IdentityAttestationStatus =
  | 'FAILED'
  | 'NONE'
  /** Requested and not yet settled, including a check waiting on a human. */
  | 'PENDING'
  | 'VERIFIED';

export type IdentityDocumentInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  idNumber: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  issueDate?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type IdentityVerification = {
  __typename?: 'IdentityVerification';
  /** Set on VERIFIED / FAILED / UNVERIFIABLE. */
  checkedAt?: Maybe<Scalars['DateTime']['output']>;
  /** For support. Never rendered raw to the registrant. */
  reason?: Maybe<Scalars['String']['output']>;
  /** "NIA" in production, "SIMULATED" until the keys land, "ADMIN" on override. */
  source: Scalars['String']['output'];
  status: IdentityVerificationStatus;
};

/**
 * NIA (Ghana Card) identity verification. PENDING from onboarding until the
 * check runs; UNVERIFIABLE means no match and a human has to look — or the
 * verifier never answered — rather than "this person lied".
 */
export type IdentityVerificationStatus =
  | 'FAILED'
  | 'PENDING'
  | 'UNVERIFIABLE'
  | 'VERIFIED';

export type ImportAssessmentAlertRuleInput = {
  code: Scalars['String']['input'];
  message: Scalars['String']['input'];
  operator: AssessmentAlertOperator;
  severity: AssessmentAlertSeverity;
  threshold: Scalars['JSON']['input'];
  triggerQuestionCode: Scalars['String']['input'];
};

export type ImportAssessmentCategoryInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type ImportAssessmentQuestionInput = {
  answerType: AssessmentAnswerType;
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  guidance?: InputMaybe<Scalars['String']['input']>;
  isKycAutofill?: InputMaybe<Scalars['Boolean']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isScored?: InputMaybe<Scalars['Boolean']['input']>;
  kycSourceField?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
  scoringLogicText?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  verification?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type ImportAssessmentQuestionOptionInput = {
  code: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  questionCode: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};

export type ImportAssessmentReadinessBandInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  guidance?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  maxScore: Scalars['Int']['input'];
  minScore: Scalars['Int']['input'];
};

export type ImportAssessmentScoringBandInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  questionCode: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};

export type ImportAssessmentTemplateBaseInput = {
  code: Scalars['String']['input'];
  consentText?: InputMaybe<Scalars['String']['input']>;
  declarationText?: InputMaybe<Scalars['String']['input']>;
  legalNotice?: InputMaybe<Scalars['String']['input']>;
  maxScorePerParameter?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  subjectType?: InputMaybe<AssessmentSubjectType>;
  version: Scalars['String']['input'];
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
  __typename?: 'InitiateDepositResult';
  id: Scalars['ID']['output'];
  reference: Scalars['String']['output'];
};

/** A defect found at inspection, and the negotiation that followed it. */
export type InspectionIssue = {
  __typename?: 'InspectionIssue';
  /** Null until the logger has decided. False means escalated, not cancelled. */
  accepted?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  detail?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  loggedAt: Scalars['DateTime']['output'];
  /** Which side logged it. Only this side may accept or reject the remedy. */
  loggedBy: TransactionPartyRole;
  /** The current proposal. Replaced, not accumulated, when a new one is made. */
  remedy?: Maybe<Scalars['String']['output']>;
  /** When the remedy is promised by. A date, not a deadline anything enforces. */
  remedyByDate?: Maybe<Scalars['Date']['output']>;
  remedyProposedAt?: Maybe<Scalars['DateTime']['output']>;
  remedyProposedBy?: Maybe<TransactionPartyRole>;
  resolutionNote?: Maybe<Scalars['String']['output']>;
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  status: InspectionIssueStatus;
  summary: Scalars['String']['output'];
  /** The deal this was logged against, whichever flow it belongs to. */
  transactionId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/**
 * Remedy first; cancellation only when the remedy fails.
 *
 * Nothing in this enum ends a deal. `escalated` records that a proposed remedy was
 * rejected and leaves the deal on the withdrawal ground it already has — cancelling
 * remains the existing withdraw path rather than a second way out under different
 * rules.
 */
export type InspectionIssueStatus =
  /**
   * The logger rejected the remedy. NOT terminal and NOT a cancellation — a
   * further remedy may be proposed, which is what stops a rejection being a dead
   * end. Counts as unresolved: the stage will not advance over one.
   */
  | 'escalated'
  /** Logged. Nobody has proposed a remedy yet. */
  | 'open'
  /** The other side has offered a remedy; the logger decides. */
  | 'remedy_proposed'
  /** The logger accepted the remedy. The only settled state. */
  | 'resolved';

export type InstallmentFilter = {
  currency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  refNo?: InputMaybe<Scalars['String']['input']>;
  repaymentId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** A revised figure for one installment. Its due date stays as it is. */
export type InstallmentRevisionInput = {
  amount: Scalars['Float']['input'];
  /** Annual effective interest rate, in percent (24.5 = 24.5% a year). Zero or more. */
  effectiveInterestRate: Scalars['Float']['input'];
  fees?: InputMaybe<Scalars['Float']['input']>;
  interest?: InputMaybe<Scalars['Float']['input']>;
  /** Optional split; when given, principal, interest and fees must add up to amount. */
  principal?: InputMaybe<Scalars['Float']['input']>;
};

export type InterestRate = {
  __typename?: 'InterestRate';
  kind: Scalars['String']['output'];
  rate: Scalars['Float']['output'];
};

export type InterestRateInput = {
  kind?: InputMaybe<Scalars['String']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
};

export type InviteCompanyMemberInput = {
  email: Scalars['String']['input'];
  entityRoleId: Scalars['ID']['input'];
  fullName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type IssuerFilter = {
  displayName?: InputMaybe<StringOperator>;
  entityType?: InputMaybe<EntityType>;
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
  verificationStatus?: InputMaybe<EntityVerificationStatus>;
};

/** The five cards across the top of the issuer dashboard. */
export type IssuerPortfolioCounts = {
  __typename?: 'IssuerPortfolioCounts';
  /** Listed and still claimable. */
  available: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  /**
   * Units on the market — available plus under offer.
   *
   * A unit spoken for has not left the market; it just cannot be claimed again.
   * So the three read as one row: 40 listed, of which 32 available and 8 under
   * offer.
   */
  listed: Scalars['Int']['output'];
  /**
   * List value of unsold stock — the hero's headline figure.
   *
   * The same `status != sold` definition the series uses, so this equals the last
   * point of `getIssuerPipelineSeries`.
   */
  pipelineValue: Scalars['Float']['output'];
  sold: Scalars['Int']['output'];
  /** Sum of purchasePrice across EXECUTED / COMPLETED term sheets. */
  totalRevenue: Scalars['Float']['output'];
  /** Claimed by a buyer who has committed money, not yet sold. */
  underOffer: Scalars['Int']['output'];
};

export type Land = {
  __typename?: 'Land';
  boundary?: Maybe<Scalars['JSONObject']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  ownerId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LandCheckResult = {
  __typename?: 'LandCheckResult';
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type LandFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
};

export type LedgerLoan = {
  __typename?: 'LedgerLoan';
  borrowerName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  /** Facility amount — the disbursable principal (OfferRequest.agreedAmount). */
  facilityAmount?: Maybe<Scalars['Float']['output']>;
  /** False when no active declaration exists yet (portfolio row tone = RED). */
  hasDeclaration: Scalars['Boolean']['output'];
  /** Loan row key — equals the anchoring offerRequestId. */
  id: Scalars['ID']['output'];
  interestRate?: Maybe<Scalars['JSONObject']['output']>;
  /** reportingDate of the latest active declaration (drives staleness). */
  lastDeclarationDate?: Maybe<Scalars['DateTime']['output']>;
  latestDeclaration?: Maybe<StatusDeclaration>;
  lenderName?: Maybe<Scalars['String']['output']>;
  /** Human-readable loan reference (OfferRequest.refNo). */
  loanRef?: Maybe<Scalars['String']['output']>;
  /** Declared loan status from the latest active declaration. */
  loanStatus?: Maybe<DeclarationLoanStatus>;
  modeOfFinancing?: Maybe<Scalars['String']['output']>;
  offerRequest: OfferRequest;
  offerRequestId: Scalars['ID']['output'];
  /** Origination reference (OfferRequest.approvedAt). */
  originationDate?: Maybe<Scalars['DateTime']['output']>;
  propertyName?: Maybe<Scalars['String']['output']>;
  requestStatus?: Maybe<OfferRequestStatus>;
  /** Total outstanding from the latest active declaration; null when none filed yet. */
  totalOutstanding?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * The side this viewer sits on for this row — LENDER where their entity is the
   * financier (or the issuer under seller financing), BORROWER where they are the
   * buyer. A viewer who is both reads as LENDER, the side carrying the servicing
   * obligations. Lets one query feed both Loan Book and My Loans.
   */
  viewerRole?: Maybe<LedgerLoanRole>;
};

export type LedgerLoanFilter = {
  /** Filter to a single loan by its anchoring offer request (id and offerRequestId are equivalent). */
  id?: InputMaybe<Scalars['ID']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  /** Narrow to one servicing status (must be a status the loan book already surfaces). */
  requestStatus?: InputMaybe<OfferRequestStatus>;
  /**
   * Narrow to a set of servicing statuses — e.g. the open book, [DISBURSED,
   * REPAYING, DISCHARGE_ISSUED], excluding CLOSED. Every member must be a
   * loan-book status.
   *
   * Omitting both this and `requestStatus` returns the whole book (all four
   * statuses), which is what a list showing closed rows alongside open ones
   * wants. Pass one or the other, never both. An empty list is refused rather
   * than silently matching nothing, since it is almost always a caller that
   * built its filter from an empty selection.
   */
  requestStatuses?: InputMaybe<Array<OfferRequestStatus>>;
  /**
   * Narrow to one side of the deal: LENDER for the Loan Book, BORROWER for My
   * Loans. Omitted, a read spans every side the viewer sits on — which is what a
   * viewer who only lends, or only borrows, already gets. Asking for a side you
   * have no context for (LENDER without an active entity) is refused rather than
   * answered with an empty book.
   */
  role?: InputMaybe<LedgerLoanRole>;
};

/** Which side of a loan a row is being read from. */
export type LedgerLoanRole =
  /** The viewer is the buyer on this loan. */
  | 'BORROWER'
  /** The viewer's entity lends on this loan — financier, or issuer under seller financing. */
  | 'LENDER';

export type LegalDocs = {
  __typename?: 'LegalDocs';
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type LegalDocsInput = {
  /**
   * Which due-diligence category this document answers, so a buyer or a financier
   * is never asked for a file the issuer already gave us (AFR-155).
   *
   * One of the issuer-side catalogue ids — `title_documents`, `site_plan` /
   * `land_documents`, `building_permit` / `planning_permission`, `encumbrances`,
   * `valuation_report`, `company_registration`, `tax_clearance` / `tax_status`,
   * `insurance_certificate`, `construction_status`. The synonym pairs are the same
   * document under two names and match each other, so either spelling works.
   *
   * Optional, and it always will be. Every listing made before this field existed
   * has untagged documents and stays perfectly valid — an untagged document simply
   * cannot be matched to a request, so it is never offered. Anything outside the
   * list is rejected rather than stored: a typo that silently never matched would
   * look exactly like a feature that does not work.
   */
  categoryId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Loan = {
  __typename?: 'Loan';
  conversationId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  interestRate?: Maybe<Scalars['JSONObject']['output']>;
  loanAmount: Scalars['Float']['output'];
  loanStatus?: Maybe<Scalars['String']['output']>;
  loanTenor?: Maybe<Scalars['JSONObject']['output']>;
  repaymentFrequency?: Maybe<Scalars['String']['output']>;
  totalInterest?: Maybe<Scalars['Float']['output']>;
  totalRepayment?: Maybe<Scalars['Float']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

/**
 * The loan agreement as issued, and the clock the lender put on signing it. Null
 * until a lender issues one (issueLoanAgreement).
 *
 * There is no separate "sent to borrower" timestamp: issuing the agreement is what
 * delivers it — the same call notifies the borrower — so `issuedAt` is both, and a
 * second field could only ever repeat it or drift from it.
 *
 * `signingDeadline` is currently advisory. The lender sets it and it is validated
 * as a future date when issued, but signing is not refused after it passes; see
 * `signAsBorrower`. Show it as the date the parties agreed to, not as a cutoff the
 * server enforces.
 */
export type LoanAgreement = {
  __typename?: 'LoanAgreement';
  fileName?: Maybe<Scalars['String']['output']>;
  /**
   * The current agreement document. The borrower's signed copy replaces the
   * unsigned one in place when they sign, and the lender's executed copy replaces
   * that on countersignature — this is always the latest of the three.
   */
  fileUrl?: Maybe<Scalars['String']['output']>;
  /** When the lender issued it, which is also when the borrower was notified. */
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The date the lender set for signing, or null if they set none. */
  signingDeadline?: Maybe<Scalars['DateTime']['output']>;
};

export type LoanDocument = {
  __typename?: 'LoanDocument';
  fileName: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['Float']['output']>;
  fileType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  loanId?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  offerRequestId: Scalars['ID']['output'];
  source: LoanDocumentSource;
  tag?: Maybe<Scalars['String']['output']>;
  uploadedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Vault download / preview target. */
  url?: Maybe<Scalars['String']['output']>;
};

export type LoanDocumentSource =
  | 'borrower'
  | 'financier';

export type LoanFilter = {
  conversationId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type LoanPaymentSource =
  /**
   * PSP / mobile-money / bank rail outside Afram. Not yet available — the
   * mutation refuses it. Gate the option in the modal until the webhook ships.
   */
  | 'external'
  /** Pay from the caller's wallet cash balance. */
  | 'wallet';

export type LoanRequestKind =
  | 'declaration_review'
  | 'formal_request';

export type LoanRequestStatus =
  | 'acknowledged'
  | 'open';

export type LoanScheduleType =
  | 'ANNUITY'
  | 'BALLOON'
  | 'BULLET'
  | 'EQUAL_PRINCIPAL';

export type LoanSubType =
  | 'FLAT'
  | 'REDUCING';

export type LoanType =
  | 'BRIDGE_LOAN'
  | 'COMMERCIAL'
  | 'CONSTRUCTION_LOAN'
  | 'EQUITY_RELEASE'
  | 'MEZZANINE'
  | 'MORTGAGE';

export type MarkAllAsReadResponse = {
  __typename?: 'MarkAllAsReadResponse';
  updated: Scalars['Int']['output'];
};

export type MarkSupportRequestSeenInput = {
  reference: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  attachmentComment?: Maybe<Scalars['String']['output']>;
  attachmentComments?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  content: Scalars['JSONObject']['output'];
  conversationId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  deletedBy?: Maybe<Scalars['String']['output']>;
  deletedForEveryone?: Maybe<Scalars['Boolean']['output']>;
  deletedForUsers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  isEdited?: Maybe<Scalars['Boolean']['output']>;
  isRead?: Maybe<Scalars['Boolean']['output']>;
  messageType: Scalars['String']['output'];
  pollData?: Maybe<Scalars['JSONObject']['output']>;
  reactions?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  replies?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  replyTo?: Maybe<Scalars['JSONObject']['output']>;
  senderId: Scalars['String']['output'];
  senderPicture?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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
  __typename?: 'MfaOtpPayload';
  email?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
};

export type MfaSetupPayload = {
  __typename?: 'MfaSetupPayload';
  message: Scalars['String']['output'];
  user: User;
};

export type MfaVerifyPayload = {
  __typename?: 'MfaVerifyPayload';
  message: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

export type ModeOfFinancing =
  | 'FINANCIER_OFFER'
  | 'ISSUER_LOAN_FINANCING'
  | 'PERSONAL_FUNDS'
  /**
   * Rent to buy — the buyer is a tenant for a term and owns nothing until they
   * exercise the option. The request anchors the deal's conversation; the
   * tenancy itself lives on RentToBuyTxn, and nothing is lent, so nothing about
   * this request should be read as debt.
   */
  | 'RENT_TO_BUY'
  | 'SELLER_FINANCING';

export type MoneyOperator = {
  between?: InputMaybe<MoneyRange>;
  eq?: InputMaybe<Scalars['Money']['input']>;
  gt?: InputMaybe<Scalars['Money']['input']>;
  gte?: InputMaybe<Scalars['Money']['input']>;
  lt?: InputMaybe<Scalars['Money']['input']>;
  lte?: InputMaybe<Scalars['Money']['input']>;
};

export type MoneyRange = {
  end: Scalars['Money']['input'];
  start: Scalars['Money']['input'];
};

export type MonthlyPayment = {
  __typename?: 'MonthlyPayment';
  amount: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
  interestComponent: Scalars['Float']['output'];
  principalComponent: Scalars['Float']['output'];
  refNo: Scalars['String']['output'];
  remainingPrincipal: Scalars['Float']['output'];
  status: PaymentStatus;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Requester accepts what was supplied. Terminal for that category. */
  acceptApproachItem: SellerApproach;
  /** Requester — from `submitted` to `accepted`. Terminal. */
  acceptCashDiligenceItem: CashPurchaseTxn;
  acceptCompanyInvite: EntityMember;
  /** Requester — accept what was submitted. Terminal. */
  acceptDiligenceItem: SellerFinancingTxn;
  /** Issuer — commitment_deposit_paid → offer_responded. Accepts the offer. */
  acceptOffer: CashPurchaseTxn;
  /**
   * Borrower signs the offer letter (→ OFFER_LETTER_BORROWER_SIGNED).
   *
   * `signedDocumentUrl` is the borrower's own signed copy. It is kept on their
   * signature record and read back as `offerLetterSignatures.borrower.documentUrl`
   * — it does not replace the letter the lender issued, so the issued letter and
   * each party's signed copy all survive independently. Optional: a party may sign
   * without attaching anything.
   */
  acceptOfferLetter: OfferRequest;
  /**
   * Buyer — payment_plan_proposed → payment_plan_accepted. Requires
   * acknowledgedTerms and a non-empty name. The plan is non-binding: the SPA is
   * the contract.
   */
  acceptPaymentPlan: SellerFinancingTxn;
  /** Requester — accepts what was submitted. Terminal. */
  acceptRentDiligenceItem: RentToBuyTxn;
  /**
   * Buyer — rent_plan_proposed → rent_plan_accepted. Records plan.acceptedAt and
   * planAcceptedBy.
   *
   * Refused when acknowledgedTerms is false, or when the typed name does not match
   * the buyer's registered name (case- and whitespace-insensitive).
   */
  acceptRentPlan: RentToBuyTxn;
  acceptTermsSheet: OfferRequest;
  /** Financier marks a borrower request acknowledged (open → acknowledged), lender-scoped. */
  acknowledgeBorrowerLoanRequest: BorrowerLoanRequest;
  /**
   * Buyer ONLY — title_transferred → closed, status `closed`. Records
   * titleAcknowledgedAt and titleAcknowledgedBy.
   *
   * This is the ONLY route to `closed` (§2.7). A vendor asserting they posted the
   * documents is not evidence the buyer has them.
   */
  acknowledgeTitleReceipt: RentToBuyTxn;
  /** Public. Creates the account and signs the person in — the same payload as `login`. */
  activateAccount: AuthPayload;
  activateAssessment: Scalars['Boolean']['output'];
  addAttachmentComment: Message;
  /** Member: reply in a ticket's thread. Refused once the ticket is closed. */
  addMyTicketComment: TicketComment;
  addParticipant: Conversation;
  addReaction: Message;
  addReply: Message;
  /** Signed in: add a message, with words, files or both. Reopens a resolved request; refused (REQUEST_CLOSED) on a closed one. */
  addSupportMessage: SupportMessagePayload;
  addTicketComment: TicketComment;
  addUserForPush: NotificationSuccessResponse;
  /**
   * Buyer — offer_responded → terms_agreed, and seeds the §4 diligence exchange
   * in both directions. Seeding happens here rather than at placement because
   * before terms are agreed there is no deal to run diligence on.
   */
  agreeTerms: CashPurchaseTxn;
  /**
   * Financier restates the rest of a schedule-driven loan's repayment schedule —
   * typically after a missed payment. Installments paid in full or waived are
   * kept; partly paid ones are closed out at what was paid (status `cancelled`),
   * so their unpaid remainder must be carried into the new rows; everything else
   * is replaced by `schedule`. Declarations generated from replaced installments
   * are retired. `gracePeriodDays` is kept when omitted. Returns the loan's
   * installments after the amendment.
   */
  amendRepaymentSchedule: Array<RepaymentInstallment>;
  /** Staff only (access_request:decide). Emails the temporary password and link; neither is returned. */
  approveAccessRequest: AccessRequest;
  /**
   * Financier approves a schedule-generated declaration ahead of its
   * approvalDueAt. Idempotent: approving one already approved, or deemed
   * approved, returns it unchanged.
   */
  approveScheduledDeclaration: StatusDeclaration;
  approveUserVerification: User;
  archiveAssessment: Scalars['Boolean']['output'];
  /** Staff (support_request:assign). Null unassigns. */
  assignSupportRequest: SupportRequest;
  assignSupportRole: SupportRoleMember;
  assignTicket: Ticket;
  attachAssessmentDocumentFile: Scalars['Boolean']['output'];
  /**
   * From CONDITIONS_PRECEDENT_CONFIRMED ("Ready to Disburse") → REPAYING. The
   * financier supplies the repayment schedule and the grace period (AFR-310): the
   * loan is serviced from that schedule — declarations are generated per
   * installment for the financier to approve, the borrower is reminded before
   * each due date and debited from their wallet through the grace period, and a
   * payment counts as missed only once the grace period lapses.
   */
  beginLoanDeclaration: OfferRequest;
  beginOfficerReview: Scalars['Boolean']['output'];
  beginRequestReview: OfferRequest;
  /**
   * Take one of the vendor's published slots.
   *
   * Refused if the id does not parse, is in the past, falls outside every declared
   * window, is not on a slot boundary, or has already gone. Booking the same slot
   * twice as the same member returns the existing appointment rather than
   * refusing — a double-tapped button is not a conflict.
   */
  bookPropertyViewing: PropertyViewing;
  bulkCreatePreTokenizedUnits: BulkCreatePreTokenizedUnitsResponse;
  bulkUpdatePreTokenizedUnitsByType: BulkUpdatePreTokenizedUnitsResponse;
  /** Cancel a declaration within its 7-day cancellable window. Not available for schedule-generated declarations — amend the schedule instead. */
  cancelDeclaration: StatusDeclaration;
  /**
   * Either party calls it off, and the slot goes back on the market.
   *
   * Not among the contract's three, and the feature does not work without it: a
   * confirmed appointment that cannot be cancelled holds its slot forever, so one
   * member changing their mind would take that morning out of the vendor's diary
   * permanently.
   */
  cancelPropertyViewing: PropertyViewing;
  checkLand: LandCheckResult;
  /** Computer. Auth + key. Ends the session and deletes the photo. */
  closeSelfieSession: Scalars['Boolean']['output'];
  /**
   * Issuer — title_settled → repaying. Creates/activates the loan record in the
   * servicing domain with principal = financedAmount and the plan's
   * rate/tenor/frequency, and writes the issuer's repayment schedule with its
   * grace period (AFR-310). The loan is serviced from that schedule: a
   * declaration is generated per installment for the issuer to approve, and the
   * buyer is reminded and debited from their wallet against it. Discharge and
   * close are driven from there.
   */
  commenceRepayment: SellerFinancingTxn;
  /**
   * Financier records that they have instructed a valuer on a project loan.
   *
   * Refused on any mode but ISSUER_LOAN_FINANCING — a valuation on a member's
   * mortgage is a category error, not a no-op — and refused to anyone but the
   * request's financier, including the vendor borrowing on it.
   *
   * Re-commissioning replaces an outstanding instruction, which is how a valuer
   * who fell through is swapped for another. A valuation already RECEIVED is not
   * re-openable: the term sheet may already have been issued against the figure.
   */
  commissionValuation: OfferRequest;
  /**
   * Underwriting concludes, and says how much of the request the lender will
   * actually carry (D76).
   *
   * Omitting `allocatedAmount` means the full request, so every caller that
   * predates these arguments is unchanged — a full approval still goes through
   * this operation exactly as it did.
   *
   * Two refusals, both deliberate:
   *   * More than requested is refused, not clamped. A lender offering above the
   *     ask is a typo or a different conversation, and both want a human.
   *   * A shortfall without `allocationNote` is refused. The borrower has to find
   *     the gap somewhere else, and "approved for less, no reason given" is the
   *     message that generates the phone call.
   *
   * The decision is written to the offer request itself as `agreedAmount`, not
   * only to the assessment — the term sheet builder reads the request, and a
   * builder opening on the figure the lender just decided against is how the
   * wrong principal gets issued.
   */
  completeFinancingAssessment: OfferRequest;
  completeOnboarding: CompleteOnboardingPayload;
  /**
   * Vendor — under_review → diligence_complete.
   *
   * Refused while any document request is still outstanding: every item must be
   * accepted or waived first, and an EMPTY set is never complete.
   */
  completeRentDueDiligence: RentToBuyTxn;
  /**
   * Issuer — under_review → diligence_complete. Records the issuer's close-out of
   * the document exchange. Gains a "both directions settled" hard guard when the
   * structured exchange module lands.
   */
  completeSellerDueDiligence: SellerFinancingTxn;
  /**
   * Issuer — funds_released → closed. Mints tokens (1 token = GHS 1.00), marks the
   * unit sold and conveys title.
   *
   * Gated on the final disclosure existing, which is why that upload is its own
   * mutation: a close that also accepted the document could never refuse for its
   * absence.
   */
  completeTitleTransfer: CashPurchaseTxn;
  computeAssessmentScore: AssessmentScoreResult;
  /**
   * Issuer — escrow_funded → completion_conditions_confirmed. One click: cash has
   * no itemized checklist, because there is no lender imposing conditions.
   */
  confirmCashCompletionConditions: CashPurchaseTxn;
  /**
   * Issuer — spa_signed → completion_conditions_confirmed. Conditions carried by an
   * `approved_with_conditions` credit decision belong to this checklist.
   */
  confirmCompletionConditions: SellerFinancingTxn;
  /**
   * Advance to CONDITIONS_PRECEDENT_CONFIRMED. Fails unless every PRECEDENT item is
   * resolved. Conditions subsequent are deliberately not counted — an outstanding
   * one must never hold up a drawdown.
   */
  confirmConditionsPrecedent: OfferRequest;
  /**
   * Vendor — option_fee_released → occupancy_commenced. Records
   * occupancyStartedAt. Keys change hands; TITLE DOES NOT MOVE.
   */
  confirmHandover: RentToBuyTxn;
  /**
   * Either party — the inspection happened and they are satisfied (item 5).
   *
   * Was buyer-only. The stage advances to `inspection_complete` on the SECOND
   * confirmation, and only when no issue is open. Calling it twice from the same
   * side is refused rather than silently re-stamping, so the timestamp keeps
   * meaning when that party first confirmed.
   */
  confirmInspection: CashPurchaseTxn;
  /** Vendor — rent_agreement_signed → completion_conditions_confirmed. */
  confirmRentCompletionConditions: RentToBuyTxn;
  /**
   * Vendor — sets fullyPaidConfirmedAt, unlocking Buy Now at plan.buyPrice.
   *
   * ⚠ Refused unless paymentsMade >= plan.termMonths, verified server-side (§2.2).
   * The gate is a COUNT of payments, not a sum of money, and the vendor cannot
   * unlock a purchase early by asserting it.
   */
  confirmRentFullyPaid: RentToBuyTxn;
  confirmRentInspection: RentToBuyTxn;
  confirmSellerInspection: SellerFinancingTxn;
  /** Signed in: "Yes, thanks" closes a resolved request; "No, still a problem" reopens it. NOT_RESOLVED otherwise. */
  confirmSupportResolution: SupportRequest;
  /**
   * Issuer — down_payment_released → title_settled. Under
   * retained_until_settlement, this records the buyer's contractual right to
   * transfer on final payment; transfer becomes a condition of discharge.
   */
  confirmTitleSettled: SellerFinancingTxn;
  contactUs: ContactUsResponse;
  /**
   * The phase completes: the buyer has placed their financing requests and the
   * approach records which ones.
   *
   * Allowed only once the deposit is confirmed AND every property-pack category
   * carries at least one file. This is the ONE close that does not refund — the
   * money became the buyer's equity in a purchase that is now going ahead.
   */
  convertSellerApproach: SellerApproach;
  /**
   * Lender countersigns the offer letter to finalise it (→ OFFER_LETTER_ACCEPTED).
   *
   * `signedDocumentUrl` is the lender's countersigned copy, kept on their signature
   * record as `offerLetterSignatures.financier.documentUrl`. Optional, and stored
   * alongside the borrower's rather than over it.
   */
  countersignOfferLetter: OfferRequest;
  /**
   * Vendor — the FINAL signature, signing as Landlord. Requires buyerSignature.
   * Sets `executed` → rent_agreement_signed.
   *
   * Stamps onto the buyer's SIGNED COPY, never the unsigned original.
   *
   * ⚠ Refused while a variation round is open (§2.8): executing over an unanswered
   * objection binds the buyer to a document nobody replied to.
   */
  countersignRentAgreement: RentToBuyTxn;
  /**
   * Issuer — the FINAL signature. Executes the agreement →
   * sale_agreement_signed. Rejected until the buyer has signed.
   */
  countersignSaleAgreement: CashPurchaseTxn;
  /**
   * Issuer — the FINAL signature, as Lender. Requires the buyer's signature.
   * Executes the agreement and moves spa_issued → spa_signed.
   */
  countersignSellerFinancingSpa: SellerFinancingTxn;
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
  createAssetValueSnapshot: Scalars['Boolean']['output'];
  createBareLandProject: PortfolioProjectWithUnitsResult;
  createBuyerProject: Scalars['Boolean']['output'];
  createCompanyRole: EntityRole;
  /** Admin: create a compliance section for a role type */
  createComplianceSection: ComplianceAdminSectionResponse;
  /** Admin: add a document template to a section */
  createComplianceTemplate: ComplianceAdminTemplateResponse;
  createConversation: Conversation;
  createDueDiligence: Scalars['Boolean']['output'];
  createLand: Scalars['Boolean']['output'];
  createOffer: Scalars['Boolean']['output'];
  createOfferRequest: OfferRequest;
  createPaymentSchedule: Scalars['Boolean']['output'];
  createPortfolio: Scalars['Boolean']['output'];
  createPortfolioProjectWithUnits: PortfolioProjectWithUnitsResult;
  createPreTokenizedUnit: PreTokenizedUnit;
  createProject: Scalars['Boolean']['output'];
  createProperty: Scalars['Boolean']['output'];
  createRepayment: Scalars['Boolean']['output'];
  createReview: Scalars['Boolean']['output'];
  createSimpleConversation: Conversation;
  /** Signed in: start a request. The first message is the body and its files. */
  createSupportRequest: SupportRequest;
  createSupportRole: SupportRole;
  createSupportUser: SupportUser;
  createTailoringRule: TailoringRuleResponse;
  createTempProject: Scalars['Boolean']['output'];
  createTermSheet: TermSheet;
  createTransaction: Scalars['Boolean']['output'];
  /** The vendor accepts or declines. Declining releases the slot. */
  decidePropertyViewing: PropertyViewing;
  /**
   * Vendor — answers a pending buyout request. declineReason is required when
   * declining and is shown to the buyer verbatim.
   *
   * Approving unlocks Buy Now; it does NOT set a price. Pricing is a separate act
   * (setRentSettlement), because unlocking and pricing are separate decisions.
   */
  decideRentBuyout: RentToBuyTxn;
  /**
   * Issuer — request_submitted → commitment_deposit_paid, on LEGACY deals only.
   * Records the issuer's declaration that the commitment deposit landed in their
   * own account.
   *
   * Writes NO escrow event: the money never passed through the platform. Receipts
   * generated from this must say "Declared received by the issuer", never
   * "Confirmed by the escrow provider".
   *
   * Refused on a deal placed since D71 — there the deposit is escrowed and there
   * is nothing left to declare. A second route to commitment_deposit_paid would be
   * a route that moves the deal without money.
   */
  declareCommitmentDeposit: SellerFinancingTxn;
  /** Staff only (access_request:decide). */
  declineAccessRequest: AccessRequest;
  declineOfferLetter: OfferRequest;
  /**
   * Vendor — answers the open round without changing the document: status
   * `declined` with a resolutionNote (>=10 chars, required). The buyer is
   * notified; the agreement stands as `sent`.
   */
  declineRentVariation: RentToBuyTxn;
  /**
   * Issuer — resolves the open round as `declined` with the reason (>=10 chars).
   * The SPA stands as sent; the buyer is notified with the reason.
   */
  declineSpaVariation: SellerFinancingTxn;
  /**
   * Decrypt every value of a metadata object previously produced by
   * encryptMetadata, restoring each original value (with its JSON type intact).
   */
  decryptMetadata: Scalars['JSON']['output'];
  deleteAllNotifications: DeleteAllNotificationsResponse;
  deleteCompanyRole: Scalars['Boolean']['output'];
  /** Admin: delete a compliance section and all its templates */
  deleteComplianceSection: ComplianceDeleteResponse;
  /** Admin: delete a document template */
  deleteComplianceTemplate: ComplianceDeleteResponse;
  deleteConversation: Scalars['Boolean']['output'];
  deleteMessage: Scalars['Boolean']['output'];
  /**
   * Remove the stored signature, since it is biometric-adjacent data and its
   * owner is entitled to withdraw it. Signatures already applied to signed
   * documents are untouched — those are the record of what happened, not a
   * setting. Succeeds, and is audited, even when nothing was stored.
   */
  deleteMySignature: User;
  deleteNotification: NotificationSuccessResponse;
  deleteSupportRole: Scalars['Boolean']['output'];
  deleteTailoringRule: ComplianceDeleteResponse;
  deleteTicket: Scalars['Boolean']['output'];
  disburseFacility: OfferRequest;
  dismissComplianceNotification: ComplianceDismissResponse;
  editMessage: Message;
  /**
   * Encrypt every value of the given metadata object individually. Returns an
   * object with the same keys whose values are base64-encoded AES-GCM ciphertext.
   * Reverse the operation with decryptMetadata.
   */
  encryptMetadata: Scalars['JSON']['output'];
  /** Lender extends the offer letter's acceptance deadline. */
  extendOfferLetterDeadline: OfferRequest;
  /**
   * Issuer — move the signing deadline out. Allowed at stage spa_issued while the
   * agreement is `awaiting_signatures` and the buyer has not signed; refused after
   * they have ("The buyer has already signed."), because the act the deadline
   * governs has happened.
   *
   * `newDeadline` must be today or later. Extending is allowed any number of times
   * and each one is recorded — a deadline the issuer can never move forces a
   * reissue of a document that has nothing wrong with it but its date.
   */
  extendSellerSpaDeadline: SellerFinancingTxn;
  /** Issuer — pushes the signing deadline out while signatures are outstanding. */
  extendSigningDeadline: CashPurchaseTxn;
  /** File a monthly Status Declaration. Computes totalOutstanding, supersedes the prior active filing for the period, and opens a 7-day cancellation window. On a schedule-driven loan only a closing filing (FullyRepaid or WrittenOff) is accepted. */
  fileDeclaration: StatusDeclaration;
  /**
   * Buyer pays the commitment deposit from their wallet into the Afram pool.
   * The phase opens when the money is HELD: stamps `openedAt`, starts the
   * seven-day clock → `awaiting_seller`. The leg is pending until the bank
   * confirms the transfer; the seller is notified FOR THE FIRST TIME then, and a
   * refusal closes the phase again.
   *
   * Refused when the wallet does not cover the deposit, or when another buyer has
   * already committed to the unit — before anything is taken.
   */
  fundApproachDeposit: SellerApproach;
  generateToken: Scalars['String']['output'];
  /** @deprecated Use grantAssessmentShare with counterpartyKind: financier. */
  grantAssessmentFinancierShare: Scalars['ID']['output'];
  /**
   * Share an assessment's conclusion with a counterparty.
   *
   * One mutation for every kind of counterparty, as the contract asked — an
   * issuer-specific pair would be the same call with one word changed, and the
   * third counterparty would make it three.
   *
   * The subject's own decision: gated on access to the assessment, so the subject
   * or a platform admin may grant, and nobody else. Idempotent per (assessment,
   * counterparty, kind) — granting again while a share is live returns the
   * existing id rather than stacking duplicates that each have to be revoked.
   *
   * ⚠ Confers the conclusion ONLY — see AssessmentOutput. Never the responses or
   * the documents behind it.
   */
  grantAssessmentShare: Scalars['ID']['output'];
  grantOfferRequest: OfferRequest;
  importAssessmentTemplate: AssessmentTemplate;
  /**
   * Spec §5.1 — creates the advisory pending deposit txn. Does NOT move money.
   *
   * `idempotencyKey` is optional: a UUID the client generates once per tap and
   * sends unchanged with every retry of that tap. A repeat returns the same
   * pending line instead of adding a second. Scoped to the caller — another
   * user's identical key never matches. 1–128 characters of `A–Z a–z 0–9 - _`;
   * anything else is refused (`INVALID_IDEMPOTENCY_KEY`).
   */
  initiateWalletDeposit: InitiateDepositResult;
  /**
   * Buyer — request_submitted → commitment_deposit_paid, in one call. Pays
   * depositAmount from the buyer's AFRAM wallet into the Afram pool: writes a
   * pending `in` escrow event (purpose `commitment_deposit`), moves the stage and
   * claims the unit in one commit, then starts the bank transfer. The leg becomes
   * `received` when the bank confirms; a refusal puts the stage back and lets the
   * unit go.
   *
   * The deposit is the first slice of the down payment — not a separate payment
   * to the issuer, and it nets off what is due at stage 10. Refused, before
   * anything is taken, when the listing asks for no deposit, when the wallet does
   * not cover it, when another buyer already holds the unit, when a leg is
   * already pending, or on a legacy deal where the issuer declares it instead.
   */
  instructCommitmentDeposit: SellerFinancingTxn;
  /**
   * Buyer — completion_conditions_confirmed → down_payment_funded, in one call.
   * Pays the OUTSTANDING down payment (purpose `down_payment`) — the agreed figure
   * less whatever the commitment deposit already put into escrow — from the
   * buyer's AFRAM wallet into the Afram pool. The pending `in` leg and the stage
   * move are one commit; the leg becomes `received` when the bank confirms, and a
   * refusal puts the stage back. A second instruct while one is pending is
   * refused.
   *
   * The one exception: when nothing is outstanding — the deposit covered the whole
   * agreed down payment — no leg is written and the stage advances straight to
   * down_payment_funded. Refusing there would strand the deal behind a button that
   * can only ever fail.
   */
  instructDownPayment: SellerFinancingTxn;
  /**
   * Issuer — at down_payment_funded, writes a pending `out` escrow event with
   * purpose `release_to_issuer` and transfers the money, net of the platform fee,
   * from the Afram pool to the issuing entity's verified payout account. The
   * stage moves to down_payment_released when the bank confirms the issuer has
   * been paid; a refusal leaves the money held and the release can be made again.
   *
   * Releases EVERY leg escrow is holding — the commitment deposit slice and the
   * stage-10 balance together, which is the agreed down payment. Releasing only
   * the stage-10 leg would strand the deposit in escrow on every deal.
   */
  instructDownPaymentRelease: SellerFinancingTxn;
  /**
   * Buyer — pays plan.optionFee from the buyer's wallet into the Afram pool:
   * completion_conditions_confirmed → option_fee_funded. The leg is `pending`
   * until the bank confirms the transfer; a refusal puts the stage back.
   */
  instructOptionFee: RentToBuyTxn;
  /**
   * Buyer — pays the reservation fee from the buyer's wallet into the Afram pool:
   * request_submitted → commitment_deposit_paid. The leg is `pending` until the
   * bank confirms the transfer; a refusal puts the stage back. Refused when the
   * wallet does not cover the fee, or while a payment is already pending.
   */
  instructReservationFee: RentToBuyTxn;
  inviteCompanyMember: EntityMember;
  /**
   * Issuer — issue a receipt over everything received so far. Refused while no
   * payment is on record.
   *
   * Lines come from confirmed escrow in-legs, one each, labelled from the leg's
   * purpose. Releases are never counted — that is the same money leaving. The
   * figures are snapshotted and never recomputed.
   */
  issueCashReceipt: CashPurchaseTxn;
  /**
   * Lender issues the discharge letter once the loan is fully repaid.
   *
   * Also records a `title_transferred` token event — discharge is the moment title
   * stops being security and becomes the borrower's outright, which is what makes
   * `titleTransfer.status` read `completed`.
   */
  issueDischarge: OfferRequest;
  /** Lender prepares and issues the loan agreement (→ LOAN_AGREEMENT_ISSUED), setting the signing deadline. */
  issueLoanAgreement: OfferRequest;
  /**
   * Lender issues the offer letter and sets the acceptance deadline.
   *
   * offerLetterUrl is required in practice: lenders draft their own offer letters
   * and Afram does not generate one, so issuing without a letter is rejected.
   * (Left nullable only so existing clients fail with a readable error rather than
   * a schema validation error; tighten to String! once callers are updated.)
   */
  issueOfferLetter: OfferRequest;
  /**
   * Vendor — serves the notice for the CURRENT defaultStep.
   *
   * Refused when defaultStep is `current`, or when a notice already exists at that
   * rung: a tenant with three "final warnings" has been told nothing.
   */
  issueRentDefaultNotice: RentToBuyTxn;
  /**
   * Issuer — DEPRECATED: upload + send in one call, kept for clients that have
   * not adopted the two-step ceremony. `typedSignature` is ignored — the issuer's
   * signature is now the countersignature, applied by
   * `countersignSaleAgreement`. → sale_agreement_pending, awaiting_signatures.
   * @deprecated Use uploadSaleAgreement + sendSaleAgreementToBuyer
   */
  issueSaleAgreement: CashPurchaseTxn;
  /**
   * Issuer — issue a receipt over everything received so far. Refused while no
   * payment is on record.
   *
   * Payments counted: the commitment-deposit declaration (issuer_declared) and
   * each escrow in-leg that has been received or settled (escrow_confirmed).
   * Releases are never counted — that is the same money leaving.
   *
   * The receipt is snapshotted immutably; its figures are never recomputed.
   */
  issueSellerReceipt: SellerFinancingTxn;
  /**
   * Either party logs a defect (item 2). The deal stops advancing until it is
   * resolved. Confirmations already given are left standing — a vendor who
   * confirmed the visit happened has not withdrawn that by logging a defect they
   * found at it.
   */
  logInspectionIssue: InspectionIssue;
  logRentInspectionIssue: InspectionIssue;
  logSellerInspectionIssue: InspectionIssue;
  login: AuthPayload;
  loginAframSearch: AuthPayload;
  loginSupportUser: SupportAuthPayload;
  /**
   * End this session by retiring its refresh token. Needs no bearer — holding the
   * refresh token is the authority — so it works after the access token has
   * expired. Always true. The session's access token is not revoked; it expires
   * within the hour, and the client should discard it now.
   */
  logout: Scalars['Boolean']['output'];
  /**
   * End every session the caller has, on every device, including the one making
   * this call: every access and refresh token already issued stops working.
   */
  logoutAllSessions: Scalars['Boolean']['output'];
  markAllNotificationsAsRead: MarkAllAsReadResponse;
  markAsPaid: Scalars['Boolean']['output'];
  /**
   * Issuer — terms_agreed → diligence_complete. Re-derives completeness from the
   * rows rather than trusting the caller: every item in both directions must be
   * accepted or waived, and an empty set is never complete.
   */
  markDiligenceComplete: CashPurchaseTxn;
  markNotificationAsRead: Notification;
  /** Phone. NO auth. Lights 'Phone connected' on the computer. Rate limited by IP. */
  markSelfieSessionOpened: Scalars['Boolean']['output'];
  /** Signed in: they've looked at it. Clears "Updated" on every device. Safe to call often. */
  markSupportRequestSeen: SupportRequest;
  nudgeFinancier: Scalars['Boolean']['output'];
  /**
   * The buyer reminds a silent seller (D90).
   *
   * Buyer only, and only while `awaiting_seller`. Refused before 48 hours have
   * passed since `openedAt`, and within 24 hours of the previous reminder — a
   * seller reminded the morning after being asked was given no time to answer, and
   * a reminder that can be sent on every refresh is one the seller learns to
   * ignore. Sets `lastNudgeAt` and notifies the seller.
   */
  nudgeSeller: SellerApproach;
  /** Computer. Auth required. `id` = base64url(SHA-256(key)). Never returns the photo. */
  openSelfieSession: SelfieSession;
  /**
   * Emergency stop: pause transfers of the property's token (pauser wallet).
   * Returns true if a transaction was sent, false if it was already paused.
   */
  pausePropertyToken: Scalars['Boolean']['output'];
  /**
   * Pay the commitment deposit from the caller's wallet cash balance.
   *
   * Debits the wallet, opens the escrow leg and advances the transaction
   * (request_submitted → commitment_deposit_paid), or fails whole. Refuses when
   * the cash balance does not cover the deposit in full — partial payment is not
   * supported, and the refusal names the shortfall so it can be shown as-is.
   *
   * No amount argument: the deposit is `depositAmount`, set from the unit price
   * when the purchase was placed. The figure charged comes back on `escrowEvent`.
   *
   * The stage moves at once; the leg stays `pending` until the bank confirms the
   * transfer into the Afram pool, and a refused transfer puts the stage back.
   */
  payCashDepositFromWallet: CashWalletPaymentResult;
  /**
   * Pay the outstanding purchase-price balance into escrow from the caller's
   * wallet cash balance. sale_agreement_signed → escrow_funded, or fails whole.
   *
   * Charges `unitPrice − cumulativeConfirmedReceipts`, never the full price
   * again and never `balanceDue` — what is owed is computed from what actually
   * cleared, so a deposit that came in short or over cannot make the server debit
   * the wrong number. Refuses on a shortfall, naming it. Partial payment is not
   * supported.
   *
   * As the deposit: the stage moves at once, and the leg stays `pending` until the
   * bank confirms the transfer into the Afram pool.
   */
  payCashEscrowBalanceFromWallet: CashWalletPaymentResult;
  /**
   * Pay a loan from the caller's wallet cash balance. Validates the amount
   * against the outstanding balance and the cash balance server-side, then sends
   * it as a bank transfer to the lender's payout account. When the bank confirms,
   * it is recorded on the schedule oldest-first (fees → interest → principal) and
   * counted against the filing.
   *
   * Overpayment is REJECTED, not capped — the error names the payable amount and
   * is safe to display verbatim. The caller must be the loan's borrower.
   */
  payLoan: PayLoanResult;
  /**
   * Buyer — pays settlement.amount from the wallet → option_exercised. Records
   * optionExercisedAt and settlement.paidAt. Refused when no settlement is set.
   */
  payRentSettlement: RentToBuyTxn;
  /** Buyer — idempotent per (buyer, property) while active. */
  placeCashPurchase: CashPurchaseTxn;
  /**
   * Buyer — creates the transaction at `request_submitted`, snapshots the
   * listing's published rent-to-buy terms and reservationFee, and creates the
   * RENT_TO_BUY offer request and the buyer–vendor conversation.
   *
   * Refused when the listing has `rentToBuyEnabled: false`. Idempotent per
   * (buyer, property) while a deal is active.
   */
  placeRentToBuyRequest: RentToBuyTxn;
  /**
   * Buyer places an approach on a unit. Creates it at `awaiting_payment`.
   *
   * No money moves, the seller is NOT notified and the listing stays available —
   * an approach nobody has paid for is not yet news. One live approach per
   * (buyer, property); placing again returns the one already open.
   */
  placeSellerApproach: SellerApproach;
  /**
   * Buyer — creates the transaction at `request_submitted`, plus the
   * SELLER_FINANCING offer request and the buyer–issuer conversation seeded with
   * the issuer's deposit transfer details. Snapshots the listing's published terms.
   * Idempotent per (buyer, property) while a deal is active. Refused when the
   * listing has seller financing disabled.
   */
  placeSellerFinancingRequest: SellerFinancingTxn;
  /**
   * Buyer — inspection_complete → withdrawal_window_closed. The last point at
   * which walking away is free, so it is a deliberate act rather than a timer.
   */
  proceedPastWithdrawalWindow: CashPurchaseTxn;
  /** Buyer — diligence_complete → withdrawal_window_closed. */
  proceedToRentTerms: RentToBuyTxn;
  /** Buyer — diligence_complete → withdrawal_window_closed. */
  proceedToSellerTerms: SellerFinancingTxn;
  /**
   * Vendor — commitment_deposit_paid → under_review.
   *
   * Refused unless the reservation fee leg is confirmed — the bank has confirmed
   * the transfer into the pool — before anyone spends time on the deal.
   */
  proceedWithRentRequest: RentToBuyTxn;
  /** Issuer — commitment_deposit_paid → under_review. Opens the diligence exchange. */
  proceedWithSellerRequest: SellerFinancingTxn;
  /**
   * Issuer — withdrawal_window_closed → payment_plan_proposed. Stores the inputs
   * verbatim, resolves downPaymentAmount (rounded to the cedi) and
   * financedAmount = unitPrice − downPaymentAmount, and updates downPaymentDue to
   * the resolved figure. Requires a credit decision that is not `declined`, a down
   * payment at or above the listing's published minimum, and a tenor within the
   * listing's published range.
   */
  proposePaymentPlan: SellerFinancingTxn;
  /**
   * Vendor — withdrawal_window_closed → rent_plan_proposed. The vendor may restate
   * unitPrice here.
   *
   * Refused when: no credit decision has been recorded ("Record your credit
   * decision on this buyer before proposing terms."); the decision was declined; or
   * any of monthlyRent, termMonths, buyPrice is <= 0.
   *
   * ⚠ NO band validation on rent, term, fee or buy price. These are the vendor's
   * commercial call and the platform does not price their property — the published
   * terms are a starting point for the builder, not a rule.
   */
  proposeRentPlan: RentToBuyTxn;
  publishAssessmentTemplate: Scalars['Boolean']['output'];
  publishPortfolioUnits: Scalars['Boolean']['output'];
  /** Requester — from `submitted` to `queried`, with a non-empty note. */
  queryCashDiligenceItem: CashPurchaseTxn;
  /** Requester — send it back with a question. submitted → queried. */
  queryDiligenceItem: SellerFinancingTxn;
  /** Requester — sends it back with a question. */
  queryRentDiligenceItem: RentToBuyTxn;
  reGenerateAccessToken: AuthPayload;
  reactivateAssessmentTemplate: Scalars['Boolean']['output'];
  reactivateCompanyMember: EntityMember;
  /**
   * The vendor records whether it happened — the end of the state machine the
   * contract named, and the no-show record it listed as missing.
   *
   * A fact about the appointment, not a penalty: nothing downstream reads it yet.
   */
  recordPropertyViewingOutcome: PropertyViewing;
  /**
   * Vendor — identical semantics to recordSellerCreditDecision: same type, same
   * validation, same "no score, no rating, no recommendation" rule.
   */
  recordRentCreditDecision: RentToBuyTxn;
  /**
   * Buyer — pays the EARLIEST outstanding month from the wallet and marks it paid.
   *
   * Oldest-first is the rule, not a convenience: a tenant must not be able to pay
   * the current month while a missed one sits behind it silently walking up the
   * ladder.
   *
   * ⚠ Writes no credit, equity or balance figure of any kind (§2.1).
   */
  recordRentPayment: RentToBuyTxn;
  /**
   * Issuer — recordable only at under_review, diligence_complete or
   * withdrawal_window_closed, and only while no decision exists. `note` is required
   * (>=10 chars) unless the outcome is `approved`. A `declined` outcome ends the
   * deal and returns the listing to market; `approved_with_conditions` does not
   * block terms — the conditions resurface at confirmCompletionConditions.
   */
  recordSellerCreditDecision: SellerFinancingTxn;
  /**
   * Financier files the figure the valuer came back with (→ RECEIVED).
   *
   * Requires an existing COMMISSIONED valuation: a report for a valuation nobody
   * ordered has no valuer to attribute it to and no instruction date, and the
   * shape says both are always present. `valuationAmount` must be above zero.
   */
  recordValuation: OfferRequest;
  reissueLoanAgreement: OfferRequest;
  /**
   * Issuer — voids the current document and both signatures and returns the
   * agreement to `draft` at sale_agreement_pending, so a corrected copy can be
   * uploaded and re-signed. The reason is kept permanently in the audit trail.
   * Rejected once settlement has begun (settlement_pending / closed).
   */
  reissueSaleAgreement: CashPurchaseTxn;
  rejectAssessmentDocument: Scalars['Boolean']['output'];
  rejectOfferRequest: Scalars['Boolean']['output'];
  /**
   * Issuer — releases the price from escrow to the issuing entity's payout
   * balance. completion_conditions_confirmed → funds_released, in one call.
   *
   * Money OUT: no wallet is debited, so `walletTxn` is null. Releases EVERYTHING
   * escrow is holding, deposit and balance together — they are both receipts
   * against the same price, and releasing only the balance would strand the
   * deposit on every deal. Net of the platform fee, per the admin-managed
   * schedule.
   *
   * Refused until the issuing ENTITY has a verified payout account on file: the
   * proceeds belong to the issuing company, and a personal account under the
   * signed-in user is not a substitute.
   */
  releaseCashPurchaseFunds: CashWalletPaymentResult;
  /**
   * Release the tranche against a completed milestone.
   *
   * Writes the milestone's release and the matching `disbursements` entry as ONE
   * write, and the milestone stores no release state of its own — so the tranche
   * and the milestone cannot disagree, then or later.
   *
   * Defaults to the milestone's `expectedAmount`. Pass `amount` to release a
   * different figure; the difference stays visible, because the disbursement
   * carries what moved and the milestone keeps what was planned.
   */
  releaseMilestone: OfferRequest;
  /**
   * Vendor — option_fee_funded → option_fee_released. Credits the vendor's wallet
   * net of platform fees.
   *
   * The fee is INCOME, not a liability against the sale (§2.3) — the posting
   * recognises revenue and creates no obligation. That is what makes this release
   * different in kind from seller financing's down-payment release, which hands
   * the vendor money credited against a purchase.
   */
  releaseOptionFee: RentToBuyTxn;
  /**
   * Release tokens from escrow to the buyer — writes a released_from_escrow token
   * event for the given amount (default: the remaining escrowed balance). Does not
   * itself close the loan; when fully released the client prompts issueDischarge.
   */
  releaseTokensToBuyer: TokenEvent;
  removeAssessmentAlertRule: Scalars['Boolean']['output'];
  removeAssessmentCategory: Scalars['Boolean']['output'];
  removeAssessmentDocument: Scalars['Boolean']['output'];
  removeAssessmentQuestionOption: Scalars['Boolean']['output'];
  removeAssessmentReadinessBand: Scalars['Boolean']['output'];
  removeAssessmentScoringBand: Scalars['Boolean']['output'];
  /**
   * A party removes their OWN upload, while the category is still open (D88).
   *
   * Own-upload-only, and open-only: these are identity papers and title deeds, so
   * a counterparty who could delete them could empty the evidence behind a request
   * they are about to accept — and once an item is accepted or waived, its
   * evidence is part of the record of that decision rather than the uploader's to
   * withdraw.
   *
   * Removing the last document does not walk the item back to `requested`: the
   * status is the requester's to move.
   */
  removeCashDiligenceDocument: CashPurchaseTxn;
  removeCompanyMember: Scalars['Boolean']['output'];
  /**
   * The uploader withdraws a document they attached.
   *
   * Own uploads only, and only while the category is open — an accepted or waived
   * item is a settled position, and the evidence behind that decision is not the
   * uploader's to withdraw afterwards.
   */
  removeDiligenceDocument: SellerFinancingTxn;
  removeDueDiligence: Scalars['Boolean']['output'];
  removeLand: Scalars['Boolean']['output'];
  removeLoan: Scalars['Boolean']['output'];
  removeOffer: Scalars['Boolean']['output'];
  /** Financier: remove a document request that has not yet been submitted */
  removeOfferDocumentRequest: Scalars['Boolean']['output'];
  removeOfferRequest: Scalars['Boolean']['output'];
  removePaymentSchedule: Scalars['Boolean']['output'];
  removePortfolio: Scalars['Boolean']['output'];
  removeProject: Scalars['Boolean']['output'];
  /** Remove a milestone. Refused once released — it would orphan the tranche paid against it. */
  removeProjectMilestone: OfferRequest;
  removeProperty: Scalars['Boolean']['output'];
  removeReaction: Message;
  /**
   * The uploader withdraws a document they attached.
   *
   * Own uploads only, and only while the category is open — an accepted or waived
   * item is a settled position, and the evidence behind that decision is not the
   * uploader's to withdraw afterwards.
   */
  removeRentDiligenceDocument: RentToBuyTxn;
  removeRepayment: Scalars['Boolean']['output'];
  removeReview: Scalars['Boolean']['output'];
  /** The draft's owner, or platform staff. */
  removeTempProject: Scalars['Boolean']['output'];
  removeTermSheet: Scalars['Boolean']['output'];
  removeTicketComment: Scalars['Boolean']['output'];
  removeTransaction: Scalars['Boolean']['output'];
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
  /**
   * Staff (support_request:reply). A public reply is the team's answer: the
   * first one starts the response clock, an open request moves to in_progress,
   * and the member is told in-app and by email (by email alone when they were
   * signed out). An internal note changes nothing the member sees.
   */
  replySupportRequest: SupportMessagePayload;
  /** Public. `success: false` carries a message to show as written. */
  requestAccess: RequestAccessResponse;
  /**
   * Open a category in the exchange (`not_requested` → `requested`).
   *
   * Both sides ask from a CLOSED list. The seller may ask only for `identity` and
   * `source_of_funds` — whether the buyer can carry the loan is the financier's
   * assessment, and a seller collecting payslips is doing the bank's job with none
   * of its duties. The buyer may ask for `title_documents`, `planning_permission`,
   * `encumbrances`, `company_registration` and `tax_status`.
   */
  requestApproachCategory: SellerApproach;
  /**
   * Requester — open a dormant category: not_requested → requested. The platform
   * never opens these; the party who needs the documents does.
   *
   * Requester-only on the item's own direction — opening a category is asking the
   * OTHER party for something.
   *
   * ⚠ The cash catalogue currently seeds every category `required`, so no cash
   * item is ever dormant and this has nothing to open yet. It exists so the
   * operation is there the moment an optional cash category is added.
   */
  requestCashDiligenceCategory: CashPurchaseTxn;
  /**
   * Either party — ask for something the catalogue never anticipated. The
   * direction derives from the caller, so the asker is its requester by
   * construction. Counts toward completion like any catalogue row, which means it
   * holds `markDiligenceComplete` open until it is answered, accepted or waived.
   */
  requestCustomCashDiligenceItem: CashPurchaseTxn;
  /**
   * Either party — ask for something the catalogue never anticipated. The
   * direction derives from the caller, so the asker is its requester by
   * construction. Counts toward completion like any catalogue row.
   */
  requestCustomDiligenceItem: SellerFinancingTxn;
  /**
   * Either party — ask for something the catalogue never anticipated. The
   * direction derives from the caller, so the asker is its requester by
   * construction. Counts toward completion like any catalogue row.
   */
  requestCustomRentDiligenceItem: RentToBuyTxn;
  /**
   * Ask a lender who has gone quiet to file an overdue declaration.
   *
   * Borrower-callable. The platform also runs this nightly against every loan in a
   * declarable status, on the SAME weekly clock — so pressing this after the sweep
   * has already chased will be refused with the wait, rather than landing a second
   * email on the lender.
   *
   * Refused when the lender is not actually late: declarations are monthly, a
   * lender is overdue 35 days after the period they last reported on, and a chase
   * sent before then is a false accusation made in Afram's voice. The advisory
   * "N days since last declared" display stays honest without it.
   */
  requestDeclarationUpdate: OfferRequest;
  /**
   * Requester — open an optional category: not_requested → requested. The platform
   * never opens these; the party who needs the documents does.
   */
  requestDiligenceCategory: SellerFinancingTxn;
  requestLoanAgreementChanges: OfferRequest;
  /** Financier: attach one or more document requests to an offer request */
  requestOfferDocuments: Array<OfferRequestDocument>;
  requestPasswordReset: Scalars['Boolean']['output'];
  requestPaymentVerification: Conversation;
  /**
   * Propose a time of your own.
   *
   * ⚠ A proposal that lands on a published slot is treated as a BOOKING, and goes
   * through the same contention. Without that, this would be the way around slot
   * contention: propose the exact time someone already booked, skip the index
   * because proposals carry no slot id, and two people arrive on the doorstep.
   *
   * Only a time outside every window is a genuine proposal — and that is refused
   * outright unless the vendor set `allowRequestsOutside`.
   */
  requestPropertyViewing: PropertyViewing;
  /**
   * Buyer — asks to complete early. Only during the tenancy
   * (occupancy_commenced / renting). Refused while a request is already pending.
   */
  requestRentBuyout: RentToBuyTxn;
  /** Either party — opens a dormant category. Requester only. */
  requestRentDiligenceCategory: RentToBuyTxn;
  /**
   * Buyer — opens a round on the UNSIGNED agreement.
   *
   * Refused when: the note is under 10 characters (max 600); the agreement is not
   * `sent`; another round is already open; or the buyer has already signed —
   * changing a signed document is a reissue, not a variation.
   */
  requestRentVariation: RentToBuyTxn;
  /**
   * Buyer — appends a variation round. Append-only: a second request never
   * overwrites the first. Refused when the note is under 10 or over 600 chars,
   * when a round is already open, before the agreement has been sent, after the
   * buyer has signed, or once executed.
   */
  requestSpaVariation: SellerFinancingTxn;
  /** Borrower asks the financier to revise the issued term sheet, with a message. */
  requestTermSheetChanges: OfferRequest;
  /**
   * Send payout balance to the owner's own verified payout account — a real bank
   * transfer. The line comes back `pending` until the bank confirms, then
   * `cleared` (or `failed`, with the balance restored).
   *
   * `ownerType: entity` withdraws the caller's active entity's payout balance to
   * the entity's payout account and needs the `wallet:withdraw` company
   * permission; it defaults to the caller's own. The destination is never taken
   * from the request.
   *
   * `idempotencyKey` is optional: a UUID the client generates once per tap and
   * sends unchanged with every retry of that tap — a timeout, a flaky
   * connection. A repeat returns the first withdrawal's line, whatever state it
   * has reached since, instead of starting a second or refusing with a 409.
   * Scoped to the wallet owner the request acts for (the caller, or their active
   * entity), so another owner's identical key never matches. 1–128 characters of
   * `A–Z a–z 0–9 - _`; anything else is refused (`INVALID_IDEMPOTENCY_KEY`).
   * Without it, every call is a new withdrawal, as before.
   */
  requestWalletWithdrawal: WalletTxn;
  resetPassword: Scalars['Boolean']['output'];
  /**
   * The logger accepts the remedy, or does not.
   *
   * `accepted: true` resolves it, and may be the event that finally advances the
   * stage if both parties had already confirmed and nothing else is open.
   *
   * ⚠ `accepted: false` escalates and STOPS. It does not cancel the deal, does not
   * move its status, and does not open a second termination route. The deal is
   * already sitting on withdrawal ground; if the buyer wants out, the existing
   * withdraw path is how.
   */
  resolveInspectionIssue: InspectionIssue;
  /**
   * Seller answers, while `awaiting_seller`. `outcome` is `accept` or `decline`.
   *
   * ACCEPT flips the listing to Under Offer, supersedes every competing live
   * approach on the unit (each of those deposits is returned in full), and opens
   * the three property-pack categories as `requested` → `accepted`.
   *
   * DECLINE returns the deposit and closes the approach → `declined`. The reason
   * is optional and is passed to the buyer word for word.
   */
  respondToApproach: SellerApproach;
  /**
   * The OTHER side proposes a remedy. Not the logger: proposing a remedy to your
   * own complaint and then accepting it would settle an issue single-handed.
   *
   * Allowed from `open`, `remedy_proposed` and `escalated` — a rejected remedy may
   * be answered with another, which is what keeps "remedy first" from collapsing
   * into "one shot, then withdraw". A new proposal replaces the previous one.
   */
  respondToInspectionIssue: InspectionIssue;
  retireAssessmentQuestion: Scalars['Boolean']['output'];
  retireAssessmentTemplate: Scalars['Boolean']['output'];
  returnAssessment: Scalars['Boolean']['output'];
  /**
   * Revalue a property: the valuation becomes its price (d19). On a tokenized
   * property this is the only way the price changes — updateProperty refuses a
   * direct edit — and the new valuation is recorded on the token in the
   * background (pricing wallet). Supply never changes; the price per token does.
   * Refused while a tokenization is in progress.
   */
  revalueProperty: Property;
  /** Financier: approve or reject submitted documents on an offer request */
  reviewOfferDocuments: Array<OfferRequestDocument>;
  /**
   * Financier revises one installment's amount or rate ahead of its due date —
   * a rate change — without restating the whole schedule. Edited in place: its
   * id, reference and due date are kept. Only an installment not yet being
   * collected, with nothing paid against it, can be revised; amend the schedule
   * for anything else. Its pending declaration is retired; within 7 days of the
   * due date a new one is issued already approved, otherwise the usual one is
   * generated later. The borrower is told the new figure and `reason`, which is
   * required. Revising to the same figures changes nothing. Refused while a
   * payment on the loan is still being confirmed by the bank.
   */
  reviseRepaymentInstallment: RepaymentInstallment;
  /** @deprecated Use revokeAssessmentShare. */
  revokeAssessmentFinancierShare: Scalars['Boolean']['output'];
  revokeAssessmentShare: Scalars['Boolean']['output'];
  revokeOffer: Scalars['Boolean']['output'];
  revokeOfferRequest: Scalars['Boolean']['output'];
  /**
   * Store (or replace) the signer's reusable signature — the mark offered back to
   * them the next time they sign something. The URL must be one issued by the
   * platform's own upload service.
   *
   * Writes to the caller's own account and no one else's; there is no argument to
   * name a user. Every save is written to the audit trail, because a stored
   * signature is reusable evidence of intent.
   */
  saveMySignature: User;
  /**
   * Save a step of onboarding without completing it.
   *
   * Merges over whatever is already stored rather than replacing it, so each step
   * writes its own fields and leaves the others alone; a client can send one step
   * or several. Values that are supplied are validated exactly as they would be at
   * completion, so a draft cannot quietly bank a malformed TIN or an expired ID
   * and surface it as a failure at the last step.
   */
  saveOnboardingProgress: OnboardingProgress;
  saveUserPolicy: UserPolicy;
  sendDuePaymentSubscriptionEmail: NotificationSuccessResponse;
  sendMessage: Message;
  sendMfaOtp: MfaOtpPayload;
  sendMfaOtpEmail: MfaOtpPayload;
  sendNotification: NotificationSuccessResponse;
  sendOtp: Scalars['Boolean']['output'];
  sendPaymentReminderEmail: NotificationSuccessResponse;
  sendPaymentSubscriptionEmail: NotificationSuccessResponse;
  sendPaymentTermsAcceptanceEmail: NotificationSuccessResponse;
  sendPaymentTermsConfirmationEmail: NotificationSuccessResponse;
  sendPaymentVerificationEmail: NotificationSuccessResponse;
  /** Vendor — draft → sent. Records rentAgreementSentAt and the deadline. */
  sendRentAgreement: RentToBuyTxn;
  /**
   * Remind a borrower whose loan the lender has declared to be in arrears.
   *
   * Financier only, and refused unless the latest active status declaration says
   * `InArrears` — a reminder is a statement about the borrower's account, and one
   * sent against a current loan is a false statement made in Afram's voice.
   *
   * The SERVER owns the pacing: the first reminder is held back for three days
   * after the arrears filing, and one per fortnight after that. A too-early call
   * is refused with a message naming the wait, which the UI can show as-is. Read
   * `lastRepaymentReminderAt` to disable the button before it gets that far.
   *
   * Note this is NOT `sendPaymentReminderEmail`, which is a generic transactional
   * sender taking a bare recipient — it has no loan, no borrower resolution and no
   * pacing, so wiring a repayment reminder to it would send an unrelated email.
   */
  sendRepaymentReminder: OfferRequest;
  sendRoleVerificationEmail: NotificationSuccessResponse;
  /**
   * Issuer — grants the buyer read + signature access, records the deadline and
   * notifies them. draft → awaiting_signatures.
   */
  sendSaleAgreementToBuyer: CashPurchaseTxn;
  /**
   * Issuer — draft → awaiting_signatures. Grants the buyer read + signature access
   * and notifies them.
   */
  sendSellerFinancingSpa: SellerFinancingTxn;
  sendWelcomeEmail: NotificationSuccessResponse;
  /**
   * Financier upserts a condition item / signs it off (CONFIRMED / WAIVED / PENDING).
   *
   * `phase` chooses the checklist. PRECEDENT may only be written while the
   * agreement is executed and CP is not yet confirmed — it gates disbursement, so
   * it closes when disbursement opens. SUBSEQUENT stays writable for the servicing
   * life of the loan, because several conditions subsequent cannot be satisfied
   * before drawdown and all of them survive closing.
   */
  setConditionPrecedentStatus: OfferRequest;
  /**
   * Compliance override (`verification:approve`). The only way out of FAILED or
   * UNVERIFIABLE. PENDING asks the verifier again. Written to the audit log with
   * the actor.
   */
  setIdentityVerification: User;
  /**
   * Set — or replace — where this owner gets paid. Issuers and financiers pass
   * `entity`; an individual withdrawing their own proceeds passes `user`.
   *
   * An upsert, because replacing the account is how a wrong one gets corrected:
   * two candidate destinations for one owner is a state the withdrawal path has no
   * way to choose between. Ids never come off the wire — `user` resolves to the
   * authenticated user and `entity` to the caller's active entity, so this can
   * only ever set the caller's own destination.
   *
   * Refused when the account number is not a plausible one, or when a name field
   * is blank; the messages are written for the person filling in the form.
   */
  setPayoutAccount: PayoutAccount;
  /**
   * Admin — publish a new rate for a fee type, superseding whatever was live.
   *
   * Omitted numbers default to zero, so a pure flat fee sends only `flatAmount`
   * and a pure percentage only `ratePct`. Setting both to zero is how a fee is
   * switched off — the row stays, charging nothing, which is auditable in a way
   * that deleting it would not be.
   */
  setPlatformFee: PlatformFeeSetting;
  /**
   * Add or edit a milestone on the schedule. Omit `input.id` to create.
   *
   * A released milestone is frozen: its plan is what the release was judged
   * against, so rewriting the expected amount afterwards would leave the record
   * claiming the tranche matched a figure nobody approved.
   */
  setProjectMilestone: OfferRequest;
  /**
   * Vendor — names the final figure to take title. Requires the deal to be
   * unlocked by either road (a served term, or an approved buyout). Refused when
   * amount <= 0. May be called again to revise while unpaid.
   *
   * ⚠ NEVER writes to plan.buyPrice (§2.5). The two figures answer two different
   * questions and both stay on the record.
   */
  setRentSettlement: RentToBuyTxn;
  /**
   * Staff (support_request:manage). The server stamps resolvedAt and closedAt and
   * tells the member. The same status again does nothing.
   */
  setSupportRequestStatus: SupportRequest;
  setSupportUserInitialPassword: SetSupportUserInitialPasswordPayload;
  setupMFA: MfaSetupPayload;
  /** Borrower signs the loan agreement (→ LOAN_AGREEMENT_BORROWER_SIGNED), attaching their signed copy. */
  signAsBorrower: OfferRequest;
  /** Lender countersigns to execute the loan agreement (→ LOAN_AGREEMENT_SIGNED), attaching the executed copy. */
  signAsLender: OfferRequest;
  /**
   * Buyer — records buyerSignature, signing as Tenant. Does NOT execute the
   * agreement and does NOT move the stage; only the vendor's countersignature
   * does. Permitted while the buyer's own variation round is open (§2.8).
   */
  signRentAgreement: RentToBuyTxn;
  /**
   * Buyer — signs first. Records the signature and the signed copy; it does NOT
   * execute the agreement. The stage stays `sale_agreement_pending` until the
   * issuer countersigns.
   *
   * `signedCopyUrl` is optional only so a client that has not yet wired the
   * upload keeps working; send it whenever you have it.
   *
   * `typedSignature` stays required whatever route the buyer took: a drawn mark is
   * the mark, but the name behind it is still what the agreement is executed in.
   */
  signSaleAgreement: CashPurchaseTxn;
  /**
   * Buyer — signs FIRST. Records the signature only: this does NOT execute the
   * agreement and the stage stays `spa_issued`.
   *
   * Signing is allowed even while the buyer's own variation round is open — the UI
   * holds, the server must not block — and an open round survives untouched.
   */
  signSellerFinancingSpa: SellerFinancingTxn;
  signup: AuthPayload;
  /**
   * Vendor — occupancy_commenced → renting. Generates the schedule: termMonths
   * payments of monthlyRent, anchored to occupancyStartedAt.
   */
  startRentSchedule: RentToBuyTxn;
  /** Responder supplies documents. Submissions accumulate rather than replace. */
  submitApproachDocuments: SellerApproach;
  submitAssessment: Scalars['Boolean']['output'];
  /** Borrower raises a declaration-review / formal request to the financier. */
  submitBorrowerLoanRequest: BorrowerLoanRequest;
  /**
   * Responder — attach documents. Partial responses accumulate rather than
   * replace, and a fresh upload clears any outstanding query. At least one
   * document is required.
   */
  submitCashDiligenceDocuments: CashPurchaseTxn;
  /** Responsible party uploads evidence for a condition item (→ SUBMITTED). */
  submitConditionPrecedentEvidence: OfferRequest;
  /**
   * Responder — supply documents. Allowed from `requested`, `queried` or
   * `submitted`: partial responses accumulate rather than replace, and a fresh
   * upload is what answers a query, so it clears the outstanding one.
   */
  submitDiligenceDocuments: SellerFinancingTxn;
  /** Buyer: upload documents in response to the requests on an offer request */
  submitOfferDocuments: Array<OfferRequestDocument>;
  /**
   * The responder supplies documents. Partial responses accumulate rather than
   * replace, and a fresh upload is what answers a query — so the query note is
   * cleared here.
   */
  submitRentDiligenceDocuments: RentToBuyTxn;
  /**
   * Phone. NO auth. A data URL, at most ~2.5 MB decoded; JPEG, PNG or WebP, and
   * the bytes must match the declared type. Refused with SELFIE_DELIVERED if the
   * session already has its photo, SELFIE_CLOSED if it is closed or expired,
   * SELFIE_TOO_LARGE over the cap. Rate limited by IP.
   */
  submitSelfie: Scalars['Boolean']['output'];
  /**
   * PUBLIC. Start a request without an account. Turnstile verified first; 5 per
   * hour per IP and 10 per day per reply email (RATE_LIMITED). Returns only the
   * reference. A receipt goes to the reply email.
   */
  submitSupportRequest: SubmitSupportRequestPayload;
  subscribeToPushNotification: NotificationSuccessResponse;
  suspendCompanyMember: EntityMember;
  /**
   * Run the tailoring process for an entity: re-evaluates active rules and
   * rewrites the entity's required document set.
   */
  tailorEntity: EntityRequirementsResponse;
  /**
   * Vendor — refused unless defaultStep is `termination`. Sets status
   * `terminated` and terminationReason, and returns the listing to market.
   *
   * ⚠ NOTHING IS RETURNED. Rent was rent: no refund calculation, no termination
   * fee, no equity to release. The status and the reason are the whole settlement,
   * and the tenant's right to buy ends with the tenancy.
   */
  terminateRentTenancy: RentToBuyTxn;
  toggleOfferFavorite: Scalars['Boolean']['output'];
  togglePropertyFavorite: ToggleFavoriteResult;
  toggleSuspendUser: ToggleSuspendPayload;
  /**
   * Deploy the property's token and mint its whole supply to the issuer. The
   * issuer's wallet is the owning entity's, found on the server (d17); supply is
   * the property's price (d18). Both are permanent.
   */
  tokenizeProperty: Scalars['Boolean']['output'];
  /**
   * Vendor — option_exercised → title_transferred. Records titleTransferredAt.
   *
   * Does NOT close the deal (§2.7). Only the buyer's acknowledgement does.
   */
  transferTitle: RentToBuyTxn;
  unassignTicket: Ticket;
  /** Resume transfers of a paused property token. False if it was not paused. */
  unpausePropertyToken: Scalars['Boolean']['output'];
  updateAssessment: Scalars['Boolean']['output'];
  updateAssessmentAlertRule: Scalars['Boolean']['output'];
  updateAssessmentCategory: Scalars['Boolean']['output'];
  updateAssessmentDocument: Scalars['Boolean']['output'];
  updateAssessmentQuestion: Scalars['Boolean']['output'];
  updateAssessmentQuestionOption: Scalars['Boolean']['output'];
  updateAssessmentReadinessBand: Scalars['Boolean']['output'];
  updateAssessmentScoringBand: Scalars['Boolean']['output'];
  updateAssessmentTemplate: Scalars['Boolean']['output'];
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
  updateConversationPayment: Scalars['Boolean']['output'];
  updateDueDiligence: Scalars['Boolean']['output'];
  updateMemberRole: EntityMember;
  updateOffer: Scalars['Boolean']['output'];
  /** Financier: edit a pending document request (name / description / deadline) */
  updateOfferDocumentRequest: OfferRequestDocument;
  updateOfferRequest: Scalars['Boolean']['output'];
  updatePaymentSchedule: Scalars['Boolean']['output'];
  updatePortfolio: Scalars['Boolean']['output'];
  updateProject: Scalars['Boolean']['output'];
  updateProperty: Scalars['Boolean']['output'];
  updateRepayment: Scalars['Boolean']['output'];
  updateRepaymentScheduleStatus: Scalars['Boolean']['output'];
  updateReview: Scalars['Boolean']['output'];
  updateSupportLastSeen: Scalars['Boolean']['output'];
  updateSupportRole: SupportRole;
  updateTailoringRule: TailoringRuleResponse;
  updateTempProject: Scalars['Boolean']['output'];
  /**
   * `id` is the session id. The draft's owner may set pending, processing,
   * failed or cancelled; only platform staff may set paid — nothing on the server
   * confirms the listing fee yet, so a client cannot attest to its own payment.
   */
  updateTempProjectPaymentStatus: Scalars['Boolean']['output'];
  updateTermSheet: TermSheet;
  updateTicketStatus: Ticket;
  updateTransaction: Scalars['Boolean']['output'];
  /**
   * The seller hands over the sale agreement (D93).
   *
   * Seller only, once the approach is `accepted` or `converted`. The lender wants
   * to see what is being bought before assessing the application, so the SPA
   * cannot wait for the signing table.
   *
   * Uploading the same `kind` again REPLACES the file rather than adding a second
   * one — the buyer must never have to pick between two versions.
   */
  uploadApproachDocument: SellerApproach;
  /**
   * Issuer — attach an annex, the invoice, or their own receipt file. Allowed from
   * `request_submitted`: the invoice is the demand for the very deposit the buyer
   * is being asked for at stage 1, and gating uploads on money having moved would
   * put the bill after the payment.
   *
   * `spa_annex` requires a label and is append-only. `invoice` must be a PDF and
   * there is only ever one — a new upload replaces it. `receipt` must be a PDF,
   * takes an optional label, and is append-only: it never replaces anything and
   * never touches `receipts`.
   */
  uploadCashTransactionDocument: CashPurchaseTxn;
  /** User: upload a compliance document against a template */
  uploadComplianceDocument: ComplianceUploadResponse;
  /**
   * Issuer — uploads the final disclosure at `funds_released`. Not a stage move:
   * it is the document `completeTitleTransfer` is gated on, which is why it is
   * recorded separately. Re-uploading replaces it.
   */
  uploadFinalDisclosure: CashPurchaseTxn;
  /**
   * Vendor — the agreement's three legal states in one mutation.
   *
   * First call at rent_plan_accepted → rent_agreement_issued, status `draft`,
   * version 1, vendor-only visibility. While `draft`: replaces the document. While
   * `sent` with an open round and no signatures: this IS the revision — it
   * resolves the round (`revised`, documentVersion n+1), bumps the version,
   * returns the agreement to `draft`, and VOIDS signingDeadline so the vendor must
   * re-send.
   *
   * Refused once any signature exists.
   */
  uploadRentAgreement: RentToBuyTxn;
  /**
   * Vendor only — files a receipt / invoice / annex against the deal. `label` is
   * REQUIRED for an annex.
   */
  uploadRentTransactionDocument: RentToBuyTxn;
  /**
   * Issuer — uploads or replaces the unsigned SPA. Issuer-only visibility: the
   * document stays `draft` until `sendSaleAgreementToBuyer`. The first upload
   * advances deposit_verified → sale_agreement_pending; a replacement is allowed
   * while the status is still `draft`.
   */
  uploadSaleAgreement: CashPurchaseTxn;
  /**
   * Issuer — three legal states, one mutation:
   *
   * 1. At payment_plan_accepted, the first upload advances the stage to
   *    `spa_issued` with status `draft` and version 1. A draft is issuer-only.
   * 2. While `draft`, it replaces the document with no version bump.
   * 3. While `awaiting_signatures` with an open variation round and no signatures,
   *    it is the revision that answers the round: the round resolves as `revised`,
   *    the version bumps, the agreement returns to `draft` and the old signing
   *    deadline is voided — the issuer must send again.
   *
   * Refused while awaiting_signatures with no open round, once any signature
   * exists, or once executed.
   */
  uploadSellerFinancingSpa: SellerFinancingTxn;
  /**
   * Issuer — attach an annex, the invoice, or the issuer's own receipt file.
   * Allowed from `request_submitted` onward: the records panel is on screen from
   * stage 1, and the invoice is the demand for the very deposit the buyer is being
   * asked for there.
   *
   * `spa_annex` requires a label and is append-only — many per deal.
   * `invoice` must be a PDF and there is only ever one: a new upload replaces the
   * previous.
   * `receipt` must be a PDF, takes an optional label saying what it covers, and is
   * append-only — it never replaces anything and never touches the receipts in
   * `receipts`, which AFRAM builds and stands behind.
   */
  uploadSellerTransactionDocument: SellerFinancingTxn;
  uploadTransferDocument: Message;
  upsertAssessmentResponse: Scalars['ID']['output'];
  /** Public. False when the temporary password does not match; an error when the link is not usable. */
  verifyAccessInvite: Scalars['Boolean']['output'];
  verifyAssessmentDocument: Scalars['Boolean']['output'];
  /** Independent review flips a disbursement to VERIFIED or UNVERIFIABLE. */
  verifyDisbursement: OfferRequest;
  verifyEmail: Scalars['Boolean']['output'];
  /** Second leg of an MFA login: exchange the emailed OTP for a session. */
  verifyLoginOtp: AuthPayload;
  verifyMfaOtp: MfaVerifyPayload;
  verifyRequestedRole: RoleVerifiedPayload;
  verifyUser: Scalars['Boolean']['output'];
  votePoll: Message;
  /**
   * Requester lets a category go. Only the requester may waive — waiving your own
   * obligation would let either side settle an item by declining to satisfy it.
   */
  waiveApproachItem: SellerApproach;
  /**
   * Requester only — waiving your OWN obligation must not settle it. A reason is
   * required and kept permanently.
   */
  waiveCashDiligenceItem: CashPurchaseTxn;
  /**
   * Requester only — let an item go, with a reason on the record.
   *
   * Requester-only is the safeguard: waiving your own obligation would let either
   * party settle an item by simply declining to satisfy it.
   */
  waiveDiligenceItem: SellerFinancingTxn;
  waiveDocumentRequest: OfferRequest;
  /**
   * Buyer only — waive the inspection and take the property as it stands
   * (items 1 and 4).
   *
   * `acknowledgement` is the exact wording the buyer was shown, and is required:
   * an unrecorded waiver is the failure mode this exists to prevent. Refused while
   * an issue is open — a buyer cannot waive an inspection they have already used
   * to log a defect, which would reach `inspection_complete` over an unresolved
   * issue by the back door.
   */
  waiveInspection: CashPurchaseTxn;
  /**
   * Requester — lets an item go. Requester-only: waiving your own obligation
   * would let either side settle an item by declining to satisfy it.
   */
  waiveRentDiligenceItem: RentToBuyTxn;
  waiveRentInspection: RentToBuyTxn;
  /**
   * Financier waives what is left on a loan's installments — after a write-off,
   * or for money settled outside Afram. Omit `installmentIds` to waive every
   * installment still owing; pass ids to waive just those (an empty list is
   * refused). Only installments still owing can be waived: one partly paid keeps
   * what was paid and only its remainder is waived. `reason` is required and is
   * recorded on each installment. Declarations generated from a waived
   * installment are retired, so nothing is collected against it.
   *
   * Allowed while the loan is in repayment or its discharge has been issued (a
   * written-off loan's unpaid installments are what hold its discharge up), not
   * once it is closed. Refused while a payment on the loan is still being
   * confirmed by the bank. Returns the loan's installments after the waiver.
   */
  waiveRepaymentInstallments: Array<RepaymentInstallment>;
  waiveSellerInspection: SellerFinancingTxn;
  /** Buyer walks, any time before conversion. Deposit returned → `withdrawn`. */
  withdrawApproach: SellerApproach;
  /**
   * Either party — ends the deal inside the withdrawal window (any stage up to
   * and including `inspection_complete`).
   *
   * Money held in escrow goes back to the buyer in full, as a transfer from the
   * Afram pool to their wallet account once the withdrawal commits. Refused while
   * a wallet payment is still on its way into the pool, and once any money has
   * been released to the issuer.
   */
  withdrawDeal: CashPurchaseTxn;
  /**
   * Either party — only at `diligence_complete`. Sets status `withdrawn`, returns
   * the listing to market and returns any confirmed escrow to the payer.
   *
   * Offered nowhere else: after this point the rent agreement governs and the exit
   * is termination, not withdrawal.
   */
  withdrawRentToBuy: RentToBuyTxn;
  /**
   * Either party — allowed anywhere inside the withdrawal window: any stage up to
   * and including `withdrawal_window_closed`. Ends the deal, notifies the other
   * party and returns the listing to market. The reason is required and kept in
   * the audit trail.
   *
   * Escrowed money comes back (§9). Every `in` leg held in the Afram pool is
   * transferred back to the buyer's wallet account and reads `returned`, with a
   * reason naming who withdrew and why, once the bank confirms. Refused while a
   * payment is still on its way into the pool. Money already released to the issuer is never clawed back —
   * that is governed by the agreement, and this mutation refuses.
   *
   * Receipts issued before the withdrawal stay on the record untouched. An
   * immutable receipt does not un-happen.
   */
  withdrawSellerFinancing: SellerFinancingTxn;
};


export type MutationAcceptApproachItemArgs = {
  approachId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
};


export type MutationAcceptCashDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationAcceptCompanyInviteArgs = {
  token: Scalars['String']['input'];
};


export type MutationAcceptDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationAcceptOfferArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationAcceptOfferLetterArgs = {
  offerRequestId: Scalars['ID']['input'];
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
  signedDocumentUrl?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAcceptPaymentPlanArgs = {
  acknowledgedTerms: Scalars['Boolean']['input'];
  transactionId: Scalars['ID']['input'];
  typedSignature: Scalars['String']['input'];
};


export type MutationAcceptRentDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationAcceptRentPlanArgs = {
  acknowledgedTerms: Scalars['Boolean']['input'];
  transactionId: Scalars['ID']['input'];
  typedSignature: Scalars['String']['input'];
};


export type MutationAcceptTermsSheetArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationAcknowledgeBorrowerLoanRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAcknowledgeTitleReceiptArgs = {
  transactionId: Scalars['ID']['input'];
  typedName: Scalars['String']['input'];
};


export type MutationActivateAccountArgs = {
  newPassword: Scalars['String']['input'];
  temporaryPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationActivateAssessmentArgs = {
  id: Scalars['ID']['input'];
  officerId: Scalars['ID']['input'];
  officerNotes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAddAttachmentCommentArgs = {
  attachmentId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationAddMyTicketCommentArgs = {
  body: Scalars['String']['input'];
  ticketId: Scalars['ID']['input'];
};


export type MutationAddParticipantArgs = {
  input: AddParticipantInput;
};


export type MutationAddReactionArgs = {
  emoji: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationAddReplyArgs = {
  content: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationAddSupportMessageArgs = {
  input: AddSupportMessageInput;
};


export type MutationAddTicketCommentArgs = {
  body: Scalars['String']['input'];
  ticketId: Scalars['ID']['input'];
};


export type MutationAddUserForPushArgs = {
  input: AddUserForPushInput;
};


export type MutationAgreeTermsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationAmendRepaymentScheduleArgs = {
  gracePeriodDays?: InputMaybe<Scalars['Int']['input']>;
  offerRequestId: Scalars['ID']['input'];
  schedule: Array<ScheduledInstallmentInput>;
};


export type MutationApproveAccessRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveScheduledDeclarationArgs = {
  declarationId: Scalars['ID']['input'];
};


export type MutationApproveUserVerificationArgs = {
  role: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationArchiveAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAssignSupportRequestArgs = {
  input: AssignSupportRequestInput;
};


export type MutationAssignSupportRoleArgs = {
  supportRoleId: Scalars['ID']['input'];
  supportUserId: Scalars['Int']['input'];
};


export type MutationAssignTicketArgs = {
  supportUserId: Scalars['Int']['input'];
  ticketId: Scalars['ID']['input'];
};


export type MutationAttachAssessmentDocumentFileArgs = {
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationBeginLoanDeclarationArgs = {
  gracePeriodDays: Scalars['Int']['input'];
  offerRequestId: Scalars['ID']['input'];
  schedule: Array<ScheduledInstallmentInput>;
};


export type MutationBeginOfficerReviewArgs = {
  id: Scalars['ID']['input'];
  officerId: Scalars['ID']['input'];
};


export type MutationBeginRequestReviewArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationBookPropertyViewingArgs = {
  note?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
  slotId: Scalars['String']['input'];
};


export type MutationBulkCreatePreTokenizedUnitsArgs = {
  pretokenizedUnits: Array<PreTokenizedUnitInput>;
};


export type MutationBulkUpdatePreTokenizedUnitsByTypeArgs = {
  portfolioId: Scalars['ID']['input'];
  pretokenizedUnits: Array<PreTokenizedUnitUpdateInput>;
  unitType: Scalars['String']['input'];
};


export type MutationCancelDeclarationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelPropertyViewingArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  viewingId: Scalars['ID']['input'];
};


export type MutationCheckLandArgs = {
  input: CheckLandInput;
};


export type MutationCloseSelfieSessionArgs = {
  key: Scalars['String']['input'];
};


export type MutationCommenceRepaymentArgs = {
  gracePeriodDays: Scalars['Int']['input'];
  schedule: Array<ScheduledInstallmentInput>;
  transactionId: Scalars['ID']['input'];
};


export type MutationCommissionValuationArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  valuerName: Scalars['String']['input'];
};


export type MutationCompleteFinancingAssessmentArgs = {
  allocatedAmount?: InputMaybe<Scalars['Float']['input']>;
  allocationNote?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationCompleteOnboardingArgs = {
  input?: InputMaybe<CompleteOnboardingInput>;
};


export type MutationCompleteRentDueDiligenceArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationCompleteSellerDueDiligenceArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationCompleteTitleTransferArgs = {
  reference?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationComputeAssessmentScoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmCashCompletionConditionsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmCompletionConditionsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmConditionsPrecedentArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationConfirmHandoverArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmInspectionArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmRentCompletionConditionsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmRentFullyPaidArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmRentInspectionArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmSellerInspectionArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationConfirmSupportResolutionArgs = {
  input: ConfirmSupportResolutionInput;
};


export type MutationConfirmTitleSettledArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationContactUsArgs = {
  input: ContactUsInput;
};


export type MutationConvertSellerApproachArgs = {
  approachId: Scalars['ID']['input'];
  offerRequestIds: Array<Scalars['ID']['input']>;
};


export type MutationCountersignOfferLetterArgs = {
  offerRequestId: Scalars['ID']['input'];
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
  signedDocumentUrl?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCountersignRentAgreementArgs = {
  signedCopyUrl?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationCountersignSaleAgreementArgs = {
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
  signedCopyUrl?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationCountersignSellerFinancingSpaArgs = {
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
  signedCopyUrl?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
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
  listingType: Scalars['String']['input'];
  projectType: Scalars['String']['input'];
  sessionId?: InputMaybe<Scalars['String']['input']>;
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


export type MutationCreateSupportRequestArgs = {
  input: CreateSupportRequestInput;
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


export type MutationDecidePropertyViewingArgs = {
  accept: Scalars['Boolean']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  viewingId: Scalars['ID']['input'];
};


export type MutationDecideRentBuyoutArgs = {
  approve: Scalars['Boolean']['input'];
  declineReason?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationDeclareCommitmentDepositArgs = {
  bankReference: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationDeclineAccessRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeclineOfferLetterArgs = {
  offerRequestId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeclineRentVariationArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
  variationId: Scalars['ID']['input'];
};


export type MutationDeclineSpaVariationArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
  variationId: Scalars['ID']['input'];
};


export type MutationDecryptMetadataArgs = {
  metadata: Scalars['JSON']['input'];
};


export type MutationDeleteCompanyRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteComplianceSectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteComplianceTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMessageArgs = {
  forEveryone?: InputMaybe<Scalars['Boolean']['input']>;
  messageId: Scalars['ID']['input'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSupportRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTailoringRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type MutationDisburseFacilityArgs = {
  input: DisburseFacilityInput;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationDismissComplianceNotificationArgs = {
  id: Scalars['ID']['input'];
  roleType: ComplianceRoleType;
};


export type MutationEditMessageArgs = {
  content: Scalars['JSONObject']['input'];
  messageId: Scalars['ID']['input'];
};


export type MutationEncryptMetadataArgs = {
  metadata: Scalars['JSON']['input'];
};


export type MutationExtendOfferLetterDeadlineArgs = {
  newDeadline: Scalars['DateTime']['input'];
  offerRequestId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationExtendSellerSpaDeadlineArgs = {
  newDeadline: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationExtendSigningDeadlineArgs = {
  newDeadline: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationFileDeclarationArgs = {
  input: FileDeclarationInput;
};


export type MutationFundApproachDepositArgs = {
  approachId: Scalars['ID']['input'];
};


export type MutationGenerateTokenArgs = {
  email: Scalars['String']['input'];
};


export type MutationGrantAssessmentFinancierShareArgs = {
  input: GrantAssessmentFinancierShareInput;
};


export type MutationGrantAssessmentShareArgs = {
  input: GrantAssessmentShareInput;
};


export type MutationGrantOfferRequestArgs = {
  input: GrantOfferRequestInput;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationImportAssessmentTemplateArgs = {
  input: ImportAssessmentTemplateInput;
};


export type MutationInitiateWalletDepositArgs = {
  amount: Scalars['Float']['input'];
  idempotencyKey?: InputMaybe<Scalars['String']['input']>;
};


export type MutationInstructCommitmentDepositArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationInstructDownPaymentArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationInstructDownPaymentReleaseArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationInstructOptionFeeArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationInstructReservationFeeArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationInviteCompanyMemberArgs = {
  input: InviteCompanyMemberInput;
};


export type MutationIssueCashReceiptArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationIssueDischargeArgs = {
  dischargeLetterUrl: Scalars['String']['input'];
  offerRequestId: Scalars['ID']['input'];
  titleTransferTxRef?: InputMaybe<Scalars['String']['input']>;
};


export type MutationIssueLoanAgreementArgs = {
  loanDocumentUrl: Scalars['String']['input'];
  offerRequestId: Scalars['ID']['input'];
  signingDeadline?: InputMaybe<Scalars['DateTime']['input']>;
};


export type MutationIssueOfferLetterArgs = {
  acceptanceDeadline?: InputMaybe<Scalars['DateTime']['input']>;
  offerLetterUrl?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationIssueRentDefaultNoticeArgs = {
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationIssueSaleAgreementArgs = {
  documentUrl: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
  typedSignature?: InputMaybe<Scalars['String']['input']>;
};


export type MutationIssueSellerReceiptArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationLogInspectionIssueArgs = {
  detail?: InputMaybe<Scalars['String']['input']>;
  summary: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationLogRentInspectionIssueArgs = {
  detail?: InputMaybe<Scalars['String']['input']>;
  summary: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationLogSellerInspectionIssueArgs = {
  detail?: InputMaybe<Scalars['String']['input']>;
  summary: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginAframSearchArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginSupportUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationMarkAsPaidArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationMarkDiligenceCompleteArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkSelfieSessionOpenedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkSupportRequestSeenArgs = {
  input: MarkSupportRequestSeenInput;
};


export type MutationNudgeFinancierArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationNudgeSellerArgs = {
  approachId: Scalars['ID']['input'];
};


export type MutationOpenSelfieSessionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPausePropertyTokenArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationPayCashDepositFromWalletArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationPayCashEscrowBalanceFromWalletArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationPayLoanArgs = {
  input: PayLoanInput;
};


export type MutationPayRentSettlementArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationPlaceCashPurchaseArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationPlaceRentToBuyRequestArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationPlaceSellerApproachArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationPlaceSellerFinancingRequestArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationProceedPastWithdrawalWindowArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationProceedToRentTermsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationProceedToSellerTermsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationProceedWithRentRequestArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationProceedWithSellerRequestArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationProposePaymentPlanArgs = {
  downPaymentMode: Scalars['String']['input'];
  downPaymentValue: Scalars['Float']['input'];
  interestRatePct: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  repaymentFrequency: Scalars['String']['input'];
  tenorMonths: Scalars['Int']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationProposeRentPlanArgs = {
  buyPrice: Scalars['Float']['input'];
  insurance: Scalars['String']['input'];
  maintenance: Scalars['String']['input'];
  monthlyRent: Scalars['Float']['input'];
  optionFee: Scalars['Float']['input'];
  termMonths: Scalars['Int']['input'];
  transactionId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
};


export type MutationPublishAssessmentTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPublishPortfolioUnitsArgs = {
  portfolioId: Scalars['ID']['input'];
  unitIds: Array<Scalars['ID']['input']>;
};


export type MutationQueryCashDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  note: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationQueryDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  note: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationQueryRentDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  note: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationReGenerateAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationReactivateAssessmentTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReactivateCompanyMemberArgs = {
  memberId: Scalars['ID']['input'];
};


export type MutationRecordPropertyViewingOutcomeArgs = {
  attended: Scalars['Boolean']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  viewingId: Scalars['ID']['input'];
};


export type MutationRecordRentCreditDecisionArgs = {
  basis: Array<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  outcome: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRecordRentPaymentArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationRecordSellerCreditDecisionArgs = {
  basis: Array<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  outcome: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRecordValuationArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  valuationAmount: Scalars['Float']['input'];
};


export type MutationReissueLoanAgreementArgs = {
  offerRequestId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationReissueSaleAgreementArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRejectAssessmentDocumentArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  verifiedBy: Scalars['ID']['input'];
};


export type MutationRejectOfferRequestArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationReleaseCashPurchaseFundsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationReleaseMilestoneArgs = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  milestoneId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationReleaseOptionFeeArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationReleaseTokensToBuyerArgs = {
  input: ReleaseTokensToBuyerInput;
};


export type MutationRemoveAssessmentAlertRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAssessmentCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAssessmentDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAssessmentQuestionOptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAssessmentReadinessBandArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAssessmentScoringBandArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveCashDiligenceDocumentArgs = {
  documentId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRemoveCompanyMemberArgs = {
  memberId: Scalars['ID']['input'];
};


export type MutationRemoveDiligenceDocumentArgs = {
  documentId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRemoveDueDiligenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveLandArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveLoanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveOfferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveOfferDocumentRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveOfferRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemovePaymentScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemovePortfolioArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveProjectMilestoneArgs = {
  milestoneId: Scalars['ID']['input'];
  offerRequestId: Scalars['ID']['input'];
};


export type MutationRemovePropertyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveReactionArgs = {
  messageId: Scalars['ID']['input'];
};


export type MutationRemoveRentDiligenceDocumentArgs = {
  documentId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRemoveRepaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveReviewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTempProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTermSheetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTicketCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationRemoveTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReplayWalletProvisioningArgs = {
  currency?: InputMaybe<Scalars['String']['input']>;
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  ownerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationReplySupportRequestArgs = {
  input: ReplySupportRequestInput;
};


export type MutationRequestAccessArgs = {
  input: RequestAccessInput;
};


export type MutationRequestApproachCategoryArgs = {
  approachId: Scalars['ID']['input'];
  categoryId: Scalars['String']['input'];
};


export type MutationRequestCashDiligenceCategoryArgs = {
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestCustomCashDiligenceItemArgs = {
  label: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestCustomDiligenceItemArgs = {
  label: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestCustomRentDiligenceItemArgs = {
  label: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestDeclarationUpdateArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationRequestDiligenceCategoryArgs = {
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestLoanAgreementChangesArgs = {
  offerRequestId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRequestOfferDocumentsArgs = {
  documents: Array<DocumentRequestItem>;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationRequestPaymentVerificationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type MutationRequestPropertyViewingArgs = {
  note?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
  proposedAt: Scalars['DateTime']['input'];
};


export type MutationRequestRentBuyoutArgs = {
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestRentDiligenceCategoryArgs = {
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestRentVariationArgs = {
  note: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestSpaVariationArgs = {
  note: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationRequestTermSheetChangesArgs = {
  message: Scalars['String']['input'];
  offerRequestId: Scalars['ID']['input'];
};


export type MutationRequestWalletWithdrawalArgs = {
  amount: Scalars['Float']['input'];
  idempotencyKey?: InputMaybe<Scalars['String']['input']>;
  ownerType?: InputMaybe<PayoutAccountOwner>;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationResolveInspectionIssueArgs = {
  accepted: Scalars['Boolean']['input'];
  issueId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRespondToApproachArgs = {
  approachId: Scalars['ID']['input'];
  outcome: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRespondToInspectionIssueArgs = {
  byDate?: InputMaybe<Scalars['Date']['input']>;
  issueId: Scalars['ID']['input'];
  remedy: Scalars['String']['input'];
};


export type MutationRetireAssessmentQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRetireAssessmentTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReturnAssessmentArgs = {
  id: Scalars['ID']['input'];
  officerId: Scalars['ID']['input'];
  officerNotes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRevaluePropertyArgs = {
  input: RevaluePropertyInput;
  propertyId: Scalars['ID']['input'];
};


export type MutationReviewOfferDocumentsArgs = {
  documents: Array<ReviewOfferDocumentItem>;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationReviseRepaymentInstallmentArgs = {
  installmentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  revision: InstallmentRevisionInput;
};


export type MutationRevokeAssessmentFinancierShareArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeAssessmentShareArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeOfferArgs = {
  financierId: Scalars['ID']['input'];
  offerId: Scalars['ID']['input'];
};


export type MutationRevokeOfferRequestArgs = {
  financierId: Scalars['ID']['input'];
  offerRequestId: Scalars['ID']['input'];
};


export type MutationSaveMySignatureArgs = {
  signatureImageUrl: Scalars['String']['input'];
};


export type MutationSaveOnboardingProgressArgs = {
  currentStep?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<CompleteOnboardingInput>;
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
  userId: Scalars['ID']['input'];
};


export type MutationSendMfaOtpEmailArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
};


export type MutationSendOtpArgs = {
  email: Scalars['String']['input'];
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


export type MutationSendRentAgreementArgs = {
  signingDeadline?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationSendRepaymentReminderArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type MutationSendRoleVerificationEmailArgs = {
  input: EmailRecipientInput;
};


export type MutationSendSaleAgreementToBuyerArgs = {
  signingDeadline?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationSendSellerFinancingSpaArgs = {
  signingDeadline?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationSendWelcomeEmailArgs = {
  input: EmailRecipientInput;
};


export type MutationSetConditionPrecedentStatusArgs = {
  input: ConditionPrecedentStatusInput;
  offerRequestId: Scalars['ID']['input'];
  phase?: InputMaybe<ConditionPhase>;
};


export type MutationSetIdentityVerificationArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  status: IdentityVerificationStatus;
  userId: Scalars['ID']['input'];
};


export type MutationSetPayoutAccountArgs = {
  input: PayoutAccountInput;
  ownerType: PayoutAccountOwner;
};


export type MutationSetPlatformFeeArgs = {
  currency?: InputMaybe<Scalars['String']['input']>;
  feeType: Scalars['String']['input'];
  flatAmount?: InputMaybe<Scalars['Float']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  ratePct?: InputMaybe<Scalars['Float']['input']>;
};


export type MutationSetProjectMilestoneArgs = {
  input: ProjectMilestoneInput;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationSetRentSettlementArgs = {
  amount: Scalars['Float']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationSetSupportRequestStatusArgs = {
  input: SetSupportRequestStatusInput;
};


export type MutationSetSupportUserInitialPasswordArgs = {
  input: SetSupportUserInitialPasswordInput;
};


export type MutationSetupMfaArgs = {
  enabled: Scalars['Boolean']['input'];
};


export type MutationSignAsBorrowerArgs = {
  loanDocumentUrl?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
};


export type MutationSignAsLenderArgs = {
  loanDocumentUrl?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
};


export type MutationSignRentAgreementArgs = {
  acknowledgedTerms: Scalars['Boolean']['input'];
  signedCopyUrl?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
  typedSignature: Scalars['String']['input'];
};


export type MutationSignSaleAgreementArgs = {
  acknowledgedTerms: Scalars['Boolean']['input'];
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
  signedCopyUrl?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
  typedSignature: Scalars['String']['input'];
};


export type MutationSignSellerFinancingSpaArgs = {
  acknowledgedTerms: Scalars['Boolean']['input'];
  signatureImageUrl?: InputMaybe<Scalars['String']['input']>;
  signatureKind?: InputMaybe<SignatureKind>;
  signedCopyUrl?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
  typedSignature: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationStartRentScheduleArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationSubmitApproachDocumentsArgs = {
  approachId: Scalars['ID']['input'];
  documents: Array<ApproachDocumentInput>;
  itemId: Scalars['ID']['input'];
};


export type MutationSubmitAssessmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitBorrowerLoanRequestArgs = {
  input: SubmitBorrowerLoanRequestInput;
};


export type MutationSubmitCashDiligenceDocumentsArgs = {
  documents: Array<DiligenceDocumentUpload>;
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationSubmitConditionPrecedentEvidenceArgs = {
  conditionId: Scalars['ID']['input'];
  offerRequestId: Scalars['ID']['input'];
  phase?: InputMaybe<ConditionPhase>;
  supportingDocumentName?: InputMaybe<Scalars['String']['input']>;
  supportingDocumentUrl: Scalars['String']['input'];
};


export type MutationSubmitDiligenceDocumentsArgs = {
  documents: Array<DiligenceDocumentInput>;
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationSubmitOfferDocumentsArgs = {
  documents: Array<SubmitOfferDocumentItem>;
  offerRequestId: Scalars['ID']['input'];
};


export type MutationSubmitRentDiligenceDocumentsArgs = {
  documents: Array<DiligenceDocumentInput>;
  itemId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationSubmitSelfieArgs = {
  id: Scalars['ID']['input'];
  image: Scalars['String']['input'];
};


export type MutationSubmitSupportRequestArgs = {
  input: SubmitSupportRequestInput;
};


export type MutationSubscribeToPushNotificationArgs = {
  input: SubscribeToPushInput;
};


export type MutationSuspendCompanyMemberArgs = {
  memberId: Scalars['ID']['input'];
};


export type MutationTailorEntityArgs = {
  entityId: Scalars['ID']['input'];
};


export type MutationTerminateRentTenancyArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationToggleOfferFavoriteArgs = {
  entityId: Scalars['ID']['input'];
};


export type MutationTogglePropertyFavoriteArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationToggleSuspendUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationTokenizePropertyArgs = {
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  uri: Scalars['String']['input'];
};


export type MutationTransferTitleArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationUnassignTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type MutationUnpausePropertyTokenArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationUpdateAssessmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentInput;
};


export type MutationUpdateAssessmentAlertRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentAlertRuleInput;
};


export type MutationUpdateAssessmentCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentCategoryInput;
};


export type MutationUpdateAssessmentDocumentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentDocumentInput;
};


export type MutationUpdateAssessmentQuestionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentQuestionInput;
};


export type MutationUpdateAssessmentQuestionOptionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentQuestionOptionInput;
};


export type MutationUpdateAssessmentReadinessBandArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentReadinessBandInput;
};


export type MutationUpdateAssessmentScoringBandArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentScoringBandInput;
};


export type MutationUpdateAssessmentTemplateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssessmentTemplateInput;
};


export type MutationUpdateCompanyRoleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEntityRoleInput;
};


export type MutationUpdateComplianceSectionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateComplianceSectionInput;
};


export type MutationUpdateComplianceSubmissionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateComplianceSubmissionInput;
};


export type MutationUpdateComplianceTemplateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateComplianceTemplateInput;
};


export type MutationUpdateConversationArgs = {
  input: UpdateConversationInput;
};


export type MutationUpdateConversationPaymentArgs = {
  conversationId: Scalars['ID']['input'];
  paymentStatus: ConversationPaymentStatus;
};


export type MutationUpdateDueDiligenceArgs = {
  input: UpdateDueDiligenceInput;
};


export type MutationUpdateMemberRoleArgs = {
  entityRoleId: Scalars['ID']['input'];
  memberId: Scalars['ID']['input'];
};


export type MutationUpdateOfferArgs = {
  input: UpdateOfferInput;
};


export type MutationUpdateOfferDocumentRequestArgs = {
  id: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
  input: ProjectInput;
};


export type MutationUpdatePropertyArgs = {
  id: Scalars['ID']['input'];
  input: PropertyInput;
};


export type MutationUpdateRepaymentArgs = {
  input: UpdateRepaymentInput;
};


export type MutationUpdateRepaymentScheduleStatusArgs = {
  id: Scalars['ID']['input'];
  refNo: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


export type MutationUpdateSupportRoleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSupportRoleInput;
};


export type MutationUpdateTailoringRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTailoringRuleInput;
};


export type MutationUpdateTempProjectArgs = {
  input: UpdateTempProjectInput;
};


export type MutationUpdateTempProjectPaymentStatusArgs = {
  id: Scalars['ID']['input'];
  paymentStatus: Scalars['String']['input'];
};


export type MutationUpdateTermSheetArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTermSheetInput;
};


export type MutationUpdateTicketStatusArgs = {
  status: TicketStatus;
  ticketId: Scalars['ID']['input'];
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};


export type MutationUploadApproachDocumentArgs = {
  approachId: Scalars['ID']['input'];
  documentUrl: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  kind: Scalars['String']['input'];
};


export type MutationUploadCashTransactionDocumentArgs = {
  documentUrl: Scalars['String']['input'];
  fileName?: InputMaybe<Scalars['String']['input']>;
  kind: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadComplianceDocumentArgs = {
  input: UploadComplianceDocumentInput;
};


export type MutationUploadFinalDisclosureArgs = {
  documentUrl: Scalars['String']['input'];
  fileName?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadRentAgreementArgs = {
  documentUrl: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadRentTransactionDocumentArgs = {
  documentUrl: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  kind: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadSaleAgreementArgs = {
  documentUrl: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadSellerFinancingSpaArgs = {
  documentUrl: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadSellerTransactionDocumentArgs = {
  documentUrl: Scalars['String']['input'];
  kind: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};


export type MutationUploadTransferDocumentArgs = {
  conversationId: Scalars['ID']['input'];
  transferDoc: Scalars['String']['input'];
};


export type MutationUpsertAssessmentResponseArgs = {
  input: UpsertAssessmentResponseInput;
};


export type MutationVerifyAccessInviteArgs = {
  temporaryPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationVerifyAssessmentDocumentArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  verifiedBy: Scalars['ID']['input'];
};


export type MutationVerifyDisbursementArgs = {
  disbursementId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  status: DisbursementVerificationStatus;
};


export type MutationVerifyEmailArgs = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};


export type MutationVerifyLoginOtpArgs = {
  otp: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationVerifyMfaOtpArgs = {
  otp: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationVerifyRequestedRoleArgs = {
  role: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationVerifyUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationVotePollArgs = {
  messageId: Scalars['ID']['input'];
  optionIndex: Scalars['Int']['input'];
};


export type MutationWaiveApproachItemArgs = {
  approachId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationWaiveCashDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWaiveDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWaiveDocumentRequestArgs = {
  offerRequestId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationWaiveInspectionArgs = {
  acknowledgement: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWaiveRentDiligenceItemArgs = {
  itemId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWaiveRentInspectionArgs = {
  acknowledgement: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWaiveRepaymentInstallmentsArgs = {
  installmentIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  offerRequestId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationWaiveSellerInspectionArgs = {
  acknowledgement: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWithdrawApproachArgs = {
  approachId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationWithdrawDealArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWithdrawRentToBuyArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationWithdrawSellerFinancingArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};

/** A member's thread is read one ticket at a time: `ticketId: { eq }` is required. */
export type MyTicketCommentFilter = {
  ticketId: IdOperator;
};

export type NftStatus =
  /** The latest attempt failed. An admin can call tokenizeProperty again. */
  | 'failed'
  /** Deployed, with the whole supply minted to the issuer. */
  | 'minted'
  /** Never queued for tokenization. */
  | 'none'
  /** Queued; the token is being deployed and minted. */
  | 'pending';

export type Notification = {
  __typename?: 'Notification';
  archivedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  readAt?: Maybe<Scalars['String']['output']>;
  recipientId: Scalars['String']['output'];
  references?: Maybe<NotificationReferences>;
  senderId?: Maybe<Scalars['String']['output']>;
  senderName?: Maybe<Scalars['String']['output']>;
  senderType?: Maybe<SenderType>;
  templateType?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type?: Maybe<NotificationType>;
  updatedAt: Scalars['String']['output'];
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
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  pushToken?: InputMaybe<Scalars['String']['input']>;
};

export type NotificationReferences = {
  __typename?: 'NotificationReferences';
  projectId?: Maybe<Scalars['String']['output']>;
  propertyId?: Maybe<Scalars['String']['output']>;
  roomId?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type NotificationSuccessResponse = {
  __typename?: 'NotificationSuccessResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type NotificationType =
  | 'asset_division'
  | 'interest'
  | 'message'
  | 'nft'
  | 'offer'
  | 'payment_confirmation'
  | 'project_update'
  | 'repayment_terms_acceptance'
  | 'repayment_terms_update'
  | 'system'
  | 'transaction';

export type NotificationTypeOperator = {
  eq?: InputMaybe<NotificationType>;
  in?: InputMaybe<Array<NotificationType>>;
};

export type NumberOperator = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
};

export type NumberRange = {
  end: Scalars['Float']['input'];
  start: Scalars['Float']['input'];
};

export type Offer = {
  __typename?: 'Offer';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  availabilityPeriodDays?: Maybe<Scalars['Int']['output']>;
  bondSubType?: Maybe<BondSubType>;
  commitmentFeeRate?: Maybe<Scalars['Float']['output']>;
  conditions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  covenants?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  depositPercentage?: Maybe<Scalars['Float']['output']>;
  drawdownSchedule?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  dsraMonths?: Maybe<Scalars['Int']['output']>;
  financier?: Maybe<Entity>;
  financierId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  interestRate?: Maybe<Scalars['JSONObject']['output']>;
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  lenderName?: Maybe<Scalars['String']['output']>;
  loanAgreementUrl?: Maybe<Scalars['String']['output']>;
  loanSubType?: Maybe<LoanSubType>;
  loanTenor?: Maybe<Scalars['JSONObject']['output']>;
  loanType?: Maybe<LoanType>;
  ltv?: Maybe<Scalars['Float']['output']>;
  maxLoanAmount?: Maybe<Scalars['Float']['output']>;
  moratorium?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  offerExpiryDate?: Maybe<Scalars['DateTime']['output']>;
  offerLetterUrl?: Maybe<Scalars['String']['output']>;
  offerRequest?: Maybe<OfferRequest>;
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  offerStatus?: Maybe<OfferStatus>;
  otherFees?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  processingTimeline?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  propertyName?: Maybe<Scalars['String']['output']>;
  rateType?: Maybe<RateType>;
  recipient?: Maybe<User>;
  recipientId?: Maybe<Scalars['ID']['output']>;
  repaymentFrequency?: Maybe<RepaymentFrequency>;
  repaymentType?: Maybe<RepaymentType>;
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  schedule?: Maybe<Scalars['JSONObject']['output']>;
  security?: Maybe<Scalars['JSONObject']['output']>;
  sources?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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
  __typename?: 'OfferLetter';
  /** Acceptance deadline the lender set when issuing (see extendOfferLetterDeadline). */
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  interestRatePct?: Maybe<Scalars['Float']['output']>;
  /** When the lender issued the offer letter. */
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  loanAmount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tenorMonths?: Maybe<Scalars['Int']['output']>;
};

export type OfferRequest = {
  __typename?: 'OfferRequest';
  /**
   * What underwriting decided the lender will actually advance (D76). Null or
   * equal to `requestedAmount` on a full approval; the allocated figure on a
   * partial one.
   *
   * This is the canonical money figure from the assessment onwards — the term
   * sheet principal, the offer letter, the loan agreement and disbursement all
   * read it in preference to `requestedAmount`.
   */
  agreedAmount?: Maybe<Scalars['Float']['output']>;
  /**
   * Why the lender advanced less than was asked for. Visible to the borrower, and
   * required whenever there is a shortfall — null on full approvals.
   */
  allocationNote?: Maybe<Scalars['String']['output']>;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  buyer?: Maybe<User>;
  buyerId?: Maybe<Scalars['ID']['output']>;
  /** The pre-disbursement checklist. Every item must be CONFIRMED or WAIVED before the facility can be drawn. */
  conditionsPrecedent: Array<ConditionPrecedent>;
  /**
   * The post-closing checklist (stages 12+), in the same item shape.
   *
   * Never gates disbursement — that is what makes it subsequent. Read it exactly
   * as `conditionsPrecedent` is read; the satisfied count is the number of items
   * whose status is CONFIRMED or WAIVED.
   */
  conditionsSubsequent: Array<ConditionPrecedent>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  disbursements: Array<DisbursementRecord>;
  /** Document requests raised on this offer request, in request order. Lets the /offers list show per-request document progress in one query. */
  documents: Array<OfferRequestDocument>;
  financier?: Maybe<Entity>;
  financierId?: Maybe<Scalars['ID']['output']>;
  financingAssessmentNotes?: Maybe<Scalars['String']['output']>;
  grantedOffer?: Maybe<Offer>;
  id: Scalars['ID']['output'];
  initialDeposit?: Maybe<Scalars['Float']['output']>;
  issuer?: Maybe<Entity>;
  issuerId?: Maybe<Scalars['ID']['output']>;
  /**
   * When this loan's lender was last asked to file an overdue declaration, or null
   * if never.
   *
   * Read it to disable the control and say why. ONE clock covers both callers —
   * the borrower pressing it and the nightly platform sweep write the same stamp —
   * so a lender cannot be chased twice in a week by two mechanisms that each
   * assumed they were the only one.
   */
  lastDeclarationNudgeAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * When the lender last sent this borrower a repayment reminder, or null if never.
   *
   * Read it to disable the reminder button and say why: the server owns the
   * pacing (see `sendRepaymentReminder`) and will refuse a too-early second
   * reminder, and firing a request that is going to be refused is a worse
   * experience than a button that explains itself.
   */
  lastRepaymentReminderAt?: Maybe<Scalars['DateTime']['output']>;
  /** The issued loan agreement and its signing clock. Null until issueLoanAgreement runs. */
  loanAgreement?: Maybe<LoanAgreement>;
  /** Both parties' signatures on the loan agreement (borrower signs, lender countersigns). */
  loanAgreementSignatures: DocumentSignatures;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  modeOfFinancing?: Maybe<ModeOfFinancing>;
  offer?: Maybe<Scalars['JSONObject']['output']>;
  offerLetter?: Maybe<OfferLetter>;
  /** Both parties' signatures on the offer letter (borrower signs, lender countersigns). */
  offerLetterSignatures: DocumentSignatures;
  paymentStatus?: Maybe<OfferRequestPaymentStatus>;
  /**
   * What the seller-approval phase produced, frozen when the approach converted.
   *
   * Null on requests that did not come through an approach — an issuer borrowing
   * against their own stock has no separate seller and no phase — and null to
   * anyone who is not a party to this request. The equity figure and the seller's
   * acceptance date are commercially meaningful: they go to the lender
   * underwriting THIS sale, not to every financier on the platform.
   */
  preApproval?: Maybe<PreApprovalFile>;
  /**
   * The construction milestone schedule for an issuer project loan, with each
   * milestone's release state folded in from the disbursements.
   *
   * Empty on a loan with no milestone schedule, which is most of them — tranche
   * disbursement applies to project loans, not to every facility.
   */
  projectMilestones: Array<ProjectMilestone>;
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  requestStatus?: Maybe<OfferRequestStatus>;
  requestedAmount: Scalars['Float']['output'];
  /**
   * The deal's stage history, oldest first — what happened, when, and by whom.
   *
   * Empty on a request that moved before the log existed. The stepper's fallback
   * copy already handles that, which is why no backfill was run: a fabricated
   * history is worse than an admitted gap.
   */
  stageEvents: Array<StageEvent>;
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
  /**
   * Discharge / title-transfer state, summarised from the token-event stream.
   *
   * Always present — a loan that has not started transferring reads `pending`
   * rather than null, so the panel can render "coming next" without having to
   * distinguish "not started" from "not implemented".
   */
  titleTransfer: TitleTransfer;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * The independent site valuation, or null when none has been commissioned.
   *
   * Null on every mode but ISSUER_LOAN_FINANCING, where it is also null until the
   * financier commissions one — absent means "not started", and there is no third
   * state to distinguish the two.
   */
  valuation?: Maybe<Valuation>;
};

export type OfferRequestDocument = {
  __typename?: 'OfferRequestDocument';
  acceptedFileTypes: Array<Scalars['String']['output']>;
  count?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documentCode?: Maybe<Scalars['String']['output']>;
  /** @deprecated First file only — use files. */
  documentUrl?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  /** @deprecated First file only — use files. */
  fileName?: Maybe<Scalars['String']['output']>;
  /** Every file uploaded for this request. Always populated for reads (a legacy single-file row yields one element). */
  files: Array<OfferRequestDocumentFile>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  offerRequest?: Maybe<OfferRequest>;
  offerRequestId: Scalars['ID']['output'];
  requestedBy?: Maybe<Entity>;
  requestedByEntityId: Scalars['ID']['output'];
  required: Scalars['Boolean']['output'];
  reviewedAt?: Maybe<Scalars['DateTime']['output']>;
  reviewerNotes?: Maybe<Scalars['String']['output']>;
  /**
   * Set when the platform answered this request from documents it already held —
   * `listing`, `portfolio`, `approach` or `compliance`. Null on every row the borrower filled
   * in themselves.
   *
   * ⚠ Check this before labelling `files` as the applicant's submission. A
   * pre-filled row carries the ISSUER's documents, not the borrower's, and
   * presenting them as the applicant's evidence is the exact defect AFR-149 had to
   * clean up.
   */
  source?: Maybe<Scalars['String']['output']>;
  /** One line saying where a pre-filled file came from. Null otherwise. */
  sourceNote?: Maybe<Scalars['String']['output']>;
  status: OfferRequestDocumentStatus;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
  submitterNotes?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** One uploaded file for a document request (a single front/back/month slot). */
export type OfferRequestDocumentFile = {
  __typename?: 'OfferRequestDocumentFile';
  documentUrl: Scalars['String']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  /** Human label for the slot this file fills — "Front", "Back", "Month 1"… */
  slotLabel?: Maybe<Scalars['String']['output']>;
};

export type OfferRequestDocumentFilter = {
  id?: InputMaybe<IdOperator>;
  offerRequestId?: InputMaybe<IdOperator>;
  requestedByEntityId?: InputMaybe<IdOperator>;
  status?: InputMaybe<OfferRequestDocumentStatus>;
};

export type OfferRequestDocumentStatus =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED'
  | 'SUBMITTED';

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

export type OfferRequestPaymentStatus =
  | 'PAID'
  | 'PENDING';

export type OfferRequestStatus =
  | 'ACCEPTED'
  | 'APPROVED'
  | 'CLOSED'
  | 'CONDITIONS_PRECEDENT_CONFIRMED'
  | 'CREDIT_ASSESSMENT'
  | 'DISBURSED'
  | 'DISCHARGE_ISSUED'
  | 'DOCUMENTS_REQUESTED'
  | 'DOCUMENTS_SUBMITTED'
  /**
   * Retired 2026-08-04 with the pre-staged short path. Kept so historical rows
   * still read back — nothing writes these any more. A deal that was mid-flight on
   * the short path was migrated onto the staged path by migration 20260804120000.
   */
  | 'GRANTED'
  | 'LOAN_AGREEMENT_BORROWER_SIGNED'
  | 'LOAN_AGREEMENT_ISSUED'
  | 'LOAN_AGREEMENT_SIGNED'
  | 'OFFER_LETTER_ACCEPTED'
  | 'OFFER_LETTER_BORROWER_SIGNED'
  | 'OFFER_LETTER_DECLINED'
  | 'OFFER_LETTER_ISSUED'
  | 'PENDING'
  | 'REJECTED'
  | 'REPAYING'
  | 'REVOKED'
  | 'TERMSHEET_ACCEPTED'
  | 'TERMSHEET_GENERATION'
  | 'TERMSHEET_ISSUED'
  | 'UNDER_REVIEW';

export type OfferStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REVOKED';

/**
 * A half-finished onboarding, held server-side (AFR-167).
 *
 * The wizard used to keep everything in the browser and tell the server nothing
 * until the final step, so logging out — or switching device, or a refresh at the
 * wrong moment — threw the lot away and started the user over. `data` is the same
 * shape as CompleteOnboardingInput; it accumulates as the wizard goes, and is
 * dropped once onboarding actually completes.
 */
export type OnboardingProgress = {
  __typename?: 'OnboardingProgress';
  /**
   * Where the wizard was, in the client's own vocabulary. The server stores this
   * and does not interpret it: which steps exist, and what they are called, is the
   * form's business and changes with it.
   */
  currentStep?: Maybe<Scalars['String']['output']>;
  /** Everything saved so far, merged across every step submitted. */
  data: Scalars['JSON']['output'];
  /** When the draft was last written. Null when nothing has been saved yet. */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Pagination = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ParticipantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  pic: Scalars['String']['input'];
  role: Scalars['String']['input'];
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type PayLoanInput = {
  /** Major units (GHS), matching the modal's input. */
  amount: Scalars['Float']['input'];
  /** The loan anchor — the same id the loan queries use. */
  offerRequestId: Scalars['ID']['input'];
  source: LoanPaymentSource;
};

export type PayLoanResult = {
  __typename?: 'PayLoanResult';
  /**
   * The Stream-2 payment row created on the loan. It counts against the filing
   * once the bank confirms the transfer to the lender — at once on a same-bank
   * transfer, within minutes on an interbank one.
   */
  payment: Payment;
  /**
   * Where the filing stands after this payment — Unpaid / PartiallyPaid /
   * Settled. The declaration itself is untouched; this is Afram's own record of
   * what it collected against it.
   */
  settlementStatus?: Maybe<DeclarationSettlementStatus>;
  /** The payment-kind wallet transaction: `pending` while the bank confirms, then `cleared` (or `failed`). */
  walletTxn?: Maybe<WalletTxn>;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency: Scalars['String']['output'];
  externalRefNo?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ledgerTransactionId?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  receivedAt: Scalars['DateTime']['output'];
  source: Scalars['String']['output'];
};

export type PaymentApplication = {
  __typename?: 'PaymentApplication';
  amountFees: Scalars['String']['output'];
  amountInterest: Scalars['String']['output'];
  amountPrincipal: Scalars['String']['output'];
  appliedAt: Scalars['DateTime']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  direction: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  installmentId: Scalars['ID']['output'];
  paymentId: Scalars['ID']['output'];
  reversedByApplicationId?: Maybe<Scalars['ID']['output']>;
  reversesApplicationId?: Maybe<Scalars['ID']['output']>;
};

/**
 * Stream 2 — a payment the loan actually received (never merged with
 * declarations). Projected from `payments`, the ledger's record of money that
 * moved; a payment is attributed to a loan through the filing it settled.
 */
export type PaymentEvent = {
  __typename?: 'PaymentEvent';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  loanId?: Maybe<Scalars['ID']['output']>;
  offerRequestId: Scalars['ID']['output'];
  paymentDate: Scalars['DateTime']['output'];
  /**
   * Confirmed once the payment has posted to the ledger; PendingSettlement while
   * it is recorded but unapplied; Reversed once every allocation it made has been
   * reversed.
   */
  paymentStatus: PaymentEventStatus;
  /** The provider that moved the money. Null when it moved inside Afram. */
  pspName?: Maybe<Scalars['String']['output']>;
  /** External provider reference, when there is one. Null for a wallet payment. */
  pspReference?: Maybe<Scalars['String']['output']>;
  railType: PaymentRail;
  recordedAt: Scalars['DateTime']['output'];
  /**
   * Always null. A reversal is recorded against the payment's allocations, not as
   * a second payment — kept for client compatibility.
   */
  reversalOf?: Maybe<Scalars['ID']['output']>;
  /** The Status Declaration this payment settled against. */
  statusDeclarationId?: Maybe<Scalars['ID']['output']>;
};

export type PaymentEventStatus =
  | 'Confirmed'
  | 'Failed'
  | 'PendingSettlement'
  | 'Reversed';

export type PaymentRail =
  /** Paid from the borrower's Afram wallet — no external provider involved. */
  | 'AframWallet'
  | 'BankTransfer'
  | 'Manual'
  | 'MobileMoney';

export type PaymentSchedule = {
  __typename?: 'PaymentSchedule';
  /** The borrower this schedule was drawn up for. */
  buyerId?: Maybe<Scalars['ID']['output']>;
  /** Their full name, or their email where no name is set. */
  buyerName?: Maybe<Scalars['String']['output']>;
  conversationId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['ID']['output']>;
  createdForId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  interestRate?: Maybe<Scalars['Float']['output']>;
  interestRateBps?: Maybe<Scalars['Int']['output']>;
  interestRateKind?: Maybe<Scalars['String']['output']>;
  loanId?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  principalMinor?: Maybe<Scalars['String']['output']>;
  /** The unit this schedule is against. Falls back to the offer request's. */
  propertyId?: Maybe<Scalars['ID']['output']>;
  /** Resolved from the property. Null where the schedule names no unit. */
  propertyName?: Maybe<Scalars['String']['output']>;
  repaymentFrequency?: Maybe<Scalars['String']['output']>;
  repaymentTerms?: Maybe<Scalars['JSONObject']['output']>;
  scheduleType?: Maybe<Scalars['String']['output']>;
  totalInterestMinor?: Maybe<Scalars['String']['output']>;
  totalRepaymentMinor?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/**
 * One scheduled payment, as the buyer's and issuer's payment sections read it.
 *
 * A projection of the servicing record (`RepaymentInstallment`), not the record
 * itself: amounts in major units rather than minor, and three states rather than
 * seven. `installmentStatus` carries the underlying state for anything that needs
 * the distinction back.
 */
export type PaymentScheduleEntry = {
  __typename?: 'PaymentScheduleEntry';
  /** Major units — the servicing record stores minor. */
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  dueDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /**
   * The underlying servicing state — scheduled | due | paid_partial | paid_full |
   * overdue | waived.
   *
   * Read it where the three-state `status` above is too coarse: a waived
   * instalment and a paid one are indistinguishable there, and only one of them
   * involved money.
   */
  installmentStatus: Scalars['String']['output'];
  /** Which instalment this is, e.g. 3 of 24. */
  sequence?: Maybe<Scalars['Int']['output']>;
  /**
   * upcoming | paid | overdue
   *
   * `waived` reads as `paid`: both mean nothing further is owed on the row, and
   * the other two options would each be wrong. A part-paid instalment reads
   * `overdue` once its due date has passed — the status job only advances unpaid
   * rows, so it would otherwise sit at "upcoming" indefinitely.
   */
  status: Scalars['String']['output'];
};

export type PaymentScheduleFilter = {
  conversationId?: InputMaybe<IdOperator>;
  createdById?: InputMaybe<IdOperator>;
  createdForId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  loanId?: InputMaybe<IdOperator>;
  offerRequestId?: InputMaybe<IdOperator>;
};

export type PaymentStatus =
  | 'OVERDUE'
  | 'PAID'
  | 'PENDING';

export type PaymentTermsAndSchedule = {
  __typename?: 'PaymentTermsAndSchedule';
  baseRefNo: Scalars['String']['output'];
  conversationId: Scalars['ID']['output'];
  createdBy: UserReference;
  createdFor: UserReference;
  interestRate: InterestRate;
  loanScheduleType: LoanScheduleType;
  loanSubType: LoanSubType;
  maxAmount: Scalars['Float']['output'];
  offerRequestId: Scalars['ID']['output'];
  propertyId: Scalars['ID']['output'];
  propertyName: Scalars['String']['output'];
  repaymentFrequency: RepaymentFrequency;
  repaymentTerms: RepaymentTerms;
  scheduleType: ScheduleType;
  tenor: Tenor;
  termSchedule: Array<YearlyTermSchedule>;
  totalInterest: Scalars['Float']['output'];
  totalRepayment: Scalars['Float']['output'];
  transactionId?: Maybe<Scalars['ID']['output']>;
  userId: Scalars['ID']['output'];
};

export type PaymentTermsAndScheduleInput = {
  additionalInterest?: InputMaybe<Scalars['Float']['input']>;
  baseRefNo?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<UserReferenceInput>;
  createdFor?: InputMaybe<UserReferenceInput>;
  interestRate?: InputMaybe<InterestRateInput>;
  isSubscribedToReferenceRate?: InputMaybe<Scalars['Boolean']['input']>;
  loanScheduleType?: InputMaybe<LoanScheduleType>;
  loanSubType?: InputMaybe<LoanSubType>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<Scalars['String']['input']>;
  repaymentTerms?: InputMaybe<RepaymentTermsInput>;
  tenor?: InputMaybe<TenorInput>;
  termSchedule?: InputMaybe<Array<YearlyTermScheduleInput>>;
  totalInterest?: InputMaybe<Scalars['Float']['input']>;
  totalRepayment?: InputMaybe<Scalars['Float']['input']>;
};

export type PaymentTermsEmailInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  payload?: InputMaybe<Scalars['JSON']['input']>;
  repaymentId?: InputMaybe<Scalars['String']['input']>;
  scheduleId?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A payout destination on file. The full account number is never returned — only
 * the masked form, which is enough to confirm the right account without handing a
 * readable number to every screen that renders it.
 */
export type PayoutAccount = {
  __typename?: 'PayoutAccount';
  /** As it appears on the account. The bank will reject a payout that disagrees. */
  accountName: Scalars['String']['output'];
  accountNumberMasked: Scalars['String']['output'];
  /** Reference only — shown back to the owner, never used to route a payout. */
  bankBranch?: Maybe<Scalars['String']['output']>;
  /** The partner bank's routing key, when the caller supplied one. */
  bankCode?: Maybe<Scalars['String']['output']>;
  bankName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ownerType: PayoutAccountOwner;
  /**
   * `pending` from the moment it is saved or changed, until the bank partner
   * confirms the account is held in the owner's name: then `verified`, or
   * `rejected` (see `verificationNote`). Money is only ever paid into a verified
   * account; a check the bank could not answer stays `pending` and is retried.
   */
  status: PayoutAccountStatus;
  updatedAt: Scalars['DateTime']['output'];
  /** Why the account is pending or rejected — written for the owner. Null once verified. */
  verificationNote?: Maybe<Scalars['String']['output']>;
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PayoutAccountInput = {
  accountName: Scalars['String']['input'];
  /** Spaces and dashes are fine — they are stripped, not rejected. */
  accountNumber: Scalars['String']['input'];
  /**
   * Optional, and free text: the branch is recorded for the owner's own reference
   * and never used to route money — `bankCode` does that. Stored as typed, minus
   * surrounding whitespace.
   */
  bankBranch?: InputMaybe<Scalars['String']['input']>;
  bankCode?: InputMaybe<Scalars['String']['input']>;
  bankName: Scalars['String']['input'];
};

export type PayoutAccountOwner =
  /** The caller's active entity — the destination an issuer or financier is paid at. */
  | 'entity'
  /** The authenticated user, personally — the destination for their withdrawals. */
  | 'user';

export type PayoutAccountStatus =
  | 'pending'
  | 'rejected'
  | 'verified';

export type PenaltyType =
  | 'FLAT'
  | 'NONE'
  | 'PERCENTAGE';

export type PendingVerificationsPayload = {
  __typename?: 'PendingVerificationsPayload';
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  requests: Array<RoleRequest>;
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

/** One period end on the sales-pipeline chart. */
export type PipelinePoint = {
  __typename?: 'PipelinePoint';
  /**
   * What `value` is denominated in.
   *
   * One currency per point. A portfolio spanning two reports the one most of it
   * is in rather than silently adding cedis to dollars.
   */
  currency: Scalars['String']['output'];
  /** Period end, so the client labels it in the viewer's locale. */
  periodEnd: Scalars['DateTime']['output'];
  /** Total list value of unsold units at that date. */
  value: Scalars['Float']['output'];
};

export type PlatformFeeSetting = {
  __typename?: 'PlatformFeeSetting';
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  /** Machine key for what is being charged, e.g. seller_financing_down_payment_release. */
  feeType: Scalars['String']['output'];
  /** Added on top of the percentage. Use alone for a pure flat fee. */
  flatAmount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  /** False on a superseded row — history, not the live rate. */
  isActive: Scalars['Boolean']['output'];
  /** Ceiling, applied after rate + flat. Null for none. */
  maxAmount?: Maybe<Scalars['Float']['output']>;
  /** Floor, applied after rate + flat. Null for none. */
  minAmount?: Maybe<Scalars['Float']['output']>;
  /** Why this fee exists, or why it last changed. */
  note?: Maybe<Scalars['String']['output']>;
  /** Percentage of the gross amount. */
  ratePct: Scalars['Float']['output'];
  supersededAt?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  updatedById?: Maybe<Scalars['ID']['output']>;
};

export type Portfolio = {
  __typename?: 'Portfolio';
  /**
   * The portfolio's supporting files, as written by `createPortfolio` /
   * `updatePortfolio` (`[JSONObject]`): `{ description, fileUrl }`. Typed
   * `[String]` here while every write stored objects, so any portfolio with a
   * file failed the whole query it appeared in. `JSON` rather than `JSONObject`
   * so an early row holding a bare URL still reads.
   */
  additionalFiles?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  construction?: Maybe<Construction>;
  constructionCommencementDate?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  epaPermitNumber?: Maybe<Scalars['String']['output']>;
  gpsAddress?: Maybe<Scalars['String']['output']>;
  grossDevelopmentValue?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  landValuationAmount?: Maybe<Scalars['Float']['output']>;
  landValuer?: Maybe<Scalars['String']['output']>;
  listingObjective?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  planningPermitNumber?: Maybe<Scalars['String']['output']>;
  portfolioType?: Maybe<Scalars['String']['output']>;
  practicalCompletionDate?: Maybe<Scalars['String']['output']>;
  projectCost?: Maybe<ProjectCost>;
  projectDescription?: Maybe<Scalars['String']['output']>;
  projectImages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  projectName?: Maybe<Scalars['String']['output']>;
  projectStatus?: Maybe<Scalars['String']['output']>;
  projectType?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  propertyTypes?: Maybe<Array<Maybe<PropertyTypes>>>;
  readiness?: Maybe<Scalars['Int']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
  sharedAmenities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  squareFeet?: Maybe<Scalars['Int']['output']>;
  streetAddress?: Maybe<Scalars['String']['output']>;
  titleNumber?: Maybe<Scalars['String']['output']>;
  totalDevelopmentCost?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  views?: Maybe<Scalars['Int']['output']>;
  yearBuilt?: Maybe<Scalars['String']['output']>;
};

export type PortfolioContext = {
  __typename?: 'PortfolioContext';
  portfolioId: Scalars['ID']['output'];
  portfolioType: Scalars['String']['output'];
  projectName?: Maybe<Scalars['String']['output']>;
  sharedAmenities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  totalUnits: Scalars['Int']['output'];
};

export type PortfolioFilter = {
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
};

export type PortfolioProjectUnitInput = {
  backyard?: InputMaybe<Scalars['Int']['input']>;
  bedroom?: InputMaybe<Scalars['Int']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  diningArea?: InputMaybe<Scalars['Int']['input']>;
  fullBathroom?: InputMaybe<Scalars['Int']['input']>;
  fullKitchen?: InputMaybe<Scalars['Int']['input']>;
  halfBathroom?: InputMaybe<Scalars['Int']['input']>;
  kitchenette?: InputMaybe<Scalars['Int']['input']>;
  livingRoom?: InputMaybe<Scalars['Int']['input']>;
  office?: InputMaybe<Scalars['Int']['input']>;
  patio?: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Float']['input'];
  projectImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propertyAmenities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propertyCardDesc?: InputMaybe<Scalars['String']['input']>;
  propertyDescription?: InputMaybe<Scalars['String']['input']>;
  propertyNameOrNumber?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<Scalars['String']['input']>;
  squareFeet?: InputMaybe<Scalars['Int']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
};

export type PortfolioProjectWithUnitsResult = {
  __typename?: 'PortfolioProjectWithUnitsResult';
  portfolioId?: Maybe<Scalars['ID']['output']>;
  projectId?: Maybe<Scalars['ID']['output']>;
  success: Scalars['Boolean']['output'];
  unitIds?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
};

export type PreApprovalDocument = {
  __typename?: 'PreApprovalDocument';
  documentUrl: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type PreApprovalExchangeRow = {
  __typename?: 'PreApprovalExchangeRow';
  /** issuer_to_buyer = the seller asked the applicant; buyer_to_issuer = the reverse. */
  direction: Scalars['String']['output'];
  documents: Array<PreApprovalDocument>;
  label: Scalars['String']['output'];
  /** The settled state, rendered verbatim in a pill: accepted / waived / requested / … */
  status: Scalars['String']['output'];
};

/**
 * The output of the seller-approval phase, carried onto the loan application
 * (AFR-147).
 *
 * A SNAPSHOT taken when the approach converted, not a live read of the approach.
 * The financier is not a party to the approach and could not resolve it
 * themselves; more to the point, this is evidence a credit decision rests on, and
 * it must not move underneath the lender afterwards.
 */
export type PreApprovalFile = {
  __typename?: 'PreApprovalFile';
  /** When the seller accepted. Null only on a snapshot taken before they did. */
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The approach's reference, shown to the lender (e.g. AP-2026-001094). */
  approachId: Scalars['String']['output'];
  /** When the deposit cleared and the seller was told — placement itself is silent. */
  approachedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The buyer's commitment deposit, already confirmed in escrow. */
  depositAmount: Scalars['Float']['output'];
  depositCurrency?: Maybe<Scalars['String']['output']>;
  /** The escrow provider's reference for the confirmed leg (e.g. PSP-5161). */
  depositReference?: Maybe<Scalars['String']['output']>;
  /**
   * The optional two-way exchange, where there was one. Empty on most deals.
   *
   * Every category somebody actually opened, in either direction. A dormant one
   * nobody ever asked for is not a gap in the file and is not listed.
   */
  exchange: Array<PreApprovalExchangeRow>;
  /**
   * Title, planning permission, encumbrance position — grouped by category.
   *
   * Always all three, INCLUDING any with no documents against them. A pack
   * section that lists only what exists cannot report a hole, and the hole is the
   * most useful line on the panel for a lender.
   */
  propertyPack: Array<PreApprovalPackCategory>;
  /** The seller's company or display name, as it was at acceptance. */
  sellerName: Scalars['String']['output'];
};

export type PreApprovalPackCategory = {
  __typename?: 'PreApprovalPackCategory';
  categoryId: Scalars['String']['output'];
  /** Empty where the category produced nothing — render the gap, do not drop the row. */
  documents: Array<PreApprovalDocument>;
  /** Human label, e.g. "Planning permission and building permit". */
  label: Scalars['String']['output'];
};

export type PreTokenizedUnit = {
  __typename?: 'PreTokenizedUnit';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metaData?: Maybe<PreTokenizedUnitMetadata>;
  numberOfUnits: Scalars['Int']['output'];
  ownerId: Scalars['ID']['output'];
  paymentStatus: Scalars['String']['output'];
  portfolioId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  unitCoverImage?: Maybe<Scalars['String']['output']>;
  unitId: Scalars['String']['output'];
  unitType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
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
  numberOfUnits?: InputMaybe<Scalars['Int']['input']>;
  paymentStatus?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  unitCoverImage?: InputMaybe<Scalars['String']['input']>;
  unitId: Scalars['String']['input'];
  unitType: Scalars['String']['input'];
};

export type PreTokenizedUnitMetadata = {
  __typename?: 'PreTokenizedUnitMetadata';
  area?: Maybe<Scalars['String']['output']>;
  availableFrom?: Maybe<Scalars['String']['output']>;
  bedroom?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  floor?: Maybe<Scalars['String']['output']>;
  floorPlanUrl?: Maybe<Scalars['String']['output']>;
  fullBathroom?: Maybe<Scalars['Int']['output']>;
  hasUnitDeed?: Maybe<Scalars['Boolean']['output']>;
  headline?: Maybe<Scalars['String']['output']>;
  houseNumber?: Maybe<Scalars['String']['output']>;
  latA?: Maybe<Scalars['String']['output']>;
  latB?: Maybe<Scalars['String']['output']>;
  legalDescOfProperty?: Maybe<Scalars['String']['output']>;
  listingType?: Maybe<Scalars['String']['output']>;
  lngA?: Maybe<Scalars['String']['output']>;
  lngB?: Maybe<Scalars['String']['output']>;
  municipality?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  projectAmenities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  projectImages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  projectNameOrNumber?: Maybe<Scalars['String']['output']>;
  projectStatus?: Maybe<Scalars['String']['output']>;
  projectType?: Maybe<Scalars['String']['output']>;
  propertyDescription?: Maybe<Scalars['String']['output']>;
  propertyUse?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  squareFeet?: Maybe<Scalars['Float']['output']>;
  unitDeedUrl?: Maybe<Scalars['String']['output']>;
};

export type PreTokenizedUnitMetadataInput = {
  area?: InputMaybe<Scalars['String']['input']>;
  availableFrom?: InputMaybe<Scalars['String']['input']>;
  bedroom?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  floor?: InputMaybe<Scalars['String']['input']>;
  floorPlanUrl?: InputMaybe<Scalars['String']['input']>;
  fullBathroom?: InputMaybe<Scalars['Int']['input']>;
  hasUnitDeed?: InputMaybe<Scalars['Boolean']['input']>;
  headline?: InputMaybe<Scalars['String']['input']>;
  houseNumber?: InputMaybe<Scalars['String']['input']>;
  latA?: InputMaybe<Scalars['String']['input']>;
  latB?: InputMaybe<Scalars['String']['input']>;
  legalDescOfProperty?: InputMaybe<Scalars['String']['input']>;
  listingType?: InputMaybe<Scalars['String']['input']>;
  lngA?: InputMaybe<Scalars['String']['input']>;
  lngB?: InputMaybe<Scalars['String']['input']>;
  municipality?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  projectAmenities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectNameOrNumber?: InputMaybe<Scalars['String']['input']>;
  projectStatus?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  propertyDescription?: InputMaybe<Scalars['String']['input']>;
  propertyUse?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  squareFeet?: InputMaybe<Scalars['Float']['input']>;
  unitDeedUrl?: InputMaybe<Scalars['String']['input']>;
};

export type PreTokenizedUnitUpdateInput = {
  metaData?: InputMaybe<PreTokenizedUnitMetadataInput>;
  numberOfUnits?: InputMaybe<Scalars['Int']['input']>;
  paymentStatus?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  unitCoverImage?: InputMaybe<Scalars['String']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  unitType?: InputMaybe<Scalars['String']['input']>;
};

export type PrepaymentFeeType =
  | 'FLAT'
  | 'NONE'
  | 'PERCENTAGE';

export type PrepaymentTerms = {
  __typename?: 'PrepaymentTerms';
  allowed: Scalars['Boolean']['output'];
  days: Scalars['Int']['output'];
  feeAmount: Scalars['Float']['output'];
  feePercentage: Scalars['Float']['output'];
  feeType: PrepaymentFeeType;
};

export type PrepaymentTermsInput = {
  allowed?: InputMaybe<Scalars['Boolean']['input']>;
  days?: InputMaybe<Scalars['Int']['input']>;
  feeAmount?: InputMaybe<Scalars['Float']['input']>;
  feePercentage?: InputMaybe<Scalars['Float']['input']>;
  feeType?: InputMaybe<PrepaymentFeeType>;
};

export type Project = {
  __typename?: 'Project';
  createdAt?: Maybe<Scalars['String']['output']>;
  divisionDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isDivided?: Maybe<Scalars['Boolean']['output']>;
  isTokenized?: Maybe<Scalars['Boolean']['output']>;
  listingType?: Maybe<Scalars['String']['output']>;
  nftAddress?: Maybe<Scalars['String']['output']>;
  nftTokenId?: Maybe<Scalars['String']['output']>;
  nftTokenUri?: Maybe<Scalars['String']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  ownerWalletAddress?: Maybe<Scalars['String']['output']>;
  owners?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  portfolio?: Maybe<Portfolio>;
  projectId?: Maybe<Scalars['String']['output']>;
  projectType?: Maybe<Scalars['String']['output']>;
  property?: Maybe<Property>;
  shareToken?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tokenizationTimestamp?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ProjectCost = {
  __typename?: 'ProjectCost';
  adminAndOther?: Maybe<Scalars['Float']['output']>;
  construction?: Maybe<Scalars['Float']['output']>;
  contingency?: Maybe<Scalars['Float']['output']>;
  depositRequired?: Maybe<Scalars['Float']['output']>;
  designAndEng?: Maybe<Scalars['Float']['output']>;
  financingAvailable?: Maybe<Scalars['Boolean']['output']>;
  land?: Maybe<Scalars['Float']['output']>;
  marketingOrSales?: Maybe<Scalars['Float']['output']>;
  maxAmountAvailable?: Maybe<Scalars['Float']['output']>;
  paymentTerms?: Maybe<Scalars['String']['output']>;
  paymentType?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  serviceFee?: Maybe<Scalars['Float']['output']>;
};

export type ProjectCostInput = {
  adminAndOther?: InputMaybe<Scalars['Float']['input']>;
  construction?: InputMaybe<Scalars['Float']['input']>;
  contingency?: InputMaybe<Scalars['Float']['input']>;
  depositRequired?: InputMaybe<Scalars['Float']['input']>;
  designAndEng?: InputMaybe<Scalars['Float']['input']>;
  financingAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  land?: InputMaybe<Scalars['Float']['input']>;
  marketingOrSales?: InputMaybe<Scalars['Float']['input']>;
  maxAmountAvailable?: InputMaybe<Scalars['Float']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  paymentType?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  serviceFee?: InputMaybe<Scalars['Float']['input']>;
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
  isDivided?: InputMaybe<Scalars['Boolean']['input']>;
  isTokenized?: InputMaybe<Scalars['Boolean']['input']>;
  listingType?: InputMaybe<Scalars['String']['input']>;
  nftAddress?: InputMaybe<Scalars['String']['input']>;
  nftTokenId?: InputMaybe<Scalars['String']['input']>;
  nftTokenUri?: InputMaybe<Scalars['String']['input']>;
  ownerWalletAddress?: InputMaybe<Scalars['String']['input']>;
  owners?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  shareToken?: InputMaybe<Scalars['Int']['input']>;
  tokenizationTimestamp?: InputMaybe<Scalars['String']['input']>;
};

/**
 * One construction milestone on an issuer project loan, and the tranche released
 * against it (FINANCIER_FLOW_REMAINING_SEEDS §3).
 *
 * ⚠ `status`, `releasedAt`, `releasedAmount` and `disbursementId` are DERIVED, not
 * stored. A milestone records only what was PLANNED; whether it has been released
 * is read back off the disbursement carrying its id.
 *
 * That is deliberate, and it is the whole design. The issue's constraint is that
 * the milestone and its tranche must never disagree — so there is exactly one
 * record of the money (the disbursement) and the milestone's release state is a
 * projection of it. There is no second copy to drift.
 */
export type ProjectMilestone = {
  __typename?: 'ProjectMilestone';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** The disbursement that released it, so the two can be shown side by side. */
  disbursementId?: Maybe<Scalars['ID']['output']>;
  /** The tranche INTENDED for this milestone. Compare with `releasedAmount`. */
  expectedAmount: Scalars['Float']['output'];
  expectedDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** e.g. "Foundation complete". */
  name: Scalars['String']['output'];
  /**
   * What was ACTUALLY released. May differ from `expectedAmount` — a short release
   * stays visible rather than being smoothed away by overwriting the plan.
   */
  releasedAmount?: Maybe<Scalars['Float']['output']>;
  /** When the tranche was released. Null while pending. */
  releasedAt?: Maybe<Scalars['DateTime']['output']>;
  /** pending | released — derived from whether a tranche carries this milestone's id. */
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProjectMilestoneInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expectedAmount: Scalars['Float']['input'];
  expectedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Omit to create; supply to edit an existing milestone. */
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type Property = {
  __typename?: 'Property';
  adminAndOther?: Maybe<Scalars['Float']['output']>;
  area?: Maybe<Scalars['String']['output']>;
  backyard?: Maybe<Scalars['Int']['output']>;
  barcodeTitlePlan?: Maybe<Scalars['String']['output']>;
  barcodedSitePlan?: Maybe<Scalars['String']['output']>;
  bedroom?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  consentData?: Maybe<Scalars['String']['output']>;
  construction?: Maybe<Scalars['Float']['output']>;
  contingency?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dateOfIssue?: Maybe<Scalars['String']['output']>;
  dateOfStamping?: Maybe<Scalars['String']['output']>;
  dateOfTransfer?: Maybe<Scalars['String']['output']>;
  depositRequired?: Maybe<Scalars['Float']['output']>;
  designAndEng?: Maybe<Scalars['Float']['output']>;
  diningArea?: Maybe<Scalars['Int']['output']>;
  dividedUnits?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  divisionDate?: Maybe<Scalars['DateTime']['output']>;
  dueDiligenceId?: Maybe<Scalars['ID']['output']>;
  estimatedPrice?: Maybe<Scalars['Float']['output']>;
  financingAvailable?: Maybe<Scalars['Boolean']['output']>;
  floorAreaSqm?: Maybe<Scalars['Float']['output']>;
  fullBathroom?: Maybe<Scalars['Int']['output']>;
  fullKitchen?: Maybe<Scalars['Int']['output']>;
  gpsAddress?: Maybe<Scalars['String']['output']>;
  halfBathroom?: Maybe<Scalars['Int']['output']>;
  houseNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  independentValuer?: Maybe<Scalars['String']['output']>;
  interestHeld?: Maybe<Scalars['String']['output']>;
  isDivided?: Maybe<Scalars['Boolean']['output']>;
  isFavorited?: Maybe<Scalars['Boolean']['output']>;
  isTokenized?: Maybe<Scalars['Boolean']['output']>;
  kitchenette?: Maybe<Scalars['Int']['output']>;
  land?: Maybe<Scalars['Float']['output']>;
  landCertificateNumber?: Maybe<Scalars['String']['output']>;
  landTitleUrl?: Maybe<Scalars['String']['output']>;
  legalDescOfProperty?: Maybe<Scalars['String']['output']>;
  legalDocs?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  /**
   * When Afram approved this listing onto the marketplace. Null while it awaits
   * review: a listing reaches the market only when staff approve it.
   */
  listingApprovedAt?: Maybe<Scalars['DateTime']['output']>;
  listingObjective?: Maybe<Scalars['String']['output']>;
  livingRoom?: Maybe<Scalars['Int']['output']>;
  marketingOrSales?: Maybe<Scalars['Float']['output']>;
  maxAmountAvailable?: Maybe<Scalars['Float']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  /**
   * The latest tokenization attempt's on-chain details. Null when the property
   * has never been through tokenizeProperty, including units created by
   * combining already-tokenized units.
   */
  nft?: Maybe<PropertyNft>;
  /**
   * Where the property's token stands, from its latest tokenization attempt.
   * Unlike isTokenized, which only turns true once minting finishes, this shows
   * an attempt in flight (pending) and one that failed.
   */
  nftStatus: NftStatus;
  numberOfUnits?: Maybe<Scalars['Int']['output']>;
  office?: Maybe<Scalars['Int']['output']>;
  owner?: Maybe<Entity>;
  ownerId: Scalars['ID']['output'];
  ownersGrantor?: Maybe<Scalars['String']['output']>;
  parcelId?: Maybe<Scalars['String']['output']>;
  parentNftAddress?: Maybe<Scalars['String']['output']>;
  parentNftTokenId?: Maybe<Scalars['String']['output']>;
  parentPropertyId?: Maybe<Scalars['ID']['output']>;
  patio?: Maybe<Scalars['Int']['output']>;
  paymentTerms?: Maybe<Scalars['String']['output']>;
  paymentType?: Maybe<Scalars['String']['output']>;
  portfolio?: Maybe<PortfolioContext>;
  portfolioId?: Maybe<Scalars['ID']['output']>;
  price: Scalars['Float']['output'];
  projectImages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  projectStatus?: Maybe<Scalars['String']['output']>;
  propertyAmenities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  propertyCardDesc?: Maybe<Scalars['String']['output']>;
  propertyDescription?: Maybe<Scalars['String']['output']>;
  propertyNameOrNumber?: Maybe<Scalars['String']['output']>;
  propertyType?: Maybe<Scalars['String']['output']>;
  propertyUse?: Maybe<Scalars['String']['output']>;
  readiness?: Maybe<Scalars['Int']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  rentToBuyEnabled?: Maybe<Scalars['Boolean']['output']>;
  serviceFee?: Maybe<Scalars['Float']['output']>;
  siteCoordinates?: Maybe<Scalars['JSONObject']['output']>;
  squareFeet?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<PropertyStatus>;
  streetAddress?: Maybe<Scalars['String']['output']>;
  streetName?: Maybe<Scalars['String']['output']>;
  termHeld?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  titleHolder?: Maybe<Scalars['String']['output']>;
  titleType?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['ID']['output']>;
  transferDeedNumber?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  valuationAmount?: Maybe<Scalars['Float']['output']>;
  valuationDate?: Maybe<Scalars['String']['output']>;
  views?: Maybe<Scalars['Int']['output']>;
  yearBuilt?: Maybe<Scalars['Int']['output']>;
};

export type PropertyFilter = {
  /**
   * Exclude properties already attached to an offer request for this financier.
   *
   * What "Recommended for you" means: listed, not yours, and not a deal you are
   * already in. Without it the rail keeps surfacing units the financier has
   * already made an offer on, and the client's only alternative is to fetch their
   * whole request list to diff against.
   *
   * Combines with an `id` filter rather than replacing it — both must hold.
   */
  excludeFinancedBy?: InputMaybe<Scalars['ID']['input']>;
  excludeOwnerId?: InputMaybe<IdOperator>;
  id?: InputMaybe<IdOperator>;
  isTokenized?: InputMaybe<BooleanOperator>;
  ownerId?: InputMaybe<IdOperator>;
  portfolioId?: InputMaybe<IdOperator>;
  /**
   * Leave unset on `getProperties` / `getPropertiesLength` and sold units are
   * excluded for you — those two lists are browse surfaces and a sold unit is not
   * on the market. Set it, in any form, and you get exactly what you asked for,
   * which is how a "Sold" view is built: `status: { eq: sold }`.
   *
   * `getProperty` and the favourites lists never apply that default: they are
   * "I already know about this unit" surfaces, and a buyer opening the unit they
   * now own must still be able to see it.
   */
  status?: InputMaybe<PropertyStatusOperator>;
};

export type PropertyInput = {
  adminAndOther?: InputMaybe<Scalars['Float']['input']>;
  area?: InputMaybe<Scalars['String']['input']>;
  backyard?: InputMaybe<Scalars['Int']['input']>;
  barcodeTitlePlan?: InputMaybe<Scalars['String']['input']>;
  barcodedSitePlan?: InputMaybe<Scalars['String']['input']>;
  bedroom?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  consentData?: InputMaybe<Scalars['String']['input']>;
  construction?: InputMaybe<Scalars['Float']['input']>;
  contingency?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dateOfIssue?: InputMaybe<Scalars['String']['input']>;
  dateOfStamping?: InputMaybe<Scalars['String']['input']>;
  dateOfTransfer?: InputMaybe<Scalars['String']['input']>;
  depositRequired?: InputMaybe<Scalars['Float']['input']>;
  designAndEng?: InputMaybe<Scalars['Float']['input']>;
  diningArea?: InputMaybe<Scalars['Int']['input']>;
  dividedUnits?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  divisionDate?: InputMaybe<Scalars['DateTime']['input']>;
  dueDiligenceId?: InputMaybe<Scalars['ID']['input']>;
  estimatedPrice?: InputMaybe<Scalars['Float']['input']>;
  financingAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  floorAreaSqm?: InputMaybe<Scalars['Float']['input']>;
  fullBathroom?: InputMaybe<Scalars['Int']['input']>;
  fullKitchen?: InputMaybe<Scalars['Int']['input']>;
  gpsAddress?: InputMaybe<Scalars['String']['input']>;
  halfBathroom?: InputMaybe<Scalars['Int']['input']>;
  houseNumber?: InputMaybe<Scalars['String']['input']>;
  independentValuer?: InputMaybe<Scalars['String']['input']>;
  interestHeld?: InputMaybe<Scalars['String']['input']>;
  isDivided?: InputMaybe<Scalars['Boolean']['input']>;
  kitchenette?: InputMaybe<Scalars['Int']['input']>;
  land?: InputMaybe<Scalars['Float']['input']>;
  landCertificateNumber?: InputMaybe<Scalars['String']['input']>;
  landTitleUrl?: InputMaybe<Scalars['String']['input']>;
  legalDescOfProperty?: InputMaybe<Scalars['String']['input']>;
  legalDocs?: InputMaybe<Array<InputMaybe<LegalDocsInput>>>;
  listingObjective?: InputMaybe<Scalars['String']['input']>;
  livingRoom?: InputMaybe<Scalars['Int']['input']>;
  marketingOrSales?: InputMaybe<Scalars['Float']['input']>;
  maxAmountAvailable?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  numberOfUnits?: InputMaybe<Scalars['Int']['input']>;
  office?: InputMaybe<Scalars['Int']['input']>;
  ownersGrantor?: InputMaybe<Scalars['String']['input']>;
  parcelId?: InputMaybe<Scalars['String']['input']>;
  parentNftAddress?: InputMaybe<Scalars['String']['input']>;
  parentNftTokenId?: InputMaybe<Scalars['String']['input']>;
  parentPropertyId?: InputMaybe<Scalars['ID']['input']>;
  patio?: InputMaybe<Scalars['Int']['input']>;
  paymentTerms?: InputMaybe<Scalars['String']['input']>;
  paymentType?: InputMaybe<Scalars['String']['input']>;
  portfolioId?: InputMaybe<Scalars['ID']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectStatus?: InputMaybe<Scalars['String']['input']>;
  propertyAmenities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propertyCardDesc?: InputMaybe<Scalars['String']['input']>;
  propertyDescription?: InputMaybe<Scalars['String']['input']>;
  propertyNameOrNumber?: InputMaybe<Scalars['String']['input']>;
  propertyType?: InputMaybe<Scalars['String']['input']>;
  propertyUse?: InputMaybe<Scalars['String']['input']>;
  readiness?: InputMaybe<Scalars['Int']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  rentToBuyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  serviceFee?: InputMaybe<Scalars['Float']['input']>;
  siteCoordinates?: InputMaybe<Scalars['JSONObject']['input']>;
  squareFeet?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<PropertyStatus>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  termHeld?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  titleHolder?: InputMaybe<Scalars['String']['input']>;
  titleType?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['ID']['input']>;
  transferDeedNumber?: InputMaybe<Scalars['String']['input']>;
  valuationAmount?: InputMaybe<Scalars['Float']['input']>;
  valuationDate?: InputMaybe<Scalars['String']['input']>;
  yearBuilt?: InputMaybe<Scalars['Int']['input']>;
};

export type PropertyNft = {
  __typename?: 'PropertyNft';
  metadataUri: Scalars['String']['output'];
  mintedAt?: Maybe<Scalars['DateTime']['output']>;
  status: NftStatus;
  /** The property's ERC-20 contract. Null until minted. */
  tokenAddress?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type PropertyPipelineBucket = {
  __typename?: 'PropertyPipelineBucket';
  count: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  stage: PropertyPipelineStage;
  total: Scalars['Int']['output'];
};

export type PropertyPipelineStage =
  | 'ACTIVE'
  | 'CLOSED'
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'TOKENIZED';

/**
 * One price a property was set to, and when (#450). A newly listed property has
 * exactly one: the price it was listed at. Properties listed before price history
 * existed have none until their price is next set — show the current
 * `Property.price` alone, not invented earlier points.
 */
export type PropertyPrice = {
  __typename?: 'PropertyPrice';
  /** When the property took this price. */
  createdAt: Scalars['DateTime']['output'];
  currency?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  propertyId: Scalars['ID']['output'];
};

export type PropertyPriceFilter = {
  /** When the price was set — e.g. `{ after: ... }` for the last year's chart. */
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  propertyId?: InputMaybe<IdOperator>;
};

export type PropertyStatus =
  | 'delisted'
  | 'divided'
  | 'listed'
  | 'pending'
  /**
   * Sold. Set when the issuer is paid out, whatever the sale path: cash at close,
   * seller-financed at the down-payment release, lender-financed at disbursement.
   * Excluded from the browse lists by default — ask for it explicitly to build a
   * "Sold" view.
   */
  | 'sold'
  | 'subdivision'
  /**
   * One buyer has committed money to this unit and it is theirs to complete.
   * Set the moment a deposit is confirmed, whatever the path: a cash deposit
   * verified, a seller-financing commitment deposit confirmed, a lender-financed
   * request marked paid, or an approach accepted. Not at placement — a request
   * nobody has paid for must not take a unit off the market.
   *
   * Still on the market and still discoverable: a claim can lapse, be withdrawn
   * or be declined, and a buyer mid-conversation about a unit that vanished from
   * their feed would have no way back to it. What it cannot be is transacted on
   * by anyone else — every placement path refuses it.
   */
  | 'under_offer'
  | 'unlisted';

export type PropertyStatusOperator = {
  eq?: InputMaybe<PropertyStatus>;
  in?: InputMaybe<Array<PropertyStatus>>;
  notIn?: InputMaybe<Array<PropertyStatus>>;
};

export type PropertyTypes = {
  __typename?: 'PropertyTypes';
  currency?: Maybe<Scalars['String']['output']>;
  estimatedPrice?: Maybe<Scalars['Float']['output']>;
  floorArea?: Maybe<FloorArea>;
  maxPrice?: Maybe<Scalars['Float']['output']>;
  minPrice?: Maybe<Scalars['Float']['output']>;
  numOfUnits?: Maybe<Scalars['Int']['output']>;
  propertyDescription?: Maybe<Scalars['String']['output']>;
  propertyImages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  propertyType?: Maybe<Scalars['String']['output']>;
};

export type PropertyTypesInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  estimatedPrice?: InputMaybe<Scalars['Float']['input']>;
  floorArea?: InputMaybe<FloorAreaInput>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  numOfUnits?: InputMaybe<Scalars['Int']['input']>;
  propertyDescription?: InputMaybe<Scalars['String']['input']>;
  propertyImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propertyType?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A member's appointment to view a property.
 *
 * `requested → confirmed → attended` is the spine; `declined`, `cancelled` and
 * `no_show` are the ways out. A slot is held from `requested` — not from
 * `confirmed` — because the alternative is telling two members the same time is
 * theirs and letting the vendor discover the clash.
 */
export type PropertyViewing = {
  __typename?: 'PropertyViewing';
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledBy?: Maybe<TransactionPartyRoleOrMember>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  decidedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The vendor's word on accepting or declining. */
  decisionNote?: Maybe<Scalars['String']['output']>;
  /** Derived from the window's `slotMinutes`. Null on a proposed time. */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** The vendor entity, as it was when the appointment was made. */
  issuerId?: Maybe<Scalars['ID']['output']>;
  /** The interested member. A user, not an entity — they may not have one. */
  memberId: Scalars['ID']['output'];
  /** The member's message when asking. */
  note?: Maybe<Scalars['String']['output']>;
  origin: PropertyViewingOrigin;
  outcomeNote?: Maybe<Scalars['String']['output']>;
  outcomeRecordedAt?: Maybe<Scalars['DateTime']['output']>;
  propertyId: Scalars['ID']['output'];
  scheduledAt: Scalars['DateTime']['output'];
  /**
   * `YYYY-MM-DDTHH:MM`, the id the client derived from a declared window.
   * Null only on a proposed time, which contends for nothing.
   */
  slotId?: Maybe<Scalars['String']['output']>;
  status: PropertyViewingStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PropertyViewingOrigin =
  /**
   * A time proposed outside every window. Only possible where the vendor set
   * `allowRequestsOutside`, and never contended — there is no slot to contend for.
   */
  | 'proposed'
  /** Picked out of a declared window. Contended. */
  | 'slot';

export type PropertyViewingStatus =
  /** It happened. */
  | 'attended'
  /** Called off by either party. Releases the slot. */
  | 'cancelled'
  /** The vendor said yes. */
  | 'confirmed'
  /** The vendor said no. Releases the slot. */
  | 'declined'
  /** It did not. The slot is still consumed — the time was spent. */
  | 'no_show'
  /** Asked for. The slot is already held. */
  | 'requested';

export type Query = {
  __typename?: 'Query';
  /**
   * Whether the buyer on this deal has passed Afram's NIA identity check, for
   * the issuer or financier on the same deal. Scoped to a request both parties
   * are on — not a general lookup. Returns the status and when it was confirmed,
   * never the Ghana Card number, the selfie, or any field off the register.
   *
   * Null once the request is rejected, revoked, declined or closed, and to the
   * buyer themselves (their own status is `getMyIdentityVerification`). A request
   * the caller is not party to is NOT_FOUND.
   */
  counterpartyIdentity?: Maybe<IdentityAttestation>;
  /** Whether an entity may perform a gated action, and what is blocking it. */
  evaluateEntityGate: EntityGate;
  /** Public. Null when the token matches no approved invite. */
  getAccessInvite?: Maybe<AccessInvite>;
  getAccessRequest?: Maybe<AccessRequest>;
  /** Staff only (access_request:view). Pending count: `getAccessRequestsLength(filter: { status: { eq: pending } })`. */
  getAccessRequests: Array<AccessRequest>;
  getAccessRequestsLength: Scalars['Int']['output'];
  getAdminDashboardSummary: AdminDashboardSummary;
  getAssessment?: Maybe<Assessment>;
  getAssessmentAlertRule?: Maybe<AssessmentAlertRule>;
  getAssessmentAlertRules: Array<AssessmentAlertRule>;
  getAssessmentAlertRulesLength: Scalars['Int']['output'];
  getAssessmentCategories: Array<AssessmentCategory>;
  getAssessmentCategoriesLength: Scalars['Int']['output'];
  getAssessmentCategory?: Maybe<AssessmentCategory>;
  getAssessmentDocument?: Maybe<AssessmentDocument>;
  getAssessmentDocuments: Array<AssessmentDocument>;
  getAssessmentDocumentsLength: Scalars['Int']['output'];
  getAssessmentFinancierShareGrant?: Maybe<AssessmentFinancierShareGrant>;
  getAssessmentFinancierShareGrants: Array<AssessmentFinancierShareGrant>;
  getAssessmentFinancierShareGrantsLength: Scalars['Int']['output'];
  getAssessmentQuestion?: Maybe<AssessmentQuestion>;
  getAssessmentQuestionOption?: Maybe<AssessmentQuestionOption>;
  getAssessmentQuestionOptions: Array<AssessmentQuestionOption>;
  getAssessmentQuestionOptionsLength: Scalars['Int']['output'];
  getAssessmentQuestions: Array<AssessmentQuestion>;
  getAssessmentQuestionsLength: Scalars['Int']['output'];
  getAssessmentReadinessBand?: Maybe<AssessmentReadinessBand>;
  getAssessmentReadinessBands: Array<AssessmentReadinessBand>;
  getAssessmentReadinessBandsLength: Scalars['Int']['output'];
  getAssessmentResponse?: Maybe<AssessmentResponse>;
  getAssessmentResponses: Array<AssessmentResponse>;
  getAssessmentResponsesLength: Scalars['Int']['output'];
  getAssessmentScoringBand?: Maybe<AssessmentScoringBand>;
  getAssessmentScoringBands: Array<AssessmentScoringBand>;
  getAssessmentScoringBandsLength: Scalars['Int']['output'];
  getAssessmentShareGrant?: Maybe<AssessmentShareGrant>;
  getAssessmentShareGrants: Array<AssessmentShareGrant>;
  getAssessmentShareGrantsLength: Scalars['Int']['output'];
  getAssessmentTemplate?: Maybe<AssessmentTemplate>;
  getAssessmentTemplates: Array<AssessmentTemplate>;
  getAssessmentTemplatesLength: Scalars['Int']['output'];
  getAssessments: Array<Assessment>;
  getAssessmentsLength: Scalars['Int']['output'];
  /**
   * Every assessment currently shared with the caller's active entity.
   *
   * The discovery half of the share: without it a counterparty would have to
   * already know an assessment id, and the grant queries cannot tell them — those
   * are gated on access to the assessment, which is exactly what a counterparty
   * does not have.
   */
  getAssessmentsSharedWithMe: Array<AssessmentOutput>;
  getAssetValueSnapshot?: Maybe<AssetValueSnapshot>;
  getAssetValueSnapshots: Array<AssetValueSnapshot>;
  getAssetValueSnapshotsLength: Scalars['Int']['output'];
  getAuditLog?: Maybe<AuditLog>;
  getAuditLogs: Array<AuditLog>;
  getAuditLogsLength: Scalars['Int']['output'];
  getAvailableAdminPermissions: Array<Scalars['String']['output']>;
  getAvailablePermissions: Array<Scalars['String']['output']>;
  /** Borrower-raised requests for a loan (party-scoped: borrower or financier), newest first. */
  getBorrowerLoanRequests: Array<BorrowerLoanRequest>;
  getBuyerProject?: Maybe<BuyerProject>;
  getBuyerProjects: Array<BuyerProject>;
  getBuyerProjectsLength: Scalars['Int']['output'];
  /** The authenticated buyer's own properties, grouped into in-progress vs owned. */
  getBuyerPropertyHoldings: BuyerPropertyHoldings;
  getCashPurchase?: Maybe<CashPurchaseTxn>;
  /** The issuer's list — the 'Unit Purchases' section at the top of /issuer/offers. */
  getCashPurchasesForMyUnits: Array<CashPurchaseTxn>;
  getCompanyMember?: Maybe<EntityMember>;
  getCompanyMembers: Array<EntityMember>;
  getCompanyMembersLength: Scalars['Int']['output'];
  getCompanyRole?: Maybe<EntityRole>;
  getCompanyRoles: Array<EntityRole>;
  getCompanyRolesLength: Scalars['Int']['output'];
  getComplianceAuditEvent?: Maybe<ComplianceAuditEvent>;
  /**
   * Admin: query the dedicated compliance audit trail across all entities.
   * Filter by submissionId, entity, action, actor, role, status or date.
   */
  getComplianceAuditEvents: Array<ComplianceAuditEvent>;
  getComplianceAuditEventsLength: Scalars['Int']['output'];
  /**
   * Fetch the compliance sections, templates, and the user's submission statuses
   * for a given role. For an entity-scoped role (issuer) only the set for the
   * caller's own entity type, which the server works out — stats count that set.
   */
  getComplianceDocuments: ComplianceDocumentsResponse;
  getComplianceNotifications: Array<ComplianceNotification>;
  getComplianceNotificationsLength: Scalars['Int']['output'];
  /**
   * Admin: list the sections for a role type. With entityType, only that entity
   * type's sections; without it, all of the role's sections.
   */
  getComplianceSections: Array<ComplianceSection>;
  /** Admin: fetch a single compliance submission (with template, user, files) */
  getComplianceSubmission?: Maybe<ComplianceSubmission>;
  /** Admin: list compliance submissions across users for review */
  getComplianceSubmissions: Array<ComplianceSubmission>;
  getComplianceSubmissionsLength: Scalars['Int']['output'];
  /** The condition-precedent checklist for a request (Act 9). Any party may view it. */
  getConditionsPrecedent: Array<ConditionPrecedent>;
  /** The condition-subsequent checklist for a request. Any party may view it. */
  getConditionsSubsequent: Array<ConditionPrecedent>;
  getConversation?: Maybe<Conversation>;
  getConversationByReferenceNumber?: Maybe<Conversation>;
  getConversationByUsers?: Maybe<Conversation>;
  getConversations: Array<Conversation>;
  getConversationsLength: Scalars['Int']['output'];
  getDashboardSummary: DashboardSummary;
  /** Full declaration history for a loan (via its offer request), newest first. */
  getDeclarationsByOfferRequest: Array<StatusDeclaration>;
  /**
   * The §4 exchange for one deal. Also selectable inline as
   * `CashPurchaseTxn.diligenceItems` — this is for the exchange screen, which
   * loads the rail without the rest of the transaction.
   */
  getDiligenceItems: Array<DiligenceItem>;
  /** Tranche / drawdown records for a loan (from the offer request's servicing metadata). */
  getDisbursements: Array<DisbursementRecord>;
  getDueDiligence?: Maybe<DueDiligence>;
  getDueDiligences: Array<DueDiligence>;
  getDueDiligencesLength: Scalars['Int']['output'];
  /** The entity's tailored document requirements plus a per-action gate summary. */
  getEntityDocumentRequirements: EntityRequirementsResponse;
  /** The money rail for one deal. Buyer or owning issuer only. */
  getEscrowEvents: Array<EscrowEvent>;
  getFavoriteOffer?: Maybe<FavoriteOffer>;
  getFavoriteOffers: Array<FavoriteOffer>;
  getFavoriteOffersLength: Scalars['Int']['output'];
  getFavoriteProperties: Array<Property>;
  getFavoritePropertiesLength: Scalars['Int']['output'];
  /** AFRAM platform / lender fee records for a loan. */
  getFeeRecords: Array<FeeRecord>;
  getFinancier?: Maybe<Entity>;
  /**
   * The lender's loan book valued at each period end, oldest first.
   *
   * Read from the monthly status declarations, which are the stored series: each
   * point sums the latest active filing at or before that date, across the
   * lender's loans. A loan that has since closed still counts in the periods it
   * was live in — the alternative, projecting today's outstanding backwards,
   * produces a book that can only ever grow.
   *
   * Carried forward across a period nobody filed for: a late lender has not
   * reduced their book to nothing. Dropped once a loan is declared FullyRepaid or
   * WrittenOff — the only states that mean the balance went to zero rather than
   * went unreported. A loan disbursed but awaiting its first declaration counts
   * zero, exactly as it does in the Loan Book's own total.
   *
   * Empty list when the lender has no filings yet, so the hero renders its zero
   * state rather than a flat line. A lender who does have a book gets every
   * requested point, leading zeroes included — those months really were zero.
   */
  getFinancierAumSeries: Array<AumPoint>;
  /**
   * The pipeline stats, counted in the database.
   *
   * The dashboard counts these client-side today and is right, because the inbox
   * is unpaginated. Use this before paginating it: the day that list is paged,
   * client-side counts silently become "…on this page" — nothing throws, the
   * numbers are simply smaller than the truth.
   */
  getFinancierPipelineCounts: FinancierPipelineCounts;
  /** The authenticated financier's financed properties, grouped into in-progress vs settled. */
  getFinancierPropertyHoldings: FinancierPropertyHoldings;
  getFinanciers?: Maybe<Array<Maybe<Entity>>>;
  getFinanciersLength: Scalars['Int']['output'];
  getInstallment?: Maybe<RepaymentInstallment>;
  getInstallments: Array<RepaymentInstallment>;
  getInstallmentsLength: Scalars['Int']['output'];
  getIssuer?: Maybe<Entity>;
  /**
   * The issuer's sales pipeline valued at each period end, oldest first.
   *
   * Reconstructed from the recorded sale dates, not from today's stock: a unit
   * sold in June still counts towards May. Totalling today's unsold units and
   * repeating it backwards would erase every unit ever sold from its own past,
   * leaving a pipeline that only ever shrinks towards the present.
   *
   * `status != sold`, matching the live Pipeline Value stat — so unlisted and
   * delisted stock counts here too, and the hero cannot disagree with the number
   * printed under it.
   *
   * Two limits worth knowing: a repriced unit has its whole past restated at the
   * new price, because nothing records what a unit used to cost; and a unit sold
   * before the sale stamp existed is dated by its last update instead.
   *
   * Empty list when the issuer has no stock, so the hero renders its zero state.
   */
  getIssuerPipelineSeries: Array<PipelinePoint>;
  /**
   * The portfolio stats, counted in the database.
   *
   * The dashboard counts these client-side today and is right, because the
   * property and term-sheet lists are unpaginated. Use this before paginating
   * them: the day those lists are paged, client-side counts silently become
   * "…on this page".
   */
  getIssuerPortfolioCounts: IssuerPortfolioCounts;
  getIssuers?: Maybe<Array<Maybe<Entity>>>;
  getIssuersLength: Scalars['Int']['output'];
  getLand?: Maybe<Land>;
  getLands: Array<Land>;
  getLandsLength: Scalars['Int']['output'];
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
  /** A single loan row by its anchoring offer request (viewer-scoped). */
  getLedgerLoan?: Maybe<LedgerLoan>;
  /** The viewer's loans — funded offer requests they lend on or borrow on, projected as loan rows. */
  getLedgerLoans: Array<LedgerLoan>;
  /** Count of loans the viewer can see (for the same filter). */
  getLedgerLoansLength: Scalars['Int']['output'];
  getLoan?: Maybe<Loan>;
  /** All documents attached to a loan (borrower-uploaded + financier-shared), newest first. */
  getLoanDocuments: Array<LoanDocument>;
  getLoans: Array<Loan>;
  getLoansLength: Scalars['Int']['output'];
  getMessage?: Maybe<Message>;
  getMessages: Array<Message>;
  getMessagesLength: Scalars['Int']['output'];
  getMyActiveAssessment?: Maybe<Assessment>;
  getMyAssessmentEntryState: AssessmentEntryState;
  /** The buyer's list — the 'Purchases' section at the top of /buyer/offers. */
  getMyCashPurchases: Array<CashPurchaseTxn>;
  /**
   * Documents on file for the authenticated person — from their readiness
   * assessment and from diligence they have already satisfied elsewhere.
   * Scoped to the caller: a person's documents are never readable by a
   * counterparty, the same rule `User.identityVerification` follows.
   *
   * "One Document, One Name" §4. A buyer was asked for the payslips and bank
   * statements their readiness assessment already holds on every deal they
   * opened; this is what lets the buyer's rail offer them instead. Readiness
   * documents count once an officer has VERIFIED them, deal documents once a
   * seller has ACCEPTED them — nothing still under review is offered as on file.
   *
   * No user argument, deliberately: the person is whoever holds the token, so the
   * answer is the same on every deal they are party to and unreachable from the
   * other side of any of them.
   *
   * `categoryId` narrows to one buyer-side diligence category (`identity`,
   * `income_evidence`, `bank_statements`, …). Readiness codes are translated to
   * these on the server; a readiness document with no buyer-side equivalent is
   * not offered.
   */
  getMyHeldDocuments: Array<HeldDocument>;
  /** The caller's own verification. The page-load read, and the fallback when the socket is down. */
  getMyIdentityVerification?: Maybe<IdentityVerification>;
  /** The caller's own viewings, as the member who asked for them. */
  getMyPropertyViewings: Array<PropertyViewing>;
  /** The caller's deals as buyer, newest first. */
  getMyRentToBuyTxns: Array<RentToBuyTxn>;
  /** The caller's own approaches, newest first. */
  getMySellerApproaches: Array<SellerApproach>;
  /** The caller's deals, newest first. */
  getMySellerFinancingTxns: Array<SellerFinancingTxn>;
  /** Null when the reference doesn't exist or the caller can't see it. Never says which. */
  getMySupportRequest?: Maybe<SupportRequest>;
  /** Signed in: the person's requests, and their company's for vendors and financiers. Newest activity first. Limit 20 by default, 50 at most. */
  getMySupportRequests: Array<SupportRequest>;
  getMySupportRequestsLength: Scalars['Int']['output'];
  /** How many of the person's requests have news. Lights the dot on Help. */
  getMySupportUpdatesCount: Scalars['Int']['output'];
  /** Member: the thread on a ticket they raised, or one in a conversation they take part in. Oldest first. */
  getMyTicketComments: Array<TicketComment>;
  getMyTicketCommentsLength: Scalars['Int']['output'];
  getNotification?: Maybe<Notification>;
  getNotifications: Array<Notification>;
  getNotificationsLength: Scalars['Int']['output'];
  getOffer?: Maybe<Offer>;
  getOfferRequest?: Maybe<OfferRequest>;
  getOfferRequestDocuments: Array<OfferRequestDocument>;
  getOfferRequestDocumentsLength: Scalars['Int']['output'];
  getOfferRequests: Array<OfferRequest>;
  getOfferRequestsLength: Scalars['Int']['output'];
  getOffers: Array<Offer>;
  getOffersLength: Scalars['Int']['output'];
  /** Payments a loan actually received (Stream 2 — never merged with declarations). */
  getPaymentEvents: Array<PaymentEvent>;
  getPaymentSchedule?: Maybe<PaymentSchedule>;
  getPaymentSchedules: Array<PaymentSchedule>;
  getPaymentSchedulesLength: Scalars['Int']['output'];
  /**
   * The payout account on file for the given owner, or null if there is none.
   *
   * `entity` requires an active entity context and returns that entity's account,
   * whoever is asking; `user` returns the caller's own. The counterpart to
   * `setPayoutAccount`, and what an issuer's compliance screen reads to show
   * whether a release will be allowed to proceed.
   */
  getPayoutAccount?: Maybe<PayoutAccount>;
  getPendingTermChange?: Maybe<RepaymentTermChange>;
  getPendingTermChanges: Array<RepaymentTermChange>;
  getPendingTermChangesLength: Scalars['Int']['output'];
  getPendingVerifications: PendingVerificationsPayload;
  /** Admin — superseded rates for one fee type, newest first. */
  getPlatformFeeHistory: Array<PlatformFeeSetting>;
  /** Admin — the live schedule, one row per configured fee type and currency. */
  getPlatformFees: Array<PlatformFeeSetting>;
  getPortfolio?: Maybe<Portfolio>;
  getPortfolios: Array<Portfolio>;
  getPortfoliosLength: Scalars['Int']['output'];
  getPreTokenizedUnits: Array<PreTokenizedUnit>;
  getPreTokenizedUnitsLength: Scalars['Int']['output'];
  getProject?: Maybe<Project>;
  getProjects: Array<Project>;
  getProjectsLength: Scalars['Int']['output'];
  getProperties: Array<Property>;
  getPropertiesInPortfolio: Array<Property>;
  getPropertiesLength: Scalars['Int']['output'];
  getProperty?: Maybe<Property>;
  /**
   * Everything Afram already holds for one property, optionally narrowed to a
   * single category.
   *
   * Issuer-only: these are the issuer's own documents about their own parcel, and
   * the caller must be the entity that owns the listing. A buyer sees them when
   * they are submitted into a diligence exchange, which is the point at which the
   * issuer has decided to show them.
   *
   * Not a field on `Property`, deliberately — it costs three lookups per property
   * and browse renders them by the dozen. A vendor opening one listing's diligence
   * rail asks once.
   */
  getPropertyHeldDocuments: Array<HeldDocument>;
  getPropertyPipeline: Array<PropertyPipelineBucket>;
  getPropertyPrice?: Maybe<PropertyPrice>;
  /** Oldest first. */
  getPropertyPrices: Array<PropertyPrice>;
  getPropertyPricesLength: Scalars['Int']['output'];
  /** One viewing. Either party to it may read it; nobody else. */
  getPropertyViewing?: Maybe<PropertyViewing>;
  /** Every viewing across the units the caller's entity owns. */
  getPropertyViewingsForMyUnits: Array<PropertyViewing>;
  getPublicPortfolioUnits: Array<Property>;
  getPublicProjects: Array<Project>;
  getPublicProjectsLength: Scalars['Int']['output'];
  getRecentActivities: Array<RecentActivity>;
  getRecentActivitiesLength: Scalars['Int']['output'];
  /**
   * Buyer or vendor on the deal, by transaction id or by the deal's offer request.
   *
   * `offerRequestId` is the key a tenancy shares with its loan-book row, so a deep
   * link, a notification or a bookmark carrying a servicing id can resolve the
   * deal directly instead of hunting for it in the viewer's loaded list. Pass
   * exactly one.
   */
  getRentToBuyTxn?: Maybe<RentToBuyTxn>;
  /** Deals on units the caller issues, newest first. */
  getRentToBuyTxnsForMyUnits: Array<RentToBuyTxn>;
  getRepayment?: Maybe<Repayment>;
  getRepaymentTerm?: Maybe<Repayment>;
  getRepaymentTerms: Array<Repayment>;
  getRepaymentTermsLength: Scalars['Int']['output'];
  getRepayments: Array<Repayment>;
  getRepaymentsLength: Scalars['Int']['output'];
  getReview?: Maybe<Review>;
  getReviews: Array<Review>;
  getReviewsLength: Scalars['Int']['output'];
  getRoleRequests: Array<RoleRequest>;
  /** Computer. Auth + key. The fallback when the socket cannot connect. Null when no such session is the caller's. */
  getSelfieSession?: Maybe<SelfieSession>;
  /** Buyer or seller on the approach. */
  getSellerApproach?: Maybe<SellerApproach>;
  /** Approaches on the caller's units — the seller's inbox. Newest first. */
  getSellerApproachesForMyUnits: Array<SellerApproach>;
  /** Buyer or issuer on the deal. */
  getSellerFinancingTxn?: Maybe<SellerFinancingTxn>;
  /** Deals on the caller's units, newest first. */
  getSellerFinancingTxnsForMyUnits: Array<SellerFinancingTxn>;
  /**
   * One shared assessment's conclusion, for the counterparty it was shared with.
   *
   * Requires a live grant naming the caller's active entity. Refuses identically
   * whether the grant never existed, was revoked or has expired — "it was shared
   * and then withdrawn" is itself information about the subject.
   *
   * The subject and platform admins may also read it; they can already see the
   * full record, so refusing them the summary would be theatre.
   */
  getSharedAssessmentOutput?: Maybe<AssessmentOutput>;
  getSupportRequest?: Maybe<SupportRequest>;
  /**
   * PUBLIC. Where a signed-out request stands, by its reference and the email it
   * was sent from. Null when either is wrong, without saying which. Status only,
   * never messages. 10 per hour per IP.
   */
  getSupportRequestStatus?: Maybe<SupportRequestStatusResult>;
  /** Staff (support_request:view): every request, newest activity first. */
  getSupportRequests: Array<SupportRequest>;
  getSupportRequestsLength: Scalars['Int']['output'];
  getSupportRole?: Maybe<SupportRole>;
  getSupportRoles: Array<SupportRole>;
  getSupportRolesLength: Scalars['Int']['output'];
  getSupportUser?: Maybe<SupportUser>;
  getSupportUserStats: UserStats;
  getSupportUsers: Array<SupportUser>;
  getSupportUsersLength: Scalars['Int']['output'];
  getTailoringRule?: Maybe<TailoringRule>;
  getTailoringRules: Array<TailoringRule>;
  getTailoringRulesLength: Scalars['Int']['output'];
  /**
   * The slot ids currently spoken for on a listing, so the client can grey them
   * out.
   *
   * Ids, not availability: working out which slots EXIST is the client's job —
   * it owns the weekday-to-date projection — and this is the one fact it cannot
   * derive. Open to anyone: a taken slot is not private, and withholding it would
   * only mean members discovering clashes by being refused.
   */
  getTakenViewingSlots: Array<Scalars['String']['output']>;
  getTempProject?: Maybe<TempProject>;
  getTempProjects: Array<TempProject>;
  getTempProjectsLength: Scalars['Int']['output'];
  getTermSheet?: Maybe<TermSheet>;
  getTermSheets: Array<TermSheet>;
  getTermSheetsLength: Scalars['Int']['output'];
  getTicket?: Maybe<Ticket>;
  getTicketComments: Array<TicketComment>;
  getTickets: Array<Ticket>;
  getTicketsLength: Scalars['Int']['output'];
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
  getTransactionsLength: Scalars['Int']['output'];
  getTransfer?: Maybe<Transfer>;
  getTransfers: Array<Transfer>;
  getTransfersLength: Scalars['Int']['output'];
  getUser?: Maybe<User>;
  getUserPolicy?: Maybe<UserPolicy>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  getUsersLength: Scalars['Int']['output'];
  /**
   * The caller's wallet, if one has been opened — null otherwise. Never opens one.
   * `ownerType: entity` reads the caller's active entity's wallet and needs the
   * `wallet:view` company permission; it defaults to the caller's own.
   */
  getWalletAccount?: Maybe<WalletAccount>;
  /** The wallet's activity, newest first, on the same owner rule as `getWalletAccount`. Empty if there is no wallet yet. */
  getWalletTransactions: Array<WalletTxn>;
  /**
   * The caller's own onboarding draft, or null if they have none — which is also
   * the answer once onboarding is finished and the draft has been discarded.
   */
  myOnboardingProgress?: Maybe<OnboardingProgress>;
  vapidPublicKey: VapidPublicKeyResponse;
};


export type QueryCounterpartyIdentityArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type QueryEvaluateEntityGateArgs = {
  action: GatedAction;
  entityId: Scalars['ID']['input'];
};


export type QueryGetAccessInviteArgs = {
  filter: AccessInviteFilter;
};


export type QueryGetAccessRequestArgs = {
  filter: AccessRequestFilter;
};


export type QueryGetAccessRequestsArgs = {
  filter?: InputMaybe<AccessRequestFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetAccessRequestsLengthArgs = {
  filter?: InputMaybe<AccessRequestFilter>;
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


export type QueryGetAssessmentShareGrantArgs = {
  filter?: InputMaybe<AssessmentShareGrantFilter>;
};


export type QueryGetAssessmentShareGrantsArgs = {
  filter?: InputMaybe<AssessmentShareGrantFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetAssessmentShareGrantsLengthArgs = {
  filter?: InputMaybe<AssessmentShareGrantFilter>;
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


export type QueryGetAssessmentsSharedWithMeArgs = {
  counterpartyKind?: InputMaybe<AssessmentCounterpartyKind>;
  pagination?: InputMaybe<Pagination>;
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
  offerRequestId: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
};


export type QueryGetCompanyMemberArgs = {
  filter?: InputMaybe<EntityMemberFilter>;
};


export type QueryGetCompanyMembersArgs = {
  filter?: InputMaybe<EntityMemberFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetCompanyMembersLengthArgs = {
  filter?: InputMaybe<EntityMemberFilter>;
};


export type QueryGetCompanyRoleArgs = {
  filter?: InputMaybe<EntityRoleFilter>;
};


export type QueryGetCompanyRolesArgs = {
  filter?: InputMaybe<EntityRoleFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetCompanyRolesLengthArgs = {
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
  entityType?: InputMaybe<EntityType>;
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
  offerRequestId: Scalars['ID']['input'];
};


export type QueryGetConditionsSubsequentArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type QueryGetConversationArgs = {
  filter?: InputMaybe<ConversationFilter>;
};


export type QueryGetConversationByReferenceNumberArgs = {
  referenceNumber: Scalars['String']['input'];
};


export type QueryGetConversationByUsersArgs = {
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  userId1: Scalars['ID']['input'];
  userId2: Scalars['ID']['input'];
  withParent?: InputMaybe<Scalars['Boolean']['input']>;
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
  offerRequestId: Scalars['ID']['input'];
};


export type QueryGetDiligenceItemsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type QueryGetDisbursementsArgs = {
  offerRequestId: Scalars['ID']['input'];
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
  entityId: Scalars['ID']['input'];
};


export type QueryGetEscrowEventsArgs = {
  transactionId: Scalars['ID']['input'];
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
  offerRequestId: Scalars['ID']['input'];
};


export type QueryGetFinancierArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFinancierAumSeriesArgs = {
  months?: InputMaybe<Scalars['Int']['input']>;
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
  id: Scalars['ID']['input'];
};


export type QueryGetIssuerPipelineSeriesArgs = {
  months?: InputMaybe<Scalars['Int']['input']>;
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
  loanId?: InputMaybe<Scalars['ID']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetLatestActiveDeclarationsByBorrowerArgs = {
  borrowerId: Scalars['ID']['input'];
};


export type QueryGetLatestActiveDeclarationsByLenderArgs = {
  financierId: Scalars['ID']['input'];
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
  offerRequestId: Scalars['ID']['input'];
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
  applicantUserId?: InputMaybe<Scalars['ID']['input']>;
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  subjectEntityId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetMyHeldDocumentsArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetMyPropertyViewingsArgs = {
  statuses?: InputMaybe<Array<PropertyViewingStatus>>;
};


export type QueryGetMySupportRequestArgs = {
  reference: Scalars['String']['input'];
};


export type QueryGetMySupportRequestsArgs = {
  filter?: InputMaybe<SupportRequestFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetMySupportRequestsLengthArgs = {
  filter?: InputMaybe<SupportRequestFilter>;
};


export type QueryGetMyTicketCommentsArgs = {
  filter: MyTicketCommentFilter;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetMyTicketCommentsLengthArgs = {
  filter: MyTicketCommentFilter;
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
  offerRequestId: Scalars['ID']['input'];
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


export type QueryGetPayoutAccountArgs = {
  ownerType: PayoutAccountOwner;
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPlatformFeeHistoryArgs = {
  feeType: Scalars['String']['input'];
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
  ownerId: Scalars['ID']['input'];
  pagination?: InputMaybe<Pagination>;
  portfolioId: Scalars['ID']['input'];
};


export type QueryGetPreTokenizedUnitsLengthArgs = {
  filter?: InputMaybe<PreTokenizedUnitFilter>;
  ownerId: Scalars['ID']['input'];
  portfolioId: Scalars['ID']['input'];
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
  portfolioId: Scalars['ID']['input'];
};


export type QueryGetPropertiesLengthArgs = {
  filter?: InputMaybe<PropertyFilter>;
};


export type QueryGetPropertyArgs = {
  filter: PropertyFilter;
};


export type QueryGetPropertyHeldDocumentsArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
};


export type QueryGetPropertyPipelineArgs = {
  range?: InputMaybe<DashboardRange>;
};


export type QueryGetPropertyPriceArgs = {
  filter: PropertyPriceFilter;
};


export type QueryGetPropertyPricesArgs = {
  filter?: InputMaybe<PropertyPriceFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetPropertyPricesLengthArgs = {
  filter?: InputMaybe<PropertyPriceFilter>;
};


export type QueryGetPropertyViewingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPropertyViewingsForMyUnitsArgs = {
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  statuses?: InputMaybe<Array<PropertyViewingStatus>>;
};


export type QueryGetPublicPortfolioUnitsArgs = {
  portfolioId: Scalars['ID']['input'];
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


export type QueryGetRentToBuyTxnArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
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


export type QueryGetSelfieSessionArgs = {
  filter: SelfieSessionFilter;
};


export type QueryGetSellerApproachArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSellerFinancingTxnArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSharedAssessmentOutputArgs = {
  assessmentId: Scalars['ID']['input'];
};


export type QueryGetSupportRequestArgs = {
  filter?: InputMaybe<SupportRequestAdminFilter>;
};


export type QueryGetSupportRequestStatusArgs = {
  reference: Scalars['String']['input'];
  replyEmail: Scalars['String']['input'];
};


export type QueryGetSupportRequestsArgs = {
  filter?: InputMaybe<SupportRequestAdminFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetSupportRequestsLengthArgs = {
  filter?: InputMaybe<SupportRequestAdminFilter>;
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


export type QueryGetTakenViewingSlotsArgs = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  propertyId: Scalars['ID']['input'];
  to?: InputMaybe<Scalars['DateTime']['input']>;
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
  ticketId: Scalars['ID']['input'];
};


export type QueryGetTicketsArgs = {
  filter?: InputMaybe<TicketFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetTicketsLengthArgs = {
  filter?: InputMaybe<TicketFilter>;
};


export type QueryGetTokenEventsArgs = {
  offerRequestId: Scalars['ID']['input'];
};


export type QueryGetTokenEventsByBorrowerArgs = {
  borrowerId: Scalars['ID']['input'];
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


export type QueryGetTransferArgs = {
  filter: TransferFilter;
};


export type QueryGetTransfersArgs = {
  filter?: InputMaybe<TransferFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type QueryGetTransfersLengthArgs = {
  filter?: InputMaybe<TransferFilter>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
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


export type QueryGetWalletAccountArgs = {
  ownerType?: InputMaybe<PayoutAccountOwner>;
};


export type QueryGetWalletTransactionsArgs = {
  kind?: InputMaybe<WalletTxnKind>;
  ownerType?: InputMaybe<PayoutAccountOwner>;
  pagination?: InputMaybe<Pagination>;
};

export type RateType =
  | 'FIXED'
  | 'FLOATING'
  | 'VARIABLE';

export type RecentActivity = {
  __typename?: 'RecentActivity';
  actorId?: Maybe<Scalars['ID']['output']>;
  actorName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  entityId?: Maybe<Scalars['ID']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  subtitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: RecentActivityType;
};

export type RecentActivityFilter = {
  actorId?: InputMaybe<IdOperator>;
  createdAt?: InputMaybe<DateOperator>;
  type?: InputMaybe<RecentActivityType>;
  types?: InputMaybe<Array<RecentActivityType>>;
};

export type RecentActivityType =
  | 'LEGAL'
  | 'PROPERTY'
  | 'TICKET'
  | 'TRANSACTION'
  | 'VERIFICATION';

export type ReleaseTokensToBuyerInput = {
  /** Amount to release; defaults to the loan's remaining escrowed token balance. */
  amount?: InputMaybe<Scalars['Float']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  offerRequestId: Scalars['ID']['input'];
  /** On-chain reference for the release, when the lender has one. Omit rather than invent. */
  txRef?: InputMaybe<Scalars['String']['input']>;
};

/**
 * The rent agreement's own lifecycle, independent of `stage`. A draft and a
 * sent-but-unsigned agreement both sit at `rent_agreement_issued`; this is what
 * tells them apart, and what gates the buyer's access to the document.
 */
export type RentAgreementStatus =
  /** Uploaded, vendor-only. The buyer cannot see it or its URL. */
  | 'draft'
  /** Countersigned by the vendor as Landlord — the agreement is executed. */
  | 'executed'
  /** Sent to the buyer. Either or both signatures may already be recorded. */
  | 'sent';

/**
 * The buyer asking to complete early (§7B).
 *
 * Sub-state rather than a stage of its own: a request can be raised, declined and
 * raised again without the deal moving.
 */
export type RentBuyoutRequest = {
  __typename?: 'RentBuyoutRequest';
  decidedAt?: Maybe<Scalars['String']['output']>;
  /** Shown to the buyer verbatim. */
  declineReason?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  requestedAt: Scalars['String']['output'];
  /** pending | approved | declined */
  status: Scalars['String']['output'];
};

/**
 * A warning served against arrears.
 *
 * Kept permanently, including after the arrears clear: notices are history, and a
 * terminated tenancy is a contested event where "which warnings were served, and
 * when" is the record that settles it. What is recomputed from live arrears is the
 * vendor's available ACTION, never this list.
 */
export type RentDefaultNotice = {
  __typename?: 'RentDefaultNotice';
  id: Scalars['ID']['output'];
  issuedAt: Scalars['String']['output'];
  /** Payments outstanding when it was issued — snapshotted, not recomputed. */
  missed: Scalars['Int']['output'];
  /** The vendor's own words, shown to the tenant verbatim. */
  note?: Maybe<Scalars['String']['output']>;
  step: RentDefaultStep;
};

/**
 * The default ladder (§6). PLATFORM POLICY, NOT A VENDOR TERM: the same three
 * rungs on every deal, so a tenant's position never depends on which vendor they
 * signed with. `current` is not a rung — it is the absence of one.
 */
export type RentDefaultStep =
  | 'current'
  /** 2 missed — the vendor may serve the final warning. */
  | 'final_warning'
  /** 3+ missed — the vendor may terminate and recover possession. */
  | 'termination'
  /** 1 payment missed — the vendor may serve a warning to pay. */
  | 'warning';

/** A vendor-filed record hanging off the deal. */
export type RentDocument = {
  __typename?: 'RentDocument';
  documentUrl: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** receipt | invoice | annex */
  kind: Scalars['String']['output'];
  /** Required on an annex — it is how the buyer tells them apart. */
  label?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['String']['output'];
  uploadedBy: Scalars['String']['output'];
};

/**
 * A leg of money through the platform's escrow on this deal. Exactly two per deal,
 * and neither is a deposit against a price:
 *
 *   reservation_fee — payable before the vendor reviews the request. Nothing is
 *                     being bought yet.
 *   option_fee      — consideration for the option, released to the vendor as
 *                     income once funded (§2.3).
 *
 * Each is paid from the buyer's wallet into the Afram pool in one mutation. The
 * stage moves when the money is held; the leg reads `pending` until the bank
 * confirms the transfer, then `confirmed`. A refused transfer puts the stage back.
 */
export type RentEscrowLeg = {
  __typename?: 'RentEscrowLeg';
  amount: Scalars['Float']['output'];
  confirmedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  instructedAt: Scalars['String']['output'];
  /** reservation_fee | option_fee */
  purpose: Scalars['String']['output'];
  /** pending | confirmed */
  status: Scalars['String']['output'];
};

/**
 * One month of rent.
 *
 * ⚠ Deliberately not an instalment. There is no principal, no interest, no period
 * rate and no credited portion — a month of rent is an amount and a due date. The
 * count of `paid` rows is what earns the right to buy (§2.2).
 */
export type RentPayment = {
  __typename?: 'RentPayment';
  /**
   * The agreed rent for this month — plan.monthlyRent when nothing has been
   * confirmed, and the figure actually taken once the month is paid. No split, no
   * credit component.
   */
  amount: Scalars['Float']['output'];
  /**
   * The vendor's confirmed figure for this month, when one governs it. Null when
   * the vendor confirmed nothing for the period — which is the ordinary case, and
   * means the agreed rent stands.
   */
  confirmedAmount?: Maybe<Scalars['Float']['output']>;
  dueDate: Scalars['String']['output'];
  /**
   * What the tenant owes for this month: confirmedAmount ?? the agreed rent.
   *
   * This is the figure `recordRentPayment` charges, resolved by the server so a
   * client never has to decide what the default is — two clients resolving it
   * could disagree about what is owed while the wallet settled the argument.
   * Show this, not `amount`.
   */
  effectiveAmount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  /** 1-based, in schedule order. */
  index: Scalars['Int']['output'];
  paidAt?: Maybe<Scalars['String']['output']>;
  /**
   * due | paid | late | processing. `processing`: the month's rent has been sent
   * to the vendor's payout account as a bank transfer and the bank has not
   * confirmed it yet — show it as being paid; it counts as neither paid nor
   * missed, and becomes `paid`, or goes back to what it was if the bank refuses.
   */
  status: Scalars['String']['output'];
};

/**
 * The vendor's proposed terms for the tenancy and the option.
 *
 * The server stores every figure verbatim and derives none of them: rent, term,
 * option fee and buy price are the vendor's commercial call, and the platform does
 * not price their property. There is no band validation on any of them.
 */
export type RentPlan = {
  __typename?: 'RentPlan';
  acceptedAt?: Maybe<Scalars['String']['output']>;
  /**
   * What they pay to take title after a full term. Fixed at signing and never
   * rewritten — an early completion is quoted separately in `settlement.amount`,
   * and the agreed figure stays readable here for audit (§2.5).
   *
   * Nothing is netted off it. The option fee is not credited against it (§2.3)
   * and the rent certainly is not (§2.1), so this figure is what it says.
   */
  buyPrice: Scalars['Float']['output'];
  /** vendor | buyer */
  insurance: Scalars['String']['output'];
  /** vendor | buyer */
  maintenance: Scalars['String']['output'];
  /**
   * Rent IN FULL. NOTHING is credited to the price — there is no equity portion,
   * and there must never be a companion field carrying one (§2.1).
   */
  monthlyRent: Scalars['Float']['output'];
  /**
   * Default 6 × monthlyRent, vendor-editable. CONSIDERATION, not a deposit: it
   * buys the right to purchase at a fixed price and is NOT credited toward
   * buyPrice. On release it is the vendor's income, not a liability against a
   * future sale (§2.3, confirmed under §12.1).
   *
   * A vendor who wants the fee to count toward the price expresses that by
   * setting a lower buyPrice — not by the server netting it off, which would put
   * AFRAM's arithmetic between two figures the parties agreed themselves.
   */
  optionFee: Scalars['Float']['output'];
  proposedAt: Scalars['String']['output'];
  /** Default 60, vendor-editable. What confirmRentFullyPaid counts against. */
  termMonths: Scalars['Int']['output'];
};

/**
 * The vendor's final figure to take title.
 *
 * AFRAM never invents it: `amount` is the vendor's typed input and the server
 * validates only that it is positive (§2.6). It NEVER writes back to
 * `plan.buyPrice` — a buyer completing early is quoted a new figure because the
 * agreed price assumed a full term of rent that will not now be paid, and both
 * numbers stay on the record (§2.5).
 */
export type RentSettlement = {
  __typename?: 'RentSettlement';
  amount: Scalars['Float']['output'];
  /** The breakdown — fees, rates, legal. */
  note?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['String']['output']>;
  setAt: Scalars['String']['output'];
};

/**
 * One party's signature on the rent agreement. Identical shape to the sibling
 * flows' SellerSpaSignature — the buyer signs as Tenant, the vendor as Landlord.
 */
export type RentSignature = {
  __typename?: 'RentSignature';
  /** The address the signature was made from, captured server-side. */
  ip?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /**
   * The signer's mark, when they drew one or uploaded a scan rather than only
   * typing their name. Null for a typed signature.
   */
  signatureImageUrl?: Maybe<Scalars['String']['output']>;
  signatureKind?: Maybe<SignatureKind>;
  signedAt: Scalars['String']['output'];
  signedCopyUrl?: Maybe<Scalars['String']['output']>;
};

/** The 17-stage rent-to-buy lifecycle. Values match the frontend's RentToBuyStage. */
export type RentToBuyStage =
  | 'closed'
  | 'commitment_deposit_paid'
  | 'completion_conditions_confirmed'
  | 'diligence_complete'
  /** Both parties confirmed the inspection, or the buyer waived it (AFR-229). */
  | 'inspection_complete'
  | 'occupancy_commenced'
  | 'option_exercised'
  | 'option_fee_funded'
  | 'option_fee_released'
  | 'rent_agreement_issued'
  | 'rent_agreement_signed'
  | 'rent_plan_accepted'
  | 'rent_plan_proposed'
  /** Where the deal sits for the whole term. The option is exercised out of it. */
  | 'renting'
  | 'request_submitted'
  | 'title_transferred'
  | 'under_review'
  | 'withdrawal_window_closed';

/**
 * Four ways to end and only one of them is completion. Both non-completions leave
 * `stage` exactly where it was — the deal stopped there, and the audit trail
 * should show where — while `status` records that it stopped.
 */
export type RentToBuyStatus =
  | 'active'
  | 'closed'
  /** A live tenancy ended on the default ladder. Nothing is returned. */
  | 'terminated'
  /** Before anyone is committed — the withdrawal window at `diligence_complete`. */
  | 'withdrawn';

/**
 * The listing's published indicative rent-to-buy terms, snapshotted at placement
 * and never mutated afterwards — the terms a deal was placed under are the terms
 * it is judged by, whatever the listing later says.
 *
 * ⚠ These are DEFAULTS, NOT LIMITS. 60 months and 6 months' rent are what the plan
 * builder opens with; the vendor may change both, and the server does not enforce
 * them. Nothing downstream of placement validates a proposed plan against this.
 */
export type RentToBuyTerms = {
  __typename?: 'RentToBuyTerms';
  /** Platform default 60. */
  defaultTermMonths: Scalars['Int']['output'];
  /** Defaults to the asking price. */
  indicativeBuyPrice: Scalars['Float']['output'];
  /** The vendor's published guide, or null when they never set one. */
  indicativeMonthlyRent?: Maybe<Scalars['Float']['output']>;
  /** Platform default 6 — the option fee is this many months' rent. */
  optionFeeMonths: Scalars['Int']['output'];
};

export type RentToBuyTxn = {
  __typename?: 'RentToBuyTxn';
  /**
   * missedPayments × plan.monthlyRent.
   *
   * ⚠ This is what is OVERDUE NOW, and it falls to zero when the arrears clear. It
   * is not a balance, and nothing on this deal accrues one.
   */
  arrears: Scalars['Float']['output'];
  /** The tenant, who becomes the buyer only if they exercise the option. */
  buyer?: Maybe<User>;
  /** Signs as Tenant. Recorded first, and does NOT execute the agreement. */
  buyerSignature?: Maybe<RentSignature>;
  buyoutRequest?: Maybe<RentBuyoutRequest>;
  createdAt: Scalars['String']['output'];
  /** REUSED from the vendor flow — same type, same 'AFRAM never scores' rule. */
  creditDecision?: Maybe<SellerCreditDecision>;
  currency: Scalars['String']['output'];
  defaultNotices: Array<RentDefaultNotice>;
  /** The rung those arrears reach. Follows missedPayments back down when they clear. */
  defaultStep: RentDefaultStep;
  /** REUSED from the vendor flow — the exchange is one shared table. */
  diligenceItems?: Maybe<Array<SellerDiligenceItem>>;
  documents: Array<RentDocument>;
  escrow: Array<RentEscrowLeg>;
  /** REUSED shape — the stepper's history and the audit trail read from it. */
  events?: Maybe<Array<SellerStageEvent>>;
  /** The vendor's confirmation that the full term was served — unlocks Buy Now. */
  fullyPaidConfirmedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** §2.1-2.3. Null on deals placed before the inspection contract shipped. */
  inspection?: Maybe<TransactionInspection>;
  /** The vendor — landlord for the term, seller at the end. */
  issuer?: Maybe<Entity>;
  /** Countersigns as Landlord — the executing signature. */
  issuerSignature?: Maybe<RentSignature>;
  /** Payments `late`, or unpaid with a due date in the past. Outstanding NOW. */
  missedPayments: Scalars['Int']['output'];
  /** Keys changed hands. Title did not move. */
  occupancyStartedAt?: Maybe<Scalars['String']['output']>;
  /** The RENT_TO_BUY offer request created at placement. The chat anchor. */
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  optionExercisedAt?: Maybe<Scalars['String']['output']>;
  /**
   * The whole schedule, every row, ordered by `index`.
   *
   * ⚠ NEVER paginated, truncated or lazily loaded, and nothing may add a limit to
   * it. A client counting `paid` rows here to decide whether Buy Now has unlocked
   * gets a SILENT under-report from a partial array — no error anywhere, the gate
   * simply never opens on a deal where the tenant has paid everything they owe.
   * Prefer the `paymentsMade` scalar below, which is the same number the server
   * gates on.
   */
  payments: Array<RentPayment>;
  /**
   * Payments `paid`. A COUNT — this is the gate on the right to buy (§2.2), never
   * a sum of money.
   *
   * Use this rather than counting `payments` client-side: it is the exact number
   * `confirmRentFullyPaid` compares against `plan.termMonths`, so the two sides
   * read one figure instead of two that have to agree.
   */
  paymentsMade: Scalars['Int']['output'];
  plan?: Maybe<RentPlan>;
  /** The name the buyer typed to accept the plan. */
  planAcceptedBy?: Maybe<Scalars['String']['output']>;
  /** The unit being rented, then bought. Read live, never a snapshot. */
  property?: Maybe<Property>;
  /** Human reference, e.g. RTB-2026-000123 — display this, route on `id`. */
  reference: Scalars['String']['output'];
  rentAgreementSentAt?: Maybe<Scalars['String']['output']>;
  rentAgreementStatus?: Maybe<RentAgreementStatus>;
  /** Null for the buyer while the status is `draft` — a draft is vendor-only. */
  rentAgreementUrl?: Maybe<Scalars['String']['output']>;
  /** Starts at 1; a revision answering a variation round bumps it. */
  rentAgreementVersion?: Maybe<Scalars['Int']['output']>;
  /** Payable before the vendor reviews the request. */
  reservationFee: Scalars['Float']['output'];
  settlement?: Maybe<RentSettlement>;
  signingDeadline?: Maybe<Scalars['String']['output']>;
  stage: RentToBuyStage;
  status: RentToBuyStatus;
  /**
   * Set on status `terminated`, and it is the WHOLE settlement. Rent was rent:
   * there is no refund calculation, no termination fee and no equity to release.
   */
  terminationReason?: Maybe<Scalars['String']['output']>;
  /** The listing's published terms as they stood at placement. */
  terms: RentToBuyTerms;
  /** The BUYER's confirmation that they have them. This is what closes the deal. */
  titleAcknowledgedAt?: Maybe<Scalars['String']['output']>;
  titleAcknowledgedBy?: Maybe<Scalars['String']['output']>;
  /** The vendor's assertion that they posted the documents. */
  titleTransferredAt?: Maybe<Scalars['String']['output']>;
  /** The property price, vendor-set. */
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  /** Append-only rounds; at most ONE open at a time. */
  variations?: Maybe<Array<RentVariation>>;
  /** Set on status `withdrawn`. */
  withdrawReason?: Maybe<Scalars['String']['output']>;
};

/**
 * A request to change the issued rent agreement, and its resolution. Append-only:
 * a second request never overwrites the first, and at most one may be open at a
 * time.
 *
 * ⚠ An open round blocks EXECUTION, not signing (§2.8). The buyer may sign while
 * their own round is open — held in the UI, never refused by the server, because a
 * buyer who decides the point was not worth it must still be able to sign the text
 * as it stands. The countersignature is what is refused.
 *
 * Deliberately the same shape as SellerSpaVariation so the vendor flow's modals
 * and hold card take it structurally.
 */
export type RentVariation = {
  __typename?: 'RentVariation';
  /** On `revised`: the agreement version that answered this round. */
  documentVersion?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  note: Scalars['String']['output'];
  requestedAt: Scalars['String']['output'];
  requestedByName: Scalars['String']['output'];
  /** Buyer | Issuer */
  requestedByRole: Scalars['String']['output'];
  /** Required (>=10 chars) when the round is declined. */
  resolutionNote?: Maybe<Scalars['String']['output']>;
  resolvedAt?: Maybe<Scalars['String']['output']>;
  /** 1-based, in request order. */
  round: Scalars['Int']['output'];
  status: RentVariationStatus;
};

/** A variation round is open until the vendor either revises or declines it. */
export type RentVariationStatus =
  /** Answered with a reason; the document stands as sent. */
  | 'declined'
  | 'open'
  /** Answered by a new version of the agreement. */
  | 'revised';

export type Repayment = {
  __typename?: 'Repayment';
  conversationId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['ID']['output']>;
  createdForId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  interestRate?: Maybe<Scalars['Float']['output']>;
  interestRateBps?: Maybe<Scalars['Int']['output']>;
  interestRateKind?: Maybe<Scalars['String']['output']>;
  isSubscribedToReferenceRate?: Maybe<Scalars['Boolean']['output']>;
  loanId?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  principalMinor?: Maybe<Scalars['String']['output']>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  repaymentFrequency?: Maybe<Scalars['String']['output']>;
  repaymentTerms?: Maybe<Scalars['JSONObject']['output']>;
  scheduleType?: Maybe<Scalars['String']['output']>;
  totalInterestMinor?: Maybe<Scalars['String']['output']>;
  totalRepaymentMinor?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RepaymentFilter = {
  conversationId?: InputMaybe<Scalars['ID']['input']>;
  createdById?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  scheduleType?: InputMaybe<Scalars['String']['input']>;
};

export type RepaymentFrequency =
  | 'ANNUALLY'
  | 'BI_WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUALLY'
  | 'WEEKLY';

export type RepaymentInstallment = {
  __typename?: 'RepaymentInstallment';
  amountFees: Scalars['String']['output'];
  amountInterest: Scalars['String']['output'];
  amountPaidToDate: Scalars['String']['output'];
  amountPrincipal: Scalars['String']['output'];
  amountTotal: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency: Scalars['String']['output'];
  dueDate: Scalars['String']['output'];
  /** Annual effective interest rate, in percent (24.5 = 24.5% a year). Null on installments scheduled before it was captured. */
  effectiveInterestRate?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  refNo: Scalars['String']['output'];
  repaymentId: Scalars['ID']['output'];
  sequenceNo: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Set when the lender waived what was left on the installment (status `waived`). What was waived is amountTotal less amountPaidToDate. */
  waivedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The lender's reason for the waiver. */
  waivedReason?: Maybe<Scalars['String']['output']>;
};

export type RepaymentTermChange = {
  __typename?: 'RepaymentTermChange';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  decidedAt?: Maybe<Scalars['DateTime']['output']>;
  decidedBy?: Maybe<Scalars['JSONObject']['output']>;
  decisionComment?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  proposedAt?: Maybe<Scalars['DateTime']['output']>;
  proposedBy?: Maybe<Scalars['JSONObject']['output']>;
  repaymentId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updates: Scalars['JSONObject']['output'];
};

export type RepaymentTerms = {
  __typename?: 'RepaymentTerms';
  defaultFee: DefaultFee;
  defaultFeeDays: Scalars['Int']['output'];
  defaultPenalty: Scalars['Float']['output'];
  defaultRemedyFeeAmount: Scalars['Float']['output'];
  hasDefaultingPenalties: Scalars['Boolean']['output'];
  penaltyAmount: Scalars['Float']['output'];
  penaltyPercentage: Scalars['Float']['output'];
  penaltyType: PenaltyType;
  prepaymentAllowed: Scalars['Boolean']['output'];
  prepaymentDays: Scalars['Int']['output'];
  prepaymentFeeAmount: Scalars['Float']['output'];
  prepaymentFeePercentage: Scalars['Float']['output'];
  prepaymentFeeType: PrepaymentFeeType;
  prepaymentTerms: PrepaymentTerms;
  remedyDefaultingDays: Scalars['Int']['output'];
};

export type RepaymentTermsInput = {
  defaultFee?: InputMaybe<DefaultFeeInput>;
  defaultFeeDays?: InputMaybe<Scalars['Int']['input']>;
  defaultPenalty?: InputMaybe<Scalars['Float']['input']>;
  defaultRemedyFeeAmount?: InputMaybe<Scalars['Float']['input']>;
  hasDefaultingPenalties?: InputMaybe<Scalars['Boolean']['input']>;
  penaltyAmount?: InputMaybe<Scalars['Float']['input']>;
  penaltyPercentage?: InputMaybe<Scalars['Float']['input']>;
  penaltyType?: InputMaybe<PenaltyType>;
  prepaymentAllowed?: InputMaybe<Scalars['Boolean']['input']>;
  prepaymentDays?: InputMaybe<Scalars['Int']['input']>;
  prepaymentFeeAmount?: InputMaybe<Scalars['Float']['input']>;
  prepaymentFeePercentage?: InputMaybe<Scalars['Float']['input']>;
  prepaymentFeeType?: InputMaybe<PrepaymentFeeType>;
  prepaymentTerms?: InputMaybe<PrepaymentTermsInput>;
  remedyDefaultingDays?: InputMaybe<Scalars['Int']['input']>;
};

export type RepaymentType =
  | 'BOND'
  | 'FIXED_DEPOSIT'
  | 'TRADITIONAL_LOAN';

export type ReplySupportRequestInput = {
  attachments?: InputMaybe<Array<SupportAttachmentInput>>;
  /** Up to 4,000 characters. May be empty when files are attached. */
  body?: InputMaybe<Scalars['String']['input']>;
  idempotencyKey: Scalars['String']['input'];
  reference: Scalars['String']['input'];
  /** `public` goes to the member and is their answer; `internal` stays with staff. */
  visibility: SupportMessageVisibility;
};

export type RequestAccessInput = {
  email: Scalars['String']['input'];
  /** 2–120 characters. */
  fullName: Scalars['String']['input'];
  /** 7–20 digits; `+ ( ) -` and spaces allowed. */
  phone: Scalars['String']['input'];
  role: AccessRole;
};

export type RequestAccessResponse = {
  __typename?: 'RequestAccessResponse';
  /** Shown to the person as written. */
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type RequestedRole =
  | 'admin'
  | 'agent'
  | 'buyer'
  | 'financier'
  | 'issuer'
  | 'seller';

export type RequirementLevel =
  | 'advisory'
  | 'if_applicable'
  | 'mandatory';

/** The party responsible for satisfying a condition precedent. */
export type ResponsibleParty =
  | 'BORROWER'
  | 'FINANCIER';

export type RevaluePropertyInput = {
  /** The valuer who performed the valuation. */
  independentValuer: Scalars['String']['input'];
  /** The new valuation, in the property's currency. Becomes its price. */
  valuationAmount: Scalars['Float']['input'];
  /** When the valuation was performed (YYYY-MM-DD). Not in the future. */
  valuationDate: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  comment: Scalars['String']['output'];
  conversationId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  propertyId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  replies?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Scalars['ID']['output'];
  userAvatar?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export type ReviewFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};

export type ReviewOfferDocumentItem = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status: OfferRequestDocumentStatus;
};

export type RoleFetchType =
  | 'dev_buyer'
  | 'financier';

export type RoleRequest = {
  __typename?: 'RoleRequest';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  documents?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  requestedAt?: Maybe<Scalars['DateTime']['output']>;
  role: RequestedRole;
  status?: Maybe<RoleRequestStatus>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RoleRequestStatus =
  | 'approved'
  | 'pending'
  | 'rejected';

export type RoleVerifiedPayload = {
  __typename?: 'RoleVerifiedPayload';
  userType: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
};

/**
 * The Sale & Purchase Agreement's own lifecycle, independent of `stage`. A draft
 * and a sent-but-unsigned agreement both sit at stage `sale_agreement_pending`;
 * this is what tells them apart, and what gates the buyer's access to the
 * document — a `draft` is issuer-only.
 *
 * "Buyer signed, awaiting the issuer" is `awaiting_signatures` with
 * `buyerSignature` set. There is no extra stage for it: the stage values are
 * shared verbatim with the frontend's cash-purchase-stages.ts.
 */
export type SaleAgreementStatus =
  /** Sent to the buyer. Either or both signatures may already be recorded. */
  | 'awaiting_signatures'
  /** Uploaded, issuer-only. The buyer cannot see it or its URL. */
  | 'draft'
  /** Countersigned by the issuer — the agreement is executed. */
  | 'executed'
  /**
   * Withdrawn with no replacement pending. Reserved: `reissueSaleAgreement` voids
   * the round and goes straight back to `draft`, since the issuer is on their way
   * to uploading a corrected copy. Read it, do not expect to see it.
   */
  | 'voided';

export type SaveUserPolicyInput = {
  data: Scalars['JSON']['input'];
  role: UserPolicyRole;
  schemaVersion: Scalars['Int']['input'];
};

export type ScheduleType =
  | 'FINANCIER'
  | 'ISSUER';

/**
 * One installment of a repayment schedule, as the financier (or seller-financing
 * issuer) supplies it. Money in major units. The split is optional — without it
 * the whole amount is principal — but when given it must add up to `amount`.
 */
export type ScheduledInstallmentInput = {
  amount: Scalars['Float']['input'];
  /** YYYY-MM-DD. Not in the past; no two installments on the same day. */
  dueDate: Scalars['String']['input'];
  /** Annual effective interest rate, in percent (24.5 = 24.5% a year). Recorded as given; zero or more. */
  effectiveInterestRate: Scalars['Float']['input'];
  fees?: InputMaybe<Scalars['Float']['input']>;
  interest?: InputMaybe<Scalars['Float']['input']>;
  principal?: InputMaybe<Scalars['Float']['input']>;
};

export type SelfieSession = {
  __typename?: 'SelfieSession';
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /**
   * data:image/jpeg;base64,… (or image/png, image/webp). Present ONLY on
   * SUBMITTED, ONLY to the holder of the key, and ONLY on the first read that
   * finds it: the server deletes the photo as it hands it over.
   */
  image?: Maybe<Scalars['String']['output']>;
  status: SelfieSessionStatus;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
};

/**
 * Finds a selfie session by its key. The key is a secret the computer holds, not
 * a searchable value, so only `key.eq` is accepted — any other operator is
 * refused.
 */
export type SelfieSessionFilter = {
  key: StringOperator;
};

/**
 * Live selfie hand-off (NIA onboarding §2). The computer opens a session by id =
 * base64url(SHA-256(key)) and reads it back by key; the phone writes by id.
 */
export type SelfieSessionStatus =
  | 'CLOSED'
  | 'EXPIRED'
  | 'OPENED'
  | 'SUBMITTED'
  | 'WAITING';

/**
 * A buyer's approach to a seller, placed BEFORE any financier is involved
 * (D72/D74).
 *
 * This is a phase in front of the seventeen financier stages, not one of them. The
 * offer request does not exist until the approach converts, and the financier never
 * sees the phase — they receive its output (the property pack, the acceptance, the
 * exchange record) as documents in their file.
 *
 * Two promises the server keeps, and the reason most of the fields below exist:
 *
 *   * NOTHING HAPPENS BEFORE THE MONEY CLEARS. Placing an approach notifies
 *     nobody and changes no listing. The clock starts when the deposit is held in
 *     the Afram pool, and the seller first hears of it when the bank confirms.
 *   * EVERY NON-CONVERTED CLOSE REFUNDS IN FULL, no deductions — declined,
 *     lapsed, superseded, withdrawn. Conversion is the one exception, because
 *     there the deposit became the buyer's equity instead of coming back.
 */
export type SellerApproach = {
  __typename?: 'SellerApproach';
  buyerName: Scalars['String']['output'];
  clock: SlaClock;
  /** Why this approach ended, in the words shown to the party who did not end it. */
  closedReason?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  /** Only where the seller chose to give one — declining without a reason is allowed. */
  declineReason?: Maybe<Scalars['String']['output']>;
  depositAmount: Scalars['Float']['output'];
  /** Resolved from the listing's commitmentDepositPct, or the platform default. */
  depositPct: Scalars['Float']['output'];
  diligenceItems?: Maybe<Array<ApproachDiligenceItem>>;
  /**
   * Handed over by the seller once they have accepted — the SPA, for now. Empty
   * until then.
   */
  documents?: Maybe<Array<ApproachDocument>>;
  escrowEvents?: Maybe<Array<EscrowEvent>>;
  id: Scalars['ID']['output'];
  issuerName?: Maybe<Scalars['String']['output']>;
  /**
   * When the buyer last reminded the seller. Unset until the first reminder.
   *
   * The button's own rule is derivable from this and `openedAt`: 48 hours after
   * opening for the first reminder, then one per 24 hours. The server enforces it
   * either way.
   */
  lastNudgeAt?: Maybe<Scalars['String']['output']>;
  /** The requests placed once converted. Empty until then. */
  offerRequestIds?: Maybe<Array<Scalars['ID']['output']>>;
  /** Deposit cleared and the seller was notified. The phase begins here. */
  openedAt?: Maybe<Scalars['String']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  propertyId: Scalars['ID']['output'];
  propertyImage?: Maybe<Scalars['String']['output']>;
  propertyName: Scalars['String']['output'];
  /**
   * True when the phase is complete enough to convert: the deposit is confirmed
   * AND all three property-pack categories carry at least one file. The buyer's
   * convert button reads this rather than re-deriving it.
   */
  readyToConvert: Scalars['Boolean']['output'];
  /** Human-facing code — display this, route on `id`. */
  reference?: Maybe<Scalars['String']['output']>;
  /** Total returned on a closed approach. Null while nothing has been returned. */
  refundedAmount?: Maybe<Scalars['Float']['output']>;
  respondedAt?: Maybe<Scalars['String']['output']>;
  /**
   * awaiting_payment | awaiting_seller | accepted | declined | lapsed |
   * superseded | withdrawn | converted
   */
  status: Scalars['String']['output'];
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

/**
 * The issuer's own credit decision on this buyer. AFRAM never scores: there is no
 * derived rating or recommendation anywhere on this record, and the basis is what
 * the issuer says they relied on.
 */
export type SellerCreditDecision = {
  __typename?: 'SellerCreditDecision';
  /**
   * diligence_documents | assessment_documents | income_evidence | own_checks |
   * existing_relationship
   */
  basis: Array<Scalars['String']['output']>;
  decidedAt: Scalars['String']['output'];
  /** Snapshotted display name — a later rename never rewrites a recorded decision. */
  decidedByName: Scalars['String']['output'];
  /** Required (>=10 chars) unless the outcome is `approved`. */
  note?: Maybe<Scalars['String']['output']>;
  /** approved | approved_with_conditions | declined */
  outcome: Scalars['String']['output'];
};

/**
 * One §5 due-diligence category on the deal — the surface behind the tracker's
 * documents rail ("Waiting on you / Waiting on the issuer / Settled"). Placement
 * seeds every applicable category in both directions: required ones at
 * `requested`, optional ones at `not_requested` for the requester to open.
 */
export type SellerDiligenceDocument = {
  __typename?: 'SellerDiligenceDocument';
  documentUrl: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /**
   * `upload` when someone supplied it against this request; `listing`,
   * `portfolio`, `approach` or `compliance` when the platform attached a document it already held rather
   * than ask the issuer for it again. `readiness` or `diligence` when the buyer
   * submitted a file of theirs Afram already held — verified in their readiness
   * assessment, or accepted on an earlier deal.
   */
  source: Scalars['String']['output'];
  /** One line saying where a carried-over file came from. Null on an upload. */
  sourceNote?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['String']['output'];
  /** Buyer | Issuer */
  uploadedBy: Scalars['String']['output'];
};

export type SellerDiligenceItem = {
  __typename?: 'SellerDiligenceItem';
  /**
   * Catalogue id, shared verbatim with the frontend's category constant, or
   * `other:<direction>` on an ad-hoc request.
   */
  categoryId: Scalars['String']['output'];
  /** Ad-hoc requests only. */
  customLabel?: Maybe<Scalars['String']['output']>;
  /** Ad-hoc requests only. */
  customNote?: Maybe<Scalars['String']['output']>;
  /**
   * issuer_to_buyer | buyer_to_issuer — the direction of the REQUEST, not of the
   * documents. `issuer_to_buyer` is the issuer asking the buyer: the issuer
   * requests and receives, the buyer responds and supplies.
   */
  direction: Scalars['String']['output'];
  documents?: Maybe<Array<SellerDiligenceDocument>>;
  documentsCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  /**
   * The buyer's own documents already on file that answer this ask — verified in
   * their readiness assessment, or accepted by a seller on an earlier deal. Offer
   * them on the buyer's rail; submitting one goes through the ordinary submit
   * mutation and is recorded with that provenance.
   *
   * Buyer only: always empty for the seller. Also empty on a request the buyer
   * makes, on a category not yet opened, once the item is accepted or waived, and
   * for any file already submitted here.
   */
  onFile: Array<HeldDocument>;
  /** What the requester said needs addressing. Set while status is `queried`. */
  query?: Maybe<Scalars['String']['output']>;
  /** not_requested | requested | submitted | queried | accepted | waived */
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  /** Why the requester let this go. Set when status is `waived`. */
  waiverReason?: Maybe<Scalars['String']['output']>;
};

/**
 * A leg of money through the platform's escrow on this deal.
 *
 * Since D71 that covers the commitment deposit as well as the down payment: the
 * deposit is the first slice of the down payment, paid into the same Afram pool
 * the same way. `purpose` is what tells the two apart, and it
 * is what the deposit line on a receipt is labelled from.
 *
 * ⚠ On a LEGACY deal (placed before D71) the deposit never appears here at all —
 * it was paid directly to the issuer and lives on the transaction as
 * `depositDeclaredAt` / `depositReference`. Those two populations coexist
 * permanently and a surface that renders escrow legs must not conclude from an
 * empty list that nothing was paid.
 */
export type SellerEscrowEvent = {
  __typename?: 'SellerEscrowEvent';
  amount: Scalars['Float']['output'];
  confirmedAt?: Maybe<Scalars['String']['output']>;
  /** in (buyer → escrow) | out (escrow → issuer) */
  direction: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instructedAt: Scalars['String']['output'];
  providerName?: Maybe<Scalars['String']['output']>;
  providerReference?: Maybe<Scalars['String']['output']>;
  /**
   * commitment_deposit | down_payment | release_to_issuer.
   *
   * Null on legs written before D71 — read those as down-payment money, which is
   * the only thing an in-leg could have been then. Without it a deposit leg
   * renders as "Down payment", which is wrong on the buyer's proof of payment.
   */
  purpose?: Maybe<Scalars['String']['output']>;
  /**
   * Why this leg ended where it did. Always set on failed / returned / reversed —
   * a refund the payer cannot get a sentence about is a refund they have to ring
   * someone to understand. Null on the ordinary path.
   */
  reason?: Maybe<Scalars['String']['output']>;
  /** pending | received | settled | failed | returned | reversed */
  status: Scalars['String']['output'];
};

/** The 16-stage seller-financing lifecycle. Values match the frontend's SellerFinancingStage. */
export type SellerFinancingStage =
  | 'closed'
  | 'commitment_deposit_paid'
  | 'completion_conditions_confirmed'
  | 'diligence_complete'
  | 'discharge_issued'
  | 'down_payment_funded'
  | 'down_payment_released'
  /** Both parties confirmed the inspection, or the buyer waived it (AFR-229). */
  | 'inspection_complete'
  | 'payment_plan_accepted'
  | 'payment_plan_proposed'
  /** Stages 14–16 are driven by loan servicing, not by this surface. */
  | 'repaying'
  | 'request_submitted'
  | 'spa_issued'
  | 'spa_signed'
  | 'title_settled'
  | 'under_review'
  | 'withdrawal_window_closed';

/**
 * active | declined | withdrawn | closed. A declined credit decision or a
 * withdrawal ends the deal: `status` changes, `stage` stays where it was, and the
 * listing returns to market.
 */
export type SellerFinancingStatus =
  | 'active'
  | 'closed'
  | 'declined'
  | 'withdrawn';

/**
 * The listing's published seller-financing band, snapshotted at placement and
 * never mutated afterwards — the terms a deal was placed under are the terms it is
 * judged by, whatever the listing later says.
 */
export type SellerFinancingTerms = {
  __typename?: 'SellerFinancingTerms';
  additionalCriteria?: Maybe<Scalars['String']['output']>;
  /** Published band: 0–30. Indicative only — the plan carries the real rate. */
  indicativeInterestRatePct: Scalars['Float']['output'];
  maxTenorMonths: Scalars['Int']['output'];
  /** Published band: 5–50. */
  minDownPaymentPct: Scalars['Float']['output'];
  /** Published band: 6–180. */
  minTenorMonths: Scalars['Int']['output'];
  /** monthly | quarterly | biannually | annually */
  repaymentFrequency: Scalars['String']['output'];
  /** retained_until_settlement | transferred_with_security */
  titleStructure: Scalars['String']['output'];
};

export type SellerFinancingTxn = {
  __typename?: 'SellerFinancingTxn';
  buyer?: Maybe<User>;
  /** Recorded first. Does NOT execute the agreement. */
  buyerSignature?: Maybe<SellerSpaSignature>;
  createdAt: Scalars['String']['output'];
  creditDecision?: Maybe<SellerCreditDecision>;
  currency: Scalars['String']['output'];
  /** From a declined credit decision. */
  declineReason?: Maybe<Scalars['String']['output']>;
  /** depositPct × unitPrice, rounded. */
  depositAmount: Scalars['Float']['output'];
  depositDeclaredAt?: Maybe<Scalars['String']['output']>;
  /** The listing's commitment deposit % (default 10). */
  depositPct: Scalars['Float']['output'];
  /**
   * The reference the ISSUER reports having received the deposit against. Null
   * until they declare it — this is their evidence, not the buyer's, which is why
   * it is a separate field from `paymentReference` and appears later.
   */
  depositReference?: Maybe<Scalars['String']['output']>;
  /** The §5 exchange, both directions — feeds the documents rail. */
  diligenceItems?: Maybe<Array<SellerDiligenceItem>>;
  /** Issuer-uploaded annexes and the invoice. */
  documents?: Maybe<Array<SellerTransactionDocument>>;
  /**
   * What the buyer still has to fund toward the down payment — the OUTSTANDING
   * balance, not the agreed figure (§10, D71):
   *
   *   max(0, paymentPlan.downPaymentAmount − confirmed escrow in)
   *
   * The commitment deposit cleared into the same escrow account at stage 1, so it
   * has already paid down part of what was agreed. Returned and reversed legs do
   * not count as confirmed — that money went back.
   *
   * Before a plan exists there is nothing agreed to net against, so this reads as
   * the pre-plan estimate: terms.minDownPaymentPct × unitPrice, the published
   * minimum, unnetted.
   *
   * Zero is a legitimate value and not an error: the deposit band runs to 30% of
   * the price against a 20% minimum down payment, so a deal can arrive at stage 10
   * already funded. instructDownPayment handles that case by advancing the stage.
   */
  downPaymentDue: Scalars['Float']['output'];
  escrowEvents?: Maybe<Array<SellerEscrowEvent>>;
  events?: Maybe<Array<SellerStageEvent>>;
  id: Scalars['ID']['output'];
  /** §2.1-2.3. Null on deals placed before the inspection contract shipped. */
  inspection?: Maybe<TransactionInspection>;
  /** The issuer selling the unit — on this path also the lender. */
  issuer?: Maybe<Entity>;
  /** The issuer's countersignature, as Lender — the executing signature. */
  issuerSignature?: Maybe<SellerSpaSignature>;
  /** The SELLER_FINANCING offer request created at placement. */
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  paymentPlan?: Maybe<SellerPaymentPlan>;
  /**
   * RETIRED for deals placed since D71, where it is always null: the deposit is
   * instructed through the platform into escrow, so there is no transfer for the
   * buyer to annotate and no issuer account to send it to. It keeps its value on
   * legacy deals, where it is the reference the buyer quoted on their transfer.
   */
  paymentReference?: Maybe<Scalars['String']['output']>;
  /**
   * The parent portfolio's display name. Kept on the transaction because
   * Property.portfolio is only populated by the listing brokers.
   */
  projectName?: Maybe<Scalars['String']['output']>;
  /** The unit being bought. Read live off the properties table, never a snapshot. */
  property?: Maybe<Property>;
  /** Issued receipts, oldest first. Immutable once issued. */
  receipts?: Maybe<Array<SellerReceipt>>;
  /** Human reference, e.g. SF-2026-000123 — display this, route on `id`. */
  reference: Scalars['String']['output'];
  saleAgreementSentAt?: Maybe<Scalars['String']['output']>;
  saleAgreementStatus?: Maybe<SellerSpaStatus>;
  /** Null for the buyer while the status is `draft` — a draft is issuer-only. */
  saleAgreementUrl?: Maybe<Scalars['String']['output']>;
  /** Starts at 1; a revision answering a variation round bumps it. */
  saleAgreementVersion?: Maybe<Scalars['Int']['output']>;
  signingDeadline?: Maybe<Scalars['String']['output']>;
  stage: SellerFinancingStage;
  /**
   * The same history as `events`, in the flow-agnostic `StageEvent` shape (§6).
   *
   * A projection of the same rows, not a second log. Prefer it over `events` in
   * new work — it is identical across all three flows.
   */
  stageEvents: Array<StageEvent>;
  status: SellerFinancingStatus;
  terms: SellerFinancingTerms;
  titleSettledAt?: Maybe<Scalars['String']['output']>;
  /**
   * Inert on this surface: under retained_until_settlement title does not pass
   * until final payment, which is stage 15/16 in loan servicing.
   */
  tokensTransferred?: Maybe<Scalars['Boolean']['output']>;
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  variations?: Maybe<Array<SellerSpaVariation>>;
  withdrawalReason?: Maybe<Scalars['String']['output']>;
  /** Buyer | Issuer */
  withdrawnBy?: Maybe<Scalars['String']['output']>;
};

/**
 * The issuer's proposed terms. Non-binding: the SPA is the contract. The server
 * stores the inputs verbatim and derives only the two amounts.
 */
export type SellerPaymentPlan = {
  __typename?: 'SellerPaymentPlan';
  acceptedAt?: Maybe<Scalars['String']['output']>;
  /** The buyer's typed name. */
  acceptedSignature?: Maybe<Scalars['String']['output']>;
  /** Resolved cash figure, rounded to the cedi — server-derived. */
  downPaymentAmount: Scalars['Float']['output'];
  /** percentage | amount — how the issuer entered it. */
  downPaymentMode: Scalars['String']['output'];
  downPaymentValue: Scalars['Float']['output'];
  /** unitPrice − downPaymentAmount — server-derived. */
  financedAmount: Scalars['Float']['output'];
  interestRatePct: Scalars['Float']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  proposedAt: Scalars['String']['output'];
  repaymentFrequency: Scalars['String']['output'];
  tenorMonths: Scalars['Int']['output'];
};

/**
 * An immutable record of what has been received. Server-generated, never
 * uploaded, and never recomputed after issue — the basis and rate-table version
 * are stored on the row precisely so a historical receipt still says what it said
 * the day it was issued.
 *
 * Statutory charges are computed on the FULL price and never apportioned across
 * part-payments, which is why `balance` is large on an early receipt.
 */
export type SellerReceipt = {
  __typename?: 'SellerReceipt';
  /** max(0, grossPayable − totalReceived). */
  balance: Scalars['Float']['output'];
  /** tax_exclusive (default) | tax_inclusive */
  basis: Scalars['String']['output'];
  /** escrow_confirmed | issuer_declared | mixed */
  evidence: Scalars['String']['output'];
  getfundAmount: Scalars['Float']['output'];
  grossPayable: Scalars['Float']['output'];
  /** The unit price this receipt was raised against. */
  headlinePrice: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  issuedAt: Scalars['String']['output'];
  netAmount: Scalars['Float']['output'];
  nhilAmount: Scalars['Float']['output'];
  /** AFR-RCT-<last 8 of txn id>-<seq>. Stable once issued. */
  number: Scalars['String']['output'];
  paidBy: Scalars['String']['output'];
  payments: Array<SellerReceiptPayment>;
  /** The statutory rate table in force at issue, e.g. GH-2026.01. */
  rateTableVersion: Scalars['String']['output'];
  /** The ISSUER's display name — never AFRAM, which does not receive this money. */
  receivedBy: Scalars['String']['output'];
  settled: Scalars['Boolean']['output'];
  totalReceived: Scalars['Float']['output'];
  /** The three heads stay three lines — three different Acts, never one blend. */
  vatAmount: Scalars['Float']['output'];
};

/**
 * One payment line on an issued receipt, copied from its source at issue time.
 *
 * `evidence` is the field that keeps §1.3 honest on paper: a commitment deposit is
 * `issuer_declared` on a legacy deal — the issuer's word, their bank reference,
 * their name — while an escrow leg is `escrow_confirmed` — the bank's confirmation
 * of its transfer into the Afram pool, with its reference. A receipt must never present the two as equally witnessed.
 */
export type SellerReceiptPayment = {
  __typename?: 'SellerReceiptPayment';
  amount: Scalars['Float']['output'];
  /** Provider name, or the issuer's display name. */
  attestedBy: Scalars['String']['output'];
  /** escrow_confirmed | issuer_declared */
  evidence: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Commitment deposit | Down payment */
  label: Scalars['String']['output'];
  receivedAt: Scalars['String']['output'];
  /** Provider reference, or the issuer's declared bank reference. */
  reference: Scalars['String']['output'];
};

/** One party's signature on the SPA. Identical to the cash flow's SpaSignature. */
export type SellerSpaSignature = {
  __typename?: 'SellerSpaSignature';
  /**
   * The address the signature was made from, captured server-side. Null for
   * anything signed before this was captured.
   */
  ip?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /**
   * The signer's mark, when they drew one or uploaded a scan of one rather than
   * only typing their name. Null for a typed signature and for anything signed
   * before marks could be sent.
   */
  signatureImageUrl?: Maybe<Scalars['String']['output']>;
  /** How the mark was made. Null for a signature recorded before this was captured. */
  signatureKind?: Maybe<SignatureKind>;
  signedAt: Scalars['String']['output'];
  signedCopyUrl?: Maybe<Scalars['String']['output']>;
};

/**
 * The Sale & Purchase Agreement's own lifecycle, independent of `stage`. A draft
 * and a sent-but-unsigned agreement both sit at stage `spa_issued`; this is what
 * tells them apart, and what gates the buyer's access to the document.
 */
export type SellerSpaStatus =
  /** Sent to the buyer. Either or both signatures may already be recorded. */
  | 'awaiting_signatures'
  /** Uploaded, issuer-only. The buyer cannot see it or its URL. */
  | 'draft'
  /** Countersigned by the issuer — the agreement is executed. */
  | 'executed';

/**
 * A request to change the issued SPA, and its resolution. Append-only: a second
 * request never overwrites the first, and every round keeps its own note,
 * requester and outcome permanently.
 */
export type SellerSpaVariation = {
  __typename?: 'SellerSpaVariation';
  /** On `revised`: the SPA version that answered this round. */
  documentVersion?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  note: Scalars['String']['output'];
  requestedAt: Scalars['String']['output'];
  requestedByName: Scalars['String']['output'];
  /** Buyer | Issuer */
  requestedByRole: Scalars['String']['output'];
  /** Required when the round is declined. */
  resolutionNote?: Maybe<Scalars['String']['output']>;
  resolvedAt?: Maybe<Scalars['String']['output']>;
  /** 1-based, append-only. */
  round: Scalars['Int']['output'];
  status: SellerVariationStatus;
};

/** Identical shape to the cash flow's CashStageEvent. */
export type SellerStageEvent = {
  __typename?: 'SellerStageEvent';
  /** Buyer | Issuer | Platform */
  actor: Scalars['String']['output'];
  /** Null on the initial event. */
  fromStage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  toStage: Scalars['String']['output'];
};

/**
 * An issuer-uploaded record attached to the deal.
 *
 * `receipt` here is the issuer's OWN receipt file — their letterhead, their
 * numbering — and is never merged with `receipts`. Those are the receipts AFRAM
 * builds from the payments actually on record and stands behind; this is a file
 * that is stored and shown, never read: the server does not total or reconcile
 * what is printed on it.
 */
export type SellerTransactionDocument = {
  __typename?: 'SellerTransactionDocument';
  documentUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** spa_annex | invoice | receipt */
  kind: Scalars['String']['output'];
  /** Required on an annex, optional on a receipt, null on the invoice. */
  label?: Maybe<Scalars['String']['output']>;
  uploadedAt: Scalars['String']['output'];
  /** Issuer */
  uploadedBy: Scalars['String']['output'];
};

/** A variation round is open until the issuer either revises or declines it. */
export type SellerVariationStatus =
  /** Answered with a reason; the document stands as sent. */
  | 'declined'
  | 'open'
  /** Answered by a new SPA version. */
  | 'revised';

export type SendMessageInput = {
  attachmentComment?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['JSONObject']['input'];
  conversationId: Scalars['ID']['input'];
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  messageType: Scalars['String']['input'];
  pollData?: InputMaybe<Scalars['JSONObject']['input']>;
  replyTo?: InputMaybe<Scalars['JSONObject']['input']>;
  senderPicture?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};

export type SendNotificationInput = {
  body: Scalars['String']['input'];
  brand?: InputMaybe<Scalars['String']['input']>;
  kind?: InputMaybe<Array<Scalars['String']['input']>>;
  payload?: InputMaybe<Scalars['JSON']['input']>;
  recipient?: InputMaybe<NotificationRecipientInput>;
  recipients?: InputMaybe<Array<NotificationRecipientInput>>;
  title: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SenderType =
  | 'automated'
  | 'system'
  | 'user';

export type SetSupportRequestStatusInput = {
  reference: Scalars['String']['input'];
  status: SupportStatus;
};

export type SetSupportUserInitialPasswordInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type SetSupportUserInitialPasswordPayload = {
  __typename?: 'SetSupportUserInitialPasswordPayload';
  email: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/**
 * How a signer made their mark.
 *
 * Worth recording rather than inferring, because the three are not equivalent
 * evidence: a drawn mark is the signer's own hand, an uploaded one is a scan or
 * photograph of it, and a typed name is an attestation that they meant to sign.
 * A dispute will ask which it was, and the answer has to survive the session.
 *
 * `TYPED` is the only kind that carries no image — the other two are always
 * accompanied by a `signatureImageUrl`.
 */
export type SignatureKind =
  | 'DRAWN'
  | 'TYPED'
  | 'UPLOADED';

/**
 * A single party's signature on a document, with the audit context captured at the
 * moment of signing. Party is BORROWER or FINANCIER.
 */
export type SignatureRecord = {
  __typename?: 'SignatureRecord';
  actorId?: Maybe<Scalars['ID']['output']>;
  /** The signed copy of the document this party uploaded when signing, if any. */
  documentUrl?: Maybe<Scalars['String']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  party: Scalars['String']['output'];
  /**
   * The signer's mark, when they drew one or uploaded a scan of one rather than
   * only typing their name. Null for a typed signature and for anything signed
   * before marks could be sent.
   */
  signatureImageUrl?: Maybe<Scalars['String']['output']>;
  /** How the mark was made. Null for a signature recorded before this was captured. */
  signatureKind?: Maybe<SignatureKind>;
  signedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type SignupInput = {
  confirmPassword: Scalars['String']['input'];
  countryCode: Scalars['String']['input'];
  defaultRole: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  profileImage?: InputMaybe<Scalars['String']['input']>;
  walletId?: InputMaybe<Scalars['String']['input']>;
};

export type SiteCoordinates = {
  __typename?: 'SiteCoordinates';
  coordinates?: Maybe<Array<Maybe<Coordinates>>>;
};

/**
 * The seller's clock, as banked rather than as a deadline.
 *
 * `pausedMs` is time already excluded; `pausedSince` is an exclusion still open.
 * The deadline is DERIVED from these three — `startedAt + 7 days + pausedMs +
 * (now − pausedSince)` — and the client derives the same answer the server's
 * sweep does.
 *
 * A stored deadline was the obvious alternative and is the wrong one: rewriting it
 * on every pause leaves a number nobody can audit afterwards, because you can no
 * longer tell whether the seller was given seven days or nine.
 */
export type SlaClock = {
  __typename?: 'SlaClock';
  /** Milliseconds already excluded from the window. */
  pausedMs: Scalars['Float']['output'];
  /** Set while an exchange request is outstanding; null while the clock runs. */
  pausedSince?: Maybe<Scalars['String']['output']>;
  /** When the deposit cleared and the window opened. Null before that. */
  startedAt?: Maybe<Scalars['String']['output']>;
};

export type SortOrder =
  | 'ascending'
  | 'descending';

/** One party's signature on the SPA, with the counterpart copy they uploaded. */
export type SpaSignature = {
  __typename?: 'SpaSignature';
  /**
   * The address the signature was made from, captured server-side. Null for
   * anything signed before this was captured.
   */
  ip?: Maybe<Scalars['String']['output']>;
  /** Signer display name — the buyer's typed signature, the issuer's profile name. */
  name: Scalars['String']['output'];
  /**
   * The signer's mark, when they drew one or uploaded a scan of one rather than
   * only typing their name. Null for a typed signature and for anything signed
   * before marks could be sent.
   */
  signatureImageUrl?: Maybe<Scalars['String']['output']>;
  /** How the mark was made. Null for a signature recorded before this was captured. */
  signatureKind?: Maybe<SignatureKind>;
  signedAt: Scalars['String']['output'];
  /**
   * The signed / counter-signed document. Null only for a signature recorded
   * before the client uploaded a copy.
   */
  signedCopyUrl?: Maybe<Scalars['String']['output']>;
};

/**
 * One entry in a deal's stage history (FINANCIER_FLOW_REMAINING_SEEDS §6).
 *
 * Deliberately the same shape across all three flows — offer requests, cash
 * purchases and seller financing — because the stepper that renders it is one
 * component. `CashStageEvent` and `SellerStageEvent` remain for existing callers;
 * `stageEvents` is the shape to build against.
 *
 * APPEND-ONLY: one row per transition, written once and never edited. A history
 * that can be rewritten answers a different and much less useful question.
 */
export type StageEvent = {
  __typename?: 'StageEvent';
  /**
   * The party who caused it — `Borrower` | `Financier` | `Platform`.
   *
   * DERIVED from the stage entered, not captured from whoever was logged in.
   * Every transition in this lifecycle has exactly one party who can cause it — a
   * deal cannot arrive at LOAN_AGREEMENT_BORROWER_SIGNED except by the borrower
   * signing — so the role is structural and always right, where plumbed-through
   * attribution would be right only on the paths someone remembered to wire.
   *
   * The same three-role vocabulary as the other two flows (`Buyer`/`Issuer` there,
   * `Borrower`/`Financier` here), so one stepper renders all three.
   */
  actor: Scalars['String']['output'];
  /** Null on the first event — a deal was not anywhere before it existed. */
  fromStage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /**
   * Why, on the transitions that carry a reason — a waiver, a decline, a request
   * for changes.
   *
   * Quoted from the reason already stored on the deal, never written separately:
   * a second copy of the same sentence is a second thing to keep in step, and once
   * they differ neither one is authoritative.
   */
  note?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  /** The stage entered. */
  toStage: Scalars['String']['output'];
};

export type Status =
  | 'failed'
  | 'pending'
  | 'success';

export type StatusDeclaration = {
  __typename?: 'StatusDeclaration';
  amendmentDetails?: Maybe<Scalars['String']['output']>;
  amendmentDoc?: Maybe<Scalars['String']['output']>;
  amendmentType: DeclarationAmendmentType;
  amountCollectedThisMonth?: Maybe<Scalars['Float']['output']>;
  amountDisbursedThisPeriod?: Maybe<Scalars['Float']['output']>;
  /** Generated declarations: approve by this instant, or it is approved automatically. */
  approvalDueAt?: Maybe<Scalars['DateTime']['output']>;
  approvalStatus: DeclarationApprovalStatus;
  /** When it was approved — by the financier, or automatically at approvalDueAt. */
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Filings may be cancelled up to this instant (7 days after submission). */
  cancellableUntil?: Maybe<Scalars['DateTime']['output']>;
  cancelled: Scalars['Boolean']['output'];
  /**
   * Collected through Afram against THIS filing since it was submitted — wallet
   * loan payments attributed to it. The filing itself is never rewritten, so this
   * is the figure to reconcile the next declaration against: the lender's new
   * `outstandingPrincipal` / `outstandingInterest` should already account for it.
   */
  collectedThroughAfram: Scalars['Float']['output'];
  coversReportingGap: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  currentPeriodInterestRate?: Maybe<Scalars['Float']['output']>;
  dischargeDoc?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** The schedule installment a generated declaration was produced from. */
  installmentId?: Maybe<Scalars['ID']['output']>;
  /** False once superseded by a later filing for the same period, or when cancelled. */
  isActive: Scalars['Boolean']['output'];
  loanBook?: Maybe<Scalars['String']['output']>;
  loanId?: Maybe<Scalars['ID']['output']>;
  loanStatus: DeclarationLoanStatus;
  nextPaymentAmount?: Maybe<Scalars['Float']['output']>;
  nextPaymentDate?: Maybe<Scalars['DateTime']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  offerRequestId: Scalars['ID']['output'];
  /**
   * `totalOutstanding` less `collectedThroughAfram`, floored at zero — what a
   * borrower may still pay against this filing. This is the ceiling `payLoan`
   * enforces.
   */
  outstandingAfterAframPayments: Scalars['Float']['output'];
  outstandingInterest: Scalars['Float']['output'];
  outstandingPenalties?: Maybe<Scalars['Float']['output']>;
  outstandingPrincipal: Scalars['Float']['output'];
  paymentStatus: DeclarationPaymentStatus;
  prepaymentFlag: Scalars['Boolean']['output'];
  prepaymentPenaltyAmount?: Maybe<Scalars['Float']['output']>;
  reportingDate: Scalars['DateTime']['output'];
  /**
   * When the filing was first cleared in full. Null until it is, and never moved
   * by a later payment — this is the answer to "did they pay on time?".
   */
  settledAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Whether the borrower has paid this filing: Settled once collections reach
   * `totalOutstanding`, PartiallyPaid while some money has arrived, Unpaid until
   * then. A filing that declared nothing outstanding is Settled — there was
   * nothing to pay.
   */
  settlementStatus: DeclarationSettlementStatus;
  /** Hand-filed by the financier, or generated from the repayment schedule. */
  source: DeclarationSource;
  submittedAt: Scalars['DateTime']['output'];
  submittedByRole: Scalars['String']['output'];
  /** Id of the declaration that superseded this one, if any. */
  supersededBy?: Maybe<Scalars['ID']['output']>;
  /** Computed server-side: principal + interest + penalties. */
  totalOutstanding: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type StringOperator = {
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  like?: InputMaybe<Scalars['String']['input']>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notEq?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitBorrowerLoanRequestInput = {
  declarationId?: InputMaybe<Scalars['ID']['input']>;
  /** Supporting-file URL (upload to the vault first). */
  doc?: InputMaybe<Scalars['String']['input']>;
  kind: LoanRequestKind;
  offerRequestId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitOfferDocumentFile = {
  documentUrl: Scalars['String']['input'];
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** Human label for the slot this file fills — "Front", "Back", "Month 1"… */
  slotLabel?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitOfferDocumentItem = {
  /** Every file the borrower uploaded for this request (front/back, multiple payslips). */
  files?: InputMaybe<Array<SubmitOfferDocumentFile>>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitSupportRequestInput = {
  area: SupportArea;
  attachments?: InputMaybe<Array<SupportAttachmentInput>>;
  body: Scalars['String']['input'];
  /** A Cloudflare Turnstile token. CAPTCHA_FAILED when it does not verify. */
  captchaToken: Scalars['String']['input'];
  contactName?: InputMaybe<Scalars['String']['input']>;
  /** The website sends screen "Website Help"; the sign-in screens send the screen's name. */
  context: SupportContextInput;
  idempotencyKey: Scalars['String']['input'];
  kind: SupportKind;
  /** Where the reply goes. Optional, but without it there is no way to answer. */
  replyEmail?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SubmitSupportRequestPayload = {
  __typename?: 'SubmitSupportRequestPayload';
  reference: Scalars['String']['output'];
};

export type SubscribeToPushInput = {
  pushToken?: InputMaybe<Scalars['String']['input']>;
  subscription?: InputMaybe<Scalars['JSON']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /**
   * Live single purchase. Requires authentication, and refused at subscribe
   * unless the caller is the buyer or the owning issuer — a non-party gets an
   * error rather than an empty stream.
   *
   * Resolves null when the transaction does not exist and keeps emitting, so a
   * deal that is gone reads as "gone" rather than stalling.
   */
  getCashPurchase?: Maybe<CashPurchaseTxn>;
  /**
   * The caller's own verification. Current state on subscribe, then every
   * change — the flip to VERIFIED is what the laptop is waiting on.
   */
  getMyIdentityVerification?: Maybe<IdentityVerification>;
  /** Live list of the caller's deals as buyer, newest first. */
  getMyRentToBuyTxns: Array<RentToBuyTxn>;
  /**
   * The caller's own approaches, newest first — live.
   *
   * The same list the query returns, re-read on every approach change. Waking on
   * a change to somebody else's approach costs one query and returns the same
   * rows; the alternative, filtering the topic per subscriber, would have to know
   * the caller's approaches before reading them.
   */
  getMySellerApproaches: Array<SellerApproach>;
  /** Live list of the caller's deals, newest first. */
  getMySellerFinancingTxns: Array<SellerFinancingTxn>;
  /**
   * Live single request. Current state on subscribe, then the whole request
   * again on every change: a status move, a support answer, an assignment.
   * Refused at subscribe unless the caller can see it.
   */
  getMySupportRequest?: Maybe<SupportRequest>;
  /**
   * Live single offer request — the detail-screen counterpart to
   * `getOfferRequests`. Same argument and shape as the query, current value on
   * subscribe, then on change.
   *
   * Emits `null` if the filter matches nothing, and keeps emitting: a request that
   * does not exist yet, or one that stops matching the filter, resolves to null
   * rather than ending the subscription. A detail screen should treat null as
   * "gone", not as "still loading".
   */
  getOfferRequest?: Maybe<OfferRequest>;
  /**
   * Live offer-request list. Emits the current result immediately on subscribe —
   * no companion query is needed — then re-emits whenever any offer request
   * changes in a way that could affect this filter.
   *
   * Takes the same arguments as `getOfferRequests` and returns the same shape, so
   * a screen can swap the query for this subscription without touching its
   * selection set. The query remains available and unchanged.
   *
   * Bursts are collapsed: a bulk write emits once, not once per row. Every emit
   * re-reads current state, so the last emit always reflects the last write.
   */
  getOfferRequests: Array<OfferRequest>;
  /**
   * Live count for the same filter, on the same terms as `getOfferRequests`
   * above: current value on subscribe, then on change.
   */
  getOfferRequestsLength: Scalars['Int']['output'];
  /**
   * Live single deal, by transaction id or by the deal's offer request. Refused
   * unless the caller is the buyer or the vendor.
   */
  getRentToBuyTxn?: Maybe<RentToBuyTxn>;
  /** Live list of deals on the caller's units, newest first. */
  getRentToBuyTxnsForMyUnits: Array<RentToBuyTxn>;
  /**
   * Computer. Auth + key. Current state on subscribe, then every change — this
   * is what puts the photo on the laptop the instant the phone sends it.
   */
  getSelfieSession: SelfieSession;
  /**
   * Live single approach. Yields current data on subscribe, then re-emits on
   * every write to the approach or any of its child rows.
   *
   * Requires authentication. Scoped on EVERY re-read, not just at subscribe —
   * the same broker the query uses, so a caller who stops being a party to the
   * approach stops receiving rather than keeping a stale stream.
   *
   * Most of what a buyer is watching for here never touches the approach row:
   * the seller supplying a pack document, the deposit clearing, an exchange item
   * settling. Those wake this field too.
   */
  getSellerApproach?: Maybe<SellerApproach>;
  /**
   * The seller's inbox — approaches on the caller's units — live.
   *
   * The side that most needs to be live: the seven-day clock runs against the
   * seller, and an inbox they have to refresh to discover is an inbox that spends
   * their window for them. Requires an active entity context, like the query.
   */
  getSellerApproachesForMyUnits: Array<SellerApproach>;
  /**
   * Live single deal. Refused unless the caller is the buyer or the issuer.
   * Resolves null when the transaction does not exist and keeps emitting, so a
   * deleted deal reads as "gone" rather than stalling.
   */
  getSellerFinancingTxn?: Maybe<SellerFinancingTxn>;
  /** Live list of deals on the caller's units, newest first. */
  getSellerFinancingTxnsForMyUnits: Array<SellerFinancingTxn>;
};


export type SubscriptionGetCashPurchaseArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionGetMySupportRequestArgs = {
  reference: Scalars['String']['input'];
};


export type SubscriptionGetOfferRequestArgs = {
  filter?: InputMaybe<OfferRequestFilter>;
};


export type SubscriptionGetOfferRequestsArgs = {
  filter?: InputMaybe<OfferRequestFilter>;
  pagination?: InputMaybe<Pagination>;
};


export type SubscriptionGetOfferRequestsLengthArgs = {
  filter?: InputMaybe<OfferRequestFilter>;
};


export type SubscriptionGetRentToBuyTxnArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionGetSelfieSessionArgs = {
  filter: SelfieSessionFilter;
};


export type SubscriptionGetSellerApproachArgs = {
  id: Scalars['ID']['input'];
};


export type SubscriptionGetSellerFinancingTxnArgs = {
  id: Scalars['ID']['input'];
};

export type SupportAgent = {
  __typename?: 'SupportAgent';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type SupportArea =
  | 'access'
  | 'buying'
  | 'financing'
  | 'listings'
  | 'messaging'
  | 'notifications'
  | 'other'
  | 'settings'
  | 'transactions'
  | 'verification';

export type SupportAttachment = {
  __typename?: 'SupportAttachment';
  /** The type the server read from the bytes. */
  contentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: SupportAttachmentKind;
  sizeBytes: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

/**
 * A file the client has already put in the platform's storage. The server fetches
 * it, checks the bytes are PNG, JPEG, WEBP, PDF, DOC or DOCX and at most 10 MB,
 * and records what it found. At most 3 per message.
 */
export type SupportAttachmentInput = {
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  sizeBytes: Scalars['Int']['input'];
  url: Scalars['String']['input'];
};

export type SupportAttachmentKind =
  | 'file'
  | 'image';

export type SupportAuthPayload = {
  __typename?: 'SupportAuthPayload';
  accessToken: Scalars['String']['output'];
  user: SupportUser;
};

/** `system` is an automatic note, such as the member saying it's still a problem. */
export type SupportAuthorKind =
  | 'member'
  | 'support'
  | 'system';

/** Collected by the client when Help was opened. No personal data in `path`. */
export type SupportContextInput = {
  appVersion?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  path: Scalars['String']['input'];
  /** The browser's clock. The server's createdAt is the real time. */
  reportedAt: Scalars['DateTime']['input'];
  /** The page or screen Help was opened from, e.g. "Offers", "Sign up". */
  screen: Scalars['String']['input'];
  userAgent: Scalars['String']['input'];
  viewport: Scalars['String']['input'];
};

export type SupportKind =
  | 'bug'
  | 'help';

/** The member's platform role when they wrote in. Null when signed out. */
export type SupportMemberRole =
  | 'buyer'
  | 'financier'
  | 'issuer';

export type SupportMessage = {
  __typename?: 'SupportMessage';
  attachments: Array<SupportAttachment>;
  /** Support messages only. */
  author?: Maybe<SupportAgent>;
  authorKind: SupportAuthorKind;
  /** Up to 4,000 characters. Null when the message is only files. */
  body?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  visibility: SupportMessageVisibility;
};

export type SupportMessagePayload = {
  __typename?: 'SupportMessagePayload';
  message: SupportMessage;
  request: SupportRequest;
};

/** Members only ever see `public`. Internal notes stay with staff. */
export type SupportMessageVisibility =
  | 'internal'
  | 'public';

export type SupportRequest = {
  __typename?: 'SupportRequest';
  area: SupportArea;
  /** First name only. Null until someone owns it. */
  assignee?: Maybe<SupportAgent>;
  /** Staff only; null for members. */
  assigneeId?: Maybe<Scalars['Int']['output']>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Staff only; null for members. */
  contactName?: Maybe<Scalars['String']['output']>;
  /**
   * Staff only. Where and how it was sent: screen, path, user agent, viewport,
   * language, app version and the browser's clock.
   */
  context?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Staff only; null for members. */
  entityId?: Maybe<Scalars['ID']['output']>;
  firstResponseAt?: Maybe<Scalars['DateTime']['output']>;
  /** True when the status changed or support wrote since this person last looked. */
  hasUpdate: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  kind: SupportKind;
  lastMessageAt: Scalars['DateTime']['output'];
  /**
   * Staff only. The account a signed-out request's reply email matched. The
   * email is not proven, so the request never shows in that account's Help.
   */
  matchedUserId?: Maybe<Scalars['ID']['output']>;
  memberConfirmedResolved?: Maybe<Scalars['Boolean']['output']>;
  /**
   * The thread, oldest first, public messages only. Default limit 30. Use
   * `messagesLength` to page to the tail; the live subscription re-emits the
   * whole request when anything changes. Staff may pass `includeInternal` to
   * see the team's notes as well; members never can.
   */
  messages: Array<SupportMessage>;
  messagesLength: Scalars['Int']['output'];
  /** What the member quotes: AF- and 6 characters from ABCDEFGHJKMNPQRSTUVWXYZ23456789. */
  reference: Scalars['String']['output'];
  /** Staff only; null for members. Where a signed-out requester hears back. */
  replyEmail?: Maybe<Scalars['String']['output']>;
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Staff only; null for members. */
  role?: Maybe<SupportMemberRole>;
  satisfaction?: Maybe<Scalars['Int']['output']>;
  source: SupportSource;
  status: SupportStatus;
  /** Null when Help wasn't opened from a transaction, offer, property or document. */
  subject?: Maybe<SupportSubject>;
  title: Scalars['String']['output'];
  /** Support messages this person hasn't read. */
  unreadCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /** Staff only; null for members. */
  userId?: Maybe<Scalars['ID']['output']>;
};


export type SupportRequestMessagesArgs = {
  includeInternal?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<Pagination>;
};

export type SupportRequestAdminFilter = {
  area?: InputMaybe<StringOperator>;
  assigneeId?: InputMaybe<NumberOperator>;
  createdAt?: InputMaybe<DateOperator>;
  entityId?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  kind?: InputMaybe<StringOperator>;
  lastMessageAt?: InputMaybe<DateOperator>;
  reference?: InputMaybe<StringOperator>;
  replyEmail?: InputMaybe<StringOperator>;
  source?: InputMaybe<StringOperator>;
  status?: InputMaybe<StringOperator>;
  userId?: InputMaybe<StringOperator>;
};

export type SupportRequestFilter = {
  area?: InputMaybe<StringOperator>;
  createdAt?: InputMaybe<DateOperator>;
  kind?: InputMaybe<StringOperator>;
  status?: InputMaybe<StringOperator>;
};

export type SupportRequestStatusResult = {
  __typename?: 'SupportRequestStatusResult';
  reference: Scalars['String']['output'];
  status: SupportStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type SupportRole = {
  __typename?: 'SupportRole';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  members?: Maybe<Array<SupportRoleMember>>;
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SupportRoleFilter = {
  createdAt?: InputMaybe<DateOperator>;
  id?: InputMaybe<IdOperator>;
  isSystem?: InputMaybe<BooleanOperator>;
  name?: InputMaybe<StringOperator>;
};

export type SupportRoleMember = {
  __typename?: 'SupportRoleMember';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  supportRoleId: Scalars['ID']['output'];
};

/** Whether the person was signed in when they sent it. Which screen or site is in the context. */
export type SupportSource =
  | 'signed_in'
  | 'signed_out';

/**
 * open: sent, nobody has picked it up ("Waiting on team").
 * in_progress: someone is working on it ("Team on it").
 * waiting_on_member: support asked the member something ("Team on it", "Reply needed").
 * resolved: support thinks it's fixed ("Sorted", "Is everything working?").
 * closed: done; a reply opens a new request ("Sorted").
 */
export type SupportStatus =
  | 'closed'
  | 'in_progress'
  | 'open'
  | 'resolved'
  | 'waiting_on_member';

export type SupportSubject = {
  __typename?: 'SupportSubject';
  id: Scalars['ID']['output'];
  type: SupportSubjectType;
};

export type SupportSubjectInput = {
  id: Scalars['ID']['input'];
  type: SupportSubjectType;
};

/** What a request is about inside Afram, so staff can jump to it. */
export type SupportSubjectType =
  | 'document'
  | 'offer'
  | 'property'
  | 'transaction';

export type SupportUser = {
  __typename?: 'SupportUser';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  supportRole?: Maybe<SupportRole>;
  supportRoleId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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
  __typename?: 'TailoringRule';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documentCodes: Array<Scalars['String']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  platformRole?: Maybe<Scalars['String']['output']>;
  requirement?: Maybe<RequirementLevel>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TailoringRuleFilter = {
  entityType?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  isActive?: InputMaybe<BooleanOperator>;
  platformRole?: InputMaybe<StringOperator>;
};

export type TailoringRuleResponse = {
  __typename?: 'TailoringRuleResponse';
  rule?: Maybe<TailoringRule>;
  success: Scalars['Boolean']['output'];
};

export type TempProject = {
  __typename?: 'TempProject';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  ownerId?: Maybe<Scalars['ID']['output']>;
  /**
   * Carries `extractionStatus` (pending | succeeded | failed) and, when failed,
   * `extractionError`. A pending extraction older than 15 minutes reads as failed.
   */
  payload?: Maybe<Scalars['JSONObject']['output']>;
  paymentStatus?: Maybe<Scalars['String']['output']>;
  sessionId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TempProjectFilter = {
  id?: InputMaybe<IdOperator>;
  ownerId?: InputMaybe<IdOperator>;
  sessionId?: InputMaybe<IdOperator>;
};

export type Tenor = {
  __typename?: 'Tenor';
  count: Scalars['Int']['output'];
  period: Scalars['String']['output'];
};

export type TenorInput = {
  count?: InputMaybe<Scalars['Int']['input']>;
  period?: InputMaybe<Scalars['String']['input']>;
};

export type TermChangeFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  repaymentId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type TermSheet = {
  __typename?: 'TermSheet';
  /** Deadline by which the borrower must accept (defaults to the term-sheet expiry). */
  acceptByDate?: Maybe<Scalars['DateTime']['output']>;
  availableTokens?: Maybe<Scalars['Int']['output']>;
  blockNumber?: Maybe<Scalars['Int']['output']>;
  buyer?: Maybe<User>;
  buyerId?: Maybe<Scalars['ID']['output']>;
  completionDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  documentUrl?: Maybe<Scalars['String']['output']>;
  downPayment?: Maybe<Scalars['Float']['output']>;
  dsraAmount?: Maybe<Scalars['Float']['output']>;
  /** First scheduled instalment amount (major units), from the repayment schedule. */
  estimatedMonthlyInstalment?: Maybe<Scalars['Float']['output']>;
  executionDate?: Maybe<Scalars['DateTime']['output']>;
  financedAmount?: Maybe<Scalars['Float']['output']>;
  financier?: Maybe<Entity>;
  financierId?: Maybe<Scalars['ID']['output']>;
  financierLoanId?: Maybe<Scalars['ID']['output']>;
  guarantorId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  initialDeposit?: Maybe<Scalars['Float']['output']>;
  interestRate?: Maybe<Scalars['JSONObject']['output']>;
  isFractionalised?: Maybe<Scalars['Boolean']['output']>;
  issuer?: Maybe<Entity>;
  issuerId?: Maybe<Scalars['ID']['output']>;
  loanTenor?: Maybe<Scalars['JSONObject']['output']>;
  longstopDate?: Maybe<Scalars['DateTime']['output']>;
  ltv?: Maybe<Scalars['Float']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  modeOfFinancing?: Maybe<Scalars['String']['output']>;
  offerRequestId?: Maybe<Scalars['ID']['output']>;
  ownerShares?: Maybe<Array<Maybe<Scalars['JSONObject']['output']>>>;
  parentTermSheetId?: Maybe<Scalars['ID']['output']>;
  /**
   * The instalments this sheet is repaid by, earliest first.
   *
   * Empty where no schedule has been drawn up yet — a sheet still in DRAFT has
   * nothing to repay. Cancelled instalments are left out entirely: they are no
   * longer part of the schedule, and neither "upcoming" nor "paid" would be true
   * of them.
   */
  paymentSchedule: Array<PaymentScheduleEntry>;
  /** Upfront processing fee (major units), from the granted Offer's fee schedule. */
  processingFee?: Maybe<Scalars['Float']['output']>;
  projectId: Scalars['ID']['output'];
  property?: Maybe<Property>;
  purchasePrice?: Maybe<Scalars['Float']['output']>;
  repaymentFrequency?: Maybe<Scalars['String']['output']>;
  shareToken?: Maybe<Scalars['String']['output']>;
  signatures?: Maybe<Array<Maybe<TermSheetSignature>>>;
  status?: Maybe<TermSheetStatus>;
  termScheduleId?: Maybe<Scalars['ID']['output']>;
  termSheetExpiryDate?: Maybe<Scalars['DateTime']['output']>;
  totalAmount?: Maybe<Scalars['JSONObject']['output']>;
  /** Total repayable over the life of the loan (major units). */
  totalRepayable?: Maybe<Scalars['Float']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
  transactionRefNo?: Maybe<Scalars['String']['output']>;
  type?: Maybe<TermSheetType>;
  unitToken?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

/**
 * A borrower's request that the financier revise the issued term sheet, recorded
 * when they decline to accept it as drafted.
 */
export type TermSheetChangeRequest = {
  __typename?: 'TermSheetChangeRequest';
  /** The borrower's description of the changes they want. */
  message: Scalars['String']['output'];
  requestedAt: Scalars['DateTime']['output'];
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

/**
 * One party's signature on the term sheet, as the signature block renders it.
 *
 * `signedAt` and `ip` come from the signature actually recorded against the
 * linked offer request — the loan agreement's where there is one, otherwise the
 * offer letter's. Both are null where this signer has no such record: the mark on
 * the block is then the signature held on their account, and nothing on the
 * server can say when or from where it was applied.
 */
export type TermSheetSignature = {
  __typename?: 'TermSheetSignature';
  digitalSignature?: Maybe<Scalars['String']['output']>;
  entityId?: Maybe<Scalars['ID']['output']>;
  /** The address they signed from. Null where no signature record exists for them. */
  ip?: Maybe<Scalars['String']['output']>;
  memberRole?: Maybe<Scalars['String']['output']>;
  /** When this party signed. Null where no signature record exists for them. */
  signedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type TermSheetStatus =
  | 'COMPLETED'
  | 'DRAFT'
  | 'EXECUTED'
  | 'LAPSED'
  | 'TERMINATED';

export type TermSheetType =
  | 'BUYER_FINANCIER'
  | 'ISSUER_FINANCIER';

export type Ticket = {
  __typename?: 'Ticket';
  amountPaid?: Maybe<Scalars['String']['output']>;
  assignedTo?: Maybe<Scalars['Int']['output']>;
  assignee?: Maybe<TicketAssignee>;
  comments?: Maybe<Array<TicketComment>>;
  conversationId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['String']['output'];
};

export type TicketAssignee = {
  __typename?: 'TicketAssignee';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
};

export type TicketComment = {
  __typename?: 'TicketComment';
  /** Set for support staff only. */
  author?: Maybe<TicketAssignee>;
  /** The support user who wrote it; null when a member did. */
  authorId?: Maybe<Scalars['Int']['output']>;
  authorKind: TicketCommentAuthorKind;
  /** The member who wrote it; null when support staff did. */
  authorUserId?: Maybe<Scalars['ID']['output']>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  ticketId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Who wrote a ticket comment: Afram support staff, or the member. */
export type TicketCommentAuthorKind =
  | 'member'
  | 'support';

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

export type TicketStatus =
  | 'closed'
  | 'in_progress'
  | 'open'
  | 'resolved';

/**
 * The on-chain title-transfer pack, summarised for the borrower's overview.
 *
 * DERIVED, never stored. Every field is read off the loan's `TokenEvent` stream
 * and its `LoanDocument`s, so this summary cannot disagree with the events it
 * summarises — which it certainly would if it were a second record kept in step
 * by hand.
 *
 * `status` reads the stream as a sequence:
 *   * `pending`     — nothing has moved yet.
 *   * `in_progress` — tokens have started leaving escrow, title not yet conveyed.
 *   * `completed`   — a `title_transferred` event exists.
 */
export type TitleTransfer = {
  __typename?: 'TitleTransfer';
  /** When title was conveyed — the timestamp of the `title_transferred` event. */
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * The pack: the discharge letter, the transfer deed, the updated title. Drawn
   * from the loan's documents by tag, so a file uploaded once appears here and in
   * the Documents tab as the same record rather than a copy.
   */
  documents: Array<LoanDocument>;
  /** pending | in_progress | completed */
  status: Scalars['String']['output'];
  /** Chain reference for the title transfer. Null when there is none to show. */
  titleTransferTxRef?: Maybe<Scalars['String']['output']>;
  /** Chain reference for the escrow release. Null when there is none to show. */
  tokenReleaseTxRef?: Maybe<Scalars['String']['output']>;
};

export type ToggleFavoriteResult = {
  __typename?: 'ToggleFavoriteResult';
  added: Scalars['Boolean']['output'];
};

export type ToggleSuspendPayload = {
  __typename?: 'ToggleSuspendPayload';
  isSuspended: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

/** A token escrow lifecycle event for a loan. */
export type TokenEvent = {
  __typename?: 'TokenEvent';
  amount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  loanId?: Maybe<Scalars['ID']['output']>;
  note: Scalars['String']['output'];
  offerRequestId: Scalars['ID']['output'];
  timestamp: Scalars['DateTime']['output'];
  /**
   * On-chain transaction reference, when this event had one.
   *
   * Null on the many events that are platform bookkeeping rather than a chain
   * call. Null means "no reference" — never "reference unknown", and nothing
   * substitutes a plausible-looking hash for one.
   */
  txRef?: Maybe<Scalars['String']['output']>;
  type: TokenEventType;
};

export type TokenEventType =
  | 'locked_in_escrow'
  | 'minted'
  | 'released_from_escrow'
  | 'title_transferred';

export type Transaction = {
  __typename?: 'Transaction';
  amount?: Maybe<Scalars['JSONObject']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  from?: Maybe<Scalars['JSONObject']['output']>;
  id: Scalars['ID']['output'];
  propertyId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  referenceNo: Scalars['String']['output'];
  state: Scalars['String']['output'];
  status: Scalars['String']['output'];
  to?: Maybe<Scalars['JSONObject']['output']>;
  tokens: Scalars['Int']['output'];
  transactionId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TransactionFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

/**
 * Where the inspection stands on one deal, so each side can see what it is
 * waiting for. That visibility is the whole of feedback item 5.
 */
export type TransactionInspection = {
  __typename?: 'TransactionInspection';
  /** Set when the buyer confirmed the inspection happened and they are satisfied. */
  buyerConfirmedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * When the stage advanced — both parties confirmed, or the buyer waived.
   * Null while the inspection is still outstanding.
   */
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The vendor's half of the same statement. Null until they confirm. */
  issuerConfirmedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Every issue logged on this deal, oldest first. Resolved ones included. */
  issues: Array<InspectionIssue>;
  /**
   * The exact wording the buyer was shown in the confirmation modal, stored
   * verbatim, so a later dispute is about a record rather than a recollection.
   */
  waivedAcknowledgement?: Maybe<Scalars['String']['output']>;
  /**
   * Set when the buyer waived the inspection instead of having one.
   *
   * A waiver stands in for BOTH confirmations, and is deliberately not recorded as
   * one: a waiver filed as an ordinary confirmation is a false record of the buyer
   * having inspected, which is precisely the thing that matters if the property
   * later turns out to be defective.
   */
  waivedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Both sides of a deal, by the same two names every flow uses. */
export type TransactionPartyRole =
  | 'Buyer'
  | 'Issuer';

/** Which side of a viewing acted. Members are users; vendors act as an entity. */
export type TransactionPartyRoleOrMember =
  | 'Issuer'
  | 'Member';

export type TransactionVolumePoint = {
  __typename?: 'TransactionVolumePoint';
  bucket: Scalars['DateTime']['output'];
  count: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  label: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type Transfer = {
  __typename?: 'Transfer';
  /** Major units. */
  amount: Scalars['Float']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  destination: TransferDestination;
  /** The bank's reference for the disbursement. */
  externalRef?: Maybe<Scalars['String']['output']>;
  failureReason?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastPolledAt?: Maybe<Scalars['DateTime']['output']>;
  payerWalletId: Scalars['ID']['output'];
  /** Why the money moved: `withdrawal`, or the deal leg it pays. */
  purpose: Scalars['String']['output'];
  recipientOwnerId: Scalars['ID']['output'];
  recipientOwnerType: PayoutAccountOwner;
  reference?: Maybe<Scalars['JSONObject']['output']>;
  route: TransferRoute;
  source: TransferSource;
  status: TransferStatus;
  submittedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type TransferDestination = {
  __typename?: 'TransferDestination';
  accountName?: Maybe<Scalars['String']['output']>;
  accountNumber: Scalars['String']['output'];
  bankCode?: Maybe<Scalars['String']['output']>;
};

export type TransferFilter = {
  createdAt?: InputMaybe<DateOperator>;
  externalRef?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  payerWalletId?: InputMaybe<IdOperator>;
  purpose?: InputMaybe<StringOperator>;
  recipientOwnerId?: InputMaybe<IdOperator>;
  status?: InputMaybe<TransferStatusOperator>;
  submittedAt?: InputMaybe<DateOperator>;
};

export type TransferRoute =
  /** Paid straight from the payer's account (same bank). */
  | 'direct'
  /** Swept into the pool first, then sent interbank. */
  | 'pool';

export type TransferSource =
  | 'cash'
  | 'payout';

export type TransferStatus =
  | 'completed'
  /** Refused before any money moved; the payer's balance was restored. */
  | 'failed'
  /** Accepted; the amount is held. */
  | 'pending'
  /** Sent to the bank; awaiting its confirmation. */
  | 'submitted'
  /** Interbank only: out of the payer's account and in the pool, not yet with the recipient. Never reversed automatically. */
  | 'swept';

export type TransferStatusOperator = {
  eq?: InputMaybe<TransferStatus>;
  in?: InputMaybe<Array<TransferStatus>>;
  notIn?: InputMaybe<Array<TransferStatus>>;
};

export type Trend =
  | 'DOWN'
  | 'FLAT'
  | 'UP';

export type UpdateAssessmentAlertRuleInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<AssessmentAlertOperator>;
  severity?: InputMaybe<AssessmentAlertSeverity>;
  threshold?: InputMaybe<Scalars['JSONObject']['input']>;
  triggerQuestionCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAssessmentCategoryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['ID']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateAssessmentDocumentInput = {
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  /**
   * true marks the slot `not_applicable`, false puts it back to `pending`.
   * The applicant may do this only on an `advisory` or `if_applicable` slot
   * with no file on it, while the assessment is draft or returned; staff on
   * any slot with no file. Never on a verified document. Omit to leave it.
   */
  notApplicable?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /**
   * Staff only once the slot exists — an applicant could otherwise turn a
   * mandatory slot into an optional one and then mark it not applicable.
   * Resending the stored value is accepted.
   */
  requirement?: InputMaybe<AssessmentDocumentRequirement>;
};

export type UpdateAssessmentInput = {
  consentGivenAt?: InputMaybe<Scalars['DateTime']['input']>;
  declarationGivenAt?: InputMaybe<Scalars['DateTime']['input']>;
  officerNotes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAssessmentQuestionInput = {
  answerType?: InputMaybe<AssessmentAnswerType>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  guidance?: InputMaybe<Scalars['String']['input']>;
  isKycAutofill?: InputMaybe<Scalars['Boolean']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isScored?: InputMaybe<Scalars['Boolean']['input']>;
  kycSourceField?: InputMaybe<Scalars['String']['input']>;
  prompt?: InputMaybe<Scalars['String']['input']>;
  scoringLogicText?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['ID']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  verification?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateAssessmentQuestionOptionInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateAssessmentReadinessBandInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  guidance?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  maxScore?: InputMaybe<Scalars['Int']['input']>;
  minScore?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateAssessmentScoringBandInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateAssessmentTemplateInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  consentText?: InputMaybe<Scalars['String']['input']>;
  declarationText?: InputMaybe<Scalars['String']['input']>;
  legalNotice?: InputMaybe<Scalars['String']['input']>;
  maxScorePerParameter?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  platformRole?: InputMaybe<AssessmentPlatformRole>;
  status?: InputMaybe<AssessmentTemplateStatus>;
  subjectType?: InputMaybe<AssessmentSubjectType>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateComplianceSectionInput = {
  bg?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateComplianceSubmissionInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  reviewer?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<DocStatus>;
};

export type UpdateComplianceTemplateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  documentCode?: InputMaybe<Scalars['String']['input']>;
  gatedActions?: InputMaybe<Array<GatedAction>>;
  name?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateConversationInput = {
  id: Scalars['ID']['input'];
  kind?: InputMaybe<ConversationKind>;
  lastMessageId?: InputMaybe<Scalars['ID']['input']>;
  paymentStatus?: InputMaybe<ConversationPaymentStatus>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transferDocument?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDocumentRequestInput = {
  acceptedFileTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  documentCode?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateDueDiligenceInput = {
  dueDiligenceInitiatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  dueDiligenceReportDate?: InputMaybe<Scalars['DateTime']['input']>;
  dueDiligenceReportImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  dueDiligenceReportMessage?: InputMaybe<Scalars['String']['input']>;
  dueDiligenceStatus?: InputMaybe<DueDiligenceStatus>;
  id: Scalars['ID']['input'];
  legalDocuments?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  updatedBy?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type UpdateEntityRoleInput = {
  badgeColor?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateOfferInput = {
  acceptedAt?: InputMaybe<Scalars['DateTime']['input']>;
  availabilityPeriodDays?: InputMaybe<Scalars['Int']['input']>;
  bondSubType?: InputMaybe<BondSubType>;
  commitmentFeeRate?: InputMaybe<Scalars['Float']['input']>;
  conditions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  covenants?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  currency?: InputMaybe<Scalars['String']['input']>;
  depositPercentage?: InputMaybe<Scalars['Float']['input']>;
  drawdownSchedule?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  dsraMonths?: InputMaybe<Scalars['Int']['input']>;
  financierId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  interestRate?: InputMaybe<Scalars['JSONObject']['input']>;
  issuedAt?: InputMaybe<Scalars['DateTime']['input']>;
  lenderName?: InputMaybe<Scalars['String']['input']>;
  loanSubType?: InputMaybe<LoanSubType>;
  loanTenor?: InputMaybe<Scalars['JSONObject']['input']>;
  loanType?: InputMaybe<LoanType>;
  ltv?: InputMaybe<Scalars['Float']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  moratorium?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  offerExpiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  offerStatus?: InputMaybe<OfferStatus>;
  otherFees?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  processingTimeline?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  propertyName?: InputMaybe<Scalars['String']['input']>;
  rateType?: InputMaybe<RateType>;
  recipientId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<RepaymentFrequency>;
  repaymentType?: InputMaybe<RepaymentType>;
  revokedAt?: InputMaybe<Scalars['DateTime']['input']>;
  schedule?: InputMaybe<Scalars['JSONObject']['input']>;
  security?: InputMaybe<Scalars['JSONObject']['input']>;
  sources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UpdateOfferRequestInput = {
  agreedAmount?: InputMaybe<Scalars['Float']['input']>;
  approvedAt?: InputMaybe<Scalars['DateTime']['input']>;
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  financierId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  initialDeposit?: InputMaybe<Scalars['Float']['input']>;
  issuerId?: InputMaybe<Scalars['ID']['input']>;
  modeOfFinancing?: InputMaybe<ModeOfFinancing>;
  offer?: InputMaybe<Scalars['JSONObject']['input']>;
  paymentStatus?: InputMaybe<OfferRequestPaymentStatus>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  refNo?: InputMaybe<Scalars['String']['input']>;
  requestStatus?: InputMaybe<OfferRequestStatus>;
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdatePaymentScheduleInput = {
  createdForId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  loanId?: InputMaybe<Scalars['ID']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<Scalars['String']['input']>;
  repaymentTerms?: InputMaybe<Scalars['JSONObject']['input']>;
  totalInterest?: InputMaybe<Scalars['String']['input']>;
  totalRepayment?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePortfolioInput = {
  additionalFiles?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  construction?: InputMaybe<ConstructionInput>;
  constructionCommencementDate?: InputMaybe<Scalars['String']['input']>;
  epaPermitNumber?: InputMaybe<Scalars['String']['input']>;
  gpsAddress?: InputMaybe<Scalars['String']['input']>;
  grossDevelopmentValue?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  landValuationAmount?: InputMaybe<Scalars['Float']['input']>;
  landValuer?: InputMaybe<Scalars['String']['input']>;
  listingObjective?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  planningPermitNumber?: InputMaybe<Scalars['String']['input']>;
  portfolioType?: InputMaybe<Scalars['String']['input']>;
  practicalCompletionDate?: InputMaybe<Scalars['String']['input']>;
  projectCost?: InputMaybe<ProjectCostInput>;
  projectDescription?: InputMaybe<Scalars['String']['input']>;
  projectImages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectName?: InputMaybe<Scalars['String']['input']>;
  projectStatus?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  propertyTypes?: InputMaybe<Array<InputMaybe<PropertyTypesInput>>>;
  readiness?: InputMaybe<Scalars['Int']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  sharedAmenities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  squareFeet?: InputMaybe<Scalars['Int']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  titleNumber?: InputMaybe<Scalars['String']['input']>;
  totalDevelopmentCost?: InputMaybe<Scalars['Float']['input']>;
  yearBuilt?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRepaymentInput = {
  conversationId?: InputMaybe<Scalars['ID']['input']>;
  createdById?: InputMaybe<Scalars['ID']['input']>;
  createdForId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  interestRate?: InputMaybe<Scalars['Float']['input']>;
  isSubscribedToReferenceRate?: InputMaybe<Scalars['Boolean']['input']>;
  loanId?: InputMaybe<Scalars['ID']['input']>;
  maxLoanAmount?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  offerRequestId?: InputMaybe<Scalars['ID']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  repaymentFrequency?: InputMaybe<Scalars['String']['input']>;
  repaymentTerms?: InputMaybe<Scalars['JSONObject']['input']>;
  scheduleType?: InputMaybe<Scalars['String']['input']>;
  totalInterest?: InputMaybe<Scalars['String']['input']>;
  totalRepayment?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  conversationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  replies?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  userAvatar?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSupportRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateTailoringRuleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  documentCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  platformRole?: InputMaybe<Scalars['String']['input']>;
  requirement?: InputMaybe<RequirementLevel>;
};

/**
 * The extractor's answer for a session (`id` is the session id). `result` is
 * afram-ai's flat notification record: `extractionStatus` ("completed" or
 * "failed") is the only success signal; a completed record carries the fields it
 * read, a failed one a user-safe `error`, `errorCode` and `retryable`. A result
 * without a valid `extractionStatus` is refused.
 *
 * Accepted only from the extractor: the request must carry EXTRACTOR_API_KEY in
 * the `x-extractor-key` header. A user session is neither needed nor sufficient.
 * Only the listing fields a land title yields are read from `result`, mapped to
 * the draft's names (extractedFields in temp-project.broker); anything else is
 * ignored.
 */
export type UpdateTempProjectInput = {
  /** Why the document could not be read. Marks extraction failed. */
  error?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  result?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type UpdateTermSheetInput = {
  buyerId?: InputMaybe<Scalars['ID']['input']>;
  completionDate?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  downPayment?: InputMaybe<Scalars['Float']['input']>;
  dsraAmount?: InputMaybe<Scalars['Float']['input']>;
  executionDate?: InputMaybe<Scalars['DateTime']['input']>;
  financedAmount?: InputMaybe<Scalars['Float']['input']>;
  financierId?: InputMaybe<Scalars['ID']['input']>;
  initialDeposit?: InputMaybe<Scalars['Float']['input']>;
  interestRate?: InputMaybe<Scalars['JSONObject']['input']>;
  issuerId?: InputMaybe<Scalars['ID']['input']>;
  loanTenor?: InputMaybe<Scalars['JSONObject']['input']>;
  longstopDate?: InputMaybe<Scalars['DateTime']['input']>;
  ltv?: InputMaybe<Scalars['Float']['input']>;
  metadata?: InputMaybe<Scalars['JSONObject']['input']>;
  modeOfFinancing?: InputMaybe<Scalars['String']['input']>;
  purchasePrice?: InputMaybe<Scalars['Float']['input']>;
  repaymentFrequency?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TermSheetStatus>;
  termSheetExpiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  transactionRefNo?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTransactionInput = {
  amount?: InputMaybe<Scalars['JSONObject']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['JSONObject']['input']>;
  id: Scalars['ID']['input'];
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['JSONObject']['input']>;
  tokens?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UploadComplianceDocumentInput = {
  fileName: Scalars['String']['input'];
  fileSizeBytes: Scalars['Int']['input'];
  fileUrl: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  roleType: ComplianceRoleType;
  templateId: Scalars['ID']['input'];
};

export type UpsertAssessmentResponseInput = {
  assessmentId: Scalars['ID']['input'];
  questionCode: Scalars['String']['input'];
  questionId: Scalars['ID']['input'];
  selectedOptionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  valueBoolean?: InputMaybe<Scalars['Boolean']['input']>;
  valueDate?: InputMaybe<Scalars['Date']['input']>;
  valueNumber?: InputMaybe<Scalars['Float']['input']>;
  valueText?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  bankDetails?: Maybe<Scalars['JSON']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  completedWalkthroughs?: Maybe<Array<Scalars['String']['output']>>;
  countryCode: Scalars['String']['output'];
  /** ISO 3166-1 alpha-2. Where the person lives — not `countryCode`, which is the phone's dialling code. */
  countryOfResidence?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deactivatedAt?: Maybe<Scalars['DateTime']['output']>;
  defaultRole?: Maybe<Scalars['String']['output']>;
  deletionDate?: Maybe<Scalars['DateTime']['output']>;
  deletionReason?: Maybe<Scalars['String']['output']>;
  /**
   * The signature held on this account, for offering back to a returning signer.
   *
   * Readable only by its owner: on anyone else's `User` this resolves to null,
   * whoever is asking. A stored signature is reusable evidence of intent, and a
   * counterparty being able to select it off a user they are transacting with is
   * the whole problem. Use `saveMySignature` / `deleteMySignature` to change it.
   */
  digitalSignature?: Maybe<Scalars['String']['output']>;
  /** Area / neighbourhood, e.g. East Legon. */
  district?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  employer?: Maybe<Scalars['String']['output']>;
  entities?: Maybe<Array<Maybe<Entity>>>;
  entityMemberships?: Maybe<Array<Maybe<EntityMember>>>;
  /**
   * The live selfie the NIA check runs against. Readable only by its owner and by
   * platform staff; null for anyone else. Not the avatar — that is `profileImage`.
   */
  faceImageUrl?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  /** "MALE" | "FEMALE". Part of the KYC set a bank account needs. */
  gender?: Maybe<Scalars['String']['output']>;
  ghanaCard?: Maybe<Scalars['JSON']['output']>;
  googleId?: Maybe<Scalars['String']['output']>;
  gpsAddress?: Maybe<Scalars['String']['output']>;
  hasCompletedWalkthrough?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  /**
   * Readable by the user themselves and by platform staff; null for anyone else.
   *
   * Null also when no check was ever requested — every account that predates NIA
   * verification. Null is not "unverified": such accounts are not gated.
   *
   * Unrelated to `isVerified`, which is the account's OTP verification and is
   * what login checks.
   */
  identityVerification?: Maybe<IdentityVerification>;
  isDeactivated?: Maybe<Scalars['Boolean']['output']>;
  isOnboarded?: Maybe<Scalars['Boolean']['output']>;
  isSuspended?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  mfa?: Maybe<Scalars['Boolean']['output']>;
  momoNumber?: Maybe<Scalars['String']['output']>;
  monthlyNetIncome?: Maybe<Scalars['Float']['output']>;
  /** ISO 3166-1 alpha-2, e.g. GH. */
  nationality?: Maybe<Scalars['String']['output']>;
  occupation?: Maybe<Scalars['String']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  passport?: Maybe<Scalars['JSON']['output']>;
  phoneNumber: Scalars['String']['output'];
  /** In Ghana, the GhanaPost GPS address, e.g. GA-183-8164. */
  postalCode?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<RoleRequest>>>;
  /** Decomposed address — bank KYC needs street/city/region separately from `address`. */
  streetAddress?: Maybe<Scalars['String']['output']>;
  subscriptionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  walletId?: Maybe<Scalars['String']['output']>;
};

export type UserFilter = {
  email?: InputMaybe<StringOperator>;
  firstName?: InputMaybe<StringOperator>;
  id?: InputMaybe<IdOperator>;
  lastName?: InputMaybe<StringOperator>;
  phoneNumber?: InputMaybe<StringOperator>;
};

export type UserPolicy = {
  __typename?: 'UserPolicy';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  /** users.id when ownerType is user, entities.id when ownerType is entity */
  ownerId: Scalars['ID']['output'];
  /** 'user' for buyer policies, 'entity' for shared issuer/financier policies */
  ownerType: UserPolicyOwnerType;
  role: UserPolicyRole;
  /** The user who last saved this policy (audit) */
  savedByUserId?: Maybe<Scalars['ID']['output']>;
  schemaVersion: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserPolicyOwnerType =
  | 'entity'
  | 'user';

export type UserPolicyRole =
  | 'buyer'
  | 'financier'
  | 'issuer';

export type UserReference = {
  __typename?: 'UserReference';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UserReferenceInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UserStats = {
  __typename?: 'UserStats';
  activeUsers: Scalars['Int']['output'];
  deactivatedUsers: Scalars['Int']['output'];
  onboardedUsers: Scalars['Int']['output'];
  roles: Scalars['JSON']['output'];
  suspendedUsers: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

/**
 * The independent valuation of the development site on a project loan.
 *
 * Only ISSUER_LOAN_FINANCING requests can have one, and on those it is a hard
 * precondition of the term sheet rather than a checklist item: the platform is
 * lending against a site whose value nobody has independently established, and
 * the valuation is the number the facility is sized against. A buyer's mortgage
 * has no valuation step at all — the purchase price is set by an arm's-length
 * sale — so this is null on every other mode.
 *
 * Commissioned and recorded by the FINANCIER, who arranges the valuation
 * off-platform. Afram holds no valuer role, takes no valuation fee and does not
 * receive the report; what is recorded here is the financier's own account of a
 * valuation they ordered.
 */
export type Valuation = {
  __typename?: 'Valuation';
  commissionedAt: Scalars['DateTime']['output'];
  /**
   * The financier's note. The commissioning note is replaced by the note given
   * when the report is filed, where they gave one — the later note describes the
   * valuation as it now stands, which is what the borrower is reading.
   */
  notes?: Maybe<Scalars['String']['output']>;
  receivedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * The valuer's report. Nothing writes this yet: no client collects a file and
   * no upload path accepts one. It exists so the field is not designed out of the
   * shape, and reads null on every valuation until one does.
   */
  reportFileId?: Maybe<Scalars['ID']['output']>;
  status: ValuationStatus;
  /** Set only once the valuer has filed. Null while COMMISSIONED. */
  valuationAmount?: Maybe<Scalars['Float']['output']>;
  /** The valuer the financier instructed, as they named them. */
  valuerName: Scalars['String']['output'];
};

/**
 * How far an independent site valuation has got.
 *
 * Two states, not three: a request with no valuation at all has `valuation: null`,
 * and absent IS "not started". A NOT_STARTED member would have to be carried
 * forever by every financing mode that never has a valuation — which is all of
 * them but one.
 */
export type ValuationStatus =
  /** Ordered from a valuer; no figure yet. */
  | 'COMMISSIONED'
  /** The valuer has filed, and `valuationAmount` is set. */
  | 'RECEIVED';

export type VapidPublicKeyResponse = {
  __typename?: 'VapidPublicKeyResponse';
  publicKey?: Maybe<Scalars['String']['output']>;
};

export type WalletAccount = {
  __typename?: 'WalletAccount';
  accountName?: Maybe<Scalars['String']['output']>;
  /** The owner's own dedicated account number at the partner bank. */
  accountNumber?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  /** Not always known immediately — some facilitators only surface it via a balance/info call. */
  branchCode?: Maybe<Scalars['String']['output']>;
  /** Funding money for use on Afram. Never withdrawable. */
  cashBalance: Scalars['Float']['output'];
  /** Reconciliation key for deposits (currently == accountNumber). */
  depositReference?: Maybe<Scalars['String']['output']>;
  /** Proceeds owned by the user. Withdrawable to verifiedBankAccount only. */
  payoutBalance: Scalars['Float']['output'];
  /**
   * Null until a payout account exists. User-scoped, like the wallet itself — an
   * issuer's or financier's entity account is read with `getPayoutAccount(entity)`,
   * since that is the one the release gate checks.
   */
  verifiedBankAccount?: Maybe<WalletVerifiedBank>;
};

/**
 * Outcome of one party in a provisioning replay.
 *
 * `existing` parties are counted but not listed — a backfill report is about the
 * gap, not the population.
 */
export type WalletProvisioningOutcome =
  | 'created'
  | 'existing'
  /** The bank or the KYC check refused; see `reason`. */
  | 'failed'
  /** Would be attempted — a dry run, or past this run's limit. */
  | 'pending'
  /** The id matches neither a user nor an entity. */
  | 'unknown_owner';

export type WalletProvisioningReplayEntry = {
  __typename?: 'WalletProvisioningReplayEntry';
  outcome: WalletProvisioningOutcome;
  ownerId: Scalars['ID']['output'];
  /** "user" | "entity", or null when the id resolves to neither. */
  ownerType?: Maybe<Scalars['String']['output']>;
  /** Why it failed — usually the exact profile fields the bank still needs. */
  reason?: Maybe<Scalars['String']['output']>;
  /** Which lifecycle points obliged this party to have a wallet. */
  sources: Array<Scalars['String']['output']>;
  walletId?: Maybe<Scalars['ID']['output']>;
};

export type WalletProvisioningReplayResult = {
  __typename?: 'WalletProvisioningReplayResult';
  created: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  dryRun: Scalars['Boolean']['output'];
  entries: Array<WalletProvisioningReplayEntry>;
  existing: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  /** Distinct parties a wallet.provision was, or should have been, emitted for. */
  scanned: Scalars['Int']['output'];
  unknownOwner: Scalars['Int']['output'];
};

export type WalletTxn = {
  __typename?: 'WalletTxn';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** deposit/payout = in, payment/withdrawal = out — derived from kind, not stored. */
  direction: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: WalletTxnKind;
  note?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status: WalletTxnStatus;
};

export type WalletTxnKind =
  | 'deposit'
  | 'payment'
  | 'payout'
  | 'withdrawal';

export type WalletTxnStatus =
  | 'cleared'
  | 'failed'
  | 'pending';

export type WalletVerifiedBank = {
  __typename?: 'WalletVerifiedBank';
  accountName: Scalars['String']['output'];
  accountNumberMasked: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
};

export type YearlyTermSchedule = {
  __typename?: 'YearlyTermSchedule';
  months: Array<MonthlyPayment>;
  year: Scalars['Int']['output'];
};

export type YearlyTermScheduleInput = {
  months?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type ContactUsMutationVariables = Exact<{
  input: ContactUsInput;
}>;


export type ContactUsMutation = { __typename?: 'Mutation', contactUs: { __typename?: 'ContactUsResponse', success: boolean, message?: string | null } };

export type RequestAccessMutationVariables = Exact<{
  input: RequestAccessInput;
}>;


export type RequestAccessMutation = { __typename?: 'Mutation', requestAccess: { __typename?: 'RequestAccessResponse', success: boolean, message: string } };

export type SubmitSupportRequestMutationVariables = Exact<{
  input: SubmitSupportRequestInput;
}>;


export type SubmitSupportRequestMutation = { __typename?: 'Mutation', submitSupportRequest: { __typename?: 'SubmitSupportRequestPayload', reference: string } };

export type GetPublicPropertiesQueryVariables = Exact<{
  pagination?: InputMaybe<Pagination>;
}>;


export type GetPublicPropertiesQuery = { __typename?: 'Query', getPublicProjects: Array<{ __typename?: 'Project', id?: string | null, projectType?: string | null, property?: { __typename?: 'Property', id: string, price: number, currency?: string | null, propertyType?: string | null, status?: PropertyStatus | null, bedroom?: number | null, fullBathroom?: number | null, halfBathroom?: number | null, squareFeet?: number | null, city?: string | null, region?: string | null, propertyNameOrNumber?: string | null, propertyDescription?: string | null, propertyCardDesc?: string | null, propertyAmenities?: Array<string | null> | null, titleType?: string | null, landCertificateNumber?: string | null, projectImages?: Array<string | null> | null, thumbnail?: string | null, streetAddress?: string | null, gpsAddress?: string | null, metadata?: any | null, siteCoordinates?: any | null, createdAt?: any | null, updatedAt?: any | null } | null }> };

export type GetSupportRequestStatusQueryVariables = Exact<{
  reference: Scalars['String']['input'];
  replyEmail: Scalars['String']['input'];
}>;


export type GetSupportRequestStatusQuery = { __typename?: 'Query', getSupportRequestStatus?: { __typename?: 'SupportRequestStatusResult', reference: string, status: SupportStatus, updatedAt: any } | null };


export const ContactUsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ContactUs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactUsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactUs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ContactUsMutation, ContactUsMutationVariables>;
export const RequestAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RequestAccessMutation, RequestAccessMutationVariables>;
export const SubmitSupportRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitSupportRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitSupportRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitSupportRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reference"}}]}}]}}]} as unknown as DocumentNode<SubmitSupportRequestMutation, SubmitSupportRequestMutationVariables>;
export const GetPublicPropertiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicProperties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublicProjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectType"}},{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"propertyType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bedroom"}},{"kind":"Field","name":{"kind":"Name","value":"fullBathroom"}},{"kind":"Field","name":{"kind":"Name","value":"halfBathroom"}},{"kind":"Field","name":{"kind":"Name","value":"squareFeet"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"propertyNameOrNumber"}},{"kind":"Field","name":{"kind":"Name","value":"propertyDescription"}},{"kind":"Field","name":{"kind":"Name","value":"propertyCardDesc"}},{"kind":"Field","name":{"kind":"Name","value":"propertyAmenities"}},{"kind":"Field","name":{"kind":"Name","value":"titleType"}},{"kind":"Field","name":{"kind":"Name","value":"landCertificateNumber"}},{"kind":"Field","name":{"kind":"Name","value":"projectImages"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"gpsAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"siteCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetPublicPropertiesQuery, GetPublicPropertiesQueryVariables>;
export const GetSupportRequestStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSupportRequestStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reference"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replyEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSupportRequestStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reference"}}},{"kind":"Argument","name":{"kind":"Name","value":"replyEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replyEmail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetSupportRequestStatusQuery, GetSupportRequestStatusQueryVariables>;