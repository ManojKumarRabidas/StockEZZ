function Unauthorized() {
    return (
      <div>
        <main className="container my-2">
          <section className="bg-light py-5">
            <div className="container px-5">
              <div className="row gx-5 justify-content-center">
                <div className="col-xxl-8">
                  <div className="text-center my-5">
                    <h2 className="display-5 fw-bolder">
                      <span className="text-gradient d-inline">Unauthorized</span>
                    </h2>
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
          </section>
        </main>
      </div>
    );
  }
  
  export default Unauthorized;
  