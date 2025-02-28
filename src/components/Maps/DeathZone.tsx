import { useAtom } from 'jotai';
import { respawnPositionAtom, characterPositionAtom } from '../../store';

interface DeathZoneProps {
  threshold?: number;
}

const DeathZone: React.FC<DeathZoneProps> = ({ threshold = -10 }) => {
  const [characterPosition] = useAtom(characterPositionAtom);
  const [respawnPosition] = useAtom(respawnPositionAtom);

  // Check if character has fallen below the threshold
  if (characterPosition.y < threshold) {
    console.log('Character fell off the world! Respawning...');
    // Reset the character position to the respawn point
    characterPosition.copy(respawnPosition);
  }

  // This component doesn't render anything visible
  return null;
};

export default DeathZone;
