import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

import Dashboard from "./pages/Dashboard";
import CreateURL from "./pages/createURL";
import MyURLs from "./pages/MyURLs";
import Analytics from "./pages/Analytics";
import QRCodePage from "./pages/QRCodePage";
import ResetPassword from "./components/resetpass";
import AliasUrl from "./pages/AliasUrl";
import UpdateURL from "./pages/Updateurl";
import DisableURL from "./pages/Disableurl";
import DeleteURL from "./pages/Deleteurl";
import ProtectedAccess from "./pages/ProtectedAccess";
import Logout from "./pages/Logout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login/>} />

         <Route path="/Dash" element={<Dashboard />} />
        <Route path="/create" element={<CreateURL />} />
        <Route path="/myurls" element={<MyURLs />} />
<Route path="/alias" element={<AliasUrl />} />
        <Route path="/analytics/:shortId" element={<Analytics />} />
        <Route path="/qr/:shortId" element={<QRCodePage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update" element={<UpdateURL />} />
<Route path="/delete" element={<DeleteURL />} />
<Route path="/disable" element={<DisableURL />} />
<Route path="/protected" element={<ProtectedAccess />} />
<Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
