'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession, getProviders } from "next-auth/react"
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react"


const Nav = () => {
    const session = useSession().data;
    const isUserLoggedIn = session?.user;

    const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
    const [toggleDropdown, setToggleDropdown] = useState(false)

    useEffect(() => {
        const setUpProviders = async () => {
            const response: Record<LiteralUnion<any, string>, ClientSafeProvider> | null = await getProviders();

            setProviders(response);
        }

        setUpProviders();
    }, [])

    return (
        <nav className="flex-between w-full mb-16 mt-3 p-5 bg-gray-900 rounded-3xl">
            <Link className="flex gap-2 flex-center" href="/">
                <Image src="/assets/images/logo.svg" alt="logo" width={30} height={30} className="object-container" />
                <p className="font-semibold text-lg tracking-wide"><span className="green_gradient">Quiz</span>Bot</p>
            </Link>

            {/* Desktop Navigation */}
            <div className="sm:flex hidden">
                {
                    isUserLoggedIn ? (
                        <div className="flex gap-3 md:gap-5">
                            <Link href="/create-test" className="green_btn">
                                Create Test
                            </Link>

                            <button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => signOut()} className="outline_btn">
                                Sign Out
                            </button>

                            <Link href="/profile">
                                <Image src={session?.user?.image || '/assets/images/avatar.svg'} width={37} height={37} className="rounded-full" alt="profile" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {
                                providers && Object.values(providers).map((provider: unknown) => {
                                    const p = provider as Record<string, string>;
                                    return (
                                        <button type="button" key={p.name} onClick={() => signIn(p.id)} className="green_btn">
                                            Sign In
                                        </button>
                                    );
                                })
                            }
                        </>
                    )
                }
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex relative">
                {
                    isUserLoggedIn ? (
                        <div className="flex">
                            <Image
                                src={session?.user?.image || '/assets/images/avatar.svg'}
                                width={37}
                                height={37}
                                className="rounded-full"
                                alt="profile"
                                onClick={() => setToggleDropdown((prev) => !prev)}
                            />

                            {
                                toggleDropdown && (
                                    <div className="dropdown">
                                        <Link
                                            href="/profile"
                                            className="dropdown_link"
                                            onClick={() => setToggleDropdown(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/create-test"
                                            className="dropdown_link"
                                            onClick={() => setToggleDropdown(false)}
                                        >
                                            Create Test
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setToggleDropdown(false);
                                                signOut();
                                            }}
                                            className="mt-5 w-full green_btn"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )
                            }

                        </div>
                    ) : (
                        <>
                            {
                                providers && Object.values(providers).map((provider: unknown) => {
                                    const p = provider as Record<string, string>;
                                    return (
                                        <button type="button" key={p.name} onClick={() => signIn(p.id)} className="green_btn">
                                            Sign In
                                        </button>
                                    );
                                })
                            }
                        </>
                    )

                }

            </div>
        </nav >
    )
}

export default Nav