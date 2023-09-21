import {
    AppBar,
    Toolbar,
    useTheme,
    Box,
} from '@mui/material';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { MetadataContext } from 'src/contexts/MetadataContext';
// components
import Logo from './Logo';

// ----------------------------------------------------------------------

export default function NavBar() {

    const { isMobile } = useContext(MetadataContext);
    const theme = useTheme();

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    sx={{
                        backgroundColor: theme.palette.grey.default_canvas,
                        // top: 'auto',
                        // bottom: 0,
                    }}
                >
                    <Toolbar disableGutters={isMobile ? true : false} sx={{ justifyContent: 'space-between' }}>
                        <Logo />
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet />
        </>
    )
};