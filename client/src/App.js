import './App.css';
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import Footer from './components/Footer';
import { useState,useEffect} from 'react';

function App() {
  const[blogPosts,setBlogPosts]=useState([]);
  useEffect(()=>{

    fetch('/blogs')
    .then((resp)=>resp.json())
    .then((blogs)=>{
      setBlogPosts(blogs)
    })
    .catch((error)=>{
      console.log("error fetching data",error)
    })

  },[])
  return (
    <div className="app">
      <NavBar/>
      <MainPage blogPosts={blogPosts} setBlogPosts={setBlogPosts}/>
      <Footer/>
    </div>
  );
}

export default App;
