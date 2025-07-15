import { BsGithub, BsSpotify, BsLinkedin } from 'react-icons/bs';
import { IoIosMail, IoIosCall } from 'react-icons/io';
import { FaHandshake } from 'react-icons/fa';
import { userConfig } from '../../config/userConfig';
import { BsStickyFill } from 'react-icons/bs';
import { RiTerminalFill } from 'react-icons/ri';
import { BsFilePdf } from 'react-icons/bs';

interface MobileDockProps {
  onGitHubClick: () => void;
  onNotesClick: () => void;
  onResumeClick: () => void;
  onTerminalClick: () => void;
  onConnectClick: () => void;
}

export default function MobileDock({ onGitHubClick, onNotesClick, onResumeClick, onTerminalClick, onConnectClick }: MobileDockProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${userConfig.contact.email}`;
  };

  const handleSpotifyClick = () => {
    window.open(`https://open.spotify.com/playlist/${userConfig.spotify.playlistId}`, '_blank');
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 md:hidden flex flex-col items-center z-10 space-y-2'>
      {/* Top row: viewer icons */}
      <div className='mx-4 mb-4 p-3 rounded-3xl space-x-4 flex justify-around items-center max-w-[400px] mx-auto'>
        <button
          onClick={onGitHubClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-18 h-18 bg-black rounded-2xl flex items-center justify-center'>
            <BsGithub size={55} className='text-white' />
          </div>
        </button>
        <button
          onClick={onNotesClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-18 h-18 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-2xl flex items-center justify-center'>
            <BsStickyFill size={55} className='text-white' />
          </div>
        </button>
        <button
          onClick={onResumeClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-18 h-18 bg-gradient-to-t from-red-600 to-red-400 rounded-2xl flex items-center justify-center'>
            <BsFilePdf size={55} className='text-white' />
          </div>
        </button>
        <button
          onClick={onTerminalClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-18 h-18 bg-black rounded-2xl flex items-center justify-center'>
            <RiTerminalFill size={55} className='text-white' />
          </div>
        </button>
      </div>

      {/* Connect App Row */}
      <div className='mx-4 mb-2 p-2 rounded-3xl flex justify-center items-center max-w-[400px] mx-auto'>
        <button
          onClick={onConnectClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-16 h-16 bg-gradient-to-t from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg'>
            <FaHandshake size={35} className='text-white' />
          </div>
          <span className='text-xs text-white mt-1 font-medium'>Apply</span>
        </button>
      </div>

      {/* Bottom row: contact shortcuts */}
      <div className='mx-4 mb-4 p-3 bg-gradient-to-t from-gray-700 to-gray-800 backdrop-blur-xl rounded-3xl space-x-4 flex justify-around items-center max-w-[400px] mx-auto'>
        <a href={`tel:${userConfig.contact.phone}`} className='flex flex-col items-center'>
          <div className='w-18 h-18 bg-gradient-to-t from-green-600 to-green-400 rounded-2xl flex items-center justify-center'>
            <IoIosCall size={55} className='text-white' />
          </div>
        </a>

        <button
          onClick={handleEmailClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-18 h-18 bg-gradient-to-t from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center'>
            <IoIosMail size={55} className='text-white' />
          </div>
        </button>

        <a href={userConfig.social.linkedin} className='flex flex-col items-center'>
          <div className='w-18 h-18 bg-[#0a66c2] rounded-2xl flex items-center justify-center'>
            <BsLinkedin size={50} className='text-white' />
          </div>
        </a>

        <button
          onClick={handleSpotifyClick}
          className='flex flex-col items-center cursor-pointer'
        >
          <div className='w-18 h-18 bg-gradient-to-t from-black to-black/55 rounded-2xl flex items-center justify-center'>
            <BsSpotify size={55} className='text-[#1ED760]' />
          </div>
        </button>
      </div>
    </div>
  );
}
