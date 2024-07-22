import Link from "next/link"
import Image from "next/image"
import fullLogo from "@/app/images/full_logo.png"

function Header() {
  return (
    <div className="my-4">
      <Link href="/">
        <Image src={fullLogo} width={50} height={50} alt="Listo" />
      </Link>
    </div>
  )
}

export default Header
