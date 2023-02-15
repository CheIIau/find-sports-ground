import { Link } from 'react-router-dom'
import headerStyle from './header.module.scss'

import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import LoginIcon from '@mui/icons-material/Login'
import InfoIcon from '@mui/icons-material/Info'
import { SvgIcon } from '@mui/material'
import { ReactComponent as StreetWorkout } from 'src/assets/street-workout.svg'

const navItems = [
  // { label: 'Home', link: '/', icon: LoginIcon },
  { label: 'About', link: '/about', icon: <InfoIcon /> },
  { label: 'Sign in', link: '/login', icon: <LoginIcon /> }
]

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left' }}>
      <Typography variant="h6" sx={{ my: 2 }} align="center">
        <Link to="/">Find Sports Ground</Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              component={Link}
              to={item.link}
            >
              {item.label}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, zIndex: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: 'block', sm: 'none' },
              left: 0,
              right: 0
            }}
            position="absolute"
          >
            Find Sports Ground
          </Typography>
          <Link
            className={headerStyle.headerTitle}
            to="/"
            style={{
              position: 'absolute',
              right: '10px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SvgIcon
              component={StreetWorkout}
              inheritViewBox
              fontSize={'large'}
              sx={{ display: { xs: 'block', sm: 'none' } }}
            />
          </Link>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            align="left"
          >
            <Link
              className={headerStyle.headerTitle}
              to="/"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <SvgIcon
                component={StreetWorkout}
                inheritViewBox
                style={{ fontSize: '50px' }}
                sx={{ mr: '5px', ml: '-5px' }}
              />
              Find Sports Ground
            </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              // <Button
              //   component={Link}
              //   to={item.link}
              //   key={item.label}
              //   sx={{ color: '#000' }}
              // >
              //   {item.label}
              // </Button>
              <Link to={item.link} key={item.label}>
                <IconButton
                  key={item.label}
                  sx={{ color: '#000' }}
                >
                  {item.icon}
                </IconButton>
              </Link>
              // <IconButton
              //   key={item.label}
              //   color="inherit"
              //   to={item.link}
              //   aria-label="open drawer"
              //   sx={{ mr: 2, display: { sm: 'none' }, zIndex: 2 }}
              // >
              //   {item.icon}
              // </IconButton>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}
