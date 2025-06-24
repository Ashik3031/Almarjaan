import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile, Cart, Love } from "../../../assets/icons";
import { logoutAsync, selectLoggedInUser } from "../../auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../cart/CartSlice";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { axiosi } from "../../../config/axios";

export const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItemsCount = useSelector(selectCartItems)?.length || 0;
  const wishlistItemsCount = useSelector(selectWishlistItems)?.length || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axiosi.get("/categories").then(res => setCategories(res.data));
  }, []);

  const handleLogout = () =>
    dispatch(logoutAsync()).then(() => (window.location.href = "/"));

  const handleOutsideClick = useCallback(e => {
    if (!e.target.closest(".dropdown-container")) {
      setProfileDropdown(false);
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  const handleCategoryHover = (categoryId) => {
    setActiveDropdown(categoryId);
  };

  const handleCategoryLeave = () => {
    // Add a small delay to prevent flickering when moving between elements
    setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    // Keep dropdown open when hovering over it
    setActiveDropdown(activeDropdown);
  };

  return (
    <header className="w-full z-50 text-sm bg-white">
      {/* Utility Strip */}
      <div className="bg-[#f4f4f4] text-center text-gray-600 py-2">
        Complimentary Delivery | Find a Boutique | Customer Service | EN
      </div>

      {/* Main Bar */}
      <div className="flex justify-between items-center px-6 border-b py-3">
        {/* Search */}
        <div className="flex items-center gap-2 w-1/3">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            placeholder="Search" 
            className="border-b border-gray-300 flex-1 outline-none py-1 focus:border-gray-600 transition-colors" 
          />
        </div>

        {/* Logo */}
        <div className="text-center w-1/3">
          <Link to="/">
            <h1 className="text-2xl font-serif hover:text-gray-700 transition-colors">Al Marjaan</h1>
            <p className="text-[10px] tracking-widest text-gray-500">UAE</p>
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center justify-end gap-4 w-1/3">
          {!loggedInUser?.isAdmin && (
            <>
              <IconWithBadge 
                Icon={Love} 
                count={wishlistItemsCount} 
                onClick={() => navigate("/wishlist")}
                title="Wishlist"
              />
              <IconWithBadge 
                Icon={Cart} 
                count={cartItemsCount} 
                onClick={() => navigate("/cart")}
                title="Shopping Cart"
              />
            </>
          )}
          {loggedInUser?.isAdmin && (
            <div className="flex gap-4 text-xs">
              <Link to="/admin-dashboard" className="hover:text-gray-600 transition-colors">Dashboard</Link>
              <Link to="/admin/add-product" className="hover:text-gray-600 transition-colors">Add Product</Link>
              <Link to="/admin/add-category" className="hover:text-gray-600 transition-colors">Add Category</Link>
              <Link to="/admin/orders" className="hover:text-gray-600 transition-colors">Orders</Link>
            </div>
          )}
          <div className="relative dropdown-container">
            <Profile 
              className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" 
              onClick={() => setProfileDropdown(!profileDropdown)}
              title="Account"
            />
            {profileDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg w-44 text-sm z-50 overflow-hidden">
                {loggedInUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <span className="mr-2">👤</span>
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <span className="mr-2">📦</span>
                      Orders
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-2">🔑</span>
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation with Improved Mega Dropdown */}
      <nav className="relative border-t bg-white">
        <ul className="flex justify-center gap-8 uppercase text-xs font-medium py-4">
          <li>
            <Link to="/" className="hover:text-gray-600 transition-colors hover:underline">
              New & Trending
            </Link>
          </li>

          {categories.map(cat => (
            <li 
              key={cat._id} 
              className="relative dropdown-container"
              onMouseEnter={() => handleCategoryHover(cat._id)}
              onMouseLeave={handleCategoryLeave}
            >
              <button className="px-2 hover:text-gray-600 transition-colors hover:underline flex items-center gap-1">
                {cat.name}
                {cat.subCategory?.length > 0 && (
                  <svg className="w-3 h-3 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {cat.subCategory?.length > 0 && activeDropdown === cat._id && (
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 top-full z-40 pt-2"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="bg-white shadow-2xl border rounded-lg py-6 px-8 min-w-[600px] max-w-[800px]">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 normal-case">
                        {cat.name} Collection
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      {cat.subCategory.map(sub => (
                        <Link
                          key={sub._id}
                          to={`/categories/${cat.name}/${sub.name}`}
                          className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900 normal-case">
                            {sub.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Explore collection
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Optional: Add a promotional section */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link 
                        to={`/categories/${cat.name}`}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        View all {cat.name} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
          <li>
            <Link to="/contact-us" className="hover:text-gray-600 transition-colors hover:underline">
              contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const IconWithBadge = ({ Icon, count, onClick, title }) => (
  <div className="relative cursor-pointer" onClick={onClick} title={title}>
    <Icon className="w-5 h-5 hover:text-gray-600 transition-colors" />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </div>
);