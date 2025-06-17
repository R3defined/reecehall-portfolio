import { useState, useEffect, useRef } from 'react';
import { BsGithub, BsSpotify, BsFilePdf, BsStickyFill, BsLinkedin, BsCalendar } from 'react-icons/bs';
import { IoIosCall, IoIosMail } from 'react-icons/io';
import { FaLink, FaEnvelope } from 'react-icons/fa';
import ResumeViewer from './ResumeViewer';
import SpotifyPlayer from './SpotifyPlayer';
import { userConfig } from '../../config/userConfig';
import { RiTerminalFill } from 'react-icons/ri';

interface DesktopDockProps {
  onTerminalClick: () => void;
  onNotesClick: () => void;
  onGitHubClick: () => void;
  activeApps: {
    terminal: boolean;
    notes: boolean;
    github: boolean;
    resume: boolean;
    spotify: boolean;
  };
}

const DesktopDock = ({ onTerminalClick, onNotesClick, onGitHubClick, activeApps }: DesktopDockProps) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showLinksPopup, setShowLinksPopup] = useState(false);
  const linksPopupRef = useRef<HTMLDivElement>(null);

  const handleLinksClick = () => {
    setShowLinksPopup(!showLinksPopup);
  };

  const handleCalendarClick = () => {
    window.open(userConfig.contact.calendly, '_blank');
  };

  const handleSpotifyClick = () => {
    setShowSpotify(true);
  };

  const handleResumeClick = () => {
    setShowResume(true);
  };

  const handleCloseResume = () => {
    setShowResume(false);
  };

  const handleCloseSpotify = () => {
    setShowSpotify(false);
  };

  const handleEmailClick = () => {
    window.open(`mailto:${userConfig.contact.email}`, '_blank');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (linksPopupRef.current && !linksPopupRef.current.contains(event.target as Node)) {
        setShowLinksPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
      {text}
    </div>
  );

  const LinksPopup = () => (
    <div
      ref={linksPopupRef}
      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800/90 w-30 backdrop-blur-sm rounded-lg p-4 shadow-xl"
    >
      <div className="grid grid-cols-1 gap-y-2">
        <a
          href={userConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <BsLinkedin size={20} />
          <span>LinkedIn</span>
        </a>
        <a
          href={userConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <BsGithub size={20} />
          <span>GitHub</span>
        </a>
        <a
          href={`mailto:${userConfig.contact.email}`}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <IoIosMail size={20} />
          <span>Email</span>
        </a>
        <a
          href={`tel:${userConfig.contact.phone}`}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <IoIosCall size={20} />
          <span>Call</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 hidden md:flex justify-center pb-4 z-100">
        <div className="bg-gray-600/50 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
          <div className="flex space-x-2">
            {/* Profile Picture */}
            <button
              onClick={() => window.open('https://blog.reecehall.com', '_blank')}
              onMouseEnter={() => setHoveredIcon('profile')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className="w-12 h-12 bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 overflow-hidden">
                <img 
                  src={userConfig.profilePicture}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {hoveredIcon === 'profile' && <Tooltip text='My Blog' />}
            </button>

            {/* GitHub */}
            <button
              onClick={onGitHubClick}
              onMouseEnter={() => setHoveredIcon('github')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.github ? 'ring-2 ring-white/50' : ''}`}>
                <BsGithub size={35} className='text-gray-100' />
              </div>
              {hoveredIcon === 'github' && <Tooltip text='My Projects' />}
            </button>

            {/* Notes */}
            <button
              onClick={onNotesClick}
              onMouseEnter={() => setHoveredIcon('notes')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.notes ? 'ring-2 ring-white/50' : ''}`}>
                <BsStickyFill size={35} className='text-white' />
              </div>
              {hoveredIcon === 'notes' && <Tooltip text='Resume Notes' />}
            </button>

            {/* Resume */}
            <button
              onClick={handleResumeClick}
              onMouseEnter={() => setHoveredIcon('resume')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-red-600 to-red-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.resume ? 'ring-2 ring-white/50' : ''}`}>
                <BsFilePdf size={35} className='text-white' />
              </div>
              {hoveredIcon === 'resume' && <Tooltip text='View Resume' />}
            </button>

            {/* Calendar */}
            <button
              onClick={handleCalendarClick}
              onMouseEnter={() => setHoveredIcon('calendar')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className='w-12 h-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95'>
                <BsCalendar size={30} className='text-white' />
              </div>
              {hoveredIcon === 'calendar' && <Tooltip text='Schedule a Call' />}
            </button>

            {/* Spotify */}
            <button
              onClick={handleSpotifyClick}
              onMouseEnter={() => setHoveredIcon('spotify')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-green-600 to-green-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.spotify ? 'ring-2 ring-white/50' : ''}`}>
                <BsSpotify size={35} className='text-white' />
              </div>
              {hoveredIcon === 'spotify' && <Tooltip text='Spotify Playlist' />}
            </button>

            {/* Email */}
            <button
              onClick={handleEmailClick}
              onMouseEnter={() => setHoveredIcon('email')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className='w-12 h-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95'>
                <IoIosMail size={40} className='text-white' />
              </div>
              {hoveredIcon === 'email' && <Tooltip text='Email' />}
            </button>

            {/* Links */}
            <button
              onClick={handleLinksClick}
              onMouseEnter={() => setHoveredIcon('links')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className='w-12 h-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95'>
                <FaLink size={30} className='text-white' />
              </div>
              {hoveredIcon === 'links' && <Tooltip text='Contact Links' />}
              {showLinksPopup && <LinksPopup />}
            </button>

            {/* Terminal */}
            <button
              onClick={onTerminalClick}
              onMouseEnter={() => setHoveredIcon('terminal')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.terminal ? 'ring-2 ring-white/50' : ''}`}>
                <RiTerminalFill size={35} className='text-white' />
              </div>
              {hoveredIcon === 'terminal' && <Tooltip text='Terminal' />}
            </button>
          </div>
        </div>
      </div>

      <ResumeViewer isOpen={showResume} onClose={handleCloseResume} />
      <SpotifyPlayer
        isOpen={showSpotify}
        onClose={handleCloseSpotify}
        playlistId={userConfig.spotify.playlistId}
      />
    </>
  );
};

export default DesktopDock;
