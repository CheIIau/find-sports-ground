import { Link, useNavigate } from 'react-router-dom'
import headerStyle from './header.module.scss'

import { useState, useMemo, ReactNode } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Typography,
  SvgIcon,
  Skeleton,
  Toolbar
} from '@mui/material'
import {
  Menu as MenuIcon,
  Login as LoginIcon,
  Info as InfoIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'
import { ReactComponent as StreetWorkout } from 'src/assets/street-workout.svg'
import { useAppSelector } from 'src/hooks/redux'
import { useLazyLogoutQuery } from 'src/services/UserService'
import { DrawerContent } from './DrawerContent'

export interface NavBarButton {
  label: string
  link: string
  icon: ReactNode
  handler?: () => any
}

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logout] = useLazyLogoutQuery()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const navigate = useNavigate()
  const { uid } = useAppSelector((state) => state.rootReducer.userReducer.user)
  const isAuthStateLoading = useAppSelector(
    (state) => state.rootReducer.userReducer.loading
  )

  const navItems = useMemo(() => {
    const navBarButtons: NavBarButton[] = [
      { label: 'About', link: '/about', icon: <InfoIcon /> }
    ]
    if (isAuthStateLoading) {
      navBarButtons.push({
        label: '',
        link: '#',
        icon: (
          <Skeleton
            sx={{ bgcolor: 'grey.600' }}
            variant="circular"
            width={20}
            height={20}
          />
        )
      })
    } else if (!uid) {
      navBarButtons.push({
        label: 'Sign in',
        link: '/login',
        icon: <LoginIcon />
      })
    } else {
      navBarButtons.push({
        label: 'Sign out',
        link: '#',
        icon: <LogoutIcon />,
        handler: async () => {
          await logout()
          navigate('/')
        }
      })
    }
    return navBarButtons
  }, [uid, isAuthStateLoading])

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
              <Link to={item.link} key={item.label} onClick={item?.handler}>
                <IconButton key={item.label} sx={{ color: '#000' }}>
                  {item.icon}
                </IconButton>
              </Link>
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
              width: 240,
              backgroundColor: '#363636'
            }
          }}
        >
          <DrawerContent
            handleDrawerToggle={handleDrawerToggle}
            navItems={navItems}
          />
        </Drawer>
      </Box>
    </Box>
  )
}
