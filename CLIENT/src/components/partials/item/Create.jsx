import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = localStorage.getItem('token');

function Create() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [sub_category, setSubCategory] = useState("");
    const [sub_categories, setSubCategories] = useState([])
    const [active, setActive] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
      getCategories();
    }, []);

    const changeCategory = (value)=>{
      setCategory(value);
      if(value){
        const matchedItems = categories.find((item)=> item._id == value);
        setSubCategories(matchedItems.sub_categories)
      }
    }

  const handleClear = () => {
    setitem("");
    setCategory("");
    setSubCategory("");
    setActive(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const itemData = {name, category, sub_category, active };
    if (!name || !category ){
      toastr.error("Please enter item and category.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/item-create`, {
      method: "POST",
      body: JSON.stringify(itemData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success("Item created successfully.");
        navigate("/items/item-list");
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded"> 
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
              <label className="form-label">Sub Category</label>
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
        <button type="submit" className="btn btn-primary mx-2">Create</button>
        <button onClick={handleClear} type="button" className="btn btn-primary mx-2">Clear</button>
      </form>
    </div>
  );
}
export default Create;