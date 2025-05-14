import React from 'react';
import '../../styles/landing.css';
import teamCEO from '../../assets/landing/team-ceo.svg';
import teamPM from '../../assets/landing/team-pm.svg';
import teamCTO from '../../assets/landing/team-cto.svg';
import teamCFO from '../../assets/landing/team-cfo.svg';

function Team() {
  const teamMembers = [
    {
      img: teamCEO,
      name: "Walter White",
      role: "Chief Executive Officer",
      desc: "Financial expert with over 15 years of experience in the industry.",
      social: {
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      img: teamPM,
      name: "Sarah Johnson",
      role: "Product Manager",
      desc: "Leads our product development with a focus on user experience and innovation.",
      social: {
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      img: teamCTO,
      name: "William Anderson",
      role: "CTO",
      desc: "Tech visionary ensuring our platform uses the latest and most secure technologies.",
      social: {
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      img: teamCFO,
      name: "Amanda Jepson",
      role: "Chief Financial Officer",
      desc: "Expert in financial planning and strategy with a background in accounting.",
      social: {
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    }
  ];

  return (
    <section id="team" className="landing-team landing-section">
      <div className="container mx-auto px-6">
        <h2 className="section-title">Our Team</h2>
        <p className="section-subtitle">
          Meet the talented professionals behind TuniBalance who are dedicated to helping you achieve financial success.
        </p>

        <div className="landing-team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="landing-team-card">
              <img
                src={member.img}
                alt={member.name}
                className="landing-team-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/300x300?text=${member.name.split(' ')[0]}`;
                }}
              />
              <div className="landing-team-info">
                <h3 className="landing-team-name">{member.name}</h3>
                <p className="landing-team-position">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{member.desc}</p>
                <div className="landing-team-social">
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="landing-team-social-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="landing-team-social-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="landing-team-social-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="landing-team-social-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;