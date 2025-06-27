import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags } from 'react-tag-input';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = localStorage.getItem('token');

function Create() {
    const [category, setCategory] = useState("");
    const [sub_categories, setSubCategories] = useState([]);
    const [active, setActive] = useState(false);
    const navigate = useNavigate();

    const handleDelete = (i) => {
      setSubCategories(sub_categories.filter((sub_category, index) => index !== i));
    };
  
    const handleAddition = (sub_category) => {
      setSubCategories([...sub_categories, sub_category]);
    };

  const handleClear = () => {
    setCategory("");
    setSubCategories([]);
    setActive(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const categoryData = {category, sub_categories: sub_categories.map((tag) => tag.text), active };
    if (!category ){
      toastr.error("Please enter category.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/category-create`, {
      method: "POST",
      body: JSON.stringify(categoryData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success("Category created successfully.");
        navigate("/categories/category-list");
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  };

  return (
    <>
      <style>
        {`
        .react-tags-wrapper {
          background-color: #fff;
          width: 100%;
          border-radius: 0.5rem;
        }

        .tags-container {
          width: 100%;
        }

        .tag-input {
          flex-grow: 1;
          width: 100%;
          padding: 0 !important;
        }

        .tag-input input {
          width: 100% !important;
        }

        .ReactTags__selected {
          width: 100%;
        }
          `}
      </style>
      <div className="container my-2">
        <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded"> 
          <div className="row">
            <div className="col mb-3">
              <label className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <input name="name" type="text" maxLength={70} className="form-control" value={category} placeholder="Add new category" onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="col mb-3">
              <label className="form-label">Sub Categories</label>
              <div className="react-tags-wrapper w-100  border rounded">
                <ReactTags
                  tags={sub_categories}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  placeholder="Add new sub-category"
                  classNames={{
                    tags: "tags-container d-flex flex-wrap gap-1 w-100",
                    tagInput: "tag-input w-100",
                    tagInputField: "form-control w-100 border-0 shadow-none",
                    tag: "badge bg-primary d-flex align-items-center",
                    remove: "ms-1 text-white fw-bold cursor-pointer",
                  }}
                />
              </div>
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
    </>
  );
}
export default Create;