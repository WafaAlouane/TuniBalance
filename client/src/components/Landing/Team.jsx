import React from 'react';

function Team() {
  const teamMembers = [
    { img: "assets/img/team-1.jpg", name: "David James", profession: "Senior Financial Consultant" },
    { img: "assets/img/team-2.jpg", name: "Sarah Johnson", profession: "Finance Expert" },
    { img: "assets/img/team-3.jpg", name: "Michael Brown", profession: "Investment Analyst" },
    { img: "assets/img/team-4.jpg", name: "Emma Wilson", profession: "Stock Market Strategist" }
  ];

  return (
    <div className="container-fluid team pb-5">
      <div className="container pb-5">
        <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: 800 }}>
          <h4 className="text-primary">Our Team</h4>
          <h1 className="display-5 mb-4">Meet Our Advisers</h1>
          <p className="mb-0">
            Our team of financial experts is dedicated to helping you make informed investment decisions and achieve financial success.
          </p>
        </div>
        <div className="row g-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay={`${0.2 + index * 0.2}s`}>
              <div className="team-item">
                <div className="team-img">
                  <img src={member.img} className="img-fluid" alt={`Photo of ${member.name}, ${member.profession}`} />
                </div>
                <div className="team-title">
                  <h4 className="mb-0">{member.name}</h4>
                  <p className="mb-0">{member.profession}</p>
                </div>
                <div className="team-icon">
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter" />
                  </a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a className="btn btn-primary btn-sm-square rounded-circle" href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
