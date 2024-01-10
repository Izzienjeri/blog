import React from 'react'

const MainPage = ({blogPosts,setBlogPosts}) => {

  return (
    <div className='main_container'>
        <div className='home'>
        <h1>Read about the latest in AI</h1>
            <div className='posts'>
            {blogPosts.map((blog,index)=>(
                 <div className='post'>
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>
                    <h6>{blog.pub_date}</h6>
                    </div>

))}
               
                   

                
        
        </div>


        </div>
    </div>
  )
}

export default MainPage
