const Logo = () => {
  return (
    <div className="relative w-full h-32 flex justify-center items-center">
      <img src="/background.svg" className="object-cover w-full h-full" alt="background" />
      <span className="absolute text-white text-4xl">Welcome! Server</span>
    </div>
  )
}

export default Logo
