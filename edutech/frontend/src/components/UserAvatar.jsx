
export default function UserAvatar({ imageUrl }) {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt="Perfil del usuario" 
        className="w-16 h-16 rounded-full object-cover border border-white/30 shadow-sm"
      />
    );
  }
  
  return (
    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4"></circle>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-2a6 6 0 0112 0v2"></path>
    </svg>
  );
}