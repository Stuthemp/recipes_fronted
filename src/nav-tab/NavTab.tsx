// NavTab.tsx
import './NavTab.css';

interface NavTabProps {
  title: string;
  iconClass: string;
  dataTab: string;
  isActive: boolean;
  onClick: () => void; // Add this
}

const NavTab = ({
  title,
  iconClass,
  dataTab,
  isActive,
  onClick // Destructure it
}: NavTabProps) => {
  return (
    <div
      className={`nav-tab ${isActive ? 'active' : ''}`}
      data-tab={dataTab}
      onClick={onClick} // Attach the handler
    >
      <i className={iconClass}></i> {title}
    </div>
  );
};

export default NavTab;