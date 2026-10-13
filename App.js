import './App.css';
import { useEffect, useState } from 'react';

function App() {
  
  const [uname, setUname] = useState("");
  const [pword, setPword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(()=>{
    async function getSession(){
      let res = await fetch("http://localhost:5000/check",{
        method:"get",
        credentials:"include",
      })
      if (res.ok){
        let data = await res.json()
        console.log("Worked")
        setUser(data["username"])
      }

    }
    getSession()
  }, [])


  async function handleLogin(e) {
    // Stops the form refreshing the page
    e.preventDefault()

    // Send request to flask
    const res = await fetch("http://localhost:5000/login", { 
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({uname, pword})
    });

    if (res.ok){
      let data = await res.json()
      console.log("Worked")
      setUser(data["username"])
    } else{
      // You will want to change this so its more visual
      console.log("Invalid Credentials")
    }
  }

  return(
    <>
      {/* Checks If The User Is Loggged In,  */}
      {!user ? (
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input placeholder='username' onChange={(e) => setUname(e.target.value)}></input>
          <input placeholder='password' type='password' onChange={(e) => setPword(e.target.value)}></input>
          <button type='submit'>Log In</button>
        </form>
      )
      :
      (<h1>Logged In</h1>)
      }
    </>
  )
  }



export default App;
