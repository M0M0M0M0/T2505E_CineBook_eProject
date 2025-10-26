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
    title: 'U22 - GIÁ SIÊU SỐC, TRẢI NGHIỆM SIÊU ĐỈNH',
    summary: 'Mùa hè rực rỡ đã đến, và rạp phim dành tặng cho các U22 một ưu đãi cực "đã" – giá vé xem phim chỉ từ 55.000 VNĐ dành cho học sinh, sinh viên dưới 22 tuổi.',
    details: {
        fullTitle: 'ƯU ĐÃI U22 - CHỈ 55.000Đ/VÉ',
        date: 'Áp dụng từ hôm nay',
        content: `
            <p class="mb-4">Bạn là "cú đêm" chính hiệu? Bạn đang tìm một trải nghiệm thú vị sau 22h? Hãy để chúng tôi mang đến cho bạn một đêm đáng nhớ với chương trình <strong>Ưu đãi suất chiếu đêm</strong>.</p>
            <h3 class="text-xl font-bold mb-2">Xem phim trẻ - Giá cực mê</h3>
            <p class="mb-4">Chỉ cần mang theo thẻ học sinh/sinh viên hoặc giấy tờ tùy thân chứng minh bạn dưới 23 tuổi, bạn sẽ được hưởng ngay mức giá vé không thể nào hời hơn!</p>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Cơ hội để bạn trải nghiệm những suất chiếu đặc biệt với giá vé ưu đãi chỉ từ <strong>55.000Đ</strong>.</li>
                <li>Không khí rạp yên tĩnh, ghế ngồi thoải mái, không lo chen chúc – đây chính là lựa chọn lý tưởng.</li>
                <li>Cùng bạn bè trải nghiệm rạp phim đêm thú vị.</li>
            </ul>
            <h3 class="text-xl font-bold mb-2">Thông tin chi tiết chương trình</h3>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li><strong>Đối tượng áp dụng:</strong> Tất cả khách hàng dưới 23 tuổi.</li>
                <li><strong>Giá vé ưu đãi:</strong> Chỉ từ 55.000 VNĐ/vé.</li>
                <li><strong>Điều kiện:</strong> Vui lòng xuất trình thẻ HSSV hoặc CMND/CCCD khi mua vé.</li>
                <li><strong>Lưu ý:</strong> Giá vé có thể thay đổi tùy cụm rạp, khuyến khích khách hàng kiểm tra chi tiết tại quầy vé hoặc website.</li>
            </ul>
            <h3 class="text-xl font-bold mb-2">Đặt vé xem phim khuya ngay hôm nay</h3>
            <ul class="list-disc list-inside pl-4">
                <li>Truy cập website của chúng tôi.</li>
                <li>Hoặc mua vé trực tiếp tại quầy vé gần bạn nhất.</li>
            </ul>
        `
    }
  },
  {
    id: 2,
    image: summerDealsImage,
    title: 'SUMMER FLICKS! COOL DEAL!',
    summary: 'Chào hè sảng khoái! Mua 1 vé xem phim, nhận ngay 1 ly soda mát lạnh để nhân đôi niềm vui. Đừng bỏ lỡ cơ hội tuyệt vời này nhé!',
    details: {
        fullTitle: 'MUA 1 VÉ TẶNG 1 SODA - GIẢI NHIỆT MÙA HÈ',
        date: 'Diễn ra trong suốt mùa hè',
        content: `
            <p class="mb-4">Mùa hè nóng bỏng đã tới, còn gì tuyệt vời hơn là ngồi trong rạp phim mát lạnh, thưởng thức một bộ phim bom tấn và nhâm nhi ly soda miễn phí?</p>
            <h3 class="text-xl font-bold mb-2">Chi tiết ưu đãi</h3>
            <p class="mb-4">Khi mua bất kỳ vé xem phim 2D nào tại rạp, bạn sẽ nhận được ngay một phiếu đổi (voucher) để lấy một ly soda cỡ vừa hoàn toàn miễn phí tại quầy bắp nước.</p>
            <h3 class="text-xl font-bold mb-2">Điều khoản và điều kiện</h3>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Áp dụng cho tất cả các suất chiếu trong ngày, từ Thứ Hai đến Chủ Nhật.</li>
                <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác.</li>
                <li>Chương trình có thể kết thúc sớm hơn dự kiến khi hết quà tặng.</li>
                <li>Phiếu đổi soda chỉ có giá trị sử dụng trong ngày.</li>
            </ul>
            <p>Rủ ngay bạn bè và người thân đến rạp để tận hưởng một mùa hè thật "cool" nào!</p>
        `
    }
  },
  {
    id: 3,
    image: chocolatePopcornImage,
    title: 'BẮP RANG SÔ-CÔ-LA PHIÊN BẢN GIỚI HẠN',
    summary: 'Lần đầu tiên ra mắt! Thưởng thức ngay vị bắp rang sô-cô-la mới lạ, thơm lừng. Nâng cấp combo chỉ với 7.000 VNĐ.',
    details: {
        fullTitle: 'THỬ NGAY HƯƠNG VỊ MỚI: BẮP RANG SÔ-CÔ-LA',
        date: 'Chỉ bán trong thời gian có hạn',
        content: `
            <p class="mb-4">Tin nóng hổi cho các tín đồ điện ảnh và ẩm thực! Lần đầu tiên, chúng tôi cho ra mắt hương vị bắp rang hoàn toàn mới: <strong>Bắp Rang Sô-cô-la</strong>. Một sự kết hợp không thể hoàn hảo hơn giữa bắp rang giòn tan và sô-cô-la ngọt ngào, đậm vị.</p>
            <h3 class="text-xl font-bold mb-2">Nâng cấp vị ngon, thêm phần hứng khởi</h3>
            <p class="mb-4">Khi mua bất kỳ combo bắp nước nào, bạn có thể dễ dàng nâng cấp lên hương vị sô-cô-la độc đáo này với một mức phí cực kỳ ưu đãi:</p>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Chỉ thêm <strong>7.000 VNĐ</strong> để nâng cấp lên bắp sô-cô-la cỡ nhỏ.</li>
                <li>Chỉ thêm <strong>10.000 VNĐ</strong> để nâng cấp lên bắp sô-cô-la cỡ lớn.</li>
            </ul>
            <p class="mb-4">Đây là cơ hội có một không hai để trải nghiệm hương vị mới lạ này trong khi thưởng thức những bộ phim hay nhất.</p>
            <p><strong>Ưu đãi chỉ có trong thời gian giới hạn. Hãy đến rạp và thử ngay hôm nay!</strong></p>
        `
    }
  },
  {
    id: 4,
    image: backToSchoolImage,
    title: 'KHUYẾN MÃI BACK TO SCHOOL',
    summary: 'Chào đón năm học mới với ưu đãi đặc biệt dành cho học sinh, sinh viên. Giảm 30% giá vé khi đi xem phim theo nhóm từ 4 người.',
    details: {
        fullTitle: 'BACK TO SCHOOL - ƯU ĐÃI HẤP DẪN CHO HỌC SINH, SINH VIÊN',
        date: 'Áp dụng từ 15/8 đến 15/9',
        content: `
            <p class="mb-4">Chào mừng năm học mới, rạp phim mang đến chương trình ưu đãi đặc biệt dành cho các bạn học sinh, sinh viên!</p>
            <h3 class="text-xl font-bold mb-2">Ưu đãi hấp dẫn</h3>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Giảm 30% giá vé khi đi theo nhóm từ 4 người</li>
                <li>Tặng combo bắp nước khi mua vé trước 3 ngày</li>
                <li>Đặc biệt: Suất chiếu sớm dành riêng cho học sinh, sinh viên</li>
            </ul>
            <p><strong>Hãy rủ bạn bè cùng đến rạp để nhận ưu đãi!</strong></p>
        `
    }
  },
  {
    id: 5,
    image: womanDayImage,
    title: 'NGÀY PHỤ NỮ VIỆT NAM 20/10',
    summary: 'Chương trình ưu đãi đặc biệt nhân ngày Phụ nữ Việt Nam 20/10. Giảm giá 50% cho khách hàng nữ.',
    details: {
        fullTitle: 'MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10',
        date: 'Áp dụng từ 18/10 đến 20/10',
        content: `
            <p class="mb-4">Nhân dịp kỷ niệm ngày Phụ nữ Việt Nam 20/10, rạp phim gửi tới một nửa thế giới xinh đẹp những ưu đãi đặc biệt:</p>
            <ul class="list-disc list-inside mb-4 pl-4">
                <li>Giảm 50% giá vé cho khách hàng nữ</li>
                <li>Tặng voucher mua sắm trị giá 100.000đ</li>
                <li>Quà tặng đặc biệt cho nhóm từ 3 khách hàng nữ</li>
            </ul>
            <p><strong>Hãy đến và tận hưởng những khoảnh khắc đáng nhớ!</strong></p>
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
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
