import { gql } from "@apollo/client";

const QUIZ_QUESTION_FIELDS = `
  type
  title
  correctBooleanAnswer
  options
  correctOption
`;

const CERTIFICATE_FIELDS = `
  certificateId
  certificateCode
  courseId
  courseTitle
  studentName
  score
  verified
  downloadUrl
  shareUrl
`;

const COURSE_DETAIL_FIELDS = `
  id
  title
  description
  imageUrl
  status
  modality
  courseType
  level
  priceUsd
  passingScore
  instructorName
  instructorId
  instructor { id name headline photoUrl }
  createdByEmail
  createdByName
  modules {
    type
    title
    videoUrl
    durationSeconds
    content
    attachmentUrls
    quizQuestions { ${QUIZ_QUESTION_FIELDS} }
  }
  streamingUrl
  scheduledAt
  durationMinutes
  finalQuizQuestions { ${QUIZ_QUESTION_FIELDS} }
  location
  maxCapacity
  enrolledCount
`;

/* ----------------------------- Admin queries ----------------------------- */

export const ACADEMY_DASHBOARD_QUERY = gql`
  query AcademyDashboard {
    academyDashboard {
      uniqueStudentsTotal
      uniqueStudentsCurrentMonth
      uniqueStudentsPreviousMonth
      publishedCoursesCount
      revenueTotalUsd
      revenueCurrentMonthUsd
      revenuePreviousMonthUsd
      approvalRate
      topCourses {
        courseId
        title
        imageUrl
        studentCount
        revenueUsd
      }
    }
  }
`;

export const ACADEMY_CALENDAR_ITEMS_QUERY = gql`
  query AcademyCalendarItems {
    academyCalendarItems {
      courseId
      title
      imageUrl
      scheduledAt
      modality
      location
      requiresQr
    }
  }
`;

export const ACADEMY_STUDENTS_QUERY = gql`
  query AcademyStudents {
    academyStudents {
      id
      name
      initials
      approvedCoursesCount
    }
  }
`;

export const ACADEMY_STUDENT_QUERY = gql`
  query AcademyStudent($id: String!) {
    academyStudent(id: $id) {
      id
      name
      initials
      approvedCoursesCount
      email
      firstEnrolledAt
      studentSinceYear
      enrolledCoursesCount
      approvedCoursesRatio
      averageScore
      completedCourses {
        courseId
        title
        score
        status
      }
      certificates { ${CERTIFICATE_FIELDS} }
    }
  }
`;

export const ACADEMY_COURSES_QUERY = gql`
  query AcademyCourses($status: AcademyCourseStatus) {
    academyCourses(status: $status) {
      id
      title
      modality
      courseType
      priceUsd
      enrolledCount
      imageUrl
      maxCapacity
      canEdit
      createdBy
      slug
      instructorId
      instructorName
    }
  }
`;

export const ACADEMY_COURSE_ADMIN_QUERY = gql`
  query AcademyCourseAdmin($id: String!) {
    academyCourse(id: $id) {
      ${COURSE_DETAIL_FIELDS}
      canEdit
    }
  }
`;

/* ------------------------------ Instructors ------------------------------ */

const INSTRUCTOR_FIELDS = `
  id
  userId
  name
  email
  headline
  bio
  photoUrl
  courseCount
  canEdit
`;

const INSTRUCTOR_COURSE_FIELDS = `
  id
  title
  modality
  courseType
  priceUsd
  enrolledCount
  imageUrl
  maxCapacity
  canEdit
  slug
`;

export const ACADEMY_INSTRUCTORS_QUERY = gql`
  query AcademyInstructors {
    academyInstructors {
      ${INSTRUCTOR_FIELDS}
    }
  }
`;

export const ACADEMY_INSTRUCTOR_QUERY = gql`
  query AcademyInstructor($id: String!) {
    academyInstructor(id: $id) {
      ${INSTRUCTOR_FIELDS}
      courses { ${INSTRUCTOR_COURSE_FIELDS} }
    }
  }
`;

export const MY_ACADEMY_INSTRUCTOR_QUERY = gql`
  query MyAcademyInstructor {
    myAcademyInstructor {
      ${INSTRUCTOR_FIELDS}
    }
  }
`;

/* ---------------------------- Student queries ---------------------------- */

export const ACADEMY_COURSE_STUDENT_QUERY = gql`
  query AcademyCourseStudent($id: String!) {
    academyCourse(id: $id) {
      ${COURSE_DETAIL_FIELDS}
      slug
      completedModuleIndexes
      certificate { ${CERTIFICATE_FIELDS} }
      videoProgress {
        moduleIndex
        watchedSeconds
        lastPositionSeconds
        durationSeconds
        percent
        canComplete
      }
    }
    academyCoursePaymentQuote(courseId: $id) {
      amountUsd
      amountVes
      exchangeRate
      alreadyEnrolled
      canPurchase
      payment {
        id
        status
      }
      enrollment {
        id
        status
      }
    }
  }
`;

export const ACADEMY_COURSE_PAYMENT_QUOTE_QUERY = gql`
  query AcademyCoursePaymentQuote($courseId: String!) {
    academyCoursePaymentQuote(courseId: $courseId) {
      amountUsd
      amountVes
      exchangeRate
      alreadyEnrolled
      canPurchase
    }
  }
`;

export const MY_ACADEMY_COURSES_QUERY = gql`
  query MyAcademyCourses {
    myAcademyCourses {
      id
      title
      imageUrl
      level
      progress
      scheduledAt
      durationMinutes
      modality
      courseType
    }
  }
`;

export const MY_ACADEMY_CALENDAR_ITEMS_QUERY = gql`
  query MyAcademyCalendarItems {
    myAcademyCalendarItems {
      courseId
      title
      imageUrl
      scheduledAt
      modality
      location
      streamingUrl
      isEnrolled
    }
  }
`;

export const MY_ACADEMY_ATTENDANCE_QR_QUERY = gql`
  query MyAcademyAttendanceQr($courseId: String!) {
    myAcademyAttendanceQr(courseId: $courseId) {
      courseId
      studentId
      qrPayload
      code
    }
  }
`;

/* ---------------------------- Payment helpers ---------------------------- */

export const BANKS_QUERY = gql`
  query Banks {
    banks {
      code
      name
    }
  }
`;

export const PROFILE_FISCAL_ADDRESS_QUERY = gql`
  query ProfileFiscalAddress {
    profile {
      id
      name
      group
      fiscalAddress {
        street
        reference
        country {
          id
        }
        state {
          id
          name
        }
        city {
          id
          name
        }
      }
    }
  }
`;

/* ----------------------------- Public (no auth) ---------------------------- */

const PUBLIC_COURSE_FIELDS = `
  id
  slug
  title
  description
  imageUrl
  modality
  courseType
  level
  priceUsd
  instructorName
  instructorId
  scheduledAt
  durationMinutes
  location
  maxCapacity
  enrolledCount
  exchangeRate
  amountVes
`;

export const PUBLIC_ACADEMY_COURSES_QUERY = gql`
  query PublicAcademyCourses(
    $courseType: AcademyCourseCategory
    $modality: AcademyCourseModality
  ) {
    publicAcademyCourses(courseType: $courseType, modality: $modality) {
      ${PUBLIC_COURSE_FIELDS}
    }
  }
`;

export const PUBLIC_ACADEMY_COURSE_QUERY = gql`
  query PublicAcademyCourse($idOrSlug: String!) {
    publicAcademyCourse(idOrSlug: $idOrSlug) {
      ${PUBLIC_COURSE_FIELDS}
      instructor { id name headline photoUrl }
      syllabus {
        type
        title
        durationSeconds
      }
    }
  }
`;

const PUBLIC_INSTRUCTOR_FIELDS = `
  id
  name
  headline
  bio
  photoUrl
  courseCount
`;

export const PUBLIC_ACADEMY_INSTRUCTORS_QUERY = gql`
  query PublicAcademyInstructors {
    publicAcademyInstructors {
      ${PUBLIC_INSTRUCTOR_FIELDS}
    }
  }
`;

export const PUBLIC_ACADEMY_INSTRUCTOR_QUERY = gql`
  query PublicAcademyInstructor($id: String!) {
    publicAcademyInstructor(id: $id) {
      ${PUBLIC_INSTRUCTOR_FIELDS}
      courses { ${PUBLIC_COURSE_FIELDS} }
    }
  }
`;

export const VERIFY_ACADEMY_CERTIFICATE_QUERY = gql`
  query VerifyAcademyCertificate($code: String!) {
    verifyAcademyCertificate(code: $code) {
      certificateCode
      courseId
      courseTitle
      studentName
      issuedAt
      shareUrl
    }
  }
`;
