import '../styles/globals.css';
import '../styles/auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from '../auth/auth';

function MyApp({ Component, pageProps }) {
  return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
  );
}

export default MyApp