import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/poppins";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/componets/custom/style.css";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";




import Home from "./componets/pages/Home";
import Footer from "./componets/footer/Footer";
import NavBar from "./componets/navbar/NavBar";
import AboutUs from "./componets/pages/AboutUs"; 


import DashBoardHeader from "./componets/event_panel/DashBoardHeader";
import DashBoard from "./componets/event_panel/DashBoard";
import Login from "./componets/login/Login";
import UserDashBoard from "./componets/user_dashboard/UserDashBoard";
import AddHeader from "./componets/event_panel/header/AddHeader";
import ManageHeader from "./componets/event_panel/header/ManageHeader";
import Registration from "./componets/pages/member_registration/Registration";
import AddWings from "./componets/event_panel/dashboard_pages/associative_wings/AddWings";
import ManageWings from "./componets/event_panel/dashboard_pages/associative_wings/ManageWings";
import MembersList from "./componets/pages/member_registration/MembersList";
import ManageRegistration from "./componets/event_panel/dashboard_pages/manage_registration/ManageRegistration";
import DonationSociety from "./componets/pages/donation/DonationSociety";
import AddActivity from "./componets/event_panel/dashboard_pages/activity_items/AddActivity";
import ManageActivity from "./componets/event_panel/dashboard_pages/activity_items/ManageActivity";






function App() {

  const location = useLocation();

  const hiddenPaths = new Set([
    "/DashBoard",
    "/AddHeader", 
    "/ManageHeader",
    "/UserDashBoard",
    "/AddWings",
    "/ManageWings",
    "/ManageRegistration",
    "/AddActivity",
    "/ManageActivity",
  ]);

  // const hiddenFooter1= new Set([ 
   
  // ]);

  const shouldHideNavbar = hiddenPaths.has(location.pathname);
  //  const shouldHideFooter1 = hiddenFooter1.has(location.pathname);
  return (
    
      <div className="app-container">
        {!shouldHideNavbar && <NavBar />}
        
        <main className="main-content">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Home />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/DashBoardHeader" element={<DashBoardHeader />} />
            <Route path="/DashBoard" element={<DashBoard />} />

              <Route path="/Login" element={<Login />} />
              <Route path="/UserDashBoard" element={<UserDashBoard />} />
              <Route path="/AddHeader" element={<AddHeader />} />
              <Route path="/ManageHeader" element={<ManageHeader />} />
               <Route path="/Registration" element={<Registration />} />
               <Route path="/MembersList" element={<MembersList />} />
                <Route path="/AddWings" element={<AddWings/>} />
                <Route path="/ManageWings" element={<ManageWings/>} />
                <Route path="/ManageRegistration" element={<ManageRegistration/>} />
                <Route path="/DonationSociety" element={<DonationSociety/>} />
                 <Route path="/AddActivity" element={<AddActivity/>} />
                    <Route path="/ManageActivity" element={<ManageActivity/>} />
          
          </Routes>
        </main>
           {/* {!shouldHideFooter1 && <Footer />} */}
      
      </div>
 
  );
}

export default App;