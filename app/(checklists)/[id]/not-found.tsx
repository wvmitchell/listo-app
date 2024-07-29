import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex h-[50vh] flex-col justify-center">
      <h1 className="text-center text-2xl">
        404 - Uh oh! We couldn't find that!
      </h1>
      <p className="text-center">
        Better head{" "}
        <Link href="/" className="font-semibold underline">
          Home
        </Link>
      </p>
    </div>
  )
}

export default NotFound
