'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Collapse } from '@mui/material';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearSession } from '@/store/authSlice';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isActive = (href: string) => pathname.startsWith(href);

  const handleSignOut = () => {
    localStorage.removeItem('tmdb_session_id');
    dispatch(clearSession());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(to right, #6b46c1, #4299e1)',
        boxShadow: 3,
        zIndex: 1300,
      }}
    >
      <Toolbar className="max-w-7xl mx-auto w-full px-4">
        {/* Logo/Brand */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" className="text-white no-underline">
            R-flix
          </Link>
        </Typography>
        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 2,
            position: 'relative',
          }}
        >
          {/* Home Button with Dropdown on Hover */}
          <Box
            onMouseEnter={() => setShowHomeDropdown(true)}
            onMouseLeave={() => setShowHomeDropdown(false)}
            sx={{ position: 'relative' }}
          >
            <Button
              color="inherit"
              component={Link}
              href="/home?view=popular"
              sx={{
                textTransform: 'none',
                fontWeight: isActive('/home') ? 'bold' : 'normal',
                borderBottom: isActive('/home') ? '2px solid white' : 'none',
              }}
            >
              Home
            </Button>
            {showHomeDropdown && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'linear-gradient(to right, #6b46c1, #4299e1)',
                  boxShadow: 3,
                  zIndex: 1400,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '160px',
                }}
              >
                <Button
                  color="inherit"
                  component={Link}
                  href="/home?view=toprated"
                  sx={{
                    textTransform: 'none',
                    fontWeight: isActive('/home?view=toprated')
                      ? 'bold'
                      : 'normal',
                    borderBottom: isActive('/home?view=toprated')
                      ? '2px solid white'
                      : 'none',
                  }}
                >
                  Top Rated Movies
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  href="/home?view=popular"
                  sx={{
                    textTransform: 'none',
                    fontWeight: isActive('/home?view=popular')
                      ? 'bold'
                      : 'normal',
                    borderBottom: isActive('/home?view=popular')
                      ? '2px solid white'
                      : 'none',
                  }}
                >
                  Popular Movies
                </Button>
              </Box>
            )}
          </Box>
          <Button
            color="inherit"
            component={Link}
            href="/myratings"
            sx={{
              textTransform: 'none',
              fontWeight: isActive('/myratings') ? 'bold' : 'normal',
              borderBottom: isActive('/myratings') ? '2px solid white' : 'none',
            }}
          >
            My Ratings
          </Button>
          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleSignOut}
              sx={{
                textTransform: 'none',
                fontWeight: 'normal',
                borderBottom: 'none',
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              href="/signin"
              sx={{
                textTransform: 'none',
                fontWeight: isActive('/signin') ? 'bold' : 'normal',
                borderBottom: isActive('/signin') ? '2px solid white' : 'none',
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
        {/* Mobile Navigation Toggle */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle navigation"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            sx={{ mr: 2 }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>
      {/* Mobile Navigation Menu */}
      <Collapse in={menuOpen}>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            background: 'linear-gradient(to right, #6b46c1, #4299e1)',
            px: 2,
            py: 1,
          }}
        >
          <Button
            color="inherit"
            component={Link}
            href="/home?view=popular"
            onClick={() => setMenuOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: isActive('/home') ? 'bold' : 'normal',
              borderBottom: isActive('/home') ? '2px solid white' : 'none',
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/myratings"
            onClick={() => setMenuOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: isActive('/myratings') ? 'bold' : 'normal',
              borderBottom: isActive('/myratings') ? '2px solid white' : 'none',
            }}
          >
            My Ratings
          </Button>
          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 'normal',
                borderBottom: 'none',
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              href="/signin"
              onClick={() => setMenuOpen(false)}
              sx={{
                textTransform: 'none',
                fontWeight: isActive('/signin') ? 'bold' : 'normal',
                borderBottom: isActive('/signin') ? '2px solid white' : 'none',
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Collapse>
    </AppBar>
  );
};

export default Header;
