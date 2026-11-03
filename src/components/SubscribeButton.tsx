import { MdNotificationsActive } from 'react-icons/md';
import { useChannel } from '../app/ChannelContext';
import './SubscribeButton.css';

export default function SubscribeButton({ source }: { source: string }) {
  const { subscribed, toggleSubscribe } = useChannel();
  return (
    <button
      className={`sub-btn ${subscribed ? 'sub-btn--on' : ''}`}
      onClick={() => toggleSubscribe(source)}
      aria-pressed={subscribed}
    >
      {subscribed ? (
        <>
          <MdNotificationsActive className="sub-btn__bell" /> Subscribed
        </>
      ) : (
        'Subscribe'
      )}
    </button>
  );
}
