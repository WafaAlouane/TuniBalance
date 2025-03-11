import React from 'react';

function Team() {
  return (
    <div>
      {/* Team Section */}
      <section id="team" className="team section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>Team</h2>
          <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
        </div>
        
        <div className="container">
          <div className="row gy-4">
            {[ // Tableau de membres d'équipe
              {
                img: "assets/img/person/person-m-7.webp",
                name: "Walter White",
                role: "Chief Executive Officer",
                desc: "Explicabo voluptatem mollitia et repellat qui dolorum quasi"
              },
              {
                img: "assets/img/person/person-f-8.webp",
                name: "Sarah Jhonson",
                role: "Product Manager",
                desc: "Aut maiores voluptates amet et quis praesentium qui senda para"
              },
              {
                img: "assets/img/person/person-m-6.webp",
                name: "William Anderson",
                role: "CTO",
                desc: "Quisquam facilis cum velit laborum corrupti fuga rerum quia"
              },
              {
                img: "assets/img/person/person-f-4.webp",
                name: "Amanda Jepson",
                role: "Accountant",
                desc: "Dolorum tempora officiis odit laborum officiis et et accusamus"
              }
            ].map((member, index) => (
              <div 
                key={member.name}
                className="col-lg-6" 
                data-aos="fade-up" 
                data-aos-delay={100 * (index + 1)}
              >
                <div className="team-member d-flex align-items-start">
                  <div className="pic">
                    <img 
                      src={member.img} 
                      className="img-fluid" 
                      alt={member.name} // Correction de l'attribut alt
                    />
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <span>{member.role}</span>
                    <p>{member.desc}</p>
                    <div className="social">
                      {/* Liens corrigés avec href valides */}
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-twitter-x" />
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook" />
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-instagram" />
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-linkedin" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Team;