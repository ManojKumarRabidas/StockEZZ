import '../App.css'
import List from './partials/operator/List';
import Create from './partials/operator/Create';
import Update from './partials/operator/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Navigate, NavLink} from 'react-router-dom';

export default function Operator() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="operator-list">List</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="operator-create">Create</NavLink>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="operator-list" />} />
              <Route path='operator-list' element={<List />} />
              <Route path='operator-create' element={<Create />} />
              <Route path='operator-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}