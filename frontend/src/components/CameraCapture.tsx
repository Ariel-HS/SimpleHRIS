import { useRef, useState } from "react"
import Webcam from "react-webcam"
import { Button, ErrorText } from "./ui"

const VIEW = "aspect-[4/3] w-full rounded-lg bg-black object-cover"

interface CameraCaptureProps {
  /** Called with the JPEG on capture, and with null on retake. */
  onCapture: (photo: Blob | null) => void
  disabled?: boolean
}

export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function capture() {
    const dataUrl = webcamRef.current?.getScreenshot() // base64 data URL, or null if not ready
    if (!dataUrl) return
    const blob = await (await fetch(dataUrl)).blob()
    setPreview(dataUrl)
    setOpen(false) // unmounting <Webcam> stops the camera
    onCapture(blob)
  }

  function retake() {
    setPreview(null)
    setError("")
    onCapture(null)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-3">
      {!open && !preview && (
        <Button variant="ghost" block onClick={() => setOpen(true)} disabled={disabled}>
          Open camera
        </Button>
      )}

      {open && (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.85}
            videoConstraints={{ facingMode: "user" }}
            onUserMediaError={() => {
              setOpen(false)
              setError("Could not open the camera. Allow camera access in your browser (the page must be on HTTPS or localhost).")
            }}
            className={VIEW}
          />
          <Button block onClick={capture}>
            Take picture
          </Button>
        </>
      )}

      {preview && (
        <>
          <img src={preview} alt="Your attendance photo" className={VIEW} />
          <Button variant="ghost" block onClick={retake} disabled={disabled}>
            Retake
          </Button>
        </>
      )}

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}