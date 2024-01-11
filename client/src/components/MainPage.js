import React from 'react'
import {Link} from 'react-router-dom'

const MainPage = ({blogPosts,setBlogPosts}) => {

  return (
    <div className='main_container'>
        <div className='home'>
        <h1>Read about the latest in AI</h1>
            <div className='posts'>
            {blogPosts.map((blog)=>(
                 <div className='post' key={blog.id}>
                   <div className='img'>
                   {blog.images && blog.images.length > 0 && (<img src={blog.images[0].file_path} alt="" />)}
                   </div>
                   <div className='content'>
                   
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <div>
                    <button>Read More</button>
                    </div>
                    
                 

                    </div>
                    </div>

))}
               
                   

                
        
        </div>


        </div>
    </div>
  )
}

export default MainPage
