import Link from "next/link"

function Header() {
  return (
    <div>
      <Link href="/">
        <h1 className="text-2xl font-bold">Listo</h1>
      </Link>
    </div>
  )
}

export default Header
