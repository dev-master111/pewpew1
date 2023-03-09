import { useUser } from '@auth0/nextjs-auth0/client';
import { Dropdown, Image } from 'semantic-ui-react'
import Link from 'next/link'

export default function Header() {
  const { user, error, isLoading } = useUser();

  if (!isLoading && !user) {
    window.location.href = window.location.origin + '/api/auth/login'
  }

  return (
    <div className="page-header">
      <div className="app-logo">PewPew</div>
      <div>
        {user && (
          <Dropdown
            text={user.name}
            floating
            labeled
            icon={<Image className="user-image" src={user.picture} alt="user profile"></Image>}
          >
            <Dropdown.Menu className="right">
              <Link href="/api/auth/logout" passHref>
                <Dropdown.Item text='Logout' />
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </div>
  )
}
