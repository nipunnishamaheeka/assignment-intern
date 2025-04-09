import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge,
  Tooltip,
  Fade,
  Collapse,
  ListItemButton,
  alpha,
  styled,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Bookmark,
  RestaurantMenu,
  LogoutOutlined,
  AddCircleOutline,
  HomeRounded,
  DarkModeOutlined,
  LightModeRounded,
  ArrowForwardIos,
  NotificationsOutlined,
  SearchRounded,
  CloseRounded,
  FavoriteBorder,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { logout } from "../../store/authSlice";
import { useTheme as useAppTheme } from "../features/ThemeProvider";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  backdropFilter: "blur(8px)",
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.background.paper, 0.9)
      : alpha(theme.palette.background.paper, 0.8),
  color: theme.palette.text.primary,
  transition: "all 0.3s ease",
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.4rem",
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: "1.8rem",
    color: theme.palette.primary.main,
  },
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  marginRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontWeight: active ? 600 : 500,
  position: "relative",
  "&::after": active
    ? {
        content: '""',
        position: "absolute",
        bottom: 6,
        left: "50%",
        transform: "translateX(-50%)",
        width: 20,
        height: 3,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4,
      }
    : {},
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  transition: "transform 0.2s ease",
  border: `2px solid ${theme.palette.primary.main}`,
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginLeft: theme.spacing(1),
  padding: theme.spacing(1),
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-2px)",
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const MobileDrawerItem = styled(ListItemButton)(({ theme, selected }) => ({
  marginBottom: theme.spacing(0.5),
  borderRadius: 8,
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  "&:hover": {
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.action.hover, 0.8),
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.grey[100], 0.8)
      : alpha(theme.palette.grey[900], 0.8),
  marginTop: "auto",
}));

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user } = useSelector((state) => state.auth);
  const { darkMode, toggleDarkMode } = useAppTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if page is scrolled for UI effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/");
    setDrawerOpen(false);
  };

  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: <HomeRounded color="primary" />,
      onClick: () => {
        navigate("/");
        setDrawerOpen(false);
      },
    },
    {
      label: "Create Recipe",
      path: "/recipes/create",
      icon: (
        <AddCircleOutline
          color={location.pathname === "/recipes/create" ? "primary" : "action"}
        />
      ),
      onClick: () => {
        navigate("/recipes/create");
        setDrawerOpen(false);
      },
      auth: true,
    },
    {
      label: "My Favorites",
      path: "/favorites",
      icon: (
        <FavoriteBorder
          color={location.pathname === "/favorites" ? "primary" : "action"}
        />
      ),
      onClick: () => {
        navigate("/favorites");
        setDrawerOpen(false);
      },
      auth: true,
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: (
        <AccountCircle
          color={location.pathname === "/profile" ? "primary" : "action"}
        />
      ),
      onClick: () => {
        navigate("/profile");
        setDrawerOpen(false);
      },
      auth: true,
    },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <DrawerHeader>
        <LogoText variant="h6" color="inherit">
          <RestaurantMenu />
          Flavor Exchange
        </LogoText>
        <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
          <CloseRounded />
        </IconButton>
      </DrawerHeader>

      <Divider />

      {user && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <UserAvatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{ width: 42, height: 42 }}
          >
            {user.name?.charAt(0) || "U"}
          </UserAvatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {user.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || ""}
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ p: 1, flex: 1, overflowY: "auto" }}>
        <List component="nav" disablePadding>
          <ListItem sx={{ pb: 1 }}>
            <ListItemButton onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <ListItemText
                primary="Navigation"
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
              {mobileNavOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={mobileNavOpen} timeout="auto" unmountOnExit>
            {menuItems.map(
              (item) =>
                (!item.auth || (item.auth && user)) && (
                  <MobileDrawerItem
                    key={item.label}
                    onClick={item.onClick}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      }}
                    />
                    {location.pathname === item.path && (
                      <ArrowForwardIos
                        fontSize="small"
                        color="primary"
                        sx={{ fontSize: 14 }}
                      />
                    )}
                  </MobileDrawerItem>
                )
            )}
          </Collapse>
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        {user ? (
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
            fullWidth
            sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
          >
            Logout
          </Button>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/login");
                setDrawerOpen(false);
              }}
              fullWidth
              sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/signup");
                setDrawerOpen(false);
              }}
              fullWidth
              sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
            >
              Sign Up
            </Button>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            startIcon={darkMode ? <LightModeRounded /> : <DarkModeOutlined />}
            onClick={toggleDarkMode}
            size="small"
            sx={{ textTransform: "none" }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <StyledAppBar
        position="sticky"
        elevation={isScrolled ? 2 : 0}
        sx={{
          height: isScrolled ? 64 : 72,
          transition: "height 0.3s ease",
        }}
      >
        <Toolbar sx={{ height: "100%" }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <LogoText
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <RestaurantMenu />
            Flavor Exchange
          </LogoText>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NavButton
                color="inherit"
                component={RouterLink}
                to="/"
                active={location.pathname === "/" ? 1 : 0}
              >
                Home
              </NavButton>

              {user ? (
                <>
                  <NavButton
                    color="inherit"
                    component={RouterLink}
                    to="/recipes/create"
                    active={location.pathname === "/recipes/create" ? 1 : 0}
                  >
                    Create Recipe
                  </NavButton>

                  <NavButton
                    color="inherit"
                    component={RouterLink}
                    to="/favorites"
                    active={location.pathname === "/favorites" ? 1 : 0}
                  >
                    Favorites
                  </NavButton>

                  <Tooltip title="Search" arrow>
                    <ActionIconButton color="inherit">
                      <SearchRounded />
                    </ActionIconButton>
                  </Tooltip>

                  <Tooltip title="Notifications" arrow>
                    <ActionIconButton color="inherit">
                      <Badge badgeContent={3} color="error">
                        <NotificationsOutlined />
                      </Badge>
                    </ActionIconButton>
                  </Tooltip>

                  <Tooltip title="Account" arrow>
                    <ActionIconButton
                      onClick={handleMenuOpen}
                      color="inherit"
                      sx={{ ml: 1.5 }}
                    >
                      <UserAvatar
                        src={user.avatarUrl}
                        alt={user.name}
                        sx={{ width: 36, height: 36 }}
                      >
                        {user.name?.charAt(0) || "U"}
                      </UserAvatar>
                    </ActionIconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                    elevation={4}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    sx={{ mt: 1 }}
                  >
                    {user && (
                      <Box sx={{ px: 2, py: 1, minWidth: 180 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {user.name || "User"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {user.email || ""}
                        </Typography>
                      </Box>
                    )}

                    <Divider />

                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/profile");
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="My Profile" />
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        toggleDarkMode();
                        handleMenuClose();
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        {darkMode ? (
                          <LightModeRounded fontSize="small" />
                        ) : (
                          <DarkModeOutlined fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={darkMode ? "Light Mode" : "Dark Mode"}
                      />
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <LogoutOutlined fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{ color: "error" }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    sx={{ mr: 1, textTransform: "none" }}
                  >
                    Login
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/signup"
                    sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
                  >
                    Sign Up
                  </Button>

                  <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} arrow>
                    <ActionIconButton
                      onClick={toggleDarkMode}
                      color="inherit"
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      {darkMode ? <LightModeRounded /> : <DarkModeOutlined />}
                    </ActionIconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 280, borderRadius: "0 16px 16px 0" },
        }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ flexGrow: 1, pt: 2, pb: 4 }}>{children}</Box>

      <Footer component="footer">
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: { xs: 2, sm: 0 },
              }}
            >
              <RestaurantMenu sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1" fontWeight={600}>
                Flavor Exchange
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Flavor Exchange. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Footer>
    </Box>
  );
};

export default Layout;
