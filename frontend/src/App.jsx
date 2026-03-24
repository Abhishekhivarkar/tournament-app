import Login from "./components/auth/Login"
import {Routes,Route} from "react-router-dom"
import UserRegister from "./components/auth/UserRegister"
import AdminRegister from "./components/auth/AdminRegister"
function App(){
  return(
    <>
      <Routes>
      <Route path="/login" element={<Login/>}/>
     <Route path="/register/user" element={<UserRegister/>}/>
     <Route path="/register/admin" element={<AdminRegister/>}/>
      </Routes>
    </>
    )
}

export default App