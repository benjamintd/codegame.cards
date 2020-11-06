import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Languages = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ru: "русский",
  ptbr: "Brasileiro",
};

export default function LanguageSelector() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-block text-left">
        <Menu>
          {({ open }) => (
            <>
              <span className="rounded-md shadow-sm">
                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-600 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                  <span>{Languages[router.locale]}</span>
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      fillRule="evenodd"
                    />
                  </svg>
                </Menu.Button>
              </span>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={open}
              >
                <Menu.Items
                  className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                >
                    {Object.keys(Languages).map((value) => (
                      <Menu.Item
                        as='span'
                        className="flex justify-between w-full text-sm leading-5 text-left text-gray-800"
                        key={value}
                      >
                        {({ active }) => (
                          <Link
                            as={router.asPath}
                            href={router.pathname}
                            locale={value}
                            passHref
                          >
                            <a className={`${
                                active
                                  ? "bg-blue-200 text-blue-900"
                                  : "text-gray-700"
                              } block px-4 py-2 h-full w-full`}
                            >
                              {Languages[value]}
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}
