import { Box, Stack, Typography, keyframes, useTheme } from "@mui/material";

// ----------------------------------------------------------------------

export default function Logo() {

    const theme = useTheme();

    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Box sx={{ maxHeight: '100%', maxWidth: '30px' }}>
                <img src="/icons/broom.png" alt="QGame Logo" />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                QGame
            </Typography>
        </Stack>
    )
}