'use client';

import Link from 'next/link';
import { DivTag, PTag } from './HTMLTags';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowDown } from './Icons';
import { usePathname } from 'next/navigation';
import TopHeader from './TopHeader'
const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

function normalizeUrl(url) {
  if (!url || url === '#') return '#';

  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  } catch {
    let cleanPath = url;

    if (url.startsWith('http://') && !url.includes('.') && !url.includes('localhost') && !url.includes('192.168')) {
      cleanPath = '/' + url.replace('http://', '');
    } else if (!url.startsWith('/') && !url.startsWith('#')) {
      cleanPath = '/' + url;
    }

    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }

    return cleanPath;
  }
}

// Recursively build menu tree
function buildMenu(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // If items already have children, skip tree building
  const alreadyNested = data.some(item => Array.isArray(item.children) && item.children.length > 0);

  if (alreadyNested) {
    return data.sort((a, b) => a.order - b.order);
  }

  // Legacy fallback if nesting not present
  const menuMap = {};
  const roots = [];

  data.forEach(item => {
    if (item && item.id) { // Add safety check for item
      item.children = [];
      menuMap[item.id] = item;
    }
  });

  data.forEach(item => {
    if (item && item.id) { // Add safety check for item
      const parentId = parseInt(item.parent);
      if (parentId === 0) {
        roots.push(item);
      } else if (menuMap[parentId]) {
        menuMap[parentId].children.push(item);
      }
    }
  });

  return roots.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Helper function to check if a menu item is active
function isMenuItemActive(item, currentPath, checkChildren = true) {
  if (!item || !currentPath) return false;

  const itemPath = normalizeUrl(item.url);
  // Clean current path - remove trailing slash except for root
  let cleanCurrentPath = currentPath;
  if (cleanCurrentPath.length > 1 && cleanCurrentPath.endsWith('/')) {
    cleanCurrentPath = cleanCurrentPath.slice(0, -1);
  }

  // Check if current item is active (exact match only)
  if (itemPath === cleanCurrentPath) {
    return true;
  }

  // Check if any children are active
  if (checkChildren && item.children && Array.isArray(item.children)) {
    return item.children.some(child => isMenuItemActive(child, currentPath, true));
  }

  // Check mega menu items
  if (item.mega_menu_enabled && Array.isArray(item.mega_menu_layout)) {
    return item.mega_menu_layout.some(row =>
      Array.isArray(row.columns) && row.columns.some(col =>
        Array.isArray(col.items) && col.items.some(colItem => {
          if (colItem.type === 'item') {
            return isMenuItemActive(colItem, currentPath, false);
          }
          if (colItem.type === 'widget' && Array.isArray(colItem.menu_items)) {
            return colItem.menu_items.some(menuItem => isMenuItemActive(menuItem, currentPath, false));
          }
          return false;
        })
      )
    );
  }

  return false;
}
const closeAllDropdowns = (e) => {
  const dropdownParents = document.querySelectorAll('.dropdown, .dropdown-submenu, .dropdown-mega');
  dropdownParents.forEach(parent => {
    parent.style.pointerEvents = 'none';
  });

  const removeDisable = () => {
    dropdownParents.forEach(parent => {
      parent.style.pointerEvents = '';
    });
    document.removeEventListener('mousemove', removeDisable);
  };

  document.addEventListener('mousemove', removeDisable, { once: true });
};
// Recursive render function for nested menus (Desktop only)
function renderMenuItems(items, level = 1, currentPath) {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.map(item => {
    if (!item || !item.id) {
      return null;
    }

    const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
    const isMegaMenu = item.mega_menu_enabled && Array.isArray(item.mega_menu_layout) && item.mega_menu_layout.length > 0;
    const submenuClass = `submenu-level-${level}`;
    const isActive = isMenuItemActive(item, currentPath);
    const activeClass = isActive ? 'active' : '';

    // Mega Menu Layout
    if (isMegaMenu) {
      return (
        <li key={item.id} className={`nav-item dropdown dropdown-mega common-li position-static ${activeClass}`}>
          <div className="nav-link-wrapper d-flex align-items-center">
            <Link
              href={normalizeUrl(item.url)}
              className={`nav-link flex-grow-1 main-nav-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
              onClick={closeAllDropdowns}
            >
              {item.title || 'Menu Item'}
            </Link>
            <button
              className="btn dropdown-toggle dropdown-toggle-split custom-dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
              style={{
                border: 'none',
                background: 'transparent',
                padding: '0 8px'
              }}
            >
              <ArrowDown />
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
          </div>
          <div className="dropdown-menu shadow p-4 mt-0 border-0">
            {item.mega_menu_layout.map((row, rowIdx) => (
              <div className="row" key={rowIdx}>
                {Array.isArray(row.columns) && row.columns.map((col, colIdx) => (
                  <div className={`col-md-${col.meta?.span || 12}`} key={colIdx}>
                    {Array.isArray(col.items) && col.items.map((colItem, i) => {
                      if (!colItem) return null;

                      if (colItem.type === 'item') {
                        const colItemActive = isMenuItemActive(colItem, currentPath, false);
                        return (
                          <Link
                            key={colItem.id || i}
                            className={`dropdown-item ${colItemActive ? 'active' : ''}`}
                            href={normalizeUrl(colItem.url)}
                            onClick={closeAllDropdowns}
                          >
                            {colItem.title || 'Menu Item'}
                          </Link>
                        );
                      }

                      if (colItem.type === 'widget') {
                        // Image widget
                        if (colItem.url?.url && !colItem.menu_items) {
                          return (
                            <DivTag className="mega-submenu-img" key={colItem.id || i}>
                              <Image
                                src={colItem.url.url}
                                alt={colItem.alt || ''}
                                className="img-fluid mb-2"
                                fill
                              />
                            </DivTag>
                          );
                        }

                        // Menu widget with links
                        if (Array.isArray(colItem.menu_items) && colItem.menu_items.length > 0) {
                          return (
                            <div key={colItem.id || i} className="widget-menu mb-3">
                              {colItem.menu_items.map((link, linkIdx) => {
                                const linkActive = isMenuItemActive(link, currentPath, false);
                                return (
                                  <Link
                                    key={link.id || linkIdx}
                                    href={normalizeUrl(link.url)}
                                    className={`dropdown-item ${linkActive ? 'active' : ''}`}
                                    onClick={closeAllDropdowns}
                                  >
                                    {link.title || 'Link'}
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        }

                        // Text widget fallback
                        if (!colItem.menu_items && !colItem.url?.url) {
                          return (
                            <div key={colItem.id || i} className="text-widget mb-2 mega-menu-sub-title">
                              {colItem.title || ''}
                            </div>
                          );
                        }
                      }

                      return null;
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </li>
      );
    }



    // Standard Submenu
    return (
      <li key={item.id} className={`nav-item dropdown common-li ${hasChildren ? 'dropdown-submenu' : ''} ${submenuClass} ${activeClass}`}>
        {hasChildren ? (
          <div className="nav-link-wrapper d-flex align-items-center">
            <Link
              href={normalizeUrl(item.url)}
              className={`nav-link flex-grow-1 main-nav-item ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
              onClick={closeAllDropdowns}
            >
              {item.title || 'Menu Item'}
            </Link>
            <button
              className="btn dropdown-toggle dropdown-toggle-split custom-dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
              style={{
                border: 'none',
                background: 'transparent',
                padding: '0 8px'
              }}
            >
              <ArrowDown />
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
          </div>
        ) : (
          <Link
            href={normalizeUrl(item.url)}
            className={`nav-link ${isActive ? 'active' : ''}`}
            onClick={closeAllDropdowns}
          >
            {item.title || 'Menu Item'}
          </Link>
        )}

        {hasChildren && (
          <ul className={`dropdown-menu submenu-child shadow border-0 sandard-menu ${submenuClass}`}>
            {renderMenuItems(item.children, level + 1, currentPath)}
          </ul>
        )}
      </li>
    );
  }).filter(Boolean);
}

export default function Header({ themeSettings, navigationData = [] }) {
  // Add safety check and provide fallback
  const safeNavigationData = navigationData || [];
  const menuItems = buildMenu(safeNavigationData);
  const [expanded, setExpanded] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current path

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setExpanded({});
  };

  // Recursive render for mobile menu
  function renderMobileMenu(items, level = 0) {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.map(item => {
      if (!item || !item.id) {
        return null;
      }

      const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;
      const isExpanded = expanded[item.id];
      const hasMegaMenu = item.mega_menu_enabled && Array.isArray(item.mega_menu_layout);
      const isActive = isMenuItemActive(item, pathname);
      const activeClass = isActive ? 'active' : '';

      return (
        <div key={item.id} className={`mobile-menu-item level-${level} ${activeClass}`}>
          <div className="mobile-menu-link-wrapper">
            <Link
              href={normalizeUrl(item.url)}
              className={`mobile-menu-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {item.title || 'Menu Item'}
            </Link>

            {(hasChildren || hasMegaMenu) && (
              <button
                className="mobile-menu-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpand(item.id);
                }}
                aria-expanded={isExpanded}
              >
                <svg
                  className={`toggle-icon ${isExpanded ? 'rotated' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {(hasChildren || hasMegaMenu) && (
            <div className={`mobile-submenu ${isExpanded ? 'expanded' : ''}`}>
              {hasChildren && renderMobileMenu(item.children, level + 1)}

              {/* Render Mega Menu Layout for mobile */}
              {hasMegaMenu &&
                item.mega_menu_layout.map((row, rowIdx) => (
                  <div key={`row-${rowIdx}`} className="mobile-mega-row">
                    {Array.isArray(row.columns) && row.columns.map((col, colIdx) => (
                      <div key={`col-${colIdx}`} className="mobile-mega-col">
                        {Array.isArray(col.items) && col.items.map((colItem, colItemIdx) => {
                          if (!colItem) return null;

                          // Render nav_menu widgets
                          if (colItem.type === 'widget' && Array.isArray(colItem.menu_items)) {
                            return (
                              <div key={`menu-${colItemIdx}`} className="mobile-mega-widget">
                                {colItem.title && (
                                  <div className="mobile-mega-title">{colItem.title}</div>
                                )}
                                <ul className="mobile-mega-links">
                                  {colItem.menu_items.map((mi, miIdx) => {
                                    const miActive = isMenuItemActive(mi, pathname, false);
                                    return (
                                      <li key={mi.id || miIdx}>
                                        <Link
                                          href={normalizeUrl(mi.url)}
                                          className={miActive ? 'active' : ''}
                                          onClick={closeMobileMenu}
                                        >
                                          {mi.title || 'Link'}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          }

                          // Render image widget
                          if (colItem.url?.url && colItem.type === 'widget') {
                            return (
                              <div key={`img-${colItemIdx}`} className="mobile-mega-image">
                                <Image src={colItem.url.url} alt={colItem.alt || ''} fill />
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      );
    }).filter(Boolean); // Remove null items
  }

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      {themeSettings?.promotion_enable ? (
        <TopHeader
          promoText={
            themeSettings?.promotion_text ||
            'qBotica Recognized as a UiPath Agentic Automation Fast Track Partner'
          }
          promoLink={themeSettings?.promotion_link || '/'}
          promoLabel={themeSettings?.promotion_label || 'Learn More'}

        />
      ) : null}

      <header className={`navbar navbar-expand-lg navbar-light primary-menu bottom-dashed ${themeSettings?.promotion_enable ? 'enable-promotion-bar' : ''}`}>
        <DivTag className="container">
          <Link href="/" className="navbar-brand">
            {themeSettings?.logo ? (
              <DivTag className="header-desk-logo">
                <Image
                  src={themeSettings.logo}
                  alt={themeSettings.site_title || 'Logo'}
                  fill
                />
              </DivTag>
            ) : (
              themeSettings?.site_title || 'Qbotica'
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-trigger d-lg-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="mainNavbar">
            <ul className="navbar-nav ms-auto">
              {renderMenuItems(menuItems, 1, pathname)}
            </ul>
            <Link href={themeSettings.header_cta_link || '#'} target='_blank' className="btn primary-btn">
              {themeSettings.header_cta_label || ''}
            </Link>
          </div>
        </DivTag>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            <Link href="/" className="mobile-menu-brand" onClick={closeMobileMenu}>
              {themeSettings?.logo ? (
                <Image
                  src={themeSettings.logo}
                  alt={themeSettings.site_title || 'Site Logo'}
                  fill
                />
              ) : (
                themeSettings?.site_title || 'Site Name'
              )}
            </Link>
            <button
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu-nav">
            {renderMobileMenu(menuItems)}
          </nav>

          <div className="mobile-menu-footer">
            {themeSettings?.promotion_enable && (
              <PTag className="mobile-promotion">
                {themeSettings?.promotion_text}{' '}
                {themeSettings?.promotion_link && themeSettings?.promotion_label && (
                  <Link
                    href={themeSettings.promotion_link || '#'}
                    className="mobile-promo-link"
                    onClick={closeMobileMenu}
                  >
                    {themeSettings.promotion_label}
                  </Link>
                )}
              </PTag>
            )}
            <Link href={themeSettings.header_cta_link || '#'} className="btn primary-btn mobile-cta" target='_blank' onClick={closeMobileMenu}>
              {themeSettings.header_cta_label || ''}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}