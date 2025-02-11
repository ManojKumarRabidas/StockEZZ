import '../App.css'
import List from './partials/item/List';
import Create from './partials/item/Create';
import Update from './partials/item/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Navigate, NavLink} from 'react-router-dom';

export default function Items() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="item-list">List</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="item-create">Create</NavLink>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="item-list" />} />
              <Route path='item-list' element={<List />} />
              <Route path='item-create' element={<Create />} />
              <Route path='item-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}