import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './News&Offers.css';
import './modal.css';

// Import images
import u23Image from '../../assets/img/u23.jpg';
import summerDealsImage from '../../assets/img/summer-deals.jpg';
import chocolatePopcornImage from '../../assets/img/chocolate-popcorn.jpg';
import backToSchoolImage from '../../assets/img/back-to-school.jpg';
import womanDayImage from '../../assets/img/woman-day.jpg';

// Dữ liệu mẫu cho các chương trình khuyến mãi
// Bạn có thể thay thế bằng dữ liệu thật từ API
const promotionsData = [
  {
    id: 1,
    image: u23Image,
    title: 'U22: Unbeatable Value. Unforgettable Experience.',
    summary: 'Summer is here! U22 Student Deal: Movie tickets from just 55,000 VND. (Ages 22 & under).',
    details: {
        fullTitle: 'U22 DEAL: ONLY 55,000VND/TICKET',
        date: 'Starting today !!!',
        content: `
            <p class="mb-4"> <strong>Calling all students! We've got an amazing deal just for you.</strong></p>
            <h3 class="text-xl font-bold mb-2">Fresh Flicks, Sweet Deals.</h3>
            <p class="mb-4">Simply present your student ID, or any valid ID proving you are under 23, to instantly receive this unbeatable ticket price!</p>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Your chance to enjoy special screenings with promotional tickets starting from <strong>55.000Đ.</strong>.</li>
                <li>Enjoy a quiet atmosphere, comfortable seats, and a crowd-free experience – it's the ideal choice.</li>
                <li>Grab your friends and experience the latest blockbusters at a special rate.</li>
            </ul>
            <h3 class="text-xl font-bold mb-2">Promotion information</h3>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li><strong>This offer is applicable to students under 23.</strong></li>
                <li><strong>Special Price:</strong> Starting from just 55,000 VND/ticket.</li>
                <li><strong>Conditions:</strong> Please present your Student ID or ID Card when purchasing tickets.</li>
                <li><strong>Please note:</strong> Prices may vary by cinema location. Customers are encouraged to check details at the box office or on our website.</li>
            </ul>
            <h3 class="text-xl font-bold mb-2">Book your tickets <strong>TODAY</strong></h3>
            <ul class="list-disc list-inside pl-4">
                <li>Go to our website.</li>
                <li>Or purchase your tickets at the nearest box office.</li>
            </ul>
        `
    }
  },
  {
    id: 2,
    image: summerDealsImage,
    title: 'SUMMER FLICKS! COOL DEAL!',
    summary: 'Cool off this summer! Buy 1 movie ticket, get a free cold soda to double the fun. Do not miss out on this fantastic deal!',
    details: {
        fullTitle: 'BUY 1 TICKET, GET 1 FREE SODA - BEAT THE SUMMER HEAT',
        date: 'Available all summer long',
        content: `
            <p class="mb-4">The hot summer is here! What could be better than sitting in a cool cinema, enjoying a blockbuster movie, and sipping on a free soda?</p>
            <h3 class="text-xl font-bold mb-2">Offer Details</h3>
            <p class="mb-4">When you purchase any 2D movie ticket at the cinema, you will instantly receive a voucher for one (1) free medium soda, redeemable at the concession stand.</p>
            <h3 class="text-xl font-bold mb-2">Terms and Conditions</h3>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Valid for all showtimes, Monday through Sunday.</li>
                <li>Cannot be combined with other promotions or offers.</li>
                <li>Offer is valid while supplies last and may end early.</li>
                <li>The soda voucher is valid for same-day use only.</li>
            </ul>
            <p>Bring your friends and family to the cinema and enjoy a truly "cool" summer !!</p>
        `
    }
  },
  {
    id: 3,
    image: chocolatePopcornImage,
    title: 'LIMITED EDITION CHOCOLATE POPCORN',
    summary: 'Introducing for the first time! Enjoy the new and delicious flavor of chocolate popcorn. Upgrade your combo for just 7,000 VND.',
    details: {
        fullTitle: 'TRY THE NEW FLAVOR: CHOCOLATE POPCORN',
        date: 'Available for a limited time only',
        content: `
            <p class="mb-4">Calling all movie lovers and foodies! For the first time ever, we're introducing a brand-new popcorn flavor: <strong>Chocolate Popcorn</strong>. It’s the perfect combination of crispy popcorn and rich, sweet chocolate.</p>
            <h3 class="text-xl font-bold mb-2">A Tasty Upgrade for Extra Fun</h3>
            <p class="mb-4">When you purchase any popcorn combo, you can easily upgrade to this unique chocolate flavor for a special additional fee:</p>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Add only <strong>7,000 VND</strong> to upgrade to a small chocolate popcorn.</li>
                <li>Add only <strong>10,000 VND</strong> to upgrade to a large chocolate popcorn.</li>
            </ul>
            <p class="mb-4">This is your one-of-a-kind opportunity to try this new flavor while enjoying the best movies.</p> <p><strong>This is a limited-time offer. Visit our cinema and try it today!</strong></p>
        `
    }
  },
  {
    id: 4,
    image: backToSchoolImage,
    title: 'BACK TO SCHOOL PROMOTION', 
    summary: 'Welcome the new school year with a special offer for students. Get 30% off movie tickets for groups of 4 or more.', 
    details: { fullTitle: 'BACK TO SCHOOL - AMAZING DEAL FOR STUDENTS', 
      date: 'Valid from August 15 to September 15', 
      content: `

<p class="mb-4">To celebrate the new school year, the cinema is launching a special promotion just for students!</p>
 <h3 class="text-xl font-bold mb-2">Amazing Deals</h3> 
 <ul class="list-disc list-inside mb-4 pl-4"> 
 <li>Get 30% off ticket prices for groups of 4 or more.</li> 
 <li>Receive a free Popcorn & Soda combo when booking 3 days in advance.</li> 
 <li>Special: Exclusive early screenings for students.</li> </ul> 
 <p><strong>Gather your friends and head to the cinema to enjoy these offers!</strong></p>
        `
    }
  },
  {
    id: 5,
    image: womanDayImage,
    title: 'VIETNAMESE WOMEN’S DAY 20/10', 
    summary: 'A special promotion to celebrate Vietnamese Wome’s Day 20/10. Enjoy 50% off for all female customers.', 
    details: { 
      fullTitle: 'CELEBRATING VIETNAMESE WOMEN’S DAY 20/10', 
      date: 'Valid from October 18 to October 20', 
      content: `
      <p class="mb-4">On the occasion of Vietnamese Women's Day 20/10, the cinema sends special offers to the beautiful half of the world:</p>
      <ul class="list-disc list-inside mb-4 pl-4"> 
      <li>50% off ticket prices for all female customers.</li> 
      <li>Receive a free 100,000VND shopping voucher.</li> 
      <li>A special gift for groups of 3 or more female customers.</li> </ul>
      <p><strong>Come and enjoy memorable moments!</strong></p>
        `
    }
  },
];

// Component cho mỗi thẻ ưu đãi
const OfferCard = ({ offer, onClick }) => {
  return (
    <div 
      className="offer-card group"
      onClick={() => onClick(offer)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={offer.image} 
          alt={offer.title} 
          className="offer-card-image "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>
      <div className="p-6 relative">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors" style={{ color: '#ffd54f' }}>{offer.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{offer.summary}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
      </div>
    </div>
  );
};

// Component chính của ứng dụng
export default function Offers() {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleOpenModal = (offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };

  return (
    <div className=" min-h-screen font-sans">
      <div className="container mx-auto px-4 py-12">
        <h1 className="page-title text-4xl font-bold text-center mb-8" style={{ color: '#ffd54f' }}>
          SPECIAL OFFERS
        </h1>
        <br/>
        <div className="promotions-grid mt-12">
          {promotionsData.map(offer => (
            <OfferCard key={offer.id} offer={offer} onClick={handleOpenModal} />
          ))}
        </div>
      </div>
      
            <Modal 
        show={selectedOffer !== null} 
        onHide={handleCloseModal} 
        size="lg"
        className="modal-promotion"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-2xl font-bold text-blue-600"style={{ color: '#ffd54f' }}>{selectedOffer?.details?.fullTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-6" >
          {selectedOffer && (
            <div className="space-y-6" >
              <div className="relative rounded-lg overflow-hidden " >
                <img 
                  src={selectedOffer.image}
                  alt={selectedOffer.title}
                  className="w-full h-80 object-cover object-center"
                />
              </div>
              <div 
                className="prose max-w-none prose-blue prose-lg prose-img:rounded-lg prose-headings:text-blue-600"
                dangerouslySetInnerHTML={{ __html: selectedOffer.details.content }}
              />
              <p className=" text-[20px]"><strong>*{selectedOffer.details.date}</strong></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="primary" 
            onClick={handleCloseModal}
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-6 py-2 rounded-full"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
