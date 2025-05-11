'use client';

import { useUserStore } from '@/app/lib/stores/userStore'
import { Menu, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React, { Fragment } from 'react'

export const ProfileMenu = () => {
	const { user, logout } = useUserStore();
	
	return (
		<Menu as={"div"} className={"relative z-50"}>
			<Menu.Button className={"flex items-center gap-2"}>
				<img src={user?.avatarUrl || '/default-avatar.png'}
				className={"h-8 w-8 rounded-full"}
				alt={"Аватар"}/>
			</Menu.Button>
			
			<Transition
			as={Fragment}
			enter={"transition ease-out duration-100"}
			enterFrom={"opacity-0 scale-95"}
			enterTo={"opacity-100 scale-100"}
			leave={"transition ease-in duration-75"}
			leaveFrom={"opacity-100 scale-100"}
			leaveTo={"opacity-0 scale-95"}>
				<Menu.Items className={"absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg py-2 divide-y divide-gray-700"}>
					<div className={"px-4 py-3 border-b border-gray-700"}>
						<div className={"flex items-center gap-3"}>
							<img src={user?.avatarUrl}
							className={"h-10 w-10 rounded-full"}
							alt={"Аватар"} />
							<div>
								<p className={"text-white truncate"}>{user?.stageName || user?.email}</p>
								<p className={"text-gray-400 text-sm"}>{user?.role}</p>
							</div>
						</div>
						{user?.role === 'Seller' && (
							<div className={"mt-2 text-sm text-gray-300"}>
								Баланс: {user.balance} ₽
							</div>
						)}
					</div>
					<div className={"py-2"}>
						{user?.role === 'User' && (
							<Menu.Item>
								{({active}) => (
									<Link href="/become-seller"
									      className={`${active ? "bg-gray-700" : ""} flex items-center justify-between px-4 py-2 text-white`}>
										Стать продавцом
										<ChevronRightIcon className={"w-4 h-4"}/>
									</Link>
								)}
							</Menu.Item>
						)}
						{user?.role === 'Seller' && (
							<Menu.Item>
								{({active}) => (
									<Link href="/upload-beat"
									      className={`${active ? "bg-gray-700" : ""} flex items-center justify-between px-4 py-2 text-white`}>
										Продать бит
										<ChevronRightIcon className={"w-4 h-4"}/>
									</Link>
								)}
							</Menu.Item>
						)}
						<Menu.Item>
							{({active}) => (
								<Link href={`/profile/${user?.id}`}
								      className={`${active ? "bg-gray-700" : ""} flex items-center justify-between px-4 py-2 text-white`}>
									Мой профиль
									<ChevronRightIcon className={"w-4 h-4"}/>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({active}) => (
								<Link href="/settings/profile"
								      className={`${active ? "bg-gray-700" : ""} flex items-center justify-between px-4 py-2 text-white`}>
									Настройки профиля
									<ChevronRightIcon className={"w-4 h-4"}/>
								</Link>
							)}
						</Menu.Item>
					</div>
					<div className={"py-2"}>
						<Menu.Item>
							{({active}) => (
								<Link href="/favorites"
								      className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-white`}>
									Избранное
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link href="/cart" className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-white`}>
									Корзина
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link href="/purchases"
								      className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-white`}>
									Мои покупки
								</Link>
							)}
						</Menu.Item>
						{user?.role === 'Seller' && (
							<>
								<Menu.Item>
									{({active}) => (
										<Link href="/sales"
										      className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-white`}>
											Мои продажи
										</Link>
									)}
								</Menu.Item>
							</>
						)}
						<Menu.Item>
							{({ active }) => (
								<Link href="/messages"
								      className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-white`}>
									Сообщения
								</Link>
							)}
						</Menu.Item>
					</div>
					<div className={"py-2"}>
						<Menu.Item>
							{({ active }) => (
								<Link href="/help"
								      className={`${active ? 'bg-gray-700' : ''} block px-4 py-2 text-white`}>
									Помощь
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<button
									onClick={logout}
									className={`${active ? 'bg-gray-700' : ''} w-full text-left px-4 py-2 text-red-500`}>
									Выйти
								</button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
};