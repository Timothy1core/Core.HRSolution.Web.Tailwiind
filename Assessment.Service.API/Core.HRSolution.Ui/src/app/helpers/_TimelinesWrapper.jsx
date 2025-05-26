import { KTIcon } from '../../_metronic/helpers';

const TimelinesWrapper = ({ line, icon, children, removeSpace, color }) => {
  return (
    <div className="d-flex align-items-start position-relative">
      {line && (
        <div className="position-absolute w-100 border-start border-gray-300" style={{ top: '2.25rem', bottom: '0', left: '1.125rem' }}></div>
      )}

      <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-light-danger border border-gray-300 " style={{ width: '2.25rem', height: '2.25rem' }}>
        <KTIcon iconName={icon} className={`fs-1 text-${color}`} />
      </div>

      <div className={`ps-3 ${!removeSpace ? 'mb-4' : ''} flex-grow-1`}>
        {children}
      </div>
    </div>
  );
};

export { TimelinesWrapper };