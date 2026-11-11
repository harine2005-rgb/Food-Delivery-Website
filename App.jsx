import { useState, useEffect } from 'react';
import Admin from './Admin.jsx';
import Loading from './Loading.jsx';
import './App.css';

const foods = [
  { id: 1, name: 'Cheese Pizza', price: 199, offerPrice: 149, emoji: '🍕', category: 'Pizza', rating: 4.8 },
  { id: 2, name: 'Cheese Burger', price: 149, offerPrice: 119, emoji: '🍔', category: 'Burger', rating: 4.5 },
  { id: 3, name: 'Chicken Biryani', price: 249, offerPrice: 199, emoji: '🍚', category: 'Biryani', rating: 4.9 },
  { id: 4, name: 'French Fries', price: 99, offerPrice: 79, emoji: '🍟', category: 'Snacks', rating: 4.3 },
  { id: 5, name: 'Coca Cola', price: 49, emoji: '🥤', category: 'Drinks', rating: 4.2 },
  { id: 6, name: 'Fresh Orange Juice', price: 79, emoji: '🧃', category: 'Drinks', rating: 4.6 },
  { id: 7, name: 'Chocolate Cake', price: 199, offerPrice: 149, emoji: '🎂', category: 'Cakes', rating: 4.8 },
  { id: 8, name: 'Chocolate Cupcake', price: 89, emoji: '🧁', category: 'Cakes', rating: 4.4 },
  { id: 9, name: 'Butter Croissant', price: 99, emoji: '🥐', category: 'Bakery', rating: 4.5 },
  { id: 10, name: 'Chocolate Donut', price: 79, emoji: '🍩', category: 'Bakery', rating: 4.7 },
  { id: 11, name: 'Vanilla Ice Cream', price: 69, emoji: '🍦', category: 'Ice Cream', rating: 4.6 },
  { id: 12, name: 'Chocolate Ice Cream', price: 99, emoji: '🍨', category: 'Ice Cream', rating: 4.9 }
];

const trackingStatuses = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Food',
  'Out for Delivery',
  'Delivered'
];

// ==================================
// MAIN APP
// ==================================

function App() {

  // LOADING SCREEN
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // THEME
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('foodieTheme') || 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('foodieTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === 'dark' ? 'light' : 'dark'
    );
  };

  // SHOW LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // ADMIN PAGE
  if (window.location.pathname === '/admin') {
    return (
      <Admin
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // CUSTOMER HOME PAGE
  return (
    <FoodieHome
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

// ==================================
// CUSTOMER WEBSITE
// ==================================

function FoodieHome({ theme, toggleTheme }) {

  // CART STATE
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodieCart')) || [];
    } catch {
      return [];
    }
  });

  // ORDERS STATE
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodieOrders')) || [];
    } catch {
      return [];
    }
  });

  // REVIEWS STATE
  const [reviews, setReviews] = useState(() => {
    try {
      const savedReviews = JSON.parse(
        localStorage.getItem('foodieReviews')
      );

      return Array.isArray(savedReviews) ? savedReviews : [];
    } catch {
      return [];
    }
  });

  // FAVORITES STATE
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = JSON.parse(
        localStorage.getItem('foodieFavorites')
      );

      return Array.isArray(savedFavorites) ? savedFavorites : [];
    } catch {
      return [];
    }
  });

  // GENERAL STATES
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // COUPON
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // CUSTOMER DETAILS
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // REVIEW FORM
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState('');

  // ==================================
  // SAVE DATA IN LOCAL STORAGE
  // ==================================

  useEffect(() => {
    localStorage.setItem('foodieCart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('foodieOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foodieReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('foodieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // ==================================
  // BACK TO TOP VISIBILITY
  // ==================================

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ==================================
  // SYNC ADMIN ORDERS
  // ==================================

  useEffect(() => {
    const syncOrders = () => {
      try {
        const savedOrders = localStorage.getItem('foodieOrders');
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      } catch (error) {
        console.error('Error syncing orders:', error);
      }
    };

    window.addEventListener('storage', syncOrders);
    window.addEventListener('foodieOrdersUpdated', syncOrders);

    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('foodieOrdersUpdated', syncOrders);
    };
  }, []);

  // ==================================
  // CURRENT ORDER
  // ==================================

  const currentOrder = orders.find(
    (order) => order.id === currentOrderId
  );

  // ==================================
  // CART CALCULATIONS
  // ==================================

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const finalAmount = Math.max(0, cartTotal - discount);

  // ==================================
  // ADD FOOD TO CART
  // ==================================

  const addToCart = (food) => {
    setCartItems((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...food,
          price: food.offerPrice || food.price,
          quantity: 1
        }
      ];
    });
  };

  // ==================================
  // REMOVE FROM CART
  // ==================================

  const removeFromCart = (id) => {
    setCartItems((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  };

  // ==================================
  // UPDATE QUANTITY
  // ==================================

  const updateQuantity = (id, amount) => {
    setCartItems((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ==================================
  // APPLY COUPON
  // ==================================

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === 'FOODIE10') {
      setDiscount(cartTotal * 0.10);
      setCouponMessage('10% discount applied!');
    } else if (code === 'FOODIE20') {
      setDiscount(cartTotal * 0.20);
      setCouponMessage('20% discount applied!');
    } else if (code === 'WELCOME50') {
      setDiscount(Math.min(50, cartTotal));
      setCouponMessage('₹50 discount applied!');
    } else {
      setDiscount(0);
      setCouponMessage('Invalid coupon code.');
    }
  };

  // ==================================
  // PLACE ORDER
  // ==================================

  const placeOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    const newOrder = {
      id: Date.now(),
      customerName,
      customerEmail,
      customerAddress,
      items: [...cartItems],
      total: finalAmount,
      date: new Date().toLocaleString(),
      status: 'Order Placed'
    };

    const updatedOrders = [...orders, newOrder];

    setOrders(updatedOrders);

    localStorage.setItem(
      'foodieOrders',
      JSON.stringify(updatedOrders)
    );

    setCurrentOrderId(newOrder.id);
    setCartItems([]);
    setShowCheckout(false);

    setCoupon('');
    setDiscount(0);
    setCouponMessage('');

    setCustomerName('');
    setCustomerEmail('');
    setCustomerAddress('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // ==================================
  // UPDATE ORDER STATUS
  // ==================================

  const updateOrderStatus = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const currentIndex = trackingStatuses.indexOf(order.status);

        const nextIndex = Math.min(
          currentIndex + 1,
          trackingStatuses.length - 1
        );

        return {
          ...order,
          status: trackingStatuses[nextIndex]
        };
      }

      return order;
    });

    setOrders(updatedOrders);

    localStorage.setItem(
      'foodieOrders',
      JSON.stringify(updatedOrders)
    );
  };

  // ==================================
  // SUBMIT CUSTOMER REVIEW
  // ==================================

  const submitReview = (event) => {
    event.preventDefault();

    if (!reviewName.trim() || !reviewText.trim()) {
      setReviewMessage('Please enter your name and feedback.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      text: reviewText.trim(),
      rating: Number(reviewRating),
      date: new Date().toLocaleString()
    };

    const updatedReviews = [...reviews, newReview];

    try {
      localStorage.setItem(
        'foodieReviews',
        JSON.stringify(updatedReviews)
      );

      setReviews(updatedReviews);
      setReviewName('');
      setReviewText('');
      setReviewRating(5);

      setReviewMessage(
        'Thank you! Your review was submitted successfully. ⭐'
      );
    } catch (error) {
      console.error('Error saving review:', error);
      setReviewMessage(
        'Unable to save your review. Please try again.'
      );
    }
  };

  // ==================================
  // DELETE CUSTOMER REVIEW
  // ==================================

  const deleteReview = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmDelete) return;

    const updatedReviews = reviews.filter(
      (review) => review.id !== id
    );

    try {
      localStorage.setItem(
        'foodieReviews',
        JSON.stringify(updatedReviews)
      );

      setReviews(updatedReviews);
      setReviewMessage('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      setReviewMessage(
        'Unable to delete this review. Please try again.'
      );
    }
  };

  // ==================================
  // ADD OR REMOVE FAVORITES
  // ==================================

  const toggleFavorite = (food) => {
    const alreadyFavorite = favorites.some(
      (item) => item.id === food.id
    );

    if (alreadyFavorite) {
      setFavorites((previousFavorites) =>
        previousFavorites.filter(
          (item) => item.id !== food.id
        )
      );
    } else {
      setFavorites((previousFavorites) => [
        ...previousFavorites,
        food
      ]);
    }
  };

  // ==================================
  // CHECK FAVORITE
  // ==================================

  const isFavorite = (foodId) => {
    return favorites.some(
      (item) => item.id === foodId
    );
  };

  // ==================================
  // FOOD FILTERING
  // ==================================

  const categories = [
    'All',
    ...new Set(foods.map((food) => food.category))
  ];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ==================================
  // CUSTOMER REVIEW SUMMARY
  // ==================================

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : '0.0';

  // ==================================
  // MAIN WEBSITE
  // ==================================

  return (
    <div className="app">

      {/* NAVIGATION */}
      <nav>
        <h2>Foodie 🍔</h2>

        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#offers">Offers</a></li>
          <li><a href="#menu">Menu</a></li>
          <li>
            <a href="#favorites">
              ❤️ Favorites ({favorites.length})
            </a>
          </li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#cart">Cart ({cartCount})</a></li>
          <li><a href="#history">Orders</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>

        {/* DARK / LIGHT MODE BUTTON */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          type="button"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">

        <h1>
          Delicious Food Delivered To Your Door 🍕
        </h1>

        <p>
          Order your favourite food with Foodie!
        </p>

        <a href="#menu">
          <button>Order Now</button>
        </a>

      </section>

      {/* OFFERS */}
      <section id="offers" className="offers">

        <h2>Special Offers 🎉</h2>

        <div className="offer-container">

          <div className="offer-card">
            <h3>20% OFF</h3>
            <p>Use coupon FOODIE20</p>
          </div>

          <div className="offer-card">
            <h3>10% OFF</h3>
            <p>Use coupon FOODIE10</p>
          </div>

          <div className="offer-card">
            <h3>₹50 OFF</h3>
            <p>Use coupon WELCOME50</p>
          </div>

        </div>

      </section>

      {/* MENU */}
      <section id="menu" className="menu">

        <h2>Our Food Menu 🍽️</h2>

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="category-buttons">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}

        </div>

        <div className="food-container">

          {filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>

              <div className="food-emoji">
                {food.emoji}
              </div>

              <h3>{food.name}</h3>

              <p>⭐ {food.rating}</p>

              {food.offerPrice ? (
                <p>
                  <del>₹{food.price}</del>{' '}
                  <strong>₹{food.offerPrice}</strong>
                </p>
              ) : (
                <p>₹{food.price}</p>
              )}

              <button onClick={() => addToCart(food)}>
                Add to Cart
              </button>

              <button
                onClick={() => toggleFavorite(food)}
                className="favorite-button"
              >
                {isFavorite(food.id)
                  ? '❤️ Remove Favorite'
                  : '🤍 Add to Favorites'}
              </button>

            </div>
          ))}

          {filteredFoods.length === 0 && (
            <p>No food items found.</p>
          )}

        </div>

      </section>

      {/* FAVORITES */}
      <section id="favorites" className="favorites">

        <h2>My Favorite Foods ❤️</h2>

        <p>
          Your favorite food items: {favorites.length}
        </p>

        {favorites.length === 0 ? (

          <p>
            No favorite foods added yet.
            Visit our menu and add your favorites!
          </p>

        ) : (

          <div className="food-container">

            {favorites.map((food) => (

              <div className="food-card" key={food.id}>

                <div className="food-emoji">
                  {food.emoji}
                </div>

                <h3>{food.name}</h3>

                <p>⭐ {food.rating}</p>

                <p>
                  ₹{food.offerPrice || food.price}
                </p>

                <button onClick={() => addToCart(food)}>
                  Add to Cart 🛒
                </button>

                <button
                  onClick={() => toggleFavorite(food)}
                  className="favorite-button"
                >
                  ❤️ Remove Favorite
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* CART */}
      <section id="cart" className="cart">

        <h2>Shopping Cart 🛒</h2>

        {cartItems.length === 0 ? (

          <p>Your cart is empty.</p>

        ) : (

          <>

            {cartItems.map((item) => (

              <div className="cart-item" key={item.id}>

                <p>
                  {item.emoji} {item.name} - ₹{item.price}
                </p>

                <button
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>

                <span> {item.quantity} </span>

                <button
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>

                <p>
                  Subtotal: ₹{item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>

            ))}

            <h3>
              Cart Total: ₹{cartTotal.toFixed(2)}
            </h3>

            <div className="coupon-section">

              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(event) =>
                  setCoupon(event.target.value)
                }
              />

              <button onClick={applyCoupon}>
                Apply Coupon
              </button>

              <p>{couponMessage}</p>

            </div>

            <h3>
              Discount: ₹{discount.toFixed(2)}
            </h3>

            <h2>
              Final Amount: ₹{finalAmount.toFixed(2)}
            </h2>

            <button
              onClick={() => setShowCheckout(true)}
            >
              Proceed to Checkout
            </button>

          </>

        )}

      </section>

      {/* CHECKOUT */}
      {showCheckout && (

        <section className="checkout">

          <h2>Checkout Details</h2>

          <form onSubmit={placeOrder}>

            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(event) =>
                setCustomerName(event.target.value)
              }
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={customerEmail}
              onChange={(event) =>
                setCustomerEmail(event.target.value)
              }
              required
            />

            <textarea
              placeholder="Delivery Address"
              value={customerAddress}
              onChange={(event) =>
                setCustomerAddress(event.target.value)
              }
              required
            />

            <h3>
              Amount: ₹{finalAmount.toFixed(2)}
            </h3>

            <button type="submit">
              Place Order
            </button>

            <button
              type="button"
              onClick={() => setShowCheckout(false)}
            >
              Cancel
            </button>

          </form>

        </section>

      )}

      {/* ORDER CONFIRMATION */}
      {currentOrder && (

        <section className="order-confirmation">

          <h2>
            Order Placed Successfully! 🎉
          </h2>

          <p>
            Your Order ID: #{currentOrder.id}
          </p>

          <p>
            Thank you for ordering with Foodie!
          </p>

        </section>

      )}

      {/* ORDER TRACKING */}
      {currentOrder && (

        <section className="tracking">

          <h2>Track Your Order 🚚</h2>

          <h3>Order #{currentOrder.id}</h3>

          <p>
            Current Status:{' '}
            <strong>{currentOrder.status}</strong>
          </p>

          <div className="tracking-status">

            {trackingStatuses.map((status, index) => {

              const currentIndex = trackingStatuses.indexOf(
                currentOrder.status
              );

              return (

                <p
                  key={status}
                  style={{
                    color: index <= currentIndex ? 'green' : 'gray',
                    fontWeight:
                      index === currentIndex ? 'bold' : 'normal'
                  }}
                >
                  {index <= currentIndex ? '✅' : '⏳'} {status}
                </p>

              );

            })}

          </div>

        </section>

      )}

      {/* ORDER HISTORY */}
      <section id="history" className="order-history">

        <h2>My Order History 📦</h2>

        {orders.length === 0 ? (

          <p>No previous orders.</p>

        ) : (

          orders.map((order) => (

            <div className="history-card" key={order.id}>

              <h3>Order #{order.id}</h3>

              <p>Date: {order.date}</p>

              <p>
                Total: ₹{Number(order.total).toFixed(2)}
              </p>

              <p>Status: {order.status}</p>

              <button
                onClick={() => {
                  setCurrentOrderId(order.id);

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}
              >
                Track This Order
              </button>

            </div>

          ))

        )}

      </section>

      {/* CUSTOMER REVIEWS */}
      <section id="reviews" className="reviews">

        <h2>Customer Reviews ⭐</h2>

        <div className="review-summary">

          <h3>{averageRating} / 5 ⭐</h3>

          <p>Average Customer Rating</p>

          <h3>{totalReviews}</h3>

          <p>Total Customer Reviews</p>

        </div>

        {/* REVIEW FORM */}
        <form onSubmit={submitReview}>

          <input
            type="text"
            placeholder="Enter Your Name"
            value={reviewName}
            onChange={(event) =>
              setReviewName(event.target.value)
            }
            required
          />

          <textarea
            placeholder="Write your feedback here..."
            value={reviewText}
            onChange={(event) =>
              setReviewText(event.target.value)
            }
            required
          />

          <label htmlFor="review-rating">
            Select Your Rating:
          </label>

          <select
            id="review-rating"
            value={reviewRating}
            onChange={(event) =>
              setReviewRating(Number(event.target.value))
            }
          >
            <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
            <option value={4}>⭐⭐⭐⭐ - Very Good</option>
            <option value={3}>⭐⭐⭐ - Good</option>
            <option value={2}>⭐⭐ - Average</option>
            <option value={1}>⭐ - Poor</option>
          </select>

          <button type="submit">
            Submit Review
          </button>

          {reviewMessage && (
            <p className="review-message" role="status">
              {reviewMessage}
            </p>
          )}

        </form>

        {/* DISPLAY REVIEWS */}
        <div className="review-list">

          <h3>What Our Customers Say ❤️</h3>

          {reviews.length === 0 ? (

            <p>
              No reviews yet.
              Be the first to share your experience!
            </p>

          ) : (

            reviews.map((review) => (

              <div className="review-card" key={review.id}>

                <h3>{review.name}</h3>

                <p>
                  {'⭐'.repeat(Number(review.rating) || 0)}
                  {'☆'.repeat(5 - (Number(review.rating) || 0))}
                </p>

                <p>{review.text}</p>

                {review.date && (
                  <small>{review.date}</small>
                )}

                <div className="review-actions">

                  <button
                    type="button"
                    onClick={() => deleteReview(review.id)}
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <h2>Foodie 🍔</h2>

        <p>
          Delicious food delivered to your door.
        </p>

        <p>
          © 2026 Foodie. All rights reserved.
        </p>

      </footer>

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          className="back-to-top"
          type="button"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
          title="Back to Top"
          aria-label="Back to Top"
        >
          ↑
        </button>
      )}

    </div>
  );
}

export default App;