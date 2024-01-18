import React from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';

const UpdateUser = () => {
    const [userData, setUserData] = useState(null);
    const [fileUpload, setFileUpload] = useState(null);
    const [image, setImage] = useState(null);
    const formData = new FormData();

    formData.append("file", fileUpload);
    formData.append("description", "");

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        onSubmit: (values, { resetForm }) => {
            postPassword(values);
            resetForm();
        },
    });

    function postPassword(data) {
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => {
                setImage(data);
            });
    };

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="password">Current Password</label>
                    <br />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
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
                    <label htmlFor="fileInput">Upload Photo Here</label>
                    <input
                        type="file"
                        id="file"
                        onChange={(e) => handleChange(e)}
                        required
                        accept="image/png,image/jpeg,image/jpg,image/jfif"
                    />
                    <img src={image} alt="" />
                </div>

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default UpdateUser;
