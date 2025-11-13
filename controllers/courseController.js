import Course from "../models/Course.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get course by id
export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const course = await Course.findById(id).populate({ path: "educator" });

    //   Remove lecture url if isPreviewFree is false
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, course });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
