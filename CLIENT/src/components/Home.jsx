function Home() {
  return (
    <div>
      <main className="container my-2">
        <section className="bg-light">
          <div className="container p-5">
            <div className="row gx-5 justify-content-center">
              <div className="col-xxl-8">
                <div className="text-center my-4">
                  <h2 className="display-5 fw-bolder">
                    <span className="text-gradient d-inline">StockEZZ</span>
                  </h2>
                  <p className="lead fw-light mb-4">
                    A Stock Management System
                  </p>
                  <p className="text-muted" id="font">
                  Description
                  <br />
                  <br />
                  

                  </p>
                  <div className="d-flex justify-content-center fs-2 gap-4">
                    <a className="text-gradient" href="#!">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a className="text-gradient" href="#!">
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a className="text-gradient" href="#!">
                      <i className="bi bi-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="text-center m-3">
                {/* <div>Please feel free to reach us if you have any opinions or features we should include in the application to make it more usefull for you. Mail us on support@eduinsights.in</div> */}
                <div>&copy; Copyright 2025 by stockezz.in || All Rights Reserved</div>
            </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
