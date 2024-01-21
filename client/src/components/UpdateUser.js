import React from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { retrieve } from '../Encryption';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
    const [userData, setUserData] = useState(null);
    const [fileUpload, setFileUpload] = useState(null);
    const [image, setImage] = useState(null);
    const navigate=useNavigate()
    const formData = new FormData();

    formData.append("file", fileUpload);
    formData.append("description", "");

    const formik = useFormik({
        initialValues: {
            currentPassword:"",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: (values, { resetForm }) => {
            postPassword(values);
            resetForm();
        },
    });

    function postPassword(data) {
        fetch('/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization":"Bearer "+ retrieve().access_token,                
            },
            body: JSON.stringify(data),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setUserData(data);
            });
    }

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
            method: 'POST',
            headers:{"Authorization": "Bearer " + retrieve().access_token},
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                setImage(data);
                navigate('/profile_page')
            });
    };

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <h6>Change Password</h6>
                    <label htmlFor="currentPassword">Current Password</label>
                    <br />
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.currentPassword}
                    />
                    <label htmlFor="newPassword">New Password</label>
                    <br />
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <br />
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                    />
                </div>

                <button type="submit">Update</button>
            </form>

            <form onSubmit={handlePhotoSubmit}>
                <div>
                    <h6>Upload/Change Profile Image</h6>
                    <label htmlFor="fileInput">Upload Photo Here</label>
                    <input
                        type="file"
                        id="file"
                        onChange={(e) => handleChange(e)}
                        required
                        accept="image/png,image/jpeg,image/jpg,image/jfif"
                    />
                    {/* <img src={image} alt="" /> */}
                </div>

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default UpdateUser;
