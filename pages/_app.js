import '@/styles/globals.scss'
import '@/scss/main.scss'
import 'semantic-ui-css/semantic.min.css'
import '@/scss/RangeItem.scss'
import '@/scss/HistoryList.scss'

import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
  const { user } = pageProps;

  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  )
}
