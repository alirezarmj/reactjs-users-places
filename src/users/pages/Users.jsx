import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const reqFunc = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/users");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    reqFunc();
  }, []);
  // const USERS = [
  //   {
  //     id: "u1",
  //     name: "Max Schwarz",
  //     image: "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  //     places: 3,
  //   },
  // ];
  return (
    <>
      <ErrorModal
        error={error}
        onClear={() => {
          setError(null);
        }}
      />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </>
  );
};

export default Users;
