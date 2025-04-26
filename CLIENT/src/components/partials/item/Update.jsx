import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');
import toastr from 'toastr';
function Update() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [sub_category, setSubCategory] = useState("");
    const [sub_categories, setSubCategories] = useState([])
    const [active, setActive] = useState(false);
    const [tempCategory, setTempCategory] = useState(null);
    const [tempSubCategory, setTempSubCategory] = useState(null); 
    const navigate = useNavigate();
    const { id } = useParams();

  const handleClear = () => {
    setName("");
    setCategory("");
    setSubCategory("");
    setActive(false);
  };

  const changeCategory = (value, sub_category_value) => {
    setCategory(value);
    if (value && categories.length > 0) {
      const matchedItems = categories.find((item) => item._id === value);
      if (matchedItems) {
        setSubCategories(matchedItems.sub_categories);
        setSubCategory(sub_category_value);
      }
    }
  };

  const getItemData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/item-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
            setName(result.doc.name);
            setTempCategory(result.doc.category);
            setTempSubCategory(result.doc.sub_category);
            setActive(result.doc.active);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  const getCategories = async ()=>{
    try {
          const response = await fetch(`${HOST}:${PORT}/server/category-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, 'item': true, 'active': true },
          });
    
          const result = await response.json();
          if (response.ok) {
            setCategories(result.docs);;
            setSubCategories([]);
          } else {
            toastr.error(result.msg);
          }
        } catch (err) {
          toastr.error("We are unable to process now. Please try again later.");
        }
  }

// Fetch categories first
useEffect(() => {
  getCategories();
}, []);

// Fetch item data only after categories are set
useEffect(() => {
  if (categories.length > 0) {
    getItemData();
  }
}, [categories]);

// Apply category selection once both data are available
useEffect(() => {
  if (tempCategory && categories.length > 0) {
    changeCategory(tempCategory, tempSubCategory);
  }
}, [categories, tempCategory]);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateItem = {name, category, sub_category, active };
    if (!name || !category ){
      toastr.error("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/item-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateItem),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Item details updated successfully.");
            navigate("/items/item-list");
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleEdit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        
      <div className="row">
          <div className="col mb-3">
            <label className="form-label">Item Name <span className="ei-col-red">*</span></label>
            <input name="name" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
        </div>
        <div className="row">
            <div className="col mb-3">
              <label className="form-label">Category <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="type" value={category} onChange={(e) => changeCategory(e.target.value)}>
                  <option>--Select category--</option>
                  {categories.map((item)=>(
                  <option value={item._id}>{item.category}</option>
                  ))}
              </select>
          </div>
        </div>
        <div className="row">
            <div className="col mb-3">
              <label className="form-label">Sub Category </label>
              <select className="form-select" aria-label="Default select example" name="type" value={sub_category} onChange={(e) => setSubCategory(e.target.value)}>
                  <option>--Select sub category--</option>
                  {sub_categories.map((item, index)=>(
                    <option key={index} value={item}>{item}</option>
                  ))}
              </select>
          </div>
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button onClick={handleClear} type="button" className="btn btn-primary mx-2">Clear</button>
      </form>
    </div>
  );
}

export default Update;
