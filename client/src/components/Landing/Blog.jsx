import React from 'react';

function Blog() {
  return (
    <div>
      {/* Blog Start */}
      <div className="container-fluid blog pb-5">
        <div className="container pb-5">
          <div className="text-center mx-auto pb-5">
            <h4 className="text-primary">Our Blog &amp; News</h4>
            <h1 className="display-5 mb-4">Articles For Pro Traders</h1>
            <p className="mb-0">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur adipisci facilis cupiditate recusandae aperiam temporibus corporis itaque quis facere, numquam, ad culpa deserunt sint dolorem autem obcaecati, ipsam mollitia hic.
            </p>
          </div>
          
          {/* Blog Items without Owl Carousel */}
          <div className="row">
            {/* Blog Item 1 */}
            <div className="col-md-4">
              <div className="blog-item p-4">
                <div className="blog-img mb-4">
                  <img src="assets/img/service-3.jpg" className="img-fluid w-100 rounded" alt="Image showing a blog post on Dividend Stocks" />
                  <div className="blog-title">
                    <a href="#" className="btn">Dividend Stocks</a>
                  </div>
                </div>
                <a href="#" className="h4 d-inline-block mb-3">Options Trading Business?</a>
                <p className="mb-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore aut aliquam suscipit error corporis accusamus labore....
                </p>
                <div className="d-flex align-items-center">
                  <img src="assets/img/testimonial-3.jpg" className="img-fluid rounded-circle" style={{ width: 60, height: 60 }} alt="Admin Profile" />
                  <div className="ms-3">
                    <h5>Admin</h5>
                    <p className="mb-0">October 9, 2025</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Blog Item 2 */}
            <div className="col-md-4">
              <div className="blog-item p-4">
                <div className="blog-img mb-4">
                  <img src="assets/img/service-4.jpg" className="img-fluid w-100 rounded" alt="Image showing a blog post on Non-Dividend Stocks" />
                  <div className="blog-title">
                    <a href="#" className="btn">Non-Dividend Stocks</a>
                  </div>
                </div>
                <a href="#" className="h4 d-inline-block mb-3">Options Trading Business?</a>
                <p className="mb-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore aut aliquam suscipit error corporis accusamus labore....
                </p>
                <div className="d-flex align-items-center">
                  <img src="assets/img/testimonial-1.jpg" className="img-fluid rounded-circle" style={{ width: 60, height: 60 }} alt="Admin Profile" />
                  <div className="ms-3">
                    <h5>Admin</h5>
                    <p className="mb-0">October 9, 2025</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Blog Item 3 */}
            <div className="col-md-4">
              <div className="blog-item p-4">
                <div className="blog-img mb-4">
                  <img src="assets/img/service-1.jpg" className="img-fluid w-100 rounded" alt="Image showing a blog post on Dividend Stocks" />
                  <div className="blog-title">
                    <a href="#" className="btn">Dividend Stocks</a>
                  </div>
                </div>
                <a href="#" className="h4 d-inline-block mb-3">Options Trading Business?</a>
                <p className="mb-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore aut aliquam suscipit error corporis accusamus labore....
                </p>
                <div className="d-flex align-items-center">
                  <img src="assets/img/testimonial-1.jpg" className="img-fluid rounded-circle" style={{ width: 60, height: 60 }} alt="Admin Profile" />
                  <div className="ms-3">
                    <h5>Admin</h5>
                    <p className="mb-0">October 9, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Blog End */}
    </div>
  );
}

export default Blog;
