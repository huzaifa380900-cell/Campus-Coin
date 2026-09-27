const ICON_RATIO = 1.1;

export function Logo({ collapsed = false, className = '' }) {
  const height = collapsed ? 82 : 100;

  if (collapsed) {
    return (
      <div
        role="img"
        aria-label="Campus Coin"
        className={`flex items-center justify-center ${className}`}
        style={{
          width: `${height * ICON_RATIO}px`,
          height: `${height}px`,
          minWidth: `${height * ICON_RATIO}px`,
          minHeight: `${height}px`,
          maxWidth: `${height * ICON_RATIO}px`,
          maxHeight: `${height}px`,
          overflow: 'hidden',
        }}
      >
        <img
          src="/logo.png"
          alt="Campus Coin"
          draggable="false"
          className="select-none"
          style={{
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'left center',
          }}
        />
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="Campus Coin"
      role="img"
      draggable="false"
      className={`select-none ${className}`}
      style={{
        height: '100px',
        width: 'auto',
        minHeight: '100px',
        maxHeight: '100px',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}