import { Dropdown, Menu, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { getStudentProfile } from "../../api/response";
import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export default function userIcon(props) {
  const [avatar, setAvatar] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(async () => {
    const userId = localStorage.getItem("userId");
    let role = localStorage.getItem("loginType");
    const res = await getStudentProfile(userId);
    const { data } = res.data;
    role = role.substr(1, role.length - 2);
    setUserRole(role);
    setAvatar(data.avatar);
  }, []);
  return (
    <Dropdown
      overlay={
        <Menu>
          {userRole !== "manager" && (
            <Menu.Item>
              <ProfileOutlined />
              <Link href={`/dashboard/${userRole}/profile`} passHref>
                <span>Profile</span>
              </Link>
            </Menu.Item>
          )}
          <Menu.Item onClick={props.logout}>
            <LogoutOutlined />
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      }
      placement="bottomLeft"
    >
      {avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
    </Dropdown>
  );
}
