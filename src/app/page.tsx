import { Logo } from '@/app/components/common/Logo'
import Image from "next/image";
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
  
  redirect('/main');
}
