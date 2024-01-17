import React from 'react'

const trial = () => {
  return (
    <div>
      
    </div>
  )
}

export default trial
const handleImageSubmit = (e) => {
    e.preventDefault();

    fetch("http", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: image,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        const uploadedImg = result.data.public_id;
        setUpload(uploadedImg);
    })
    .catch(err => {
        console.log(err);
    });
};
