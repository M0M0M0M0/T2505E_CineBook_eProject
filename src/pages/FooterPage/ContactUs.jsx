import React, { useState } from 'react';
import './ContactUs.css'; 


export default function ContactUs() {
  

  const [isSubmitted, setIsSubmitted] = useState(false);


  const initialFormState = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  const [formData, setFormData] = useState(initialFormState);


  const handleChange = (e) => {
    
    const { name, value } = e.target; 
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    setIsSubmitted(true);
    
    setFormData(initialFormState);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="container py-5">
        
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead">
            We're here to help. Reach out to us with any questions or feedback.
          </p>
        </div>

        <div className="row g-5">

          <div className="col-lg-7">
            <h3 className="fw-bold mb-4">Send Us a Message</h3>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="row g-3">
                
                {/* Name */}
                <div className="col-md-6">
                  <label htmlFor="contact-name" className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="contact-name" 
                    name="name"
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={handleChange} 
                  />
                </div>
                
                {/* Email */}
                <div className="col-md-6">
                  <label htmlFor="contact-email" className="form-label">Your Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="contact-email" 
                    name="email" 
                    placeholder="name@example.com" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>
                
             
                <div className="col-12">
                  <label htmlFor="contact-subject" className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="contact-subject" 
                    name="subject" 
                    placeholder="Booking Issue, Feedback,..." 
                    required 
                    value={formData.subject} 
                    onChange={handleChange}
                  />
                </div>
                
                {/* Message */}
                <div className="col-12">
                  <label htmlFor="contact-message" className="form-label">Your Message</label>
                  <textarea 
                    className="form-control" 
                    id="contact-message" 
                    name="message" 
                    rows="5" 
                    placeholder="Tell us more..." 
                    required 
                    value={formData.message} 
                    onChange={handleChange} 
                  ></textarea>
                </div>

                <div className="col-12 d-flex align-items-center gap-3">
                  <button type="submit" className="btn btn-warning btn-lg">Send Message</button>
                  
                 
                  {isSubmitted && (
                    <div className="text-warning  fw-bold">
                      Message sent successfully!
                    </div>
                  )}
                </div>
              </div>
            </form>

          </div>

       
          <div className="col-lg-5">
            <h3 className="fw-bold mb-4">Contact Information</h3>
            <div className="contact-info-wrapper">
              
            
              <div className="info-box">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div className="info-text">
                  <h5>Our Address</h5>
                  <p>13 Trinh Van Bo, Xuan Phuong, Nam Tu Liem, Hanoi</p>
                </div>
              </div>
              
              {/* Box Email */}
              <div className="info-box">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7.00005C4 5.89548 4.89543 5.00005 6 5.00005H18C19.1046 5.00005 20 5.89548 20 7.00005V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7.00005Z"/><path d="M4 7L12 13L20 7"/></svg>
                </div>
                <div className="info-text">
                  <h5>Email Us</h5>
                  <p>support@cinebook.com</p>
                </div>
              </div>

           
              <div className="info-box">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 1.77a19.31 19.31 0 0 1-18-18A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45a12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div className="info-text">
                  <h5>Call Us</h5>
                  <p>+123 456 789 (Hotline 24/7)</p>
                </div>
              </div>

            </div>
          </div>
        </div>

     
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="fw-bold mb-4 text-center">Our Location</h3>
            <div className="contact-map-container shadow rounded">
             
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.887278999934!2d105.74632157471454!3d21.037195787489825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455305afd834b%3A0x17268e09af37081e!2sT%C3%B2a%20nh%C3%A0%20FPT%20Polytechnic.!5e0!3m2!1sen!2s!4v1763211768951!5m2!1sen!2s"
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}