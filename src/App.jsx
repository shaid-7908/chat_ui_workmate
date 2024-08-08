import Chat from "./pages/Chat"
import { BrowserRouter as Router ,Routes , Route , Navigate } from "react-router-dom"
import Login from "./pages/Login"
//import Streamtest from "./pages/stramtest"

function App() {
  const token = localStorage.getItem("access_token");

  return (
    <>
      {/* <Streamtest/> */}
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              token != null || token != '' ? <Chat /> : <Navigate to="/login" replace />
            }
          />
          <Route exact path="/login" element={<Login />} />
        </Routes>

        {/* <Chat />  */}
      </Router>
    </>
  );
}

export default App
