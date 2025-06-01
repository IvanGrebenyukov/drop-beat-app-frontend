'use client';

import { useUserStore } from '@/app/lib/stores/userStore'
import { Menu, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { motion } from 'framer-motion';

export const ProfileMenu = () => {
	const { user, logout } = useUserStore();
	
	const displayName = user?.stageName ||
		(user?.email ? user.email.split('@')[0] : 'Пользователь');
	
	return (
		<Menu as="div" className="relative z-50">
			<Menu.Button className="flex items-center gap-2 focus:outline-none">
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<img
						src={user?.avatarUrl || '/default-avatar.png'}
						className="h-8 w-8 rounded-full border-2 border-transparent hover:border-blue-500 transition-all"
						alt="Аватар"
					/>
				</motion.div>
			</Menu.Button>
			
			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1"
			>
				<Menu.Items className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl py-2 divide-y divide-gray-700 border border-gray-700">
					<div className="px-4 py-3">
						<div className="flex items-center gap-3">
							<img
								src={user?.avatarUrl || '/default-avatar.png'}
								className="h-12 w-12 rounded-full border-2 border-blue-500"
								alt="Аватар"
							/>
							<div className="overflow-hidden">
								<p className="text-white font-medium truncate">{displayName}</p>
								<div className="flex items-center mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
	                  user?.role === 'Seller'
		                  ? 'bg-green-900 text-green-300'
		                  : 'bg-blue-900 text-blue-300'
                  }`}>
                    {user?.role === 'Seller' ? 'Продавец' : 'Пользователь'}
                  </span>
								</div>
							</div>
						</div>
						{user?.role === 'Seller' && (
							<div className="mt-3 bg-gray-900 rounded-lg px-3 py-2">
								<p className="text-sm text-gray-400">Баланс</p>
								<p className="text-xl font-bold text-white">{user.balance} ₽</p>
							</div>
						)}
					</div>
					
					<div className="py-2">
						{user?.role === 'User' && (
							<Menu.Item>
								{({ active }) => (
									<Link href="/become-seller">
										<motion.div
											className={`${
												active ? "bg-gray-700" : ""
											} flex items-center justify-between px-4 py-3 text-white rounded-lg mx-2`}
											whileHover={{ x: 5 }}
										>
											<span>Стать продавцом</span>
											<ChevronRightIcon className="w-4 h-4" />
										</motion.div>
									</Link>
								)}
							</Menu.Item>
						)}
						{user?.role === 'Seller' && (
							<Menu.Item>
								{({ active }) => (
									<Link href="/upload-beat">
										<motion.div
											className={`${
												active ? "bg-gray-700" : ""
											} flex items-center justify-between px-4 py-3 text-white rounded-lg mx-2`}
											whileHover={{ x: 5 }}
										>
											<span>Продать бит</span>
											<ChevronRightIcon className="w-4 h-4" />
										</motion.div>
									</Link>
								)}
							</Menu.Item>
						)}
						<Menu.Item>
							{({ active }) => (
								<Link href={`/profile/${user?.id}`}>
									<motion.div
										className={`${
											active ? "bg-gray-700" : ""
										} flex items-center justify-between px-4 py-3 text-white rounded-lg mx-2`}
										whileHover={{ x: 5 }}
									>
										<span>Мой профиль</span>
										<ChevronRightIcon className="w-4 h-4" />
									</motion.div>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link href="/settings/profile">
									<motion.div
										className={`${
											active ? "bg-gray-700" : ""
										} flex items-center justify-between px-4 py-3 text-white rounded-lg mx-2`}
										whileHover={{ x: 5 }}
									>
										<span>Настройки профиля</span>
										<ChevronRightIcon className="w-4 h-4" />
									</motion.div>
								</Link>
							)}
						</Menu.Item>
					</div>
					
					<div className="py-2">
						<Menu.Item>
							{({ active }) => (
								<Link href="/purchases">
									<motion.div
										className={`${
											active ? "bg-gray-700" : ""
										} px-4 py-3 text-white rounded-lg mx-2`}
										whileHover={{ x: 5 }}
									>
										Мои покупки
									</motion.div>
								</Link>
							)}
						</Menu.Item>
						{user?.role === 'Seller' && (
							<Menu.Item>
								{({ active }) => (
									<Link href="/sales">
										<motion.div
											className={`${
												active ? "bg-gray-700" : ""
											} px-4 py-3 text-white rounded-lg mx-2`}
											whileHover={{ x: 5 }}
										>
											Мои продажи
										</motion.div>
									</Link>
								)}
							</Menu.Item>
						)}
						{user?.role === 'Seller' && (
							<Menu.Item>
								{({ active }) => (
									<Link href="/my-beats">
										<motion.div
											className={`${
												active ? "bg-gray-700" : ""
											} px-4 py-3 text-white rounded-lg mx-2`}
											whileHover={{ x: 5 }}
										>
											Мои биты
										</motion.div>
									</Link>
								)}
							</Menu.Item>
						)}
					</div>
					
					<div className="py-2">
						<Menu.Item>
							{({ active }) => (
								<Link href="/help">
									<motion.div
										className={`${
											active ? "bg-gray-700" : ""
										} px-4 py-3 text-white rounded-lg mx-2`}
										whileHover={{ x: 5 }}
									>
										Помощь
									</motion.div>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<motion.button
									onClick={logout}
									className={`${
										active ? "bg-gray-700" : ""
									} w-full text-left px-4 py-3 text-red-500 rounded-lg mx-2 font-medium`}
									whileHover={{ x: 5 }}
								>
									Выйти
								</motion.button>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
};