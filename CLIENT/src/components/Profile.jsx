import "../App.css";
import React, { useEffect, useState } from "react";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = localStorage.getItem('token');

export default function Profile(){
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");
    const getUserProfileData = async () => {
        try {
            const response = await fetch(`${HOST}:${PORT}/server/get-profile-details`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  }
          });
    
          if (response) {
            const result = await response.json();
            if (response.ok && result.doc) {
                setData(result.doc)
            } else {
              setError(result.msg);
            }
          } else {
            setError("We are unable to process now. Please try again later.");
          }
        } catch (error) {
          setError("We are unable to process now. Please try again later.");
        }
    
        setTimeout(() => {
          setResponse("");
          setError("");
        }, 3000);
      };
    
      useEffect(() => {
        getUserProfileData();
      }, []);


    return(
        <div>
            {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
            {response && (<div className="alert alert-success" role="alert">{response}</div>)}
            <main className="container my-2">
                <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <h4 className="text-center m-2">User Profile</h4>
                    <div className=" justify-content-center">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="row">User Type</th>
                                    <td scope="row">: {data.user_type}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Code</th>
                                    <td scope="row">: {data.code}</td>
                                </tr>
                                <tr> 
                                    <th scope="row">Name</th>
                                    <td scope="row">: {data.name}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Phone</th>
                                    <td scope="row">: {data.phone}</td>
                                </tr>
                                {(data.user_type == "COMPANY") &&<tr> 
                                    <th scope="row">GST No: </th>
                                    <td scope="row">: {data.gstNo}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Director: </th>
                                    <td scope="row">: {data.director}</td>
                                </tr>}
                                {(data.user_type == "COMPANY") &&<tr> 
                                    <th scope="row">Company type: </th>
                                    <td scope="row">: {data.company_type_name}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Company Sub Type: </th>
                                    <td scope="row">: {data.company_subtype}</td>
                                </tr>}
                                <tr>
                                    <th scope="row">Email</th>
                                    <td scope="row">: {data.email}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Pin Code</th>
                                    <td scope="row">: {data.pin}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Address</th>
                                    <td scope="row">: {data.address}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Company</th>
                                    <td scope="row">: {data.company_name ? data.company_name : "Not applicable"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Creation Date</th>
                                    <td scope="row">: {data.createdAt}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Activation Status</th>
                                    <td scope="row">: {data.active}</td>
                                </tr>
                                {(data.user_type == "COMPANY") && <tr>
                                    <th scope="row">Subscription</th>
                                    <td scope="row">: {data.subscription ? "Valid": "Invalid"}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Subscription Duration</th>
                                    <td scope="row">: {data.subscriptionDuration} Months</td>
                                </tr>}
                                {/* {(data.user_type == "TEACHER") && (<tr>
                                    <th scope="row">Teacher Code</th>
                                    <td scope="row">: {data.teacher_code}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Employee Id</th>
                                    <td scope="row">: {data.employee_id}</td>
                                </tr>)}*/}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}