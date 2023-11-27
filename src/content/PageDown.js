import React, { Fragment } from 'react';

const PageDown = () => {
  return (
    <Fragment>
      <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1>Service is Down</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Service is Down</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
   
    <section className="content">
      <div className="error-page">

        <div className="error-content">
          <h3><i className="fas fa-exclamation-triangle text-warning"></i> Oops! Service not available.</h3>

          <p>
            Try again after sometime.
            Meanwhile, you may <a href="/">return to dashboard</a>
          </p>

        </div>
     
      </div>
    </section>
    </Fragment>
  );
};

export default PageDown;
