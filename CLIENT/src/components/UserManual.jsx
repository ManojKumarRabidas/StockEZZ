import React, { useState } from "react";
import "../App.css";

export default function UserManual(){
    const [video1Loaded, setVideo1Loaded] = useState(false);
    const [video2Loaded, setVideo2Loaded] = useState(false);
    const [video3Loaded, setVideo3Loaded] = useState(false);
    const [video4Loaded, setVideo4Loaded] = useState(false);
    const [video5Loaded, setVideo5Loaded] = useState(false);
    const [video6Loaded, setVideo6Loaded] = useState(false);
    return(
        <div className="d-flex flex-column justify-content-between" style={{minHeight: "90vh"}}>
            <div className="mx-5 mb-5 px-5">
                <h5 className="text-center"><strong>User Manual</strong></h5>
                <div className="px-5">
                    <hr />
                    <div className="text-center">No data available</div>
                    {/* <div className="d-flex justify-content-between">
                        <div>
                            <span><strong>Video 1:</strong>  This is a introduction video about the application. <br /></span> <br />
                            <span><strong>Youtube Link:</strong>  <a target="_blank" href="https://www.youtube.com/watch?v=Y9wx7XYRapo&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=1">EduInsights - 0 | Introduction</a> (Please use headphones for better experience)<br /></span>
                        </div>
                        <div style={{ width: "400px", height: "200px", position: "relative" }}>
                            {!video1Loaded && (
                                <div style={{ minWidth: "400px" }} className="loader d-flex flex-column justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                    </div>
                                    <span className="">Loading...</span>
                                </div>
                            )}
                            <iframe
                                width="400"
                                height="200"
                                src="https://www.youtube.com/embed/watch?v=Y9wx7XYRapo&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=1"
                                title="Video 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setVideo1Loaded(true)}
                                style={{ display: video1Loaded ? "block" : "none" }}
                            ></iframe>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div>
                            <span><strong>Video 2:</strong>  The initial flow of admin is discussed here. At first what the admin need to do is discussed in detail here. <br /></span> <br />
                            <span><strong>Youtube Link:</strong>  <a target="_blank" href="https://www.youtube.com/watch?v=38AzI1Kxj4I&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=2">EduInsights - 1 | Admin Flow</a> (Please use headphones for better experience)<br /></span>
                        </div>
                        <div style={{ width: "400px", height: "200px", position: "relative" }}>
                            {!video2Loaded && (
                                <div style={{ minWidth: "400px" }} className="loader d-flex flex-column justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                    </div>
                                    <span className="">Loading...</span>
                                </div>
                            )}
                            <iframe
                                width="400"
                                height="200"
                                src="https://www.youtube.com/embed/watch?v=38AzI1Kxj4I&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=2"
                                title="Video 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setVideo2Loaded(true)}
                                style={{ display: video1Loaded ? "block" : "none" }}
                            ></iframe>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div>
                            <span><strong>Video 3:</strong>  The initial flow of support admin is discussed here. At first what the support admin need to do is discussed in detail here. <br /></span> <br />
                            <span><strong>Youtube Link:</strong>  <a target="_blank" href="https://www.youtube.com/watch?v=Gn8swKq7U0I&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=3">EduInsights - 2 | Support User Flow (Initial Flow)</a> (Please use headphones for better experience)<br /></span>
                        </div>
                        <div style={{ width: "400px", height: "200px", position: "relative" }}>
                            {!video3Loaded && (
                                <div style={{ minWidth: "400px" }} className="loader d-flex flex-column justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                    </div>
                                    <span className="">Loading...</span>
                                </div>
                            )}
                            <iframe
                                width="400"
                                height="200"
                                src="https://www.youtube.com/embed/watch?v=Gn8swKq7U0I&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=3"
                                title="Video 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setVideo3Loaded(true)}
                                style={{ display: video1Loaded ? "block" : "none" }}
                            ></iframe>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div>
                            <span><strong>Video 4:</strong>  Here the flow of the teacher is duscussed in details. Including all the features available for teacher is duscussed.  <br /></span> <br />
                            <span><strong>Youtube Link:</strong>  <a target="_blank" href="https://www.youtube.com/watch?v=tQf3wRdln_4&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=4">EduInsights - 3 | Teacher Flow</a> (Please use headphones for better experience)<br /></span>
                        </div>
                        <div style={{ width: "400px", height: "200px", position: "relative" }}>
                            {!video4Loaded && (
                                <div style={{ minWidth: "400px" }} className="loader d-flex flex-column justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                    </div>
                                    <span className="">Loading...</span>
                                </div>
                            )}
                            <iframe
                                width="400"
                                height="200"
                                src="https://www.youtube.com/embed/watch?v=tQf3wRdln_4&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=4"
                                title="Video 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setVideo4Loaded(true)}
                                style={{ display: video1Loaded ? "block" : "none" }}
                            ></iframe>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div>
                            <span><strong>Video 5:</strong>  Here the flow of the student is duscussed in details. Including all the features available for student is duscussed. <br /></span> <br />
                            <span><strong>Youtube Link:</strong>  <a target="_blank" href="https://www.youtube.com/watch?v=B6eJlkwtUZg&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=5">EduInsights - 4 | Student Flow</a> (Please use headphones for better experience)<br /></span>
                        </div>
                        <div style={{ width: "400px", height: "200px", position: "relative" }}>
                            {!video5Loaded && (
                                <div style={{ minWidth: "400px" }} className="loader d-flex flex-column justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                    </div>
                                    <span className="">Loading...</span>
                                </div>
                            )}
                            <iframe
                                width="400"
                                height="200"
                                src="https://www.youtube.com/embed/watch?v=B6eJlkwtUZg&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=5"
                                title="Video 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setVideo5Loaded(true)}
                                style={{ display: video1Loaded ? "block" : "none" }}
                            ></iframe>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <div>
                            <span><strong>Video 6:</strong> All the features available for admin and support admin is discussed here. <br /></span> <br />
                            <span><strong>Youtube Link:</strong>  <a target="_blank" href="https://www.youtube.com/watch?v=V8JjXjUm68M&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=6">EduInsights - 5 | Support User Flow (Final Flow)</a> (Please use headphones for better experience)<br /></span>
                        </div>
                        <div style={{ width: "400px", height: "200px", position: "relative" }}>
                            {!video6Loaded && (
                                <div style={{ minWidth: "400px" }} className="loader d-flex flex-column justify-content-center align-items-center mt-5">
                                    <div className="spinner-border" role="status">
                                    </div>
                                    <span className="">Loading...</span>
                                </div>
                            )}
                            <iframe
                                width="400"
                                height="200"
                                src="https://www.youtube.com/embed/watch?v=V8JjXjUm68M&list=PLpHN6SEszUDTWEtgSbcO9m3ZHn-Z1tynk&index=6"
                                title="Video 1"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setVideo6Loaded(true)}
                                style={{ display: video1Loaded ? "block" : "none" }}
                            ></iframe>
                        </div>
                    </div>
                    <hr /> */}
                </div>
            </div>
            <div className="text-center m-2">
            <div>Please feel free to reach us if you have any opinions or features we should include in the application to make it more usefull for you. Mail us on support@stockezz.in</div>
            <div>&copy; Copyright 2024 by stockezz.in || All Rights Reserved</div>
            </div>
        </div>
    )
}