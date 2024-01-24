import React from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { retrieve, store } from '../Encryption';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
    const [userData, setUserData] = useState(null);
    const [fileUpload, setFileUpload] = useState(null);
    const [image, setImage] = useState(null);
    const [personalDetails,setPersonalDetails]=useState({
            firstname:"",
            excerpt:"",
            email:"",
    })
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

    const formik_details = useFormik({
        initialValues: {
            firstname:"",
            lastname:"",
            email:"",
        },
        onSubmit: (values, { resetForm }) => {
          
            updatePersonalDetails(values);
            resetForm();
        },
    });

    function updatePersonalDetails(data){
        fetch(`/users/${retrieve().user_id}`,{
            method:'PATCH',
            headers:{
                'Content-Type': 'application/json',
                "Authorization":"Bearer "+ retrieve().access_token,      
            },
            body:JSON.stringify(data)
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            
            store(data)

            navigate('/profile_page')
            

        })

    }



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
                store(data)
                setImage(data);
                navigate('/profile_page')
            });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         
             
            <div class="ui card form-container "style={{ margin: '30px 50px' }}>
  <div class="content">
   
    <form onSubmit={formik_details.handleSubmit}>
      <div class="form-details-container" >
        <h3>Update Personal Details</h3>
        <div class="field">
          <label htmlFor="firstname" className="label_blog">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            
            onChange={formik_details.handleChange}
            value={formik_details.values.firstname}
          />
        </div>

        <div class="field">
          <label htmlFor="lastname" className="label_blog">Last Name</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            onChange={formik_details.handleChange}
            value={formik_details.values.lastname}
          />
        </div>

        <div class="field">
          <label htmlFor="email" className="label_blog">Email Address</label>
          <input
            id="email"
            name="email"
            type="text"
            onChange={formik_details.handleChange}
            value={formik_details.values.email}
          />
        </div>

        <div class="field">
          <button type="submit" className="mini ui teal button" style={{ marginTop:'20px'}}>Update Details</button>
        </div>
      </div>
    </form>
  </div>
</div>




    <form onSubmit={formik.handleSubmit}>
            
            <div className="form-container" >
              <div className="password-container" style={{ marginLeft:'80px' }}>
                <div className='ui card' style={{ width:'500px'}}>
                <h3>Change Password</h3>
                <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <br />
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.currentPassword}
                />
                </div>
                <div className="form-group">
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
                <div className="form-group">
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

                <div className="form-group">
                  <button type="submit" className="mini ui teal button" style={{ marginBottom:'20px'}}>Update Password</button>
                </div>
                </div>
              </div>
              </div>
              
    </form>
              
              

              <div className="profile-container" style={{ marginRight:"90px" }}>
                <div className="ui card">
                  <form onSubmit={handlePhotoSubmit}>
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
                    <button type="submit" className="mini ui teal button" style={{ marginTop:'10px',marginBottom:"10px"}}>Save</button>
                  </form>
                </div>
              </div>
            </div>
         
        
      );
      
};

export default UpdateUser;
