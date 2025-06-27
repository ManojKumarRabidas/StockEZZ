import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WithContext as ReactTags } from 'react-tag-input';
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = localStorage.getItem('token');
import toastr from 'toastr';
function Update() {
    const [category, setCategory] = useState("");
    const [sub_categories, setSubCategories] = useState([]);
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

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

  const getCategoryData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/category-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
            setCategory(result.doc.category);
            setSubCategories(result.doc.sub_categories);
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

  useEffect(() => {
    getCategoryData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateCategory = {category, sub_categories, active };
    if (!category ){
      toastr.error("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/category-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateCategory),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Category details updated successfully.");
            navigate("/categories/category-list");
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
            <label className="form-label">Category <span className="ei-col-red">*</span></label>
            <input name="name" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={category} onChange={(e) => setCategory(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Sub Categories</label>
            {/* <input name="phone" type="text" maxLength={10} className="form-control" aria-describedby="emailHelp" value={sub_category} onChange={(e) => setSubCategory(e.target.value)}/> */}
            <ReactTags
              tags={sub_categories}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              placeholder="Add new sub-category"
              classNames={{
                tags: "form-control tag-container",
                tagInput: "tag-input",
                tag: "badge bg-primary me-1",
                remove: "ms-1 text-danger cursor-pointer",
              }}
            />
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
