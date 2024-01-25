import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import {retrieve,store} from "../Encryption";
import 'semantic-ui-css/semantic.min.css';

const ProfileImage = ({}) => {
  const [fileUpload, setFileUpload] = useState(null);
  const [image, setImage] = useState(null);
  const formData = new FormData();
  formData.append("file", fileUpload);
  formData.append("description", "");
  const navigate=useNavigate()
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileUpload(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
        setImage(reader.result);
        console.log(reader.result);
    };
};

const handlePhotoSubmit = (e) => {
    e.preventDefault();
    fetch('/upload_profileImage', {
        method: 'PATCH',
        headers: { "Authorization": "Bearer " + retrieve().access_token },
        body: formData,
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            store(data);
            setImage(data);
            // navigate('/profile_page');
        });
};
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handlePhotoSubmit(e); }}>
    <div className="profile-container" style={{ marginRight: "90px" }}>
        <div className="ui card">
            <div className="form-group">
                <h3>Upload/Change Profile Image</h3>
                <label htmlFor="fileInput">Upload Photo Here</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => handleChange(e)}
                    required
                    accept="image/png,image/jpeg,image/jpg,image/jfif"
                />
            </div>
            <button type="submit" className="mini ui teal button" style={{ marginTop: '10px', marginBottom: "10px" }}>Save</button>
        </div>
    </div>
</form>
     
      
    </div>
  )
}

export default ProfileImage
