import React, { useState, useMemo } from 'react';
import './SiteMap.css'; // Import custom CSS file

// Data for 15 cinemas with Google Map embed links
const locationsData = [
  {
    id: 1,
    name: 'CGV Vincom Ba Trieu',
    address: 'Vincom Center, 191 Ba Trieu, Hai Ba Trung, Hanoi',
    city: 'Hanoi',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.53963938477!2d105.8495107!3d21.011083099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8c636ccf95%3A0xee8c463dd46033b4!2sCGV%20Ba%20Trieu!5e0!3m2!1sen!2s!4v1763197751490!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
    },
    {
    id: 2,
    name: 'Lotte Cinema Keangnam',
    address: '72nd Floor, Keangnam Landmark, Pham Hung, Nam Tu Liem, Hanoi',
    city: 'Hanoi',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1862.1912863346085!2d105.78273733851502!3d21.01737299892581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab54ef80077d%3A0x1c375dcb13b05376!2zS2VhbmduYW0sIE3hu4UgVHLDrCwgTmFtIFThu6sgTGnDqm0sIEhhbm9pLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1763197939522!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 3,
    name: 'Beta Cineplex Thanh Xuan',
    address: '41 Nguyen Thi Dinh, Thanh Xuan, Hanoi',
    city: 'Hanoi',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7497088795885!2d105.7973315774956!3d21.00266783877994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adcaeeb3b5cf%3A0xe480873c00de7333!2sR%E1%BA%A1p%20phim%20Beta%20Cinemas%20Thanh%20Xu%C3%A2n!5e0!3m2!1sen!2s!4v1763198041423!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 4,
    name: 'Galaxy Cinema Mipec Long Bien',
    address: 'Mipec Riverside, 2 Long Bien II, Long Bien, Hanoi',
    city: 'Hanoi',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.680154801155!2d105.86368817471488!3d21.04548008720516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abd18fdd6e55%3A0x1d08f35be6647c7e!2sGalaxy%20Mipec%20Long%20Bi%C3%AAn!5e0!3m2!1sen!2s!4v1763198158758!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 5,
    name: 'BHD Star Pham Ngoc Thach',
    address: '8th Floor, Vincom Center, 2 Pham Ngoc Thach, Dong Da, Hanoi',
    city: 'Hanoi',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.663450500064!2d105.82934487471378!3d21.00612368855668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac7e54afd0fd%3A0xbb0e81e9ffd12020!2zQkhEIFN0YXIgVmluY29tIFBo4bqhbSBOZ-G7jWMgVGjhuqFjaA!5e0!3m2!1sen!2s!4v1763198236974!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 6,
    name: 'CGV Crescent Mall',
    address: '101 Ton Dat Tien, Tan Phu, District 7, Ho Chi Minh City',
    city: 'Ho Chi Minh City',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.072683385654!2d106.71628187451662!3d10.728877460070061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f894ec205e9%3A0x2a5bb83950a26d5b!2sCGV%20Crescent%20Mall!5e0!3m2!1sen!2s!4v1763199329721!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 7,
    name: 'Galaxy Nguyen Du',
    address: '116 Nguyen Du, District 1, Ho Chi Minh City',
    city: 'Ho Chi Minh City',
    mapEmbedUrl:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4978045510193!2d106.68831657596357!3d10.773133331886008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3c0189fa2b%3A0x6e75dc36d4dba07d!2sGalaxy%20Nguy%E1%BB%85n%20Du!5e0!3m2!1sen!2s!4v1763199393440!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 8,
    name: 'BHD Star Bitexco',
    address: '36 Ho Tung Mau, District 1, Ho Chi Minh City',
    city: 'Ho Chi Minh City',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.524580220977!2d106.70390131538374!3d10.77103599232535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f41b089c6f3%3A0x1d752c1e7a023f0!2sBHD%20Star%20Cineplex%20-%20Bitexco!5e0!3m2!1svi!2s!4v1678889333333!5m2!1svi!2s'
  },
  {
    id: 9,
    name: 'Lotte Cinema Nowzone',
    address: '235 Nguyen Van Cu, District 1, Ho Chi Minh City',
    city: 'Ho Chi Minh City',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.613274314945!2d106.67986237451709!3d10.764258559419131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f19358a688d%3A0x950e00fb59d5e2db!2sLOTTE%20Cinema%20Nowzone!5e0!3m2!1sen!2s!4v1763205263248!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  }, 
  {
    id: 10,
    name: 'Mega GS Cao Thang',
    address: '19 Cao Thang, District 3, Ho Chi Minh City',
    city: 'Ho Chi Minh City',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5516554595483!2d106.68036467451708!3d10.768995359331816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f220559d037%3A0x6d815550960170a1!2sMega%20GS%20Cinemas!5e0!3m2!1sen!2s!4v1763205356026!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 11,
    name: 'CGV Vincom Da Nang',
    address: 'Vincom Plaza, 910A Ngo Quyen, Son Tra, Da Nang',
    city: 'Da Nang',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.027092823351!2d108.22152631537754!3d16.06453198888406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142183144a2b90b%3A0x8633393998f58356!2sCGV%20Vincom%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1svi!2s!4v1678889500000!5m2!1svi!2s'
  },
  {
    id: 12,
    name: 'Lotte Cinema Da Nang',
    address: '6th Floor, Lotte Mart, 6 Ngu Hanh Son, Hai Chau, Da Nang',
    city: 'Da Nang',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8916392693773!2d108.22820267460013!3d16.071111939388636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142182e92db258b%3A0x1207f994ee77c1fc!2sCGV%20Cinema%20Vincom%20Danang!5e0!3m2!1sen!2s!4v1763205446166!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 13,
    name: 'Galaxy Cinema Da Nang',
    address: '478 Dien Bien Phu, Thanh Khe, Da Nang',
    city: 'Da Nang',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.97621252337!2d108.18432997459993!3d16.06672413950601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421901da0acdbf%3A0x6fea898ba4d1ac8d!2sGalaxy%20Cinema!5e0!3m2!1sen!2s!4v1763205497227!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
  {
    id: 14,
    name: 'Beta Cineplex Da Nang',
    address: '2 Vo Nguyen Giap, Son Tra, Da Nang',
    city: 'Da Nang',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.111841364379!2d108.2415113153775!3d16.05924798888701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177c8e227f31%3A0xf618f08f80658f8b!2sBeta%20Cineplex%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1svi!2s!4v1678889666666!5m2!1svi!2s'
  },
  {
    id: 15,
    name: 'Starlight Da Nang',
    address: 'TTC Plaza, 254 Nguyen Van Linh, Thanh Khe, Da Nang',
    city: 'Da Nang',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1916.9930941120801!2d108.2017723415937!3d16.06620650677063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142191953930d85%3A0x898f2a677ae3dfee!2zU3RhcmxpZ2h0IMSQw6AgTuG6tW5n!5e0!3m2!1sen!2s!4v1763205607031!5m2!1sen!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
  },
];

const cities = ['All', 'Hanoi', 'Ho Chi Minh City', 'Da Nang'];

export default function SiteMap() {
  // State to store the currently selected map URL
  const [selectedMapUrl, setSelectedMapUrl] = useState(locationsData[0].mapEmbedUrl);
  // State to store the currently selected city filter
  const [selectedCity, setSelectedCity] = useState('All');

  // Filter the list of locations based on the selected city
  // useMemo to avoid re-filtering on every render, only when data or selectedCity changes
  const filteredLocations = useMemo(() => {
    if (selectedCity === 'All') {
      return locationsData;
    }
    return locationsData.filter(location => location.city === selectedCity);
  }, [selectedCity]);

  // Handler function for the "Show in Map" button click
  const handleShowMap = (url) => {
    setSelectedMapUrl(url);
  };

  return (
    <div className="sitemap-page container-fluid my-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Our Theaters</h1>
        <p className="lead">Find the nearest CineBook theater.</p>
      </div>

      <div className="row g-4">
        {/* === LIST COLUMN (LEFT) === */}
        <div className="col-lg-5">
          {/* City filter */}
          <div className="sitemap-filter-nav nav nav-pills nav-fill mb-3">
            {cities.map(city => (
              <button
                key={city}
                type="button"
                className={`nav-link ${selectedCity === city ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Cinema list */}
          <div className="sitemap-list-container list-group">
            {filteredLocations.map(location => (
              <div
                key={location.id}
                className={`list-group-item list-group-item-action ${selectedMapUrl === location.mapEmbedUrl ? 'active' : ''}`}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{location.name}</h5>
                </div>
                <p className="mb-1">{location.address}</p>
                <button
                  className={`btn btn-sm ${selectedMapUrl === location.mapEmbedUrl ? 'btn-light' : 'btn-outline-primary'}`}
                  onClick={() => handleShowMap(location.mapEmbedUrl)}
                >
                  Show in Map
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* === MAP COLUMN (RIGHT) === */}
        <div className="col-lg-7">
          <div className="sitemap-map-container shadow rounded">
            {/* SỬA LỖI: Comment (ghi chú) đã được đóng lại chính xác.
              Use 'key' to force React to re-render the iframe when the src changes.
              This is the most reliable way to reload the iframe.
            */}
            <iframe
              key={selectedMapUrl}
              src={selectedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}