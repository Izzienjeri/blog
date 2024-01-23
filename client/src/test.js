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
      // Handle validation errors
      // ...
    }
  };