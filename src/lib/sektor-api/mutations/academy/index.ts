import { gql } from "@apollo/client";

/* ------------------------------ Admin: CRUD ------------------------------ */

export const CREATE_ACADEMY_COURSE = gql`
  mutation CreateAcademyCourse($input: CreateAcademyCourseInput!) {
    createAcademyCourse(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_ACADEMY_COURSE = gql`
  mutation UpdateAcademyCourse($id: String!, $input: UpdateAcademyCourseInput!) {
    updateAcademyCourse(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const DELETE_ACADEMY_COURSE = gql`
  mutation DeleteAcademyCourse($id: String!, $force: Boolean) {
    deleteAcademyCourse(id: $id, force: $force)
  }
`;

export const REQUEST_ACADEMY_COURSE_ASSET_UPLOAD = gql`
  mutation RequestAcademyCourseAssetUpload(
    $input: RequestAcademyCourseAssetUploadInput!
  ) {
    requestAcademyCourseAssetUpload(input: $input) {
      assetId
      signedUrl
      fileUrl
      status
      expiresAt
    }
  }
`;

export const CONFIRM_ACADEMY_COURSE_ASSET_UPLOAD = gql`
  mutation ConfirmAcademyCourseAssetUpload(
    $input: ConfirmAcademyCourseAssetUploadInput!
  ) {
    confirmAcademyCourseAssetUpload(input: $input) {
      id
      type
      status
      fileUrl
    }
  }
`;

/* --------------------------- Admin: attendance --------------------------- */

export const VALIDATE_ACADEMY_QR = gql`
  mutation ValidateAcademyQr($input: ValidateAcademyQrInput!) {
    validateAcademyQr(input: $input) {
      success
      message
      studentId
      studentName
    }
  }
`;

/* ------------------------------- Student --------------------------------- */

export const START_ACADEMY_COURSE = gql`
  mutation StartAcademyCourse($id: String!) {
    startAcademyCourse(id: $id)
  }
`;

export const COMPLETE_ACADEMY_LESSON = gql`
  mutation CompleteAcademyLesson($courseId: String!, $moduleIndex: Int!) {
    completeAcademyLesson(courseId: $courseId, moduleIndex: $moduleIndex)
  }
`;

/* ------------------------------- Payments -------------------------------- */

const ACADEMY_PAYMENT_RESULT_FIELDS = `
  payment {
    id
    status
    errorMessage
  }
  enrollment {
    id
    status
  }
  matched
  message
`;

export const INITIATE_ACADEMY_COURSE_IMMEDIATE_DEBIT = gql`
  mutation InitiateAcademyCourseImmediateDebit(
    $input: InitiateAcademyCourseImmediateDebitInput!
  ) {
    initiateAcademyCourseImmediateDebit(input: $input) {
      payment {
        id
        status
        errorMessage
      }
      otpSent
      message
    }
  }
`;

export const CONFIRM_ACADEMY_COURSE_IMMEDIATE_DEBIT = gql`
  mutation ConfirmAcademyCourseImmediateDebit(
    $input: ConfirmImmediateDebitInputType!
  ) {
    confirmAcademyCourseImmediateDebit(input: $input) {
      ${ACADEMY_PAYMENT_RESULT_FIELDS}
    }
  }
`;

export const CONFIRM_ACADEMY_COURSE_MOBILE_PAYMENT = gql`
  mutation ConfirmAcademyCourseMobilePayment(
    $input: ConfirmAcademyCourseMobilePaymentInput!
  ) {
    confirmAcademyCourseMobilePayment(input: $input) {
      ${ACADEMY_PAYMENT_RESULT_FIELDS}
    }
  }
`;

/** Saves the signed-in user's own fiscal address (any account type). */
export const UPDATE_MY_FISCAL_ADDRESS = gql`
  mutation UpdateMyFiscalAddress($input: FiscalAddressInputType!) {
    updateMyFiscalAddress(input: $input) {
      id
    }
  }
`;

export const SUBMIT_ACADEMY_QUIZ = gql`
  mutation SubmitAcademyQuiz($input: SubmitAcademyQuizInput!) {
    submitAcademyQuiz(input: $input) {
      moduleIndex
      score
      passed
      correctCount
      total
      passingScore
      completedModuleIndexes
      enrollmentStatus
      certificateCode
    }
  }
`;

export const REPORT_ACADEMY_VIDEO_PROGRESS = gql`
  mutation ReportAcademyVideoProgress(
    $courseId: String!
    $moduleIndex: Int!
    $positionSeconds: Float!
  ) {
    reportAcademyVideoProgress(
      courseId: $courseId
      moduleIndex: $moduleIndex
      positionSeconds: $positionSeconds
    ) {
      moduleIndex
      watchedSeconds
      lastPositionSeconds
      durationSeconds
      percent
      canComplete
    }
  }
`;
