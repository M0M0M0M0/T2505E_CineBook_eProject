import React, { useState, useMemo,useRef} from 'react';
import './Career.css'; 


const allJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Hanoi',
    type: 'Full-time'
  },
  {
    id: 2,
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Ho Chi Minh City',
    type: 'Full-time'
  },
  {
    id: 3,
    title: 'Customer Support Agent (Night Shift)',
    department: 'Support',
    location: 'Remote',
    type: 'Part-time'
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    department: 'Engineering',
    location: 'Hanoi',
    type: 'Full-time'
  },
  {
    id: 5,
    title: 'Content Manager (Social Media)',
    department: 'Marketing',
    location: 'Da Nang',
    type: 'Full-time'
  },
];


export default function Careers() {
  const [filters, setFilters] = useState({
    department: 'All',
    location: 'All',
  });

  const generalApplyRef = useRef(null);
  const fileInputRef = useRef(null);


  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const passesDept = filters.department === 'All' || job.department === filters.department;
      const passesLoc = filters.location === 'All' || job.location === filters.location;
      return passesDept && passesLoc;
    });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = () => {
    generalApplyRef.current?.scrollIntoView({
      behavior: 'smooth', 
      block: 'start'
    });
  };
const handleSubmitCvClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Đã chọn file:", file.name);
      
    }
  };
  return (
    <div className="careers-page">
      
      {/* HERO SECTION */}
      <div className="careers-hero container text-center py-5">
        <h1 className="display-4 fw-bold">Join Our Team</h1>
        <p className="lead col-lg-8 mx-auto">
          Help us redefine the cinema experience. We are looking for passionate,
          creative, and customer-centric people to build the future of movie booking.
        </p>
      </div>

      {/* WHY WORK WITH US? (Perks & Benefits) */}
      <div className="why-work-section container py-5">
        <h2 className="text-center fw-bold mb-5">Perks & Benefits</h2>
        <div className="row g-4 row-cols-1 row-cols-md-3">
          {/* Perk 1 */}
          <div className="col">
            <div className="perk-card h-100">
              <div className="perk-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
              </div>
              <h5>Free Movie Tickets</h5>
              <p>As a CineBook employee, enjoy free access to movies at our partner theaters.</p>
            </div>
          </div>
          {/* Perk 2 */}
          <div className="col">
            <div className="perk-card h-100">
              <div className="perk-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h5>Flexible Work Hours</h5>
              <p>We believe in work-life balance with flexible scheduling and remote options.</p>
            </div>
          </div>
          {/* Perk 3 */}
          <div className="col">
            <div className="perk-card h-100">
              <div className="perk-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.02c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M12 12.016c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0-4c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1z"/><path d="M12.001 14.016c-2.206 0-4 1.794-4 4h8c0-2.206-1.795-4-4.001-4zm0 2c1.103 0 2 .897 2 2h-4c0-1.103.897-2 2-2z"/></svg>
              </div>
              <h5>Health & Wellness</h5>
              <p>Comprehensive health insurance and wellness programs for you and your family.</p>
            </div>
          </div>
        </div>
      </div>

      {/*  OPEN POSITIONS */}
      <div className="open-positions-section container py-5">
        <h2 className="text-center fw-bold mb-5">Open Positions</h2>
        
        {/* Job Filters */}
        <div className="job-filters row g-3 mb-4 p-3 rounded">
          <div className="col-md-5">
            <label htmlFor="filter-department" className="form-label">Department</label>
            <select id="filter-department" name="department" className="form-select" onChange={handleFilterChange}>
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div className="col-md-5">
            <label htmlFor="filter-location" className="form-label">Location</label>
            <select id="filter-location" name="location" className="form-select" onChange={handleFilterChange}>
              <option value="All">All Locations</option>
              <option value="Hanoi">Hanoi</option>
              <option value="Ho Chi Minh City">Ho Chi Minh City</option>
              <option value="Da Nang">Da Nang</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="job-list-container">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              
              <div 
                className="job-card d-flex flex-column flex-md-row justify-content-between align-items-md-center" 
                key={job.id}
              >
                <div className="job-card-info">
                  <h5 className="job-title">{job.title}</h5>
                  <div className="job-meta">
                    <span>{job.department}</span>
                    <span>&bull;</span>
                    <span>{job.location}</span>
                    <span>&bull;</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <div className="job-card-apply mt-3 mt-md-0">
                  
                  <button className="btn btn-warning" onClick={handleApplyClick}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-5 job-card-empty">
              <h5 className="fw-bold">No matching positions</h5>
              <p>There are currently no open positions matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/*  GENERAL APPLICATION */}
      <div className="general-apply-section py-5" ref={generalApplyRef}>
        <div className="container text-center p-5 rounded">
          <h3 className="fw-bold mb-3">Don't see a fit?</h3>
          <p className="lead mb-4">
            We are always looking for talented people. Send us your resume and
            we'll contact you if a suitable position opens up.
          </p>
          
          <button className="btn btn-outline-warning btn-lg" onClick={handleSubmitCvClick}>
            Submit Your CV
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            style={{ display: 'none' }} 
            accept=".pdf,.doc,.docx" 
          />
        </div>
      </div>

    </div>
  );
}