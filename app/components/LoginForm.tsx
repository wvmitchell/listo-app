"use client"

type LoginFormProps = {
  handleLogin: (event: React.FormEvent<HTMLFormElement>) => void
}

const LoginForm = ({ handleLogin }: LoginFormProps) => {
  return (
    <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input type="email" id="email" name="email" placeholder="Email" />
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
      />
      <button type="submit" className="rounded-sm bg-blue-500 p-2 text-white">
        Login
      </button>
    </form>
  )
}

export default LoginForm
