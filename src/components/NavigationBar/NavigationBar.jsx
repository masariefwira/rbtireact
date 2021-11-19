import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookIcon from '@mui/icons-material/Book';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export default function NavigationBar() {
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);
  const sideBarList = [
    {
      text: 'Input Buku Baru',
      link: '/input-buku',
      icon: <BookIcon />,
    },
    {
      text: 'Buat Peminjaman Baru',
      link: '/input-peminjaman',
      icon: <ControlPointIcon />,
    },
    {
      text: 'Pengembalian Buku',
      link: '/pengembalian-buku',
      icon: <LibraryBooksIcon />,
    },
    {
      text: 'Semua Buku',
      link: '/semua-buku',
      icon: <BookIcon />,
    },
  ];

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
      }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {sideBarList.map(({ text, link, icon }) => (
          <ListItem button key={text} component={Link} to={link}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  const toggleDrawer = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 3 }}>
      <AppBar position="static">
        <Drawer anchor={'left'} open={drawerIsOpen} onClose={toggleDrawer}>
          {list('left')}
        </Drawer>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}
            to={'/'}
          >
            RBTI UB
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
