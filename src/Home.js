import React, { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [modal, setModal] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    website: ""
  });
  const [editUserId, setEditUserId] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUserData(data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  const handleDelete = (contactId) => {
    const newContacts = [...userData];
    const index = userData.findIndex((contact) => contact.id === contactId);
    newContacts.splice(index, 1);
    setUserData(newContacts);
  };

  const toggleModal = (userId) => {
    setModal(!modal);
    if (!modal) {
      const user = userData.find((user) => user.id === userId);
      // console.log(user);
      setEditUserId(userId);
      setEditedData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        website: user.website
      });
    } else {
      setEditUserId(null);
    }
  };
  const handleEdit = (userId) => {
    // Update the user data with edited values
    const updatedData = userData.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          name: editedData.name !== "" ? editedData.name : user.name,
          email: editedData.email !== "" ? editedData.email : user.email,
          phone: editedData.phone !== "" ? editedData.phone : user.phone,
          website: editedData.website !== "" ? editedData.website : user.website
        };
      }
      return user;
    });

    setUserData(updatedData);
    toggleModal(userId); // Close the modal after saving the changes
  };
  const handleLike = (userId) => {
    setUserData((prevUserData) => {
      return prevUserData.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            clicked: !user.clicked
          };
        }
        return user;
      });
    });
  };
  // if (isLoading) {
  //   return <div>Loading...</div>; // Display loader if still loading
  // };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="id-card card">
        <ul>
          {userData.map((user) => (
            <li key={user.id}>
              <div className="profile">
                <img
                  src={`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`}
                  alt={user.name}
                />
                <h2>{user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>website: {user.website}</p>
                <div className="panel">
                  {user.clicked ? (
                    <button
                      onClick={() => handleLike(user.id)}
                      className="heart-clicked"
                    >
                      Unlike
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLike(user.id)}
                      className="heart"
                    >
                      Like
                    </button>
                  )}
                  <button onClick={() => toggleModal(user.id)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {modal && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <h2>Edit User</h2>
              <input
                type="text"
                value={editedData.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
                placeholder="Name"
              />
              <input
                type="email"
                value={editedData.email}
                onChange={(e) =>
                  setEditedData({ ...editedData, email: e.target.value })
                }
                placeholder="Email"
              />
              <input
                type="text"
                value={editedData.phone}
                onChange={(e) =>
                  setEditedData({ ...editedData, phone: e.target.value })
                }
                placeholder="Phone"
              />
              <input
                type="text"
                value={editedData.website}
                onChange={(e) =>
                  setEditedData({ ...editedData, website: e.target.value })
                }
                placeholder="Website"
              />
              <div>
                <button onClick={() => handleEdit(editUserId)}>Save</button>
                <button onClick={toggleModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
