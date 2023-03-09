import { useRouter } from 'next/router'

export default function LoginForm() {
  const router = useRouter()

  return (
    <div>
      <button onClick={() => {}}>Log In</button>
      <button onClick={() => {}}>Log out</button>
    </div>
  )
}
