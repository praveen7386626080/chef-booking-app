// src/Components/Menu.jsx - FULLY RESPONSIVE & MOBILE-FRIENDLY DISH MENU
import { useState } from 'react';
import BookingModal from './BookingModal';

function Menu() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "Traditional Tamil Sambar",
      description: "Authentic South Indian sambar prepared with fresh vegetables, pigeon peas, and a special blend of spices including roasted coriander, fenugreek, and red chilies. Served with crispy dosa, soft idli, and coconut chutney.",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 300-400 people",
      duration: "2 hrs prep & dining",
      price: "₹150 / person",
      bgColor: "linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)",
      textColor: "#264653"
    },
    {
      id: 2,
      name: "Spicy Chettinad Chicken Curry",
      description: "Authentic Chettinad-style chicken cooked with freshly ground spices, black pepper, fennel seeds, and coconut. Aromatic and flavorful, this dish pairs perfectly with steamed rice, biryani, or parathas.",
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400-500 people",
      duration: "3 hrs prep & dining",
      price: "₹280 / person",
      bgColor: "linear-gradient(135deg, #FFF0F3 0%, #FFD6E0 100%)",
      textColor: "#1e293b"
    },
    {
      id: 3,
      name: "Kerala Fish Molee",
      description: "Traditional Kerala-style fish curry cooked in coconut milk with turmeric, ginger, and green chilies. Light, fragrant, and mildly spiced, this coastal delicacy is best enjoyed with appam or steamed rice.",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 350-450 people",
      duration: "2.5 hrs prep",
      price: "₹320 / person",
      bgColor: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      textColor: "#1e3a8a"
    },
    {
      id: 4,
      name: "Andhra Chicken Curry",
      description: "Fiery Andhra-style chicken curry made with generous amounts of red chilies, tamarind, and traditional spices. This bold and tangy dish pairs excellently with fragrant biryani or jeera rice.",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400-500 people",
      duration: "3 hrs prep",
      price: "₹270 / person",
      bgColor: "linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)",
      textColor: "#581c87"
    },
    {
      id: 5,
      name: "Bengali Fish Curry",
      description: "Classic Bengali-style fish curry with mustard paste, poppy seeds, and nigella seeds. Cooked in mustard oil with potatoes, this traditional dish offers a rich balance of subtle aromas and authentic flavor.",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 300-400 people",
      duration: "2.5 hrs prep",
      price: "₹300 / person",
      bgColor: "linear-gradient(135deg, #FEFCE8 0%, #FEF08A 100%)",
      textColor: "#713f12"
    },
    {
      id: 6,
      name: "Coastal Seafood Extravaganza",
      description: "Fresh catch of the day prepared with coastal spices and coconut. Includes Grilled Pomfret, Prawn Curry, Fish Fry, Crab Masala, and traditional seafood delicacies from Andhra and Kerala.",
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 200-600 people",
      duration: "3-4 hrs prep",
      price: "₹350 / person",
      bgColor: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
      textColor: "#14532d"
    },
    {
      id: 7,
      name: "European Gourmet Experience",
      description: "Sophisticated 4-course European meal featuring Continental classics. Includes gourmet appetizers, soups, main courses with imported ingredients, and decadent desserts for special celebrations.",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400 people",
      duration: "3 hrs prep",
      price: "₹600 / person",
      bgColor: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)",
      textColor: "#881337"
    }
  ];

  const handleBookClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleCustomMenuClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerOffset = 70;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <section className="menu-section" id="menu">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Our Signature Dishes</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Discover Chef Srinivas's exquisite culinary creations, handcrafted with passion, fresh ingredients, and authentic perfection.
          </p>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-grid">
          {menuItems.map((item) => (
            <article 
              key={item.id} 
              className="menu-dish-card"
              style={{ background: item.bgColor }}
            >
              {/* Dish Image with Badge */}
              <div className="dish-image-wrapper">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="dish-image"
                  loading="lazy"
                />
                <span 
                  className="dish-badge"
                  style={{ color: item.textColor, border: `1.5px solid ${item.textColor}` }}
                >
                  ⭐ Popular
                </span>
              </div>

              {/* Dish Body Details */}
              <div className="dish-body">
                <h3 
                  className="dish-name"
                  style={{ color: item.textColor }}
                >
                  {item.name}
                </h3>
                
                <p 
                  className="dish-desc"
                  style={{ color: item.textColor }}
                >
                  {item.description}
                </p>

                {/* Meta Tags */}
                <div className="dish-meta-tags">
                  <span 
                    className="dish-meta-pill"
                    style={{ color: item.textColor, border: `1px solid ${item.textColor}` }}
                  >
                    👥 {item.serves}
                  </span>
                  <span 
                    className="dish-meta-pill"
                    style={{ color: item.textColor, border: `1px solid ${item.textColor}` }}
                  >
                    ⏰ {item.duration}
                  </span>
                </div>

                {/* Price & Action */}
                <div className="dish-footer">
                  <span 
                    className="dish-price"
                    style={{ color: item.textColor, border: `2px solid ${item.textColor}` }}
                  >
                    {item.price}
                  </span>
                  
                  <button 
                    onClick={() => handleBookClick(item)}
                    className="order-btn"
                    style={{
                      color: item.textColor,
                      border: `2px solid ${item.textColor}`,
                      backgroundColor: '#ffffff'
                    }}
                    type="button"
                  >
                    Book Dish
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Custom Menu Callout Banner */}
        <div className="custom-menu-banner">
          <h3>Need a Custom Menu for Your Event?</h3>
          <p>
            Chef Srinivas specializes in bespoke multi-course menus tailored to your specific taste preferences, dietary needs, guest size, and celebration theme.
          </p>
          <button 
            onClick={handleCustomMenuClick}
            className="custom-menu-btn"
            type="button"
          >
            ✉️ Request Custom Menu
          </button>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default Menu;