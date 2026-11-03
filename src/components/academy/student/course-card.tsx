import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faUsers } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "@/constants/router";
import {
  AcademyCourseModality,
  PublicAcademyCourse,
} from "@/lib/sektor-api/__generated__/types";
import { CATEGORY_LABEL, LEVEL_LABEL, MODALITY_LABEL, formatUsd } from "../constants";
import { Pill } from "../ui";

export const courseHref = (course: Pick<PublicAcademyCourse, "id" | "slug">) =>
  `${ROUTES.ACADEMY}/${course.slug || course.id}`;

const CourseCard = ({ course }: { course: PublicAcademyCourse }) => {
  const scheduled = course.modality !== AcademyCourseModality.Online && course.scheduledAt;
  const full = !!course.maxCapacity && course.enrolledCount >= course.maxCapacity;

  return (
    <Link
      href={courseHref(course)}
      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow text-blue-500"
    >
      {course.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={course.imageUrl} alt="" loading="lazy" className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 bg-gray-200" />
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex gap-1 flex-wrap">
          {course.modality && <Pill solid>{MODALITY_LABEL[course.modality]}</Pill>}
          {course.courseType && <Pill>{CATEGORY_LABEL[course.courseType]}</Pill>}
          {course.level && <Pill>{LEVEL_LABEL[course.level]}</Pill>}
        </div>
        <h2 className="font-bold text-lg leading-snug">{course.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div className="text-xs text-gray-500 flex flex-col gap-1">
            {scheduled && (
              <span>
                <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
                {dayjs(course.scheduledAt).format("DD/MM/YYYY · hh:mm a")}
              </span>
            )}
            <span>
              <FontAwesomeIcon icon={faUsers} className="mr-1" />
              {full ? "Cupos agotados" : `${course.enrolledCount} inscritos`}
            </span>
          </div>
          <span className="font-bold text-lg">{formatUsd(course.priceUsd)}</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
