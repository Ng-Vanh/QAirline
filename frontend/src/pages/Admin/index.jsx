// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import AdminSidebar from "~/components/AdminSidebar";
// import Report from "./report/page";
// import Airports from "./airports/page"; // Example for other pages
// import Flights from "./flights/page";
// import './style'

// const Admin = () => {
//     return (
//         <div className="admin-layout">
//             {/* Sidebar */}
//             <AdminSidebar />

//             {/* Content */}
//             <div className="admin-content">
//                 <Routes>
//                     <Route path="/report" element={<Report />} />
//                     <Route path="/airports" element={<Airports />} />
//                     <Route path="/flights" element={<Flights />} />
//                     {/* Redirect to /report by default */}
//                     <Route path="*" element={<Navigate to="/admin/report" />} />
//                 </Routes>
//             </div>
//         </div>
//     );
// };

// export default Admin;
