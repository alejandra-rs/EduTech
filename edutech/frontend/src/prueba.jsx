import VisorVideo from './components/VisorVideo'

export default function App() {
  const miVideo = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 

  return (
    <div className="min-h-screen w-full bg-zinc-100 p-4 md:p-10 flex flex-col items-center">

      <div className="w-full max-w-4xl">
        <VisorVideo videoUrl={miVideo} />
      </div>

    </div>
  )
}