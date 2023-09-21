import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Link, Container, Typography, Stack, Box, Button } from '@mui/material';
// routes
import { PATH_PAGE } from 'src/routes/paths';
// components
import Page from "src/components/Page";
// sections
import { LoginForm } from 'src/auth/login';

// ----------------------------------------------------------------------

export default function Login() {
  // const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <Page title="Login">
      <Container maxWidth="sm">
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', mb: 2 }} direction="row" spacing={1}>
          <Box sx={{ maxHeight: '100%', maxWidth: '40px', bgcolor: 'white', borderRadius: 16 }}>
            <img src="/icons/broom.png" alt="TTT Logo" />
          </Box>
          <Typography variant="h3" paragraph>
            QGame
          </Typography>
        </Stack>

        {/* <LoginForm /> */}

        {/* <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don’t have an account?{' '}
          <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
            Get started
          </Link>
        </Typography> */}

        <Button
          fullWidth
          size="large"
          variant={'contained'}
          onClick={() => { navigate(PATH_PAGE.home) }}
        >
          Start
        </Button>

      </Container>
    </Page>
  );
}
