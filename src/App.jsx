import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './component/Home'
import UserLogin from './component/UserLogin'
import DataProviderLogin from './component/DataProviderLogin'
import KeyAuthorityLogin from './component/KeyAuthorityLogin'
import AdminLogin from './component/AdminLogin'
import UserDashboard from './component/UserDashboard'
import DataProviderDashboard from './component/DataProviderDashboard'
import KeyAuthorityDashboard from './component/KeyAuthorityDashboard'
import AdminDashboard from './component/AdminDashboard'
import UserRegister from './component/UserRegister'
import DataProviderRegister from './component/DataProviderRegister'
import PublishData from './component/PublishData'
import ViewUploadedData from './component/ViewUploadedData'
import AccessRequests from './component/AccessRequests'
import Analytics from './component/Analytics'
import UserViewAllData from './component/UserViewAllData'
import UserDataDownload from './component/UserDataDownload'
import UserRequestsView from './component/UserRequestsView'
import UserDataPage from './component/UserDataPage'
import DataProviderPage from './component/DataProviderPage'
import ApprovalRequestsPage from './component/ApprovalRequestsPage'
import AllFilesDataPage from './component/AllFilesDataPage'



function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/userlogin' element={<UserLogin />} />
        <Route path='/dataproviderlogin' element={<DataProviderLogin />} />
        <Route path='/keyauthoritylogin' element={<KeyAuthorityLogin />} />
        <Route path='/adminlogin' element={<AdminLogin />} />
        <Route path='/userdashboard' element={<UserDashboard />} />
        <Route path='/dataprovider' element={<DataProviderDashboard />} />
        <Route path='/keyauthority' element={<KeyAuthorityDashboard />} />
        <Route path='/admindashboard' element={<AdminDashboard />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/providerregister" element={<DataProviderRegister />} />





        <Route path="/publishdata" element={<PublishData />} />
        <Route path="/uploaddata" element={<ViewUploadedData />} />
        <Route path="/accessrequests" element={<AccessRequests />} />
        <Route path="/analytics" element={<Analytics />} />


        <Route path='/userviewalldata' element={<UserViewAllData />} />
        <Route path='/userdataDownload' element={<UserDataDownload />} />
        <Route path='/userrequestsview' element={<UserRequestsView />} />


          //admin routes//

        
        <Route path="/adminusers" element={<UserDataPage />} />
        <Route path="/adminproviders" element={<DataProviderPage />} />
        <Route path="/adminrequests" element={<ApprovalRequestsPage />} />
        <Route path="/adminfiles" element={<AllFilesDataPage />} />








      </Routes>
    </div>

  )
}

export default App