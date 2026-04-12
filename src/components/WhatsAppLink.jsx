/**
 * WhatsAppLink.jsx — Quick link button to chat with Dex on WhatsApp.
 * Opens wa.me with a pre-filled message.
 *
 * Usage:
 *   <WhatsAppLink phoneNumber="6281234567890" prefillMessage="hai, aku lagi buka website kamu..." />
 */

const DEFAULT_PHONE = '' // Set Dex's phone number here
const DEFAULT_MESSAGE = 'hai, aku lagi buka website kamu... 💛'

export default function WhatsAppLink({
  phoneNumber = DEFAULT_PHONE,
  prefillMessage = DEFAULT_MESSAGE,
  className = '',
  label = 'chat Dex 💬',
}) {
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(prefillMessage)}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`pixel-btn inline-block text-center no-underline ${className}`}
    >
      {label}
    </a>
  )
}
