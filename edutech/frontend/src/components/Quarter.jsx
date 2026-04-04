import { WidgetSubject } from "./Subject";
import { getCourses } from "@services/connections.js";
import { useState, useEffect } from "react";

export function Quarter({ quarter, title, navigate, yearId }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses(yearId, quarter)
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {});
  }, []);

  return (
    <div className="bg-gray-200/70 rounded-[40px] p-6 w-full max-w-md h-full flex flex-col shadow-inner border border-black/5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center shrink-0">
        {title}
      </h2>

      <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {courses.map((sub) => {
          return (
            <WidgetSubject
              key={sub.id}
              subjectName={sub.name}
              subjectId={sub.id}
              className="w-full shadow-sm"
              onNavigate={() => navigate(`/${yearId}/${sub.id}/post`)}
            />
          );
        })}
      </div>
    </div>
  );
}
