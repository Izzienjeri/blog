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
      <form onSubmit={addCategory}>
        <label htmlFor="new_category">New Category</label>
        <input
          type="text"
          id="new_category"
          placeholder="Enter New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        ></input>
        <br></br>
        <label htmlFor="new_category_description">
          New Category Description
        </label>
        <input
          type="text"
          value={newCategoryDesc}
          onChange={(e) => setNewCategoryDesc(e.target.value)}
          id="description"
          placeholder="Enter Category Description"
        ></input>
        <br></br>
        <button type="submit">Save New Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
