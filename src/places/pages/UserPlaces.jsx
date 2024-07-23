import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList.jsx";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/components/hooks/http-hook.jsx";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.jsx";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.jsx";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u2",
//   },
// ];

const UserPlaces = () => {
  const [userPlaces, setUserPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  // console.log("userId:", userId);
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(import.meta.env.VITE_BACKEND_URL + `/places/user/${userId}`);
        setUserPlaces(data.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);
  // const loadedPlces = DUMMY_PLACES.filter((place) => place.creator === userId);
  const handleDeleteddPlace = (deletedId) => {
    setUserPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== deletedId));
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && userPlaces && <PlaceList items={userPlaces} onDelete={handleDeleteddPlace} />}
    </>
  );
};

export default UserPlaces;
