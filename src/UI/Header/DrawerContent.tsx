import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography
} from '@mui/material'
import { yellow } from '@mui/material/colors'
import { FunctionComponent } from 'react'
import { NavBarButton } from './Header'
import { Link } from 'react-router-dom'

export const DrawerContent: FunctionComponent<DrawerProps> = ({
  handleDrawerToggle,
  navItems,
  ...props
}) => {
  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left' }}>
      <Typography
        variant="h6"
        sx={{ py: 2, backgroundColor: yellow[500] }}
        align="center"
      >
        <Link to="/">Find Sports Ground</Link>
      </Typography>
      <Divider style={{ backgroundColor: 'black' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              component={Link}
              to={item.link}
              onClick={item?.handler}
            >
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                flexWrap={'nowrap'}
                width={'100%'}
              >
                <Typography color={'primary'}>{item.label}</Typography>
                {item.icon}
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

interface DrawerProps {
  handleDrawerToggle: () => void
  navItems: NavBarButton[]
}
