"use client";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import { useEffect } from 'react';
import data from '../assets/images/logo.png'
import Link from 'next/link';
const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', current: true },
  { name: 'Users', href: '/admin/users', current: false },
  { name: 'Attendance', href: '/admin/attendance', current: false },
  { name: 'Leave', href: '/admin/leave', current: false },
  { name: 'Report', href: '/admin/report', current: false },
  { name: 'Profile', href: '/admin/profile', current: false },
  { name: 'Logout', href: '/admin/logout', current: false },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Adminnavbar() {
  const [active, setActive] = useState(' ');
  console.log(active)
  useEffect(() => {
    let url = window.location.href
    const regexPattern = /\/([^\/]+)$/;
    const match = url.match(regexPattern);
    
    if (match) {
      const extractedProfile = match[1];
      const convertedProfile = extractedProfile.charAt(0).toUpperCase() + extractedProfile.slice(1);
      setActive(convertedProfile)
  
    }   
  });
  return (
  <div>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
    <link rel="icon" href={data.src} type="image/icon type" />
    <Disclosure as="nav" className="fixed w-full bg-gray-800">
      
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 z-20">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center justify-center ">
                  <img
                    className="h-8 w-auto"
                    src={data.src}
                    alt="Your Company"
                  /> <Link href="/dashboard" className="text-white px-2"> Attendance System Admin</Link>
                </div>

              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      item.name !== 'Logout'?
                     ( <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActive(item.name)}
                        className={`${active === item.name
                          ? " text-white font-bold"
                          : "text-white"} rounded-md px-3 py-2 text-sm hover:no-underline hover:text-white`}

                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>):(
                        <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'ehe text-white' : 'border hover:bg-[tomato] hover:border-[tomato] text-gray-300 hover:text-white hover:no-underline',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                      )
                    ))}
                  </div>
                </div>           
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 z-20">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
               
                  className={`${active === item.name
                    ? "ehea text-white"
                    : "text-white"} block rounded-md px-3 py-2 text-base font-medium `}

                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  </div>

  
  )
}

