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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleCategoryHover = (categoryId) => {
    setActiveDropdown(categoryId);
  };

  const handleCategoryLeave = () => {
    setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    setActiveDropdown(activeDropdown);
  };

  const toggleMobileCategory = (categoryId) => {
    setMobileCategoryOpen(mobileCategoryOpen === categoryId ? null : categoryId);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCategoryOpen(null);
  };

  return (
    <header className="w-full z-50 text-sm bg-white mb-4 md:mb-7">
      {/* Utility Strip */}
      <div className="bg-[#f4f4f4] text-center text-gray-600 py-2 text-xs md:text-sm px-2">
        <span className="hidden md:inline">Complimentary Delivery | lip@loveinparis.ae | Customer Service | UAE</span>
        <span className="md:hidden">Free Delivery | UAE</span>
      </div>

      {/* Main Bar */}
      <div className="flex justify-between items-center px-4 md:px-6 border-b py-3">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Search - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 w-1/3">
          {/* Search functionality can be added here */}
        </div>

        {/* Logo */}
        <div className="text-center flex-1 md:w-1/3">
          <Link to="/" onClick={closeMobileMenu}>
            <h1 className="text-xl md:text-2xl font-serif hover:text-gray-700 transition-colors">Al Marjaan</h1>
            <p className="text-[9px] md:text-[10px] tracking-widest text-gray-500">UAE</p>
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center justify-end gap-2 md:gap-4 flex-1 md:w-1/3">
          {!loggedInUser?.isAdmin && (
            <>
              <IconWithBadge 
                Icon={Love} 
                count={wishlistItemsCount} 
                onClick={() => {
                  navigate("/wishlist");
                  closeMobileMenu();
                }}
                title="Wishlist"
              />
              <IconWithBadge 
                Icon={Cart} 
                count={cartItemsCount} 
                onClick={() => {
                  navigate("/cart");
                  closeMobileMenu();
                }}
                title="Shopping Cart"
              />
            </>
          )}
          {loggedInUser?.isAdmin && (
            <div className="hidden md:flex gap-4 text-xs">
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
                    {loggedInUser.isAdmin && (
                      <div className="md:hidden border-b border-gray-200">
                        <Link 
                          to="/admin-dashboard" 
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <span className="mr-2">📊</span>
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/add-product" 
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <span className="mr-2">➕</span>
                          Add Product
                        </Link>
                        <Link 
                          to="/admin/add-category" 
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <span className="mr-2">📁</span>
                          Add Category
                        </Link>
                        <Link 
                          to="/admin/orders" 
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <span className="mr-2">📦</span>
                          Admin Orders
                        </Link>
                      </div>
                    )}
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      onClick={() => setProfileDropdown(false)}
                    >
                      <span className="mr-2">👤</span>
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      onClick={() => setProfileDropdown(false)}
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
                    onClick={() => setProfileDropdown(false)}
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

      {/* Desktop Navigation with Mega Dropdown */}
      {/* <nav className="hidden md:block relative border-t bg-white">
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
      </nav> */}

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 overflow-y-auto md:hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-serif">Menu</h2>
              <button onClick={closeMobileMenu} className="p-2" aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* <div className="py-4">
              <Link 
                to="/" 
                className="block px-6 py-3 hover:bg-gray-50 transition-colors uppercase text-sm font-medium"
                onClick={closeMobileMenu}
              >
                New & Trending
              </Link>

              {categories.map(cat => (
                <div key={cat._id}>
                  <div className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                    <Link
                      to={`/categories/${cat.name}`}
                      className="flex-1 uppercase text-sm font-medium"
                      onClick={closeMobileMenu}
                    >
                      {cat.name}
                    </Link>
                    {cat.subCategory?.length > 0 && (
                      <button
                        onClick={() => toggleMobileCategory(cat._id)}
                        className="p-2"
                        aria-label={`Toggle ${cat.name} submenu`}
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${mobileCategoryOpen === cat._id ? 'rotate-180' : ''}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {cat.subCategory?.length > 0 && mobileCategoryOpen === cat._id && (
                    <div className="bg-gray-50 py-2">
                      {cat.subCategory.map(sub => (
                        <Link
                          key={sub._id}
                          to={`/categories/${cat.name}/${sub.name}`}
                          className="block px-10 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link 
                to="/contact-us" 
                className="block px-6 py-3 hover:bg-gray-50 transition-colors uppercase text-sm font-medium"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </div> */}
          </div>
        </>
      )}
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