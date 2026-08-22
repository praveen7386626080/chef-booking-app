// src/components/Menu.jsx - WITH FULL COLOR BACKGROUNDS
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
      duration: "2 hours preparation & dining",
      price: "₹150 per person",
      bgColor: "linear-gradient(135deg, #FFE8D6, #DDBEA9)",
      textColor: "#264653"
    },
    {
      id: 2,
      name: "Spicy Chettinad Chicken Curry",
      description: "Authentic Chettinad-style chicken cooked with freshly ground spices, black pepper, fennel seeds, and coconut. Aromatic and flavorful, this dish pairs perfectly with steamed rice, biryani, or parathas.",
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400-500 people",
      duration: "3 hours preparation & dining",
      price: "₹280 per person",
      bgColor: "linear-gradient(135deg, #FFAFCC, #FF477E)",
      textColor: "#0d0e0dff"
    },
    {
      id: 3,
      name: "Kerala Fish Molee",
      description: "Traditional Kerala-style fish curry cooked in coconut milk with turmeric, ginger, and green chilies. Light, fragrant, and mildly spiced, this coastal delicacy is best enjoyed with appam or steamed rice.",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 350-450 people",
      duration: "2.5 hours preparation",
      price: "₹320 per person",
      bgColor: "linear-gradient(135deg, #A2D2FF, #BDE0FE)",
      textColor: "#264653"
    },
    {
      id: 4,
      name: "Andhra Chicken Curry",
      description: "Fiery Andhra-style chicken curry made with generous amounts of red chilies, tamarind, and traditional spices. This bold and tangy dish is not for the faint-hearted and pairs excellently with biryani or jeera rice.",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400-500 people",
      duration: "3 hours preparation",
      price: "₹270 per person",
      bgColor: "linear-gradient(135deg, #640ec7ff, #1a98acff)",
      textColor: "#070202ff"
    },
    {
      id: 5,
      name: "Bengali Fish Curry",
      description: "Classic Bengali-style fish curry with mustard paste, poppy seeds, and nigella seeds. Cooked in mustard oil with potatoes, this traditional dish offers a perfect balance of flavors and is typically served with steamed rice.",
      imageUrl: "data:image/webp;base64,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",
      serves: "Serves 300-400 people",
      duration: "2.5 hours preparation",
      price: "₹300 per person",
      bgColor: "linear-gradient(135deg, #d9d5e3ff, #a16317ff)",
      textColor: "#920808ff"
    },
    {
      id: 6,
      name: "Coastal Seafood Extravaganza",
      description: "Fresh catch of the day prepared with coastal spices and coconut. Includes Grilled Pomfret, Prawn Curry, Fish Fry, Crab Masala, and traditional seafood delicacies from both Andhra and Kerala styles.",
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",

      serves: "Serves 200-600 people",

      duration: "3-4 hours preparation",
      price: "₹350 per person",
      bgColor: "linear-gradient(135deg, #CDB4DB, #FFC8DD)",
      textColor: "#264653"
    },
   
    {
      id: 7,
      name: "European Gourmet Experience",
      description: "Sophisticated 4-course European meal featuring Continental classics. Includes appetizers, soups, main courses with imported ingredients, and decadent desserts. Perfect for formal dinners and special anniversaries.",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      serves: "Serves 400 people",
      duration: "3 hours preparation",
      price: "₹600 per person",
      bgColor: "linear-gradient(135deg, #E63946, #F1FAEE)",
      textColor: "#264653"
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

  return (
    <>
      
<section 
  id="menu" 
  style={{
    padding: '100px 0 60px',
    background: 'linear-gradient(135deg, #ffffff, #f7f9fcff 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }}
>
        {/* HEADER SECTION */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          padding: '0 20px 60px 20px',
          background: 'transparent',
          marginBottom: '0'
        }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: '#2a9d8f',
            marginBottom: '1rem',
            textAlign: 'center',
            width: '100%',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Our Signature Dishes
          </h2>
          <div style={{
            width: '120px',
            height: '4px',
            background: 'linear-gradient(90deg, #2a9d8f, #e76f51)',
            margin: '0 auto 1.5rem',
            borderRadius: '2px',
            boxShadow: '0 2px 8px rgba(42, 157, 143, 0.3)'
          }}></div>
          <p style={{
            fontSize: '1.3rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Discover Chef Srinivas's exquisite culinary creations, crafted with passion and perfection
          </p>
        </div>

        {/* MENU ITEMS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          width: '100%',
          flex: '1'
        }}>
          {menuItems && menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} style={{
                background: item.bgColor,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                transition: 'all 0.4s ease',
                border: '3px solid rgba(255,255,255,0.5)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 35px 70px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
              }}>
                
                {/* Image Section */}
                <div style={{
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: item.textColor,
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    border: `2px solid ${item.textColor}`
                  }}>
                    Popular
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ 
                  padding: '2rem',
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 'bold',
                    color: item.textColor,
                    marginBottom: '1rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {item.name}
                  </h3>
                  
                  <p style={{
                    color: item.textColor,
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    fontSize: '1rem',
                    flex: '1',
                    opacity: '0.9'
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    flexWrap: 'wrap',
                    gap: '0.8rem'
                  }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: item.textColor,
                      padding: '8px 14px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      border: `2px solid ${item.textColor}`
                    }}>👥 {item.serves}</span>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: item.textColor,
                      padding: '8px 14px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      border: `2px solid ${item.textColor}`
                    }}>⏰ {item.duration}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <span style={{
                      fontSize: '1.6rem',
                      fontWeight: 'bold',
                      color: item.textColor,
                      background: 'rgba(255, 255, 255, 0.9)',
                      padding: '12px 18px',
                      borderRadius: '15px',
                      border: `3px solid ${item.textColor}`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                      {item.price}
                    </span>
                    
                    <button 
                      onClick={() => handleBookClick(item)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: item.textColor,
                        border: `3px solid ${item.textColor}`,
                        padding: '0.85rem 1.8rem',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        minWidth: '140px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = item.textColor;
                        e.target.style.color = 'white';
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                        e.target.style.color = item.textColor;
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                      }}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem',
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '2rem',
                color: '#666',
                marginBottom: '1rem'
              }}>
                No Menu Items Available
              </h3>
              <p style={{
                color: '#888',
                fontSize: '1.1rem'
              }}>
                Please check back later or contact us for menu information.
              </p>
            </div>
          )}
        </div>

        {/* CALL TO ACTION */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          padding: '60px 20px 0 20px',
          marginTop: '40px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #2a9d8f, #264653)',
            borderRadius: '20px',
            color: 'white',
            width: '100%',
            maxWidth: '800px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            <h3 style={{
              fontSize: '2.2rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Custom Menu Required?
            </h3>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '2rem',
              opacity: '0.9',
              lineHeight: '1.6'
            }}>
              Chef Srinivas specializes in creating personalized menus tailored to your specific preferences, dietary requirements, and event theme.
            </p>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                background: 'white',
                color: '#2a9d8f',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
              }}
            >
              Request Custom Menu
            </button>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default Menu;