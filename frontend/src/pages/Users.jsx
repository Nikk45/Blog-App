import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCard from "../components/Users/UserCard";

function Users() {
  const [users, setUsers] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user/get-all-users`, {
          headers: {
            "project-blog": token,
          },
        })
        .then((res) => {
          if (res.data.status === 200) {
            console.log(res.data.data);
            setUsers(res.data.data);
          }
        })
        .catch((err) => {
            console.log(err);
            alert(err)
          });
    }
  }, [token]);

  return (
    <div className="users-page">
      <h1 style={{ textAlign: "center" }}>Users</h1>
        {
            users?(
                <div style={{ padding: "20px", display: "flex" }}>
                    {
                        users.map((user, i) => (
                            <UserCard key={i} userData={user} />
                        ))
                    }
                </div>
            ):(<p style={{ textAlign: "center" }} className="users-error">No Users Found</p>)
        }
    </div>
  );
}

export default Users;