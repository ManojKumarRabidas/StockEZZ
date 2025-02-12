import '../App.css'
import List from './partials/category/List';
import Create from './partials/category/Create';
import Update from './partials/category/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Navigate, NavLink} from 'react-router-dom';

export default function Category() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="category-list">List</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="category-create">Create</NavLink>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="category-list" />} />
              <Route path='category-list' element={<List />} />
              <Route path='category-create' element={<Create />} />
              <Route path='category-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}