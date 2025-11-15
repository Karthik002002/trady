import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Navbar from "./components/common/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Journal from "./components/journal/Journal";
import TestingJournal from "./components/testingJournal/TestingJournal";
import Manage from "./components/manage/Manage";
import Execution from "./components/execution/Execution";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Navbar />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/testing" element={<TestingJournal />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/execution" element={<Execution />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
