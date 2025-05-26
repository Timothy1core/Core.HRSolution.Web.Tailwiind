import clsx from 'clsx'

const KTCardBody = ({ className, scroll, height, children }) => {
  return (
    <div
      className={clsx(
        'card-body',
        className && className,
        {
          'card-scroll': scroll,
        },
        height && `h-${height}px`
      )}
    >
      {children}
    </div>
  )
}

export { KTCardBody }
