import {
  UserOutlined,
  PlayCircleOutlined,
  PlaySquareOutlined,
  AlibabaOutlined,
  SelectOutlined,
  CopyOutlined,
} from "@ant-design/icons";

export const menuList = [
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
    path: "/dashboard/manager/teacher",
  },
  {
    title: "Courses",
    icon: <CopyOutlined />,
    path: "",
  },
];
