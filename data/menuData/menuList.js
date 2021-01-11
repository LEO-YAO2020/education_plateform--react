import {
  UserOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  AlibabaOutlined,
  SelectOutlined,
  CopyOutlined,
  TeamOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import Roles from "../../lib/role";

const menuList = [
  {
    title: "OverView",
    icon: <PlayCircleOutlined />,
    path: "/dashboard/manager",
  },
  {
    title: "Students",
    icon: <PlaySquareOutlined />,
    key: "students",
    children: [
      {
        title: "Students List",
        icon: <UserOutlined />,
        path: "/dashboard/manager/students",
      },
      {
        title: "Choose Student",
        icon: <SelectOutlined />,
        path: "",
      },
    ],
  },
  {
    title: "Teachers",
    icon: <AlibabaOutlined />,
    key: "teachers",
    children: [
      {
        title: "Teacher",
        icon: <TeamOutlined />,
        path: "/dashboard/manager/teachers",
      },
    ],
  },
  {
    title: "Courses",
    icon: <CopyOutlined />,
    key: "courses",
    children: [
      {
        title: "All Courses",
        icon: <TeamOutlined />,
        path: "/dashboard/manager/courses",
      },
      {
        title: "Add Courses",
        icon: <FileAddOutlined />,
        path: "/dashboard/manager/courses/add-course",
      },
    ],
  },
];
const studentMenuList = [
  {
    title: "OverView",
    icon: <PlayCircleOutlined />,
    path: "/dashboard/student",
  },
  {
    title: "Courses",
    icon: <CopyOutlined />,
    path: "/dashboard/student/courses",
  },
];
const teacherMenuList = [
  {
    title: "OverView",
    icon: <PlayCircleOutlined />,
    path: "/dashboard/teacher",
  },
  {
    title: "Students",
    icon: <PlaySquareOutlined />,
    key: "students",
    children: [
      {
        title: "Students List",
        icon: <UserOutlined />,
        path: "/dashboard/teacher/students",
      },
      {
        title: "Choose Student",
        icon: <SelectOutlined />,
        path: "",
      },
    ],
  },
  {
    title: "Courses",
    icon: <CopyOutlined />,
    path: "/dashboard/teacher/courses",
  },
];

export { menuList };

const routes = new Map();
routes.set(Roles.student, studentMenuList);
routes.set(Roles.manager, menuList);
routes.set(Roles.teacher, teacherMenuList);
export { routes };
