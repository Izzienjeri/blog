import React, { useState } from "react";
import { retrieve } from "../Encryption";

const AddCategory = ({ setCategories, categories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  const addCategory = (e) => {
    e.preventDefault();

    if (newCategory && newCategoryDesc) {
      const requestData = {
        new_category: newCategory,
        description: newCategoryDesc,
      };
  

      fetch("/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + retrieve().access_token,
        },
        body: JSON.stringify(requestData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setCategories([...categories, data]);
          setNewCategory("");
          setNewCategoryDesc("");
        })
        .catch((error) => {
          console.log(error);
        });
      
    } else {
      if (!newCategory) {
        alert("Category title is required");
      } else if (!newCategoryDesc) {
        alert("Category description is required");
      } else {
        alert("Category title and description are required");
      }
    }
  };

  return (
    <div>
      <div className="form-group">
      <form onSubmit={addCategory}>
        <div className="form-group">
        <label htmlFor="new_category" className="label_blog" style={{ marginLeft: '0px' }}>New Category</label>
        <input  
          className="category_blog" 
          type="text"
          id="new_category"
          placeholder="Enter New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        ></input>
        </div>
        <div className="form-group">       
        <label htmlFor="new_category_description" className="label_blog">
          Category Description
        </label>
          
        <input
          className="title_blog"
          type="text"
          value={newCategoryDesc}
          onChange={(e) => setNewCategoryDesc(e.target.value)}
          id="description"
          placeholder="Enter Category Description"
        ></input>
        </div>
      
        <div>     
        <button type="submit" className="ui teal button" style={{ marginTop: '20px' }}>Save New Category</button>
        </div>  
      </form>
    </div>
    </div>
  );
};

export default AddCategory;
