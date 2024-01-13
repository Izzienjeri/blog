import React from 'react'

import BlogCard from './BlogCard'

const MainPage = ({blogPosts,setBlogPosts,handleClick}) => {

  return (
    <div className='main_container'>
        <div className='home'>
        <h1>Read about the latest in AI</h1>
            <BlogCard blogPosts={blogPosts}  setBlogPosts={setBlogPosts} handleClick={handleClick}/>

        </div>
    </div>
  )
}

export default MainPage
