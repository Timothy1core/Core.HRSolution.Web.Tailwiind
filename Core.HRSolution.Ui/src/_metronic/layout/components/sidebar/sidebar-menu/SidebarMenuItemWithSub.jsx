import React from 'react'
import clsx from 'clsx'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon} from '../../../../helpers'
import {useLayout} from '../../../core'
import { useState } from 'react'



const SidebarMenuItemWithSub  = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {app} = config

  // State to track whether the submenu is open
  const [isMenuOpen, setMenuOpen] = useState(false)

  // Toggle menu open state
  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <div
      className={clsx('menu-item', { 'here show': isActive || isMenuOpen }, 'menu-accordion')}
      data-kt-menu-trigger='click'
    >
      <span className='menu-link' onClick={handleMenuClick}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-1' />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}
        <span className='menu-title'>{title}</span>
        <span className='menu-arrow'></span>
      </span>
      <div className={clsx('menu-sub menu-sub-accordion', { 'menu-active-bg': isActive || isMenuOpen, show: isMenuOpen })}>
        {(children.isParent == false && children.isSubParent == false) ? null : children}
      </div>
    </div>
  )
}

export {SidebarMenuItemWithSub}
